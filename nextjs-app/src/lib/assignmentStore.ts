import type { AssignmentItem } from "@/types/assignment";

export let assignmentsStore: AssignmentItem[] = [
  {
    id: "asg-001",
    title: "Laporan Sistem Informasi",
    course: "Analisis Sistem",
    deadline: "18 Sep 2026",
    description: "Buat laporan analisis kebutuhan pengguna untuk sistem e-learning kampus.",
    status: "submitted",
  },
  {
    id: "asg-002",
    title: "Website CRUD Next.js",
    course: "Pemrograman Web",
    deadline: "22 Sep 2026",
    description: "Implementasi fitur CRUD dengan Next.js App Router, Tailwind CSS, dan Zustand.",
    status: "pending",
  },
  {
    id: "asg-003",
    title: "Database Relational Design",
    course: "Basis Data",
    deadline: "25 Sep 2026",
    description:
      "Perancangan skema database relasional lengkap dengan constraint dan relasi tabel.",
    status: "graded",
  },
  {
    id: "asg-004",
    title: "OOP Design Patterns Implementation",
    course: "Object Oriented Programming",
    deadline: "28 Sep 2026",
    description: "Penerapan pola desain Factory dan Observer pada aplikasi simulasi bisnis.",
    status: "pending",
  },
];

export function getAssignmentsStore(): AssignmentItem[] {
  return assignmentsStore;
}

export function addAssignmentToStore(newAssignment: AssignmentItem): AssignmentItem {
  assignmentsStore = [newAssignment, ...assignmentsStore];
  return newAssignment;
}

export function updateAssignmentInStore(
  id: string,
  updatedFields: Partial<AssignmentItem>,
): AssignmentItem | null {
  const index = assignmentsStore.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const existing = assignmentsStore[index];
  if (!existing) return null;
  const updated = { ...existing, ...updatedFields };
  assignmentsStore[index] = updated;
  return updated;
}

export function deleteAssignmentFromStore(id: string): boolean {
  const initialLen = assignmentsStore.length;
  assignmentsStore = assignmentsStore.filter((a) => a.id !== id);
  return assignmentsStore.length < initialLen;
}
