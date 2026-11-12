import type { Booking } from '@/entities/operations'

interface MerchantBookingsMetricsProps {
  totalElements: number
  pageRows: Booking[]
  selectedLotName?: string | null
}

export function MerchantBookingsMetrics({
  totalElements,
  pageRows,
  selectedLotName,
}: MerchantBookingsMetricsProps) {
  const pendingCheckInCount = pageRows.filter((row) => row.status === 'PENDING_CHECKIN').length
  const parkingCount = pageRows.filter((row) => row.status === 'PARKING').length
  const completedCount = pageRows.filter((row) => row.status === 'COMPLETED').length

  const cards = [
    {
      label: 'Tổng lượt đặt chỗ',
      value: totalElements,
      title: selectedLotName ? `Đang lọc theo bãi: ${selectedLotName}` : undefined,
    },
    {
      label: 'Chờ vào · trang này',
      value: pendingCheckInCount,
      title: 'Đơn đã cọc đang chờ check-in trên trang hiện tại',
    },
    {
      label: 'Đang đỗ · trang này',
      value: parkingCount,
      title: 'Phương tiện đang lưu trú trong bãi trên trang hiện tại',
    },
    {
      label: 'Hoàn tất · trang này',
      value: completedCount,
      title: 'Đơn đã quyết toán hoàn tất trên trang hiện tại',
    },
  ]

  return (
    <div
      data-testid="merchant-bookings-metrics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          title={card.title}
          className="rounded-2xl border border-brand-border bg-white p-4 md:p-5"
        >
          <p className="font-mono text-xs uppercase text-brand-muted">
            {card.label}
          </p>
          <p className="font-sora text-2xl font-bold mt-2.5 tabular-nums text-brand-navy">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}

