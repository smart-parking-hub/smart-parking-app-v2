import { BellOff, RotateCcw } from 'lucide-react'

interface NotificationsEmptyStateProps {
  onResetFilters: () => void
}

export function NotificationsEmptyState({
  onResetFilters,
}: NotificationsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center gap-3.5 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <BellOff className="w-7 h-7" />
      </div>

      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-base font-bold font-sora text-slate-800">
          Không tìm thấy thông báo nào
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Không có sự kiện vận hành nào khớp với bộ lọc hiện tại. Thử chọn danh mục khác hoặc đặt lại bộ lọc.
        </p>
      </div>

      <button
        type="button"
        onClick={onResetFilters}
        className="mt-2 h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-200"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Xem tất cả thông báo</span>
      </button>
    </div>
  )
}
