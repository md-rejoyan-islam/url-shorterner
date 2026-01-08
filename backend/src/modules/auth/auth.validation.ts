import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ message: "First name is required" })
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),
    lastName: z
      .string({ message: "Last name is required" })
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),
    email: z.email({ message: "Email is required" }),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ message: "Email is required" }),
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }).optional(),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ message: "Current password is required" })
      .min(1, "Current password is required"),
    newPassword: z
      .string({ message: "New password is required" })
      .min(6, "New password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email({ message: "Email is required" }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z
      .string({ message: "Token is required" })
      .min(1, "Token is required"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
      .optional(),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name cannot exceed 50 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes")
      .optional(),
    avatar: z
      .string({ message: "Avatar must be a string" })
      .nullable()
      .optional(),
  }),
});

export const logoutSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().optional(),
    })
    .optional(),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z
      .string({ message: "Verification token is required" })
      .min(1, "Verification token is required"),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.email({ message: "Email is required" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type UpdateMeInput = z.infer<typeof updateMeSchema>["body"];
export type LogoutInput = z.infer<typeof logoutSchema>["body"];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["body"];
export type ResendVerificationInput = z.infer<
  typeof resendVerificationSchema
>["body"];
