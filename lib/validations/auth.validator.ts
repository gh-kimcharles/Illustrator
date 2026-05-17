import { z } from "zod";

const emailSchema = z
  .string({ error: "Email is required" })
  .email("Invalid email address")
  .toLowerCase()
  .trim();

export const passwordSchema = {
  register: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"), // bcrypt limit

  login: z.string().min(1, "Password is required"),
};

export const registerSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: emailSchema,
  password: passwordSchema.register,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema.login,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
