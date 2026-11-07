import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { Workspace, Panel, Notice, button, secondary, money } from '@/shared/components/Workspace'
import { MerchantLotGallery } from '../components/detail'
import { uploadAdditionalLotImages } from '../api/merchantParkingLotApi'
import { useState } from 'react'

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
  if (query.isPending) return <Notice>Đang tải hồ sơ bãi đỗ…</Notice>
  if (query.isError || !lot) return <Notice error>Không tải được hồ sơ. <button onClick={() => void query.refetch()}>Thử lại</button></Notice>
  const approved = lot.status === 'APPROVED'
  const statuses: Record<string, string> = { APPROVED: 'Đã duyệt', PENDING_APPROVAL: 'Đang chờ duyệt', REJECTED: 'Bị từ chối', SUSPENDED: 'Tạm ngưng' }
  return (
    <Workspace title={lot.name} description={lot.address}>
      <Link to="/merchant/parking-lots" className={secondary}>Quay lại danh sách bãi</Link>
      <Panel title="Thông tin hồ sơ">
        <p>Mã bãi: #{lot.id} · {statuses[lot.status] || lot.status}</p>
        {lot.reviewReason && <Notice>{lot.reviewReason}</Notice>}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className={secondary} to={`/merchant/parking-lots/${lot.id}/edit`}>Chỉnh sửa hồ sơ</Link>
          {approved && <><Link className={secondary} to={`/merchant/parking-lots/${lot.id}/slots`}>Cấu hình chỗ đỗ</Link><Link className={secondary} to={`/merchant/parking-lots/${lot.id}/pricing`}>Cấu hình bảng giá</Link></>}
          <Link className={button} to={`/merchant/qr-scanner?lot=${lot.id}`}>Mở quét QR</Link>
        </div>
      </Panel>
      <MerchantLotGallery images={(lot.images || []).map(image => ({ id: image.id, url: image.contentUrl, title: image.originalFileName, subtitle: '', isCover: image.cover }))} uploading={uploading} onUploadImages={async files => {
        setUploading(true)
        setUploadError('')
        try {
          await uploadAdditionalLotImages(lot.id, files)
          await query.refetch()
        } catch { setUploadError('Tải ảnh thất bại. Vui lòng thử lại.') }
        finally { setUploading(false) }
      }} />
      {uploadError && <Notice error>{uploadError}</Notice>}
      <Panel title="Vị trí bãi đỗ">
        {lot.latitude != null && lot.longitude != null ? <><p>Vĩ độ: {lot.latitude} · Kinh độ: {lot.longitude}</p><a className="mt-3 inline-block text-brand-orange" href={`https://www.google.com/maps/search/?api=1&query=${lot.latitude},${lot.longitude}`} target="_blank" rel="noreferrer">Xem vị trí trên Google Maps</a></> : <p>Chưa có tọa độ.</p>}
      </Panel>
      <Panel title="Sức chứa chỗ đỗ">
        {lot.slots?.length ? lot.slots.map(slot => <p key={slot.id}>{slot.vehicleType}: {slot.availableCapacity}/{slot.totalCapacity} chỗ trống</p>) : <p>Chưa cấu hình chỗ đỗ.</p>}
      </Panel>
      <Panel title="Bảng giá">
        {lot.pricingRules?.length ? lot.pricingRules.map(rule => <p key={rule.id}>{rule.vehicleType}: {money(rule.basePricePerHour)}/giờ</p>) : <p>Chưa cấu hình bảng giá.</p>}
      </Panel>
    </Workspace>
  )
}
