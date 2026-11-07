import { Minus, Plus, Truck, Bus, Car, Container, X } from 'lucide-react'
import type { SlotMatrixItem } from '../types/merchantSlotsTypes'
interface Props {
  item: SlotMatrixItem
  draftCapacity: number
  onChangeCapacity: (value: number) => void
  onViolation: (message: string) => void
  onRemove?: () => void
  disabled?: boolean
}
export function MerchantSlotCard({ item, draftCapacity, onChangeCapacity, onViolation, onRemove, disabled = false }: Props) {
  const occupied = item.occupiedCapacity
  const available = Math.max(0, draftCapacity - occupied)
  const percent = draftCapacity > 0 ? Math.min(100, occupied / draftCapacity * 100) : 0
  const Icon = item.vehicleType === 'CONTAINER' ? Container : item.vehicleType === 'BUS_COACH' ? Bus : item.vehicleType === 'SEDAN_SUV' ? Car : Truck
  const change = (value: number) => {
    if (!Number.isSafeInteger(value) || value < occupied || value > 2147483647) {
      onViolation(`Sức chứa của ${item.typeNameVi} phải là số nguyên từ ${occupied} đến 2.147.483.647.`)
      return
    }
    onChangeCapacity(value)
  }
  return <article className="slots-vehicle" data-vehicle={item.vehicleType} data-occupied={occupied}>
    <div className="slots-vehicle-name"><span className="slots-vehicle-icon"><Icon size={24} strokeWidth={1.6} /></span><div><h3>{item.typeNameVi}</h3>{item.id === undefined && <small className="slots-unsaved">Chưa lưu · nhập số chỗ bên dưới</small>}<span>{draftCapacity === 0 ? 'Chưa có sức chứa' : available === 0 ? 'Đã hết chỗ' : `${available} chỗ còn trống`}</span></div></div>
    <div className="slots-vehicle-usage"><div><span>Đã sử dụng <strong>{occupied} / {draftCapacity}</strong></span><span>{percent.toFixed(0)}%</span></div><div className="slots-meter"><span style={{ width: `${percent}%` }} /></div></div>
    <div className="slots-capacity"><label htmlFor={`capacity-${item.vehicleType}`}>Sức chứa</label><div className="slots-stepper"><button type="button" aria-label={`Giảm sức chứa ${item.typeNameVi}`} disabled={disabled || draftCapacity <= occupied} onClick={() => change(draftCapacity - 1)}><Minus size={16} /></button><input id={`capacity-${item.vehicleType}`} type="number" min={occupied} max={2147483647} step={1} value={draftCapacity} disabled={disabled} onChange={(event) => change(Number(event.target.value))} /><button type="button" aria-label={`Tăng sức chứa ${item.typeNameVi}`} disabled={disabled || draftCapacity >= 2147483647} onClick={() => change(draftCapacity + 1)}><Plus size={16} /></button></div><small>Tối thiểu {occupied} chỗ</small>{onRemove && <button type="button" className="slots-remove-type" aria-label={`Bỏ loại xe ${item.typeNameVi}`} onClick={onRemove} disabled={disabled}><X size={14} aria-hidden="true" />Bỏ loại xe</button>}</div>
  </article>
}
