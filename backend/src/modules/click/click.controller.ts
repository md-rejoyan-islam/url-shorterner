import { Request, Response } from "express";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import {
  getClicksByUrlService,
  getUrlAnalyticsService,
  getUserAnalyticsService,
} from "./click.service";

// Get user's overall analytics
export const getMyAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { days } = req.query;

    const analytics = await getUserAnalyticsService(
      userId,
      undefined,
      days ? Number(days) : 15
    );

    successResponse(res, {
      statusCode: 200,
      message: "Analytics retrieved successfully",
      payload: { data: analytics },
    });
  }
);

// Get analytics for a specific URL
export const getUrlAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { urlId } = req.params;
    const { days } = req.query;

    const analytics = await getUrlAnalyticsService(
      urlId,
      userId,
      days ? Number(days) : 15
    );

    successResponse(res, {
      statusCode: 200,
      message: "URL analytics retrieved successfully",
      payload: { data: analytics },
    });
  }
);

// Get clicks for a URL
export const getUrlClicks = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id.toString();
    const { urlId } = req.params;
    const { page, limit, startDate, endDate } = req.query;

    const result = await getClicksByUrlService(urlId, userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      startDate: startDate as string,
      endDate: endDate as string,
    });

    successResponse(res, {
      statusCode: 200,
      message: "Clicks retrieved successfully",
      payload: {
        data: result,
      },
    });
  }
);
