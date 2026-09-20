export default function AssignmentDetailLoading() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-4 w-36 bg-border-color/60 rounded"></div>

      <div className="bg-card-bg rounded-2xl border border-border-color p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-5 w-20 bg-border-color/60 rounded-full"></div>
            <div className="h-8 w-64 bg-border-color/60 rounded"></div>
            <div className="h-4 w-40 bg-border-color/40 rounded"></div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-border-color/40"></div>
        </div>

        <div className="h-16 w-full bg-border-color/20 rounded-xl"></div>

        <div className="h-32 w-full bg-border-color/30 rounded-xl"></div>
      </div>
    </div>
  );
}
