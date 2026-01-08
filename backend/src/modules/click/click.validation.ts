import { z } from "zod";

// Get clicks by URL validation
export const getClicksByUrlSchema = z.object({
  params: z.object({
    urlId: z.string({ message: "URL ID is required" }),
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

// Get analytics query validation
export const getAnalyticsQuerySchema = z.object({
  query: z.object({
    urlId: z.string().optional(),
    days: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// Get URL analytics validation
export const getUrlAnalyticsSchema = z.object({
  params: z.object({
    urlId: z.string({ message: "URL ID is required" }),
  }),
  query: z.object({
    days: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
