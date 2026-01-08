import createError from "http-errors";
import mongoose from "mongoose";
import { clientUrl } from "../../config/secret";
import {
  CachePrefix,
  CacheTTL,
  deleteCache,
  deleteCacheByPattern,
  generateCacheKey,
  getCache,
  setCache,
} from "../../helper/cache";
import generateRandomId from "../../helper/random-id";
import { canUserCreateUrl } from "../plan/plan.util";
import {
  decrementUrlCountService,
  incrementUrlCountService,
} from "../user/user.services";
import Url from "./url.model";
import { IUrl } from "./url.type";
import { CreateUrlInput, UpdateUrlInput } from "./url.validation";

// Get user's URLs
export const getUserUrlsService = async (
  userId: string,
  query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: "createdAt" | "clicks" | "originalUrl";
    sortOrder?: "asc" | "desc";
  }
) => {
  const {
    page = 1,
    limit = 10,
    search,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.URLS,
    identifier: `user:${userId}`,
    query: { page, limit, search, isActive, sortBy, sortOrder },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: {
    user: string;
    $or?: Array<
      | { originalUrl?: { $regex: string; $options: string } }
      | { shortId?: { $regex: string; $options: string } }
    >;
    isActive?: boolean;
  } = { user: userId };

  if (search) {
    filter.$or = [
      { originalUrl: { $regex: search, $options: "i" } },
      { shortId: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  // Build sort object
  const sortField = sortBy === "clicks" ? "clickCount" : sortBy;
  const sortObj: Record<string, 1 | -1> = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
  };

  const [urls, total] = await Promise.all([
    Url.find(filter).sort(sortObj).skip(skip).limit(limit),
    Url.countDocuments(filter),
  ]);

  const result = {
    urls,
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

// Get URL by ID
export const getUrlByIdService = async (urlId: string, userId?: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: urlId,
  });

  // Check cache first
  const cached = await getCache<{ user?: { toString(): string } }>(cacheKey);
  if (cached) {
    // Verify ownership if userId provided
    if (userId && cached.user?.toString() !== userId) {
      throw createError.Forbidden("You don't have access to this URL");
    }
    return cached;
  }

  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Verify ownership if userId provided
  if (userId && url.user?.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this URL");
  }

  // Store in cache
  await setCache(cacheKey, url, CacheTTL.MEDIUM);

  return url;
};

// Get URL by short ID
export const getUrlByShortIdService = async (shortId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: `short:${shortId}`,
  });

  // Check cache first
  const cached = await getCache<IUrl>(cacheKey);
  if (cached) {
    // Always validate cached data against database for isActive status
    // This ensures deactivated URLs return 404 even if cache wasn't properly invalidated
    if (!cached.isActive) {
      await deleteCache(cacheKey);
      throw createError.NotFound("URL not found");
    }
    // Check if expired
    if (cached.expiresAt && new Date() > new Date(cached.expiresAt)) {
      await deleteCache(cacheKey);
      throw createError.Gone("This URL has expired");
    }
    return cached;
  }

  // No cache - fetch from database
  const url = await Url.findOne({ shortId });

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Check if active
  if (!url.isActive) {
    throw createError.NotFound("URL not found");
  }

  // Check if expired
  if (url.expiresAt && new Date() > url.expiresAt) {
    throw createError.Gone("This URL has expired");
  }

  // Store in cache (only cache active URLs)
  await setCache(cacheKey, url, CacheTTL.MEDIUM);

  return url;
};

// Create short URL
export const createUrlService = async (
  data: CreateUrlInput,
  userId?: string
) => {
  // Check if user can create URL (plan limit and subscription status)
  if (userId) {
    const canCreateResult = await canUserCreateUrl(userId);
    if (!canCreateResult.allowed) {
      throw createError.Forbidden(
        canCreateResult.reason || "You cannot create more URLs."
      );
    }
  }

  // Check if custom alias is already taken
  if (data.customAlias) {
    const existingUrl = await Url.findOne({ shortId: data.customAlias });
    if (existingUrl) {
      throw createError.Conflict("This custom alias is already taken");
    }
  }

  // Generate short ID
  const shortId = data.customAlias || generateRandomId(6);

  // Create URL
  const url = await Url.create({
    originalUrl: data.originalUrl,
    shortId,
    shortUrl: `${clientUrl}/r/${shortId}`,
    user: userId || undefined,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  });

  // Increment user's URL count
  if (userId) {
    await incrementUrlCountService(userId);
  }

  // Invalidate user's URLs cache
  if (userId) {
    await deleteCacheByPattern(`${CachePrefix.URLS}:user:${userId}:*`);
  }

  return url;
};

// Update URL
export const updateUrlService = async (
  urlId: string,
  data: UpdateUrlInput,
  userId: string
) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Verify ownership
  if (url.user?.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this URL");
  }

  // Update fields
  if (data.originalUrl) url.originalUrl = data.originalUrl;
  if (data.isActive !== undefined) url.isActive = data.isActive;
  if (data.expiresAt !== undefined) {
    url.expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
  }

  await url.save();

  // Invalidate caches - use exact keys for reliability
  const urlCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: urlId,
  });
  const shortIdCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: `short:${url.shortId}`,
  });

  await deleteCache(urlCacheKey);
  await deleteCache(shortIdCacheKey);
  // Pattern-based deletion for user's URL lists
  await deleteCacheByPattern(`${CachePrefix.URLS}:user:${userId}:*`);

  return url;
};

// Delete URL
export const deleteUrlService = async (urlId: string, userId: string) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Verify ownership
  if (url.user?.toString() !== userId) {
    throw createError.Forbidden("You don't have access to this URL");
  }

  await Url.findByIdAndDelete(urlId);

  // Decrement user's URL count
  await decrementUrlCountService(userId);

  // Invalidate caches - use exact keys for reliability
  const urlCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: urlId,
  });
  const shortIdCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: `short:${url.shortId}`,
  });

  await deleteCache(urlCacheKey);
  await deleteCache(shortIdCacheKey);
  await deleteCacheByPattern(`${CachePrefix.URLS}:user:${userId}:*`);

  return { message: "URL deleted successfully" };
};

// Admin: Get all URLs
export const getAllUrlsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  isActive?: boolean;
}) => {
  const { page = 1, limit = 10, search, userId, isActive } = query;

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.URLS,
    identifier: "admin",
    query: { page, limit, search, userId, isActive },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Build filter
  const filter: {
    $or?: Array<
      | { originalUrl?: { $regex: string; $options: string } }
      | { shortId?: { $regex: string; $options: string } }
    >;
    user?: string;
    isActive?: boolean;
  } = {};

  if (search) {
    filter.$or = [
      { originalUrl: { $regex: search, $options: "i" } },
      { shortId: { $regex: search, $options: "i" } },
    ];
  }

  if (userId) {
    filter.user = userId;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  const [urls, total] = await Promise.all([
    Url.find(filter)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Url.countDocuments(filter),
  ]);

  const result = {
    urls,
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

// Admin: Delete URL
export const adminDeleteUrlService = async (urlId: string) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  const userId = url.user?.toString();

  await Url.findByIdAndDelete(urlId);

  // Decrement user's URL count if user exists
  if (userId) {
    await decrementUrlCountService(userId);
  }

  // Invalidate caches - use exact keys for reliability
  const urlCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: urlId,
  });
  const shortIdCacheKey = generateCacheKey({
    prefix: CachePrefix.URL,
    identifier: `short:${url.shortId}`,
  });

  await deleteCache(urlCacheKey);
  await deleteCache(shortIdCacheKey);
  if (userId) {
    await deleteCacheByPattern(`${CachePrefix.URLS}:user:${userId}:*`);
  }
  await deleteCacheByPattern(`${CachePrefix.URLS}:admin:*`);

  return { message: "URL deleted successfully" };
};

// Get URL summary stats for a user
export const getUserUrlSummaryService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.URLS,
    identifier: `user:${userId}:summary`,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Aggregate stats from database
  const result = await Url.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        activeLinks: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        inactiveLinks: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
        totalClicks: { $sum: "$clickCount" },
      },
    },
    {
      $project: {
        _id: 0,
        totalLinks: 1,
        activeLinks: 1,
        inactiveLinks: 1,
        totalClicks: 1,
        avgClicks: {
          $cond: [
            { $gt: ["$totalLinks", 0] },
            { $round: [{ $divide: ["$totalClicks", "$totalLinks"] }, 2] },
            0,
          ],
        },
      },
    },
  ]);

  const summary = result[0] || {
    totalLinks: 0,
    activeLinks: 0,
    inactiveLinks: 0,
    totalClicks: 0,
    avgClicks: 0,
  };

  // Store in cache
  await setCache(cacheKey, summary, CacheTTL.SHORT);

  return summary;
};
