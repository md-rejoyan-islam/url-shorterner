import express from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import { UserRole } from "../user/user.type";
import {
  cancelSubscription,
  changePlan,
  expireSubscriptions,
  getAllSubscriptions,
  getMySubscription,
  getMySubscriptionHistory,
  getSubscriptionById,
  subscribe,
  updateSubscription,
} from "./subscription.controller";
import {
  createSubscriptionSchema,
  getAllSubscriptionsQuerySchema,
  updateSubscriptionSchema,
} from "./subscription.validation";

const subscriptionRouter = express.Router();

// Protected routes - require login
subscriptionRouter.use(isLoggedIn);

// User routes
subscriptionRouter.get("/me", getMySubscription);
subscriptionRouter.get("/me/history", getMySubscriptionHistory);
subscriptionRouter.post("/", validate(createSubscriptionSchema), subscribe);
subscriptionRouter.post("/cancel", cancelSubscription);
subscriptionRouter.post("/change-plan", validate(createSubscriptionSchema), changePlan);

// Admin routes
subscriptionRouter.use(authorize([UserRole.ADMIN]));

subscriptionRouter.get(
  "/admin",
  validate(getAllSubscriptionsQuerySchema),
  getAllSubscriptions
);
subscriptionRouter.get("/:id", getSubscriptionById);
subscriptionRouter.put("/:id", validate(updateSubscriptionSchema), updateSubscription);
subscriptionRouter.post("/expire-check", expireSubscriptions);

export default subscriptionRouter;
