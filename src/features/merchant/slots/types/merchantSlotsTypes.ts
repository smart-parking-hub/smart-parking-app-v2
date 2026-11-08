export type VehicleType = 'CONTAINER' | 'HEAVY_TRUCK' | 'LIGHT_TRUCK' | 'BUS_COACH' | 'SEDAN_SUV'

export interface SlotMatrixItem {
  id?: number
  vehicleType: VehicleType
  typeNameVi: string
  totalCapacity: number
  availableCapacity: number
  occupiedCapacity: number
}
export interface BulkSlotConfigRequest {
  slots: { vehicleType: VehicleType; totalCapacity: number }[]
}
export interface SlotKpiMetrics {
  totalCapacity: number
  totalOccupied: number
  totalAvailable: number
  occupancyPercent: number
  alertStatus: 'NORMAL' | 'NEAR_FULL' | 'FULL'
}
export interface SimpleLotHeaderInfo {
  id: number
  name: string
  address: string
  status: 'APPROVED' | 'PENDING_APPROVAL' | 'CHANGES_REQUESTED' | 'REJECTED' | 'SUSPENDED'
}
