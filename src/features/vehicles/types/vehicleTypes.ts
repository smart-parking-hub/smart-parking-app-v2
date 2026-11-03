export type VehicleClassType =
  | 'CONTAINER'
  | 'TRAILER'
  | 'HEAVY'
  | 'MEDIUM'
  | 'LIGHT'

export type VehicleStatusType = 'ACTIVE' | 'LOCKED' | 'PENDING'

export interface VehicleItem {
  id: number
  licensePlate: string
  vehicleClass: VehicleClassType
  vehicleClassLabel: string
  brandModel: string
  specDetails: string
  subSpecText: string
  originDetails: string
  curbWeightTon: number
  towingWeightTon: number
  axleConfig: string
  inspectionExpiryDate: string
  inspectionRemainingText: string
  insuranceNumber: string
  alprSyncStatus: 'SYNCED' | 'PENDING'
  alprSyncText: string
  alprSubText: string
  isDefault: boolean
  needsShorePower?: boolean
  temperatureRange?: string
  status: VehicleStatusType
}

export interface FleetKpiMetrics {
  totalVehicles: number
  tractorCount: number
  trailerCount: number
  defaultPlate: string
  defaultSpec: string
  defaultLocationStatus: string
  alprVerifiedRate: string
  verifiedRatioText: string
  totalTonnage: number
  eligibleRoutesText: string
}

export interface AddVehicleFormData {
  licensePlate: string
  vehicleClass: VehicleClassType
  curbWeightTon: number
  towingWeightTon: number
  brandModel: string
  manufactureYear: number
  isDefault: boolean
  registrationDocName?: string
}
