export function VehiclesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="vehicles-skeleton">
      {/* Top Strip Skeleton */}
      <div className="h-10 bg-slate-200/80 rounded-xl" />

      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-8 w-80 bg-slate-200 rounded" />
          <div className="h-4 w-96 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-48 bg-slate-200 rounded-lg" />
          <div className="h-11 w-48 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* 4 Bento KPI Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 p-4" />
        ))}
      </div>

      {/* Toolbar Skeleton */}
      <div className="h-16 bg-white rounded-xl border border-slate-200 p-4" />

      {/* Split Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 h-96 bg-white rounded-xl border border-slate-200" />
        <div className="xl:col-span-4 h-96 bg-white rounded-xl border border-slate-200" />
      </div>
    </div>
  )
}
