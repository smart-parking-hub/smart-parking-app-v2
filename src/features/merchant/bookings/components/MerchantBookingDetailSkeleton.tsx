import { Skeleton } from '@/shared/components/Skeleton'

export function MerchantBookingDetailSkeleton() {
  return (
    <div
      role="status"
      data-testid="merchant-booking-detail-skeleton"
      className="space-y-6"
      aria-label="Đang tải hồ sơ đặt chỗ"
    >
      <span className="sr-only">Đang tải hồ sơ đặt chỗ...</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4">
        {[1, 2, 3, 4].map((card) => (
          <Skeleton key={card} variant="card" className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]">
        <div className="space-y-6">
          <Skeleton variant="card" className="h-80 rounded-2xl" />
          <Skeleton variant="card" className="h-64 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton variant="card" className="h-52 rounded-2xl" />
          <Skeleton variant="card" className="h-44 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

