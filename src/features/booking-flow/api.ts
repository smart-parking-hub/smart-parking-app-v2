import { z } from 'zod'
import { getData, sendData, type Page } from '@/shared/api/resources'
const money = z.coerce.number().finite().nonnegative()
export const bookingSchema = z.object({
  id: z.number(), bookingCode: z.string(), parkingLotId: z.number(), merchantId: z.number().nullable(),
  parkingLotName: z.string().nullish(), parkingLotAddress: z.string().nullish(), vehicleId: z.number(), vehiclePlate: z.string().nullish(),
  status: z.enum(['PENDING_PAYMENT','PENDING_CHECKIN','PARKING','OVERTIME','AWAITING_FINAL_PAYMENT','COMPLETED','CANCELLED','EXPIRED','REVIEWED']),
  advanceDeposit: money, totalAmount: money.nullable(), hourlyRate: money.nullable(),
  surgeMultiplier: money.nullish(), surgeStartTime: z.string().nullish(), surgeEndTime: z.string().nullish(), overtimePenaltyMultiplier: money.nullish(),
  expectedCheckInTime: z.string(), expectedCheckOutTime: z.string(), expiresAt: z.string(),
})
export type Booking = z.infer<typeof bookingSchema>
export interface Vehicle { id: number; licensePlate: string; vehicleType: 'SEDAN_SUV'|'BUS_COACH'|'LIGHT_TRUCK'|'HEAVY_TRUCK'|'CONTAINER'; status: string }
export interface Tariff { vehicleType: Vehicle['vehicleType']; basePricePerHour: number; surgeMultiplier: number; surgeStartTime: string | null; surgeEndTime: string | null; overtimePenaltyMultiplier: number }
export interface Lot { id: number; name: string; address: string; status: string; merchantId: number; slots: { vehicleType: Vehicle['vehicleType']; availableCapacity: number; totalCapacity: number }[]; pricingRules: Tariff[] }
export async function fetchBooking(id: number) { return bookingSchema.parse(await getData<unknown>(`/api/v1/bookings/${id}`)) }
export async function fetchBookings() { const page = await getData<Page<unknown>>('/api/v1/bookings', { size: 100 }); return page.content.map(row => bookingSchema.parse(row)) }
export async function fetchVehicles() { const page = await getData<Page<Vehicle>>('/api/v1/vehicles', { size: 100 }); return page.content.filter(vehicle => vehicle.status === 'ACTIVE') }
export const fetchLot = (id: number) => getData<Lot>(`/api/v1/parking-lots/${id}`)
export interface BookingInput { vehicleId: number; parkingLotId: number; vehicleType: Vehicle['vehicleType']; expectedCheckInTime: string; expectedCheckOutTime: string; requestId: string }
export async function createBooking(input: BookingInput) { return bookingSchema.parse(await sendData<unknown>('post', '/api/v1/bookings', input)) }
export async function paymentLink(bookingId: number, final = false) {
  const url = await sendData<string>('post', '/api/v1/payments', { bookingId, paymentType: final ? 'FINAL_PAYMENT' : 'DEPOSIT' })
  const parsed = new URL(url, window.location.origin)
  if (!(parsed.protocol === 'https:' && parsed.hostname.endsWith('.payos.vn')) && !(parsed.origin === window.location.origin && parsed.pathname === '/payment/return')) throw new Error('Đường dẫn thanh toán không hợp lệ.')
  return parsed.href
}
export const payDemo = (bookingId: number) => sendData('post', '/api/v1/payments/demo-confirm', { bookingId })
export const cancelBooking = (id: number) => sendData('post', `/api/v1/bookings/${id}/cancel`, { reason: 'Tài xế chủ động hủy trước check-in' })
export const syncPayment = (input: { bookingId: number; orderCode?: number }) => sendData<{ status: string }>('post', '/api/v1/payments/sync', input)
export const formatMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
export const statusLabels: Record<Booking['status'], string> = { PENDING_PAYMENT:'Chờ thanh toán cọc', PENDING_CHECKIN:'Đã cọc · Chờ check-in', PARKING:'Đang đỗ tại bãi', OVERTIME:'Đang đỗ quá giờ', AWAITING_FINAL_PAYMENT:'Chờ thanh toán phần còn lại', COMPLETED:'Đã hoàn tất', CANCELLED:'Đã hủy', EXPIRED:'Đã hết hạn', REVIEWED:'Đã đánh giá' }
