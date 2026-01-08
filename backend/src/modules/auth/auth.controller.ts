import { Request, Response } from "express";
import createError from "http-errors";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import { extractDeviceInfo } from "../refresh-token/device-info.util";
import {
  changePasswordService,
  deleteAccountService,
  forgotPasswordService,
  getDevicesService,
  getUsageService,
  loginService,
  logoutAllDevicesService,
  logoutDeviceService,
  logoutService,
  meService,
  refreshAccessTokenService,
  registerService,
  resendVerificationEmailService,
  resetPasswordService,
  updateMeService,
  uploadAvatarService,
  verifyEmailService,
} from "./auth.service";

// Register controller
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const result = await registerService(firstName, lastName, email, password);

  successResponse(res, {
    statusCode: 201,
    message: result.message,
  });
});

// Login controller
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const deviceInfo = extractDeviceInfo(req);

  const { user, accessToken, refreshToken } = await loginService(
    email,
    password,
    deviceInfo
  );

  successResponse(res, {
    statusCode: 200,
    message: "Login successful",
    payload: {
      data: {
        user,
        accessToken,
        refreshToken,
      },
    },
  });
});

// Refresh token controller
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Try to get refresh token from cookies first, then fallback to body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      throw createError.BadRequest("Refresh token is required");
    }

    const { user, accessToken } = await refreshAccessTokenService(token);

    successResponse(res, {
      statusCode: 200,
      message: "Token refreshed successfully",
      payload: {
        data: {
          user,
          accessToken,
        },
      },
    });
  }
);

// Logout controller (current device)
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Try to get refresh token from cookies first, then fallback to body
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (token) {
    await logoutService(token);
  }

  successResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
  });
});

// Logout all devices controller
export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  await logoutAllDevicesService(userId);

  successResponse(res, {
    statusCode: 200,
    message: "Logged out from all devices successfully",
  });
});

// Get current user controller
export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await meService(userId);

  successResponse(res, {
    statusCode: 200,
    message: "User details retrieved successfully",
    payload: {
      data: user,
    },
  });
});

// Update current user profile controller
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { firstName, lastName, avatar } = req.body;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await updateMeService(userId, { firstName, lastName, avatar });

  successResponse(res, {
    statusCode: 200,
    message: "Profile updated successfully",
    payload: {
      data: user,
    },
  });
});

// Get active devices controller
export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const devices = await getDevicesService(userId);

  successResponse(res, {
    statusCode: 200,
    message: "Active devices retrieved successfully",
    payload: {
      data: devices,
    },
  });
});

// Logout specific device controller
export const logoutDevice = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { id: deviceId } = req.params;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    await logoutDeviceService(userId, deviceId);

    successResponse(res, {
      statusCode: 200,
      message: "Device logged out successfully",
    });
  }
);

// Change password controller
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await changePasswordService(
      userId,
      currentPassword,
      newPassword
    );

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);

// Forgot password controller
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);

// Reset password controller
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const result = await resetPasswordService(token, password);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);

// Get usage statistics controller
export const getUsage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usage = await getUsageService(userId);

  successResponse(res, {
    statusCode: 200,
    message: "Usage statistics retrieved successfully",
    payload: {
      data: usage,
    },
  });
});

// Delete account controller (soft delete)
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await deleteAccountService(userId);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);

// Verify email controller
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const result = await verifyEmailService(token);

  successResponse(res, {
    statusCode: 200,
    message: result.message,
  });
});

// Resend verification email controller
export const resendVerificationEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await resendVerificationEmailService(email);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
    });
  }
);

// Upload avatar controller
export const uploadAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!req.file) {
      throw createError.BadRequest("No file uploaded");
    }

    const result = await uploadAvatarService(userId, req.file);

    successResponse(res, {
      statusCode: 200,
      message: result.message,
      payload: {
        data: { avatar: result.avatar },
      },
    });
  }
);
