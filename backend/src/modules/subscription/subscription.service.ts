import createError from "http-errors";
import {
  CachePrefix,
  CacheTTL,
  deleteCacheByPattern,
  generateCacheKey,
  getCache,
  invalidateUserCache,
  setCache,
} from "../../helper/cache";
import Click from "../click/click.model";
import Plan from "../plan/plan.model";
import Url from "../url/url.model";
import User from "../user/user.model";
import Subscription from "./subscription.model";
import {
  ISubscriptionDocument,
  PaymentProvider,
  SubscriptionStatus,
} from "./subscription.type";

// Get user's active subscription with usage stats
export const getActiveSubscriptionService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.SUBSCRIPTION,
    identifier: `user:${userId}:active`,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const subscription = await Subscription.findActiveByUser(userId);

  // Get usage stats (total links and clicks for this user)
  const [linksCount, clicksCount] = await Promise.all([
    Url.countDocuments({ user: userId }),
    Click.countDocuments({ user: userId }),
  ]);

  const usage = {
    links: linksCount,
    clicks: clicksCount,
  };

  // If no subscription, return free plan info with usage
  if (!subscription) {
    const freePlan = await Plan.findDefaultPlan();
    const result = {
      plan: freePlan,
      status: "free",
      usage,
    };
    await setCache(cacheKey, result, CacheTTL.SHORT);
    return result;
  }

  // Convert to object and add usage
  const subscriptionObj = subscription.toObject();
  const result = {
    ...subscriptionObj,
    usage,
  };

  // Store in cache
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Get subscription by ID
export const getSubscriptionByIdService = async (subscriptionId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.SUBSCRIPTION,
    identifier: subscriptionId,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const subscription = await Subscription.findById(subscriptionId)
    .populate("plan")
    .populate("user", "-password");

  if (!subscription) {
    throw createError.NotFound("Subscription not found");
  }

  // Store in cache
  await setCache(cacheKey, subscription, CacheTTL.SHORT);

  return subscription;
};

// Get all subscriptions (admin)
export const getAllSubscriptionsService = async (query: {
  page?: number;
  limit?: number;
  status?: SubscriptionStatus;
  userId?: string;
  planId?: string;
}) => {
  const { page = 1, limit = 10, status, userId, planId } = query;

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.SUBSCRIPTIONS,
    query: { page, limit, status, userId, planId },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: {
    status?: SubscriptionStatus;
    user?: string;
    plan?: string;
  } = {};

  if (status) filter.status = status;
  if (userId) filter.user = userId;
  if (planId) filter.plan = planId;

  const skip = (page - 1) * limit;

  const [subscriptions, total] = await Promise.all([
    Subscription.find(filter)
      .populate("plan")
      .populate("user", "-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Subscription.countDocuments(filter),
  ]);

  const result = {
    subscriptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Store in cache
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Create or upgrade subscription
export const createSubscriptionService = async (
  userId: string,
  data: {
    planId: string;
    billingCycle: "monthly" | "yearly" | "lifetime";
    paymentProvider?: PaymentProvider;
    externalSubscriptionId?: string;
  }
): Promise<ISubscriptionDocument> => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Check if plan exists and is active
  const plan = await Plan.findById(data.planId);
  if (!plan || !plan.isActive) {
    throw createError.NotFound("Plan not found or inactive");
  }

  // Check for existing active subscription
  const existingSubscription = await Subscription.findActiveByUser(userId);

  // Calculate period dates
  const now = new Date();
  let periodEnd: Date;

  switch (data.billingCycle) {
    case "monthly":
      periodEnd = new Date(new Date().setMonth(now.getMonth() + 1));
      break;
    case "yearly":
      periodEnd = new Date(new Date().setFullYear(now.getFullYear() + 1));
      break;
    case "lifetime":
      periodEnd = new Date("2099-12-31");
      break;
  }

  let subscription: ISubscriptionDocument;

  if (existingSubscription) {
    // Upgrade existing subscription instead of creating a new one
    existingSubscription.plan = plan._id;
    existingSubscription.billingCycle = data.billingCycle;
    existingSubscription.currentPeriodStart = new Date();
    existingSubscription.currentPeriodEnd = periodEnd;
    existingSubscription.cancelAtPeriodEnd = false;
    existingSubscription.status = SubscriptionStatus.ACTIVE;

    if (data.paymentProvider) {
      existingSubscription.paymentProvider = data.paymentProvider;
    }
    if (data.externalSubscriptionId) {
      existingSubscription.externalSubscriptionId = data.externalSubscriptionId;
    }

    await existingSubscription.save();
    subscription = existingSubscription;
  } else {
    // Create new subscription
    subscription = await Subscription.create({
      user: userId,
      plan: data.planId,
      status: SubscriptionStatus.ACTIVE,
      billingCycle: data.billingCycle,
      currentPeriodStart: new Date(),
      currentPeriodEnd: periodEnd,
      paymentProvider: data.paymentProvider,
      externalSubscriptionId: data.externalSubscriptionId,
    });
  }

  // Update user's current plan and subscription
  user.currentPlan = plan._id;
  user.subscription = subscription._id;
  await user.save();

  // Invalidate caches
  await invalidateUserCache(userId);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTION}:*`);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTIONS}:*`);

  return subscription.populate("plan");
};

// Update subscription (admin)
export const updateSubscriptionService = async (
  subscriptionId: string,
  updateData: {
    status?: SubscriptionStatus;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  }
) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    throw createError.NotFound("Subscription not found");
  }

  // Update fields
  if (updateData.status) subscription.status = updateData.status;
  if (updateData.currentPeriodEnd) {
    subscription.currentPeriodEnd = new Date(updateData.currentPeriodEnd);
  }
  if (updateData.cancelAtPeriodEnd !== undefined) {
    subscription.cancelAtPeriodEnd = updateData.cancelAtPeriodEnd;
  }

  await subscription.save();

  // Invalidate caches
  await invalidateUserCache(subscription.user.toString());
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTION}:*`);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTIONS}:*`);

  return subscription.populate("plan");
};

// Cancel subscription
export const cancelSubscriptionService = async (
  userId: string,
  immediate: boolean = false
) => {
  const subscription = await Subscription.findOne({
    user: userId,
    status: SubscriptionStatus.ACTIVE,
  });

  if (!subscription) {
    throw createError.NotFound("No active subscription found");
  }

  if (immediate) {
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();

    // Reset user to free plan
    const freePlan = await Plan.findDefaultPlan();
    const user = await User.findById(userId);

    if (user && freePlan) {
      user.currentPlan = freePlan._id;
      user.subscription = undefined;
      await user.save();
    }
  } else {
    subscription.cancelAtPeriodEnd = true;
    subscription.cancelledAt = new Date();
  }

  await subscription.save();

  // Invalidate caches
  await invalidateUserCache(userId);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTION}:*`);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTIONS}:*`);

  return subscription.populate("plan");
};

// Change subscription plan
export const changePlanService = async (
  userId: string,
  newPlanId: string,
  billingCycle: "monthly" | "yearly" | "lifetime"
) => {
  // Check if new plan exists
  const newPlan = await Plan.findById(newPlanId);
  if (!newPlan || !newPlan.isActive) {
    throw createError.NotFound("Plan not found or inactive");
  }

  // Get current subscription
  const subscription = await Subscription.findOne({
    user: userId,
    status: SubscriptionStatus.ACTIVE,
  });

  if (!subscription) {
    // No active subscription, create new one
    return createSubscriptionService(userId, {
      planId: newPlanId,
      billingCycle,
    });
  }

  // Update subscription with new plan
  subscription.plan = newPlan._id;
  subscription.billingCycle = billingCycle;
  subscription.cancelAtPeriodEnd = false;

  // Recalculate period end
  const now = new Date();
  switch (billingCycle) {
    case "monthly":
      subscription.currentPeriodEnd = new Date(
        now.setMonth(now.getMonth() + 1)
      );
      break;
    case "yearly":
      subscription.currentPeriodEnd = new Date(
        now.setFullYear(now.getFullYear() + 1)
      );
      break;
    case "lifetime":
      subscription.currentPeriodEnd = new Date("2099-12-31");
      break;
  }

  await subscription.save();

  // Update user's current plan
  const user = await User.findById(userId);
  if (user) {
    user.currentPlan = newPlan._id;
    await user.save();
  }

  // Invalidate caches
  await invalidateUserCache(userId);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTION}:*`);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTIONS}:*`);

  return subscription.populate("plan");
};

// Get user's subscription history
export const getSubscriptionHistoryService = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [subscriptions, total] = await Promise.all([
    Subscription.find({ user: userId })
      .populate("plan")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Subscription.countDocuments({ user: userId }),
  ]);

  return {
    subscriptions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Check and expire subscriptions (for cron job)
export const expireSubscriptionsService = async () => {
  const expiredSubscriptions = await Subscription.find({
    status: SubscriptionStatus.ACTIVE,
    currentPeriodEnd: { $lt: new Date() },
  });

  const freePlan = await Plan.findDefaultPlan();

  for (const subscription of expiredSubscriptions) {
    if (subscription.cancelAtPeriodEnd) {
      subscription.status = SubscriptionStatus.CANCELLED;
    } else {
      subscription.status = SubscriptionStatus.EXPIRED;
    }

    await subscription.save();

    // Reset user to free plan
    if (freePlan) {
      await User.findByIdAndUpdate(subscription.user, {
        currentPlan: freePlan._id,
        subscription: undefined,
      });

      await invalidateUserCache(subscription.user.toString());
    }
  }

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTION}:*`);
  await deleteCacheByPattern(`${CachePrefix.SUBSCRIPTIONS}:*`);

  return { expired: expiredSubscriptions.length };
};
