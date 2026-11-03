import { Warehouse, Signpost, Sparkles, X, AlertCircle } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { AiContentSegments } from '../types/merchantParkingLotTypes'

interface CreateParkingLotBasicInfoCardProps {
  register: UseFormRegister<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>
  errors: FieldErrors<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>
  aiContent: AiContentSegments | null
  onClearAiContent: () => void
}

export function CreateParkingLotBasicInfoCard({
  register,
  errors,
  aiContent,
  onClearAiContent,
}: CreateParkingLotBasicInfoCardProps) {
  return (
    <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-6">
      {/* Card Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#d95f00] shrink-0">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold">
              Khai Báo Định Danh &amp; Địa Chỉ Bãi Đỗ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Thông tin pháp lý chính thức để hiển thị trên cổng thông tin điều phối và hóa đơn vận tải.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#eff4ff] text-slate-700 font-semibold border border-slate-200">
          FORM-SEC-01
        </span>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-5">
        {/* Lot Name Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lot-name-input" className="text-xs sm:text-sm font-semibold text-[#0d1c2e] flex items-center justify-between cursor-pointer">
            <span>Tên Bãi Đỗ Khai Báo (Chính Thức)</span>
            <span className="text-[#d95f00] font-mono text-[11px] font-bold">* Bắt buộc (Tối đa 150 ký tự)</span>
          </label>
          <div
            className={`relative flex items-center bg-[#eff4ff] px-3.5 py-2.5 rounded-xl border transition-all ${
              errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200/80 focus-within:border-[#0d1c2e] focus-within:ring-2 focus-within:ring-slate-200'
            }`}
          >
            <Warehouse className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
            <input
              id="lot-name-input"
              type="text"
              placeholder="Ví dụ: Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)"
              maxLength={150}
              {...register('name')}
              className="w-full bg-transparent text-sm text-[#0d1c2e] font-medium placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Address Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lot-address-input" className="text-xs sm:text-sm font-semibold text-[#0d1c2e] flex items-center justify-between cursor-pointer">
            <span>Địa Chỉ Mặt Bằng / Trục Đường Tiếp Cận Hàng Hóa</span>
            <span className="text-slate-500 font-mono text-[11px]">* Bắt buộc (Tối đa 255 ký tự)</span>
          </label>
          <div
            className={`relative flex items-start bg-[#eff4ff] px-3.5 py-2.5 rounded-xl border transition-all ${
              errors.address ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200/80 focus-within:border-[#0d1c2e] focus-within:ring-2 focus-within:ring-slate-200'
            }`}
          >
            <Signpost className="w-4 h-4 text-slate-500 mr-2.5 mt-1 shrink-0" />
            <textarea
              id="lot-address-input"
              rows={3}
              placeholder="Ví dụ: Số 12 Đường Gò Cát, Phường Phú Hữu, TP. Thủ Đức, TP. Hồ Chí Minh (Cách vòng xoay Phú Hữu 1.5 km)"
              maxLength={255}
              {...register('address')}
              className="w-full bg-transparent text-sm text-[#0d1c2e] font-normal placeholder:text-slate-400 focus:outline-none resize-none"
            />
          </div>
          {errors.address && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.address.message}</span>
            </p>
          )}
        </div>

        {/* Applied AI Content Preview Ribbon if any */}
        {aiContent && (
          <div className="p-4 rounded-xl bg-[#0d1c2e] text-white border border-[#341100] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="font-mono text-xs font-bold text-[#ffb690] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d95f00]" />
                Nội dung AI Fretrix-Dispatch đã đồng bộ vào hồ sơ
              </span>
              <button
                type="button"
                onClick={onClearAiContent}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
                title="Gỡ bỏ nội dung AI"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
              <p>
                <strong className="text-white">1. Năng lực tiếp vận:</strong> {aiContent.logisticsCapacity}
              </p>
              <p>
                <strong className="text-white">2. Quy định PCCC:</strong> {aiContent.safetyRegulations}
              </p>
              <p>
                <strong className="text-white">3. Hướng dẫn tiếp cận:</strong> {aiContent.circulationGuide}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
