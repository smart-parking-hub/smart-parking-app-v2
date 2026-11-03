import type {
  NotificationStatusFilter,
  NotificationCategoryFilter,
} from '../types/notificationTypes'

interface NotificationsFilterBarProps {
  statusFilter: NotificationStatusFilter
  onStatusFilterChange: (status: NotificationStatusFilter) => void
  categoryFilter: NotificationCategoryFilter
  onCategoryFilterChange: (cat: NotificationCategoryFilter) => void
  totalCount: number
  unreadCount: number
  urgentCount: number
  refreshSecondsCountdown: number
}

export function NotificationsFilterBar({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  totalCount,
  unreadCount,
  urgentCount,
  refreshSecondsCountdown,
}: NotificationsFilterBarProps) {
  return (
    <section className="flex flex-col gap-3.5 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs">
      {/* Row 1: Status Tabs + Auto-refresh ticker */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status: All */}
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`filter-status-btn px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-status="all"
          >
            <span>Tất cả</span>
            <span className="font-mono text-xs opacity-80">({totalCount.toString().padStart(2, '0')})</span>
          </button>

          {/* Status: Unread */}
          <button
            type="button"
            onClick={() => onStatusFilterChange('unread')}
            className={`filter-status-btn px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              statusFilter === 'unread'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-status="unread"
          >
            <span>Chưa đọc</span>
            <span
              className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                statusFilter === 'unread'
                  ? 'bg-[#d95f00] text-white'
                  : 'bg-[#ffeedd] text-[#d95f00]'
              }`}
            >
              {unreadCount.toString().padStart(2, '0')}
            </span>
          </button>

          {/* Status: Urgent */}
          <button
            type="button"
            onClick={() => onStatusFilterChange('urgent')}
            className={`filter-status-btn px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              statusFilter === 'urgent'
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-status="urgent"
          >
            <span>Quan trọng &amp; Khẩn cấp</span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              ({urgentCount.toString().padStart(2, '0')})
            </span>
          </button>
        </div>

        {/* Real-time ticker badge */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500 font-semibold uppercase tracking-wider">
            TỰ ĐỘNG LÀM MỚI:
          </span>
          <span className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 font-bold border border-slate-200">
            {refreshSecondsCountdown.toString().padStart(2, '0')}s
          </span>
        </div>
      </div>

      {/* Row 2: Event Category Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onCategoryFilterChange('all')}
          className={`filter-category-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          data-category="all"
        >
          Tất cả sự kiện
        </button>

        <button
          type="button"
          onClick={() => onCategoryFilterChange('queue')}
          className={`filter-category-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            categoryFilter === 'queue'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          data-category="queue"
        >
          <span className="text-[#d95f00]">⚡</span>
          <span>Hàng đợi ảo (Queue Alerts)</span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryFilterChange('gate')}
          className={`filter-category-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            categoryFilter === 'gate'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          data-category="gate"
        >
          <span>🅿️</span>
          <span>Đặt chỗ &amp; Barie (Booking &amp; Gate)</span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryFilterChange('payment')}
          className={`filter-category-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            categoryFilter === 'payment'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          data-category="payment"
        >
          <span>💳</span>
          <span>Thanh toán &amp; HĐĐT (Payments)</span>
        </button>

        <button
          type="button"
          onClick={() => onCategoryFilterChange('route')}
          className={`filter-category-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            categoryFilter === 'route'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          data-category="route"
        >
          <span className="text-[#d95f00]">⚠️</span>
          <span>Cảnh báo lộ trình (Road &amp; Fleet)</span>
        </button>
      </div>
    </section>
  )
}
