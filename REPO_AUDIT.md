# REPO AUDIT REPORT — AI ASSESSMENT COPILOT
**Tanggal Audit**: 20 September 2026  
**Metode**: Audit Statis & Dinamis Read-Only (Verifikasi Kode Sumber, Static Analysis, & Build Check)

---

## BAGIAN A - STACK & KONFIGURASI

### 1. Versi Dependensi (Berdasarkan `nextjs-app/package.json` dan `package.json` root)
| Library | Versi di `nextjs-app/package.json` | Keterangan / Status |
| :--- | :--- | :--- |
| `next` | `16.3.5` | App Router + Turbopack |
| `react` | `19.2.8` | React 19 Core |
| `react-dom` | `19.2.8` | React DOM 19 |
| `tailwindcss` | `^4` | Tailwind CSS v4 + `@tailwindcss/postcss: ^4` |
| `typescript` | `^5` (devDep) | Root devDep: `^7.0.2` |
| `zod` | `^4.6.5` | Root dep: `^4.6.2` |
| `zustand` | `^5.0.15` | State management client (UI State) |
| `@tanstack/react-query` | `^5.102.8` | Server state & data fetching |
| `class-variance-authority` | **TIDAK ADA** | Tidak ada di package.json |
| `@biomejs/biome` | `^2.5.13` (devDep) | Linter & Formatter |
| Library UI lain (Radix / shadcn) | **TIDAK ADA** | Hanya `lucide-react: ^1.45.0` |

*Catatan dependensi lain:* `jsdom: ^30.1.0` terpasang di devDependencies namun tidak ada runner test (Vitest/Jest).

---

### 2. Isi `tsconfig.json` (`nextjs-app/tsconfig.json`)
Bagian `compilerOptions` terkait strictness:
- `"strict": true` (mengaktifkan strict null checks, strict function types, noImplicitAny, dll.)
- `"noUncheckedIndexedAccess": true` (mengembalikan `T | undefined` saat mengakses array/object index)
- `"target": "ES2017"`
- `"lib": ["dom", "dom.iterable", "esnext"]`
- `"noEmit": true`
- `"isolatedModules": true`
- `"moduleResolution": "bundler"`
- `"paths": { "@/*": ["./src/*"] }`

---

### 3. Isi `biome.json` & Script `package.json`
**Isi `nextjs-app/biome.json`:**
- `$schema`: `https://biomejs.dev/schemas/2.5.13/schema.json`
- `assist.actions.source.organizeImports`: `"on"`
- `linter.enabled`: `true`, `rules.preset`: `"recommended"`, `rules.correctness.noUnusedVariables`: `"error"`
- `formatter.enabled`: `true`, `indentStyle`: `"space"`, `indentWidth`: `2`, `lineWidth`: `100`
- `css.parser.tailwindDirectives`: `true`
- `files.includes`: `["**", "!**/.next/**", "!**/node_modules/**", "!**/dist/**"]`

**Script di `nextjs-app/package.json`:**
- `"dev": "next dev --turbopack"`
- `"build": "next build --turbopack"`
- `"start": "next start"`
- `"lint:biome": "biome check src"`
- `"format:biome": "biome format --write src"`
- `"check:biome": "biome check --write src"`

**Script di root `package.json`:**
- `"dev": "npm --prefix nextjs-app run dev"`
- `"build": "cd nextjs-app && npm install && npm run build"`
- `"start": "npm --prefix nextjs-app run start"`
- `"test": "echo \"Error: no test specified\" && exit 1"`

---

### 4. Konfigurasi Next & Tailwind v4
- **`nextjs-app/next.config.ts`**:
  - Berisi: `turbopack: { root: __dirname }`, `devIndicators: { position: "bottom-right" }`.
  - **TIDAK ADA** konfigurasi `images` (remotePatterns), custom `headers()`, maupun Content Security Policy (CSP).
- **Tailwind v4 (`nextjs-app/src/app/globals.css`)**:
  - `@import "tailwindcss";` pada baris 1.
  - Direktif `@theme` pada baris 3–54 mendefinisikan custom tokens: brand colors (`--color-primary-green`, dll), surface colors, status colors, shadows (`--shadow-xs` s/d `--shadow-modal`), radii, dan `--font-sans: var(--font-inter), ...`.
  - Menggunakan plugin `@tailwindcss/postcss` di `nextjs-app/postcss.config.mjs`.
  - **TIDAK ADA** file `tailwind.config.js` (menggunakan konfigurasi CSS-first Tailwind v4).

---

### 5. Logika Proteksi Rute dan Role (`nextjs-app/src/middleware.ts`)
- File berada di `nextjs-app/src/middleware.ts` (Next.js 16 mengeluarkan warning deprecasi menyarankan konvensi `proxy.ts`).
- **Matcher**: `["/dashboard/:path*", "/dashboard", "/login", "/register"]`.
- **Logika**:
  1. Membaca cookie `session` dan men-decode payload via `decodeSessionPayload(sessionCookie)`.
  2. **Unauthenticated Check**: Akses ke `/dashboard/*` tanpa sesi diredirect ke `/login` (baris 15–21).
  3. **Authenticated Guest Check**: Pengguna yang sudah login mengunjungi `/login` atau `/register` langsung diredirect ke dashboard role masing-masing: `/dashboard/dosen` atau `/dashboard/mahasiswa` (baris 24–31).
  4. **Role Boundary Protection**:
     - Mahasiswa yang mencoba mengakses `/dashboard/dosen/*` dipaksa redirect ke `/dashboard/mahasiswa` (baris 43–48).
     - Dosen yang mencoba mengakses `/dashboard/mahasiswa/*` dipaksa redirect ke `/dashboard/dosen` (baris 51–56).
     - Akses ke `/dashboard` murni diredirect ke dashboard role masing-masing (baris 36–40).

---

## BAGIAN B - FITUR vs SRS

| ID Kebutuhan | Deskripsi Fitur | Status | Bukti File & Rincian Kode |
| :--- | :--- | :--- | :--- |
| **FR-01** | Login / Register + Role (dosen, mahasiswa). Role admin/Tim Pengembang? | **SEBAGIAN** | **ADA untuk dosen & mahasiswa**: `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/api/auth/login/route.ts`, `src/lib/auth.ts` (baris 15: `role: "dosen" \| "mahasiswa"`).<br>**Role Admin/Tim Pengembang**: **TIDAK ADA** di schema maupun auth. |
| **FR-02** | Manajemen Rubrik (kriteria, bobot, indikator skor) + Validasi total bobot 100% | **SEBAGIAN** | `src/types/rubric.ts`, `src/app/api/rubrics/route.ts`, `src/components/rubric-modal.tsx`.<br>Hanya menyimpan metadata tingkat rubrik: `name`, `course`, `criteriaCount`, `totalWeight`.<br>**Validasi total bobot 100%**: **SEBAGIAN** (`totalWeight` dibatasi `.min(1).max(100)` di Zod), namun tidak ada rincian anak/kriteria individual atau indikator skor per level rubrik. |
| **FR-03** | Upload berkas tugas PDF/DOCX/TXT dan ekstraksi teks | **TIDAK ADA** | Mahasiswa hanya mengisi string tautan (`fileUrl`) dan `notes` pada form teks biasa (`src/types/submission.ts` baris 5: `fileUrl: z.string().min(3)`, `src/components/submit-assignment-modal.tsx`). Tidak ada multipart/form-data upload file dan tidak ada parsing/ekstraksi teks PDF/DOCX. |
| **FR-04** | Trigger evaluasi AI secara asinkron + Integrasi LLM sungguhan | **TIDAK ADA** | Tidak ada pemanggilan API LLM (Gemini/OpenAI/Anthropic/DeepSeek). Tidak ada background queue/worker (seperti BullMQ/Inngest/QStash). `aiReview` murni teks mock hardcoded di `src/lib/gradeStore.ts` (baris 19-20). Variabel env untuk AI key: **TIDAK ADA**. |
| **FR-05** | Draft skor per kriteria + evidence (kutipan dari teks tugas) via RAG/Embedding | **MOCK** | `src/types/grade.ts` dan `src/lib/gradeStore.ts` hanya menyediakan kolom string `aiReview` dan `comment`. Tidak ada vector database, embedding, RAG, maupun ekstraksi evidence kutipan teks. |
| **FR-06** | Tampilan Split-View untuk review dan override skor/feedback oleh dosen | **TIDAK ADA** | `src/app/dashboard/dosen/assessments/page.tsx` dan `src/components/assessment-list-section.tsx` hanya berupa grid card CRUD sederhana (nama assessment, course, status, modal tambah/edit/hapus). Tidak ada split-view reader/evaluator. |
| **FR-07** | Penyimpanan dwi-versi (skor AI vs skor final) dan audit trail perubahan | **TIDAK ADA** | `src/types/grade.ts` hanya menyimpan field `score` tunggal. Tidak ada entitas `aiScore` vs `finalScore`, tidak ada log revisi/history versi penilaian. Tabel `activities` di `src/lib/data.ts` hanya event feed generik. |
| **FR-08** | Manajemen akun/konfigurasi oleh admin | **TIDAK ADA** | Tidak ada rute, halaman, API, atau menu admin dalam sistem. |
| **NFR-01** | Anonimisasi Nama/NIM sebelum kirim ke API LLM | **TIDAK ADA** | Karena tidak ada integrasi LLM, fungsi masking/anonimisasi nama atau NIM tidak ada sama sekali di codebase. |
| **NFR-02** | Hashing password (bcrypt/argon2) dan HTTPS | **SEBAGIAN** | **Hashing Password**: **TIDAK ADA** (`src/lib/auth.ts` baris 27, 34, 52–56 membandingkan dan menyimpan password secara plain text: `u.password === password`).<br>**HTTPS**: **SEBAGIAN** (`secure: isSecureCookie` aktif otomatis saat `NODE_ENV === "production"`, diamankan oleh edge Vercel, tetapi tidak ada config HSTS lokal). |
| **NFR-03** | Loading state / proses asinkron agar UI tidak menunggu | **ADA** | Diterapkan menggunakan React Query (`isLoading`), Tailwind pulse/spinners (`<Loader2 className="animate-spin" />`), dan layout skeleton Next.js (`src/app/dashboard/dosen/loading.tsx`, `mahasiswa/loading.tsx`). |
| **NFR-04** | Penanganan timeout/429/500 dari API LLM | **TIDAK ADA** | Tidak ada integrasi LLM, sehingga penanganan timeout/rate-limit 429 LLM tidak ada. Hanya ada generic catch 500 pada route handler lokal. |
| **NFR-05** | Layout desktop/tablet minimal 1024px | **ADA** | `src/app/dashboard/layout.tsx` menggunakan layout responsif: sidebar statis pada desktop (`w-60`), grid fleksibel (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), dan mobile drawer menu. |
| **NFR-06** | REST API dengan struktur JSON konsisten | **ADA** | Seluruh API di `src/app/api/**/route.ts` merespons format JSON standar `{ success, ... }` atau array data dengan status HTTP sesuai (200, 201, 400, 401, 403, 404, 500). |
| **Fitur Tambahan** | Notifikasi, Dashboard Statistik, Publikasi Nilai ke Mahasiswa | **SEBAGIAN** | - **Notifikasi**: **MOCK** (`src/components/notification-button.tsx` data notifikasi statis).<br>- **Dashboard Statistik**: **ADA** (4 card metrik dinamis di `dosen/page.tsx` & `mahasiswa/page.tsx`).<br>- **Publikasi Nilai**: **SEBAGIAN** (`src/lib/gradeStore.ts` memfilter `finalizedOnly` untuk mahasiswa, namun tombol aksi dosen mempublikasikan secara batch belum tersedia). |

---

## BAGIAN C - DATA & AUTH

### 1. Penyimpanan Data & Model
- **Mekanisme Penyimpanan**: **In-Memory JavaScript Arrays (Mock Store)**. Tidak menggunakan database sungguhan (PostgreSQL/Supabase/Prisma/Drizzle/file JSON persist). Seluruh data akan ter-reset saat server atau serverless instance restart.
- **Daftar File Store**:
  - `src/lib/auth.ts`: `users: User[]`
  - `src/lib/classStore.ts`: `classesStore: ClassItem[]`
  - `src/lib/rubricStore.ts`: `rubricsStore: RubricItem[]`
  - `src/lib/assignmentStore.ts`: `assignmentsStore: AssignmentItem[]`
  - `src/lib/assessmentStore.ts`: `assessmentsStore: AssessmentItem[]`
  - `src/lib/submissionStore.ts`: `submissionsStore: SubmissionItem[]`
  - `src/lib/gradeStore.ts`: `gradesStore: GradeItem[]`
  - `src/lib/data.ts`: `activities: ActivityItem[]`
- **Daftar File Skema / Tipe (`src/types/*.ts`)**:
  - `auth.ts`: `User`, `SessionPayload`, `LoginRequestSchema`, `LoginResponseSchema`
  - `class.ts`: `ClassSchema`, `CreateClassInputSchema`, `UpdateClassInputSchema`
  - `rubric.ts`: `RubricSchema`, `CreateRubricInputSchema`, `UpdateRubricInputSchema`
  - `assignment.ts`: `AssignmentSchema`, `CreateAssignmentInputSchema`, `UpdateAssignmentInputSchema`
  - `assessment.ts`: `AssessmentSchema`, `CreateAssessmentInputSchema`, `UpdateAssessmentInputSchema`
  - `submission.ts`: `SubmissionItemSchema`, `CreateSubmissionInputSchema`
  - `grade.ts`: `GradeItemSchema`, `GradeStatusSchema`
  - `activity.ts`: `ActivitySchema`

---

### 2. Mekanisme Session & Keamanan Auth
- **Cookie Session**:
  - Nama: `session` (`SESSION_COOKIE = "session"` di `src/lib/auth.ts`).
  - Atribut: `httpOnly: true`, `secure: process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "true"`, `sameSite: "lax"`, `path: "/"`, `maxAge: 604800` (7 hari).
- **Encoding Session**: Menggunakan format **Base64 JSON murni** (`encodeSessionPayload` dan `decodeSessionPayload` di `src/types/auth.ts`). **TIDAK ADA signature/HMAC kriptografis** (rentan tampering bila cookie dapat dimodifikasi).
- **Hashing Password**: **TIDAK ADA**. Password disimpan dan dicocokkan plain text (`u.password === password`).
- **Verifikasi Session di API Route**:
  - Diimplementasikan di `src/lib/auth-guard.ts` via helper:
    - `getSessionFromRequest(request)`: Membaca header `cookie` atau memanggil Next.js `cookies()`.
    - `requireDosenRole(request)`: Menghasilkan 401 jika unauthenticated, 403 jika role bukan dosen.
    - `requireMahasiswaRole(request)`: Menghasilkan 401 jika unauthenticated, 403 jika role bukan mahasiswa.
    - `requireAuthUser(request)`: Menghasilkan 401 jika unauthenticated.

---

### 3. Matriks Seluruh Halaman (`page.tsx`) & API Route (`route.ts`)

#### Halaman Web (21 Halaman — Seluruhnya Server Component)
| Path Halaman | Proteksi Sesi | Proteksi Role | File Path |
| :--- | :---: | :---: | :--- |
| `/` | Publik | - | `src/app/page.tsx` |
| `/login` | Guest Only (Middleware redirect) | - | `src/app/login/page.tsx` |
| `/register` | Guest Only (Middleware redirect) | - | `src/app/register/page.tsx` |
| `/dashboard/dosen` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/page.tsx` |
| `/dashboard/dosen/activities` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/activities/page.tsx` |
| `/dashboard/dosen/assessments` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/assessments/page.tsx` |
| `/dashboard/dosen/assignments` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/assignments/page.tsx` |
| `/dashboard/dosen/classes` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/classes/page.tsx` |
| `/dashboard/dosen/classes/[id]` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/classes/[id]/page.tsx` |
| `/dashboard/dosen/help` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/help/page.tsx` |
| `/dashboard/dosen/rubrics` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/rubrics/page.tsx` |
| `/dashboard/dosen/settings` | Ya (`getSession`) | Dosen | `src/app/dashboard/dosen/settings/page.tsx` |
| `/dashboard/mahasiswa` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/page.tsx` |
| `/dashboard/mahasiswa/assignments` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/assignments/page.tsx` |
| `/dashboard/mahasiswa/assignments/[id]` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/assignments/[id]/page.tsx` |
| `/dashboard/mahasiswa/classes` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/classes/page.tsx` |
| `/dashboard/mahasiswa/classes/[id]` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/classes/[id]/page.tsx` |
| `/dashboard/mahasiswa/feedback` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/feedback/page.tsx` |
| `/dashboard/mahasiswa/grades` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/grades/page.tsx` |
| `/dashboard/mahasiswa/help` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/help/page.tsx` |
| `/dashboard/mahasiswa/settings` | Ya (`getSession`) | Mahasiswa | `src/app/dashboard/mahasiswa/settings/page.tsx` |

#### API Route Handlers (15 Route Files)
| API Route Path | HTTP Method | Proteksi Sesi & Role | Validasi Input Zod | File Path |
| :--- | :--- | :--- | :--- | :--- |
| `/api/activities` | GET | Publik (Tanpa Auth) | Tidak Ada Input | `src/app/api/activities/route.ts` |
| `/api/assessments` | GET | Publik (Tanpa Auth) | Tidak Ada Input | `src/app/api/assessments/route.ts` |
| `/api/assessments` | POST | Ya (Dosen) | `CreateAssessmentInputSchema` | `src/app/api/assessments/route.ts` |
| `/api/assessments/[id]`| PUT | Ya (Dosen) | `UpdateAssessmentInputSchema` | `src/app/api/assessments/[id]/route.ts` |
| `/api/assessments/[id]`| DELETE | Ya (Dosen) | Tidak Ada Body | `src/app/api/assessments/[id]/route.ts` |
| `/api/assignments` | GET | Publik (Tanpa Auth) | Tidak Ada Input | `src/app/api/assignments/route.ts` |
| `/api/assignments` | POST | Ya (Dosen) | `CreateAssignmentInputSchema` | `src/app/api/assignments/route.ts` |
| `/api/assignments/[id]`| GET | Publik (Tanpa Auth) | Tidak Ada Body | `src/app/api/assignments/[id]/route.ts` |
| `/api/assignments/[id]`| PUT | Ya (Dosen) | `UpdateAssignmentInputSchema` | `src/app/api/assignments/[id]/route.ts` |
| `/api/assignments/[id]`| DELETE | Ya (Dosen) | Tidak Ada Body | `src/app/api/assignments/[id]/route.ts` |
| `/api/auth/login` | POST | Publik (Guest) | `LoginRequestSchema` | `src/app/api/auth/login/route.ts` |
| `/api/auth/logout` | POST | Publik (Clear Cookie)| Tidak Ada Body | `src/app/api/auth/logout/route.ts` |
| `/api/auth/me` | GET | Ya (Check Session) | Tidak Ada Body | `src/app/api/auth/me/route.ts` |
| `/api/auth/register` | POST | Publik (Guest) | **MANUAL (Bukan Zod)** | `src/app/api/auth/register/route.ts` |
| `/api/classes` | GET | Ya (Role-Filtered) | Tidak Ada Input | `src/app/api/classes/route.ts` |
| `/api/classes` | POST | Ya (Dosen) | `CreateClassInputSchema` | `src/app/api/classes/route.ts` |
| `/api/classes/[id]` | PUT | Ya (Dosen) | `UpdateClassInputSchema` | `src/app/api/classes/[id]/route.ts` |
| `/api/classes/[id]` | DELETE | Ya (Dosen) | Tidak Ada Body | `src/app/api/classes/[id]/route.ts` |
| `/api/grades` | GET | Ya (Role-Filtered) | Tidak Ada Input | `src/app/api/grades/route.ts` |
| `/api/rubrics` | GET | Publik (Tanpa Auth) | Tidak Ada Input | `src/app/api/rubrics/route.ts` |
| `/api/rubrics` | POST | Ya (Dosen) | `CreateRubricInputSchema` | `src/app/api/rubrics/route.ts` |
| `/api/rubrics/[id]` | PUT | Ya (Dosen) | `UpdateRubricInputSchema` | `src/app/api/rubrics/[id]/route.ts` |
| `/api/rubrics/[id]` | DELETE | Ya (Dosen) | Tidak Ada Body | `src/app/api/rubrics/[id]/route.ts` |
| `/api/submissions` | GET | Ya (Auth User) | Tidak Ada Input | `src/app/api/submissions/route.ts` |
| `/api/submissions` | POST | Ya (Mahasiswa) | `CreateSubmissionInputSchema` | `src/app/api/submissions/route.ts` |

---

## BAGIAN D - BUKTI PER BAB KOMPETENSI

### 1. HTML Semantik & ARIA
- `<header>`: ADA (`src/app/login/page.tsx:19`, `src/app/register/page.tsx:19`, `src/app/dashboard/layout.tsx:122`).
- `<main>`: ADA (`src/app/dashboard/layout.tsx:140`, `src/app/login/page.tsx:17`).
- `<aside>`: ADA (`src/components/sidebar-toggle.tsx:60`).
- `<nav>`: **TIDAK ADA** (menu navigasi dibuat menggunakan `div` dan `a` di `sidebar-nav-list.tsx`).
- `<article>`: **TIDAK ADA**.
- `<footer>`: **TIDAK ADA**.
- Atribut `aria-*` & `role`: ADA (`aria-label`, `aria-expanded`, `aria-modal="true"`, `aria-labelledby`, `role="radiogroup"` di `src/components/submit-assignment-modal.tsx:127-128` dan `src/components/register-form.tsx:246`).
- Skip Link: **TIDAK ADA** (tidak ada tautan `#main-content` / skip-to-content).
- Focus Management: **SEBAGIAN** (fokus manual saat error validasi menggunakan `useRef.current?.focus()` di `register-form.tsx:182` dan `login-form.tsx:179`. Pada modal belum ada implementasi focus trap otomatis).

### 2. Tailwind v4
- Konfigurasi: Murni CSS-first `@import "tailwindcss";` dan direktif `@theme` di `src/app/globals.css:1-54`. PostCSS plugin `@tailwindcss/postcss` di `nextjs-app/postcss.config.mjs`.
- Sisa CSS-in-JS: **TIDAK ADA** (bebas dari styled-components / emotion).

### 3. Komponen Headless & CVA
- `cva()`: **TIDAK ADA**. Tidak ada package `class-variance-authority` terpasang.
- Radix UI / shadcn: **TIDAK ADA**. Seluruh komponen UI (`Badge`, `StatCard`, `EmptyState`, `PageHeader`, `SkeletonCard`) dibuat manual dengan Tailwind CSS di `src/components/ui/`.

### 4. JavaScript ES6+
- **async/await + fetch**: ADA (`src/services/classApi.ts:9-15`, `src/services/assignmentApi.ts:9-16`).
- **Promise.all**: **TIDAK ADA** di seluruh file `src/`.
- **Destructuring**: ADA (`src/middleware.ts:6`: `const { pathname } = request.nextUrl;`, `src/components/assessment-list-section.tsx:16`).
- **Array methods (map/filter/reduce)**:
  - `map`: ADA (`src/components/sidebar-nav-list.tsx:43`).
  - `filter`: ADA (`src/components/assessment-list-section.tsx:21-25`, `src/lib/gradeStore.ts:83`).
  - `reduce`: ADA (`src/lib/data.ts:225`, `src/components/mahasiswa-grades-section.tsx:36`).
- **ES Modules**: ADA di 100% file TypeScript/React (`import` dan `export`).
- **Event Delegation**: **TIDAK ADA** event delegation DOM native manual.
- **Closure**: ADA (`src/components/profile-dropdown.tsx:25` fungsi `handleClickOutside` menutup scope `containerRef` dan `setDropdownOpen`).
- **Pencegahan Stale Closure**: ADA (functional setState di `src/components/login-form.tsx:226`: `setShowPassword((prev) => !prev)` dan `useCallback` di `src/components/rubric-modal.tsx:56`).

### 5. TypeScript & Zod
- **Daftar File Schema Zod**: 8 file (`src/types/auth.ts`, `class.ts`, `rubric.ts`, `assignment.ts`, `assessment.ts`, `submission.ts`, `grade.ts`, `activity.ts`).
- **Penggunaan `z.infer`**: ADA di seluruh 8 file tipe (contoh: `src/types/class.ts:28`: `export type ClassItem = z.infer<typeof ClassSchema>;`).
- **Discriminated Union**: **TIDAK ADA** (`z.discriminatedUnion` tidak digunakan).
- **Branded Types**: **TIDAK ADA** (`z.brand()` tidak digunakan).
- **Utility Types**:
  - `Partial<T>`: ADA di `src/lib/classStore.ts:66`, `rubricStore.ts:41`, dan `Zod.partial()` di `UpdateRubricInputSchema`.
  - `Pick<T>` & `Omit<T>`: **TIDAK ADA**.
- **Validasi API Input dengan Zod**: 10 dari 11 endpoint yang menerima body tervalidasi Zod (90.9%). Hanya `/api/auth/register` yang memvalidasi manual.
- **Penggunaan `any` atau `@ts-ignore`**: **0 (NOL)**. Tidak ada anotasi type `: any` maupun `@ts-ignore` / `@ts-expect-error` di kode TypeScript.

### 6. React 19
- `useActionState`: **TIDAK ADA**.
- `useOptimistic`: **TIDAK ADA**.
- `use()` hook: **TIDAK ADA** (pengambilan async params dilakukan via async server component `await params`).
- Server Actions (`"use server"`): **TIDAK ADA** (seluruh mutasi menggunakan Route Handlers REST API + client-side fetch).
- React Compiler: **TIDAK AKTIF** di `next.config.ts`.

### 7. Next.js App Router Architecture
- **Server Component vs Client Component**:
  - `page.tsx`: **21 dari 21 (100%)** adalah Server Component (tidak ada `"use client"` di file page).
  - `layout.tsx`: **2 dari 2 (100%)** adalah Server Component (`app/layout.tsx` dan `dashboard/layout.tsx`).
  - Total file `.tsx`: 116 file, di mana 44 file memiliki direktif `"use client"` (termasuk 16 file `error.tsx` dan komponen modal/form interaktif).
  - Proporsi RSC: **~62% Server Component vs ~38% Client Component**.
- **File Konvensi**:
  - Nested Layouts: ADA (`src/app/layout.tsx` dan `src/app/dashboard/layout.tsx`).
  - `loading.tsx`: ADA di berbagai subrute dashboard dosen & mahasiswa.
  - `error.tsx`: ADA di root dan tiap subrute dashboard.
  - `not-found.tsx`: ADA (`src/app/not-found.tsx`).
  - Suspense / Streaming: ADA (`src/app/login/page.tsx:11` membungkus `<LoginForm>` dengan `<Suspense>`).
  - `generateMetadata` / `export const metadata`: ADA di seluruh 21 halaman.
  - `sitemap.ts` / `robots.ts`: **TIDAK ADA**.

### 8. State Management
- **Zustand Store**: 1 file (`src/store/useUIStore.ts`).
  - State: Murni UI (`isSidebarOpen`, `isProfileDropdownOpen`, `activeModal`, `searchQuery`).
- **TanStack React Query**: 6 file hooks di `src/hooks/`:
  - `useClassesQuery`: key `["classes"]`, staleTime: 5 menit, gcTime: 10 menit, mutasi meng-invalidate `["classes"]`.
  - `useAssignmentsQuery`: key `["assignments"]` dan `["assignments", id]`, staleTime: 5 menit, gcTime: 10 menit.
  - `useRubricsQuery`: key `["rubrics"]`, staleTime: 5 menit, gcTime: 10 menit.
  - `useAssessmentsQuery`: key `["assessments"]`, staleTime: 5 menit, gcTime: 10 menit.
  - `useSubmissionsQuery`: key `["submissions"]`, mutasi meng-invalidate `["assignments"]` & `["submissions"]`.
  - `useGradesQuery`: key `["grades"]`, staleTime: 5 menit, gcTime: 10 menit.
- **Pemisahan Server State vs Client State**: **Sangat Baik**. Tidak ada data server yang disimpan di Zustand; server state 100% dikelola TanStack Query.

### 9. Build Tools
- **Turbopack**: Digunakan secara aktif pada script `"dev": "next dev --turbopack"` dan `"build": "next build --turbopack"`.
- **Vite / Rolldown**: **TIDAK ADA** (tidak ada konfigurasi `vite.config` atau rolldown di level aplikasi).
- **Aturan Biome**: Preset `recommended` dengan `noUnusedVariables: "error"`, tab space 2, lineWidth 100, organizeImports aktif.

### 10. Core Web Vitals
- `next/image`: Digunakan pada `src/components/brand-logo.tsx` dan avatar `src/app/dashboard/layout.tsx` dengan atribut `width`, `height`, dan prop `priority` untuk LCP.
- `next/font`: Digunakan di `src/app/layout.tsx` (`Inter` dari `next/font/google` dengan variable `--font-inter`).
- Skeleton Loading: Tersedia di file `loading.tsx` dan `src/components/ui/skeleton-card.tsx`.
- Dynamic Import / Lazy: **TIDAK ADA** (`next/dynamic` atau `React.lazy` tidak digunakan).
- `scheduler.yield` / Task chunking / `fetchpriority`: **TIDAK ADA**.

### 11. Keamanan
- Pencegahan XSS: **Baik**. `dangerouslySetInnerHTML` **TIDAK ADA** (0 temuan). Seluruh output teks di-escape oleh React JSX.
- CSP / Security Headers: **TIDAK ADA** di `next.config.ts`.
- Variabel Env: Hanya memanggil `process.env.NODE_ENV` dan `process.env.COOKIE_INSECURE`. Tidak ada variabel `NEXT_PUBLIC_*` dan tidak ada API secret yang disimpan/dipanggil.
- Rate Limiting: **TIDAK ADA** pada endpoint login maupun register.
- Validasi Upload File: **TIDAK ADA** (karena tidak ada fitur unggah berkas biner).
- Sanitasi Input: Mengandalkan validasi skema Zod (`trim()`, regex email, min length).

### 12. Integrasi API / BFF
- Mekanisme: Client memanggil API BFF internal melalui wrapper `fetch` modular di `src/services/*.ts`, yang dikonsumsi oleh custom hooks TanStack Query di `src/hooks/*.ts`.
- tRPC / oRPC: **TIDAK ADA**.
- Dokumentasi API: **ADA** di file root `API_DOCUMENTATION.md` lengkap dengan skema endpoint, metode HTTP, format request/response, dan status code.

---

## BAGIAN E - TESTING, CI/CD, QUALITY

### 1. Test Suite & Coverage
- File Test (`*.test.ts(x)`, `*.spec.ts(x)`, `__tests__`): **TIDAK ADA (0 file)**.
- Framework Test: **TIDAK ADA** (Vitest, Jest, atau Playwright tidak terkonfigurasi).
- Script Test: Root `package.json` hanya berisi `"echo \"Error: no test specified\" && exit 1"`. Pada `nextjs-app/package.json` tidak ada script test.
- Coverage: **0% (TIDAK ADA)**.

### 2. GitHub Actions Workflow (`.github/workflows/ci.yml`)
- **Trigger**: `push` ke branch `main` & `pull_request` ke branch `main`.
- **Job**: `build-and-lint` (runs-on: `ubuntu-latest`, working-directory: `nextjs-app`).
- **Langkah-langkah (Steps)**:
  1. `Checkout code` (`actions/checkout@v4`)
  2. `Setup Node.js` (`actions/setup-node@v4`, node-version: 20, cache: npm)
  3. `Install dependencies` (`run: npm ci`)
  4. `Run build` (`run: npm run build`)
  5. `Run lint (Biome)` (`run: npm run lint:biome`)
- **Type-check Step terpisah (`tsc --noEmit`)**: **TIDAK ADA** (meski `next build` menjalankan internal type check).
- **Test Step**: **TIDAK ADA**.
- **SonarQube Scan**: **TIDAK ADA**.
- **Deploy Step**: **TIDAK ADA** (deployment otomatis terhubung melalui Git integration Vercel).

### 3. File `sonar-project.properties`
- Status: **TIDAK ADA**.

### 4. Hasil Eksekusi Command Linter, Type Check, & Build
- **`npx tsc --noEmit`**:  
  **BERHASIL (Exit Code 0)**. 0 error, 0 warning. Type checking lulus 100%.
- **`npm run lint:biome` (`biome check src`)**:  
  **GAGAL (Exit Code 1)**. Terdeteksi **6 error** dan **10 warning**:
  - 1 error linter correctness: unused variable `inputBaseClass` di `src/components/register-form.tsx:132`.
  - 5 error formatting: perbedaan indentasi/formatting di `dashboard/dosen/page.tsx`, `dashboard/mahasiswa/page.tsx`, `layout.tsx`, `login-form.tsx`, dan `register-form.tsx`.
  - 10 warning linter complexity: penggunaan rule `noImportantStyles` (`!important`) di `src/app/globals.css` untuk browser autofill reset.
- **`npm run build` (`next build --turbopack`)**:  
  **BERHASIL (Exit Code 0)**. Mengompilasi 35 routes (3 static prerendered, 32 dynamic server-rendered) tanpa error fatal. Muncul 1 warning terkait konvensi `middleware.ts` yang disarankan migrasi ke `proxy.ts`.

### 5. Dokumentasi README & Link Vercel
- File `README.md` di root: **ADA**.
- Memuat link live Vercel: **ADA** pada baris 13: `https://ai-assessment-copilot.vercel.app`.

---

## BAGIAN F - DAFTAR KEKURANGAN JUJUR

### 1. Fitur yang Dijanjikan SRS Tetapi Belum Ada atau Masih Mock
1. **Integrasi AI/LLM Sungguhan (TIDAK ADA)**: Tidak ada integrasi SDK Gemini, OpenAI, maupun model AI lainnya. Field `aiReview` pada nilai mahasiswa murni string statis/mock hardcoded di memory store.
2. **Unggah Berkas & Ekstraksi Teks (TIDAK ADA)**: Mahasiswa hanya memasukkan teks URL link (`fileUrl`) dan notes, bukan mengunggah file fisik PDF/DOCX/TXT dan mengekstrak teksnya.
3. **Review Split-View (TIDAK ADA)**: Tidak ada antarmuka split-view bagi dosen untuk membaca tugas di satu sisi dan menilai di sisi lainnya.
4. **Penyimpanan Dwi-Versi & Audit Trail Perubahan (TIDAK ADA)**: Tidak ada pemisahan kolom skor AI dan skor final dosen, serta tidak ada riwayat perubahan/audit trail perbaikan nilai.
5. **Anonimisasi PII Mahasiswa (TIDAK ADA)**: Tidak ada modul atau regex masking untuk menganonimkan Nama/NIM.
6. **Role Admin & Manajemen Akun (TIDAK ADA)**: Sistem hanya mengenal role `dosen` dan `mahasiswa`.
7. **Notifikasi (MOCK)**: Panel notifikasi hanya menampilkan data statis dummy tanpa event trigger real-time.

### 2. Hal di Brief Proyek Akhir yang Belum Terpenuhi
1. **Testing & Coverage (0%)**: Tidak ada automated test (Vitest/Jest/Playwright) sama sekali di repository.
2. **SonarQube Quality Gate**: Tidak ada konfigurasi `sonar-project.properties` dan tidak ada step SonarQube di pipeline CI.
3. **Build Tool Vite / Rolldown**: Proyek sepenuhnya menggunakan Next.js + Turbopack, tidak memiliki konfigurasi Vite maupun Rolldown.
4. **Headless UI & CVA**: Tidak menggunakan `class-variance-authority` maupun Radix/shadcn; seluruh komponen styling ditulis secara custom manual.
5. **Fitur Lanjutan TypeScript**: Tidak ada discriminated union, branded types, `Pick`, atau `Omit`.
6. **Fitur Mutasi React 19**: Tidak ada pemakaian `useActionState`, `useOptimistic`, atau Server Actions.
7. **SEO & Metadata**: Tidak ada file `sitemap.ts` maupun `robots.ts`.

### 3. Utang Teknis & Risiko Keamanan
1. **Volatile In-Memory Storage**: Seluruh database menggunakan in-memory array server. Saat aplikasi di-deploy di Vercel, fungsi serverless yang stateless akan me-reset data setiap instance mati atau cold start.
2. **Password Plain Text**: Password disimpan dan divalidasi dalam bentuk teks biasa tanpa hashing (bcrypt/argon2).
3. **Session Tanpa Tanda Tangan Kriptografis**: Cookie session hanya berupa objek JSON yang di-Base64. Siapa pun dapat merekayasa payload cookie untuk mengubah user ID atau role menjadi dosen.
4. **Endpoint API GET Tanpa Proteksi**: Endpoint `/api/activities`, `/api/assessments`, `/api/assignments`, dan `/api/rubrics` dapat diakses oleh publik tanpa token sesi.
5. **Tidak Ada Rate Limiting**: Endpoint autentikasi `/api/auth/login` dan `/api/auth/register` tidak memiliki proteksi brute force rate limit.
6. **Inkonsistensi Validasi Register**: Endpoint `/api/auth/register` menggunakan validasi manual `if/else`, tidak menggunakan Zod schema seperti endpoint lainnya.
7. **Kegagalan Biome Linter di CI**: Perintah `npm run lint:biome` saat ini menghasilkan 6 error (formatting dan 1 unused variable) yang berpotensi memicu kegagalan pada pipeline CI jika dijalankan tanpa autofix.
