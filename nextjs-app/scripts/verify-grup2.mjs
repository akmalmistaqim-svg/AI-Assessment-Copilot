import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  assertRouteHasStandardPages,
  createTestRunner,
  srcDir,
} from "./test-helpers.mjs";

const runner = createTestRunner("VERIFIKASI PERBAIKAN SEARCH + GRUP 2 (MAHASISWA)");
const { test } = runner;

// 1. Verifikasi Reset Search Query Antar Halaman
test("Search Reset: search-input.tsx mereset searchQuery ketika pathname berubah", () => {
  const content = fs.readFileSync(path.join(srcDir, "components/search-input.tsx"), "utf-8");
  assert(content.includes("usePathname"), "Harus mengimpor usePathname");
  assert(content.includes("useEffect"), "Harus menggunakan useEffect");
  assert(content.includes('setSearchQuery("")'), "Harus memanggil setSearchQuery('')");
  assert(content.includes("[pathname, setSearchQuery]"), "Harus mendengarkan dependensi pathname");
});

// 2. Verifikasi Poin 1: My Grades
test("Poin 1: Rute /dashboard/mahasiswa/grades lengkap dengan page, loading, dan error", () => {
  assertRouteHasStandardPages("dashboard/mahasiswa/grades");
});

test("Poin 1: Sidebar Mahasiswa 'My Grades' terhubung ke /dashboard/mahasiswa/grades", () => {
  const layout = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
  assert(
    layout.includes('{ label: "My Grades", href: "/dashboard/mahasiswa/grades", icon: "Award" }'),
    "My Grades harus terhubung ke rute nyata",
  );
});

test("Poin 1: Logika filter nilai hanya mengembalikan data akun mahasiswa yang login (finalized only)", async () => {
  const { getGradesByStudentEmail } = await import("../src/lib/gradeStore.ts");
  const andiGrades = getGradesByStudentEmail("mahasiswa@example.com", true);

  assert(
    Array.isArray(andiGrades) && andiGrades.length === 2,
    `Harus mengembalikan 2 nilai finalized untuk Andi, dapat: ${andiGrades.length}`,
  );
  assert(
    andiGrades.every((g) => g.studentEmail === "mahasiswa@example.com"),
    "Seluruh data harus milik mahasiswa@example.com",
  );
  assert(
    andiGrades.every((g) => g.status === "finalized"),
    "Hanya nilai finalized yang tampil untuk mahasiswa",
  );

  // Pastikan data milik Siti Rahma tidak bocor ke Andi
  assert(
    !andiGrades.some((g) => g.studentEmail === "siti@example.com"),
    "Nilai milik mahasiswa lain tidak boleh bocor",
  );
});

// 3. Verifikasi Poin 2: Feedback
test("Poin 2: Rute /dashboard/mahasiswa/feedback lengkap dengan page, loading, dan error", () => {
  assertRouteHasStandardPages("dashboard/mahasiswa/feedback");
});

test("Poin 2: Sidebar Mahasiswa 'Feedback' terhubung ke /dashboard/mahasiswa/feedback", () => {
  const layout = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
  assert(
    layout.includes(
      '{ label: "Feedback", href: "/dashboard/mahasiswa/feedback", icon: "MessageSquare" }',
    ),
    "Feedback harus terhubung ke rute nyata",
  );
});

test("Poin 2: Komponen feedback menampilkan komentar pengajar dan ulasan AI Copilot", () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/mahasiswa-feedback-full-section.tsx"),
    "utf-8",
  );
  assert(content.includes("item.comment"), "Harus menampilkan komentar pengajar");
  assert(content.includes("item.aiReview"), "Harus menampilkan ulasan AI Copilot");
  assert(content.includes("searchQuery"), "Mendukung filter pencarian real-time");
});

// 4. Verifikasi Poin 3: Submit Tugas / Kumpul Tugas
test("Poin 3: Modal Submit Tugas (submit-assignment-modal.tsx) terpasang di dashboard mahasiswa", () => {
  const page = fs.readFileSync(path.join(srcDir, "app/dashboard/mahasiswa/page.tsx"), "utf-8");
  assert(
    page.includes("<SubmitAssignmentButton />"),
    "Tombol SubmitAssignmentButton harus terpasang di header",
  );
  assert(
    page.includes("<SubmitAssignmentModal />"),
    "Modal SubmitAssignmentModal harus terpasang di halaman",
  );
});

test("Poin 3: API route /api/submissions memiliki validasi Zod dan proteksi role mahasiswa", () => {
  const route = fs.readFileSync(path.join(srcDir, "app/api/submissions/route.ts"), "utf-8");
  assert(route.includes("requireMahasiswaRole"), "Harus mengecek session mahasiswa");
  assert(route.includes("CreateSubmissionInputSchema.parse"), "Harus memvalidasi input dengan Zod");
  assert(
    route.includes('status: "submitted"'),
    "Harus memperbarui status assignment menjadi submitted",
  );
});

test("Poin 3: Alur pengumpulan tugas mengubah status assignment menjadi 'submitted'", async () => {
  const { updateAssignmentInStore, getAssignmentByIdFromStore } = await import(
    "../src/lib/assignmentStore.ts"
  );
  const { addSubmissionToStore } = await import("../src/lib/submissionStore.ts");

  // Ambil assignment pending (asg-002)
  const target = getAssignmentByIdFromStore("asg-002");
  assert(
    target && target.status === "pending",
    "Target tugas asg-002 harus berstatus pending sebelum disubmit",
  );

  // Simulasi submit tugas
  updateAssignmentInStore("asg-002", { status: "submitted" });
  addSubmissionToStore({
    id: "sub-test-01",
    assignmentId: "asg-002",
    assignmentTitle: target.title,
    course: target.course,
    studentId: 2,
    studentName: "Andi Pratama",
    studentEmail: "mahasiswa@example.com",
    fileUrl: "https://github.com/andi/web-crud",
    notes: "Sudah selesai dikerjakan.",
    submittedAt: "20 Sep 2026, 08:30",
  });

  const updatedTarget = getAssignmentByIdFromStore("asg-002");
  assert(updatedTarget?.status === "submitted", "Status tugas harus berubah menjadi 'submitted'");
});

const summary = runner.summary();
if (summary.failed > 0) process.exit(1);
