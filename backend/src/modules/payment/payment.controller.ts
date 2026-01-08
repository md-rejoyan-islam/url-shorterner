import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  addCardService,
  confirmCheckoutSessionService,
  confirmPaymentService,
  createCheckoutSessionService,
  createSetupIntentService,
  getAllPaymentsService,
  getPaymentByIdService,
  getPaymentHistoryService,
  getSavedCardsService,
  getStripePublishableKeyService,
  handleStripeWebhookService,
  refundPaymentService,
  removeCardService,
  setDefaultCardService,
} from "./payment.service";
import { PaymentStatus } from "./payment.type";

// Get Stripe publishable key
export const getStripeConfig = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = getStripePublishableKeyService();
    successResponse(res, {
      statusCode: 200,
      message: "Stripe configuration retrieved",
      payload: {
        data: result,
      },
    });
  }
);

// Create checkout session
export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await createCheckoutSessionService(userId, req.body);
    successResponse(res, {
      statusCode: 200,
      message: "Checkout session created",
      payload: {
        data: result,
      },
    });
  }
);

// Confirm payment (Payment Intent flow)
export const confirmPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { paymentIntentId } = req.body;
    const result = await confirmPaymentService(userId, paymentIntentId);
    successResponse(res, {
      statusCode: 200,
      message: result.message,
      payload: {
        data: result,
      },
    });
  }
);

// Confirm checkout session (Stripe Hosted Checkout flow)
export const confirmCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { sessionId } = req.body;
    const result = await confirmCheckoutSessionService(userId, sessionId);
    successResponse(res, {
      statusCode: 200,
      message: result.message,
      payload: {
        data: result,
      },
    });
  }
);

// Get saved cards
export const getSavedCards = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const cards = await getSavedCardsService(userId);
    successResponse(res, {
      statusCode: 200,
      message: "Saved cards retrieved",
      payload: { data: cards },
    });
  }
);

// Create setup intent (for adding cards)
export const createSetupIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await createSetupIntentService(userId);
    successResponse(res, {
      statusCode: 200,
      message: "Setup intent created",
      payload: { data: result },
    });
  }
);

// Add card
export const addCard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const card = await addCardService(userId, req.body);
  successResponse(res, {
    statusCode: 201,
    message: "Card added successfully",
    payload: { data: card },
  });
});

// Remove card
export const removeCard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { paymentMethodId } = req.params;
  const result = await removeCardService(userId, paymentMethodId);
  successResponse(res, {
    statusCode: 200,
    message: result.message,
    payload: {
      data: result,
    },
  });
});

// Set default card
export const setDefaultCard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { paymentMethodId } = req.params;
    const result = await setDefaultCardService(userId, paymentMethodId);
    successResponse(res, {
      statusCode: 200,
      message: result.message,
      payload: { data: result },
    });
  }
);

// Get payment history
export const getPaymentHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const result = await getPaymentHistoryService(
      userId,
      req.query as {
        page?: number;
        limit?: number;
      }
    );
    successResponse(res, {
      statusCode: 200,
      message: "Payment history retrieved",
      payload: { data: result },
    });
  }
);

// Get payment by ID
export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { id } = req.params;
    const payment = await getPaymentByIdService(id, userId);
    successResponse(res, {
      statusCode: 200,
      message: "Payment retrieved",
      payload: { data: payment },
    });
  }
);

// Admin: Get all payments
export const adminGetAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await getAllPaymentsService(
      req.query as {
        page?: number;
        limit?: number;
        status?: PaymentStatus;
        userId?: string;
      }
    );
    successResponse(res, {
      statusCode: 200,
      message: "Payments retrieved",
      payload: { data: result },
    });
  }
);

// Admin: Get payment by ID
export const adminGetPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payment = await getPaymentByIdService(id);
    successResponse(res, {
      statusCode: 200,
      message: "Payment retrieved",
      payload: { data: payment },
    });
  }
);

// Admin: Refund payment
export const adminRefundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await refundPaymentService(id);
    successResponse(res, {
      statusCode: 200,
      message: result.message,
      payload: { data: result },
    });
  }
);

// Stripe webhook handler
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const result = await handleStripeWebhookService(
      signature,
      req.body as Buffer
    );
    successResponse(res, {
      statusCode: 200,
      message: "Webhook received",
      payload: { data: result },
    });
  }
);
