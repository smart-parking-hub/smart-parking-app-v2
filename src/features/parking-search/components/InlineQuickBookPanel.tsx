import type { ParkingLotItem } from '../types/parkingSearchTypes'
import { Dialog } from '@/shared/components/Workspace'
import { ReservationFlow } from '@/features/booking-flow'
interface Props { open: boolean; onClose:()=>void; lot?:ParkingLotItem; onConfirmSuccess?:(code:string)=>void }
export function InlineQuickBookPanel({open,onClose,lot}:Props){
  if(!open||!lot)return null
  return <Dialog title="Đặt chỗ và thanh toán cọc" onClose={onClose}><ReservationFlow lotId={lot.id}/></Dialog>
}
export { InlineQuickBookPanel as QuickBookingDrawer }
