import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Info, Truck } from 'lucide-react'
import { Notice, button, control, secondary } from '@/shared/components/Workspace'
import { Modal } from '@/shared/components/Modal'
import { Select } from '@/shared/components/Select'
import { Autocomplete } from '@/shared/components/Autocomplete'
import { errorMessage } from '@/shared/api/resources'
import { saveVehicle, vehicleInputSchema, vehicleTypes, type VehicleInput, type VehicleRecord } from '../api/vehicleDataApi'

// Optional input suggestions, not an authoritative vehicle/model registry.
const brandSuggestions = ['Toyota', 'Ford', 'Hyundai', 'Isuzu', 'Hino', 'Thaco', 'Kia', 'Mazda', 'Mitsubishi', 'Mercedes-Benz', 'Volvo', 'Suzuki']

const weightExamples: Record<VehicleInput['vehicleType'], string> = {
  SEDAN_SUV: '1.8',
  BUS_COACH: '15.0',
  LIGHT_TRUCK: '3.5',
  HEAVY_TRUCK: '18.0',
  CONTAINER: '32.0',
}

export function VehicleEditor({ vehicle, onClose, onSaved }: {
  vehicle?: VehicleRecord
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const id = useId()
  const form = useForm<VehicleInput>({
    resolver: zodResolver(vehicleInputSchema),
    defaultValues: {
      licensePlate: vehicle?.licensePlate ?? '',
      vehicleType: vehicle?.vehicleType,
      weightTon: vehicle?.weightTon,
      brandModel: vehicle?.brandModel ?? '',
    },
  })
  const selectedType = form.watch('vehicleType')
  const isTypeSelected = Boolean(selectedType)

  const save = useMutation({
    mutationFn: (values: VehicleInput) => saveVehicle(values, vehicle?.id),
    onSuccess: onSaved,
  })
  const errors = form.formState.errors
  const fieldError = (field: keyof VehicleInput) => errors[field] && (
    <p id={`${id}-${field}-error`} role="alert" className="text-sm text-red-700">{errors[field]?.message}</p>
  )
  const describedBy = (field: keyof VehicleInput) => `${id}-${field}-hint${errors[field] ? ` ${id}-${field}-error` : ''}`

  return (
    <Modal isOpen onClose={onClose} maxWidth="xl">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-ink">
          <Truck size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-sora text-xl font-semibold">{vehicle ? 'Cập nhật phương tiện' : 'Thêm phương tiện'}</h2>
          <p className="mt-1 text-sm leading-6 text-brand-muted">Thông tin dùng khi đặt chỗ. Các mục có dấu * là bắt buộc.</p>
        </div>
      </div>

      <form noValidate className="space-y-6" onSubmit={form.handleSubmit(values => save.mutate(values))}>
        <fieldset disabled={save.isPending} className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <legend className="sr-only">Thông tin phương tiện</legend>

          {/* Biển số xe */}
          <div className="grid content-start gap-2">
            <label htmlFor={`${id}-plate`} className="text-sm font-semibold">
              Biển số xe <span aria-hidden="true" className="text-brand-orange-ink">*</span>
            </label>
            <input
              id={`${id}-plate`}
              aria-label="Biển số xe"
              className={`${control} h-12 font-semibold tracking-wide uppercase`}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={20}
              placeholder="Ví dụ: 51C-123.45"
              aria-required="true"
              aria-invalid={Boolean(errors.licensePlate)}
              aria-describedby={describedBy('licensePlate')}
              {...form.register('licensePlate', {
                onBlur: event => form.setValue('licensePlate', String(event.target.value).trim().toUpperCase().replace(/\s+/g, ''), { shouldValidate: true }),
              })}
            />
            <p id={`${id}-licensePlate-hint`} className="text-xs leading-5 text-brand-muted">
              Nhập đúng biển số trên xe. Tự chuyển chữ hoa và bỏ khoảng trắng.
            </p>
            {fieldError('licensePlate')}
          </div>

          {/* Loại xe: Sử dụng component Select mẫu dùng chung */}
          <div className="grid content-start gap-2">
            <label htmlFor={`${id}-type`} className="text-sm font-semibold">
              Loại xe <span aria-hidden="true" className="text-brand-orange-ink">*</span>
            </label>
            <Controller
              name="vehicleType"
              control={form.control}
              render={({ field }) => (
                <Select
                  id={`${id}-type`}
                  ariaLabel="Loại xe"
                  triggerAriaHidden={true}
                  value={field.value ?? ''}
                  onChange={(val) => {
                    field.onChange(val)
                    if (form.getValues('weightTon')) {
                      void form.trigger('weightTon')
                    }
                  }}
                  disabled={save.isPending}
                  options={Object.entries(vehicleTypes).map(([val, label]) => ({
                    value: val,
                    label,
                  }))}
                  placeholder="Chọn loại xe"
                  size="lg"
                  variant="default"
                  triggerClassName="h-12 rounded-xl border-brand-border text-sm font-normal text-slate-800 hover:border-slate-400 focus:border-brand-primary"
                />
              )}
            />
            <p id={`${id}-vehicleType-hint`} className="text-xs leading-5 text-brand-muted">
              Chọn theo xe thực tế để tìm đúng loại chỗ đỗ.
            </p>
            {fieldError('vehicleType')}
          </div>

          {/* Trọng tải (tấn) */}
          <div className="grid content-start gap-2">
            <label htmlFor={`${id}-weight`} className="text-sm font-semibold">
              Trọng tải (tấn) <span aria-hidden="true" className="text-brand-orange-ink">*</span>
            </label>
            <input
              id={`${id}-weight`}
              aria-label="Trọng tải (tấn)"
              className={`${control} h-12 ${!isTypeSelected ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
              type="number"
              inputMode="decimal"
              min="0.01"
              max="999.99"
              step="0.01"
              disabled={!isTypeSelected || save.isPending}
              placeholder={isTypeSelected ? `Ví dụ: ${weightExamples[selectedType]} tấn` : 'Vui lòng chọn loại xe trước'}
              aria-required="true"
              aria-invalid={Boolean(errors.weightTon)}
              aria-describedby={describedBy('weightTon')}
              {...form.register('weightTon')}
            />
            <p id={`${id}-weightTon-hint`} className="text-xs leading-5 text-brand-muted">
              {isTypeSelected
                ? `Nhập theo hồ sơ xe (Ví dụ: ${weightExamples[selectedType]} tấn). 1 tấn = 1.000 kg.`
                : 'Vui lòng chọn loại xe trước để nhập trọng tải.'}
            </p>
            {fieldError('weightTon')}
          </div>

          {/* Nhãn hiệu / Model */}
          <div className="grid content-start gap-2">
            <label htmlFor={`${id}-brand`} className="text-sm font-semibold">
              Nhãn hiệu / Model (không bắt buộc)
            </label>
            <Controller
              name="brandModel"
              control={form.control}
              render={({ field }) => (
                <Autocomplete
                  id={`${id}-brand`}
                  ref={field.ref}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={brandSuggestions}
                  disabled={save.isPending}
                  maxLength={100}
                  placeholder="Tìm hãng hoặc nhập hãng, model…"
                  aria-invalid={Boolean(errors.brandModel)}
                  aria-describedby={describedBy('brandModel')}
                />
              )}
            />
            <p id={`${id}-brandModel-hint`} className="text-xs leading-5 text-brand-muted">
              Gõ để xem gợi ý hãng; vẫn có thể nhập hãng và model khác.
            </p>
            {fieldError('brandModel')}
          </div>
        </fieldset>

        {/* Thông tin tự khai: Chuyển xuống dưới và mở rộng toàn chiều ngang sang phải */}
        <aside className="rounded-xl border border-brand-border border-t-2 border-t-brand-orange bg-brand-surface p-4 sm:p-5 text-sm leading-relaxed">
          <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
            <Info size={18} className="text-brand-orange shrink-0" aria-hidden="true" />
            <span>Thông tin tự khai</span>
          </div>
          <div className="text-brand-muted space-y-1 text-xs sm:text-sm">
            <p>Kiểm tra biển số, loại xe và trọng tải trước khi lưu.</p>
            <p>Lưu phương tiện chưa đồng nghĩa với xác minh giấy tờ hoặc quyền sở hữu xe.</p>
          </div>
        </aside>

        {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}

        <div className="flex flex-wrap gap-3 border-t border-brand-border pt-4">
          <button className={`${button} min-h-12`} disabled={save.isPending}>
            {save.isPending ? 'Đang lưu…' : 'Lưu phương tiện'}
          </button>
          <button type="button" className={`${secondary} min-h-12`} disabled={save.isPending} onClick={onClose}>
            Hủy
          </button>
        </div>
      </form>
    </Modal>
  )
}
