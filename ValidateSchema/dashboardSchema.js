import { z } from "zod";

export const dashboardFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  month: z.string().optional(), 
  week: z.string().optional(),  
});