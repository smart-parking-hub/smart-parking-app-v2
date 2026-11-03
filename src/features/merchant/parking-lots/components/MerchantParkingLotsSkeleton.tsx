export function MerchantParkingLotsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* 3 Bento Cards Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 bg-slate-200/80 rounded-2xl" />
      </div>

      {/* 3 Articles Skeleton */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-slate-200/80 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
