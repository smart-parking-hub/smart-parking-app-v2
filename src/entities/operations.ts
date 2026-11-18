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
export interface ParkingLotImage {
  id: number
  contentUrl: string
  originalFileName?: string
  cover?: boolean
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
  description?: string
  merchantName?: string
  merchantPhone?: string
  slots: Slot[]
  pricingRules: Pricing[]
  images: ParkingLotImage[]
}
export type ApiDateTimeValue = string | number[] | null | undefined

export interface Booking {
  finalPaymentMethod?: string | null
  finalPaymentAmount?: number | null
  id: number
  bookingCode: string
  vehiclePlate: string
  vehicleLicensePlate?: string | null
  vehicleType?: VehicleType
  parkingLotId: number
  parkingLotName: string
  parkingLotAddress?: string | null
  merchantId?: number | null
  driverId?: number | null
  vehicleId?: number | null
  status: string
  advanceDeposit: number
  totalAmount?: number | null
  hourlyRate?: number | null
  surgeMultiplier?: number | null
  surgeStartTime?: ApiDateTimeValue
  surgeEndTime?: ApiDateTimeValue
  overtimePenaltyMultiplier?: number | null
  expectedCheckInTime: ApiDateTimeValue
  expectedCheckOutTime?: ApiDateTimeValue
  expiresAt?: ApiDateTimeValue
  checkInTime?: ApiDateTimeValue
  checkOutTime?: ApiDateTimeValue
  createdAt?: ApiDateTimeValue
  cancelledAt?: ApiDateTimeValue
  cancellationReason?: string | null
  refundAmount?: number | null
  refundPercentage?: number | null
  refundPolicy?: string | null
  refundStatus?: string | null
  refundReference?: string | null
  driverName?: string | null
  driverPhone?: string | null
  customerName?: string | null
  customerPhone?: string | null
}
export interface Settlement {
  bookingId?: number
  finalPaymentMethod?: string
  bookingCode: string
  totalAmount: number
  advanceDeposit: number
  amountDue: number
  parkingMinutes: number
  bookingStatus: string
}
export interface LotRevenueBreakdown {
  parkingLotId: number
  onlineTransferGrossRevenue?: number
  onlineTransferRevenue: number
  onlineTransferCount: number
  counterQrGrossRevenue?: number
  counterQrRevenue: number
  counterQrCount: number
  unclassifiedTransferGrossRevenue?: number
  unclassifiedTransferRevenue?: number
  unclassifiedTransferCount?: number
  pendingSettlementGrossRevenue?: number
  periodPendingSettlementGrossRevenue?: number
  cashRevenue: number
  cashBookingCount: number
  periodOnlineTransferGrossRevenue?: number
  periodOnlineTransferRevenue: number
  periodOnlineTransferCount: number
  periodCounterQrGrossRevenue?: number
  periodCounterQrRevenue: number
  periodCounterQrCount: number
  periodUnclassifiedTransferGrossRevenue?: number
  periodUnclassifiedTransferRevenue?: number
  periodUnclassifiedTransferCount?: number
  periodCashRevenue: number
  periodCashBookingCount: number
}
export interface RevenueSeriesPoint {
  period: string
  revenue: number
  bookingCount: number
  onlineTransferRevenue?: number
  counterQrRevenue?: number
  unclassifiedTransferRevenue?: number
  cashRevenue?: number
  onlineTransferCount?: number
  counterQrCount?: number
  unclassifiedTransferCount?: number
  cashBookingCount?: number
}
export interface Revenue {
  totalGrossRevenue: number
  totalPlatformFee: number
  totalNetRevenue: number
  periodTotalGrossRevenue?: number
  periodTotalPlatformFee?: number
  periodTotalNetRevenue?: number
  pendingSettlementGrossRevenue?: number
  periodPendingSettlementGrossRevenue?: number
  currentWalletBalance: number
  completedBookings: number
  minWithdrawalAmount: number
  onlineTransferGrossRevenue?: number
  onlineTransferNetRevenue?: number
  onlineTransferCount?: number
  periodOnlineTransferGrossRevenue?: number
  periodOnlineTransferNetRevenue?: number
  periodOnlineTransferCount?: number
  counterQrGrossRevenue?: number
  counterQrNetRevenue?: number
  counterQrCount?: number
  periodCounterQrGrossRevenue?: number
  periodCounterQrNetRevenue?: number
  periodCounterQrCount?: number
  unclassifiedTransferGrossRevenue?: number
  unclassifiedTransferNetRevenue?: number
  unclassifiedTransferCount?: number
  periodUnclassifiedTransferGrossRevenue?: number
  periodUnclassifiedTransferNetRevenue?: number
  periodUnclassifiedTransferCount?: number
  totalCashRevenue?: number
  totalCashBookings?: number
  periodCashRevenue?: number
  periodCashBookings?: number
  revenueByParkingLot?: LotRevenueBreakdown[]
  series: RevenueSeriesPoint[]
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
  bankAccountNumber?: string | null
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
