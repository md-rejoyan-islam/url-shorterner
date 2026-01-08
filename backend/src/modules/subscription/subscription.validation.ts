import { z } from "zod";
import { PaymentProvider, SubscriptionStatus } from "./subscription.type";

// Create subscription validation
export const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string({ message: "Plan ID is required" }),
    billingCycle: z.enum(["monthly", "yearly", "lifetime"], {
      message: "Billing cycle must be monthly, yearly, or lifetime",
    }),
    paymentProvider: z
      .enum([PaymentProvider.STRIPE, PaymentProvider.PAYPAL, PaymentProvider.MANUAL])
      .optional(),
    externalSubscriptionId: z.string().optional(),
  }),
});

// Update subscription validation (admin)
export const updateSubscriptionSchema = z.object({
  body: z.object({
    status: z
      .enum([
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.CANCELLED,
        SubscriptionStatus.EXPIRED,
        SubscriptionStatus.PENDING,
        SubscriptionStatus.PAST_DUE,
      ])
      .optional(),
    currentPeriodEnd: z.string().datetime().optional(),
    cancelAtPeriodEnd: z.boolean().optional(),
  }),
});

// Get all subscriptions query validation (admin)
export const getAllSubscriptionsQuerySchema = z.object({
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
    status: z
      .enum([
        SubscriptionStatus.ACTIVE,
        SubscriptionStatus.CANCELLED,
        SubscriptionStatus.EXPIRED,
        SubscriptionStatus.PENDING,
        SubscriptionStatus.PAST_DUE,
      ])
      .optional(),
    userId: z.string().optional(),
    planId: z.string().optional(),
  }),
});

// Type exports
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>["body"];
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>["body"];
export type GetAllSubscriptionsQuery = z.infer<
  typeof getAllSubscriptionsQuerySchema
>["query"];
