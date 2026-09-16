import { z } from "zod";

export const AssessmentStatusSchema = z.enum(["draft", "in-review", "finalized"]);

export const AssessmentSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nama assessment minimal 2 karakter"),
  course: z.string().min(2, "Mata kuliah minimal 2 karakter"),
  status: AssessmentStatusSchema,
  gradedSubmissionsCount: z.number().int().nonnegative(),
});

export const CreateAssessmentInputSchema = z.object({
  name: z.string().min(2, "Nama assessment minimal 2 karakter"),
  course: z.string().min(2, "Mata kuliah minimal 2 karakter"),
  status: AssessmentStatusSchema.default("draft"),
  gradedSubmissionsCount: z.coerce
    .number()
    .int()
    .min(0, "Jumlah submission tidak boleh negatif")
    .default(0),
});

export const UpdateAssessmentInputSchema = CreateAssessmentInputSchema.partial();

export type AssessmentStatus = z.infer<typeof AssessmentStatusSchema>;
export type AssessmentItem = z.infer<typeof AssessmentSchema>;
export type CreateAssessmentInput = z.infer<typeof CreateAssessmentInputSchema>;
export type UpdateAssessmentInput = z.infer<typeof UpdateAssessmentInputSchema>;
