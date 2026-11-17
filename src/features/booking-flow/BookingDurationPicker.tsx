import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Check, Clock3 } from 'lucide-react'
import { control, Field } from '@/shared/components/Workspace'
import { bookingDurationLabel } from './time'

interface Props {
  minutes: number
  onChange: (minutes: number) => void
}
const quickDurations = [30, 60, 120, 240, 480, 1440]
interface DurationParts { hours: string; extraMinutes: string }

export function BookingDurationPicker({ minutes, onChange }: Props) {
  const id = useId()
  const [custom, setCustom] = useState(!quickDurations.includes(minutes))
  const parts = useForm<DurationParts>({ defaultValues: {
    hours: Number.isFinite(minutes) ? String(Math.floor(minutes / 60)) : '',
    extraMinutes: Number.isFinite(minutes) ? String(minutes % 60) : '0',
  } })
  const publish = (hours: string, extraMinutes: string) => {
    const value = hours.trim() === '' ? NaN : Number(hours)
    onChange(Number.isSafeInteger(value) ? value * 60 + Number(extraMinutes) : NaN)
  }
  const choose = (value: number) => {
    parts.setValue('hours', String(Math.floor(value / 60)))
    parts.setValue('extraMinutes', String(value % 60))
    setCustom(false)
    if (value !== minutes) onChange(value)
  }

  return <fieldset className="min-w-0 space-y-3 sm:col-span-2">
    <legend className="mb-2 text-sm font-medium">Bạn muốn đỗ bao lâu?</legend>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {quickDurations.map(value => <button key={value} type="button" aria-pressed={!custom && minutes === value}
        onClick={() => choose(value)}
        className={`relative flex min-h-11 items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50 ${!custom && minutes === value ? 'border-brand-primary bg-orange-50 text-brand-primary ring-1 ring-inset ring-brand-primary' : 'border-brand-border bg-white hover:border-brand-primary hover:bg-brand-surface'}`}>
        {bookingDurationLabel(value)}{!custom && minutes === value && <Check size={12} aria-hidden="true"/>}
      </button>)}
    </div>
    <button type="button" aria-expanded={custom} aria-controls={`${id}-custom`} onClick={() => setCustom(value => !value)}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-xs font-semibold text-brand-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-50">
      <Clock3 size={15} aria-hidden="true"/>Thời lượng khác
    </button>
    {custom && <div id={`${id}-custom`} className="space-y-2 rounded-xl border border-brand-border bg-brand-surface p-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Số giờ đỗ"><input type="number" min={0} step={1} className={control} inputMode="numeric"
          {...parts.register('hours', { onChange: event => publish(event.target.value, parts.getValues('extraMinutes')) })}/></Field>
        <Field label="Thêm phút"><select className={control}
          {...parts.register('extraMinutes', { onChange: event => publish(parts.getValues('hours'), event.target.value) })}>
          <option value="0">0 phút</option><option value="30">30 phút</option>
        </select></Field>
      </div>
      <p className="text-xs leading-5 text-brand-muted">Ví dụ: 1 giờ + 30 phút. Đặt tối thiểu 30 phút; có thể chọn nhiều ngày.</p>
    </div>}
  </fieldset>
}
