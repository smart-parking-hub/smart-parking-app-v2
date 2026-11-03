export function MerchantDashboardSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-label="Đang tải dữ liệu bảng điều khiển">
      {/* Top Banner Skeleton */}
      <div className="h-32 w-full bg-slate-200 rounded-none lg:rounded-b-2xl" />

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 space-y-6">
        {/* Bento Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
          <div className="h-36 bg-slate-200 rounded-2xl" />
        </div>

        {/* 65% : 35% Split Columns Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-80 bg-slate-200 rounded-2xl" />
            <div className="h-80 bg-slate-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-80 bg-slate-200 rounded-2xl" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
