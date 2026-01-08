import { z } from "zod";
import { PlanType } from "./plan.type";

// Plan features schema
const planFeaturesSchema = z.object({
  urlLimit: z.number().int().min(-1, "URL limit must be -1 or greater"),
  customAliasAllowed: z.boolean(),
  analyticsEnabled: z.boolean(),
  qrCodeEnabled: z.boolean(),
  apiAccessEnabled: z.boolean(),
  maxDevices: z.number().int().min(1, "Max devices must be at least 1"),
  supportLevel: z.enum(["basic", "priority", "dedicated"]),
  // Admin form features (simplified)
  customCodes: z.boolean().optional(),
  analytics: z.boolean().optional(),
  apiAccess: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
});

// Feature item schema for custom features list
const featureItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Feature text is required"),
  order: z.number(),
});

// Simplified admin form features schema
const adminFeaturesSchema = z.object({
  customCodes: z.boolean().optional(),
  analytics: z.boolean().optional(),
  apiAccess: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
});

// Create plan validation (accepts both full schema and simplified admin form)
export const createPlanSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Plan name is required" })
      .min(2, "Plan name must be at least 2 characters")
      .max(50, "Plan name cannot exceed 50 characters"),
    // Optional fields for full schema
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug cannot exceed 50 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      )
      .optional(),
    type: z
      .enum(
        [PlanType.FREE, PlanType.BASIC, PlanType.PRO, PlanType.ENTERPRISE],
        { message: "Invalid plan type" }
      )
      .optional(),
    description: z.string().optional(),
    // Features can be full schema or simplified admin form
    features: z
      .union([planFeaturesSchema, adminFeaturesSchema])
      .optional(),
    featuresList: z.array(featureItemSchema).optional(),
    // Price can be number (admin form) or object (full schema)
    price: z.union([
      z.number().min(0, "Price must be non-negative"),
      z.object({
        monthly: z.number().min(0, "Monthly price must be non-negative"),
        yearly: z.number().min(0, "Yearly price must be non-negative"),
      }),
    ]),
    maxLinks: z.number().int().min(-1).optional(),
    maxClicks: z.number().int().min(-1).optional(),
    interval: z.enum(["month", "year"]).optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

// Simplified admin form create plan validation (kept for reference)
export const createAdminPlanSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Plan name is required" })
      .min(2, "Plan name must be at least 2 characters")
      .max(50, "Plan name cannot exceed 50 characters"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be 0 or greater"),
    interval: z.enum(["month", "year"]),
    maxLinks: z.number().int().min(-1),
    maxClicks: z.number().int().min(-1),
    isActive: z.boolean(),
    features: adminFeaturesSchema.optional(),
    featuresList: z.array(featureItemSchema).optional(),
  }),
});

// Update plan validation (admin)
export const updatePlanSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Plan name must be at least 2 characters")
      .max(50, "Plan name cannot exceed 50 characters")
      .optional(),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(50, "Slug cannot exceed 50 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      )
      .optional(),
    type: z
      .enum(
        [PlanType.FREE, PlanType.BASIC, PlanType.PRO, PlanType.ENTERPRISE],
        { message: "Invalid plan type" }
      )
      .optional(),
    description: z.string().optional(),
    features: planFeaturesSchema.partial().optional(),
    featuresList: z.array(featureItemSchema).optional(),
    price: z
      .union([
        z.number().min(0, "Price must be non-negative"),
        z.object({
          monthly: z.number().min(0, "Monthly price must be non-negative"),
          yearly: z.number().min(0, "Yearly price must be non-negative"),
        }).partial(),
      ])
      .optional(),
    maxLinks: z.number().int().min(-1).optional(),
    maxClicks: z.number().int().min(-1).optional(),
    interval: z.enum(["month", "year"]).optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  }),
});

// Get all plans query validation
export const getAllPlansQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, "Page must be a positive number"),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine(
        (val) => val > 0 && val <= 100,
        "Limit must be between 1 and 100"
      ),
    type: z
      .enum([PlanType.FREE, PlanType.BASIC, PlanType.PRO, PlanType.ENTERPRISE])
      .optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
      }),
  }),
});

// Type exports
export type CreatePlanInput = z.infer<typeof createPlanSchema>["body"];
export type CreateAdminPlanInput = z.infer<typeof createAdminPlanSchema>["body"];
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>["body"];
export type GetAllPlansQuery = z.infer<typeof getAllPlansQuerySchema>["query"];
export type FeatureItemInput = z.infer<typeof featureItemSchema>;
