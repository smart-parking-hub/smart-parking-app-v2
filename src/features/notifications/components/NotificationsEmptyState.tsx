import { Link } from 'react-router-dom'
import { Bell, CheckCheck, RotateCcw, SearchX } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/Button'
import type { NotificationEmptyVariant } from '../types/notificationTypes'

interface NotificationsEmptyStateProps {
  variant: NotificationEmptyVariant
  onResetFilters: () => void
}

export function NotificationsEmptyState({
  variant,
  onResetFilters,
}: NotificationsEmptyStateProps) {
  if (variant === 'no-notifications') {
    return (
      <EmptyState
        variant="card"
        icon={Bell}
        title="Bạn chưa có thông báo nào"
        description="Các thông báo về xác nhận đặt chỗ, lượt chờ hàng đợi ảo, thanh toán cước và cập nhật hệ thống sẽ xuất hiện tại đây."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/parking"
              className="min-h-[44px] inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
            >
              Tìm bãi đỗ ngay
            </Link>
            <Link
              to="/bookings"
              className="min-h-[44px] inline-flex items-center justify-center rounded-xl border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50 transition-colors"
            >
              Xem vé &amp; đặt chỗ
            </Link>
          </div>
        }
      />
    )
  }

  if (variant === 'all-read') {
    return (
      <EmptyState
        variant="card"
        icon={CheckCheck}
        title="Bạn đã đọc tất cả thông báo"
        description="Không còn thông báo chưa đọc nào trên trang hiện tại."
        action={
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onResetFilters}
            leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            className="min-h-[44px]"
          >
            Xem tất cả thông báo
          </Button>
        }
      />
    )
  }

  return (
    <EmptyState
      variant="card"
      icon={SearchX}
      title="Không tìm thấy thông báo phù hợp"
      description="Không có thông báo nào khớp với bộ lọc hoặc từ khóa tìm kiếm trên trang hiện tại."
      action={
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onResetFilters}
          leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
          className="min-h-[44px]"
        >
          Xóa bộ lọc
        </Button>
      }
    />
  )
}
