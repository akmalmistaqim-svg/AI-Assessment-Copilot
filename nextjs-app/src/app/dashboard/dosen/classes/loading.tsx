export default function ClassesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-48 bg-border-color/60 rounded-md"></div>
        <div className="h-4 w-64 bg-border-color/40 rounded-md mt-2"></div>
      </div>

      <div className="bg-card-bg rounded-xl border border-border-color p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-border-color">
          <div className="h-6 w-36 bg-border-color/60 rounded"></div>
          <div className="h-9 w-28 bg-border-color/50 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border-color rounded-xl p-5 space-y-3">
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
    </div>
  );
}
