import { z } from "zod";
import { type GradeItem, GradeItemSchema } from "@/types/grade";

export async function fetchGrades(): Promise<GradeItem[]> {
  const res = await fetch("/api/grades");
  if (!res.ok) {
    throw new Error("Gagal mengambil data nilai dari server");
  }
  const data = await res.json();
  return z.array(GradeItemSchema).parse(data);
}
