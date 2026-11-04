export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Đang tải dữ liệu tổng quan">
      {/* Banner Skeleton */}
      <div className="h-48 w-full bg-slate-200 rounded-2xl" />

      {/* KPI Bento Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-40 bg-slate-300 rounded-2xl" />
        <div className="h-40 bg-slate-200 rounded-2xl" />
      </div>

      {/* Active Trip Card Skeleton */}
      <div className="h-80 w-full bg-slate-200 rounded-2xl" />

      {/* Shortcuts Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="h-36 bg-slate-200 rounded-2xl" />
      </div>

      {/* Recent Bookings Skeleton */}
      <div className="h-64 w-full bg-slate-200 rounded-2xl" />
    </div>
  )
}

