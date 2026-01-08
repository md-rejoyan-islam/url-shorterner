import fs from "fs";
import createError from "http-errors";
import path from "path";
import {
  clientUrl,
  emailVerificationTokenExpiration,
  passwordResetTokenExpiration,
  serverUrl,
} from "../../config/secret";
import {
  CachePrefix,
  CacheTTL,
  generateCacheKey,
  getCache,
  invalidateUserCache,
  setCache,
} from "../../helper/cache";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../../helper/create-jwt";
import { generateRandomToken, hashToken } from "../../helper/token.util";
import mailTemplate from "../../mails/mail-template";
import {
  accountActivatedTemplate,
  accountActivationTemplate,
  forgotPasswordTemplate,
  passwordResetSuccessTemplate,
} from "../../mails/templates";
import { getUserMaxDevices, getUserPlanFeatures } from "../plan/plan.util";
import {
  countActiveDevicesService,
  createRefreshTokenService,
  findValidRefreshTokenService,
  getActiveDevicesService,
  revokeAllUserTokensService,
  revokeRefreshTokenService,
  revokeTokenByDeviceService,
  updateLastUsedService,
} from "../refresh-token/refresh-token.service";
import { IDeviceInfo } from "../refresh-token/refresh-token.type";
import User from "../user/user.model";

// Register service
export const registerService = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  // Check if email already exists
  const emailExists = await User.isEmailTaken(email);
  if (emailExists) {
    throw createError.Conflict("Email already registered");
  }

  // Generate verification token
  const verificationToken = generateRandomToken();
  const hashedVerificationToken = hashToken(verificationToken);

  // Create user with verification token
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    emailVerificationToken: hashedVerificationToken,
    emailVerificationExpires: new Date(
      Date.now() + emailVerificationTokenExpiration * 1000
    ),
  });

  // Send activation email
  const activationLink = `${clientUrl}/verify-email/${verificationToken}`;

  await mailTemplate({
    to: user.email,
    subject: "Activate Your Account - URL Shortener",
    name: user.fullName,
    body: accountActivationTemplate(user.fullName, activationLink),
  });

  return {
    message:
      "Registration successful. Please check your email to activate your account.",
  };
};

// Login service
export const loginService = async (
  email: string,
  password: string,
  deviceInfo: IDeviceInfo
) => {
  // Find user with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw createError.Unauthorized("Invalid email or password");
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError.Unauthorized("Invalid email or password");
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    throw createError.Forbidden(
      "Please verify your email before logging in. Check your inbox for the activation link."
    );
  }

  // Check if account is active
  if (!user.isActive) {
    throw createError.Forbidden("Account is deactivated");
  }

  // Check device limit based on user's plan
  const maxDevices = await getUserMaxDevices(user._id.toString());
  const activeDevices = await countActiveDevicesService(user._id.toString());
  if (maxDevices !== -1 && activeDevices >= maxDevices) {
    throw createError.Forbidden(
      `Device limit reached. Your plan allows ${maxDevices} device(s). Please logout from another device or upgrade your plan.`
    );
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token with device info
  await createRefreshTokenService(
    refreshToken,
    user._id.toString(),
    deviceInfo
  );

  // Remove password from response
  const userObj = user.toObject();
  delete (userObj as any).password;

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

// Refresh token service
export const refreshAccessTokenService = async (refreshToken: string) => {
  // Verify JWT signature
  let decoded: TokenPayload;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw createError.Unauthorized("Invalid or expired refresh token");
  }

  // Find and validate stored token
  const storedToken = await findValidRefreshTokenService(refreshToken);
  if (!storedToken) {
    throw createError.Unauthorized("Invalid or expired refresh token");
  }

  // Fetch fresh user data
  const user = await User.findById(decoded._id);
  if (!user || !user.isActive) {
    await revokeRefreshTokenService(refreshToken);
    throw createError.Unauthorized("User not found or inactive");
  }

  // Update last used timestamp
  await updateLastUsedService(storedToken._id.toString());

  // Generate new access token only (keep same refresh token)
  const accessToken = generateAccessToken(user);

  return {
    user,
    accessToken,
  };
};

// Logout service (current device)
export const logoutService = async (refreshToken: string) => {
  const userId = await revokeRefreshTokenService(refreshToken);

  // Invalidate user cache if we found the user
  if (userId) {
    await invalidateUserCache(userId);
  }
};

// Logout all devices service
export const logoutAllDevicesService = async (userId: string) => {
  await revokeAllUserTokensService(userId);

  // Invalidate devices cache
  await invalidateUserCache(userId);
};

// Get active devices service
export const getDevicesService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.DEVICES,
    identifier: userId,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const devices = await getActiveDevicesService(userId);
  const result = (devices || []).map((device) => ({
    id: device._id,
    deviceInfo: device.deviceInfo,
    lastUsedAt: device.lastUsedAt,
    createdAt: device.createdAt,
  }));

  // Store in cache
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Logout specific device service
export const logoutDeviceService = async (userId: string, deviceId: string) => {
  await revokeTokenByDeviceService(userId, deviceId);

  // Invalidate devices cache
  await invalidateUserCache(userId);
};

// Change password service
export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw createError.BadRequest("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens (force re-login on all devices)
  await revokeAllUserTokensService(userId);

  return { message: "Password changed successfully. Please login again." };
};

// Forgot password service
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "If an account with that email exists, a reset link has been sent.",
    };
  }

  const resetToken = generateRandomToken();
  const hashedResetToken = hashToken(resetToken);

  user.resetPasswordToken = hashedResetToken;
  user.resetPasswordExpires = new Date(
    Date.now() + passwordResetTokenExpiration * 1000
  );

  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  try {
    await user.save();

    await mailTemplate({
      to: user.email,
      subject: "Password Reset Request - URL Shortener",
      name: user.fullName,
      body: forgotPasswordTemplate(user.fullName, resetUrl),
    });
  } catch {
    throw createError.InternalServerError("Error sending email");
  }

  return {
    message:
      "If an account with that email exists, a reset link has been sent.",
  };
};

// Reset password service
export const resetPasswordService = async (token: string, password: string) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createError.BadRequest("Invalid or expired password reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  // Revoke all refresh tokens
  await revokeAllUserTokensService(user._id.toString());

  // Send password reset success email
  await mailTemplate({
    to: user.email,
    subject: "Password Changed Successfully - URL Shortener",
    name: user.fullName,
    body: passwordResetSuccessTemplate(user.fullName),
  });

  return {
    message:
      "Password reset successfully. Please login with your new password.",
  };
};

// Get current user service
export const meService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.ME,
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

// Update current user profile service
export const updateMeService = async (
  userId: string,
  updateData: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  if (updateData.firstName) user.firstName = updateData.firstName;
  if (updateData.lastName) user.lastName = updateData.lastName;
  if (updateData.avatar !== undefined) user.avatar = updateData.avatar;

  await user.save();

  // Invalidate user cache
  await invalidateUserCache(userId);

  return user;
};

// Get usage statistics service
export const getUsageService = async (userId: string) => {
  // Generate cache key
  const cacheKey = generateCacheKey({
    prefix: CachePrefix.USAGE,
    identifier: userId,
  });

  // Check cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const user = await User.findById(userId).populate("currentPlan");

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Get URL limit from user's plan
  const planFeatures = await getUserPlanFeatures(userId);
  const urlLimit = planFeatures.urlLimit;

  const result = {
    urlCount: user.urlCount,
    urlLimit: urlLimit,
    remaining: urlLimit === -1 ? -1 : Math.max(0, urlLimit - user.urlCount),
    percentage:
      urlLimit === -1 ? 0 : Math.round((user.urlCount / urlLimit) * 100),
  };

  // Store in cache (short TTL as usage changes frequently)
  await setCache(cacheKey, result, CacheTTL.SHORT);

  return result;
};

// Delete account service (soft delete for user self-deletion)
export const deleteAccountService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Revoke all refresh tokens
  await revokeAllUserTokensService(userId);

  // Soft delete - mark as inactive
  user.isActive = false;
  await user.save();

  // Invalidate user cache
  await invalidateUserCache(userId);

  return { message: "Account deleted successfully" };
};

// Verify email service
export const verifyEmailService = async (token: string) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createError.BadRequest("Invalid or expired verification token");
  }

  // Activate user
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  // Send activation success email
  const loginLink = `${clientUrl}/login`;

  await mailTemplate({
    to: user.email,
    subject: "Account Activated - URL Shortener",
    name: user.fullName,
    body: accountActivatedTemplate(user.fullName, loginLink),
  });

  return { message: "Email verified successfully. You can now login." };
};

// Resend verification email service
export const resendVerificationEmailService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists
    return {
      message:
        "If an account with that email exists, a verification link has been sent.",
    };
  }

  if (user.isEmailVerified) {
    throw createError.BadRequest("Email is already verified");
  }

  // Generate new verification token
  const verificationToken = generateRandomToken();
  const hashedVerificationToken = hashToken(verificationToken);

  user.emailVerificationToken = hashedVerificationToken;
  user.emailVerificationExpires = new Date(
    Date.now() + emailVerificationTokenExpiration * 1000
  );

  await user.save();

  // Send activation email
  const activationLink = `${clientUrl}/verify-email/${verificationToken}`;

  await mailTemplate({
    to: user.email,
    subject: "Activate Your Account - URL Shortener",
    name: user.fullName,
    body: accountActivationTemplate(user.fullName, activationLink),
  });

  return {
    message:
      "If an account with that email exists, a verification link has been sent.",
  };
};

// Upload avatar service
export const uploadAvatarService = async (
  userId: string,
  file: Express.Multer.File
) => {
  const user = await User.findById(userId);

  if (!user) {
    // Delete uploaded file if user not found
    if (file.path) {
      fs.unlinkSync(file.path);
    }
    throw createError.NotFound("User not found");
  }

  // Delete old avatar if exists
  if (user.avatar) {
    const oldAvatarPath = user.avatar.replace(
      `${serverUrl}/public/avatars/`,
      ""
    );
    const fullOldPath = path.join(
      process.cwd(),
      "src/public/avatars",
      oldAvatarPath
    );

    if (fs.existsSync(fullOldPath)) {
      fs.unlinkSync(fullOldPath);
    }
  }

  // Set new avatar URL
  const avatarUrl = `${serverUrl}/public/avatars/${file.filename}`;
  user.avatar = avatarUrl;
  await user.save();

  // Invalidate user cache
  await invalidateUserCache(userId);

  return {
    avatar: avatarUrl,
    message: "Avatar uploaded successfully",
  };
};
