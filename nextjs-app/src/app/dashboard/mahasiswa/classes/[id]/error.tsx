"use client";

import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function MahasiswaClassDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-card-bg rounded-2xl border border-border-color p-8 md:p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm mt-8">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <AlertCircle size={24} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-text-primary">Gagal Memuat Detail Kelas</h2>
        <p className="text-xs text-text-secondary mt-1">
          {error.message || "Data kelas tidak dapat ditampilkan saat ini."}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard/mahasiswa/classes"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-slate-100 rounded-lg transition no-underline"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Kelas</span>
        </Link>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-xs cursor-pointer active:scale-95"
        >
          <RotateCcw size={14} />
          <span>Coba Lagi</span>
        </button>
      </div>
    </div>
  );
}
