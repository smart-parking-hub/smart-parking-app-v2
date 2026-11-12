import { Skeleton } from '@/shared/components/Skeleton'

export function MerchantBookingsSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Đang tải danh sách đơn đặt chỗ"
      data-testid="merchant-bookings-skeleton"
    >
      <span className="sr-only">Đang tải danh sách đơn đặt chỗ...</span>

      {/* 4 Dashboard-style KPI cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
        {[1, 2, 3, 4].map((card) => (
          <Skeleton key={card} variant="card" className="h-24" />
        ))}
      </div>

      {/* Unified Filter + 5-row Table Card Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs">
        <div className="border-b border-slate-100 px-4 py-3.5 space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
            <Skeleton className="lg:col-span-5 h-10 w-full rounded-xl" />
            <Skeleton className="lg:col-span-4 h-10 w-full rounded-xl" />
            <Skeleton className="lg:col-span-3 h-10 w-full rounded-xl" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-32 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>

        <div className="p-4">
          <Skeleton variant="table" rows={5} />
        </div>
      </div>
    </div>
  )
}

