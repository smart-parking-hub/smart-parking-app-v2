export type ParkingLotStatus =
  | 'ALL'
  | 'APPROVED'
  | 'PENDING_APPROVAL'
  | 'CHANGES_REQUESTED'
  | 'SUSPENDED'
  | 'REJECTED'

export type YardSectionAllocation = {
  sectionName: string
  usedSlots: number
  totalSlots: number
}

export type VerificationMilestone = {
  step: number
  title: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING'
}

export type MerchantParkingLotCardData = {
  id: number
  code: string
  name: string
  address: string
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'CHANGES_REQUESTED' | 'SUSPENDED' | 'REJECTED'
  gateSystem: string
  ratingAverage: number | null
  reviewCount: number
  monthlyRevenue: number
  imageUrl: string
  yardTag: string
  totalCapacity: number
  usedSlots: number
  occupancyRate: number
  alertStatus?: 'NORMAL' | 'NEAR_FULL' | 'UNDER_REVIEW'
  supportedFleets: string[]
  amenities: {
    iconName: string
    label: string
  }[]
  sections?: YardSectionAllocation[]
  systemIntegrationNote?: string
  submissionDate?: string
  complianceNotice?: string
  verificationMilestones?: VerificationMilestone[]
  createdAt: string
}

export type MerchantLotsMetrics = {
  totalFacilities: number
  activeFacilities: number
  underReviewFacilities: number
  totalCapacity: number
  usedSlots: number
  availableSlots: number
  occupancyRate: number
  todayRevenue: number
  revenueGrowthPercent: number
  todayGatePasses: number
}

export type MerchantParkingLotListParams = {
  page?: number
  size?: number
  status?: string
  keyword?: string
  sort?: string
}

export type MerchantParkingLotPageResponse = {
  content: MerchantParkingLotCardData[]
  currentPage: number
  totalPages: number
  totalElements: number
}

export type CreateMerchantParkingLotRequest = {
  name: string
  address: string
  latitude: number
  longitude: number
}

export type ParkingLotImageItem = {
  id?: number
  parkingLotId?: number
  fileName?: string
  originalFileName?: string
  contentType?: string
  fileUrl?: string
  isCover?: boolean
  file?: File
  previewUrl: string
  name: string
  sizeBytes: number
}

export type AiContentSegments = {
  logisticsCapacity: string
  safetyRegulations: string
  circulationGuide: string
}

export type CreateParkingLotDraft = {
  name: string
  address: string
  latitude?: number
  longitude?: number
  aiContent?: AiContentSegments
  customHighlights?: string
  updatedAt?: string
}

export interface DetailedParkingLotSlot {
  id: number
  vehicleType: string
  typeNameVi: string
  totalCapacity: number
  availableCapacity: number
  occupancyPercent: number
  dimensionNote: string
  statusNotice: string
  isQueueActivated?: boolean
  tagColor?: 'orange' | 'dark' | 'blue' | 'gray'
}

export interface DetailedPricingMatrix {
  baseHourlyRate: number
  baseHourlyNote: string
  peakSurgePercent: number
  peakWindowNote: string
  overnightRate: number
  overnightWindowNote: string
  depositRate: number
  depositPolicyNote: string
  legalNotice: string
}

export interface ActiveVehicleTelemetry {
  id: number
  licensePlate: string
  slotCode: string
  durationFormatted: string
  isOvertime: boolean
  overtimeNotice?: string
  serviceName: string
  statusLabel: string
  statusTone: 'valid' | 'overtime' | 'operation'
}

export interface YardOperationalProfile {
  managerName: string
  managerPhone: string
  managerOtpVerified: boolean
  uhfRadioChannel: string
  uhfNote: string
  techHotline: string
  techSlaNotice: string
  gpsCoordinates: { lat: number; lng: number }
  gpsFormatted: string
  heightClearance: string
  maxAxleWeightTons: number
  mapSnapshotUrl: string
  distanceToPort: string
}

export interface YardGalleryImage {
  id: number
  url: string
  title: string
  subtitle: string
  isCover: boolean
}

export interface MerchantParkingLotDetailData extends MerchantParkingLotCardData {
  alprLatencySec: number
  alprCloudSyncStatus: string
  slotsDetailed: DetailedParkingLotSlot[]
  pricingMatrix: DetailedPricingMatrix
  activeVehicles: ActiveVehicleTelemetry[]
  operationalProfile: YardOperationalProfile
  galleryImages: YardGalleryImage[]
  ownershipVerified?: boolean
  reviewReason?: string
}

export interface EditParkingLotFormData {
  name: string
  address: string
  latitude: number
  longitude: number
  hotline?: string
  clearanceHeight?: string
  merchantResponse?: string
}

export interface EditParkingLotDraft {
  lotId: number
  name: string
  address: string
  latitude: number
  longitude: number
  hotline?: string
  clearanceHeight?: string
  merchantResponse?: string
  savedAt: string
}

export interface AdminReviewPoint {
  index: number
  title: string
  description: string
}
