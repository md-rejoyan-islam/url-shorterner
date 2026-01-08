import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { logger } from "../helper/logger";
import { UserRole } from "../modules/user/user.type";

export const authorize = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      logger.error({
        message: `Unauthorized access attempt by user: ${
          req.user?.email || "unknown"
        }`,
        status: 403,
        name: "ForbiddenError",
        stack: new Error().stack,
      });

      throw createError.Forbidden(
        "You do not have permission to access this resource"
      );
    }
    next();
  };
};
