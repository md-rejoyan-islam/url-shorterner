import express from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import { UserRole } from "../user/user.type";
import {
  addCard,
  adminGetAllPayments,
  adminGetPaymentById,
  adminRefundPayment,
  confirmCheckoutSession,
  confirmPayment,
  createCheckoutSession,
  createSetupIntent,
  getPaymentById,
  getPaymentHistory,
  getSavedCards,
  getStripeConfig,
  removeCard,
  setDefaultCard,
} from "./payment.controller";
import {
  addCardSchema,
  adminPaymentsQuerySchema,
  confirmCheckoutSessionSchema,
  confirmPaymentSchema,
  createCheckoutSchema,
  getPaymentByIdSchema,
  paymentHistoryQuerySchema,
  refundPaymentSchema,
  removeCardSchema,
  setDefaultCardSchema,
} from "./payment.validation";

const paymentRouter = express.Router();

// Public route - Get Stripe publishable key
paymentRouter.get("/config", getStripeConfig);

// User routes
paymentRouter.post(
  "/checkout",
  isLoggedIn,
  validate(createCheckoutSchema),
  createCheckoutSession
);

paymentRouter.post(
  "/confirm",
  isLoggedIn,
  validate(confirmPaymentSchema),
  confirmPayment
);

// Confirm checkout session (for Stripe Hosted Checkout)
paymentRouter.post(
  "/confirm-session",
  isLoggedIn,
  validate(confirmCheckoutSessionSchema),
  confirmCheckoutSession
);

// Card management
paymentRouter.get("/cards", isLoggedIn, getSavedCards);

paymentRouter.post("/cards/setup-intent", isLoggedIn, createSetupIntent);

paymentRouter.post("/cards", isLoggedIn, validate(addCardSchema), addCard);

paymentRouter.delete(
  "/cards/:paymentMethodId",
  isLoggedIn,
  validate(removeCardSchema),
  removeCard
);

paymentRouter.patch(
  "/cards/:paymentMethodId/default",
  isLoggedIn,
  validate(setDefaultCardSchema),
  setDefaultCard
);

// Payment history
paymentRouter.get(
  "/history",
  isLoggedIn,
  validate(paymentHistoryQuerySchema),
  getPaymentHistory
);

paymentRouter.get(
  "/:id",
  isLoggedIn,
  validate(getPaymentByIdSchema),
  getPaymentById
);

// Admin routes
paymentRouter.get(
  "/admin/all",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(adminPaymentsQuerySchema),
  adminGetAllPayments
);

paymentRouter.get(
  "/admin/:id",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(getPaymentByIdSchema),
  adminGetPaymentById
);

paymentRouter.post(
  "/admin/:id/refund",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(refundPaymentSchema),
  adminRefundPayment
);

export default paymentRouter;
