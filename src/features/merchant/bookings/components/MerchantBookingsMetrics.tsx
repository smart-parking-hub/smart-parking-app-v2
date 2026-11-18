import type { MerchantBookingStatusCounts } from '../types/merchantBookingsTypes'

interface MerchantBookingsMetricsProps {
  totalElements: number | null
  statusCounts?: MerchantBookingStatusCounts | null
  selectedLotName?: string | null
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  scopeNote?: string | null
}

export function MerchantBookingsMetrics({
  totalElements,
  statusCounts,
  selectedLotName,
  isLoading = false,
  isError = false,
  onRetry,
  scopeNote,
}: MerchantBookingsMetricsProps) {
  const formatCount = (value: number | null | undefined) => {
    if (isLoading) return '…'
    if (isError || value === null || value === undefined) return '—'
    return value
  }

  const suffix = scopeNote ? ` · ${scopeNote}` : ''

  const cards = [
    {
      key: 'total',
      label: `Tổng lượt đặt chỗ${suffix}`,
      value: formatCount(totalElements),
      title: selectedLotName ? `Đang lọc theo bãi: ${selectedLotName}` : undefined,
    },
    {
      key: 'pending',
      label: `Chờ vào${suffix}`,
      value: formatCount(statusCounts?.PENDING_CHECKIN),
      title: 'Đơn đã cọc đang chờ check-in',
    },
    {
      key: 'parking',
      label: `Đang đỗ${suffix}`,
      value: formatCount(statusCounts?.PARKING),
      title: 'Phương tiện đang lưu trú trong bãi',
    },
    {
      key: 'completed',
      label: `Hoàn tất${suffix}`,
      value: formatCount(statusCounts?.COMPLETED),
      title: 'Đơn đã quyết toán hoàn tất',
    },
  ]

  return (
    <div className="space-y-2.5">
      <div
        data-testid="merchant-bookings-metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4"
      >
        {cards.map((card) => (
          <div
            key={card.key}
            data-testid={`booking-metric-${card.key}`}
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

      {isError && (
        <div
          role="alert"
          data-testid="merchant-bookings-metrics-error"
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs text-amber-900"
        >
          <span>
            Không thể tải thống kê tổng theo trạng thái từ máy chủ. Các chỉ số trạng thái đang tạm ẩn để tránh hiển thị sai.
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="font-semibold text-[#9e4300] underline hover:no-underline cursor-pointer"
            >
              Thử lại thống kê
            </button>
          )}
        </div>
      )}
    </div>
  )
}
