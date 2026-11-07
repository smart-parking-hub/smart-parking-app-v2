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

export async function fetchDriverDashboardData(): Promise<DashboardSummaryData> {
    const [vehiclesRes, bookingsRes] = await Promise.all([
      apiClient.get<{data:PageResponse<VehicleDto>}>('/api/v1/vehicles', {
        params: { page: 0, size: 10 },
      }),
      apiClient.get<{data:PageResponse<BookingDto & {vehiclePlate?:string;advanceDeposit?:number;totalAmount?:number}>}>('/api/v1/bookings', {
        params: { page: 0, size: 20 },
      }),
    ])

    const vehicleTotal = vehiclesRes.data.data?.totalElements ?? 0
    const bookingTotal = bookingsRes.data.data?.totalElements ?? 0
    const rawBookings = (bookingsRes.data.data?.content ?? []).map(b=>({...b,vehicleLicensePlate:b.vehiclePlate??b.vehicleLicensePlate,depositAmount:b.advanceDeposit,totalPrice:b.totalAmount,remainingAmount:b.totalAmount == null ? undefined : Math.max(0,b.totalAmount-(b.advanceDeposit??0))}))

    // If user has zero vehicles and zero bookings, trigger real empty state
    if (vehicleTotal === 0 && bookingTotal === 0 && rawBookings.length === 0) {
      const savedName = localStorage.getItem('smart-truck-parking.driver_name') || 'Tài xế'
      return {
        driverName: savedName,
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

    // Filter active bookings
    const activeBookings = rawBookings.filter((b) => ACTIVE_STATUSES.includes(b.status))
    const activeCount = activeBookings.length

    // Priority active booking or newest booking
    const activeBooking =
      activeBookings[0]

    // Completed or recent bookings (take top 3)
    const recentBookings = rawBookings
      .filter((b) => b.id !== activeBooking?.id)
      .slice(0, 3)

    return {
      driverName: activeBooking?.driverName || localStorage.getItem('smart-truck-parking.driver_name') || 'Tài xế',
      driverPhone: activeBooking?.driverPhone || '',
      vehicleTotal,
      bookingTotal,
      activeCount,
      queueCount: 0,
      activeBooking,
      recentBookings,
      isEmptyState: false,
    }
}
