export function ParkingDetailSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 py-6 animate-pulse">
      {/* Top back link placeholder */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="h-5 w-48 bg-slate-200 rounded" />
        <div className="h-5 w-64 bg-slate-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="h-6 w-56 bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
            <div className="h-6 w-full bg-slate-100 rounded pt-2" />
          </div>

          {/* Photo Gallery Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="h-56 bg-slate-200 rounded-xl" />
            <div className="h-56 bg-slate-200 rounded-xl" />
            <div className="h-56 bg-slate-200 rounded-xl" />
          </div>

          {/* Capacity Matrix Skeleton */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="h-6 w-60 bg-slate-200 rounded" />
            <div className="space-y-3 pt-2">
              <div className="h-16 bg-slate-100 rounded-lg" />
              <div className="h-16 bg-slate-100 rounded-lg" />
              <div className="h-16 bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md flex flex-col gap-4">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            <div className="h-16 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-32 bg-slate-100 rounded-lg" />
            <div className="h-12 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
