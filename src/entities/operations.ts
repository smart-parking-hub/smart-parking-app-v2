export const vehicleTypes = [
  'SEDAN_SUV',
  'BUS_COACH',
  'LIGHT_TRUCK',
  'HEAVY_TRUCK',
  'CONTAINER',
] as const
export type VehicleType = (typeof vehicleTypes)[number]
export const vehicleLabels: Record<VehicleType, string> = {
  SEDAN_SUV: 'Ô tô 4–7 chỗ',
  BUS_COACH: 'Xe khách',
  LIGHT_TRUCK: 'Xe tải nhẹ',
  HEAVY_TRUCK: 'Xe tải nặng',
  CONTAINER: 'Đầu kéo / Container',
}
export interface Slot {
  id: number
  vehicleType: VehicleType
  totalCapacity: number
  availableCapacity: number
}
export interface Pricing {
  vehicleType: VehicleType
  basePricePerHour: number
  surgeMultiplier: number
  surgeStartTime: string | null
  surgeEndTime: string | null
  overtimePenaltyMultiplier: number
}
export interface Lot {
  id: number
  merchantId: number
  name: string
  address: string
  latitude: number
  longitude: number
  status: string
  reviewReason?: string
  merchantName?: string
  merchantPhone?: string
  slots: Slot[]
  pricingRules: Pricing[]
  images: { id: number; contentUrl: string }[]
}
export interface Booking {
  id: number
  bookingCode: string
  vehiclePlate: string
  vehicleLicensePlate: string
  vehicleType: VehicleType
  parkingLotId: number
  parkingLotName: string
  parkingLotAddress?: string
  merchantId?: number
  driverId?: number
  vehicleId?: number
  status: string
  advanceDeposit: number
  totalAmount: number
  hourlyRate?: number
  expectedCheckInTime: string
  expectedCheckOutTime: string
  expiresAt?: string
  checkInTime: string
  checkOutTime: string
  createdAt: string
  cancellationReason?: string
  cancelledAt?: string
}
export interface Settlement {
  bookingCode: string
  totalAmount: number
  advanceDeposit: number
  amountDue: number
  parkingMinutes: number
  bookingStatus: string
}
export interface Revenue {
  totalGrossRevenue: number
  totalPlatformFee: number
  totalNetRevenue: number
  currentWalletBalance: number
  completedBookings: number
  minWithdrawalAmount: number
  series: { period: string; revenue: number; bookingCount: number }[]
}
export interface Withdrawal {
  id: number
  merchantName: string
  amount: number
  status: string
  requestedAt: string
  processedAt: string
  decisionReason: string
  bankName: string
  maskedBankAccount: string
  accountHolderName: string
}
export interface DisputeTimelineEntry {
  id: number
  eventType: string
  actorRole: string
  message: string
  resultingStatus: string
  createdAt: string
}
export interface Dispute {
  id: number
  bookingId: number
  merchantId: number | null
  parkingLotId?: number | null
  driverId: number
  reason: string
  description: string
  status: string
  resolution: string
  amount?: number | null
  compensationAmount?: number | null
  evidenceUrls?: string[]
  timeline?: DisputeTimelineEntry[]
  createdAt: string
  updatedAt: string
}
