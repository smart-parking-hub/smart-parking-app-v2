export function PaymentCancelSkeleton() {
  return (
    <div className="w-full max-w-[860px] mx-auto py-8 px-4 sm:px-6 flex flex-col gap-6 animate-pulse">
      {/* Session Header Track Skeleton */}
      <div className="w-full h-11 bg-slate-200 rounded-xl" />

      {/* Main Notice Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="w-48 h-5 bg-slate-200 rounded" />
          <div className="w-72 h-7 bg-slate-200 rounded" />
          <div className="w-full h-4 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Countdown Box Skeleton */}
      <div className="w-full h-32 bg-slate-200 rounded-2xl" />

      {/* Grid 7 Cols + 5 Cols Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 h-80" />
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 h-80" />
      </div>

      {/* Action Buttons Bar Skeleton */}
      <div className="w-full h-36 bg-white rounded-2xl border border-slate-200" />
    </div>
  )
}
