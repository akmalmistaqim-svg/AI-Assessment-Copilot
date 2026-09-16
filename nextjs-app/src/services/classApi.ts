import { z } from "zod";
import {
  type ClassItem,
  ClassSchema,
  type CreateClassInput,
  type UpdateClassInput,
} from "@/types/class";

export async function fetchClasses(): Promise<ClassItem[]> {
  const res = await fetch("/api/classes");
  if (!res.ok) {
    throw new Error("Gagal mengambil data kelas dari server");
  }
  const data = await res.json();
  // Zod runtime validation
  return z.array(ClassSchema).parse(data);
}

export async function createClass(input: CreateClassInput): Promise<ClassItem> {
  const res = await fetch("/api/classes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Gagal membuat kelas baru");
  }
  const data = await res.json();
  return ClassSchema.parse(data);
}

export async function updateClass({
  id,
  data,
}: {
  id: string;
  data: UpdateClassInput;
}): Promise<ClassItem> {
  const res = await fetch(`/api/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Gagal memperbarui data kelas");
  }
  const responseData = await res.json();
  return ClassSchema.parse(responseData);
}

export async function deleteClass(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/classes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Gagal menghapus kelas");
  }
  return res.json();
}
