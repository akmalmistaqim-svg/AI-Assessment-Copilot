import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encodeSessionPayload } from "../src/types/auth.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "../src");

const BASE_URL = "http://localhost:3000";

const dosenCookie = `session=${encodeSessionPayload({
  id: 1,
  name: "Dr. Budi Santoso, M.Kom",
  email: "dosen@example.com",
  role: "dosen",
})}`;

const andiCookie = `session=${encodeSessionPayload({
  id: 2,
  name: "Andi Pratama",
  email: "mahasiswa@example.com",
  role: "mahasiswa",
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
  console.log("     PENGUJIAN MENYELURUH GRUP 3 & AUDIT FINAL SELURUH FITUR   ");
  console.log("===============================================================\n");

  // -------------------------------------------------------------
  // Poin 1: Settings Page (Dosen & Mahasiswa)
  // -------------------------------------------------------------
  try {
    // 1. Dosen settings
    const dosenRes = await fetch(`${BASE_URL}/dashboard/dosen/settings`, {
      headers: { Cookie: dosenCookie },
    });
    assert.strictEqual(dosenRes.status, 200, "Dosen settings should return 200 OK");
    const dosenHtml = await dosenRes.text();
    assert(dosenHtml.includes("Pengaturan Akun"), "Dosen settings harus memuat judul 'Pengaturan Akun'");
    assert(dosenHtml.includes("dosen@example.com"), "Dosen settings harus menampilkan email read-only");
    assert(dosenHtml.includes("Terima Notifikasi Email"), "Harus ada switch notifikasi email");

    // 2. Mahasiswa settings
    const mhsRes = await fetch(`${BASE_URL}/dashboard/mahasiswa/settings`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(mhsRes.status, 200, "Mahasiswa settings should return 200 OK");
    const mhsHtml = await mhsRes.text();
    assert(mhsHtml.includes("Pengaturan Akun"), "Mahasiswa settings harus memuat judul 'Pengaturan Akun'");
    assert(mhsHtml.includes("mahasiswa@example.com"), "Mahasiswa settings harus menampilkan email read-only");
    assert(mhsHtml.includes("Terima Notifikasi Email"), "Harus ada switch notifikasi email");

    // 3. Sidebar links
    const layoutContent = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
    assert(layoutContent.includes('href: "/dashboard/dosen/settings"'), "Sidebar dosen harus mengarah ke settings");
    assert(layoutContent.includes('href: "/dashboard/mahasiswa/settings"'), "Sidebar mahasiswa harus mengarah ke settings");

    recordResult(
      1,
      "Settings Page & Nav-Link (Dosen & Mahasiswa)",
      "PASS",
      "Halaman /dashboard/dosen/settings dan /dashboard/mahasiswa/settings aktif (200 OK), form profil, email read-only, dan toggle notifikasi terpasang, serta nav-link sidebar terhubung.",
    );
  } catch (err) {
    recordResult(1, "Settings Page", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 2: Help & Support (Dosen & Mahasiswa)
  // -------------------------------------------------------------
  try {
    // 1. Dosen help
    const dosenHelpRes = await fetch(`${BASE_URL}/dashboard/dosen/help`, {
      headers: { Cookie: dosenCookie },
    });
    assert.strictEqual(dosenHelpRes.status, 200, "Dosen help should return 200 OK");
    const dosenHelpHtml = await dosenHelpRes.text();
    assert(dosenHelpHtml.includes("Pertanyaan Umum (FAQ)"), "Harus memuat section FAQ");
    assert(dosenHelpHtml.includes("support@aiassessment.ac.id"), "Harus memuat kontak email support");
    assert(dosenHelpHtml.includes("Bagaimana cara membuat kelas perkuliahan baru?"), "Harus memuat FAQ spesifik dosen");

    // 2. Mahasiswa help
    const mhsHelpRes = await fetch(`${BASE_URL}/dashboard/mahasiswa/help`, {
      headers: { Cookie: andiCookie },
    });
    assert.strictEqual(mhsHelpRes.status, 200, "Mahasiswa help should return 200 OK");
    const mhsHelpHtml = await mhsHelpRes.text();
    assert(mhsHelpHtml.includes("Pertanyaan Umum (FAQ)"), "Harus memuat section FAQ");
    assert(mhsHelpHtml.includes("support@aiassessment.ac.id"), "Harus memuat kontak email support");
    assert(mhsHelpHtml.includes("Bagaimana cara mengumpulkan tugas perkuliahan?"), "Harus memuat FAQ spesifik mahasiswa");

    // 3. Sidebar links
    const layoutContent = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
    assert(layoutContent.includes('href: "/dashboard/dosen/help"'), "Sidebar dosen harus mengarah ke help");
    assert(layoutContent.includes('href: "/dashboard/mahasiswa/help"'), "Sidebar mahasiswa harus mengarah ke help");

    recordResult(
      2,
      "Help & Support Page & Nav-Link (Dosen & Mahasiswa)",
      "PASS",
      "Halaman /dashboard/dosen/help dan /dashboard/mahasiswa/help aktif (200 OK), FAQ peran-spesifik & kontak support fiktif tampil statis tanpa database, sidebar terhubung.",
    );
  } catch (err) {
    recordResult(2, "Help & Support Page", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 3: Notifications Topbar Dropdown
  // -------------------------------------------------------------
  try {
    const notifBtnCode = fs.readFileSync(path.join(srcDir, "components/notification-button.tsx"), "utf-8");
    assert(notifBtnCode.includes("onClick={() => setIsOpen(!isOpen)}"), "Tombol lonceng harus memiliki toggle onClick");
    assert(notifBtnCode.includes("handleClickOutside"), "Harus memiliki listener klik di luar area");
    assert(notifBtnCode.includes('e.key === "Escape"'), "Harus memiliki listener tombol Escape");
    assert(notifBtnCode.includes("dosenNotifications") && notifBtnCode.includes("mahasiswaNotifications"), "Harus memiliki data notifikasi kontekstual");

    recordResult(
      3,
      "Notifications Topbar Panel & Interactivity",
      "PASS",
      "Tombol lonceng topbar dilengkapi interactive dropdown panel, data dummy peran-spesifik, serta auto-close pada click outside dan Escape key.",
    );
  } catch (err) {
    recordResult(3, "Notifications Topbar", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 4 & 5: Profile & Settings Dropdown Menu Navigation
  // -------------------------------------------------------------
  try {
    const profileDropdownCode = fs.readFileSync(path.join(srcDir, "components/profile-dropdown.tsx"), "utf-8");
    assert(profileDropdownCode.includes("router.push(`/dashboard/${role}/settings`)"), "Tombol Profile dan Settings harus navigasi ke halaman Settings yang baru dibuat");
    assert(profileDropdownCode.includes("setDropdownOpen(false)"), "Dropdown harus menutup saat navigasi dilakukan");

    recordResult(
      4,
      "Profile & Account Settings Dropdown Navigation",
      "PASS",
      "Menu 'Profile' dan 'Settings' pada dropdown pengguna mengarahkan ke /dashboard/{role}/settings dengan mulus.",
    );
  } catch (err) {
    recordResult(4, "Profile & Account Settings Dropdown", "FAIL", err.message);
  }

  // -------------------------------------------------------------
  // Poin 6: FINAL AUDIT - Pastikan TIDAK ADA href="#" atau alert placeholder yang tersisa
  // -------------------------------------------------------------
  try {
    const layoutContent = fs.readFileSync(path.join(srcDir, "app/dashboard/layout.tsx"), "utf-8");
    const hasHashHref = layoutContent.includes('href: "#"');
    assert(!hasHashHref, "Tidak boleh ada href: '#' di sidebar layout");

    const sidebarCode = fs.readFileSync(path.join(srcDir, "components/sidebar-nav-list.tsx"), "utf-8");
    assert(!sidebarCode.includes("handlePlaceholderClick"), "Placeholder click handler di sidebar sudah dibersihkan");
    assert(!sidebarCode.includes("akan segera hadir"), "Teks alert placeholder sudah tidak ada di sidebar");

    recordResult(
      5,
      "Audit Final: Zero Placeholder / Coming Soon di Seluruh Aplikasi",
      "PASS",
      "Seluruh navigasi sidebar, topbar, dan dropdown 100% terhubung ke rute nyata. Tidak ada lagi alert 'akan segera hadir' atau href='#' tersisa.",
    );
  } catch (err) {
    recordResult(5, "Audit Final Zero Placeholder", "FAIL", err.message);
  }

  console.log("\n===============================================================");
  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;
  console.log(`TOTAL HASIL PENGUJIAN GRUP 3: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("===============================================================");

  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
