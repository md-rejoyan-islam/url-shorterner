import { z } from "zod";
import { UserRole } from "./user.type";

// Create user validation (admin)
export const createUserSchema = z.object({
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
    role: z
      .enum([UserRole.ADMIN, UserRole.USER], {
        message: "Role must be admin or user",
      })
      .optional(),
    isActive: z.boolean({ message: "isActive must be a boolean" }).optional(),
    isEmailVerified: z
      .boolean({ message: "isEmailVerified must be a boolean" })
      .optional(),
  }),
});

// Update user validation (admin)
export const updateUserSchema = z
  .object({
    body: z.object({
      firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters")
        .optional(),
      lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters")
        .optional(),
      email: z.email({ message: "Invalid email format" }).optional(),
      role: z
        .enum([UserRole.ADMIN, UserRole.USER], {
          message: "Role must be admin or user",
        })
        .optional(),
      isActive: z.boolean({ message: "isActive must be a boolean" }).optional(),
      isEmailVerified: z
        .boolean({ message: "isEmailVerified must be a boolean" })
        .optional(),
      avatar: z
        .string({ message: "Avatar must be a valid URL" })
        .nullable()
        .optional(),
    }),
  })
  .strict();

// Get all users query validation
export const getAllUsersQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, "Page must be a positive number"),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine(
        (val) => val > 0 && val <= 100,
        "Limit must be between 1 and 100"
      ),
    search: z.string().max(100, "Search query too long").optional(),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).optional(),
    isActive: z
      .string()
      .optional()
      .transform((val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
      }),
  }),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
export type GetAllUsersQuery = z.infer<typeof getAllUsersQuerySchema>["query"];
