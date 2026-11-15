/** Legacy entry points retained for callers; failures always propagate. */
import { cancelBooking, fetchBooking, payDemo, paymentLink } from '@/features/booking-flow'

export const fetchPendingTicketApi = (bookingId: number) => fetchBooking(bookingId)
export async function repayDepositApi(bookingId: number) {
  return { success: true, checkoutUrl: await paymentLink(bookingId) }
}
export async function confirmDemoDepositApi(bookingId: number) {
  await payDemo(bookingId)
  return { success: true, message: 'Máy chủ đã ghi nhận thanh toán thử nghiệm.' }
}
export async function releaseSlotApi(bookingId: number) {
  await cancelBooking(bookingId)
  return { success: true, message: 'Đã hủy đặt chỗ.' }
}
