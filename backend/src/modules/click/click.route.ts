import express from "express";
import { isLoggedIn } from "../../middlewares/verify";
import validate from "../../middlewares/validate";
import {
  getMyAnalytics,
  getUrlAnalytics,
  getUrlClicks,
} from "./click.controller";
import {
  getAnalyticsQuerySchema,
  getClicksByUrlSchema,
  getUrlAnalyticsSchema,
} from "./click.validation";

const clickRouter = express.Router();

// Get user's overall analytics
clickRouter.get(
  "/analytics",
  isLoggedIn,
  validate(getAnalyticsQuerySchema),
  getMyAnalytics
);

// Get analytics for a specific URL
clickRouter.get(
  "/analytics/:urlId",
  isLoggedIn,
  validate(getUrlAnalyticsSchema),
  getUrlAnalytics
);

// Get clicks for a URL
clickRouter.get(
  "/url/:urlId",
  isLoggedIn,
  validate(getClicksByUrlSchema),
  getUrlClicks
);

export default clickRouter;
