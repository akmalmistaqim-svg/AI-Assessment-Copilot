"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Login Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border-color rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-primary">Gagal Memuat Halaman Login</h2>
          <p className="text-xs text-text-secondary mt-1">
            {error.message || "Terjadi kesalahan saat memuat form autentikasi."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-green hover:bg-dark-green text-white text-xs font-semibold transition shadow-sm hover:shadow"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
