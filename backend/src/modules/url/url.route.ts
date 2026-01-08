import express from "express";
import { authorize } from "../../middlewares/authorized";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import { UserRole } from "../user/user.type";
import {
  adminDeleteUrl,
  adminGetUrlById,
  createUrl,
  deleteUrl,
  getAllUrls,
  getMyUrls,
  getMyUrlSummary,
  getUrlById,
  updateUrl,
} from "./url.controller";
import {
  createUrlSchema,
  deleteUrlSchema,
  getAllUrlsQuerySchema,
  getUrlByIdSchema,
  getUserUrlsQuerySchema,
  updateUrlSchema,
} from "./url.validation";

const urlRouter = express.Router();

// User routes
urlRouter.get("/", isLoggedIn, validate(getUserUrlsQuerySchema), getMyUrls);

urlRouter.get("/summary", isLoggedIn, getMyUrlSummary);

urlRouter.get("/:id", isLoggedIn, validate(getUrlByIdSchema), getUrlById);

urlRouter.post("/", isLoggedIn, validate(createUrlSchema), createUrl);

urlRouter.patch("/:id", isLoggedIn, validate(updateUrlSchema), updateUrl);

urlRouter.delete("/:id", isLoggedIn, validate(deleteUrlSchema), deleteUrl);

// Admin routes
urlRouter.get(
  "/admin/all",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(getAllUrlsQuerySchema),
  getAllUrls
);

urlRouter.get(
  "/admin/:id",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(getUrlByIdSchema),
  adminGetUrlById
);

urlRouter.delete(
  "/admin/:id",
  isLoggedIn,
  authorize([UserRole.ADMIN]),
  validate(deleteUrlSchema),
  adminDeleteUrl
);

export default urlRouter;
