import type { GradeItem } from "@/types/grade";

export let gradesStore: GradeItem[] = [
  {
    id: "grd-001",
    assessmentId: "asm-001",
    assessmentName: "Penilaian Tugas 1 HTML/CSS",
    course: "Pemrograman Web",
    studentId: 2,
    studentEmail: "mahasiswa@example.com",
    studentName: "Andi Pratama",
    score: 92,
    maxScore: 100,
    status: "finalized",
    gradedDate: "14 Sep 2026",
    assessorName: "Dr. Budi Santoso, M.Kom",
    comment:
      "Struktur semantik HTML sangat rapi dan styling CSS modular responsif sesuai standar. Pertahankan!",
    aiReview:
      "Validasi W3C 100% valid. Aksesibilitas ARIA diimplementasikan secara tepat pada elemen drawer dan navigasi.",
    rubricName: "Rubrik Penilaian Tugas Akhir",
  },
  {
    id: "grd-002",
    assessmentId: "asm-002",
    assessmentName: "Review Skema Relasi ERD",
    course: "Basis Data",
    studentId: 2,
    studentEmail: "mahasiswa@example.com",
    studentName: "Andi Pratama",
    score: 88,
    maxScore: 100,
    status: "finalized",
    gradedDate: "18 Sep 2026",
    assessorName: "Dr. Budi Santoso, M.Kom",
    comment:
      "Normalisasi bentuk 1NF hingga 3NF sudah konsisten, foreign key indexing terdefinisi jelas.",
    aiReview:
      "Tidak terdeteksi dependensi transitif. Integritas referensial dan foreign key constraint optimal.",
    rubricName: "Rubrik Presentasi Proyek",
  },
  {
    id: "grd-003",
    assessmentId: "asm-003",
    assessmentName: "Assessment Draft OOP Patterns",
    course: "Object Oriented Programming",
    studentId: 2,
    studentEmail: "mahasiswa@example.com",
    studentName: "Andi Pratama",
    score: 75,
    maxScore: 100,
    status: "draft",
    gradedDate: "20 Sep 2026",
    assessorName: "Dr. Budi Santoso, M.Kom",
    comment: "Draft penilaian sementara: implementasi Observer pattern masih perlu disempurnakan.",
    aiReview: "Perlu penambahan interface contract pada observer subscriber.",
    rubricName: "Rubrik Penilaian Tugas Akhir",
  },
  {
    id: "grd-004",
    assessmentId: "asm-001",
    assessmentName: "Penilaian Tugas 1 HTML/CSS",
    course: "Pemrograman Web",
    studentId: 99,
    studentEmail: "siti@example.com",
    studentName: "Siti Rahma",
    score: 95,
    maxScore: 100,
    status: "finalized",
    gradedDate: "14 Sep 2026",
    assessorName: "Dr. Budi Santoso, M.Kom",
    comment: "Kompilasi CSS sangat efisien dan penggunaan utility classes terstruktur rapi.",
    aiReview: "Lighthouse score performa dan SEO mencapai 98/100.",
    rubricName: "Rubrik Penilaian Tugas Akhir",
  },
];

export function getGradesStore(): GradeItem[] {
  return gradesStore;
}

export function getGradesByStudentEmail(email: string, finalizedOnly = false): GradeItem[] {
  return gradesStore.filter((g) => {
    const isSameStudent = g.studentEmail.toLowerCase() === email.toLowerCase();
    if (!isSameStudent) return false;
    if (finalizedOnly && g.status !== "finalized") return false;
    return true;
  });
}

export function addGradeToStore(newGrade: GradeItem): GradeItem {
  gradesStore = [newGrade, ...gradesStore];
  return newGrade;
}
