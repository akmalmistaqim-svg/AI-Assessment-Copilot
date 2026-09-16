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

const activities: ActivityItem[] = [
  {
    id: "act-001",
    type: "submission",
    actor: "Andi Pratama",
    action: "submitted an assignment",
    context: "Pemrograman Web",
    timeAgo: "10 minutes ago",
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

export async function fetchDosenStats(): Promise<DosenStats> {
  await delay(300);
  return {
    totalClasses: classes.length,
    totalAssignments: 24,
    pendingReviews: 8,
    completedAssessments: 16,
  };
}

export async function fetchMahasiswaStats(): Promise<MahasiswaStats> {
  await delay(300);
  return {
    activeAssignments: 3,
    submitted: 7,
    pendingGrades: 2,
    graded: 5,
    avgScore: 89.2,
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
