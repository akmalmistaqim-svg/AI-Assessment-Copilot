export default function DosenLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-64 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card-bg rounded-xl border border-border-color p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-border-color/50 rounded"></div>
              <div className="w-9 h-9 rounded-lg bg-border-color/40"></div>
            </div>
            <div className="h-8 w-16 bg-border-color/60 rounded-md"></div>
            <div className="h-3 w-32 bg-border-color/40 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes List Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 bg-border-color/60 rounded"></div>
            <div className="h-4 w-20 bg-border-color/40 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card-bg rounded-xl border border-border-color p-5 space-y-4"
              >
                <div className="h-5 w-40 bg-border-color/60 rounded"></div>
                <div className="h-3 w-28 bg-border-color/40 rounded"></div>
                <div className="pt-3 border-t border-border-color flex justify-between">
                  <div className="h-4 w-20 bg-border-color/40 rounded"></div>
                  <div className="h-4 w-20 bg-border-color/40 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-border-color/60 rounded"></div>
          <div className="bg-card-bg rounded-xl border border-border-color p-5 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-border-color/50 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-full bg-border-color/50 rounded"></div>
                  <div className="h-3 w-20 bg-border-color/40 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
