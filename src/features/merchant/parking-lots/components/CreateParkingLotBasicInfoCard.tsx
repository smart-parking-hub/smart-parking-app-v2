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
    <section className="registration-card" aria-labelledby="registration-info-heading">
      <div className="registration-card-heading">
        <span className="registration-section-icon"><Warehouse size={21} aria-hidden="true" /></span>
        <div>
          <h2 id="registration-info-heading">Thông tin bãi đỗ</h2>
          <p>Giúp tài xế nhận diện và tìm đúng bãi đỗ của bạn.</p>
        </div>
        <span className="registration-required-note"><span aria-hidden="true">*</span> Bắt buộc</span>
      </div>
      <div className="registration-fields">
        <div className="registration-field">
          <label htmlFor="lot-name-input">Tên bãi đỗ <span aria-hidden="true">*</span></label>
          <div className="registration-input-wrap" data-invalid={Boolean(errors.name)}>
            <Warehouse size={18} aria-hidden="true" />
            <input id="lot-name-input" type="text" placeholder="Ví dụ: Bãi đỗ Tân Cảng – Phú Hữu" maxLength={150}
              aria-required="true" aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'lot-name-error' : 'lot-name-hint'}
              {...register('name')} />
          </div>
          {errors.name ? <p id="lot-name-error" role="alert" className="registration-field-error"><AlertCircle size={15} />{errors.name.message}</p>
            : <p id="lot-name-hint" className="registration-field-hint">Sử dụng tên chính thức, tối đa 150 ký tự.</p>}
        </div>
        <div className="registration-field">
          <label htmlFor="lot-address-input">Địa chỉ bãi đỗ <span aria-hidden="true">*</span></label>
          <div className="registration-input-wrap registration-textarea-wrap" data-invalid={Boolean(errors.address)}>
            <Signpost size={18} aria-hidden="true" />
            <textarea id="lot-address-input" rows={3} placeholder="Số nhà, tên đường, phường/xã, tỉnh/thành phố"
              maxLength={255} aria-required="true" aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? 'lot-address-error' : 'lot-address-hint'}
              {...register('address')} />
          </div>
          {errors.address ? <p id="lot-address-error" role="alert" className="registration-field-error"><AlertCircle size={15} />{errors.address.message}</p>
            : <p id="lot-address-hint" className="registration-field-hint">Ghi rõ địa chỉ và lối vào bãi để tài xế dễ tìm. Tối đa 255 ký tự.</p>}
        </div>
        {/* Applied AI Content Preview Ribbon if any */}
        {aiContent && (
          <div className="p-4 rounded-xl bg-brand-navy-light text-white border border-brand-border flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
              <span className="font-mono text-xs font-bold text-brand-primary-border uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-primary-ink" />
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
    </section>
  )
}
