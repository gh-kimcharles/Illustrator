import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().max(100).optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().nullable(),
  data: z.record(z.string(), z.unknown()).refine(Boolean, {
    message: "Project data is required",
  }),
});

export const updateProjectSchema = z
  .object({
    name: z.string().trim().max(100).optional(),
    thumbnail: z.string().url("Invalid thumbnail URL").optional().nullable(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((val) => Object.keys(val).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
