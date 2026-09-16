"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center p-4">
      <div className="bg-card-bg border border-border-color rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">
            Aplikasi Mengalami Kendala
          </h1>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
            {error.message ||
              "Terjadi kesalahan yang tidak terduga pada sistem. Silakan coba memuat ulang halaman."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-green hover:bg-dark-green text-white text-xs font-semibold transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-text-primary text-xs font-semibold transition no-underline active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
