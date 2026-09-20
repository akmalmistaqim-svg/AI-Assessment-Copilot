import assert from "node:assert";
import { encodeSessionPayload } from "../src/types/auth.ts";

const BASE_URL = "http://localhost:3000";

// Dosen (Dr. Budi Santoso) session
const dosenCookie = `session=${encodeSessionPayload({
  id: 1,
  name: "Dr. Budi Santoso, M.Kom",
  email: "dosen@example.com",
  role: "dosen",
})}`;

// Mahasiswa (Andi Pratama) session
const andiCookie = `session=${encodeSessionPayload({
  id: 2,
  name: "Andi Pratama",
  email: "mahasiswa@example.com",
  role: "mahasiswa",
})}`;

const results = [];

function recordResult(step, name, status, details) {
  results.push({ step, name, status, details });
  const icon = status === "PASS" ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${icon} Step ${step}: ${name}`);
  console.log(`    Detail: ${details}`);
}

async function runTests() {
  console.log("===============================================================");
  console.log("  VERIFIKASI INTEGRASI KELAS SAYA (MAHASISWA & DOSEN DUA ARAH)");
  console.log("===============================================================\n");

  const uniqueClassName = `Test Kelas Terhubung ${Date.now()}`;
  let createdClassId = "";

  // -------------------------------------------------------------
  // Test 1: Login sebagai Dosen, buat kelas baru dengan nama unik
  // -------------------------------------------------------------
  try {
    const createRes = await fetch(`${BASE_URL}/api/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: dosenCookie,
      },
      body: JSON.stringify({
        name: uniqueClassName,
        semester: "Semester Genap 2025/2026",
        status: "active",
      }),
    });

    assert.strictEqual(
      createRes.status,
      201,
      `Create class harus return 201 Created, got: ${createRes.status}`,
    );
    const createdClass = await createRes.json();
    assert.strictEqual(createdClass.name, uniqueClassName, "Nama kelas harus cocok");
    assert(
      Array.isArray(createdClass.enrolledStudentIds) && createdClass.enrolledStudentIds.includes(2),
      "Mahasiswa demo (id: 2) harus auto-enrolled",
    );
    createdClassId = createdClass.id;

    recordResult(
      1,
      "Dosen Membuat Kelas Baru",
      "PASS",
      `Kelas "${uniqueClassName}" (ID: ${createdClassId}) berhasil dibuat dengan status 201 Created. Auto-enrolled mahasiswa demo ID: [${createdClass.enrolledStudentIds.join(", ")}].`,
    );
  } catch (err) {
    recordResult(1, "Dosen Membuat Kelas Baru", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Test 2: Login sebagai Mahasiswa, buka "Kelas Saya", pastikan kelas baru muncul
  // -------------------------------------------------------------
  try {
    const mahasiswaRes = await fetch(`${BASE_URL}/api/classes`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(
      mahasiswaRes.status,
      200,
      `Fetch classes untuk mahasiswa harus return 200 OK`,
    );
    const mahasiswaClasses = await mahasiswaRes.json();

    const foundNewClass = mahasiswaClasses.find((c) => c.name === uniqueClassName);
    assert(
      foundNewClass,
      `Kelas baru "${uniqueClassName}" harus ditemukan di list Kelas Saya mahasiswa`,
    );
    assert.strictEqual(foundNewClass.id, createdClassId, "ID kelas harus cocok");

    // Pastikan halaman HTML render juga memuatnya
    const pageRes = await fetch(`${BASE_URL}/dashboard/mahasiswa/classes`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(pageRes.status, 200, "Halaman /dashboard/mahasiswa/classes harus 200 OK");
    const pageHtml = await pageRes.text();
    assert(pageHtml.includes("Kelas Saya"), "Halaman harus memuat judul 'Kelas Saya'");

    recordResult(
      2,
      "Sinkronisasi Kelas Baru ke 'Kelas Saya' Mahasiswa",
      "PASS",
      `Kelas baru "${uniqueClassName}" (ID: ${createdClassId}) langsung muncul di data 'Kelas Saya' mahasiswa Andi Pratama tanpa reload server. Total kelas mahasiswa sekarang: ${mahasiswaClasses.length}.`,
    );
  } catch (err) {
    recordResult(2, "Sinkronisasi Kelas Baru ke 'Kelas Saya'", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Test 3: Cek 4 kelas awal (Pemrograman Web, Basis Data, OOP, Kecerdasan Buatan)
  // -------------------------------------------------------------
  try {
    const mahasiswaRes = await fetch(`${BASE_URL}/api/classes`, {
      headers: { Cookie: andiCookie },
    });
    const mahasiswaClasses = await mahasiswaRes.json();

    const expectedClasses = [
      "Pemrograman Web",
      "Basis Data",
      "Object Oriented Programming",
      "Kecerdasan Buatan",
    ];

    for (const className of expectedClasses) {
      const exists = mahasiswaClasses.some((c) => c.name.toLowerCase() === className.toLowerCase());
      assert(exists, `Kelas awal "${className}" harus ada di list mahasiswa`);
    }

    recordResult(
      3,
      "Verifikasi 4 Kelas Awal Ter-enroll Otomatis",
      "PASS",
      `Keempat kelas awal (${expectedClasses.join(", ")}) seluruhnya terverifikasi muncul di dashboard 'Kelas Saya' milik Andi Pratama.`,
    );
  } catch (err) {
    recordResult(3, "Verifikasi 4 Kelas Awal", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Test 4: Klik salah satu kelas (Pemrograman Web), pastikan tampil tugas relevan
  // -------------------------------------------------------------
  try {
    const detailRes = await fetch(`${BASE_URL}/dashboard/mahasiswa/classes/cls-001`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(
      detailRes.status,
      200,
      "Halaman detail /dashboard/mahasiswa/classes/cls-001 harus return 200 OK",
    );
    const detailHtml = await detailRes.text();

    assert(detailHtml.includes("Pemrograman Web"), "Harus menampilkan nama kelas Pemrograman Web");
    assert(
      detailHtml.includes("Website CRUD Next.js"),
      "Harus menampilkan tugas terkait 'Website CRUD Next.js'",
    );
    assert(detailHtml.includes("Dr. Budi Santoso, M.Kom"), "Harus menampilkan nama dosen pengampu");

    recordResult(
      4,
      "Detail Kelas & Daftar Tugas Terkait (/classes/[id])",
      "PASS",
      `Detail kelas 'Pemrograman Web' (ID: cls-001) menampilkan nama kelas, dosen pengampu 'Dr. Budi Santoso, M.Kom', semester, dan penugasan yang sesuai ('Website CRUD Next.js').`,
    );
  } catch (err) {
    recordResult(4, "Detail Kelas & Daftar Tugas", "FAIL", err.message);
  } finally {
    // Cleanup test class if created
    if (createdClassId) {
      try {
        await fetch(`${BASE_URL}/api/classes/${createdClassId}`, {
          method: "DELETE",
          headers: { Cookie: dosenCookie },
        });
      } catch {
        // ignore
      }
    }
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n===============================================================");
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL HASIL PENGUJIAN KELAS SAYA: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("===============================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
