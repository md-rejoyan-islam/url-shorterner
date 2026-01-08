import crypto from "crypto";

// Generate a random token (for email verification, password reset, etc.)
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash a token using SHA256
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
