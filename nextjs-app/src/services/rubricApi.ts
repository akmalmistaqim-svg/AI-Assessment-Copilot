import { z } from "zod";
import {
  type CreateRubricInput,
  type RubricItem,
  RubricSchema,
  type UpdateRubricInput,
} from "@/types/rubric";

export async function fetchRubrics(): Promise<RubricItem[]> {
  const res = await fetch("/api/rubrics");
  if (!res.ok) {
    throw new Error("Gagal mengambil data rubrik dari server");
  }
  const data = await res.json();
  return z.array(RubricSchema).parse(data);
}

export async function createRubric(input: CreateRubricInput): Promise<RubricItem> {
  const res = await fetch("/api/rubrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Gagal membuat rubrik baru");
  }
  const data = await res.json();
  return RubricSchema.parse(data);
}

export async function updateRubric({
  id,
  data,
}: {
  id: string;
  data: UpdateRubricInput;
}): Promise<RubricItem> {
  const res = await fetch(`/api/rubrics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Gagal memperbarui data rubrik");
  }
  const responseData = await res.json();
  return RubricSchema.parse(responseData);
}

export async function deleteRubric(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/rubrics/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Gagal menghapus rubrik");
  }
  return res.json();
}
