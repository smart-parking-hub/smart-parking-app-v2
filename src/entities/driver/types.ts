export interface DriverLeadFormValues {
  fullName: string
  phone: string
  vehicleType: string
  destination: string
  notes?: string
}

export type DriverVehicleType =
  | 'container_40ft'
  | 'container_20ft'
  | 'container_45ft'
  | 'heavy_truck_15t'
  | 'heavy_truck_over_15t'
  | 'reefer_container'

