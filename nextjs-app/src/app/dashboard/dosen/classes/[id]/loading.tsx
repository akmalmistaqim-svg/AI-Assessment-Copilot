export default function ClassDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      <div className="h-6 w-32 bg-border-color/50 rounded"></div>
      <div className="bg-card-bg rounded-xl border border-border-color p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-border-color/60 rounded"></div>
          <div className="h-4 w-40 bg-border-color/40 rounded"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-color">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-border-color/20 space-y-2">
              <div className="h-3 w-16 bg-border-color/40 rounded"></div>
              <div className="h-6 w-12 bg-border-color/60 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
