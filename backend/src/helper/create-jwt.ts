import jwt, { SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/secret";
import { UserRole } from "../modules/user/user.type";

// Token payload interface
export interface TokenPayload {
  _id: string;
  email: string;
  role: UserRole;
}

// User data required for token generation
export interface TokenUser {
  _id: { toString(): string } | string;
  email: string;
  role: UserRole;
}

// Generate access token
export const generateAccessToken = (user: TokenUser): string => {
  const payload: TokenPayload = {
    _id: typeof user._id === "string" ? user._id : user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  } as SignOptions);
};

// Generate refresh token
export const generateRefreshToken = (user: TokenUser): string => {
  const payload: TokenPayload = {
    _id: typeof user._id === "string" ? user._id : user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  } as SignOptions);
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.accessSecret) as TokenPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, jwtConfig.refreshSecret) as TokenPayload;
};
