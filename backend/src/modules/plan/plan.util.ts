import Plan from "./plan.model";
import User from "../user/user.model";
import Subscription from "../subscription/subscription.model";
import { SubscriptionStatus } from "../subscription/subscription.type";
import { IPlanDocument, IPlanFeatures } from "./plan.type";

// Default free plan features
const DEFAULT_FREE_FEATURES: IPlanFeatures = {
  urlLimit: 100,
  customAliasAllowed: false,
  analyticsEnabled: false,
  qrCodeEnabled: false,
  apiAccessEnabled: false,
  maxDevices: 1,
  supportLevel: "basic",
};

// Get user's current plan features
export const getUserPlanFeatures = async (
  userId: string
): Promise<IPlanFeatures> => {
  const user = await User.findById(userId).populate<{ currentPlan: IPlanDocument }>(
    "currentPlan"
  );

  if (!user || !user.currentPlan) {
    // Return default free plan features
    return DEFAULT_FREE_FEATURES;
  }

  return user.currentPlan.features;
};

// Get plan features by plan ID
export const getPlanFeatures = async (
  planId: string
): Promise<IPlanFeatures | null> => {
  const plan = await Plan.findById(planId);
  return plan?.features || null;
};

// Get default plan features
export const getDefaultPlanFeatures = async (): Promise<IPlanFeatures> => {
  const defaultPlan = await Plan.findDefaultPlan();
  return defaultPlan?.features || DEFAULT_FREE_FEATURES;
};

// Check if user can create URL based on their plan and subscription status
export const canUserCreateUrl = async (userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
}> => {
  const user = await User.findById(userId).populate<{ currentPlan: IPlanDocument }>(
    "currentPlan"
  );

  if (!user) {
    return { allowed: false, reason: "User not found" };
  }

  // Check if user has an active paid subscription
  const subscription = await Subscription.findOne({
    user: userId,
    status: SubscriptionStatus.ACTIVE,
  });

  // If user has a paid subscription, check if it's expired
  if (subscription) {
    const isExpired = new Date() > subscription.currentPeriodEnd;
    if (isExpired) {
      return {
        allowed: false,
        reason: "Your subscription has expired. Please renew to continue creating links.",
      };
    }
  }

  // Get URL limit from user's current plan (defaults to free plan limits)
  const urlLimit = user.currentPlan?.features?.urlLimit ?? DEFAULT_FREE_FEATURES.urlLimit;

  // -1 means unlimited
  if (urlLimit === -1) {
    return { allowed: true, currentCount: user.urlCount, limit: -1 };
  }

  // Check if user has reached their limit
  if (user.urlCount >= urlLimit) {
    return {
      allowed: false,
      reason: "You have reached your URL limit. Please upgrade your plan.",
      currentCount: user.urlCount,
      limit: urlLimit,
    };
  }

  return { allowed: true, currentCount: user.urlCount, limit: urlLimit };
};

// Get user's URL limit
export const getUserUrlLimit = async (userId: string): Promise<number> => {
  const features = await getUserPlanFeatures(userId);
  return features.urlLimit;
};

// Get user's max devices limit
export const getUserMaxDevices = async (userId: string): Promise<number> => {
  const features = await getUserPlanFeatures(userId);
  return features.maxDevices;
};
