import { Loader2 } from "lucide-react";

export default function MahasiswaClassesLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-border-color/60 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-border-color/40 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 bg-card-bg border border-border-color rounded-xl animate-pulse" />
        <div className="h-24 bg-card-bg border border-border-color rounded-xl animate-pulse" />
      </div>

      <div className="bg-card-bg rounded-2xl border border-border-color p-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-primary-green animate-spin mx-auto" />
        <p className="text-sm text-text-secondary">Memuat data kelas...</p>
      </div>
    </div>
  );
}
