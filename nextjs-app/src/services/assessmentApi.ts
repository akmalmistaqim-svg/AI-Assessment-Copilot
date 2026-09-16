import { z } from "zod";
import {
  type AssessmentItem,
  AssessmentSchema,
  type CreateAssessmentInput,
  type UpdateAssessmentInput,
} from "@/types/assessment";

export async function fetchAssessments(): Promise<AssessmentItem[]> {
  const res = await fetch("/api/assessments");
  if (!res.ok) {
    throw new Error("Gagal mengambil data assessment dari server");
  }
  const data = await res.json();
  return z.array(AssessmentSchema).parse(data);
}

export async function createAssessment(input: CreateAssessmentInput): Promise<AssessmentItem> {
  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Gagal membuat assessment baru");
  }
  const data = await res.json();
  return AssessmentSchema.parse(data);
}

export async function updateAssessment({
  id,
  data,
}: {
  id: string;
  data: UpdateAssessmentInput;
}): Promise<AssessmentItem> {
  const res = await fetch(`/api/assessments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Gagal memperbarui data assessment");
  }
  const responseData = await res.json();
  return AssessmentSchema.parse(responseData);
}

export async function deleteAssessment(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/assessments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Gagal menghapus assessment");
  }
  return res.json();
}
