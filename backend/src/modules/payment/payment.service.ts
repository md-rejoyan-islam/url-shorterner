import createError from "http-errors";
import Stripe from "stripe";
import { stripe, stripeConfig } from "../../config/stripe";
import {
  CachePrefix,
  CacheTTL,
  deleteCacheByPattern,
  generateCacheKey,
  getCache,
  invalidateUserCache,
  setCache,
} from "../../helper/cache";
import Plan from "../plan/plan.model";
import { BillingCycle, IPlanDocument } from "../plan/plan.type";
import { createSubscriptionService } from "../subscription/subscription.service";
import { PaymentProvider } from "../subscription/subscription.type";
import User from "../user/user.model";
import Payment from "./payment.model";
import {
  IAddCardInput,
  ICheckoutSessionResponse,
  ICreateCheckoutSessionInput,
  ISavedCard,
  PaymentStatus,
} from "./payment.type";

// Get or create Stripe customer
export const getOrCreateStripeCustomerService = async (
  userId: string
): Promise<string> => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Return existing customer ID if exists
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: {
      userId: userId,
    },
  });

  // Save customer ID to user
  user.stripeCustomerId = customer.id;
  await user.save();

  // Invalidate user cache
  await invalidateUserCache(userId);

  return customer.id;
};

// Create checkout session (Stripe Hosted Checkout)
export const createCheckoutSessionService = async (
  userId: string,
  data: ICreateCheckoutSessionInput
): Promise<ICheckoutSessionResponse> => {
  // Get user
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Get plan
  const plan = (await Plan.findById(data.planId)) as IPlanDocument | null;
  if (!plan || !plan.isActive) {
    throw createError.NotFound("Plan not found or inactive");
  }

  // Calculate amount based on billing cycle
  let amount: number;
  switch (data.billingCycle) {
    case BillingCycle.MONTHLY:
      amount = plan.price.monthly;
      break;
    case BillingCycle.YEARLY:
      amount = plan.price.yearly;
      break;
    case BillingCycle.LIFETIME:
      // For lifetime, use yearly * 3 or a custom price
      amount = plan.price.yearly * 3;
      break;
    default:
      throw createError.BadRequest("Invalid billing cycle");
  }

  // Amount in cents for Stripe
  const amountInCents = Math.round(amount * 100);

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomerService(userId);

  // Create Stripe Checkout Session (hosted page - no frontend Stripe SDK needed)
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${plan.name} Plan`,
            description: `${plan.name} - ${data.billingCycle} subscription`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${stripeConfig.frontendUrl}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${stripeConfig.frontendUrl}/dashboard/subscription/upgrade?canceled=true`,
    metadata: {
      userId,
      planId: data.planId,
      billingCycle: data.billingCycle,
    },
  });

  // Create payment record
  await Payment.create({
    user: userId,
    plan: data.planId,
    amount,
    currency: "usd",
    status: PaymentStatus.PENDING,
    stripeSessionId: session.id,
    stripeCustomerId: customerId,
    billingCycle: data.billingCycle,
    description: `${plan.name} - ${data.billingCycle} subscription`,
  });

  return {
    checkoutUrl: session.url!,
    sessionId: session.id,
    amount,
    currency: "usd",
  };
};

// Confirm payment and create subscription (for Payment Intent flow)
export const confirmPaymentService = async (
  userId: string,
  paymentIntentId: string
): Promise<{ success: boolean; message: string }> => {
  // Get payment record
  const payment = await Payment.findByStripePaymentIntent(paymentIntentId);
  if (!payment) {
    throw createError.NotFound("Payment not found");
  }

  // Verify ownership
  if (payment.user.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this payment");
  }

  // Check payment intent status from Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    // Update payment status
    payment.status = PaymentStatus.SUCCEEDED;
    payment.stripePaymentMethodId = paymentIntent.payment_method as
      | string
      | undefined;
    await payment.save();

    // Create subscription
    const subscription = await createSubscriptionService(userId, {
      planId: payment.plan.toString(),
      billingCycle: payment.billingCycle as "monthly" | "yearly" | "lifetime",
      paymentProvider: PaymentProvider.STRIPE,
      externalSubscriptionId: paymentIntentId,
    });

    // Update payment with subscription ID
    payment.subscription = subscription._id;
    await payment.save();

    // Invalidate caches
    await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
    await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
    await invalidateUserCache(userId);

    return {
      success: true,
      message: "Payment successful, subscription activated",
    };
  } else if (paymentIntent.status === "processing") {
    return { success: false, message: "Payment is still processing" };
  } else if (paymentIntent.status === "requires_payment_method") {
    payment.status = PaymentStatus.FAILED;
    payment.failureReason = "Payment method required";
    await payment.save();
    throw createError.BadRequest("Payment requires a payment method");
  } else {
    payment.status = PaymentStatus.FAILED;
    payment.failureReason = `Payment failed: ${paymentIntent.status}`;
    await payment.save();
    throw createError.BadRequest(`Payment failed: ${paymentIntent.status}`);
  }
};

// Confirm checkout session and create subscription (for Stripe Hosted Checkout flow)
export const confirmCheckoutSessionService = async (
  userId: string,
  sessionId: string
): Promise<{ success: boolean; message: string }> => {
  // Get payment record by session ID
  const payment = await Payment.findByStripeSession(sessionId);
  if (!payment) {
    throw createError.NotFound("Payment not found");
  }

  // Verify ownership
  if (payment.user.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this payment");
  }

  // If subscription already created, return success
  if (payment.subscription) {
    return { success: true, message: "Subscription already activated" };
  }

  // Get checkout session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    // Update payment status
    payment.status = PaymentStatus.SUCCEEDED;
    payment.stripePaymentIntentId = session.payment_intent as string;
    await payment.save();

    // Create subscription
    const subscription = await createSubscriptionService(userId, {
      planId: payment.plan.toString(),
      billingCycle: payment.billingCycle as "monthly" | "yearly" | "lifetime",
      paymentProvider: PaymentProvider.STRIPE,
      externalSubscriptionId: sessionId,
    });

    // Update payment with subscription ID
    payment.subscription = subscription._id;
    await payment.save();

    // Invalidate caches
    await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
    await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
    await invalidateUserCache(userId);

    return {
      success: true,
      message: "Payment successful, subscription activated",
    };
  } else if (session.payment_status === "unpaid") {
    return { success: false, message: "Payment not completed yet" };
  } else {
    throw createError.BadRequest(`Payment status: ${session.payment_status}`);
  }
};

// Get saved cards
export const getSavedCardsService = async (
  userId: string
): Promise<ISavedCard[]> => {
  // Check cache
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.CARDS,
    identifier: `user:${userId}`,
  });

  const cached = await getCache<ISavedCard[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  if (!user.stripeCustomerId) {
    return [];
  }

  // Get payment methods from Stripe
  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: "card",
  });

  const cards: ISavedCard[] = (paymentMethods.data || []).map((pm) => ({
    id: pm.id,
    brand: pm.card?.brand || "unknown",
    last4: pm.card?.last4 || "****",
    expMonth: pm.card?.exp_month || 0,
    expYear: pm.card?.exp_year || 0,
    isDefault: pm.id === user.defaultPaymentMethodId,
  }));

  // Cache cards
  await setCache(cacheKey, cards, CacheTTL.SHORT);

  return cards;
};

// Add a new card
export const addCardService = async (
  userId: string,
  data: IAddCardInput
): Promise<ISavedCard> => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomerService(userId);

  // Attach payment method to customer
  const paymentMethod = await stripe.paymentMethods.attach(
    data.paymentMethodId,
    {
      customer: customerId,
    }
  );

  // Set as default if requested or if it's the first card
  const existingCards = await getSavedCardsService(userId);
  if (data.setAsDefault || existingCards.length === 0) {
    user.defaultPaymentMethodId = paymentMethod.id;
    await user.save();

    // Update Stripe customer default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
  }

  // Invalidate cache
  await deleteCacheByPattern(`${CachePrefix.CARDS}:user:${userId}`);
  await invalidateUserCache(userId);

  return {
    id: paymentMethod.id,
    brand: paymentMethod.card?.brand || "unknown",
    last4: paymentMethod.card?.last4 || "****",
    expMonth: paymentMethod.card?.exp_month || 0,
    expYear: paymentMethod.card?.exp_year || 0,
    isDefault: data.setAsDefault || existingCards.length === 0,
  };
};

// Remove a card
export const removeCardService = async (
  userId: string,
  paymentMethodId: string
): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  if (!user.stripeCustomerId) {
    throw createError.BadRequest("No payment methods found");
  }

  // Verify the payment method belongs to this customer
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.customer !== user.stripeCustomerId) {
    throw createError.Forbidden("Payment method does not belong to you");
  }

  // Detach payment method
  await stripe.paymentMethods.detach(paymentMethodId);

  // If this was the default, clear it
  if (user.defaultPaymentMethodId === paymentMethodId) {
    user.defaultPaymentMethodId = undefined;
    await user.save();
  }

  // Invalidate cache
  await deleteCacheByPattern(`${CachePrefix.CARDS}:user:${userId}`);
  await invalidateUserCache(userId);

  return { message: "Card removed successfully" };
};

// Set default card
export const setDefaultCardService = async (
  userId: string,
  paymentMethodId: string
): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  if (!user.stripeCustomerId) {
    throw createError.BadRequest("No payment methods found");
  }

  // Verify the payment method belongs to this customer
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.customer !== user.stripeCustomerId) {
    throw createError.Forbidden("Payment method does not belong to you");
  }

  // Update user
  user.defaultPaymentMethodId = paymentMethodId;
  await user.save();

  // Update Stripe customer
  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Invalidate cache
  await deleteCacheByPattern(`${CachePrefix.CARDS}:user:${userId}`);
  await invalidateUserCache(userId);

  return { message: "Default card updated successfully" };
};

// Get payment history
export const getPaymentHistoryService = async (
  userId: string,
  query: { page?: number; limit?: number }
) => {
  const { page = 1, limit = 10 } = query;

  // Check cache
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PAYMENTS,
    identifier: `user:${userId}`,
    query: { page, limit },
  });

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find({ user: userId })
      .populate("plan")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Payment.countDocuments({ user: userId }),
  ]);

  const result = {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache result
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Get payment by ID
export const getPaymentByIdService = async (
  paymentId: string,
  userId?: string
) => {
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PAYMENT,
    identifier: paymentId,
  });

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const payment = await Payment.findById(paymentId).populate("plan");
  if (!payment) {
    throw createError.NotFound("Payment not found");
  }

  // Verify ownership if userId provided
  if (userId && payment.user.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this payment");
  }

  // Cache result
  await setCache(cacheKey, payment, CacheTTL.SHORT);

  return payment;
};

// Get all payments (admin)
export const getAllPaymentsService = async (query: {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  userId?: string;
}) => {
  const { page = 1, limit = 10, status, userId } = query;

  // Check cache
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PAYMENTS,
    identifier: "admin",
    query: { page, limit, status, userId },
  });

  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: { status?: PaymentStatus; user?: string } = {};
  if (status) filter.status = status;
  if (userId) filter.user = userId;

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("plan")
      .populate("user", "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Payment.countDocuments(filter),
  ]);

  const result = {
    payments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache result
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Refund payment (admin)
export const refundPaymentService = async (
  paymentId: string
): Promise<{ message: string }> => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw createError.NotFound("Payment not found");
  }

  if (payment.status !== PaymentStatus.SUCCEEDED) {
    throw createError.BadRequest("Only succeeded payments can be refunded");
  }

  if (!payment.stripePaymentIntentId) {
    throw createError.BadRequest("No Stripe payment intent found");
  }

  // Create refund in Stripe
  await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId,
  });

  // Update payment status
  payment.status = PaymentStatus.REFUNDED;
  payment.refundedAt = new Date();
  await payment.save();

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
  await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);

  return { message: "Payment refunded successfully" };
};

// Get Stripe publishable key (for frontend)
export const getStripePublishableKeyService = () => {
  return { publishableKey: stripeConfig.publishableKey };
};

// Create setup intent (for adding cards without immediate payment)
export const createSetupIntentService = async (
  userId: string
): Promise<{ clientSecret: string }> => {
  const customerId = await getOrCreateStripeCustomerService(userId);

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  });

  return { clientSecret: setupIntent.client_secret! };
};

// Handle Stripe webhook
export const handleStripeWebhookService = async (
  signature: string,
  payload: Buffer
): Promise<{ received: boolean }> => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (err) {
    throw createError.BadRequest(`Webhook signature verification failed`);
  }

  // Handle specific events
  switch (event.type) {
    // Handle Stripe Checkout Session completed (for hosted checkout)
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const payment = await Payment.findByStripeSession(session.id);

      if (payment && payment.status === PaymentStatus.PENDING) {
        payment.status = PaymentStatus.SUCCEEDED;
        payment.stripePaymentIntentId = session.payment_intent as string;
        await payment.save();

        // Create subscription if not already created
        if (!payment.subscription) {
          const { userId, planId, billingCycle } = session.metadata || {};
          if (userId && planId && billingCycle) {
            const subscription = await createSubscriptionService(userId, {
              planId,
              billingCycle: billingCycle as "monthly" | "yearly" | "lifetime",
              paymentProvider: PaymentProvider.STRIPE,
              externalSubscriptionId: session.id,
            });
            payment.subscription = subscription._id;
            await payment.save();
          }
        }

        // Invalidate caches
        await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
        await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
        await invalidateUserCache(payment.user.toString());
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findByStripePaymentIntent(paymentIntent.id);

      if (payment && payment.status === PaymentStatus.PENDING) {
        payment.status = PaymentStatus.SUCCEEDED;
        payment.stripePaymentMethodId = paymentIntent.payment_method as
          | string
          | undefined;
        await payment.save();

        // Create subscription if not already created
        if (!payment.subscription) {
          const subscription = await createSubscriptionService(
            payment.user.toString(),
            {
              planId: payment.plan.toString(),
              billingCycle: payment.billingCycle as
                | "monthly"
                | "yearly"
                | "lifetime",
              paymentProvider: PaymentProvider.STRIPE,
              externalSubscriptionId: paymentIntent.id,
            }
          );
          payment.subscription = subscription._id;
          await payment.save();
        }

        // Invalidate caches
        await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
        await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
        await invalidateUserCache(payment.user.toString());
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findByStripePaymentIntent(paymentIntent.id);

      if (payment) {
        payment.status = PaymentStatus.FAILED;
        payment.failureReason =
          paymentIntent.last_payment_error?.message || "Payment failed";
        await payment.save();

        // Invalidate caches
        await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
        await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      if (charge.payment_intent) {
        const payment = await Payment.findByStripePaymentIntent(
          charge.payment_intent as string
        );

        if (payment && payment.status !== PaymentStatus.REFUNDED) {
          payment.status = PaymentStatus.REFUNDED;
          payment.refundedAt = new Date();
          await payment.save();

          // Invalidate caches
          await deleteCacheByPattern(`${CachePrefix.PAYMENT}:*`);
          await deleteCacheByPattern(`${CachePrefix.PAYMENTS}:*`);
        }
      }
      break;
    }
  }

  return { received: true };
};
