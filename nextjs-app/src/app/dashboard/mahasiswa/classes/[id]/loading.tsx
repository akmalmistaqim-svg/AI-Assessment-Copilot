import { Loader2 } from "lucide-react";

export default function MahasiswaClassDetailLoading() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="h-4 w-36 bg-border-color/60 rounded animate-pulse" />
      <div className="h-48 bg-card-bg border border-border-color rounded-2xl animate-pulse" />
      <div className="h-40 bg-card-bg border border-border-color rounded-xl animate-pulse flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary-green animate-spin" />
      </div>
    </div>
  );
}
