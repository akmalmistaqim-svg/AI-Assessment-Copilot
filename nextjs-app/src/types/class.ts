import { z } from "zod";

export const ClassStatusSchema = z.enum(["active", "archived"]);

export const ClassSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nama kelas minimal 2 karakter"),
  studentsCount: z.number().int().nonnegative(),
  assignmentsCount: z.number().int().nonnegative(),
  semester: z.string().min(2, "Semester minimal 2 karakter"),
  status: ClassStatusSchema,
  lecturerName: z.string().optional().default("Dr. Budi Santoso, M.Kom"),
  enrolledStudentIds: z.array(z.number().int()).optional().default([2]),
});

export const CreateClassInputSchema = z.object({
  name: z.string().min(2, "Nama kelas minimal 2 karakter"),
  semester: z.string().min(2, "Semester (misal: Semester Genap 2025/2026) wajib diisi"),
  status: ClassStatusSchema.default("active"),
  lecturerName: z.string().optional(),
  enrolledStudentIds: z.array(z.number().int()).optional(),
});

export const UpdateClassInputSchema = CreateClassInputSchema.partial();

export type ClassStatus = z.infer<typeof ClassStatusSchema>;
export type ClassItem = z.infer<typeof ClassSchema>;
export type CreateClassInput = z.infer<typeof CreateClassInputSchema>;
export type UpdateClassInput = z.infer<typeof UpdateClassInputSchema>;
