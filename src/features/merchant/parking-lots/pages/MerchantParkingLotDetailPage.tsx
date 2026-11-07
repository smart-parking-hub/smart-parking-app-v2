import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin, Navigation, Car, Bus, Truck, Container, CircleParking, Wallet, CheckCircle2, Clock3 } from 'lucide-react'
import { MerchantLotNavigation } from '@/entities/parking-lot/components/MerchantLotNavigation'
import { apiClient } from '@/shared/api/client'
import { Notice, money } from '@/shared/components/Workspace'
import { vehicleLabels, type VehicleType } from '@/entities/operations'
import { MerchantLotGallery } from '../components/detail'
import { MerchantLotLocationMap } from '../components/detail/MerchantLotLocationMap'
import { uploadAdditionalLotImages } from '../api/merchantParkingLotApi'
import './MerchantParkingLotDetailPage.css'

interface LotDetail {
  id: number
  name: string
  address: string
  status: string
  reviewReason?: string
  latitude: number | null
  longitude: number | null
  ratingAverage: number | null
  images: { id: number; contentUrl: string; originalFileName: string; cover: boolean }[] | null
  slots: { id: number; vehicleType: string; totalCapacity: number; availableCapacity: number }[] | null
  pricingRules: { id: number; vehicleType: string; basePricePerHour: number }[] | null
}
const statuses: Record<string, string> = { APPROVED: 'Đã duyệt', PENDING_APPROVAL: 'Đang chờ duyệt', CHANGES_REQUESTED: 'Yêu cầu bổ sung', REJECTED: 'Bị từ chối', SUSPENDED: 'Tạm ngưng' }
const vehicleName = (type: string) => vehicleLabels[type as VehicleType] ?? type
function VehicleIcon({ type }: { type: string }) {
  const Icon = type === 'CONTAINER' ? Container : type === 'SEDAN_SUV' ? Car : type === 'BUS_COACH' ? Bus : Truck
  return <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
}

export function MerchantParkingLotDetailPage() {
  const { parkingLotId } = useParams()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const query = useQuery({
    queryKey: ['merchant-lot-detail', parkingLotId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: LotDetail }>(`/api/v1/merchant/parking-lots/${parkingLotId}`)
      if (!response.data.data) throw new Error('Không có dữ liệu hồ sơ')
      return response.data.data
    },
  })
  const lot = query.data
  if (query.isPending) return <div className="lot-detail"><Notice>Đang tải hồ sơ bãi đỗ…</Notice></div>
  if (query.isError || !lot) return <div className="lot-detail"><Notice error>Không tải được hồ sơ. <button onClick={() => void query.refetch()}>Thử lại</button></Notice></div>
  const approved = lot.status === 'APPROVED'
  const slots = lot.slots ?? []
  const pricing = lot.pricingRules ?? []
  const total = slots.reduce((sum, slot) => sum + slot.totalCapacity, 0)
  const available = slots.reduce((sum, slot) => sum + slot.availableCapacity, 0)
  const hasCoordinates = lot.latitude != null && lot.longitude != null && Number.isFinite(lot.latitude) && Number.isFinite(lot.longitude) && Math.abs(lot.latitude) <= 90 && Math.abs(lot.longitude) <= 180
  return <div className="lot-detail"><div className="lot-detail-container">
    <Link to="/merchant/parking-lots" className="lot-detail-back"><ArrowLeft size={16} />Quay lại danh sách bãi</Link>
    <header className="lot-detail-header">
      <div><p className="lot-detail-eyebrow">QUẢN LÝ BÃI ĐỖ / HỒ SƠ BÃI</p><h1>{lot.name}</h1><p className="lot-detail-address"><MapPin size={16} /><span>{lot.address || 'Chưa có địa chỉ'}</span></p></div>
      <div className="lot-detail-status"><span className={`lot-status-badge ${approved ? 'is-approved' : ''}`}>{approved ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}{statuses[lot.status] || lot.status}</span><span>Mã bãi <strong>#{lot.id}</strong></span></div>
    </header>
    {lot.reviewReason && <Notice>{lot.reviewReason}</Notice>}
    <MerchantLotNavigation lotId={lot.id} status={lot.status} />
    <section className="lot-detail-gallery" aria-label="Hình ảnh bãi đỗ"><MerchantLotGallery images={(lot.images || []).map(image => ({ id: image.id, url: image.contentUrl, title: image.originalFileName, subtitle: '', isCover: image.cover }))} uploading={uploading} onUploadImages={async files => {
      setUploading(true)
      setUploadError('')
      try { await uploadAdditionalLotImages(lot.id, files); await query.refetch() }
      catch { setUploadError('Tải ảnh thất bại. Vui lòng thử lại.') }
      finally { setUploading(false) }
    }} /></section>
    {uploadError && <Notice error>{uploadError}</Notice>}
    <div className="lot-detail-operating-grid">
      <section className="lot-detail-panel lot-capacity-panel" aria-labelledby="lot-capacity-title">
        <div className="lot-panel-heading"><div><span className="lot-section-icon"><CircleParking size={20} /></span><h2 id="lot-capacity-title">Sức chứa chỗ đỗ</h2></div><span className="lot-count-label">{slots.length} loại xe</span></div>
        <div className="lot-capacity-summary"><div><span>Chỗ còn trống</span><strong>{available}<small>/ {total} chỗ</small></strong></div><div><span className="lot-summary-dot" />{total > 0 ? `${Math.round(available / total * 100)}% sức chứa còn trống` : 'Chưa có sức chứa'}</div></div>
        {slots.length ? <ul className="lot-capacity-list">{slots.map(slot => {
          const used = Math.max(0, slot.totalCapacity - slot.availableCapacity)
          const percent = slot.totalCapacity > 0 ? Math.min(100, used / slot.totalCapacity * 100) : 0
          return <li key={slot.id}><span className="lot-vehicle-glyph"><VehicleIcon type={slot.vehicleType} /></span><div className="lot-capacity-type"><h3>{vehicleName(slot.vehicleType)}</h3><div className="lot-capacity-track" role="progressbar" aria-label={`Tỷ lệ sử dụng ${vehicleName(slot.vehicleType)}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div></div><div className="lot-capacity-value"><strong>{slot.availableCapacity}<span> / {slot.totalCapacity}</span></strong><small>chỗ trống</small></div></li>
        })}</ul> : <div className="lot-detail-empty"><CircleParking size={28} /><p>Chưa cấu hình chỗ đỗ.</p>{approved && <Link to={`/merchant/parking-lots/${lot.id}/slots`}>Thêm sức chứa<ArrowUpRight size={15} /></Link>}</div>}
        {slots.length > 0 && <p className="lot-panel-footnote">Phần tô màu thể hiện chỗ đã sử dụng, bao gồm chỗ đang giữ.</p>}
      </section>
      <section className="lot-detail-panel lot-location-panel" aria-labelledby="lot-location-title">
        <div className="lot-panel-heading"><div><span className="lot-section-icon"><MapPin size={20} /></span><h2 id="lot-location-title">Vị trí bãi đỗ</h2></div><Navigation size={18} className="lot-muted-icon" /></div>
        {hasCoordinates ? <><MerchantLotLocationMap latitude={lot.latitude!} longitude={lot.longitude!} /><div className="lot-location-info"><p><MapPin size={17} /><span>{lot.address || 'Vị trí đã đăng ký của bãi'}</span></p><dl><div><dt>Vĩ độ</dt><dd>{lot.latitude}</dd></div><div><dt>Kinh độ</dt><dd>{lot.longitude}</dd></div></dl><a className="lot-map-link" href={`https://www.google.com/maps/search/?api=1&query=${lot.latitude},${lot.longitude}`} target="_blank" rel="noreferrer">Mở trên Google Maps<ArrowUpRight size={17} /></a></div></> : <div className="lot-detail-empty"><MapPin size={28} /><p>Chưa có tọa độ.</p></div>}
      </section>
    </div>
    <section className="lot-detail-panel lot-pricing-panel" id="pricing" aria-labelledby="lot-pricing-title">
      <div className="lot-panel-heading"><div><span className="lot-section-icon"><Wallet size={20} /></span><h2 id="lot-pricing-title">Bảng giá</h2></div><span className="lot-count-label">Giá cơ bản / giờ</span></div>
      {pricing.length ? <ul className="lot-price-grid">{pricing.map(rule => <li key={rule.id}><span className="lot-price-icon"><VehicleIcon type={rule.vehicleType} /></span><h3>{vehicleName(rule.vehicleType)}</h3><p><strong>{money(rule.basePricePerHour)}</strong><span>/ giờ</span></p></li>)}</ul> : <div className="lot-detail-empty"><Wallet size={28} /><p>Chưa cấu hình bảng giá.</p>{approved && <Link to={`/merchant/parking-lots/${lot.id}/pricing`}>Thiết lập bảng giá<ArrowUpRight size={15} /></Link>}</div>}
      {pricing.length > 0 && <div className="lot-pricing-footer"><p>Mức giá cơ bản theo từng loại phương tiện.</p>{approved && <Link to={`/merchant/parking-lots/${lot.id}/pricing`}>Điều chỉnh bảng giá<ArrowUpRight size={15} /></Link>}</div>}
    </section>
  </div></div>
}
