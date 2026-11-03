import { ArrowLeft, ArrowRight, Save, Check, RefreshCw } from 'lucide-react'

interface CreateParkingLotActionFooterProps {
  currentStep: number // 0, 1, 2
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  onSaveDraft: () => void
  draftSaved: boolean
}

export function CreateParkingLotActionFooter({
  currentStep,
  submitting,
  onBack,
  onNext,
  onSubmit,
  onSaveDraft,
  draftSaved,
}: CreateParkingLotActionFooterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-2xl shadow-2xs border border-slate-200/80">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc] text-[#0d1c2e] transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 cursor-pointer disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4 text-slate-600" />
        <span>
          {currentStep === 0
            ? 'Hủy Bỏ & Quay Về Danh Sách'
            : currentStep === 1
              ? 'Quay Lại Bước 1 (Thông Tin Cơ Bản)'
              : 'Quay Lại Bước 2 (Vị Trí Thực Địa)'}
        </span>
      </button>

      {/* Action group */}
      <div className="w-full sm:w-auto flex items-center gap-3 justify-end flex-wrap sm:flex-nowrap">
        {/* Save Draft */}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={submitting}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0d1c2e] transition-colors text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-slate-200 shadow-2xs cursor-pointer"
        >
          {draftSaved ? (
            <>
              <Check className="w-4 h-4 text-[#d95f00]" />
              <span className="text-[#d95f00] font-bold">Đã Lưu Nháp</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-slate-600" />
              <span>Lưu Bản Nháp</span>
            </>
          )}
        </button>

        {/* Next / Submit */}
        {currentStep < 2 ? (
          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white transition-all text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {currentStep === 0
                ? 'TIẾP TỤC: VỊ TRÍ & BẢN ĐỒ (BƯỚC 2/3)'
                : 'TIẾP TỤC: XÁC NHẬN HỒ SƠ & GỬI DUYỆT (BƯỚC 3/3)'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white transition-all text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ĐANG KHỞI TẠO HỒ SƠ...</span>
              </>
            ) : (
              <>
                <span>XÁC NHẬN TẠO BÃI ĐỖ MỚI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
