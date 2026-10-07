export function EpicsLoadingState() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-slate-200 rounded"></div>
          <div className="h-4 w-56 bg-slate-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded hidden sm:block"></div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-slate-50 border border-slate-100 rounded-lg p-5 h-48 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-5 w-16 bg-slate-200 rounded"></div>
              <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-7 h-7 bg-slate-200 rounded-full"></div>
                <div className="h-3 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex justify-between">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
