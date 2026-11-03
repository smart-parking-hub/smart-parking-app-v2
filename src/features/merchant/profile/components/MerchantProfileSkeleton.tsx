export function MerchantProfileSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* Top Header Ribbon Skeleton */}
      <div className="bg-white rounded-2xl p-6 lg:p-7 shadow-xs border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 w-full max-w-xl">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-8 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-full" />
        </div>
        <div className="h-14 bg-slate-200 rounded-xl w-64" />
      </div>

      {/* Two-Column Master Layout (40% Left : 60% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
            <div className="space-y-3 pt-3">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="h-5 bg-slate-200 rounded w-1/2" />
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-24 bg-slate-100 rounded-xl" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
            <div className="h-16 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
