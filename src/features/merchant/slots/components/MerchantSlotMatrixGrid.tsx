import { useState } from 'react'
import { Plus } from 'lucide-react'
import { vehicleNames } from '../api/merchantSlotsApi'
import type { SlotMatrixItem, VehicleType } from '../types/merchantSlotsTypes'
import { MerchantSlotCard } from './MerchantSlotCard'
interface Props {
  slots: SlotMatrixItem[]
  drafts: Record<VehicleType, number>
  onRemoveType: (type: VehicleType) => void
  onAddType: (type: VehicleType) => void
  onChangeDraft: (type: VehicleType, value: number) => void
  onViolation: (message: string) => void
  disabled?: boolean
}
export function MerchantSlotMatrixGrid({ slots, drafts, onAddType, onRemoveType, onChangeDraft, onViolation, disabled }: Props) {
  const [selectedType, setSelectedType] = useState<VehicleType | ''>('')
  const availableTypes = (Object.keys(vehicleNames) as VehicleType[]).filter((type) => !slots.some((slot) => slot.vehicleType === type))
  const nextType = availableTypes.find((type) => type === selectedType) ?? availableTypes[0]
  return <section className="slots-matrix"><div className="slots-section-title"><div><h2>Sức chứa theo loại xe</h2><p>Điều chỉnh số chỗ dành cho từng loại phương tiện.</p></div><span>{slots.length} loại xe</span></div>
    {availableTypes.length > 0 && <div className="slots-add-type">
      <div><label htmlFor="new-slot-vehicle">Loại xe cần thêm</label><p>Chọn loại xe, thêm vào danh sách rồi nhập số chỗ.</p></div>
      <div className="slots-add-controls"><select id="new-slot-vehicle" value={nextType} disabled={disabled} onChange={(event) => setSelectedType(event.target.value as VehicleType)}>{availableTypes.map((type) => <option key={type} value={type}>{vehicleNames[type]}</option>)}</select><button type="button" disabled={disabled} onClick={() => { if (nextType) onAddType(nextType) }}><Plus size={16} />Thêm loại xe</button></div>
    </div>}
    {slots.length === 0 ? <div className="slots-empty"><h3>Chưa có cấu hình sức chứa</h3><p>Bãi này chưa có loại xe được cấu hình.</p></div> : <div className="slots-vehicles">{slots.map((item) => <MerchantSlotCard key={item.vehicleType} item={item} draftCapacity={drafts[item.vehicleType] ?? item.totalCapacity} onChangeCapacity={(value) => onChangeDraft(item.vehicleType, value)} onViolation={onViolation} onRemove={item.id === undefined ? () => onRemoveType(item.vehicleType) : undefined} disabled={disabled} />)}</div>}
  </section>
}
