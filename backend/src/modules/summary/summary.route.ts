import express from "express";
import { authorize } from "../../middlewares/authorized";
import { isLoggedIn } from "../../middlewares/verify";
import { UserRole } from "../user/user.type";
import {
  deleteUrl,
  deleteUser,
  getAdminPayments,
  getAdminStats,
  getAdminSubscriptions,
  getAdminUrls,
  getAdminUsers,
  getUserDetails,
  updateUrl,
  updateUser,
} from "./summary.controller";

const summaryRouter = express.Router();

// All routes require authentication and admin privileges
summaryRouter.use(isLoggedIn, authorize([UserRole.ADMIN]));

// Admin stats endpoint
summaryRouter.get("/stats", getAdminStats);

// Admin users endpoints
summaryRouter.get("/users", getAdminUsers);
summaryRouter.get("/users/:id", getUserDetails);
summaryRouter.put("/users/:id", updateUser);
summaryRouter.delete("/users/:id", deleteUser);

// Admin URLs endpoints
summaryRouter.get("/urls", getAdminUrls);
summaryRouter.put("/urls/:id", updateUrl);
summaryRouter.delete("/urls/:id", deleteUrl);

// Admin subscriptions endpoint
summaryRouter.get("/subscriptions", getAdminSubscriptions);

// Admin payments endpoint
summaryRouter.get("/payments", getAdminPayments);

export default summaryRouter;
