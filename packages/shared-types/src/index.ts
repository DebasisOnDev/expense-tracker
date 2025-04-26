import { z } from "zod";

// Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username should be at least 3 character"),
  email: z.string({ required_error: "Email is required" }).email().trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(18, "Password should not exceed 18 characters"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const userWithoutPasswordSchema = userSchema.omit({ password: true });

export const registerSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username should be at least 3 character"),
  email: z.string({ required_error: "Email is required" }).email().trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(18, "Password should not exceed 18 characters"),
});

export const userUpdateSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username should be at least 3 character"),
  email: z.string({ required_error: "Email is required" }).email().trim(),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email().trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(18, "Password should not exceed 18 characters"),
});

export const authResponseSchema = z.object({
  user: userWithoutPasswordSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be a positive number"),
  category: z.string().min(3, "Category is required"),
});

export const updateExpenseSchema = createExpenseSchema.partial();

// Types
export type UserWithoutPasswordField = z.infer<
  typeof userWithoutPasswordSchema
>;
export type User = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
