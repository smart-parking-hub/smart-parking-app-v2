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
  updatedAt?: string
}

