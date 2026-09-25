import * as zod from "zod";

export const resetSchema = zod
  .object({
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
