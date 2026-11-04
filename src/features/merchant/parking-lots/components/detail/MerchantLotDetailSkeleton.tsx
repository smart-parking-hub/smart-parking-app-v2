export function MerchantLotDetailSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-96 max-w-full bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 max-w-full bg-slate-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
            <div className="h-10 w-28 bg-slate-200 rounded-xl" />
            <div className="h-10 w-36 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 2. Bento Grid 4 Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 h-36 flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-6 w-6 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-36 bg-slate-200 rounded-lg my-2" />
            <div className="h-3 w-full bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* 3. Core 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-72" />
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-72" />
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-48" />
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-64" />
        </div>

        {/* Right Col (4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-64" />
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-72" />
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 h-64" />
        </div>
      </div>
    </div>
  )
}
