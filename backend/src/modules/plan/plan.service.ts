import createError from "http-errors";
import {
  CachePrefix,
  CacheTTL,
  deleteCacheByPattern,
  generateCacheKey,
  getCache,
  setCache,
} from "../../helper/cache";
import Subscription from "../subscription/subscription.model";
import { SubscriptionStatus } from "../subscription/subscription.type";
import Plan from "./plan.model";
import { IFeatureItem, IPlanFeatures, PlanType } from "./plan.type";

// Get all plans (public - active only, admin - all)
export const getAllPlansService = async (
  query: {
    page?: number;
    limit?: number;
    type?: PlanType;
    isActive?: boolean;
  },
  isAdmin: boolean = false
) => {
  const { page = 1, limit = 10, type, isActive } = query;

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PLANS,
    query: { page, limit, type, isActive, isAdmin },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: {
    type?: PlanType;
    isActive?: boolean;
  } = {};

  if (type) {
    filter.type = type;
  }

  // Non-admin users can only see active plans
  if (!isAdmin) {
    filter.isActive = true;
  } else if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    Plan.find(filter).skip(skip).limit(limit).sort({ sortOrder: 1 }),
    Plan.countDocuments(filter),
  ]);

  // Get subscription counts for each plan
  const planIds = plans.map((plan) => plan._id);
  const subscriptionCounts = await Subscription.aggregate([
    {
      $match: {
        plan: { $in: planIds },
        status: SubscriptionStatus.ACTIVE,
      },
    },
    {
      $group: {
        _id: "$plan",
        count: { $sum: 1 },
      },
    },
  ]);

  // Create a map of plan ID to subscription count
  const countMap = new Map(
    subscriptionCounts.map((item) => [item._id.toString(), item.count])
  );

  // Add subscription count to each plan
  const plansWithCounts = plans.map((plan) => {
    const planObj = plan.toObject();
    return {
      ...planObj,
      _count: {
        subscriptions: countMap.get(plan._id.toString()) || 0,
      },
    };
  });

  const result = {
    plans: plansWithCounts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Store in cache
  await setCache(cacheKey, result, CacheTTL.MEDIUM);

  return result;
};

// Get single plan by ID
export const getPlanByIdService = async (planId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PLAN,
    identifier: planId,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const plan = await Plan.findById(planId);

  if (!plan) {
    throw createError.NotFound("Plan not found");
  }

  // Store in cache
  await setCache(cacheKey, plan, CacheTTL.MEDIUM);

  return plan;
};

// Get plan by slug
export const getPlanBySlugService = async (slug: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PLAN,
    identifier: `slug:${slug}`,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const plan = await Plan.findOne({ slug, isActive: true });

  if (!plan) {
    throw createError.NotFound("Plan not found");
  }

  // Store in cache
  await setCache(cacheKey, plan, CacheTTL.MEDIUM);

  return plan;
};

// Get default plan
export const getDefaultPlanService = async () => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.PLAN,
    identifier: "default",
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const plan = await Plan.findDefaultPlan();

  if (!plan) {
    throw createError.NotFound("Default plan not found");
  }

  // Store in cache
  await setCache(cacheKey, plan, CacheTTL.LONG);

  return plan;
};

// Create plan (admin - full schema)
export const createPlanService = async (planData: {
  name: string;
  slug: string;
  type: PlanType;
  description: string;
  features: IPlanFeatures;
  featuresList?: IFeatureItem[];
  price: { monthly: number; yearly: number };
  maxLinks?: number;
  maxClicks?: number;
  interval?: "month" | "year";
  isActive?: boolean;
  isDefault?: boolean;
  sortOrder?: number;
}) => {
  // Check if slug is already taken
  const slugExists = await Plan.isSlugTaken(planData.slug);
  if (slugExists) {
    throw createError.Conflict("Plan slug already exists");
  }

  const plan = await Plan.create(planData);

  // Invalidate plans list cache
  await deleteCacheByPattern(`${CachePrefix.PLANS}:*`);

  return plan;
};

// Create plan from admin form (simplified)
export const createAdminPlanService = async (planData: {
  name: string;
  description?: string;
  price: number;
  interval: "month" | "year";
  maxLinks: number;
  maxClicks: number;
  maxDevices?: number;
  isActive: boolean;
  features?: {
    customCodes?: boolean;
    analytics?: boolean;
    apiAccess?: boolean;
    prioritySupport?: boolean;
  };
  featuresList?: IFeatureItem[];
}) => {
  // Generate slug from name
  const slug = planData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check if slug is already taken
  const slugExists = await Plan.isSlugTaken(slug);
  if (slugExists) {
    throw createError.Conflict("A plan with a similar name already exists");
  }

  // Determine plan type based on price
  let type = PlanType.BASIC;
  if (planData.price === 0) {
    type = PlanType.FREE;
  } else if (planData.price >= 50) {
    type = PlanType.ENTERPRISE;
  } else if (planData.price >= 20) {
    type = PlanType.PRO;
  }

  // Map admin form features to full features
  const features: IPlanFeatures = {
    urlLimit: planData.maxLinks,
    customAliasAllowed: planData.features?.customCodes || false,
    analyticsEnabled: planData.features?.analytics || false,
    qrCodeEnabled: planData.features?.analytics || false,
    apiAccessEnabled: planData.features?.apiAccess || false,
    maxDevices: planData.maxDevices ?? 1,
    supportLevel: planData.features?.prioritySupport ? "priority" : "basic",
    // Also store simplified features
    customCodes: planData.features?.customCodes || false,
    analytics: planData.features?.analytics || false,
    apiAccess: planData.features?.apiAccess || false,
    prioritySupport: planData.features?.prioritySupport || false,
  };

  // Calculate yearly price (10 months worth as discount)
  const monthlyPrice =
    planData.interval === "month" ? planData.price : planData.price / 12;
  const yearlyPrice =
    planData.interval === "year" ? planData.price : planData.price * 10;

  const plan = await Plan.create({
    name: planData.name,
    slug,
    type,
    description: planData.description || `${planData.name} plan`,
    features,
    featuresList: planData.featuresList || [],
    price: {
      monthly: monthlyPrice,
      yearly: yearlyPrice,
    },
    maxLinks: planData.maxLinks,
    maxClicks: planData.maxClicks,
    interval: planData.interval,
    isActive: planData.isActive,
    isDefault: false,
    sortOrder: 0,
  });

  // Invalidate plans list cache
  await deleteCacheByPattern(`${CachePrefix.PLANS}:*`);

  return plan;
};

// Update plan (admin)
export const updatePlanService = async (
  planId: string,
  updateData: {
    name?: string;
    slug?: string;
    type?: PlanType;
    description?: string;
    features?: Partial<IPlanFeatures>;
    featuresList?: IFeatureItem[];
    price?: number | { monthly?: number; yearly?: number };
    maxLinks?: number;
    maxClicks?: number;
    maxDevices?: number;
    interval?: "month" | "year";
    isActive?: boolean;
    isDefault?: boolean;
    sortOrder?: number;
  }
) => {
  const plan = await Plan.findById(planId);

  if (!plan) {
    throw createError.NotFound("Plan not found");
  }

  // Check if slug is being changed and if it's already taken
  if (updateData.slug && updateData.slug !== plan.slug) {
    const slugExists = await Plan.isSlugTaken(updateData.slug, planId);
    if (slugExists) {
      throw createError.Conflict("Plan slug already in use");
    }
  }

  // Update fields
  if (updateData.name) plan.name = updateData.name;
  if (updateData.slug) plan.slug = updateData.slug;
  if (updateData.type) plan.type = updateData.type;
  if (updateData.description !== undefined)
    plan.description = updateData.description || plan.description;
  if (updateData.isActive !== undefined) plan.isActive = updateData.isActive;
  if (updateData.isDefault !== undefined) plan.isDefault = updateData.isDefault;
  if (updateData.sortOrder !== undefined) plan.sortOrder = updateData.sortOrder;
  if (updateData.maxLinks !== undefined) plan.maxLinks = updateData.maxLinks;
  if (updateData.maxClicks !== undefined) plan.maxClicks = updateData.maxClicks;
  if (updateData.interval !== undefined) plan.interval = updateData.interval;

  // Update featuresList
  if (updateData.featuresList !== undefined) {
    plan.featuresList = updateData.featuresList;
  }

  // Update nested features including maxDevices
  if (updateData.features) {
    plan.features = { ...plan.features, ...updateData.features };
  }

  // Update maxDevices in features
  if (updateData.maxDevices !== undefined) {
    plan.features = { ...plan.features, maxDevices: updateData.maxDevices };
  }

  // Update price - handle both number (admin form) and object (full schema) formats
  if (updateData.price !== undefined) {
    if (typeof updateData.price === "number") {
      // Admin form: single price value with interval
      const interval = updateData.interval || plan.interval || "month";
      const monthlyPrice =
        interval === "month" ? updateData.price : updateData.price / 12;
      const yearlyPrice =
        interval === "year" ? updateData.price : updateData.price * 10;
      plan.price = { monthly: monthlyPrice, yearly: yearlyPrice };
    } else {
      // Full schema: price object
      plan.price = { ...plan.price, ...updateData.price };
    }
  }

  await plan.save();

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.PLAN}:*`);
  await deleteCacheByPattern(`${CachePrefix.PLANS}:*`);

  return plan;
};

// Delete plan (admin)
export const deletePlanService = async (planId: string) => {
  const plan = await Plan.findById(planId);

  if (!plan) {
    throw createError.NotFound("Plan not found");
  }

  // Check if this is the default plan
  if (plan.isDefault) {
    throw createError.BadRequest("Cannot delete the default plan");
  }

  await Plan.findByIdAndDelete(planId);

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.PLAN}:*`);
  await deleteCacheByPattern(`${CachePrefix.PLANS}:*`);

  return { message: "Plan deleted successfully" };
};

// Seed default plans
export const seedPlansService = async () => {
  const existingPlans = await Plan.countDocuments();
  if (existingPlans > 0) {
    return { message: "Plans already exist", seeded: false };
  }

  const defaultPlans = [
    {
      name: "Free",
      slug: "free",
      type: PlanType.FREE,
      description: "Perfect for getting started with URL shortening",
      features: {
        urlLimit: 100,
        customAliasAllowed: false,
        analyticsEnabled: false,
        qrCodeEnabled: false,
        apiAccessEnabled: false,
        maxDevices: 1,
        supportLevel: "basic" as const,
      },
      price: { monthly: 0, yearly: 0 },
      isActive: true,
      isDefault: true,
      sortOrder: 0,
    },
    {
      name: "Basic",
      slug: "basic",
      type: PlanType.BASIC,
      description: "Great for personal use with more features",
      features: {
        urlLimit: 1000,
        customAliasAllowed: true,
        analyticsEnabled: true,
        qrCodeEnabled: true,
        apiAccessEnabled: false,
        maxDevices: 2,
        supportLevel: "basic" as const,
      },
      price: { monthly: 9.99, yearly: 99.99 },
      isActive: true,
      isDefault: false,
      sortOrder: 1,
    },
    {
      name: "Pro",
      slug: "pro",
      type: PlanType.PRO,
      description: "Best for professionals and small businesses",
      features: {
        urlLimit: 10000,
        customAliasAllowed: true,
        analyticsEnabled: true,
        qrCodeEnabled: true,
        apiAccessEnabled: true,
        maxDevices: 5,
        supportLevel: "priority" as const,
      },
      price: { monthly: 29.99, yearly: 299.99 },
      isActive: true,
      isDefault: false,
      sortOrder: 2,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      type: PlanType.ENTERPRISE,
      description: "Unlimited access for large organizations",
      features: {
        urlLimit: -1,
        customAliasAllowed: true,
        analyticsEnabled: true,
        qrCodeEnabled: true,
        apiAccessEnabled: true,
        maxDevices: -1,
        supportLevel: "dedicated" as const,
      },
      price: { monthly: 99.99, yearly: 999.99 },
      isActive: true,
      isDefault: false,
      sortOrder: 3,
    },
  ];

  await Plan.insertMany(defaultPlans);

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.PLAN}:*`);
  await deleteCacheByPattern(`${CachePrefix.PLANS}:*`);

  return { message: "Plans seeded successfully", seeded: true };
};
