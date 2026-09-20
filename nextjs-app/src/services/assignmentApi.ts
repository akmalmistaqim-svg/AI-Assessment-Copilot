import { z } from "zod";
import {
  type AssignmentItem,
  AssignmentSchema,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "@/types/assignment";

export async function fetchAssignments(): Promise<AssignmentItem[]> {
  const res = await fetch("/api/assignments");
  if (!res.ok) {
    throw new Error("Gagal mengambil data tugas dari server");
  }
  const data = await res.json();
  return z.array(AssignmentSchema).parse(data);
}

export async function fetchAssignmentById(id: string): Promise<AssignmentItem> {
  const res = await fetch(`/api/assignments/${id}`);
  if (!res.ok) {
    throw new Error("Gagal mengambil detail tugas dari server");
  }
  const data = await res.json();
  return AssignmentSchema.parse(data);
}

export async function createAssignment(input: CreateAssignmentInput): Promise<AssignmentItem> {
  const res = await fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Gagal membuat tugas baru");
  }
  const data = await res.json();
  return AssignmentSchema.parse(data);
}

export async function updateAssignment({
  id,
  data,
}: {
  id: string;
  data: UpdateAssignmentInput;
}): Promise<AssignmentItem> {
  const res = await fetch(`/api/assignments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Gagal memperbarui data tugas");
  }
  const responseData = await res.json();
  return AssignmentSchema.parse(responseData);
}

export async function deleteAssignment(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/assignments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Gagal menghapus tugas");
  }
  return res.json();
}
