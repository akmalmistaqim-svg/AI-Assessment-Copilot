export default function MahasiswaFeedbackLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-56 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-80 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-card-bg rounded-2xl border border-border-color/60 p-6 md:p-8 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-border-color/50 rounded"></div>
                <div className="h-6 w-60 bg-border-color/60 rounded"></div>
              </div>
              <div className="h-10 w-24 bg-border-color/40 rounded-xl"></div>
            </div>
            <div className="h-20 w-full bg-border-color/30 rounded-xl"></div>
            <div className="h-16 w-full bg-border-color/20 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
