import { Bus, Car, Container, Truck } from 'lucide-react'
import { vehicleLabels } from '@/entities/operations'
import { formatMoney, type Lot } from '@/features/booking-flow'
import { Notice, Panel } from '@/shared/components/Workspace'

const vehicleIcons = { SEDAN_SUV: Car, BUS_COACH: Bus, LIGHT_TRUCK: Truck, HEAVY_TRUCK: Truck, CONTAINER: Container }

export function ParkingCapacityPricing({ lot, compact = false }: { lot: Lot; compact?: boolean }) {
  const columns = compact || lot.slots.length < 2 ? '' : lot.slots.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'
  return <Panel title="Sức chứa và bảng giá">
    <p className="-mt-2 mb-5 text-sm leading-relaxed text-brand-muted">Chọn loại xe phù hợp. Lịch trống theo giờ được kiểm tra khi đặt chỗ.</p>
    {lot.slots.length === 0 ? <Notice>Bãi chưa cập nhật sức chứa.</Notice> : <div className={`grid gap-4 ${columns}`}>
      {lot.slots.map(slot => {
        const tariff = lot.pricingRules.find(price => price.vehicleType === slot.vehicleType)
        const Icon = vehicleIcons[slot.vehicleType]
        const label = vehicleLabels[slot.vehicleType]
        const available = slot.availableCapacity > 0
        return <article key={slot.vehicleType} aria-label={label} className="rounded-2xl border border-brand-border bg-white p-4 md:p-5">
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand-primary"><Icon size={22} aria-hidden="true"/></span>
              <h3 className="font-sora text-sm font-semibold">{label}</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${available ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>{available ? 'Còn chỗ' : 'Hiện đã hết chỗ'}</span>
          </header>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs text-brand-muted">Giá đỗ cơ bản</p>{tariff ? <p className="mt-1 font-sora text-xl font-semibold text-brand-primary">{formatMoney(Number(tariff.basePricePerHour))}<span className="ml-1 font-inter text-xs font-normal text-brand-muted">/giờ</span></p> : <p className="mt-1 text-sm text-brand-muted">Chưa có bảng giá.</p>}</div>
            <p className="text-sm font-medium tabular-nums">{slot.availableCapacity}/{slot.totalCapacity} chỗ trống hiện tại</p>
          </div>
          {tariff && <div className="mt-4 grid gap-3 rounded-xl bg-brand-surface p-3 sm:grid-cols-2">
            <div><p className="text-xs font-semibold">Cao điểm ×{tariff.surgeMultiplier}</p><p className="mt-1 text-xs text-brand-muted">{tariff.surgeStartTime && tariff.surgeEndTime ? `${tariff.surgeStartTime.slice(0, 5)} – ${tariff.surgeEndTime.slice(0, 5)}` : 'Chưa có khung giờ cao điểm'}</p></div>
            <div><p className="text-xs font-semibold">Quá giờ ×{tariff.overtimePenaltyMultiplier}</p><p className="mt-1 text-xs text-brand-muted">Hệ số phí đỗ quá giờ</p></div>
          </div>}
        </article>
      })}
    </div>}
  </Panel>
}
