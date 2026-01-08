import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/secret";
import userModel from "../modules/user/user.model";
import { errorResponse } from "./response-handler";

export const verifyJwtTokenWithNext = (
  token: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  jwt.verify(token, jwtSecret, async (err: any, decode: any) => {
    if (err) {
      // response send
      return errorResponse(res, {
        statusCode: 400,
        message: "Unauthorized, Invalid access token.Please login again.",
      });
    }

    // find user
    const loginUser = await userModel.findOne({
      email: decode.email,
    });

    // if user not exist
    if (!loginUser) {
      // send response
      return errorResponse(res, {
        statusCode: 400,
        message: "Unauthorized, Please login .",
      });
    }

    req.user = {
      email: loginUser.email,
      _id: loginUser?._id.toString() || "",
      role: loginUser.role,
    };

    next();
  });
};
