import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
  password: zod.string().min(1, "Password is required"),
  rememberMe: zod.boolean().optional(),
});
