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

export type FilterStatusTab =
  | 'ALL'
  | 'ACTIVE'
  | 'PENDING_PAYMENT'
  | 'COMPLETED'
  | 'CANCELLED'

export interface BookingItemDto {
  id: number
  bookingCode: string
  parkingLotName: string
  parkingLotAddress: string
  vehiclePlate: string
  trailerPlate?: string
  vehicleType: string
  status: BookingStatus
  statusBadgeLabel: string
  createdAtText: string
  expectedCheckInTime: string
  expectedCheckOutTime: string
  actualCheckInTime?: string
  actualCheckOutTime?: string
  gateInName?: string
  gateOutName?: string
  alprMatchRate?: string
  berthCode?: string
  hasReefer?: boolean
  baseRatePerHour: number
  actualDurationHours: number
  actualDurationText: string
  parkingSubtotal: number
  reeferHourlyRate?: number
  reeferHours?: number
  reeferSubtotal?: number
  depositPaid: number
  penaltyAmount?: number
  remainingFinalPayment: number
  holdExpiresAt?: string
  holdSecondsRemaining?: number
  gateToken: string
  invoiceIssued?: boolean
}

export interface CancelBookingRequest {
  bookingId: number
  reason: string
  note?: string
  bankAccount?: string
}

export interface ReviewBookingRequest {
  bookingId: number
  rating: number
  comment: string
}
