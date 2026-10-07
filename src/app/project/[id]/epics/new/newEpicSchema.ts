import { z } from "zod";

export const newEpicSchema = z.object({
  name: z
    .string()
    .min(3, { message: "TITLE IS REQUIRED (MINIMUM 3 CHARACTERS)" }),
  description: z
    .string()
    .max(500, { message: "Maximum 500 characters" })
    .optional(),
  assignee_id: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "DEADLINE CANNOT BE BEFORE TODAY" },
    ),
});

export type newEpicFormValues = z.infer<typeof newEpicSchema>;
