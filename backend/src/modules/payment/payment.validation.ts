import { z } from "zod";

// Create checkout session
export const createCheckoutSchema = z.object({
  body: z.object({
    planId: z.string({ message: "Plan ID is required" }),
    billingCycle: z.enum(["monthly", "yearly", "lifetime"], {
      message: "Billing cycle must be monthly, yearly, or lifetime",
    }),
    paymentMethodId: z.string().optional(),
  }),
});

// Confirm payment (Payment Intent flow)
export const confirmPaymentSchema = z.object({
  body: z.object({
    paymentIntentId: z.string({ message: "Payment intent ID is required" }),
  }),
});

// Confirm checkout session (Stripe Hosted Checkout flow)
export const confirmCheckoutSessionSchema = z.object({
  body: z.object({
    sessionId: z.string({ message: "Session ID is required" }),
  }),
});

// Add card
export const addCardSchema = z.object({
  body: z.object({
    paymentMethodId: z.string({ message: "Payment method ID is required" }),
    setAsDefault: z.boolean().optional(),
  }),
});

// Remove card
export const removeCardSchema = z.object({
  params: z.object({
    paymentMethodId: z.string({ message: "Payment method ID is required" }),
  }),
});

// Set default card
export const setDefaultCardSchema = z.object({
  params: z.object({
    paymentMethodId: z.string({ message: "Payment method ID is required" }),
  }),
});

// Get payment by ID
export const getPaymentByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: "Payment ID is required" }),
  }),
});

// Payment history query
export const paymentHistoryQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

// Admin: Get all payments query
export const adminPaymentsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    status: z
      .enum(["pending", "succeeded", "failed", "refunded", "cancelled"])
      .optional(),
    userId: z.string().optional(),
  }),
});

// Admin: Refund payment
export const refundPaymentSchema = z.object({
  params: z.object({
    id: z.string({ message: "Payment ID is required" }),
  }),
});

// Export types
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>["body"];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>["body"];
export type AddCardInput = z.infer<typeof addCardSchema>["body"];
export type PaymentHistoryQuery = z.infer<
  typeof paymentHistoryQuerySchema
>["query"];
export type AdminPaymentsQuery = z.infer<
  typeof adminPaymentsQuerySchema
>["query"];
