import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().max(100).optional(),
  thumbnail: z.string().url("Invalid thumbnail URL").optional().nullable(),
  data: z
    .record(z.string(), z.unknown())
    .refine((val) => Object.keys(val).length > 0, {
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

export type CreateProjectSchemaType = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof updateProjectSchema>;
