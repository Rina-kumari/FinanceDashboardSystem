import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number({ message: "Amount must be a number" }).positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"], { message: "Type must be income or expense" }),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0").optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().min(1, "Category is required").optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
});

export const filterTransactionSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});