import { ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react'

interface MerchantParkingLotsPaginationProps {
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (newPage: number) => void
}

export function MerchantParkingLotsPagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: MerchantParkingLotsPaginationProps) {
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

  return (
    <div className="w-full mt-6 flex flex-col gap-5">
      {/* Regulatory Notice Banner */}
      <div className="bg-[#eff4ff] p-4 sm:p-5 rounded-2xl border border-slate-200/90 flex items-start gap-3 sm:gap-4 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-[#d95f00] mt-0.5">
          <ShieldAlert className="w-4 h-4 text-[#d95f00]" />
        </div>
        <div className="flex flex-col text-[#0d1c2e]">
          <span className="font-sora text-xs sm:text-sm font-bold">
            Quy Định Kiểm Duyệt Cơ Sở Khai Thác Mới
          </span>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
            Mỗi bãi đỗ mới tạo cần được Admin phê duyệt thẩm định PCCC, giấy phép kho bãi và đồng bộ camera ALPR trước khi mở bán chỗ đỗ trực tuyến trên bản đồ tài xế SmartTruck. Thời gian xét duyệt thông thường từ 24 - 48 giờ làm việc.
          </p>
        </div>
      </div>

      {/* Footer Bar Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200/80 font-mono text-xs text-slate-500">
        <span>
          Hiển thị {startItem} - {endItem} của {totalElements} cơ sở bãi đỗ thương mại
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 0}
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200/80 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">« Trang trước</span>
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === idx
                  ? 'bg-[#131b2e] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200/80 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Trang tiếp"
          >
            <span className="hidden sm:inline">Trang tiếp »</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
