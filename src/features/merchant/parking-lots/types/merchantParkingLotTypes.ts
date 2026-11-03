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
