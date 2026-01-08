import createError from "http-errors";
import { jwtConfig } from "../../config/secret";
import RefreshToken from "./refresh-token.model";
import { IDeviceInfo, IRefreshTokenDocument } from "./refresh-token.type";

// Parse duration string (e.g., "7d", "24h", "30m") to milliseconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "d":
      return value * 24 * 60 * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "m":
      return value * 60 * 1000;
    case "s":
      return value * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
};

// Create a new refresh token
export const createRefreshTokenService = async (
  token: string,
  userId: string,
  deviceInfo: IDeviceInfo
): Promise<IRefreshTokenDocument> => {
  const expiresAt = new Date(
    Date.now() + parseDuration(jwtConfig.refreshExpiresIn)
  );

  const refreshToken = await RefreshToken.create({
    token,
    user: userId,
    deviceInfo,
    expiresAt,
  });

  return refreshToken;
};

// Find valid refresh token
export const findValidRefreshTokenService = async (
  token: string
): Promise<IRefreshTokenDocument | null> => {
  return RefreshToken.findValidToken(token);
};

// Update last used timestamp
export const updateLastUsedService = async (
  tokenId: string
): Promise<void> => {
  await RefreshToken.findByIdAndUpdate(tokenId, {
    lastUsedAt: new Date(),
  });
};

// Delete a specific refresh token and return userId for cache invalidation
export const revokeRefreshTokenService = async (
  token: string
): Promise<string | null> => {
  const refreshToken = await RefreshToken.findOneAndDelete({ token });
  if (refreshToken) {
    return refreshToken.user.toString();
  }
  return null;
};

// Delete all refresh tokens for a user (logout all devices)
export const revokeAllUserTokensService = async (
  userId: string
): Promise<void> => {
  await RefreshToken.deleteMany({ user: userId });
};

// Delete refresh token by device ID
export const revokeTokenByDeviceService = async (
  userId: string,
  deviceId: string
): Promise<void> => {
  const result = await RefreshToken.findOneAndDelete({
    _id: deviceId,
    user: userId,
  });
  if (!result) {
    throw createError.NotFound("Device not found");
  }
};

// Get active devices for a user
export const getActiveDevicesService = async (
  userId: string
): Promise<IRefreshTokenDocument[]> => {
  return RefreshToken.getActiveDevices(userId);
};

// Count active devices for a user
export const countActiveDevicesService = async (
  userId: string
): Promise<number> => {
  return RefreshToken.countActiveByUser(userId);
};

// Check if user has reached device limit
export const checkDeviceLimitService = async (
  userId: string,
  maxDevices: number
): Promise<boolean> => {
  const activeDevices = await RefreshToken.countActiveByUser(userId);
  return activeDevices >= maxDevices;
};
