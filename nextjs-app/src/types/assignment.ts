import { z } from "zod";

export const AssignmentStatusSchema = z.enum(["pending", "submitted", "graded"]);

export const AssignmentSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Judul tugas minimal 2 karakter"),
  course: z.string().min(2, "Mata kuliah minimal 2 karakter"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  status: AssignmentStatusSchema,
});

export const CreateAssignmentInputSchema = z.object({
  title: z.string().min(2, "Judul tugas minimal 2 karakter"),
  course: z.string().min(2, "Mata kuliah minimal 2 karakter"),
  deadline: z.string().min(1, "Deadline (contoh: 20 Sep 2026) wajib diisi"),
  description: z.string().min(5, "Deskripsi singkat minimal 5 karakter"),
  status: AssignmentStatusSchema.default("pending"),
});

export const UpdateAssignmentInputSchema = CreateAssignmentInputSchema.partial();

export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;
export type AssignmentItem = z.infer<typeof AssignmentSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentInputSchema>;
export type UpdateAssignmentInput = z.infer<typeof UpdateAssignmentInputSchema>;
