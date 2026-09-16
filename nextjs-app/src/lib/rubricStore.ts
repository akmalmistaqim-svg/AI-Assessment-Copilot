import type { RubricItem } from "@/types/rubric";

export let rubricsStore: RubricItem[] = [
  {
    id: "rub-001",
    name: "Rubrik Penilaian Laporan Web",
    course: "Pemrograman Web",
    criteriaCount: 5,
    totalWeight: 100,
    status: "active",
  },
  {
    id: "rub-002",
    name: "Rubrik Desain Skema ERD",
    course: "Basis Data",
    criteriaCount: 4,
    totalWeight: 100,
    status: "active",
  },
  {
    id: "rub-003",
    name: "Rubrik Coding Convention & Pattern",
    course: "Object Oriented Programming",
    criteriaCount: 6,
    totalWeight: 100,
    status: "active",
  },
];

export function getRubricsStore(): RubricItem[] {
  return rubricsStore;
}

export function addRubricToStore(newRubric: RubricItem): RubricItem {
  rubricsStore = [newRubric, ...rubricsStore];
  return newRubric;
}

export function updateRubricInStore(
  id: string,
  updatedFields: Partial<RubricItem>,
): RubricItem | null {
  const index = rubricsStore.findIndex((r) => r.id === id);
  if (index === -1) return null;
  const existing = rubricsStore[index];
  if (!existing) return null;
  const updated = { ...existing, ...updatedFields };
  rubricsStore[index] = updated;
  return updated;
}

export function deleteRubricFromStore(id: string): boolean {
  const initialLen = rubricsStore.length;
  rubricsStore = rubricsStore.filter((r) => r.id !== id);
  return rubricsStore.length < initialLen;
}
