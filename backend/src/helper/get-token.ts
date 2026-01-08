import { Request } from "express";

// Extract access token from cookies first, then fall back to Authorization header
export const getAccessToken = (req: Request): string | undefined => {
  // Check cookies first
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  // Fall back to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return undefined;
};
