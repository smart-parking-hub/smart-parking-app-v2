import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Info, Truck } from 'lucide-react'
import { Notice, Panel, button, control, secondary } from '@/shared/components/Workspace'
import { Autocomplete } from '@/shared/components/Autocomplete'
import { errorMessage } from '@/shared/api/resources'
import { saveVehicle, vehicleInputSchema, vehicleTypes, type VehicleInput, type VehicleRecord } from '../api/vehicleDataApi'

// Optional input suggestions, not an authoritative vehicle/model registry.
const brandSuggestions = ['Toyota', 'Ford', 'Hyundai', 'Isuzu', 'Hino', 'Thaco', 'Kia', 'Mazda', 'Mitsubishi', 'Mercedes-Benz', 'Volvo', 'Suzuki']

const vehicleIcons: Record<VehicleInput['vehicleType'], string> = {
  SEDAN_SUV: '🚗',
  BUS_COACH: '🚌',
  LIGHT_TRUCK: '🛻',
  HEAVY_TRUCK: '🚚',
  CONTAINER: '🚛',
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
  const save = useMutation({
    mutationFn: (values: VehicleInput) => saveVehicle(values, vehicle?.id),
    onSuccess: onSaved,
  })
  const errors = form.formState.errors
  const fieldError = (field: keyof VehicleInput) => errors[field] && (
    <p id={`${id}-${field}-error`} role="alert" className="text-sm text-red-700">{errors[field]?.message}</p>
  )
  const describedBy = (field: keyof VehicleInput) => `${id}-${field}-hint${errors[field] ? ` ${id}-${field}-error` : ''}`

  return <Panel>
    <div className="mb-6 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange-ink"><Truck size={22} aria-hidden="true" /></span>
      <div>
        <h2 className="font-sora text-xl font-semibold">{vehicle ? 'Cập nhật phương tiện' : 'Thêm phương tiện'}</h2>
        <p className="mt-1 text-sm leading-6 text-brand-muted">Thông tin dùng khi đặt chỗ. Các mục có dấu * là bắt buộc.</p>
      </div>
    </div>
    <form noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]" onSubmit={form.handleSubmit(values => save.mutate(values))}>
      <div className="min-w-0 space-y-6">
        <fieldset disabled={save.isPending} className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
          <legend className="sr-only">Thông tin phương tiện</legend>
          <div className="space-y-2">
            <label htmlFor={`${id}-plate`} className="text-sm font-semibold">Biển số xe <span aria-hidden="true" className="text-brand-orange-ink">*</span></label>
            <input id={`${id}-plate`} aria-label="Biển số xe" className={`${control} font-semibold tracking-wide uppercase`} autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={20} placeholder="Ví dụ: 51C-123.45" aria-required="true" aria-invalid={Boolean(errors.licensePlate)} aria-describedby={describedBy('licensePlate')}
              {...form.register('licensePlate', { onBlur: event => form.setValue('licensePlate', String(event.target.value).trim().toUpperCase().replace(/\s+/g, ''), { shouldValidate: true }) })} />
            <p id={`${id}-licensePlate-hint`} className="text-xs leading-5 text-brand-muted">Nhập đúng biển số trên xe. Tự chuyển chữ hoa và bỏ khoảng trắng.</p>
            {fieldError('licensePlate')}
          </div>
          <div className="space-y-2">
            <label htmlFor={`${id}-type`} className="text-sm font-semibold">Loại xe <span aria-hidden="true" className="text-brand-orange-ink">*</span></label>
            <select id={`${id}-type`} defaultValue={vehicle?.vehicleType ?? ''} aria-label="Loại xe" className={control} aria-required="true" aria-invalid={Boolean(errors.vehicleType)} aria-describedby={describedBy('vehicleType')} {...form.register('vehicleType')}>
              <option value="" disabled>Chọn loại xe</option>
              {Object.entries(vehicleTypes).map(([value, label]) => <option key={value} value={value}>{vehicleIcons[value as VehicleInput['vehicleType']]} {label}</option>)}
            </select>
            <p id={`${id}-vehicleType-hint`} className="text-xs leading-5 text-brand-muted">Chọn theo xe thực tế để tìm đúng loại chỗ đỗ.</p>
            {fieldError('vehicleType')}
          </div>
          <div className="space-y-2">
            <label htmlFor={`${id}-weight`} className="text-sm font-semibold">Trọng tải (tấn) <span aria-hidden="true" className="text-brand-orange-ink">*</span></label>
            <input id={`${id}-weight`} aria-label="Trọng tải (tấn)" className={control} type="number" inputMode="decimal" min="0.01" max="999.99" step="0.01" placeholder="Ví dụ: 12.5" aria-required="true" aria-invalid={Boolean(errors.weightTon)} aria-describedby={describedBy('weightTon')} {...form.register('weightTon')} />
            <p id={`${id}-weightTon-hint`} className="text-xs leading-5 text-brand-muted">Nhập theo hồ sơ xe. 1 tấn = 1.000 kg.</p>
            {fieldError('weightTon')}
          </div>
          <div className="space-y-2">
            <label htmlFor={`${id}-brand`} className="text-sm font-semibold">Nhãn hiệu / Model (không bắt buộc)</label>
            <Controller name="brandModel" control={form.control} render={({ field }) => (
              <Autocomplete id={`${id}-brand`} ref={field.ref} name={field.name} value={field.value}
                onValueChange={field.onChange} onBlur={field.onBlur} options={brandSuggestions}
                disabled={save.isPending} maxLength={100} placeholder="Tìm hãng hoặc nhập hãng, model…"
                aria-invalid={Boolean(errors.brandModel)} aria-describedby={describedBy('brandModel')} />
            )} />
            <p id={`${id}-brandModel-hint`} className="text-xs leading-5 text-brand-muted">Gõ để xem gợi ý hãng; vẫn có thể nhập hãng và model khác.</p>
            {fieldError('brandModel')}
          </div>
        </fieldset>
        {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}
        <div className="flex flex-wrap gap-3 border-t border-brand-border pt-5">
          <button className={`${button} min-h-12`} disabled={save.isPending}>{save.isPending ? 'Đang lưu…' : 'Lưu phương tiện'}</button>
          <button type="button" className={`${secondary} min-h-12`} disabled={save.isPending} onClick={onClose}>Hủy</button>
        </div>
      </div>
      <aside className="self-start rounded-xl border border-brand-border border-t-2 border-t-brand-orange bg-brand-surface p-5 text-sm leading-6">
        <div className="mb-3 flex items-center gap-2 font-semibold"><Info size={18} aria-hidden="true" />Thông tin tự khai</div>
        <p className="text-brand-muted">Kiểm tra biển số, loại xe và trọng tải trước khi lưu.</p>
        <p className="mt-3 text-brand-muted">Lưu phương tiện chưa đồng nghĩa với xác minh giấy tờ hoặc quyền sở hữu xe.</p>
      </aside>
    </form>
  </Panel>
}
