export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_CHECKIN'
  | 'PARKING'
  | 'OVERTIME'
  | 'AWAITING_FINAL_PAYMENT'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REVIEWED'

export interface BookingDto {
  id: number
  bookingCode: string
  parkingLotName: string
  parkingLotAddress: string
  vehicleLicensePlate: string
  trailerLicensePlate?: string
  containerType?: string
  berthNumber?: string
  usableLength?: string
  shorePowerAvailable?: boolean
  checkInTime?: string
  checkOutTime?: string
  createdAt?: string
  physicalSlotCode?: string
  expectedCheckInTime: string
  expectedCheckOutTime?: string
  parkingDuration?: string
  depositAmount?: number
  remainingAmount?: number
  totalPrice?: number
  hourlyRate?: number
  gateName?: string
  status: BookingStatus
  driverName?: string
  driverPhone?: string
}

export interface VehicleDto {
  id: number
  licensePlate: string
  trailerLicensePlate?: string
  vehicleType?: string
  status?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
}

export interface DashboardSummaryData {
  vehicleTotal: number
  bookingTotal: number
  activeCount: number
  queueCount: number | null
  bookings?: BookingDto[]
  activeBooking?: BookingDto
  recentBookings: BookingDto[]
  driverName: string
  driverPhone: string
  isEmptyState?: boolean
}

export interface QuickSearchFormData {
  query: string
}

