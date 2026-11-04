import { Info, Send, Save, Loader2 } from 'lucide-react'

interface EditMerchantActionFooterProps {
  lotName?: string
  revisionNumber?: string
  submitting?: boolean
  disabled?: boolean
  onCancel: () => void
  onSaveDraft: () => void
  onSubmit: () => void
}

export function EditMerchantActionFooter({
  lotName = 'Depot Tân Cảng Phú Hữu (Cơ Sở 2)',
  revisionNumber = 'Rev 2.1',
  submitting = false,
  disabled = false,
  onCancel,
  onSaveDraft,
  onSubmit,
}: EditMerchantActionFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 lg:left-[260px] right-0 bg-white/95 backdrop-blur-md py-3.5 px-4 sm:px-6 shadow-lg border-t border-slate-200 z-30 transition-all">
      <div className="w-full max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Revision info */}
        <div className="flex items-center gap-2 text-slate-600 font-mono text-xs w-full sm:w-auto justify-center sm:justify-start">
          <Info className="w-4 h-4 text-[#d95f00] shrink-0" />
          <span className="truncate">
            Hồ sơ: <strong className="text-[#131b2e] font-semibold">{lotName}</strong> · Lần sửa đổi:{' '}
            <span className="font-bold text-[#d95f00]">{revisionNumber}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#131b2e] font-semibold text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200 shadow-2xs"
          >
            Hủy Bỏ Thay Đổi
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#131b2e] text-white hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
          >
            <Save className="w-4 h-4 text-slate-300" />
            <span>Lưu Bản Nháp Nội Bộ</span>
          </button>

          <button
            id="btn-submit-review"
            type="button"
            disabled={disabled || submitting}
            onClick={onSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#d95f00] text-white hover:bg-[#b84e00] font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ĐANG GỬI HỒ SƠ...</span>
              </>
            ) : (
              <>
                <span>GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
