export function SearchParkingSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse" aria-label="Đang tải dữ liệu bãi đỗ xe">
      {/* Search Bar Skeleton */}
      <div className="h-14 w-full bg-slate-200 rounded-2xl" />

      {/* Split view workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
        {/* Left List Skeleton */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-44 w-full bg-slate-200 rounded-2xl" />
          <div className="h-44 w-full bg-slate-200 rounded-2xl" />
          <div className="h-44 w-full bg-slate-200 rounded-2xl" />
        </div>

        {/* Right Map Canvas Skeleton */}
        <div className="lg:col-span-7 pt-1">
          <div className="h-[680px] w-full bg-slate-300 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
