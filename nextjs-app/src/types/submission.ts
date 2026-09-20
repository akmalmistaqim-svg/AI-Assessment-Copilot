import { z } from "zod";

export const CreateSubmissionInputSchema = z.object({
  assignmentId: z.string().min(1, "Silakan pilih tugas yang akan dikumpulkan"),
  fileUrl: z.string().min(3, "Tautan file tugas minimal 3 karakter (URL berkas / repository)"),
  notes: z.string().optional().default(""),
});

export const SubmissionItemSchema = z.object({
  id: z.string(),
  assignmentId: z.string(),
  assignmentTitle: z.string(),
  course: z.string(),
  studentId: z.number().int(),
  studentName: z.string(),
  studentEmail: z.string().email(),
  fileUrl: z.string(),
  notes: z.string(),
  submittedAt: z.string(),
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionInputSchema>;
export type SubmissionItem = z.infer<typeof SubmissionItemSchema>;
