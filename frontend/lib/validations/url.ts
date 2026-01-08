import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL"),
  customAlias: z
    .string()
    .min(3, "Custom ID must be at least 3 characters")
    .max(50, "Custom ID must be less than 50 characters")
    .regex(/^[a-zA-Z0-9-_]+$/, "Custom ID can only contain letters, numbers, hyphens, and underscores")
    .optional()
    .or(z.literal("")),
  expiresAt: z.date().optional(),
  isActive: z.boolean(),
});

export const updateUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL"),
  customCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(50, "Short code must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores"
    )
    .optional()
    .or(z.literal("")),
  expiresAt: z.date().optional().nullable(),
  isActive: z.boolean().optional(),
});

export type CreateUrlFormData = z.infer<typeof createUrlSchema>;
export type UpdateUrlFormData = z.infer<typeof updateUrlSchema>;
