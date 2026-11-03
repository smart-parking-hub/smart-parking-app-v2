import { ChevronRight, ChevronLeft } from 'lucide-react'

interface NotificationsPaginationProps {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export function NotificationsPagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: NotificationsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(totalItems, currentPage * pageSize)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="font-mono text-xs text-slate-500">
        HIỂN THỊ{' '}
        <span className="font-bold text-slate-900">
          {startItem} - {endItem}
        </span>{' '}
        TRÊN TỔNG SỐ{' '}
        <span className="font-bold text-slate-900">{totalItems}</span> SỰ KIỆN
      </div>

      <div className="flex items-center gap-1.5">
        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Trang trước"
            className="h-9 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`w-9 h-9 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === pageNum
                ? 'bg-[#131b2e] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="h-9 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>TIẾP</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
