import * as zod from "zod";

export const registerSchema = zod
  .object({
    name: zod
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be maximum 50 characters")
      .regex(
        /^[\p{L}]+(?: [\p{L}]+)*$/u,
        "Name must contain letters only and cannot have multiple consecutive spaces",
      ),

    email: zod
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    jobTitle: zod.string().optional(),

    password: zod
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must be maximum 64 characters")
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain whitespace",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
        "Password must include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character",
      ),

    confirmPassword: zod.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = zod.infer<typeof registerSchema>;
