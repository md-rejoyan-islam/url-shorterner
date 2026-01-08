import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import morgan, { StreamOptions } from "morgan";
import path from "path";
import corsOptions from "../config/cors-options";
import limiter from "../config/rate-limiter";
import { nodeEnv } from "../config/secret";
import { logger } from "../helper/logger";
import { metricsMiddleware } from "../middlewares/matrics-middleware";
import webhookRouter from "../modules/payment/webhook.route";
import router from "./routes";

const app: Application = express();

// Morgan stream to Winston logger
const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

// CORS
app.use(cors(corsOptions));

// Morgan - log all requests in development
if (nodeEnv === "development") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream,
    })
  );
}

// Stripe webhook
app.use(
  "/api/v1/webhook",
  express.raw({ type: "application/json" }),
  webhookRouter
);

// express json and urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Metrics middleware
app.use(metricsMiddleware);

// Rate limiter
app.use("/api", limiter);

// Serve static files
app.use("/public", express.static(path.join(process.cwd(), "/src/public/")));

// Routes
app.use(router);

// exporting the app
export default app;
