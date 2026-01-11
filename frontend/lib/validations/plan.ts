import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  type: z.enum(["free", "basic", "pro", "enterprise"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  features: z.object({
    urlLimit: z.number().min(-1),
    customAliasAllowed: z.boolean(),
    analyticsEnabled: z.boolean(),
    qrCodeEnabled: z.boolean(),
    apiAccessEnabled: z.boolean(),
    maxDevices: z.number().min(-1),
    supportLevel: z.enum(["basic", "priority", "dedicated"]),
  }),
  price: z.object({
    monthly: z.number().min(0),
    yearly: z.number().min(0),
  }),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updatePlanSchema = createPlanSchema.partial();

export type CreatePlanFormData = z.infer<typeof createPlanSchema>;
export type UpdatePlanFormData = z.infer<typeof updatePlanSchema>;

// Feature item schema
export const featureItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Feature text is required"),
  order: z.number(),
});

// Plan schema for admin form
export const planSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  interval: z.enum(["month", "year"]),
  maxLinks: z.number().min(-1),
  maxClicks: z.number().min(-1),
  isActive: z.boolean(),
  features: z.object({
    customCodes: z.boolean(),
    analytics: z.boolean(),
    apiAccess: z.boolean(),
    prioritySupport: z.boolean(),
  }),
  featuresList: z.array(featureItemSchema).optional(),
});

export type FeatureItem = z.infer<typeof featureItemSchema>;
export type PlanFormData = z.infer<typeof planSchema>;
