import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Workspace, Panel, Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchLot, formatMoney, ReservationFlow } from '@/features/booking-flow'
export function ParkingDetailPage(){
  const {id}=useParams<{id:string}>();const lotId=Number(id)
  const query=useQuery({queryKey:['reservable-lot',lotId],queryFn:()=>fetchLot(lotId),enabled:Number.isSafeInteger(lotId)&&lotId>0,retry:false})
  if(!Number.isSafeInteger(lotId)||lotId<=0)return <Notice error>Mã bãi đỗ không hợp lệ.</Notice>
  return <Workspace title={query.data?.name||'Thông tin bãi đỗ'} description={query.data?.address} actions={<Link className={secondary} to="/parking">Về bản đồ</Link>}>
    {query.isPending?<p role="status">Đang tải bãi đỗ…</p>:query.isError?<Notice error><div>{errorMessage(query.error)}<button className={secondary} onClick={()=>void query.refetch()}>Thử lại</button></div></Notice>:<>
      <Panel title="Sức chứa và bảng giá"><div className="grid gap-4 sm:grid-cols-2">{query.data.slots.map(slot=>{
        const tariff=query.data.pricingRules.find(price=>price.vehicleType===slot.vehicleType)
        return <div key={slot.vehicleType} className="rounded-xl border border-brand-border p-4"><h2 className="font-semibold">{slot.vehicleType}</h2><p>{slot.availableCapacity}/{slot.totalCapacity} chỗ trống</p>{tariff?<><p>{formatMoney(Number(tariff.basePricePerHour))}/giờ</p><p className="text-sm text-brand-muted">Cao điểm ×{tariff.surgeMultiplier} ({tariff.surgeStartTime||'—'} – {tariff.surgeEndTime||'—'}). Quá giờ ×{tariff.overtimePenaltyMultiplier}.</p></>:<p>Chưa có bảng giá.</p>}</div>
      })}</div></Panel>
      <Panel><ReservationFlow lotId={lotId}/></Panel>
    </>}
  </Workspace>
}
