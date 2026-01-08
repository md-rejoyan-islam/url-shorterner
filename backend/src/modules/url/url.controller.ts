import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  adminDeleteUrlService,
  createUrlService,
  deleteUrlService,
  getAllUrlsService,
  getUrlByIdService,
  getUserUrlsService,
  getUserUrlSummaryService,
  updateUrlService,
} from "./url.service";

// Get current user's URLs
export const getMyUrls = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { page, limit, search, isActive, sortBy, sortOrder } = req.query;

  const result = await getUserUrlsService(userId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
    sortBy: sortBy as "createdAt" | "clicks" | "originalUrl" | undefined,
    sortOrder: sortOrder as "asc" | "desc" | undefined,
  });

  successResponse(res, {
    statusCode: 200,
    message: "URLs fetched successfully",
    payload: {
      data: result,
    },
  });
});

// Get current user's URL summary stats
export const getMyUrlSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();

    const summary = await getUserUrlSummaryService(userId);

    successResponse(res, {
      statusCode: 200,
      message: "URL summary fetched successfully",
      payload: { data: summary },
    });
  }
);

// Get URL by ID
export const getUrlById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const url = await getUrlByIdService(id, userId);

  successResponse(res, {
    statusCode: 200,
    message: "URL fetched successfully",
    payload: { data: { url } },
  });
});

// Create short URL
export const createUrl = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id?.toString();
  const { originalUrl, customAlias, expiresAt } = req.body;

  const url = await createUrlService(
    { originalUrl, customAlias, expiresAt },
    userId
  );

  successResponse(res, {
    statusCode: 201,
    message: "Short URL created successfully",
    payload: { data: { url } },
  });
});

// Update URL
export const updateUrl = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;
  const { originalUrl, isActive, expiresAt } = req.body;

  const url = await updateUrlService(
    id,
    { originalUrl, isActive, expiresAt },
    userId
  );

  successResponse(res, {
    statusCode: 200,
    message: "URL updated successfully",
    payload: { data: { url } },
  });
});

// Delete URL
export const deleteUrl = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const { id } = req.params;

  const result = await deleteUrlService(id, userId);

  successResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// Admin: Get all URLs
export const getAllUrls = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, userId, isActive } = req.query;

  const result = await getAllUrlsService({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search as string,
    userId: userId as string,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  successResponse(res, {
    statusCode: 200,
    message: "URLs fetched successfully",
    payload: { data: result },
  });
});

// Admin: Get URL by ID
export const adminGetUrlById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const url = await getUrlByIdService(id);

    successResponse(res, {
      statusCode: 200,
      message: "URL fetched successfully",
      payload: { data: { url } },
    });
  }
);

// Admin: Delete URL
export const adminDeleteUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminDeleteUrlService(id);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);
