import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    failed++;
  }
}

console.log("=== VERIFIKASI GRUP 1 (QUICK WINS) ===");

// 1. Verifikasi "Lihat Semua Tugas" di dashboard mahasiswa
test('Point 1: assignments-list-section-server.tsx menggunakan <Link href="/dashboard/mahasiswa/assignments">', () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/assignments-list-section-server.tsx"),
    "utf-8",
  );
  assert(content.includes("<Link"), "Harus menggunakan komponen Link");
  assert(
    content.includes('href="/dashboard/mahasiswa/assignments"'),
    "Harus mengarah ke /dashboard/mahasiswa/assignments",
  );
  assert(
    !content.includes(
      '<span className="text-xs text-primary-green font-medium cursor-pointer hover:underline">',
    ),
    "Span mati harus sudah dihapus",
  );
});

test("Point 1: Rute /dashboard/mahasiswa/assignments sudah dibuat lengkap dengan loading & error", () => {
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/page.tsx")),
    "page.tsx harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/loading.tsx")),
    "loading.tsx harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/error.tsx")),
    "error.tsx harus ada",
  );
});

test("Point 1: Sidebar Mahasiswa 'My Assignments' terhubung ke /dashboard/mahasiswa/assignments", () => {
  const layoutContent = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
  assert(
    layoutContent.includes(
      '{ label: "My Assignments", href: "/dashboard/mahasiswa/assignments", icon: "FileText" }',
    ),
    "My Assignments harus memiliki rute nyata bukan #",
  );
});

// 2. Verifikasi "Lihat Semua Aktivitas" di dashboard dosen
test('Point 2: activity-feed-section.tsx menggunakan <Link href="/dashboard/dosen/activities">', () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/activity-feed-section.tsx"),
    "utf-8",
  );
  assert(content.includes("<Link"), "Harus menggunakan komponen Link");
  assert(
    content.includes('href="/dashboard/dosen/activities"'),
    "Harus mengarah ke /dashboard/dosen/activities",
  );
});

test("Point 2: Rute /dashboard/dosen/activities sudah dibuat lengkap dengan loading & error", () => {
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/dosen/activities/page.tsx")),
    "page.tsx activities harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/dosen/activities/loading.tsx")),
    "loading.tsx activities harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/dosen/activities/error.tsx")),
    "error.tsx activities harus ada",
  );
});

// 3. Verifikasi Tombol Panah di MahasiswaAssignmentCard
test("Point 3: mahasiswa-assignment-card.tsx memiliki Link menuju /dashboard/mahasiswa/assignments/${assignment.id}", () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/cards/mahasiswa-assignment-card.tsx"),
    "utf-8",
  );
  assert(content.includes("Link"), "Harus mengimpor dan menggunakan Link");
  assert(
    content.includes("/dashboard/mahasiswa/assignments/${assignment.id}"),
    "Harus mengarah ke detail assignment",
  );
});

test("Point 3: Rute detail /dashboard/mahasiswa/assignments/[id] sudah dibuat lengkap dengan loading & error", () => {
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/[id]/page.tsx")),
    "page.tsx detail harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/[id]/loading.tsx")),
    "loading.tsx detail harus ada",
  );
  assert(
    fs.existsSync(path.join(srcDir, "app/dashboard/mahasiswa/assignments/[id]/error.tsx")),
    "error.tsx detail harus ada",
  );

  const detailContent = fs.readFileSync(
    path.join(srcDir, "app/dashboard/mahasiswa/assignments/[id]/page.tsx"),
    "utf-8",
  );
  assert(detailContent.includes("assignment.title"), "Menampilkan judul");
  assert(detailContent.includes("assignment.description"), "Menampilkan deskripsi");
  assert(detailContent.includes("assignment.deadline"), "Menampilkan deadline");
  assert(detailContent.includes("assignment.status"), "Menampilkan status");
});

// 4. Verifikasi Global Search filtering
test("Point 4: ClassListSection membaca searchQuery dan memfilter daftar kelas", () => {
  const content = fs.readFileSync(path.join(srcDir, "components/class-list-section.tsx"), "utf-8");
  assert(content.includes("searchQuery"), "Harus membaca searchQuery");
  assert(content.includes("filteredClasses"), "Harus mengomputasi filteredClasses");
});

test("Point 4: RubricListSection membaca searchQuery dan memfilter daftar rubrik", () => {
  const content = fs.readFileSync(path.join(srcDir, "components/rubric-list-section.tsx"), "utf-8");
  assert(content.includes("searchQuery"), "Harus membaca searchQuery");
  assert(content.includes("filteredRubrics"), "Harus mengomputasi filteredRubrics");
});

test("Point 4: AssignmentListSection membaca searchQuery dan memfilter daftar tugas dosen", () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/assignment-list-section.tsx"),
    "utf-8",
  );
  assert(content.includes("searchQuery"), "Harus membaca searchQuery");
  assert(content.includes("filteredAssignments"), "Harus mengomputasi filteredAssignments");
});

test("Point 4: AssessmentListSection membaca searchQuery dan memfilter daftar assessment dosen", () => {
  const content = fs.readFileSync(
    path.join(srcDir, "components/assessment-list-section.tsx"),
    "utf-8",
  );
  assert(content.includes("searchQuery"), "Harus membaca searchQuery");
  assert(content.includes("filteredAssessments"), "Harus mengomputasi filteredAssessments");
});

test("Point 4: Komponen tugas mahasiswa membaca searchQuery dan memfilter daftar tugas mahasiswa", () => {
  const contentPreview = fs.readFileSync(
    path.join(srcDir, "components/assignments-list-section-server.tsx"),
    "utf-8",
  );
  assert(contentPreview.includes("searchQuery"), "Section preview harus membaca searchQuery");
  assert(
    contentPreview.includes("filteredAssignments"),
    "Section preview harus memfilter assignments",
  );

  const contentFull = fs.readFileSync(
    path.join(srcDir, "components/mahasiswa-assignment-list-full.tsx"),
    "utf-8",
  );
  assert(contentFull.includes("searchQuery"), "Section full-list harus membaca searchQuery");
  assert(
    contentFull.includes("filteredAssignments"),
    "Section full-list harus memfilter assignments",
  );
});

console.log(`\nHASIL VERIFIKASI: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
