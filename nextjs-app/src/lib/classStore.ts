import type { ClassItem } from "@/types/class";

// In-memory store on the server (persists across API calls while dev server runs)
export let classesStore: ClassItem[] = [
  {
    id: "cls-001",
    name: "Pemrograman Web",
    studentsCount: 32,
    assignmentsCount: 4,
    status: "active",
    semester: "Semester Genap 2025/2026",
    lecturerName: "Dr. Budi Santoso, M.Kom",
    enrolledStudentIds: [2],
  },
  {
    id: "cls-002",
    name: "Basis Data",
    studentsCount: 28,
    assignmentsCount: 3,
    status: "active",
    semester: "Semester Genap 2025/2026",
    lecturerName: "Dr. Budi Santoso, M.Kom",
    enrolledStudentIds: [2],
  },
  {
    id: "cls-003",
    name: "Object Oriented Programming",
    studentsCount: 30,
    assignmentsCount: 5,
    status: "active",
    semester: "Semester Genap 2025/2026",
    lecturerName: "Dr. Budi Santoso, M.Kom",
    enrolledStudentIds: [2],
  },
  {
    id: "cls-004",
    name: "Kecerdasan Buatan",
    studentsCount: 25,
    assignmentsCount: 2,
    status: "active",
    semester: "Semester Genap 2025/2026",
    lecturerName: "Dr. Budi Santoso, M.Kom",
    enrolledStudentIds: [2],
  },
];

export function getClassesStore(): ClassItem[] {
  return classesStore;
}

export function getClassByIdFromStore(id: string): ClassItem | null {
  return classesStore.find((c) => c.id === id) ?? null;
}

export function getClassesByStudentId(studentId: number): ClassItem[] {
  return classesStore.filter((c) => c.enrolledStudentIds?.includes(studentId));
}

export function addClassToStore(newClass: ClassItem): ClassItem {
  classesStore = [newClass, ...classesStore];
  return newClass;
}

export function updateClassInStore(
  id: string,
  updatedFields: Partial<ClassItem>,
): ClassItem | null {
  const index = classesStore.findIndex((c) => c.id === id);
  if (index === -1) return null;
  const existing = classesStore[index];
  if (!existing) return null;
  const updated = { ...existing, ...updatedFields };
  classesStore[index] = updated;
  return updated;
}

export function deleteClassFromStore(id: string): boolean {
  const initialLen = classesStore.length;
  classesStore = classesStore.filter((c) => c.id !== id);
  return classesStore.length < initialLen;
}
