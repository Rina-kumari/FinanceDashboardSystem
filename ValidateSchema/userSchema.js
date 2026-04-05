import { z } from "zod";

const ROLES = ["viewer", "analyst", "admin"];

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const assignRoleSchema = z.object({
  role: z.enum(ROLES, { message: "Role must be viewer, analyst, or admin" }),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({ message: "isActive must be a boolean" }),
});