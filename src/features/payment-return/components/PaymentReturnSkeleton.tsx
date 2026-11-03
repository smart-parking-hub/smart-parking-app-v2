export function PaymentReturnSkeleton() {
  return (
    <div className="w-full max-w-[860px] mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-slate-200 mb-4" />
        <div className="w-48 h-6 bg-slate-200 rounded-lg mb-2" />
        <div className="w-64 h-8 bg-slate-200 rounded-lg mb-4" />
        <div className="w-full max-w-lg h-4 bg-slate-200 rounded mb-6" />
        <div className="w-full h-12 bg-slate-100 rounded-xl" />
      </div>

      {/* Grid 7 Cols + 5 Cols Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 h-96 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-1/3 h-5 bg-slate-200 rounded" />
            <div className="w-1/2 h-8 bg-slate-200 rounded" />
            <div className="w-full h-10 bg-slate-100 rounded-xl" />
            <div className="w-full h-10 bg-slate-100 rounded-xl" />
            <div className="w-full h-10 bg-slate-100 rounded-xl" />
          </div>
          <div className="w-full h-12 bg-slate-100 rounded-xl" />
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 h-96 flex flex-col items-center justify-between">
          <div className="w-3/4 h-5 bg-slate-200 rounded" />
          <div className="w-48 h-48 bg-slate-200 rounded-2xl" />
          <div className="w-full h-11 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
