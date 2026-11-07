import { Pencil, Power, Truck } from 'lucide-react'
import { vehicleTypes, type VehicleRecord } from '../api/vehicleDataApi'

export function VehiclesTable({ vehicles, onEdit, onDeactivate }: {
  vehicles: VehicleRecord[]
  onEdit: (vehicle: VehicleRecord) => void
  onDeactivate: (vehicle: VehicleRecord) => void
}) {
  const action = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange'
  return <div className="overflow-x-auto">
    <table className="w-full min-w-[850px] text-left text-sm">
      <caption className="sr-only">Danh sách phương tiện đã đăng ký</caption>
      <thead className="bg-brand-navy text-white">
        <tr>{['Biển số', 'Loại xe', 'Nhãn hiệu / Model', 'Trọng tải', 'Trạng thái', 'Thao tác'].map(label =>
          <th scope="col" key={label} className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">{label}</th>,
        )}</tr>
      </thead>
      <tbody className="divide-y divide-brand-border">
        {vehicles.map(vehicle => <tr key={vehicle.id} className="bg-white transition-colors even:bg-brand-surface/60 hover:bg-brand-orange/5">
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-muted"><Truck size={18} /></span>
              <span className="whitespace-nowrap rounded-md border border-brand-navy/15 bg-white px-2.5 py-1.5 font-semibold tracking-wide text-brand-navy">{vehicle.licensePlate}</span>
            </div>
          </td>
          <td className="px-5 py-4">{vehicleTypes[vehicle.vehicleType]}</td>
          <td className="max-w-56 break-words px-5 py-4 text-brand-muted">{vehicle.brandModel || '—'}</td>
          <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums">{vehicle.weightTon} tấn</td>
          <td className="px-5 py-4">
            <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${vehicle.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-brand-border bg-brand-surface text-brand-muted'}`}>
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-brand-muted'}`} />
              {vehicle.status === 'ACTIVE' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
            </span>
          </td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <button type="button" className={`${action} border border-brand-border bg-white hover:border-brand-navy/30 hover:bg-brand-surface`} onClick={() => onEdit(vehicle)} aria-label={`Sửa xe ${vehicle.licensePlate}`}><Pencil size={15} aria-hidden="true" />Sửa</button>
              {vehicle.status === 'ACTIVE' && <button type="button" className={`${action} text-brand-muted hover:bg-brand-orange/10 hover:text-brand-orange-ink`} onClick={() => onDeactivate(vehicle)} aria-label={`Ngừng sử dụng xe ${vehicle.licensePlate}`}><Power size={15} aria-hidden="true" />Ngừng sử dụng</button>}
            </div>
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
