export default function ActivitiesLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-4 w-44 bg-border-color/60 rounded"></div>

      <div>
        <div className="h-8 w-60 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-80 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      <div className="bg-card-bg rounded-2xl border border-border-color p-6 shadow-sm space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-border-color/60 last:border-none"
          >
            <div className="w-8 h-8 rounded-full bg-border-color/50 shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-border-color/60 rounded"></div>
              <div className="h-3 w-1/3 bg-border-color/40 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
