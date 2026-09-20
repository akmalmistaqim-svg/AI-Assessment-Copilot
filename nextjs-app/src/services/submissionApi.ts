import { z } from "zod";
import {
  type CreateSubmissionInput,
  type SubmissionItem,
  SubmissionItemSchema,
} from "@/types/submission";

export async function fetchSubmissions(): Promise<SubmissionItem[]> {
  const res = await fetch("/api/submissions");
  if (!res.ok) {
    throw new Error("Gagal mengambil data pengumpulan tugas");
  }
  const data = await res.json();
  return z.array(SubmissionItemSchema).parse(data);
}

export async function createSubmission(
  input: CreateSubmissionInput,
): Promise<{ success: boolean; submission: SubmissionItem }> {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || errData?.error || "Gagal mengumpulkan tugas");
  }

  return res.json();
}
