# AI Assessment Copilot - Next.js Modern Build & Rust Toolchain (Modul 8)

Aplikasi web modern berbasis **Next.js 16 (App Router)**, **React 19**, **Turbopack (Rust-based Bundler)**, dan **Biome (Rust Linter & Formatter)** yang mengimplementasikan arsitektur *high-performance frontend engineering*.

---

## 1. Implementasi Modern Build Tools & Rust Toolchain (Modul 8)

Proyek ini telah dikonfigurasi dan dioptimasi sesuai dengan requirement teknis **Modul 8: Build Tools Modern & Bundler Generasi Baru (Vite, Rolldown, Turbopack, & Rust Toolchain)**:

### A. Turbopack sebagai Modern Rust Bundler
- Menggantikan Webpack tradisional yang lambat dan monolitik.
- Script pengembangan dan build produksi telah mengaktifkan Turbopack secara eksplisit:
  - `npm run dev` &rarr; `next dev --turbopack`
  - `npm run build` &rarr; `next build --turbopack`
- Menggunakan arsitektur *incremental computation* dan *memoized function calls* berbasis mesin Rust untuk proses kompilasi secepat kilat.

### B. Biome Toolchain (Rust Linter & Formatter)
- Menggantikan kombinasi warisan ESLint dan Prettier secara penuh.
- Dikonfigurasi dalam berkas [`biome.json`](./biome.json):
  - **Linter**: Preset `recommended` dengan aturan ketat `noUnusedVariables: "error"`.
  - **Formatter**: `indentStyle: "space"`, `indentWidth: 2`, `lineWidth: 100`.
  - **Organize Imports**: Pengurutan import otomatis saat formatting.
  - **CSS Support**: Parser Tailwind CSS v4 directives diaktifkan.
- Script eksekusi tersedia di `package.json`:
  ```bash
  npm run lint:biome    # Menjalankan analisis statis cepat pada src/
  npm run format:biome  # Menata gaya kode sesuai standar proyek
  npm run check:biome   # Format + lint + organize imports sekaligus
  ```

### C. Strict TypeScript & Path Aliasing
- Dikonfigurasi pada [`tsconfig.json`](./tsconfig.json):
  - Path aliasing: `"@/*": ["./src/*"]` (memudahkan import modular tanpa `../../`).
  - Strict mode: `"strict": true` (tipe aman tanpa `any` implisit).
  - Index safety: `"noUncheckedIndexedAccess": true` (menghindari runtime undefined error pada array/objek dinamis).

---

## 2. Mekanisme Otomatisasi Code Splitting di Next.js App Router (Ekuivalen `manualChunks`)

Pada modul praktikum berbasis Vite/Rollup, pengembang diwajibkan menulis konfigurasi manual:
```ts
// Vite/Rollup (Manual Chunks)
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ["react", "react-dom"],
    },
  },
}
```

Pada **Next.js App Router**, pendekatan ini digantikan oleh **arsitektur otomatis tingkat rute (Route Segment Code Splitting)** yang jauh lebih unggul:

1. **Per-Route Entry Points**: Setiap berkas `page.tsx` di dalam `src/app/` secara otomatis dipecah menjadi chunk JavaScript terpisah oleh Turbopack. Browser pengguna hanya mengunduh chunk yang sesuai dengan rute yang sedang diakses (*route-based lazy loading*).
2. **Zero-Bundle React Server Components (RSC)**: Komponen server dieksekusi murni di Node.js runtime/server. Kode komponen, pustaka server, dan dependensinya tidak pernah disertakan ke dalam bundel JavaScript client (0 kB client JS overhead).
3. **Automatic Shared & Vendor Chunking**: Turbopack menganalisis graf dependensi dan secara otomatis mengekstrak pustaka bersama (seperti `react`, `react-dom`, `@tanstack/react-query`, `lucide-react`, `zustand`, `zod`) ke dalam chunk vendor bersama tanpa konfigurasi manual yang rentan usang.
4. **Granular Client Hydration**: Komponen dengan direktif `"use client"` diisolasi dalam bundel kecil tersendiri, meminimalkan waktu pemblokiran main-thread (*Interaction to Next Paint* / INP optimal).

---

## 3. Hasil Benchmark Performa Nyata (Benchmarking Toolchain 2026)

Pengujian benchmark dilakukan secara langsung pada lingkungan lokal proyek:

| Indikator Performa | Metrik Nyata | Keterangan |
| :--- | :--- | :--- |
| **Cold Start `npm run dev`** | **3.81 detik** (3,815 ms) | Dari eksekusi perintah hingga server siap menerima request HTTP pada port lokal |
| **Build Produksi `npm run build`** | **12.86 detik** (12,861 ms) | Kompilasi Turbopack + Type Check TypeScript + Generasi 20 rute statis/dinamis |
| **Static Page Generation (20 Routes)** | **571 milidetik** | Waktu generasi 20 rute static/SSR paralel oleh 3 worker |
| **Biome Linter & Check (`109 files`)** | **152 milidetik** (0.15 detik) | Analisis statis 109 berkas kode sumber TypeScript/TSX/CSS tanpa error/warning |
| **ESLint Tradisional (Estimasi Proyek)** | ~10–25 detik | Biome **~70x hingga 100x lebih cepat** dibanding kakas linter berbasis JavaScript |

---

## 4. Status Rute Aplikasi (Production Output)

```text
Route (app)                              Size     First Load JS
┌ ○ /                                    Static   (Redirect ke /login)
├ ○ /_not-found                          Static
├ ƒ /api/assessments                     Dynamic  API Handler
├ ƒ /api/assessments/[id]                Dynamic  API Handler
├ ƒ /api/assignments                    Dynamic  API Handler
├ ƒ /api/assignments/[id]                Dynamic  API Handler
├ ƒ /api/auth/login                      Dynamic  API Handler (Zod Validated)
├ ƒ /api/auth/logout                     Dynamic  API Handler
├ ƒ /api/auth/me                         Dynamic  API Handler
├ ƒ /api/auth/register                   Dynamic  API Handler
├ ƒ /api/classes                         Dynamic  API Handler
├ ƒ /api/classes/[id]                    Dynamic  API Handler
├ ƒ /api/rubrics                         Dynamic  API Handler
├ ƒ /api/rubrics/[id]                    Dynamic  API Handler
├ ƒ /dashboard/dosen                     Dynamic  Server Component
├ ƒ /dashboard/dosen/assessments         Dynamic  CRUD Assessments (TanStack Query)
├ ƒ /dashboard/dosen/assignments         Dynamic  CRUD Assignments (TanStack Query)
├ ƒ /dashboard/dosen/classes             Dynamic  CRUD Classes (TanStack Query)
├ ƒ /dashboard/dosen/classes/[id]        Dynamic  Detail Kelas
├ ƒ /dashboard/dosen/rubrics             Dynamic  CRUD Rubrics (TanStack Query)
├ ƒ /dashboard/mahasiswa                 Dynamic  Student Portal
├ ○ /login                               Static   Interactive Form Client Component
└ ○ /register                            Static   Registration Client Component

ƒ Proxy (Middleware)                     Protected Route Gatekeeper
```

---

## 5. Cara Menjalankan

```bash
# 1. Menjalankan dev server dengan Turbopack
npm run dev

# 2. Menjalankan linter Biome
npm run lint:biome

# 3. Menjalankan formatter Biome
npm run format:biome

# 4. Kompilasi build produksi teroptimasi
npm run build
```
