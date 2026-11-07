import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Workspace, Panel, Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchBookings, BookingStatusPanel } from '@/features/booking-flow'
export function MyBookingsPage(){
  const query=useQuery({queryKey:['real-bookings'],queryFn:fetchBookings,retry:false,refetchInterval:10000})
  return <Workspace title="Các lượt đặt chỗ của tôi" description="Theo dõi tiền cọc, hạn giữ chỗ và mã check-in từ server." actions={<Link to="/parking" className={secondary}>Tìm bãi trên bản đồ</Link>}>
    {query.isPending?<p role="status">Đang tải đặt chỗ…</p>:query.isError?<Notice error><div>{errorMessage(query.error)}<button className={secondary} onClick={()=>void query.refetch()}>Thử lại</button></div></Notice>:!query.data.length?<Notice>Bạn chưa có lượt đặt chỗ nào.</Notice>:query.data.map(booking=><Panel key={booking.id} title={booking.parkingLotName||`Bãi đỗ #${booking.parkingLotId}`}><p className="mb-4 text-brand-muted">{booking.parkingLotAddress}</p><BookingStatusPanel bookingId={booking.id} booking={booking}/></Panel>)}
  </Workspace>
}
