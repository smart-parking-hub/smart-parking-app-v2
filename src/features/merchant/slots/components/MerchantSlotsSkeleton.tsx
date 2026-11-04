export function MerchantSlotsSkeleton() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-48 bg-slate-200 rounded" />
        <div className="h-8 w-96 bg-slate-200 rounded" />
        <div className="h-4 w-64 bg-slate-200 rounded" />
      </div>

      {/* Banner Skeleton */}
      <div className="h-16 w-full bg-slate-200 rounded-xl" />

      {/* 3 KPI Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-28 bg-slate-200 rounded-2xl" />
      </div>

      {/* 5 Cards Skeleton */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-36 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
