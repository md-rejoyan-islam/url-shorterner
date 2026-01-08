import { redisClient } from "../config/redis";
import { redis_url } from "../config/secret";
import { logger } from "./logger";
import { hashToken } from "./token.util";

// Check if Redis is configured
const isRedisConfigured = !!redis_url;

// Cache prefixes for different resources
export const CachePrefix = {
  // User related
  USER: "user",
  USERS: "users",
  ME: "me",
  USAGE: "usage",
  DEVICES: "devices",
  // URL related
  URL: "url",
  URLS: "urls",
  // Click/Analytics related
  CLICK: "click",
  CLICKS: "clicks",
  ANALYTICS: "analytics",
  // Plan related
  PLAN: "plan",
  PLANS: "plans",
  // Subscription related
  SUBSCRIPTION: "subscription",
  SUBSCRIPTIONS: "subscriptions",
  // Payment related
  PAYMENT: "payment",
  PAYMENTS: "payments",
  CARDS: "cards",
} as const;

// Default TTL values (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  MONTH: 2592000, // 30 days
} as const;

export interface CacheKeyParams {
  prefix: string;
  identifier?: string;
  query?: Record<string, unknown>;
}

// Sort object keys for consistent cache key generation
function sortObjectKeys(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return obj;
  }

  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return sortedObj;
}

// Generate a consistent cache key
export function generateCacheKey(params: CacheKeyParams): string {
  const { prefix, identifier, query } = params;

  // If just prefix and identifier, use simple format
  if (identifier && !query) {
    return `${prefix}:${identifier}`;
  }

  // If query exists, hash it for consistent key
  if (query && Object.keys(query).length > 0) {
    const sortedQuery = sortObjectKeys(query);
    const queryHash = hashToken(JSON.stringify(sortedQuery)).slice(0, 16);
    return identifier
      ? `${prefix}:${identifier}:${queryHash}`
      : `${prefix}:${queryHash}`;
  }

  return identifier ? `${prefix}:${identifier}` : prefix;
}

// Set cache with data
export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number = CacheTTL.MEDIUM
): Promise<void> {
  if (!isRedisConfigured || !redisClient?.isOpen) return;

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    logger.warn(`Failed to set cache for key: ${key}. Error: ${error}`);
  }
}

// Get cache data
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisConfigured || !redisClient?.isOpen) return null;

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }
    return null;
  } catch (error) {
    logger.warn(`Failed to get cache for key: ${key}. Error: ${error}`);
    return null;
  }
}

// Delete single cache key
export async function deleteCache(key: string): Promise<void> {
  if (!isRedisConfigured || !redisClient?.isOpen) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    logger.warn(`Failed to delete cache for key: ${key}. Error: ${error}`);
  }
}

// Delete multiple cache keys
export async function deleteCacheKeys(keys: string[]): Promise<void> {
  if (!isRedisConfigured || !redisClient?.isOpen || !keys || keys.length === 0)
    return;

  try {
    await redisClient.del(keys);
  } catch (error) {
    logger.warn(`Failed to delete cache keys. Error: ${error}`);
  }
}

// Delete all cache keys matching a pattern (e.g., "users:*")
export async function deleteCacheByPattern(pattern: string): Promise<void> {
  if (!isRedisConfigured || !redisClient?.isOpen) return;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    logger.warn(
      `Failed to delete cache by pattern: ${pattern}. Error: ${error}`
    );
  }
}

// Clear all cache
export async function clearCache(): Promise<void> {
  if (!isRedisConfigured || !redisClient?.isOpen) return;

  try {
    await redisClient.flushAll();
  } catch (error) {
    logger.warn(`Failed to clear cache. Error: ${error}`);
  }
}

// Get or set cache (cache-aside pattern)
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = CacheTTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  await setCache(key, data, ttlSeconds);

  return data;
}

// Invalidate user-related cache
export async function invalidateUserCache(userId: string): Promise<void> {
  const keysToDelete = [
    generateCacheKey({ prefix: CachePrefix.USER, identifier: userId }),
    generateCacheKey({ prefix: CachePrefix.ME, identifier: userId }),
    generateCacheKey({ prefix: CachePrefix.USAGE, identifier: userId }),
    generateCacheKey({ prefix: CachePrefix.DEVICES, identifier: userId }),
  ];

  await deleteCacheKeys(keysToDelete);
  // Also invalidate users list cache
  await deleteCacheByPattern(`${CachePrefix.USERS}:*`);
}

// Invalidate all users list cache
export async function invalidateUsersListCache(): Promise<void> {
  await deleteCacheByPattern(`${CachePrefix.USERS}:*`);
}
