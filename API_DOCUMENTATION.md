# 📘 API Documentation — DeXa Assessment (AI Assessment Copilot)

## Arsitektur: Next.js API Routes sebagai Backend for Frontend (BFF)

Project ini menggunakan **Next.js App Router API Routes** sebagai pola **Backend for Frontend (BFF)**. API Routes di folder `nextjs-app/src/app/api/` berperan sebagai **layer perantara type-safe** antara client-side React components dan data store (in-memory store pada prototype ini).

### Mengapa BFF?

```
┌─────────────┐       ┌──────────────────────┐       ┌──────────────────┐
│  React UI   │ ───►  │  Next.js API Routes  │ ───►  │  Data Store      │
│  (Client)   │ ◄───  │  (BFF Layer)         │ ◄───  │  (In-memory/DB)  │
└─────────────┘       └──────────────────────┘       └──────────────────┘
```

Keuntungan arsitektur BFF pada project ini:

1. **Validasi Type-Safe dengan Zod** — Setiap request body dan response data divalidasi menggunakan skema Zod (`LoginRequestSchema`, `ClassSchema`, `CreateRubricInputSchema`, dll). Ini menjamin konsistensi tipe data antara client dan server.
2. **Proteksi Session & Role** — Setiap operasi mutasi (POST, PUT, DELETE) dilindungi oleh guard `requireDosenRole()` atau `requireMahasiswaRole()` dari `@/lib/auth-guard`. Session dibaca dari httpOnly cookie, bukan localStorage.
3. **Separation of Concerns** — Client component tidak perlu tahu detail implementasi data store. API Routes bisa diganti ke database nyata (PostgreSQL, MongoDB, dll) tanpa mengubah kode UI.
4. **Error Handling Terpusat** — Setiap endpoint menangkap `z.ZodError` untuk mengembalikan 400 Validation Error, dan general catch untuk 500 Internal Server Error.

---

## Base URL

```
Production : https://<vercel-domain>/api
Development: http://localhost:3000/api
```

---

## 🔐 Authentication Endpoints

### POST `/api/auth/login`

Login user dan buat session cookie httpOnly.

**Autentikasi:** Tidak diperlukan (public)

**Request Body:**
```json
{
  "email": "dosen@example.com",
  "password": "password123"
}
```

**Response Sukses (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Dr. Budi Santoso, M.Kom",
    "email": "dosen@example.com",
    "role": "dosen"
  },
  "redirectTo": "/dashboard/dosen"
}
```

**Response Error (400 — Validasi Gagal):**
```json
{
  "success": false,
  "message": "Email wajib diisi."
}
```

**Response Error (401 — Kredensial Salah):**
```json
{
  "success": false,
  "message": "Email atau password salah."
}
```

---

### POST `/api/auth/register`

Registrasi user baru. Tidak melakukan auto-login setelah registrasi.

**Autentikasi:** Tidak diperlukan (public)

**Request Body:**
```json
{
  "name": "Sari Dewi",
  "email": "sari@example.com",
  "password": "password123",
  "role": "mahasiswa"
}
```

**Response Sukses (200):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login."
}
```

**Response Error (400 — Field Kosong):**
```json
{
  "success": false,
  "message": "Semua field wajib diisi."
}
```

**Response Error (400 — Role Tidak Valid):**
```json
{
  "success": false,
  "message": "Role harus 'dosen' atau 'mahasiswa'."
}
```

**Response Error (409 — Email Duplikat):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar."
}
```

---

### POST `/api/auth/logout`

Hapus session cookie dan logout user.

**Autentikasi:** Tidak diperlukan

**Response Sukses (200):**
```json
{
  "success": true,
  "message": "Logout berhasil."
}
```

---

### GET `/api/auth/me`

Ambil data session user yang sedang login.

**Autentikasi:** Session cookie (semua role)

**Response Sukses (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "name": "Dr. Budi Santoso, M.Kom",
    "email": "dosen@example.com",
    "role": "dosen"
  }
}
```

**Response Error (401 — Tidak Login):**
```json
{
  "authenticated": false,
  "user": null
}
```

---

## 📚 Classes Endpoints

### GET `/api/classes`

Ambil daftar kelas. Jika user adalah mahasiswa, otomatis difilter hanya kelas yang di-enroll.

**Autentikasi:** Session cookie (dosen: semua kelas, mahasiswa: kelas yang di-enroll)

**Query Parameters:**
| Parameter | Type | Description |
|---|---|---|
| `enrolledOnly` | `"true"` | Filter kelas yang di-enroll saja |

**Response Sukses (200):**
```json
[
  {
    "id": "cls-1",
    "name": "Pemrograman Web",
    "studentsCount": 35,
    "assignmentsCount": 8,
    "semester": "Semester Genap 2025/2026",
    "status": "active",
    "lecturerName": "Dr. Budi Santoso, M.Kom",
    "enrolledStudentIds": [2]
  }
]
```

---

### POST `/api/classes`

Buat kelas baru.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body:**
```json
{
  "name": "Kecerdasan Buatan",
  "semester": "Semester Genap 2025/2026",
  "status": "active",
  "lecturerName": "Dr. Budi Santoso, M.Kom",
  "enrolledStudentIds": [2]
}
```

**Response Sukses (201):**
```json
{
  "id": "cls-1726837261000",
  "name": "Kecerdasan Buatan",
  "studentsCount": 1,
  "assignmentsCount": 0,
  "semester": "Semester Genap 2025/2026",
  "status": "active",
  "lecturerName": "Dr. Budi Santoso, M.Kom",
  "enrolledStudentIds": [2]
}
```

**Response Error (400 — Validasi Zod):**
```json
{
  "error": "Validation Error",
  "details": [
    { "path": ["name"], "message": "Nama kelas minimal 2 karakter" }
  ]
}
```

**Response Error (401/403 — Bukan Dosen):**
```json
{
  "error": "Forbidden",
  "message": "Only dosen can perform this action"
}
```

---

### PUT `/api/classes/[id]`

Update data kelas berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body (partial update):**
```json
{
  "name": "Pemrograman Web Lanjut",
  "status": "archived"
}
```

**Response Sukses (200):**
```json
{
  "id": "cls-1",
  "name": "Pemrograman Web Lanjut",
  "studentsCount": 35,
  "assignmentsCount": 8,
  "semester": "Semester Genap 2025/2026",
  "status": "archived",
  "lecturerName": "Dr. Budi Santoso, M.Kom",
  "enrolledStudentIds": [2]
}
```

**Response Error (404):**
```json
{
  "error": "Class not found"
}
```

---

### DELETE `/api/classes/[id]`

Hapus kelas berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Response Sukses (200):**
```json
{
  "success": true,
  "id": "cls-1"
}
```

**Response Error (404):**
```json
{
  "error": "Class not found"
}
```

---

## 📋 Rubrics Endpoints

### GET `/api/rubrics`

Ambil seluruh daftar rubrik penilaian.

**Autentikasi:** Session cookie (semua role)

**Response Sukses (200):**
```json
[
  {
    "id": "rub-1",
    "name": "Rubrik Proyek Web",
    "course": "Pemrograman Web",
    "criteriaCount": 5,
    "totalWeight": 100,
    "status": "active"
  }
]
```

---

### POST `/api/rubrics`

Buat rubrik penilaian baru.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body:**
```json
{
  "name": "Rubrik Ujian Database",
  "course": "Basis Data",
  "criteriaCount": 4,
  "totalWeight": 100,
  "status": "active"
}
```

**Response Sukses (201):**
```json
{
  "id": "rub-1726837261000",
  "name": "Rubrik Ujian Database",
  "course": "Basis Data",
  "criteriaCount": 4,
  "totalWeight": 100,
  "status": "active"
}
```

**Response Error (400 — Validasi Zod):**
```json
{
  "error": "Validation Error",
  "details": [
    { "path": ["criteriaCount"], "message": "Jumlah kriteria minimal 1" }
  ]
}
```

---

### PUT `/api/rubrics/[id]`

Update rubrik penilaian berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body (partial update):**
```json
{
  "name": "Rubrik Proyek Web (Revisi)",
  "status": "draft"
}
```

**Response Sukses (200):**
```json
{
  "id": "rub-1",
  "name": "Rubrik Proyek Web (Revisi)",
  "course": "Pemrograman Web",
  "criteriaCount": 5,
  "totalWeight": 100,
  "status": "draft"
}
```

**Response Error (404):**
```json
{
  "error": "Rubric not found"
}
```

---

### DELETE `/api/rubrics/[id]`

Hapus rubrik berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Response Sukses (200):**
```json
{
  "success": true,
  "id": "rub-1"
}
```

---

## 📝 Assignments Endpoints

### GET `/api/assignments`

Ambil seluruh daftar tugas.

**Autentikasi:** Session cookie (semua role)

**Response Sukses (200):**
```json
[
  {
    "id": "asg-1",
    "title": "Laporan Akhir Proyek Sistem",
    "course": "Pemrograman Web",
    "deadline": "20 Sep 2026",
    "description": "Buat laporan akhir proyek sistem informasi",
    "status": "pending"
  }
]
```

---

### GET `/api/assignments/[id]`

Ambil detail tugas berdasarkan ID.

**Autentikasi:** Session cookie (semua role)

**Response Sukses (200):**
```json
{
  "id": "asg-1",
  "title": "Laporan Akhir Proyek Sistem",
  "course": "Pemrograman Web",
  "deadline": "20 Sep 2026",
  "description": "Buat laporan akhir proyek sistem informasi",
  "status": "pending"
}
```

**Response Error (404):**
```json
{
  "error": "Assignment not found"
}
```

---

### POST `/api/assignments`

Buat tugas baru.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body:**
```json
{
  "title": "Tugas Praktikum Modul 5",
  "course": "Basis Data",
  "deadline": "25 Okt 2026",
  "description": "Implementasikan query join dan subquery pada database perpustakaan",
  "status": "pending"
}
```

**Response Sukses (201):**
```json
{
  "id": "asg-1726837261000",
  "title": "Tugas Praktikum Modul 5",
  "course": "Basis Data",
  "deadline": "25 Okt 2026",
  "description": "Implementasikan query join dan subquery pada database perpustakaan",
  "status": "pending"
}
```

---

### PUT `/api/assignments/[id]`

Update tugas berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body (partial update):**
```json
{
  "title": "Tugas Praktikum Modul 5 (Revisi)",
  "status": "graded"
}
```

**Response Sukses (200):** Object Assignment yang diperbarui.

**Response Error (404):**
```json
{
  "error": "Assignment not found"
}
```

---

### DELETE `/api/assignments/[id]`

Hapus tugas berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Response Sukses (200):**
```json
{
  "success": true,
  "id": "asg-1"
}
```

---

## 📊 Assessments Endpoints

### GET `/api/assessments`

Ambil seluruh daftar assessment (penilaian).

**Autentikasi:** Session cookie (semua role)

**Response Sukses (200):**
```json
[
  {
    "id": "asm-1",
    "name": "Penilaian Proyek Akhir",
    "course": "Pemrograman Web",
    "status": "finalized",
    "gradedSubmissionsCount": 30
  }
]
```

---

### POST `/api/assessments`

Buat assessment baru.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body:**
```json
{
  "name": "Penilaian UTS Basis Data",
  "course": "Basis Data",
  "status": "draft",
  "gradedSubmissionsCount": 0
}
```

**Response Sukses (201):**
```json
{
  "id": "asm-1726837261000",
  "name": "Penilaian UTS Basis Data",
  "course": "Basis Data",
  "status": "draft",
  "gradedSubmissionsCount": 0
}
```

---

### PUT `/api/assessments/[id]`

Update assessment berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Request Body (partial update):**
```json
{
  "status": "finalized",
  "gradedSubmissionsCount": 28
}
```

**Response Sukses (200):** Object Assessment yang diperbarui.

**Response Error (404):**
```json
{
  "error": "Assessment not found"
}
```

---

### DELETE `/api/assessments/[id]`

Hapus assessment berdasarkan ID.

**Autentikasi:** Session cookie — **Dosen only**

**Response Sukses (200):**
```json
{
  "success": true,
  "id": "asm-1"
}
```

---

## 📤 Submissions Endpoints

### GET `/api/submissions`

Ambil daftar submission tugas. Mahasiswa hanya melihat submisi mereka sendiri, Dosen melihat semua.

**Autentikasi:** Session cookie (dosen: semua submisi, mahasiswa: submisi sendiri)

**Response Sukses (200):**
```json
[
  {
    "id": "sub-1",
    "assignmentId": "asg-1",
    "assignmentTitle": "Laporan Akhir Proyek Sistem",
    "course": "Pemrograman Web",
    "studentId": 2,
    "studentName": "Andi Pratama",
    "studentEmail": "mahasiswa@example.com",
    "fileUrl": "https://github.com/andi/proyek-web",
    "notes": "Sudah selesai semua fitur",
    "submittedAt": "18 Sep 2026, 14:30"
  }
]
```

---

### POST `/api/submissions`

Kumpulkan tugas (submit assignment).

**Autentikasi:** Session cookie — **Mahasiswa only**

**Request Body:**
```json
{
  "assignmentId": "asg-1",
  "fileUrl": "https://github.com/andi/proyek-web",
  "notes": "Sudah selesai semua fitur"
}
```

**Response Sukses (201):**
```json
{
  "success": true,
  "submission": {
    "id": "sub-1726837261000",
    "assignmentId": "asg-1",
    "assignmentTitle": "Laporan Akhir Proyek Sistem",
    "course": "Pemrograman Web",
    "studentId": 2,
    "studentName": "Andi Pratama",
    "studentEmail": "mahasiswa@example.com",
    "fileUrl": "https://github.com/andi/proyek-web",
    "notes": "Sudah selesai semua fitur",
    "submittedAt": "20 Sep 2026, 16:45"
  },
  "updatedAssignment": { "...assignment object with status: submitted..." }
}
```

**Response Error (404 — Assignment Tidak Ditemukan):**
```json
{
  "error": "Assignment not found"
}
```

---

## 📈 Grades Endpoints

### GET `/api/grades`

Ambil daftar nilai. Mahasiswa hanya melihat nilai mereka yang sudah finalized, Dosen melihat semua.

**Autentikasi:** Session cookie (dosen: semua nilai, mahasiswa: nilai sendiri yang finalized)

**Response Sukses (200):**
```json
[
  {
    "id": "grd-1",
    "assessmentId": "asm-1",
    "assessmentName": "Penilaian Proyek Akhir",
    "course": "Pemrograman Web",
    "studentId": 2,
    "studentEmail": "mahasiswa@example.com",
    "studentName": "Andi Pratama",
    "score": 88,
    "maxScore": 100,
    "status": "finalized",
    "gradedDate": "15 Sep 2026",
    "assessorName": "Dr. Budi Santoso, M.Kom",
    "comment": "Implementasi sangat baik, arsitektur rapi.",
    "aiReview": "Kode terstruktur dengan baik, menggunakan design pattern yang tepat.",
    "rubricName": "Rubrik Proyek Web"
  }
]
```

---

## 📡 Activities Endpoint

### GET `/api/activities`

Ambil feed aktivitas terbaru (log timeline).

**Autentikasi:** Tidak diperlukan (public)

**Response Sukses (200):**
```json
[
  {
    "id": "act-1",
    "type": "submission",
    "actor": "Andi Pratama",
    "action": "mengumpulkan tugas \"Laporan Akhir Proyek Sistem\"",
    "context": "Pemrograman Web",
    "timeAgo": "2 jam lalu",
    "icon": "upload",
    "color": "emerald"
  }
]
```

---

## Error Response Format

Semua endpoint mengikuti format error yang konsisten:

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "details": [
    {
      "path": ["fieldName"],
      "message": "Pesan error validasi Zod"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### Authorization Error (403)
```json
{
  "error": "Forbidden",
  "message": "Only dosen can perform this action"
}
```

### Not Found (404)
```json
{
  "error": "Resource not found"
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error"
}
```
