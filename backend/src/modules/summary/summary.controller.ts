import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  deleteUrlService,
  deleteUserService,
  getAdminPaymentsService,
  getAdminStatsService,
  getAdminSubscriptionsService,
  getAdminUrlsService,
  getAdminUsersService,
  getUserDetailsService,
  updateUrlService,
  updateUserService,
} from "./summary.service";

// Get admin dashboard stats
export const getAdminStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getAdminStatsService();

    successResponse(res, {
      statusCode: 200,
      message: "Admin stats retrieved successfully",
      payload: { data: stats },
    });
  }
);

// Get admin users
export const getAdminUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, role, isActive } = req.query;

    const result = await getAdminUsersService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      role: role as string,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Admin users retrieved successfully",
      payload: { data: result },
    });
  }
);

// Get single user details (admin)
export const getUserDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await getUserDetailsService(id);

    successResponse(res, {
      statusCode: 200,
      message: "User details retrieved successfully",
      payload: { data: result },
    });
  }
);

// Update user (admin)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const user = await updateUserService(id, updateData);

  successResponse(res, {
    statusCode: 200,
    message: "User updated successfully",
    payload: { data: user },
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

// Get admin URLs
export const getAdminUrls = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, isActive } = req.query;

    const result = await getAdminUrlsService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Admin URLs retrieved successfully",
      payload: { data: result },
    });
  }
);

// Update URL (admin)
export const updateUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const url = await updateUrlService(id, updateData);

  successResponse(res, {
    statusCode: 200,
    message: "URL updated successfully",
    payload: { data: url },
  });
});

// Delete URL (admin)
export const deleteUrl = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteUrlService(id);

  successResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// Get admin subscriptions
export const getAdminSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, status } = req.query;

    const result = await getAdminSubscriptionsService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      status: status as string,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Admin subscriptions retrieved successfully",
      payload: { data: result },
    });
  }
);

// Get admin payments
export const getAdminPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit, search, status } = req.query;

    const result = await getAdminPaymentsService({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search as string,
      status: status as string,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Admin payments retrieved successfully",
      payload: { data: result },
    });
  }
);
