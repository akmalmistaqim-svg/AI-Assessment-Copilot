export default function MahasiswaAssignmentsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-64 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      <div className="h-14 w-full bg-border-color/30 rounded-xl"></div>

      <div className="bg-card-bg rounded-xl border border-border-color p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-b border-border-color/60 last:border-none space-y-2">
            <div className="h-5 w-48 bg-border-color/60 rounded"></div>
            <div className="h-3 w-32 bg-border-color/40 rounded"></div>
            <div className="h-3 w-24 bg-border-color/30 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
