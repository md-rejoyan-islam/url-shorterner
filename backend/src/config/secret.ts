import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  MONGO_URI,
  CORS_WHITELIST,
  SERVER_URL,
  JWT_SECRET,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  NODE_ENV,
  JWT_EXPIRES_IN,
  CLIENT_URL,
  QR_GENERATOR_URL,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  MAX_REQUESTS,
  MAX_REQUESTS_WINDOW,
  EMAIL_FROM,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;

export const port: number = +PORT!;
export const mongoUri: string = MONGO_URI || "";
export const corsWhitelist: string[] = CORS_WHITELIST!.split(",");
export const jwtSecret: string = JWT_SECRET!;
export const nodeEnv: string = NODE_ENV!;
export const serverUrl: string = SERVER_URL!;
export const jwtExpiresIn: number = +JWT_EXPIRES_IN!;
export const clientUrl: string = CLIENT_URL!;
export const qrGeneratorUrl: string = QR_GENERATOR_URL!;
export const passwordResetTokenExpiration: number = 600; // 10 minutes
export const max_requests: number = +MAX_REQUESTS!;
export const max_requests_window: number = +MAX_REQUESTS_WINDOW!;
export const nodeMailer = {
  emailHost: EMAIL_HOST!,
  emailPort: +EMAIL_PORT!,
  emailUsername: EMAIL_USERNAME!,
  emailPassword: EMAIL_PASSWORD!,
  emailFrom: EMAIL_FROM!,
};

export const redis_url: string = process.env.REDIS_URL || "";

export const emailVerificationTokenExpiration: number = 86400; // 24 hours

// JWT Configuration for Access and Refresh Tokens
export const jwtConfig = {
  accessSecret: JWT_ACCESS_SECRET || JWT_SECRET!,
  accessExpiresIn: JWT_ACCESS_EXPIRES_IN || "15m",
  refreshSecret: JWT_REFRESH_SECRET || JWT_SECRET! + "_refresh",
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN || "7d",
};

// Stripe Configuration
export const stripeConfig = {
  secretKey: STRIPE_SECRET_KEY!,
  publishableKey: STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: STRIPE_WEBHOOK_SECRET!,
  frontendUrl: CLIENT_URL!,
};
