import express, { Request, Response } from "express";
import createError from "http-errors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { asyncHandler } from "../helper/async-handler";
import { successResponse } from "../helper/response-handler";
import errorHandler from "../middlewares/error-handler";
import { register } from "../middlewares/matrics-middleware";
import authRouter from "../modules/auth/auth.route";
import clickRouter from "../modules/click/click.route";
import paymentRouter from "../modules/payment/payment.route";
import planRouter from "../modules/plan/plan.route";
import redirectRouter from "../modules/redirect/redirect.route";
import seedRouter from "../modules/seeds/seed.route";
import subscriptionRouter from "../modules/subscription/subscription.route";
import summaryRouter from "../modules/summary/summary.route";
import urlRouter from "../modules/url/url.route";
import userRouter from "../modules/user/user.routes";

const swaggerDocument = YAML.load(
  path.join(__dirname, "../../docs/openapi.yaml")
);

const router = express();

// home route
router.get("/", (_req: Request, _res: Response) => {
  successResponse(_res, {
    message: "Welcome to URL Shortener API",
    statusCode: 200,
  });
});

// health check route
router.get("/health", (_req: Request, _res: Response) => {
  successResponse(_res, {
    message: "Server is up and running",
    statusCode: 200,
  });
});

// metrics route
router.get(
  "/metrics",
  asyncHandler(async (_req, res) => {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  })
);

// swagger documentation route
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// redirect route for short URL
router.use("/", redirectRouter);

// API routes
const routes = [
  {
    path: "auth",
    route: authRouter,
  },
  {
    path: "users",
    route: userRouter,
  },
  {
    path: "plans",
    route: planRouter,
  },
  {
    path: "subscriptions",
    route: subscriptionRouter,
  },
  {
    path: "seeds",
    route: seedRouter,
  },
  {
    path: "urls",
    route: urlRouter,
  },
  {
    path: "clicks",
    route: clickRouter,
  },
  {
    path: "payments",
    route: paymentRouter,
  },
  {
    path: "admin",
    route: summaryRouter,
  },
];

routes.forEach((route) => {
  router.use(`/api/v1/${route.path}`, route.route);
});

// 404 not found route
router.use(
  asyncHandler(async (_req: Request, _res: Response) => {
    throw createError(404, `${_req.originalUrl} not found on this server`);
  })
);

// error handler
router.use(errorHandler);

export default router;
