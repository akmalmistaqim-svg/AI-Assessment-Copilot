export default function MahasiswaLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-56 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-72 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card-bg rounded-xl border border-border-color p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-border-color/50 rounded"></div>
              <div className="w-9 h-9 rounded-lg bg-border-color/40"></div>
            </div>
            <div className="h-8 w-16 bg-border-color/60 rounded-md"></div>
            <div className="h-3 w-32 bg-border-color/40 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-border-color/60 rounded"></div>
            <div className="h-4 w-20 bg-border-color/40 rounded"></div>
          </div>

          <div className="bg-card-bg rounded-xl border border-border-color divide-y divide-border-color">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-border-color/60 rounded"></div>
                  <div className="h-3 w-32 bg-border-color/40 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-border-color/50 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-36 bg-border-color/60 rounded"></div>
          <div className="bg-card-bg rounded-xl border border-border-color p-5 space-y-4">
            <div className="h-5 w-40 bg-border-color/60 rounded"></div>
            <div className="h-8 w-20 bg-border-color/50 rounded"></div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full bg-border-color/40 rounded"></div>
              <div className="h-3 w-4/5 bg-border-color/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
