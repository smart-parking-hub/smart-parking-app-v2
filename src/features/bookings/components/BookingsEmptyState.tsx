import { Link } from 'react-router-dom'
import { TicketSlash, Search, RotateCcw } from 'lucide-react'

interface BookingsEmptyStateProps {
  searchKeyword?: string
  activeTab?: string
  onResetFilters?: () => void
}

export function BookingsEmptyState({
  searchKeyword,
  activeTab,
  onResetFilters,
}: BookingsEmptyStateProps) {
  const isFiltered = Boolean(searchKeyword?.trim() || (activeTab && activeTab !== 'ALL'))

  return (
    <div
      role="region"
      aria-label="Không tìm thấy đơn đặt chỗ"
      className="w-full py-16 px-6 flex items-center justify-center bg-white rounded-2xl border border-slate-200/90 shadow-xs"
    >
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-xs">
          <TicketSlash className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-[#d95f00] uppercase tracking-wider">
            DANH SÁCH ĐẶT CHỖ
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            {isFiltered ? 'Không Tìm Thấy Vé Phù Hợp' : 'Chưa Có Đơn Đặt Chỗ Nào'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isFiltered
              ? `Không tìm thấy vé đặt chỗ nào khớp với tiêu chí tìm kiếm hoặc trạng thái đã chọn. Vui lòng thử từ khóa khác hoặc hoàn tác bộ lọc.`
              : 'Bạn chưa có lượt đặt giữ chỗ bãi xe container nào trên hệ thống. Hãy tìm kiếm bãi xe phù hợp và đặt chỗ giữ vị trí ALPR ngay.'}
          </p>
        </div>

        <div className="w-full pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          {isFiltered && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Xóa bộ lọc & tìm kiếm</span>
            </button>
          )}

          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>TÌM BÃI ĐỖ XE NGAY (SCR-015)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

