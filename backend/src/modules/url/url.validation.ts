import { z } from "zod";

// Create URL validation
export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z
      .string({ message: "Original URL is required" })
      .url("Invalid URL format"),
    customAlias: z
      .string()
      .min(3, "Custom alias must be at least 3 characters")
      .max(50, "Custom alias must be at most 50 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Custom alias can only contain letters, numbers, hyphens, and underscores"
      )
      .optional(),
    expiresAt: z.string().datetime().optional(),
  }),
});

// Update URL validation
export const updateUrlSchema = z.object({
  params: z.object({
    id: z.string({ message: "URL ID is required" }),
  }),
  body: z.object({
    originalUrl: z.string().url("Invalid URL format").optional(),
    isActive: z.boolean().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
  }),
});

// Get URL by ID validation
export const getUrlByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "URL ID is required" }),
  }),
});

// Get URL by short ID validation
export const getUrlByShortIdSchema = z.object({
  params: z.object({
    shortId: z.string({ message: "Short ID is required" }),
  }),
});

// Delete URL validation
export const deleteUrlSchema = z.object({
  params: z.object({
    id: z.string({ message: "URL ID is required" }),
  }),
});

// Get user URLs query validation
export const getUserUrlsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
    sortBy: z.enum(["createdAt", "clicks", "originalUrl"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Admin: Get all URLs query validation
export const getAllUrlsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
    userId: z.string().optional(),
    isActive: z
      .enum(["true", "false"])
      .transform((val) => val === "true")
      .optional(),
  }),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>["body"];
export type UpdateUrlInput = z.infer<typeof updateUrlSchema>["body"];
