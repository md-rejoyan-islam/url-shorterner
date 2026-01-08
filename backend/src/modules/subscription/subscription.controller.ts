import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  cancelSubscriptionService,
  changePlanService,
  createSubscriptionService,
  expireSubscriptionsService,
  getActiveSubscriptionService,
  getAllSubscriptionsService,
  getSubscriptionByIdService,
  getSubscriptionHistoryService,
  updateSubscriptionService,
} from "./subscription.service";
import { SubscriptionStatus } from "./subscription.type";

// Get current user's active subscription
export const getMySubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const subscription = await getActiveSubscriptionService(userId);

    successResponse(res, {
      statusCode: 200,
      message: subscription
        ? "Subscription retrieved successfully"
        : "No active subscription",
      payload: { data: subscription },
    });
  }
);

// Get subscription history for current user
export const getMySubscriptionHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { page, limit } = req.query;

    const result = await getSubscriptionHistoryService(
      userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );

    successResponse(res, {
      statusCode: 200,
      message: "Subscription history retrieved successfully",
      payload: { data: result },
    });
  }
);

// Subscribe to a plan
export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { planId, billingCycle, paymentProvider, externalSubscriptionId } =
    req.body;

  const subscription = await createSubscriptionService(userId, {
    planId,
    billingCycle,
    paymentProvider,
    externalSubscriptionId,
  });

  successResponse(res, {
    statusCode: 201,
    message: "Subscription created successfully",
    payload: { data: subscription },
  });
});

// Cancel subscription
export const cancelSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { immediate } = req.query;

    const subscription = await cancelSubscriptionService(
      userId,
      immediate === "true"
    );

    successResponse(res, {
      statusCode: 200,
      message:
        immediate === "true"
          ? "Subscription cancelled immediately"
          : "Subscription will be cancelled at the end of the billing period",
      payload: { data: subscription },
    });
  }
);

// Change plan
export const changePlan = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const { planId, billingCycle } = req.body;

  const subscription = await changePlanService(userId, planId, billingCycle);

  successResponse(res, {
    statusCode: 200,
    message: "Plan changed successfully",
    payload: { data: subscription },
  });
});

// Admin: Get all subscriptions
export const getAllSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, status, userId, planId } = req.query;

    const result = await getAllSubscriptionsService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status: status as SubscriptionStatus,
      userId: userId as string,
      planId: planId as string,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Subscriptions retrieved successfully",
      payload: { data: result },
    });
  }
);

// Admin: Get subscription by ID
export const getSubscriptionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const subscription = await getSubscriptionByIdService(id);

    successResponse(res, {
      statusCode: 200,
      message: "Subscription retrieved successfully",
      payload: { data: subscription },
    });
  }
);

// Admin: Update subscription
export const updateSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, currentPeriodEnd, cancelAtPeriodEnd } = req.body;

    const subscription = await updateSubscriptionService(id, {
      status,
      currentPeriodEnd,
      cancelAtPeriodEnd,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Subscription updated successfully",
      payload: { data: subscription },
    });
  }
);

// Admin: Expire subscriptions (cron job endpoint)
export const expireSubscriptions = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await expireSubscriptionsService();

    successResponse(res, {
      statusCode: 200,
      message: `Expired ${result.expired} subscriptions`,
      payload: { data: result },
    });
  }
);
