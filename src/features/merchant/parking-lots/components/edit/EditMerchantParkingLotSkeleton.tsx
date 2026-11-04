export function EditMerchantParkingLotSkeleton() {
  return (
    <main className="w-full bg-[#f8f9ff] min-h-screen py-6 px-4 md:px-6">
      <div className="w-full max-w-[1280px] mx-auto space-y-6 animate-pulse">
        {/* Top bar skeleton */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-64 bg-slate-200 rounded" />
            <div className="h-8 w-96 bg-slate-300 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-44 bg-slate-200 rounded-lg" />
            <div className="h-10 w-44 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* Feedback Alert Skeleton */}
        <div className="h-44 w-full bg-slate-300 rounded-2xl" />

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-72 w-full bg-slate-200 rounded-2xl" />
            <div className="h-64 w-full bg-slate-200 rounded-2xl" />
            <div className="h-64 w-full bg-slate-200 rounded-2xl" />
            <div className="h-40 w-full bg-slate-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 w-full bg-slate-200 rounded-2xl" />
            <div className="h-48 w-full bg-slate-200 rounded-2xl" />
            <div className="h-40 w-full bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </main>
  )
}
