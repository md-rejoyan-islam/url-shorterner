import express from "express";
import { avatarUpload } from "../../helper/multer";
import validate from "../../middlewares/validate";
import { isLoggedIn } from "../../middlewares/verify";
import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getDevices,
  getUsage,
  login,
  logout,
  logoutAll,
  logoutDevice,
  me,
  refreshToken,
  register,
  resendVerificationEmail,
  resetPassword,
  updateMe,
  uploadAvatar,
  verifyEmail,
} from "./auth.controller";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  updateMeSchema,
  verifyEmailSchema,
} from "./auth.validation";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh-token", validate(refreshTokenSchema), refreshToken);
authRouter.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
authRouter.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerificationEmail
);
authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword
);
authRouter.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword
);

// Protected routes - Current user (/me)
authRouter.get("/me", isLoggedIn, me);
authRouter.put("/me", isLoggedIn, validate(updateMeSchema), updateMe);
authRouter.delete("/me", isLoggedIn, deleteAccount);
authRouter.get("/me/usage", isLoggedIn, getUsage);

// Avatar upload route
authRouter.post(
  "/me/avatar",
  isLoggedIn,
  avatarUpload.single("avatar"),
  uploadAvatar
);

// Session management
authRouter.post("/logout", validate(logoutSchema), logout);
authRouter.post("/logout-all", isLoggedIn, logoutAll);
authRouter.put(
  "/change-password",
  isLoggedIn,
  validate(changePasswordSchema),
  changePassword
);

// Device management routes
authRouter.get("/devices", isLoggedIn, getDevices);
authRouter.delete("/devices/:id", isLoggedIn, logoutDevice);

export default authRouter;
