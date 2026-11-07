export interface ParkingFacilityDetail {
  id: number
  code: string
  name: string
  address: string
  distanceToPortHint: string
  ratingAverage: number
  reviewCount: number
  hotline: string
  gateClearanceMeters: number
  maxGrossWeightTons: number
  surfaceDescription: string
  totalAreaM2: number
  totalCapacity: number
  totalAvailableSlots: number
  lastUpdatedSecondsAgo: number
  isVerified: boolean
}

export interface SlotCapacityCategory {
  id: string
  categoryName: string
  subDescription: string
  highDemandLabel?: string
  highDemandOccupiedPercent?: number
  availableSlots: number
  totalSlots: number
  occupiedPercent: number
  iconName: string
}

export interface PricingRuleItem {
  id: string
  vehicleType: string
  isHighlight?: boolean
  baseRatePerHour: number
  peakRatePerHour: number
  peakHoursNote: string
  overnightRate: number
  overtimePenaltyNote: string
}

export interface AmenityItem {
  id: string
  title: string
  description: string
  iconName: string
}

export interface DriverReviewItem {
  id: string
  authorName: string
  authorInitials: string
  route: string
  vehiclePlate: string
  rating: number
  timeAgo: string
  comment: string
}

export interface ReservationDetailState {
  registeredPlate: string
  vehicleDescription: string
  isVerifiedPlate: boolean
  matchingSlotsCount: number
  suggestedBerth: string
  estimatedArrivalText: string
  durationHours: number
  durationUntilText: string
  parkingRatePerHour: number
  parkingTotalAmount: number
  depositAmount: number
  settlementAtExitAmount: number
}

export type PaymentMethodType = 'PAYOS_VIETQR' | 'WALLET' | 'ENTERPRISE'

export type BookingFlowStep = 'CONFIGURATION' | 'PAYOS_CHECKOUT' | 'SUCCESS'

export interface BookingCreationResult {
  bookingId: string
  facilityId: number
  facilityName: string
  slotBerth: string
  vehiclePlate: string
  vehicleType: string
  durationHours: number
  totalAmount: number
  depositAmount: number
  depositPercentage: number
  remainingAmount: number
  holdExpiresAt: string
  holdTtlSeconds: number
  qrCodeData?: string
  payOsCheckoutUrl?: string
  paymentMethod: PaymentMethodType
  createdAt: string
  status: 'PENDING_PAYMENT' | 'HOLD_CONFIRMED' | 'ACTIVE' | 'EXPIRED'
}

export interface VirtualQueueTicketResult {
  queueTicketId: string
  facilityId: number
  queuePosition: number
  estimatedWaitMinutes: number
  plateNumber: string
  status: 'WAITING' | 'CALLED'
}
