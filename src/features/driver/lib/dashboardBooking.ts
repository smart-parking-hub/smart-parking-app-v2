import { bookingTimeLabel } from '@/features/booking-flow'
import type { BookingDto } from '../types/driverTypes'

export const isParking = (booking: BookingDto) => ['PARKING', 'OVERTIME'].includes(booking.status)
export const canShowCheckoutQr = (booking?: BookingDto) => Boolean(booking && isParking(booking) && booking.bookingCode?.trim())
export const ticketUrl = (booking: BookingDto) => `/bookings?bookingId=${booking.id}`
const actions: Record<string, string> = {
  PENDING_PAYMENT: 'Thanh toán cọc',
  PENDING_CHECKIN: 'Xem vé QR check-in',
  AWAITING_FINAL_PAYMENT: 'Thanh toán phần còn lại',
}
export const ticketAction = (booking: BookingDto) => actions[booking.status] ?? 'Xem chi tiết vé'

function timestamp(value?: string) {
  return value ? Date.parse(/(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+07:00`) : NaN
}
export function dashboardTime(value?: string) {
  return Number.isFinite(timestamp(value)) ? bookingTimeLabel(value!) : 'Chưa có thông tin'
}
export function parkingDuration(booking: BookingDto, now = Date.now()) {
  const start = timestamp(booking.checkInTime)
  const end = booking.checkOutTime ? timestamp(booking.checkOutTime) : now
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 'Chưa có thông tin'
  const minutes = Math.floor((end - start) / 60000)
  return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`
}
