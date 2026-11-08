import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { MerchantLotNavigation } from '@/entities/parking-lot/components/MerchantLotNavigation'
import type { SimpleLotHeaderInfo } from '../types/merchantSlotsTypes'

export function MerchantSlotsHeader({ lotInfo }: { lotInfo: SimpleLotHeaderInfo }) {
  return <><header className="slots-header">
    <Link className="slots-back" to={`/merchant/parking-lots/${lotInfo.id}`}><ArrowLeft size={16} />Về chi tiết bãi</Link>
    <div className="slots-title-row">
      <div><p className="slots-eyebrow">QUẢN LÝ BÃI ĐỖ / SỨC CHỨA</p><h1>Cấu hình sức chứa <span>bãi đỗ</span></h1></div>

    </div>
    <div className="slots-lot"><MapPin size={19} /><div><strong>{lotInfo.name}</strong>{lotInfo.address && <p>{lotInfo.address}</p>}</div><span className="slots-lot-id">Bãi #{lotInfo.id}</span></div>
  </header><MerchantLotNavigation lotId={lotInfo.id} status={lotInfo.status} /></>
}
