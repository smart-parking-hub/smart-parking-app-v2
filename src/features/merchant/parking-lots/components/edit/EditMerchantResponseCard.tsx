import { MessageSquareText } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { EditParkingLotFormData } from '../../types/merchantParkingLotTypes'

interface EditMerchantResponseCardProps {
  register: UseFormRegister<EditParkingLotFormData>
  errors: FieldErrors<EditParkingLotFormData>
  disabled?: boolean
}

export function EditMerchantResponseCard({
  register,
  errors,
  disabled = false,
}: EditMerchantResponseCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs border border-slate-200/80">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-[#eff4ff] text-[#455f87] flex items-center justify-center shrink-0">
          <MessageSquareText className="w-5 h-5 text-[#455f87]" />
        </div>
        <h2 className="font-sora text-base sm:text-lg text-[#131b2e] font-bold">
          Mô Tả Bổ Sung Giải Trình Của Chủ Bãi (Merchant Response)
        </h2>
      </div>

      <div>
        <label
          htmlFor="merchant-response-input"
          className="block text-xs sm:text-sm font-semibold text-[#131b2e] mb-1.5 cursor-pointer"
        >
          Ghi chú phúc đáp trực tiếp gửi Hội đồng Thẩm định Admin{' '}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="merchant-response-input"
          rows={4}
          disabled={disabled}
          {...register('merchantResponse')}
          placeholder="Nhập nội dung giải trình các điểm đã điều chỉnh (tọa độ cổng barie, tài liệu PCCC, ảnh hiện trường bổ sung...)"
          className="w-full p-3.5 bg-[#eff4ff] text-[#131b2e] text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d95f00]/30 border border-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed font-medium"
        />
        {errors.merchantResponse && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.merchantResponse.message}
          </p>
        )}
      </div>
    </div>
  )
}
