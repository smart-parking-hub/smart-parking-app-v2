import {
  vehicleLabels,
  type ApiDateTimeValue,
  type Booking,
  type VehicleType,
} from '@/entities/operations'
import { apiClient } from '@/shared/api/client'
import { getData, type Page } from '@/shared/api/resources'
import {
  DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  type MerchantBookingLotOption,
} from '../types/merchantBookingsTypes'

export interface FetchMerchantBookingsParams {
  page: number
  size?: number
  parkingLotId?: number | null
}

export async function fetchMerchantBookingsApi({
  page,
  size = DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  parkingLotId,
}: FetchMerchantBookingsParams): Promise<Page<Booking>> {
  const params: { page: number; size: number; parkingLotId?: number } = {
    page: Math.max(0, page),
    size: Math.max(1, size),
  }
  if (typeof parkingLotId === 'number' && Number.isFinite(parkingLotId) && parkingLotId > 0) {
    params.parkingLotId = parkingLotId
  }

  return getData<Page<Booking>>('/api/v1/merchant/bookings', params)
}

export async function fetchMerchantBookingDetailApi(id: string | number): Promise<Booking> {
  return getData<Booking>(`/api/v1/merchant/bookings/${id}`)
}

export interface MerchantBookingsSummaryData {
  items: Booking[]
  totalElements: number
}

export async function fetchMerchantBookingsSummarySafe(
  parkingLotId: number | null,
  signal?: AbortSignal,
): Promise<MerchantBookingsSummaryData | null> {
  try {
    const params: { page: number; size: number; parkingLotId?: number } = {
      page: 0,
      size: 500,
    }
    if (typeof parkingLotId === 'number' && Number.isFinite(parkingLotId) && parkingLotId > 0) {
      params.parkingLotId = parkingLotId
    }
    const res = await apiClient.get<{
      data?: { content?: unknown; totalElements?: unknown }
    }>('/api/v1/merchant/bookings', { params, signal })

    const payload = res.data?.data
    if (!payload || !Array.isArray(payload.content) || typeof payload.totalElements !== 'number') {
      return null
    }

    const validBookings = payload.content.every(
      (item): item is Booking =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Booking).bookingCode === 'string' &&
        typeof (item as Booking).status === 'string',
    )
    if (!validBookings) {
      return null
    }

    return {
      items: payload.content as Booking[],
      totalElements: payload.totalElements,
    }
  } catch {
    return null
  }
}

export async function fetchMerchantLotsFilterSafe(
  signal?: AbortSignal,
): Promise<MerchantBookingLotOption[]> {
  try {
    const res = await apiClient.get<{
      data?: { content?: Array<{ id?: unknown; name?: unknown }> }
    }>('/api/v1/merchant/parking-lots', {
      params: { page: 0, size: 100, sort: 'name,asc' },
      signal,
    })
    const rawContent = res.data?.data?.content
    if (!Array.isArray(rawContent)) return []
    const options: MerchantBookingLotOption[] = []
    for (const item of rawContent) {
      if (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'number' &&
        Number.isFinite(item.id) &&
        typeof item.name === 'string' &&
        item.name.trim()
      ) {
        options.push({ id: item.id, name: item.name.trim() })
      }
    }
    return options
  } catch {
    return []
  }
}

export function resolveBookingPlate(booking: Pick<Booking, 'vehicleLicensePlate' | 'vehiclePlate'>): string {
  return booking.vehicleLicensePlate?.trim() || booking.vehiclePlate?.trim() || '—'
}

export function resolveVehicleTypeLabel(vehicleType?: VehicleType | string | null): string {
  if (!vehicleType) return 'Không xác định'
  if (vehicleType in vehicleLabels) {
    return vehicleLabels[vehicleType as VehicleType]
  }
  return vehicleType
}

export function resolveBookingDriverName(booking: Booking): string | null {
  const candidate = booking.driverName?.trim() || booking.customerName?.trim()
  return candidate || null
}

export function resolveBookingDriverPhone(booking: Booking): string | null {
  const candidate = booking.driverPhone?.trim() || booking.customerPhone?.trim()
  return candidate || null
}

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function parseBookingDateTime(value: ApiDateTimeValue): Date | null {
  if (value === null || value === undefined) return null

  if (Array.isArray(value)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = value
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return null
    }
    const parsed = new Date(year, month - 1, day, hour, minute, second)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

export function formatBookingDateTime(value: ApiDateTimeValue, fallback = '—'): string {
  const parsed = parseBookingDateTime(value)
  if (!parsed) return fallback
  return dateTimeFormatter.format(parsed)
}

export function formatBookingTimeOnly(value: ApiDateTimeValue): string | null {
  if (value === null || value === undefined) return null

  if (Array.isArray(value)) {
    const [hour = 0, minute = 0] = value
    if (typeof hour !== 'number' || typeof minute !== 'number') return null
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`
    }
    const parsed = parseBookingDateTime(trimmed)
    if (parsed) {
      return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
    }
    return trimmed
  }

  return null
}

export function formatBookingMoney(value: unknown, fallback = '—'): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export function isActionableGateStatus(status?: string | null): boolean {
  return (
    status === 'PENDING_CHECKIN' ||
    status === 'PARKING' ||
    status === 'OVERTIME' ||
    status === 'AWAITING_FINAL_PAYMENT'
  )
}
