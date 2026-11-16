import { apiClient } from '@/shared/api/client'
import type {
  BookingDto,
  VehicleDto,
  PageResponse,
  DashboardSummaryData,
  BookingStatus,
} from '../types/driverTypes'

const ACTIVE_STATUSES: BookingStatus[] = [
  'PENDING_PAYMENT',
  'PENDING_CHECKIN',
  'PARKING',
  'OVERTIME',
  'AWAITING_FINAL_PAYMENT',
]

export async function fetchDriverDashboardData(signal?: AbortSignal): Promise<DashboardSummaryData> {
  type BookingResponse = BookingDto & { vehiclePlate?: string; advanceDeposit?: number | null; totalAmount?: number | null }
  const [vehiclesRes, bookingsRes, profileRes, queueRes] = await Promise.all([
    apiClient.get<{ data: PageResponse<VehicleDto> }>('/api/v1/vehicles', { params: { page: 0, size: 1 }, signal }),
    apiClient.get<{ data: PageResponse<BookingResponse> }>('/api/v1/bookings', { params: { page: 0, size: 100 }, signal }),
    apiClient.get<{ data: { fullName?: string; phone?: string } | null }>('/api/v1/users/me', { signal }).catch(() => null),
    apiClient.get<{ data: { id: number } | null }>('/api/v1/queues/me', { signal }).catch(() => null),
  ])
  const firstPage = bookingsRes.data.data
  const raw = [...firstPage.content]
  // The driver API has no status filter: read subsequent pages so an older parked trip is not missed.
  for (let page = 1; page < firstPage.totalPages; page++) {
    const response = await apiClient.get<{ data: PageResponse<BookingResponse> }>('/api/v1/bookings', { params: { page, size: 100 }, signal })
    raw.push(...response.data.data.content)
  }
  const bookings = [...new Map(raw.map(b => [b.id, {
    ...b,
    vehicleLicensePlate: b.vehiclePlate ?? b.vehicleLicensePlate,
    depositAmount: b.advanceDeposit ?? b.depositAmount,
    totalPrice: b.totalAmount ?? b.totalPrice,
    remainingAmount: (b.totalAmount ?? b.totalPrice) == null ? undefined : Math.max(0, (b.totalAmount ?? b.totalPrice)! - (b.advanceDeposit ?? b.depositAmount ?? 0)),
  }])).values()]
  const priority: BookingStatus[] = ['OVERTIME', 'PARKING', 'AWAITING_FINAL_PAYMENT', 'PENDING_CHECKIN', 'PENDING_PAYMENT']
  const activeBookings = bookings.filter(b => ACTIVE_STATUSES.includes(b.status))
  const activeBooking = [...activeBookings].sort((a, b) => priority.indexOf(a.status) - priority.indexOf(b.status))[0]
  const vehicleTotal = vehiclesRes.data.data.totalElements
  return {
    driverName: profileRes?.data.data?.fullName || 'Tài xế',
    driverPhone: profileRes?.data.data?.phone || '',
    vehicleTotal,
    bookingTotal: firstPage.totalElements,
    activeCount: bookings.filter(b => b.status === 'PARKING' || b.status === 'OVERTIME').length,
    queueCount: queueRes ? (queueRes.data.data ? 1 : 0) : null,
    activeBooking,
    bookings,
    recentBookings: bookings.filter(b => b.id !== activeBooking?.id).slice(0, 3),
    isEmptyState: vehicleTotal === 0 && firstPage.totalElements === 0,
  }
}
