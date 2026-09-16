import type { AssessmentItem } from "@/types/assessment";

export let assessmentsStore: AssessmentItem[] = [
  {
    id: "asm-001",
    name: "Penilaian Tugas 1 HTML/CSS",
    course: "Pemrograman Web",
    status: "finalized",
    gradedSubmissionsCount: 32,
  },
  {
    id: "asm-002",
    name: "Review Skema Relasi ERD",
    course: "Basis Data",
    status: "in-review",
    gradedSubmissionsCount: 18,
  },
  {
    id: "asm-003",
    name: "Assessment Draft OOP Patterns",
    course: "Object Oriented Programming",
    status: "draft",
    gradedSubmissionsCount: 0,
  },
];

export function getAssessmentsStore(): AssessmentItem[] {
  return assessmentsStore;
}

export function addAssessmentToStore(newAssessment: AssessmentItem): AssessmentItem {
  assessmentsStore = [newAssessment, ...assessmentsStore];
  return newAssessment;
}

export function updateAssessmentInStore(
  id: string,
  updatedFields: Partial<AssessmentItem>,
): AssessmentItem | null {
  const index = assessmentsStore.findIndex((a) => a.id === id);
  if (index === -1) return null;
  const existing = assessmentsStore[index];
  if (!existing) return null;
  const updated = { ...existing, ...updatedFields };
  assessmentsStore[index] = updated;
  return updated;
}

export function deleteAssessmentFromStore(id: string): boolean {
  const initialLen = assessmentsStore.length;
  assessmentsStore = assessmentsStore.filter((a) => a.id !== id);
  return assessmentsStore.length < initialLen;
}
