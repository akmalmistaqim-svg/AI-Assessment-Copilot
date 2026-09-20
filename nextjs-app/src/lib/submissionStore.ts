import type { SubmissionItem } from "@/types/submission";

export let submissionsStore: SubmissionItem[] = [
  {
    id: "sub-001",
    assignmentId: "asg-001",
    assignmentTitle: "Laporan Sistem Informasi",
    course: "Analisis Sistem",
    studentId: 2,
    studentName: "Andi Pratama",
    studentEmail: "mahasiswa@example.com",
    fileUrl: "https://github.com/akmalmistaqim-svg/AI-Assessment-Copilot",
    notes: "Pengumpulan tugas analisis kebutuhan sistem informasi akademik.",
    submittedAt: "18 Sep 2026, 14:30",
  },
];

export function getSubmissionsStore(): SubmissionItem[] {
  return submissionsStore;
}

export function getSubmissionsByStudentEmail(email: string): SubmissionItem[] {
  return submissionsStore.filter((s) => s.studentEmail.toLowerCase() === email.toLowerCase());
}

export function addSubmissionToStore(sub: SubmissionItem): SubmissionItem {
  submissionsStore = [sub, ...submissionsStore];
  return sub;
}
