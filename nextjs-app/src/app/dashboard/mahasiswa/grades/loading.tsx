export default function MahasiswaGradesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-72 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-card-bg rounded-xl border border-border-color/60 p-5"
          ></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card-bg rounded-2xl border border-border-color/60 p-6 space-y-4"
          >
            <div className="h-4 w-32 bg-border-color/60 rounded"></div>
            <div className="h-6 w-48 bg-border-color/60 rounded"></div>
            <div className="h-10 w-24 bg-border-color/40 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
