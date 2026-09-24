import * as zod from "zod";
export const forgotSchema = zod.object({
  email: zod.string().min(1, "Email is required").email("Invalid email format"),
});
