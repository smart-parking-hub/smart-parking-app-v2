export interface MerchantKpiSummary {
  totalMonthlyRevenueNet: number
  revenueGrowthPercent: number
  walletBalance: number
  platformFeePercent: number
  averageOccupancyRate: number
  occupiedSlots: number
  totalSlots: number
  breakdown: {
    cont40ftPercent: number
    heavyTruckPercent: number
    mediumTruckPercent: number
  }
  todayCheckinCount: number
  todayCheckinBreakdown: string
  alprBarrierSpeedSeconds: number
  pendingWithdrawalAmount: number
  pendingWithdrawalCount: number
}

export interface RevenueSeriesPointDto {
  period: string
  revenue: number
  bookingCount: number
  onlineTransferRevenue?: number
  counterQrRevenue?: number
  cashRevenue?: number
  onlineTransferCount?: number
  counterQrCount?: number
  cashBookingCount?: number
}

export interface LotRevenueBreakdownDto {
  parkingLotId: number
  onlineTransferGrossRevenue?: number
  onlineTransferRevenue: number
  onlineTransferCount: number
  counterQrGrossRevenue?: number
  counterQrRevenue: number
  counterQrCount: number
  cashRevenue: number
  cashBookingCount: number
  periodOnlineTransferRevenue: number
  periodOnlineTransferCount: number
  periodCounterQrRevenue: number
  periodCounterQrCount: number
  periodCashRevenue: number
  periodCashBookingCount: number
}

export interface RevenueStatsResponse {
  totalNetRevenue: number
  totalGrossRevenue?: number
  currentWalletBalance?: number
  completedBookings?: number | null
  onlineTransferGrossRevenue?: number
  onlineTransferNetRevenue?: number
  onlineTransferCount?: number
  periodOnlineTransferNetRevenue?: number
  periodOnlineTransferCount?: number
  counterQrGrossRevenue?: number
  counterQrNetRevenue?: number
  counterQrCount?: number
  periodCounterQrNetRevenue?: number
  periodCounterQrCount?: number
  totalCashRevenue?: number
  totalCashBookings?: number
  periodCashRevenue?: number
  periodCashBookings?: number
  revenueByParkingLot?: LotRevenueBreakdownDto[]
  series: RevenueSeriesPointDto[]
}

export interface DailyRevenueVolumePoint {
  date: string
  dayLabel: string
  mainYardRevenue: number
  reeferSurcharge: number
  vehicleVolume: number
  isPeakDay?: boolean
  peakBadgeText?: string
}

export type CheckinOperationalStatus =
  | 'OVERDUE'
  | 'REEFER_PLUGGED'
  | 'PARKING_VALID'
  | 'UNLOADING'

export interface RecentCheckinItem {
  id: string | number
  licensePlate: string
  vehicleType: string
  berthSlot: string
  yardName: string
  gateIn: string
  checkinTimeText: string
  depositAmount: number
  statusTag: CheckinOperationalStatus
  statusLabel: string
  isWarning?: boolean
}

export interface LiveYardItem {
  id: number
  name: string
  address: string
  status: 'APPROVED' | 'PENDING_APPROVAL'
  capacityPercent: number
  capacityStatusText: string
  occupiedSlots: number
  totalSlots: number
  remainingSlotNote: string
  todayRevenueText?: string
  pendingAuditNote?: string
}

export interface AlprCameraFeed {
  id: string
  cameraName: string
  direction: 'IN' | 'OUT'
  detectedPlate: string
  confidencePercent?: number
  barrierStatus: 'MỞ' | 'ĐÓNG'
  isLive: boolean
}

export interface MerchantDashboardData {
  kpis: MerchantKpiSummary
  chartData: DailyRevenueVolumePoint[]
  recentCheckins: RecentCheckinItem[]
  liveYards: LiveYardItem[]
  alprFeeds: AlprCameraFeed[]
}
