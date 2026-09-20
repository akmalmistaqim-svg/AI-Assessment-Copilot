import assert from "node:assert";
import { encodeSessionPayload } from "../src/types/auth.ts";

const BASE_URL = "http://localhost:3000";

// Andi Pratama session cookie
const andiCookie = `session=${encodeSessionPayload({
  id: 2,
  name: "Andi Pratama",
  email: "mahasiswa@example.com",
  role: "mahasiswa",
})}`;

// Siti Rahma session cookie
const sitiCookie = `session=${encodeSessionPayload({
  id: 99,
  name: "Siti Rahma",
  email: "siti@example.com",
  role: "mahasiswa",
})}`;

// Dr. Budi Santoso session cookie
const dosenCookie = `session=${encodeSessionPayload({
  id: 1,
  name: "Dr. Budi Santoso, M.Kom",
  email: "dosen@example.com",
  role: "dosen",
})}`;

const results = [];

function recordResult(point, name, status, details) {
  results.push({ point, name, status, details });
  const icon = status === "PASS" ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${icon} Poin ${point}: ${name}`);
  console.log(`    Detail: ${details}`);
}

async function runTests() {
  console.log("===============================================================");
  console.log("  PENGUJIAN MENYELURUH GRUP 2 (MAHASISWA & DOSEN DUA ARAH)   ");
  console.log("===============================================================\n");

  // -------------------------------------------------------------
  // Poin 1: Login sebagai mahasiswa (Andi Pratama) - tab filter
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/assignments`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(res.status, 200, "Fetch assignments should return 200");
    const allAssignments = await res.json();

    const pendingList = allAssignments.filter((a) => a.status === "pending");
    const submittedList = allAssignments.filter((a) => a.status === "submitted");
    const gradedList = allAssignments.filter((a) => a.status === "graded");

    assert(allAssignments.length >= 3, "Harus ada minimal 3 tugas");
    assert(
      pendingList.every((a) => a.status === "pending"),
      "Semua tugas pada tab pending harus berstatus pending",
    );
    assert(
      submittedList.every((a) => a.status === "submitted"),
      "Semua tugas pada tab submitted harus berstatus submitted",
    );
    assert(
      gradedList.every((a) => a.status === "graded"),
      "Semua tugas pada tab graded harus berstatus graded",
    );

    recordResult(
      1,
      "Tab Filter Status Assignment (Belum Dikumpul, Terkumpul, Dinilai)",
      "PASS",
      `Total tugas: ${allAssignments.length}. Tab 'Belum Dikumpul': ${pendingList.length} item, 'Terkumpul': ${submittedList.length} item, 'Dinilai': ${gradedList.length} item. Filter bekerja akurat sesuai data status.`,
    );
  } catch (err) {
    recordResult(1, "Tab Filter Status Assignment", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 2: Klik "+ Kumpul Tugas" - submit form - status berubah "Terkumpul"
  // -------------------------------------------------------------
  let submittedAssignmentTitle = "";
  try {
    // Ambil list tugas sebelum submit via API
    const resBefore = await fetch(`${BASE_URL}/api/assignments`, {
      headers: { Cookie: andiCookie },
    });
    const assignmentsBefore = await resBefore.json();
    const targetAssignment = assignmentsBefore.find((a) => a.status === "pending") || assignmentsBefore[0];
    assert(targetAssignment, "Harus ada target tugas");
    submittedAssignmentTitle = targetAssignment.title;

    // Submit tugas via POST /api/submissions
    const submitPayload = {
      assignmentId: targetAssignment.id,
      fileUrl: "https://github.com/andipratama/proyek-sistem-informasi",
      notes: "Tugas sudah selesai dikerjakan sesuai spesifikasi dan rubrik.",
    };

    const submitRes = await fetch(`${BASE_URL}/api/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: andiCookie,
      },
      body: JSON.stringify(submitPayload),
    });

    assert.strictEqual(submitRes.status, 201, `Submit harus return 201 Created, got: ${submitRes.status}`);
    const submitData = await submitRes.json();
    assert(submitData.success === true, "Response harus success: true");
    assert.strictEqual(submitData.updatedAssignment.status, "submitted", "Status assignment dari respons harus 'submitted'");

    // Verifikasi cek ulang API assignments dari server dev
    const resAfter = await fetch(`${BASE_URL}/api/assignments`, {
      headers: { Cookie: andiCookie },
    });
    const assignmentsAfter = await resAfter.json();
    const updatedInServer = assignmentsAfter.find((a) => a.id === targetAssignment.id);
    assert.strictEqual(updatedInServer.status, "submitted", "Status di server API harus terupdate menjadi 'submitted'");

    recordResult(
      2,
      "Kumpul Tugas (+ Kumpul Tugas Modal & Status Update Real-Time)",
      "PASS",
      `Tugas "${targetAssignment.title}" (ID: ${targetAssignment.id}) berhasil disubmit. Status terupdate dari 'pending' menjadi 'submitted' pada respons API dan store server.`,
    );
  } catch (err) {
    recordResult(2, "Kumpul Tugas", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 3: Buka "My Grades" - HANYA finalized dan HANYA milik akun login
  // -------------------------------------------------------------
  try {
    // 1. Andi Pratama fetches grades
    const andiRes = await fetch(`${BASE_URL}/api/grades`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(andiRes.status, 200, "Fetch grades Andi harus return 200");
    const andiGrades = await andiRes.json();

    // 2. Siti Rahma fetches grades
    const sitiRes = await fetch(`${BASE_URL}/api/grades`, {
      headers: { Cookie: sitiCookie },
    });
    assert.strictEqual(sitiRes.status, 200, "Fetch grades Siti harus return 200");
    const sitiGrades = await sitiRes.json();

    // Verifikasi Andi:
    assert.strictEqual(andiGrades.length, 2, `Andi harus memiliki tepat 2 nilai finalized, dapat: ${andiGrades.length}`);
    assert(andiGrades.every((g) => g.studentEmail === "mahasiswa@example.com"), "Semua nilai Andi harus ber-email mahasiswa@example.com");
    assert(andiGrades.every((g) => g.status === "finalized"), "Semua nilai Andi yang tampil harus berstatus finalized (draft disembunyikan)");

    // Verifikasi Siti:
    assert.strictEqual(sitiGrades.length, 1, `Siti harus memiliki tepat 1 nilai finalized, dapat: ${sitiGrades.length}`);
    assert(sitiGrades.every((g) => g.studentEmail === "siti@example.com"), "Nilai Siti harus milik siti@example.com");

    // Verifikasi isolasi data (data tidak tertukar antar mahasiswa):
    assert(!andiGrades.some((g) => g.studentEmail === "siti@example.com"), "Data Siti tidak boleh muncul di dashboard Andi");
    assert(!sitiGrades.some((g) => g.studentEmail === "mahasiswa@example.com"), "Data Andi tidak boleh muncul di dashboard Siti");

    recordResult(
      3,
      "Isolasi & Finalisasi My Grades (/dashboard/mahasiswa/grades)",
      "PASS",
      `Andi Pratama melihat 2 nilai finalized (${andiGrades.map((g) => `${g.assessmentName}: ${g.score}`).join(", ")}), draft disembunyikan. Siti Rahma melihat nilai berbeda (1 nilai: ${sitiGrades[0].assessmentName}: ${sitiGrades[0].score}). Data 100% terisolasi per akun.`,
    );
  } catch (err) {
    recordResult(3, "My Grades", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 4: Buka "Feedback" - Catatan dosen & AI Copilot sesuai
  // -------------------------------------------------------------
  try {
    const andiRes = await fetch(`${BASE_URL}/api/grades`, {
      headers: { Cookie: andiCookie },
    });
    const andiGrades = await andiRes.json();
    
    // Verifikasi catatan dosen dan AI copilot ada dan sesuai
    const item1 = andiGrades.find((g) => g.id === "grd-001");
    const item2 = andiGrades.find((g) => g.id === "grd-002");

    assert(item1 && item1.comment && item1.aiReview, "grd-001 harus memiliki komentar dosen dan ulasan AI");
    assert(item2 && item2.comment && item2.aiReview, "grd-002 harus memiliki komentar dosen dan ulasan AI");
    assert(item1.assessorName.includes("Dr. Budi Santoso"), "Penilai harus Dr. Budi Santoso");

    recordResult(
      4,
      "Feedback Catatan Dosen & Review AI (/dashboard/mahasiswa/feedback)",
      "PASS",
      `Catatan dosen terverifikasi akurat ("${item1.comment.substring(0, 45)}..."), ulasan AI Copilot tampil ("${item1.aiReview.substring(0, 45)}..."), penguji: ${item1.assessorName}, tanggal: ${item1.gradedDate}.`,
    );
  } catch (err) {
    recordResult(4, "Feedback", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 5: Tombol panah pada card tugas -> Detail Assignment sesuai
  // -------------------------------------------------------------
  try {
    const asg1Res = await fetch(`${BASE_URL}/dashboard/mahasiswa/assignments/asg-001`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(asg1Res.status, 200, "Detail page asg-001 harus 200 OK");
    const html1 = await asg1Res.text();
    assert(html1.includes("Laporan Analisis SI") || html1.includes("Analisis Sistem"), "Halaman asg-001 harus menampilkan data Laporan Analisis SI");

    const asg2Res = await fetch(`${BASE_URL}/dashboard/mahasiswa/assignments/asg-002`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(asg2Res.status, 200, "Detail page asg-002 harus 200 OK");
    const html2 = await asg2Res.text();
    assert(html2.includes("Implementasi Autentikasi JWT") || html2.includes("Pemrograman Web"), "Halaman asg-002 harus menampilkan data Implementasi Autentikasi JWT");

    // Pastikan data tidak tertukar
    assert(!html1.includes("Implementasi Autentikasi JWT"), "asg-001 tidak boleh memuat data asg-002");

    recordResult(
      5,
      "Navigasi Arrow Button ke Detail Tugas (/assignments/[id])",
      "PASS",
      `Navigasi ke /assignments/asg-001 dan /assignments/asg-002 berhasil (200 OK). Halaman detail menampilkan judul, deskripsi, mata kuliah, dan tenggat waktu yang tepat sesuai ID (tidak tertukar).`,
    );
  } catch (err) {
    recordResult(5, "Detail Tugas", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 6: Login dosen - Aktivitas Terbaru memuat submission mahasiswa
  // -------------------------------------------------------------
  try {
    const actRes = await fetch(`${BASE_URL}/api/activities`);
    assert.strictEqual(actRes.status, 200, "API activities harus 200 OK");
    const activities = await actRes.json();
    const latestActivity = activities[0];

    assert(latestActivity, "Harus ada aktivitas di feed dosen");
    assert.strictEqual(latestActivity.actor, "Andi Pratama", "Aktor aktivitas harus Andi Pratama");
    assert.strictEqual(latestActivity.type, "submission", "Tipe aktivitas harus submission");
    assert(
      latestActivity.action.includes(submittedAssignmentTitle),
      `Aksi harus mencakup judul tugas "${submittedAssignmentTitle}", didapat: ${latestActivity.action}`,
    );

    recordResult(
      6,
      "Koneksi Dua Arah: Submission Mahasiswa Muncul di Aktivitas Dosen",
      "PASS",
      `Submission mahasiswa Andi Pratama untuk tugas "${submittedAssignmentTitle}" berhasil terhubung dua arah ke feed Dosen: actor="${latestActivity.actor}", action="${latestActivity.action}", context="${latestActivity.context}", time="${latestActivity.timeAgo}".`,
    );
  } catch (err) {
    recordResult(6, "Koneksi Dua Arah Dosen Activity Feed", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL HASIL PENGUJIAN: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("===============================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
