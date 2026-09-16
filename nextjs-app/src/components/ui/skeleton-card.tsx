interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`bg-card-bg rounded-xl border border-border-color p-5 space-y-3 animate-pulse ${className}`}
    >
      <div className="h-5 w-2/3 bg-border-color/60 rounded"></div>
      <div className="h-3 w-1/2 bg-border-color/40 rounded"></div>
      {lines > 2 && <div className="h-3 w-4/5 bg-border-color/30 rounded"></div>}
      <div className="pt-3 border-t border-border-color flex justify-between">
        <div className="h-4 w-16 bg-border-color/40 rounded"></div>
        <div className="h-4 w-16 bg-border-color/40 rounded"></div>
      </div>
    </div>
  );
}
