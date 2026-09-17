import { z } from "zod";
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .min(3, "Project title must be at least 3 characters.")
    .max(100, "Project title must be maximum 3 characters."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
});
