import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Workspace, Panel, Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchLot, ReservationFlow } from '@/features/booking-flow'
import { ParkingLotGallery } from '../components/ParkingLotGallery'
import { ParkingCapacityPricing } from '../components/ParkingCapacityPricing'
import { ParkingDetailSkeleton } from '../components/ParkingDetailSkeleton'
export function ParkingDetailPage(){
  const {id}=useParams<{id:string}>();const lotId=Number(id)
  const query=useQuery({queryKey:['reservable-lot',lotId],queryFn:()=>fetchLot(lotId),enabled:Number.isSafeInteger(lotId)&&lotId>0,retry:false})
  if(!Number.isSafeInteger(lotId)||lotId<=0)return <Notice error>Mã bãi đỗ không hợp lệ.</Notice>
  const images=query.data?.images??[]
  return <Workspace title={query.data?.name||'Thông tin bãi đỗ'} eyebrow="CHI TIẾT BÃI ĐỖ" description={query.data?.address} actions={<Link className={secondary} to="/parking">Về bản đồ</Link>}>
    {query.isPending ? (
      <div role="status" aria-label="Đang tải bãi đỗ…">
        <span className="sr-only">Đang tải bãi đỗ…</span>
        <ParkingDetailSkeleton />
      </div>
    ) : query.isError ? (
      <Notice error>
        <div>
          {errorMessage(query.error)}
          <button className={secondary} onClick={() => void query.refetch()}>Thử lại</button>
        </div>
      </Notice>
    ) : <>
      <div className={`grid min-w-0 items-start gap-6 ${images.length?'lg:grid-cols-2':''}`}>
        <ParkingLotGallery images={images} lotName={query.data.name}/>
        <ParkingCapacityPricing lot={query.data} compact={images.length>0}/>
      </div>
      {query.data.description && (
        <Panel title="Thông tin vận hành & Hướng dẫn lưu thông">
          <div className="rounded-2xl border border-brand-border bg-brand-surface/40 p-5">
            <div className="whitespace-pre-line text-sm leading-relaxed text-brand-dark/90 font-normal">
              {query.data.description}
            </div>
          </div>
        </Panel>
      )}
      <Panel><ReservationFlow lotId={lotId}/></Panel>
    </>}
  </Workspace>
}
