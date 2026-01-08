import createError from "http-errors";
import {
  CachePrefix,
  CacheTTL,
  generateCacheKey,
  getCache,
  invalidateUserCache,
  invalidateUsersListCache,
  setCache,
} from "../../helper/cache";
import { getUserUrlLimit } from "../plan/plan.util";
import { revokeAllUserTokensService } from "../refresh-token/refresh-token.service";
import User from "./user.model";
import { UserRole } from "./user.type";

// Increment URL count
export const incrementUrlCountService = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { urlCount: 1 } },
    { new: true }
  );

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Invalidate user cache (usage changed)
  await invalidateUserCache(userId);

  return user;
};

// Decrement URL count
export const decrementUrlCountService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Don't go below 0
  if (user.urlCount > 0) {
    user.urlCount -= 1;
    await user.save();

    // Invalidate user cache (usage changed)
    await invalidateUserCache(userId);
  }

  return user;
};

// Check if user can create URL
export const canCreateUrlService = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId).populate("currentPlan");

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Get URL limit from user's plan
  const urlLimit = await getUserUrlLimit(userId);

  return user.canCreateUrl(urlLimit);
};

// Get all users (admin)
export const getAllUsersService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}) => {
  const { page = 1, limit = 10, search, role, isActive } = query;

  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.USERS,
    query: { page, limit, search, role, isActive },
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const skip = (page - 1) * limit;
  const filter: {
    $or?: Array<
      | {
          firstName?: { $regex: string; $options: string };
        }
      | {
          lastName?: { $regex: string; $options: string };
        }
      | {
          email?: { $regex: string; $options: string };
        }
    >;
    role?: string;
    isActive?: boolean;
  } = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate("currentPlan")
      .populate("subscription")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const result = {
    users,
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

// Get single user by ID (admin)
export const getUserByIdService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.USER,
    identifier: userId,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const user = await User.findById(userId)
    .select("-password")
    .populate("currentPlan")
    .populate("subscription");

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Store in cache
  await setCache(cacheKey, user, CacheTTL.MEDIUM);

  return user;
};

// Create user (admin)
export const createUserService = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}) => {
  const emailExists = await User.isEmailTaken(userData.email);
  if (emailExists) {
    throw createError.Conflict("Email already registered");
  }

  const user = await User.create(userData);

  // Invalidate users list cache
  await invalidateUsersListCache();

  return user;
};

// Update user (admin)
export const updateUserService = async (
  userId: string,
  updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    isEmailVerified?: boolean;
    avatar?: string;
  }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.isEmailTaken(updateData.email, userId);
    if (emailExists) {
      throw createError.Conflict("Email already in use");
    }
  }

  // Update fields
  Object.assign(user, updateData);
  await user.save();

  // Invalidate caches
  await invalidateUserCache(userId);

  return user;
};

// Delete user (admin) - hard delete
export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Revoke all refresh tokens
  await revokeAllUserTokensService(userId);

  // Hard delete
  await User.findByIdAndDelete(userId);

  // Invalidate caches
  await invalidateUserCache(userId);

  return { message: "User deleted successfully" };
};
