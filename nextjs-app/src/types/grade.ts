import { z } from "zod";

export const GradeStatusSchema = z.enum(["draft", "in-review", "finalized"]);

export const GradeItemSchema = z.object({
  id: z.string(),
  assessmentId: z.string(),
  assessmentName: z.string().min(2, "Nama assessment minimal 2 karakter"),
  course: z.string().min(2, "Mata kuliah minimal 2 karakter"),
  studentId: z.number().int(),
  studentEmail: z.string().email(),
  studentName: z.string().min(2),
  score: z.number().min(0).max(100),
  maxScore: z.number().default(100),
  status: GradeStatusSchema,
  gradedDate: z.string(),
  assessorName: z.string(),
  comment: z.string(),
  aiReview: z.string().optional(),
  rubricName: z.string().optional(),
});

export type GradeStatus = z.infer<typeof GradeStatusSchema>;
export type GradeItem = z.infer<typeof GradeItemSchema>;
