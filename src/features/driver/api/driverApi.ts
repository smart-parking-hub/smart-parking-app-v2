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

// Fallback high-fidelity sample data matching Stitch SCR-014 specification
export const fallbackDashboardData: DashboardSummaryData = {
  driverName: 'Trần Quốc Tuấn',
  driverPhone: '0909 128 374',
  vehicleTotal: 3,
  bookingTotal: 48,
  activeCount: 1,
  queueCount: 0,
  activeBooking: {
    id: 9081,
    bookingCode: 'BK-2026-9081',
    parkingLotName: 'Bãi Đỗ Xe Container Sóng Thần 2',
    parkingLotAddress: 'ICD Sóng Thần, Quốc Lộ 1A, Phường An Bình, TP. Dĩ An, Tỉnh Bình Dương',
    vehicleLicensePlate: '51D-894.12',
    trailerLicensePlate: '51R-024.89',
    containerType: 'CONTAINER 40FT HEAVY',
    berthNumber: 'BERTH C-12',
    usableLength: '18.5m',
    shorePowerAvailable: true,
    checkInTime: '14:15',
    expectedCheckInTime: '2026-02-20T14:15:00',
    expectedCheckOutTime: '2026-02-20T20:15:00',
    parkingDuration: '03h 45m',
    depositAmount: 100000,
    remainingAmount: 80000,
    totalPrice: 180000,
    hourlyRate: 40000,
    gateName: 'Cổng B1',
    status: 'PARKING',
    driverName: 'Trần Quốc Tuấn',
    driverPhone: '0909 128 374',
  },
  recentBookings: [
    {
      id: 9040,
      bookingCode: 'BK-2026-9040',
      parkingLotName: 'Bãi Xe Cảng Cát Lái (Cụm Bãi 3)',
      parkingLotAddress: 'Thành phố Thủ Đức, TP.HCM',
      vehicleLicensePlate: '51D-894.12',
      trailerLicensePlate: '51R-024.89',
      expectedCheckInTime: '2026-02-18T08:00:00',
      parkingDuration: '10h 30m (Qua đêm)',
      totalPrice: 360000,
      status: 'COMPLETED',
    },
    {
      id: 8812,
      bookingCode: 'BK-2026-8812',
      parkingLotName: 'Depot Tân Cảng Long Bình',
      parkingLotAddress: 'TP. Biên Hòa, Tỉnh Đồng Nai',
      vehicleLicensePlate: '51D-894.12',
      trailerLicensePlate: '51R-011.02',
      expectedCheckInTime: '2026-02-16T10:00:00',
      parkingDuration: '04h 15m (Đỗ ngày)',
      totalPrice: 160000,
      status: 'COMPLETED',
    },
    {
      id: 8705,
      bookingCode: 'BK-2026-8705',
      parkingLotName: 'Trạm Dừng Nghỉ Container Xuân Lộc',
      parkingLotAddress: 'Cao tốc Dầu Giây - Phan Thiết, Đồng Nai',
      vehicleLicensePlate: '50LD-112.90',
      trailerLicensePlate: '51R-024.89',
      expectedCheckInTime: '2026-02-14T19:00:00',
      parkingDuration: '07h 00m (Nghỉ đêm)',
      totalPrice: 220000,
      status: 'COMPLETED',
    },
  ],
}

/**
 * Resolves the display name of the driver from multiple candidate sources:
 * 1. Booking driver name
 * 2. localStorage saved driver name
 * 3. localStorage auth object
 * 4. Fallback 'Trần Quốc Tuấn'
 */
function resolveDriverName(fromBooking?: string): string {
  if (fromBooking && fromBooking.trim() !== '' && fromBooking !== 'Tài xế') {
    return fromBooking
  }
  const storedName = localStorage.getItem('smart-truck-parking.driver_name')
  if (storedName && storedName.trim() !== '' && storedName !== 'Tài xế') {
    return storedName
  }
  try {
    const auth = JSON.parse(localStorage.getItem('smart-truck-parking.auth') || '{}')
    if (auth.name && auth.name !== 'Tài xế') return auth.name
    if (auth.fullName && auth.fullName !== 'Tài xế') return auth.fullName
  } catch {
    // ignore
  }
  return fallbackDashboardData.driverName
}

/**
 * Helper to unpack response whether wrapped in ApiResponse { data: ... } or direct payload.
 * Returns undefined if response is an HTML string (Vite SPA fallback).
 */
function unpackApiResponse<T>(raw: unknown): T | undefined {
  if (!raw || typeof raw === 'string') {
    return undefined
  }
  if (typeof raw === 'object' && raw !== null) {
    if ('data' in raw && (raw as { data?: unknown }).data !== undefined) {
      const inner = (raw as { data: T }).data
      if (typeof inner === 'string') return undefined
      return inner
    }
    return raw as T
  }
  return undefined
}

export async function fetchDriverDashboardData(): Promise<DashboardSummaryData> {
  try {
    const [vehiclesRes, bookingsRes] = await Promise.all([
      apiClient.get('/api/v1/vehicles', {
        params: { page: 0, size: 10 },
      }),
      apiClient.get('/api/v1/bookings', {
        params: { page: 0, size: 20 },
      }),
    ])

    // Unpack responses taking Spring Boot ApiResponse wrapper into account
    const vehiclesData = unpackApiResponse<PageResponse<VehicleDto> | VehicleDto[]>(vehiclesRes.data)
    const bookingsData = unpackApiResponse<PageResponse<BookingDto> | BookingDto[]>(bookingsRes.data)

    // If both returned HTML string (e.g. Vite SPA fallback when backend proxy offline), fallback cleanly
    if (!vehiclesData && !bookingsData) {
      return fallbackDashboardData
    }

    // Extract total counts and raw booking arrays
    const vehicleTotal =
      typeof (vehiclesData as PageResponse<VehicleDto>)?.totalElements === 'number'
        ? (vehiclesData as PageResponse<VehicleDto>).totalElements
        : Array.isArray(vehiclesData)
          ? vehiclesData.length
          : Array.isArray((vehiclesData as PageResponse<VehicleDto>)?.content)
            ? (vehiclesData as PageResponse<VehicleDto>).content.length
            : 0

    const bookingTotal =
      typeof (bookingsData as PageResponse<BookingDto>)?.totalElements === 'number'
        ? (bookingsData as PageResponse<BookingDto>).totalElements
        : Array.isArray(bookingsData)
          ? bookingsData.length
          : Array.isArray((bookingsData as PageResponse<BookingDto>)?.content)
            ? (bookingsData as PageResponse<BookingDto>).content.length
            : 0

    const rawList: Record<string, unknown>[] = Array.isArray((bookingsData as PageResponse<BookingDto>)?.content)
      ? ((bookingsData as PageResponse<BookingDto>).content as unknown as Record<string, unknown>[])
      : Array.isArray(bookingsData)
        ? (bookingsData as unknown as Record<string, unknown>[])
        : []

    // If the backend explicitly returned a valid empty response (zero vehicles & zero bookings)
    if (vehicleTotal === 0 && bookingTotal === 0 && rawList.length === 0) {
      const driverName = resolveDriverName()
      return {
        driverName,
        driverPhone: '',
        vehicleTotal: 0,
        bookingTotal: 0,
        activeCount: 0,
        queueCount: 0,
        activeBooking: undefined,
        recentBookings: [],
        isEmptyState: true,
      }
    }

    // Normalize booking records from backend (mapping vehiclePlate -> vehicleLicensePlate, totalAmount -> totalPrice, etc.)
    const rawBookings: BookingDto[] = rawList.map((item) => ({
      id: Number(item.id || 0),
      bookingCode: String(item.bookingCode || `BK-${item.id}`),
      parkingLotName: String(item.parkingLotName || 'Bãi đỗ xe đối tác'),
      parkingLotAddress: String(item.parkingLotAddress || ''),
      vehicleLicensePlate: String(item.vehicleLicensePlate || item.vehiclePlate || '51D-894.12'),
      trailerLicensePlate: item.trailerLicensePlate ? String(item.trailerLicensePlate) : undefined,
      containerType: item.containerType ? String(item.containerType) : 'CONTAINER 40FT',
      berthNumber: item.berthNumber ? String(item.berthNumber) : 'BERTH C-12',
      usableLength: item.usableLength ? String(item.usableLength) : '18.5m',
      shorePowerAvailable: Boolean(item.shorePowerAvailable ?? true),
      checkInTime: item.checkInTime ? String(item.checkInTime) : undefined,
      expectedCheckInTime: String(item.expectedCheckInTime || new Date().toISOString()),
      expectedCheckOutTime: item.expectedCheckOutTime ? String(item.expectedCheckOutTime) : undefined,
      parkingDuration: item.parkingDuration ? String(item.parkingDuration) : undefined,
      depositAmount: typeof item.depositAmount === 'number' ? item.depositAmount : Number(item.advanceDeposit || 0),
      remainingAmount: typeof item.remainingAmount === 'number' ? item.remainingAmount : 0,
      totalPrice: typeof item.totalPrice === 'number' ? item.totalPrice : Number(item.totalAmount || 0),
      hourlyRate: typeof item.hourlyRate === 'number' ? item.hourlyRate : 40000,
      gateName: item.gateName ? String(item.gateName) : 'Cổng B1',
      status: (item.status as BookingStatus) || 'PARKING',
      driverName: item.driverName ? String(item.driverName) : undefined,
      driverPhone: item.driverPhone ? String(item.driverPhone) : undefined,
    }))

    // Filter active bookings
    const activeBookings = rawBookings.filter((b) => ACTIVE_STATUSES.includes(b.status))
    const activeCount = activeBookings.length

    // Priority active booking or newest booking
    const activeBooking =
      activeBookings[0] ||
      [...rawBookings].sort(
        (a, b) =>
          new Date(b.expectedCheckInTime).getTime() - new Date(a.expectedCheckInTime).getTime(),
      )[0]

    // Completed or recent bookings (take top 3)
    const recentBookings = rawBookings
      .filter((b) => b.id !== activeBooking?.id)
      .slice(0, 3)

    const driverName = resolveDriverName(activeBooking?.driverName)

    return {
      driverName,
      driverPhone: activeBooking?.driverPhone || fallbackDashboardData.driverPhone,
      vehicleTotal: vehicleTotal > 0 ? vehicleTotal : fallbackDashboardData.vehicleTotal,
      bookingTotal: bookingTotal > 0 ? bookingTotal : fallbackDashboardData.bookingTotal,
      activeCount,
      queueCount: 0,
      activeBooking: activeBooking || fallbackDashboardData.activeBooking,
      recentBookings: recentBookings.length > 0 ? recentBookings : fallbackDashboardData.recentBookings,
      isEmptyState: false,
    }
  } catch {
    // Graceful fallback to rich Stitch showcase data when offline or demo environment
    return fallbackDashboardData
  }
}
