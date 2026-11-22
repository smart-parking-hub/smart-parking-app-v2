import { MapPin, Pencil, Power, Truck } from 'lucide-react'
import { vehicleTypes, type VehicleParking, type VehicleRecord } from '../api/vehicleDataApi'

export function VehiclesTable({ vehicles, parking, parkingLoading, onEdit, onDeactivate }: {
  vehicles: VehicleRecord[]
  parking: VehicleParking[] | undefined
  parkingLoading: boolean
  onEdit: (vehicle: VehicleRecord, trigger: HTMLButtonElement) => void
  onDeactivate: (vehicle: VehicleRecord) => void
}) {
  const action = 'inline-flex min-h-10 sm:min-h-9 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 sm:px-3 sm:py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange'
  return <div role="region" aria-label="Bảng phương tiện và bãi hiện tại" tabIndex={0} className="overflow-x-visible md:overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange">
    <table className="block w-full md:table md:min-w-[1100px] text-left text-sm lg:min-w-full lg:[&_th]:px-3 lg:[&_td]:px-3 xl:[&_th]:px-5 xl:[&_td]:px-5">
      <caption className="sr-only">Danh sách phương tiện đã đăng ký</caption>
      <thead className="hidden md:table-header-group bg-brand-navy text-white">
        <tr>{['Biển số', 'Loại xe', 'Nhãn hiệu / Model', 'Trọng tải', 'Bãi hiện tại', 'Trạng thái', 'Thao tác'].map(label =>
          <th scope="col" key={label} className={`whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-wide ${label === 'Thao tác' ? 'sticky right-0 bg-brand-navy z-20 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.35)]' : ''}`}>{label}</th>,
        )}</tr>
      </thead>
      <tbody className="block space-y-3 md:table-row-group md:space-y-0 md:divide-y md:divide-brand-border">
        {vehicles.map(vehicle => {
          const current = parking?.find(booking => booking.vehicleId === vehicle.id)
          return <tr key={vehicle.id} className="block rounded-xl border border-brand-border bg-white p-4 shadow-2xs space-y-3 md:table-row md:rounded-none md:border-0 md:p-0 md:shadow-none md:space-y-0 transition-colors md:even:bg-brand-surface/60 md:hover:bg-brand-orange/5">
          <td className="block md:table-cell p-0 md:px-5 md:py-4">
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-muted"><Truck size={18} /></span>
                <span className="whitespace-nowrap rounded-md border border-brand-navy/15 bg-white px-2.5 py-1.5 font-semibold tracking-wide text-brand-navy">{vehicle.licensePlate}</span>
              </div>
              <span className="md:hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">{vehicleTypes[vehicle.vehicleType]}</span>
            </div>
          </td>
          <td className="hidden md:table-cell px-5 py-4">{vehicleTypes[vehicle.vehicleType]}</td>
          <td className="block md:table-cell p-0 md:px-5 md:py-4">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="md:hidden font-medium text-slate-500">Nhãn hiệu / Model:</span>
              <span className="max-w-56 break-words text-brand-muted">{vehicle.brandModel || '—'}</span>
            </div>
          </td>
          <td className="block md:table-cell p-0 md:px-5 md:py-4">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="md:hidden font-medium text-slate-500">Trọng tải:</span>
              <span className="whitespace-nowrap font-semibold tabular-nums">{vehicle.weightTon} tấn</span>
            </div>
          </td>
          <td className="block md:table-cell p-0 md:px-5 md:py-4 min-w-0 md:min-w-52 md:max-w-72 lg:min-w-40 xl:min-w-52">
            <div className="text-xs md:text-sm">
              <span className="md:hidden font-medium text-slate-500 block mb-1">Bãi hiện tại:</span>
              {current ? <div className="flex items-start gap-2">
                <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-orange-ink" />
                <div className="break-words"><p className="font-semibold text-brand-navy">{current.parkingLotName?.trim() || `Bãi #${current.parkingLotId}`}</p>
                  {current.parkingLotAddress && <p className="mt-1 text-xs text-brand-muted">{current.parkingLotAddress}</p>}
                  {current.physicalSlotCode && <p className="mt-1 text-xs text-brand-muted">Vị trí: {current.physicalSlotCode}</p>}
                </div>
              </div> : <span className="text-xs text-brand-muted">{parkingLoading ? 'Đang tải bãi…' : parking ? 'Chưa vào bãi' : 'Chưa xác định'}</span>}
            </div>
          </td>
          <td className="block md:table-cell p-0 md:px-5 md:py-4">
            <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
              <span className="md:hidden font-medium text-slate-500 text-xs">Trạng thái:</span>
              <div className="flex flex-wrap items-center md:items-start gap-2">
                {parking && <span className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${current?.status === 'OVERTIME' ? 'border-amber-200 bg-amber-50 text-amber-800' : current ? 'border-sky-200 bg-sky-50 text-sky-800' : 'border-brand-border bg-brand-surface text-brand-muted'}`}>
                  {current?.status === 'OVERTIME' ? 'Đỗ quá giờ' : current ? 'Đang đỗ' : 'Không đỗ tại bãi'}
                </span>}
                <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${vehicle.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-brand-border bg-brand-surface text-brand-muted'}`}>
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-brand-muted'}`} />
                  {vehicle.status === 'ACTIVE' ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                </span>
              </div>
            </div>
          </td>
          <td className="block md:table-cell p-0 pt-3 border-t border-slate-100 md:border-0 md:pt-0 md:px-5 md:py-4 md:sticky md:right-0 bg-white group-hover:bg-brand-orange/5 transition-colors md:z-10 md:shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className={`${action} border border-slate-200 bg-white text-slate-700 hover:border-[#d95f00] hover:bg-orange-50/80 hover:text-[#d95f00]`}
                onClick={event => onEdit(vehicle, event.currentTarget)}
                aria-label={`Sửa xe ${vehicle.licensePlate}`}
              >
                <Pencil size={14} aria-hidden="true" />
                Sửa
              </button>
              {vehicle.status === 'ACTIVE' && (
                <button
                  type="button"
                  className={`${action} border border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700`}
                  onClick={() => onDeactivate(vehicle)}
                  aria-label={`Ngừng sử dụng xe ${vehicle.licensePlate}`}
                >
                  <Power size={14} aria-hidden="true" />
                  Ngừng sử dụng
                </button>
              )}
            </div>
          </td>
        </tr>})}
      </tbody>
    </table>
  </div>
}
