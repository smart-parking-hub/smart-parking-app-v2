import { Truck, Search, RefreshCw } from 'lucide-react'

interface SearchParkingEmptyStateProps {
  radiusKm: number
  includeFull: boolean
  onExpandRadius: () => void
  onToggleIncludeFull: () => void
  onResetFilters: () => void
}

export function SearchParkingEmptyState({
  radiusKm,
  includeFull,
  onExpandRadius,
  onToggleIncludeFull,
  onResetFilters,
}: SearchParkingEmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 text-center border border-slate-200/90 shadow-sm">
      <div className="w-16 h-16 rounded-3xl bg-[#eff4ff] text-[#455f87] flex items-center justify-center mx-auto mb-4 shadow-inner">
        <Truck className="w-8 h-8 text-[#0d1c2e]" />
      </div>
      <h4 className="font-sora text-lg sm:text-xl font-bold text-[#0d1c2e]">
        Không Tìm Thấy Bãi Đỗ Xe Nào Phù Hợp
      </h4>
      <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
        Không có bãi xe nào trong bán kính <strong>{radiusKm}km</strong> đáp ứng bộ lọc hiện tại.
        Hãy thử mở rộng phạm vi tìm kiếm hoặc bật hiển thị các bãi đã đầy.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onExpandRadius}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.99] cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>Mở rộng bán kính (35km)</span>
        </button>

        {!includeFull && (
          <button
            type="button"
            onClick={onToggleIncludeFull}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>Hiện cả bãi đã đầy</span>
          </button>
        )}

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>
    </div>
  )
}

