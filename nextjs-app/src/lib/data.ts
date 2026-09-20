// ============================================================
// Mock Data for Dashboard Pages
// Mirrors the JSON data from the vanilla project
// ============================================================

// --- Types ---

export interface ClassItem {
  id: string;
  name: string;
  studentsCount: number;
  assignmentsCount: number;
  status: "active" | "archived";
  semester: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  deadline: string;
  status: "submitted" | "pending" | "graded";
}

export interface ActivityItem {
  id: string;
  type: "submission" | "assignment" | "assessment" | "feedback";
  actor: string;
  action: string;
  context: string;
  timeAgo: string;
  icon: string;
  color: string;
}

export interface FeedbackItem {
  id: string;
  assignmentTitle: string;
  course: string;
  score: number;
  maxScore: number;
  status: "graded";
  assessor: string;
  comment: string;
  submittedDate: string;
  gradedDate: string;
}

export interface DosenStats {
  totalClasses: number;
  totalAssignments: number;
  pendingReviews: number;
  completedAssessments: number;
}

export interface MahasiswaStats {
  activeAssignments: number;
  submitted: number;
  pendingGrades: number;
  graded: number;
  avgScore: number;
}

// --- Mock Data ---

const classes: ClassItem[] = [
  {
    id: "cls-001",
    name: "Pemrograman Web",
    studentsCount: 32,
    assignmentsCount: 4,
    status: "active",
    semester: "Semester Genap 2025/2026",
  },
  {
    id: "cls-002",
    name: "Basis Data",
    studentsCount: 28,
    assignmentsCount: 3,
    status: "active",
    semester: "Semester Genap 2025/2026",
  },
  {
    id: "cls-003",
    name: "Object Oriented Programming",
    studentsCount: 30,
    assignmentsCount: 5,
    status: "active",
    semester: "Semester Genap 2025/2026",
  },
  {
    id: "cls-004",
    name: "Kecerdasan Buatan",
    studentsCount: 25,
    assignmentsCount: 2,
    status: "active",
    semester: "Semester Genap 2025/2026",
  },
];

const assignments: AssignmentItem[] = [
  {
    id: "asg-001",
    title: "Laporan Sistem",
    course: "Analisis Sistem",
    deadline: "12 Sep 2026",
    status: "submitted",
  },
  {
    id: "asg-002",
    title: "Website CRUD",
    course: "Pemrograman Web",
    deadline: "15 Sep 2026",
    status: "pending",
  },
  {
    id: "asg-003",
    title: "Database Design",
    course: "Basis Data",
    deadline: "18 Sep 2026",
    status: "graded",
  },
  {
    id: "asg-004",
    title: "OOP Design Patterns",
    course: "Object Oriented Programming",
    deadline: "22 Sep 2026",
    status: "pending",
  },
];

export const activities: ActivityItem[] = [
  {
    id: "act-001",
    type: "submission",
    actor: "Andi Pratama",
    action: "mengumpulkan tugas Laporan Sistem Informasi",
    context: "Analisis Sistem",
    timeAgo: "10 menit yang lalu",
    icon: "upload",
    color: "emerald",
  },
  {
    id: "act-002",
    type: "assignment",
    actor: "Siti",
    action: "uploaded a new assignment",
    context: "Basis Data",
    timeAgo: "45 minutes ago",
    icon: "file-plus",
    color: "emerald",
  },
  {
    id: "act-003",
    type: "assessment",
    actor: "System AI",
    action: "Assessment completed for Tugas 2 OOP",
    context: "Object Oriented Programming",
    timeAgo: "2 hours ago",
    icon: "check",
    color: "emerald",
  },
  {
    id: "act-004",
    type: "feedback",
    actor: "Dr. Budi Santoso",
    action: "Feedback approved for 12 submissions",
    context: "Basis Data",
    timeAgo: "Yesterday",
    icon: "message-square",
    color: "blue",
  },
];

const feedback: FeedbackItem = {
  id: "fb-001",
  assignmentTitle: "Website CRUD",
  course: "Pemrograman Web • Tugas Akhir",
  score: 88,
  maxScore: 100,
  status: "graded",
  assessor: "Dr. Budi Santoso",
  comment: "Struktur aplikasi sudah baik dan implementasi fitur utama sudah berjalan.",
  submittedDate: "10 Sep 2026",
  gradedDate: "11 Sep 2026",
};

// --- Data Fetching Functions (simulate server-side async) ---

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { getAssessmentsStore } from "@/lib/assessmentStore";
import { getAssignmentsStore } from "@/lib/assignmentStore";
import { getClassesStore } from "@/lib/classStore";
import { getGradesByStudentEmail } from "@/lib/gradeStore";
import { getSubmissionsStore } from "@/lib/submissionStore";

export async function fetchDosenStats(): Promise<DosenStats> {
  await delay(100);
  const currentClasses = getClassesStore();
  const currentAssignments = getAssignmentsStore();
  const currentSubmissions = getSubmissionsStore();
  const currentAssessments = getAssessmentsStore();

  return {
    totalClasses: currentClasses.length,
    totalAssignments: currentAssignments.length,
    pendingReviews: currentSubmissions.length,
    completedAssessments: currentAssessments.filter((a) => a.status === "finalized").length,
  };
}

export async function fetchMahasiswaStats(): Promise<MahasiswaStats> {
  await delay(100);
  const currentAssignments = getAssignmentsStore();
  const pending = currentAssignments.filter((a) => a.status === "pending").length;
  const submitted = currentAssignments.filter((a) => a.status === "submitted").length;
  const graded = currentAssignments.filter((a) => a.status === "graded").length;

  const grades = getGradesByStudentEmail("mahasiswa@example.com", true);
  const avg =
    grades.length > 0
      ? Number((grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1))
      : 0;

  return {
    activeAssignments: pending,
    submitted: submitted,
    pendingGrades: submitted,
    graded: graded,
    avgScore: avg,
  };
}

export async function fetchClasses(): Promise<ClassItem[]> {
  await delay(400);
  return classes;
}

export async function fetchAssignments(): Promise<AssignmentItem[]> {
  await delay(400);
  return assignments;
}

export async function fetchActivities(): Promise<ActivityItem[]> {
  await delay(350);
  return activities;
}

export async function fetchFeedback(): Promise<FeedbackItem> {
  await delay(350);
  return feedback;
}

export function addActivity(newActivity: ActivityItem): void {
  activities.unshift(newActivity);
}
