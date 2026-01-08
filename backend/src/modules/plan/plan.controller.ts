import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  createAdminPlanService,
  createPlanService,
  deletePlanService,
  getAllPlansService,
  getDefaultPlanService,
  getPlanByIdService,
  getPlanBySlugService,
  seedPlansService,
  updatePlanService,
} from "./plan.service";
import { PlanType } from "./plan.type";

// Get all plans (public - active only)
export const getAllPlans = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, type } = req.query;

  const result = await getAllPlansService(
    {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      type: type as PlanType,
    },
    false
  );

  successResponse(res, {
    statusCode: 200,
    message: "Plans retrieved successfully",
    payload: { data: result },
  });
});

// Get all plans (admin - includes inactive)
export const getAllPlansAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, type, isActive } = req.query;

    const result = await getAllPlansService(
      {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        type: type as PlanType,
        isActive:
          isActive === "true" ? true : isActive === "false" ? false : undefined,
      },
      true
    );

    successResponse(res, {
      statusCode: 200,
      message: "Plans retrieved successfully",
      payload: { data: result },
    });
  }
);

// Get single plan by ID
export const getPlanById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const plan = await getPlanByIdService(id);

  successResponse(res, {
    statusCode: 200,
    message: "Plan retrieved successfully",
    payload: { data: plan },
  });
});

// Get plan by slug
export const getPlanBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const plan = await getPlanBySlugService(slug);

    successResponse(res, {
      statusCode: 200,
      message: "Plan retrieved successfully",
      payload: { data: plan },
    });
  }
);

// Get default plan
export const getDefaultPlan = asyncHandler(
  async (_req: Request, res: Response) => {
    const plan = await getDefaultPlanService();

    successResponse(res, {
      statusCode: 200,
      message: "Default plan retrieved successfully",
      payload: { data: plan },
    });
  }
);

// Create plan (admin - handles both full schema and simplified admin form)
export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    slug,
    type,
    description,
    features,
    featuresList,
    price,
    maxLinks,
    maxClicks,
    interval,
    isActive,
    isDefault,
    sortOrder,
  } = req.body;

  let plan;

  // Check if this is the simplified admin form (no slug, price is number, has interval)
  if (!slug && typeof price === "number" && interval) {
    plan = await createAdminPlanService({
      name,
      description,
      price,
      interval,
      maxLinks,
      maxClicks,
      isActive,
      features,
      featuresList,
    });
  } else {
    // Full schema
    plan = await createPlanService({
      name,
      slug,
      type,
      description,
      features,
      featuresList,
      price,
      maxLinks,
      maxClicks,
      interval,
      isActive,
      isDefault,
      sortOrder,
    });
  }

  successResponse(res, {
    statusCode: 201,
    message: "Plan created successfully",
    payload: { data: plan },
  });
});

// Update plan (admin)
export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    slug,
    type,
    description,
    features,
    featuresList,
    price,
    maxLinks,
    maxClicks,
    interval,
    isActive,
    isDefault,
    sortOrder,
  } = req.body;

  const plan = await updatePlanService(id, {
    name,
    slug,
    type,
    description,
    features,
    featuresList,
    price,
    maxLinks,
    maxClicks,
    interval,
    isActive,
    isDefault,
    sortOrder,
  });

  successResponse(res, {
    statusCode: 200,
    message: "Plan updated successfully",
    payload: { data: plan },
  });
});

// Delete plan (admin)
export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deletePlanService(id);

  successResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// Seed plans (admin)
export const seedPlans = asyncHandler(async (_req: Request, res: Response) => {
  const result = await seedPlansService();

  successResponse(res, {
    statusCode: 200,
    message: result.message,
    payload: { seeded: result.seeded },
  });
});
