import { useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Notice, Panel, Workspace, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { syncPayment } from './api'
import { BookingStatusPanel } from './BookingStatusPanel'
export function PaymentResultPage({ cancelled=false }: {cancelled?:boolean}) {
  const cache=useQueryClient()
  const [params]=useSearchParams()
  const bookingId=Number(params.get('bookingId'))
  const order=Number(params.get('orderCode'))
  const sync=useMutation({mutationFn:()=>syncPayment({bookingId,...(Number.isSafeInteger(order)&&order>0?{orderCode:order}:{})}),onSuccess:()=>cache.invalidateQueries({queryKey:['booking',bookingId]})})
  const { mutate }=sync
  useEffect(()=>{if(!cancelled&&Number.isSafeInteger(bookingId)&&bookingId>0)mutate()},[bookingId,cancelled,mutate])
  return <Workspace title={cancelled?'Bạn đã rời bước thanh toán':'Kết quả thanh toán'} description="Kết quả được kiểm tra từ server; việc quay về trang này không tự xác nhận đã thanh toán."><Panel>
    {!Number.isSafeInteger(bookingId)||bookingId<=0?<Notice error>Thiếu mã booking hợp lệ.<Link to="/bookings" className={secondary}>Xem đặt chỗ</Link></Notice>:<div className="space-y-5">
      {cancelled&&<Notice>Chưa hủy booking. Bạn có thể tiếp tục thanh toán trước hạn hoặc chủ động hủy bên dưới.</Notice>}
      {sync.isPending&&<p role="status">Đang đồng bộ với cổng thanh toán…</p>}
      {sync.isError&&<Notice error><div>{errorMessage(sync.error)}<button className={`${secondary} mt-3`} onClick={()=>sync.mutate()}>Kiểm tra lại thanh toán</button></div></Notice>}
      {sync.data?.status==='REQUIRES_REVIEW'&&<Notice>Giao dịch cần đối soát vì hạn giữ chỗ đã hết. Chưa cấp lại slot và chưa xác nhận check-in.</Notice>}
      <BookingStatusPanel bookingId={bookingId}/>
    </div>}
  </Panel></Workspace>
}
