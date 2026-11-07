import { RotateCcw, ArrowRight, Loader2, Save } from 'lucide-react'

interface MerchantSlotsStickyFooterProps {
  hasChanges: boolean
  isSaving: boolean
  isLocked?: boolean
  lotCode?: string
  onReset: () => void
  onSave: () => void
}

export function MerchantSlotsStickyFooter({
  hasChanges,
  isSaving,
  isLocked = false,
  lotCode = 'VN-SGN-CLG2-09',
  onReset,
  onSave,
}: MerchantSlotsStickyFooterProps) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status indicator & Endpoint info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-3 h-3 rounded-full bg-[#d95f00] animate-ping shrink-0 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-800 font-semibold">
              Cập nhật đồng thời 5 nhóm tải trọng bãi xe
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Endpoint: PUT /api/v1/merchant/parking-lots/{lotCode}/slots/bulk
            </span>
          </div>
        </div>

        {/* Buttons dock */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasChanges || isSaving || isLocked}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Gốc (Hủy Thay Đổi)</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isLocked || !hasChanges}
            aria-busy={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white transition-colors text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-45 disabled:hover:bg-[#d95f00] disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang ghi nhận cơ sở dữ liệu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>LƯU CẤU HÌNH SỨC CHỨA HÀNG LOẠT (BULK SAVE)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
