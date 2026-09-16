import { z } from "zod";

export const RubricStatusSchema = z.enum(["active", "draft", "archived"]);

export const RubricSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nama rubrik minimal 2 karakter"),
  course: z.string().min(2, "Nama mata kuliah minimal 2 karakter"),
  criteriaCount: z.number().int().positive("Jumlah kriteria minimal 1"),
  totalWeight: z.number().positive("Bobot total harus lebih dari 0"),
  status: RubricStatusSchema,
});

export const CreateRubricInputSchema = z.object({
  name: z.string().min(2, "Nama rubrik minimal 2 karakter"),
  course: z.string().min(2, "Nama mata kuliah minimal 2 karakter"),
  criteriaCount: z.coerce.number().int().min(1, "Jumlah kriteria minimal 1"),
  totalWeight: z.coerce
    .number()
    .min(1, "Bobot total minimal 1%")
    .max(100, "Bobot total maksimal 100%"),
  status: RubricStatusSchema.default("active"),
});

export const UpdateRubricInputSchema = CreateRubricInputSchema.partial();

export type RubricStatus = z.infer<typeof RubricStatusSchema>;
export type RubricItem = z.infer<typeof RubricSchema>;
export type CreateRubricInput = z.infer<typeof CreateRubricInputSchema>;
export type UpdateRubricInput = z.infer<typeof UpdateRubricInputSchema>;
