import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "./user.services";

// Get all users (admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, role, isActive } = req.query;

  const result = await getAllUsersService({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    role: role as string,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  successResponse(res, {
    statusCode: 200,
    message: "Users retrieved successfully",
    payload: { data: result },
  });
});

// Get single user by ID (admin)
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(id);

  successResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    payload: {
      data: user,
    },
  });
});

// Create user (admin)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    isActive,
    isEmailVerified,
  } = req.body;

  const user = await createUserService({
    firstName,
    lastName,
    email,
    password,
    role,
    isActive,
    isEmailVerified,
  });

  successResponse(res, {
    statusCode: 201,
    message: "User created successfully",
    payload: {
      data: user,
    },
  });
});

// Update user (admin)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    role,
    isActive,
    isEmailVerified,
    avatar,
  } = req.body;

  const user = await updateUserService(id, {
    firstName,
    lastName,
    email,
    role,
    isActive,
    isEmailVerified,
    avatar,
  });

  successResponse(res, {
    statusCode: 200,
    message: "User updated successfully",
    payload: {
      data: user,
    },
  });
});

// Delete user (admin)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteUserService(id);

  successResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});
