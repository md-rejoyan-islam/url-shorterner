import { NextFunction, Request, Response } from "express";
import createError, { HttpError } from "http-errors";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { asyncHandler } from "../helper/async-handler";
import { verifyAccessToken } from "../helper/create-jwt";
import { getAccessToken } from "../helper/get-token";
import { UserRole } from "../modules/user/user.type";

export const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getAccessToken(req);

    if (!token) {
      throw createError(
        401,
        "Unauthorized, Access token not found. Please login."
      );
    }

    try {
      const decoded = verifyAccessToken(token);

      req.user = {
        _id: decoded._id as string,
        email: decoded.email,
        role: decoded.role as UserRole,
      };

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw createError(
          401,
          "Access token expired. Please refresh your token."
        );
      }
      if (error instanceof JsonWebTokenError) {
        throw createError(401, "Invalid access token. Please login again.");
      }
      throw createError(401, "Unauthorized. Please login again.");
    }
  }
);

export const isLoggedOut = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getAccessToken(req);

    if (token) {
      try {
        verifyAccessToken(token);
        // If token is valid, user is already logged in
        throw createError(400, "You are already logged in");
      } catch (error) {
        // Token is invalid or expired, proceed to login/register
        if (error instanceof HttpError && error.statusCode === 400) {
          throw error;
        }
        next();
      }
    } else {
      next();
    }
  }
);
