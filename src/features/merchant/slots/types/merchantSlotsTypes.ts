export type VehicleType =
  | 'CONTAINER'
  | 'HEAVY_TRUCK'
  | 'LIGHT_TRUCK'
  | 'BUS_COACH'
  | 'SEDAN_SUV'

export interface SlotSpecDetails {
  lengthMeters: number
  powerOutlet?: string
  maxTonnageTon?: number
  turningRadiusM?: number
  specialLane?: string
  notes: string
}

export interface SlotMatrixItem {
  id?: number
  vehicleType: VehicleType
  typeNameVi: string
  subTitle: string
  codeRange?: string
  totalCapacity: number
  availableCapacity: number
  occupiedCapacity: number
  maxAllowed: number
  specs: SlotSpecDetails
  tagLabel: string
  tagTone: 'navy' | 'orange' | 'blue' | 'gray'
  statusNotice?: string
}

export interface BulkSlotConfigRequest {
  slots: {
    vehicleType: VehicleType
    totalCapacity: number
  }[]
}

export interface SlotKpiMetrics {
  totalCapacity: number
  totalOccupied: number
  totalAvailable: number
  occupancyPercent: number
  alertStatus: 'NORMAL' | 'NEAR_FULL' | 'FULL'
}

export interface FacilityWeightMetrics {
  maxDesignTonnage: number
  currentLoadedTonnage: number
  safetyFactorPercent: number
  tcStandard: string
}

export interface SimpleLotHeaderInfo {
  id: number
  code: string
  name: string
  address: string
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED'
  gateSystem: string
  alprStatusText: string
  alprLatencyMs: number
}
