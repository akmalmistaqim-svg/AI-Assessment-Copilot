"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function MahasiswaClassesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Classes error:", error);
  }, [error]);

  return (
    <div className="bg-card-bg rounded-2xl border border-border-color p-8 md:p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm mt-8">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
        <AlertCircle size={24} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-text-primary">Gagal Memuat Kelas</h2>
        <p className="text-xs text-text-secondary mt-1">
          {error.message || "Terjadi kendala saat mengambil data kelas Anda."}
        </p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary-green hover:bg-dark-green rounded-lg transition shadow-xs cursor-pointer active:scale-95"
      >
        <RotateCcw size={14} />
        <span>Coba Lagi</span>
      </button>
    </div>
  );
}
