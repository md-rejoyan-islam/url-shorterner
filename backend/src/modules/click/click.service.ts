import createError from "http-errors";
import mongoose from "mongoose";
import {
  CachePrefix,
  CacheTTL,
  deleteCacheByPattern,
  generateCacheKey,
  getCache,
  setCache,
} from "../../helper/cache";
import Url from "../url/url.model";
import Click from "./click.model";
import { DeviceType, IAnalytics, ILocation } from "./click.type";

// Record a click
export const recordClickService = async (
  urlId: string,
  data: {
    ipAddress?: string;
    location: ILocation;
    device: {
      type: DeviceType;
      os?: string;
      browser?: string;
    };
    referrer?: string;
  }
) => {
  const url = await Url.findById(urlId);
  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Create click record
  const click = await Click.create({
    url: urlId,
    user: url.user || undefined,
    timestamp: new Date(),
    ipAddress: data.ipAddress,
    location: data.location,
    device: data.device,
    referrer: data.referrer,
  });

  // Increment URL click count
  await Url.findByIdAndUpdate(urlId, { $inc: { clickCount: 1 } });

  // Invalidate caches
  await deleteCacheByPattern(`${CachePrefix.CLICKS}:url:${urlId}:*`);
  await deleteCacheByPattern(`${CachePrefix.ANALYTICS}:*`);

  // Invalidate user's URLs list cache to update click count on frontend
  if (url.user) {
    await deleteCacheByPattern(`${CachePrefix.URLS}:user:${url.user}:*`);
  }

  // Invalidate the specific URL cache (both by ID and short ID)
  await deleteCacheByPattern(`${CachePrefix.URL}:${urlId}*`);
  await deleteCacheByPattern(`${CachePrefix.URL}:short:${url.shortId}*`);

  return click;
};

// Get clicks for a URL
export const getClicksByUrlService = async (
  urlId: string,
  userId: string,
  query: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  const { page = 1, limit = 50, startDate, endDate } = query;

  // Verify URL ownership
  const url = await Url.findById(urlId);
  if (!url) {
    throw createError.NotFound("URL not found");
  }
  if (url.user?.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this URL");
  }

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.CLICKS,
    identifier: `url:${urlId}`,
    query: { page, limit, startDate, endDate },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: {
    url: mongoose.Types.ObjectId;
    timestamp?: { $gte?: Date; $lte?: Date };
  } = { url: new mongoose.Types.ObjectId(urlId) };

  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [clicks, total] = await Promise.all([
    Click.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit),
    Click.countDocuments(filter),
  ]);

  const result = {
    clicks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Store in cache
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Get analytics for user's URLs
export const getUserAnalyticsService = async (
  userId: string,
  urlId?: string,
  days: number = 15
) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.ANALYTICS,
    identifier: `user:${userId}`,
    query: { urlId, days },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  // Today's start time
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Yesterday's time range
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(todayStart);

  // This week and last week for links trend
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);

  // Build URL match filter
  const urlMatch: {
    user: mongoose.Types.ObjectId;
    _id?: mongoose.Types.ObjectId;
  } = {
    user: new mongoose.Types.ObjectId(userId),
  };
  if (urlId) {
    urlMatch._id = new mongoose.Types.ObjectId(urlId);
  }

  const result = await Url.aggregate([
    { $match: urlMatch },
    {
      $lookup: {
        from: "clicks",
        localField: "_id",
        foreignField: "url",
        as: "clicks",
      },
    },
    {
      $facet: {
        totalClicks: [
          { $project: { clickCount: { $size: "$clicks" } } },
          { $group: { _id: null, total: { $sum: "$clickCount" } } },
        ],
        todayClicks: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: true } },
          { $match: { "clicks.timestamp": { $gte: todayStart } } },
          { $count: "count" },
        ],
        yesterdayClicks: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: true } },
          {
            $match: {
              "clicks.timestamp": { $gte: yesterdayStart, $lt: yesterdayEnd },
            },
          },
          { $count: "count" },
        ],
        lastMonthClicks: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: true } },
          { $match: { "clicks.timestamp": { $gte: lastMonth } } },
          { $count: "count" },
        ],
        totalLinks: [{ $count: "count" }],
        linksThisWeek: [
          { $match: { createdAt: { $gte: thisWeekStart } } },
          { $count: "count" },
        ],
        linksLastWeek: [
          { $match: { createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd } } },
          { $count: "count" },
        ],
        activeLinks: [
          { $match: { clickCount: { $gt: 0 } } },
          { $count: "count" },
        ],
        avgClickRate: [
          { $project: { clickCount: { $size: "$clicks" } } },
          { $group: { _id: null, avg: { $avg: "$clickCount" } } },
        ],
        topLink: [
          {
            $project: {
              shortUrl: 1,
              shortId: 1,
              clickCount: { $size: "$clicks" },
            },
          },
          { $sort: { clickCount: -1 } },
          { $limit: 1 },
        ],
        countryStats: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: false } },
          {
            $group: {
              _id: "$clicks.location.country",
              value: { $sum: 1 },
            },
          },
          { $sort: { value: -1 } },
          { $limit: 10 },
          {
            $project: {
              name: { $ifNull: ["$_id", "Unknown"] },
              value: 1,
              _id: 0,
            },
          },
        ],
        deviceStats: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: false } },
          {
            $group: {
              _id: "$clicks.device.type",
              value: { $sum: 1 },
            },
          },
          { $sort: { value: -1 } },
          {
            $project: {
              name: { $ifNull: ["$_id", "unknown"] },
              value: 1,
              _id: 0,
            },
          },
        ],
        browserStats: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: false } },
          {
            $group: {
              _id: "$clicks.device.browser",
              value: { $sum: 1 },
            },
          },
          { $sort: { value: -1 } },
          { $limit: 10 },
          {
            $project: {
              name: { $ifNull: ["$_id", "Unknown"] },
              value: 1,
              _id: 0,
            },
          },
        ],
        recentClicks: [
          { $unwind: { path: "$clicks", preserveNullAndEmptyArrays: false } },
          { $match: { "clicks.timestamp": { $gte: daysAgo } } },
          {
            $project: {
              date: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$clicks.timestamp",
                },
              },
            },
          },
          {
            $group: {
              _id: "$date",
              clicks: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              date: "$_id",
              clicks: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        totalClicks: {
          $ifNull: [{ $arrayElemAt: ["$totalClicks.total", 0] }, 0],
        },
        todayClicks: {
          $ifNull: [{ $arrayElemAt: ["$todayClicks.count", 0] }, 0],
        },
        yesterdayClicks: {
          $ifNull: [{ $arrayElemAt: ["$yesterdayClicks.count", 0] }, 0],
        },
        lastMonthClicks: {
          $ifNull: [{ $arrayElemAt: ["$lastMonthClicks.count", 0] }, 0],
        },
        totalLinks: {
          $ifNull: [{ $arrayElemAt: ["$totalLinks.count", 0] }, 0],
        },
        linksThisWeek: {
          $ifNull: [{ $arrayElemAt: ["$linksThisWeek.count", 0] }, 0],
        },
        linksLastWeek: {
          $ifNull: [{ $arrayElemAt: ["$linksLastWeek.count", 0] }, 0],
        },
        activeLinks: {
          $ifNull: [{ $arrayElemAt: ["$activeLinks.count", 0] }, 0],
        },
        avgClickRate: {
          $ifNull: [{ $arrayElemAt: ["$avgClickRate.avg", 0] }, 0],
        },
        topLink: { $arrayElemAt: ["$topLink", 0] },
        countryStats: "$countryStats",
        deviceStats: "$deviceStats",
        browserStats: "$browserStats",
        recentClicks: "$recentClicks",
      },
    },
  ]).exec();

  const analytics = result[0] || {
    totalClicks: 0,
    todayClicks: 0,
    yesterdayClicks: 0,
    lastMonthClicks: 0,
    totalLinks: 0,
    linksThisWeek: 0,
    linksLastWeek: 0,
    activeLinks: 0,
    avgClickRate: 0,
    topLink: null,
    countryStats: [],
    deviceStats: [],
    browserStats: [],
    recentClicks: [],
  };

  // Fill in missing days for last N days
  const dailyClicks: { date: string; clicks: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const existing = analytics.recentClicks?.find(
      (c: { date: string }) => c.date === dateStr
    );
    dailyClicks.push({
      date: dateStr,
      clicks: existing?.clicks || 0,
    });
  }

  // Calculate percentages
  const activePercentage =
    analytics.totalLinks > 0
      ? (analytics.activeLinks / analytics.totalLinks) * 100
      : 0;

  const percentageChange =
    analytics.lastMonthClicks > 0
      ? ((analytics.totalClicks - analytics.lastMonthClicks) /
          analytics.lastMonthClicks) *
        100
      : 0;

  // Calculate links trend (this week vs last week)
  const linksTrend =
    analytics.linksLastWeek > 0
      ? ((analytics.linksThisWeek - analytics.linksLastWeek) /
          analytics.linksLastWeek) *
        100
      : analytics.linksThisWeek > 0
      ? 100
      : 0;

  // Calculate today's clicks trend (today vs yesterday)
  const todayClicksTrend =
    analytics.yesterdayClicks > 0
      ? ((analytics.todayClicks - analytics.yesterdayClicks) /
          analytics.yesterdayClicks) *
        100
      : analytics.todayClicks > 0
      ? 100
      : 0;

  const finalAnalytics: IAnalytics = {
    totalClicks: analytics.totalClicks,
    todayClicks: analytics.todayClicks,
    yesterdayClicks: analytics.yesterdayClicks,
    lastMonthClicks: analytics.lastMonthClicks,
    totalLinks: analytics.totalLinks,
    linksThisWeek: analytics.linksThisWeek,
    linksLastWeek: analytics.linksLastWeek,
    activeLinks: analytics.activeLinks,
    avgClickRate: Math.round((analytics.avgClickRate || 0) * 100) / 100,
    topLink: analytics.topLink || null,
    countryStats: analytics.countryStats || [],
    deviceStats: analytics.deviceStats || [],
    browserStats: analytics.browserStats || [],
    dailyClicks,
    activePercentage: Math.round(activePercentage * 100) / 100,
    percentageChange: Math.round(percentageChange * 100) / 100,
    linksTrend: Math.round(linksTrend * 100) / 100,
    todayClicksTrend: Math.round(todayClicksTrend * 100) / 100,
  };

  // Store in cache
  await setCache(cacheKey, finalAnalytics, CacheTTL.SHORT);

  return finalAnalytics;
};

// Get analytics for a specific URL
export const getUrlAnalyticsService = async (
  urlId: string,
  userId: string,
  days: number = 15
) => {
  // Verify URL ownership
  const url = await Url.findById(urlId);
  if (!url) {
    throw createError.NotFound("URL not found");
  }
  if (url.user?.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this URL");
  }

  return getUserAnalyticsService(userId, urlId, days);
};
