export type VehicleClassification =
  | 'CONTAINER'
  | 'HEAVY_TRUCK'
  | 'MEDIUM_TRUCK'
  | 'LIGHT_TRUCK'
  | 'SEDAN_SUV'

export interface VehicleOption {
  id: string
  label: string
  type: VehicleClassification
}

export interface ParkingLotItem {
  id: number
  name: string
  address: string
  distanceKm: number
  etaMinutes: number
  availableSlots: number
  totalSlots: number
  slotTypeLabel: string
  maxVehicleLength?: string
  hourlyRate: number
  depositAmount: number
  isBestMatch?: boolean
  amenities: string[]
  latitude: number
  longitude: number
  ratingAverage: number
  isFull?: boolean
  queueActive?: boolean
  queueWaitingCount?: number
  queueEtaMinutes?: number
  specialNote?: string
}

export interface SearchFilterState {
  selectedVehicleId: string
  vehicleType: VehicleClassification
  radiusKm: number
  sortBy: 'distance' | 'price' | 'rating'
  includeFull: boolean
  keyword: string
}

export interface QuickBookingPayload {
  parkingLotId: number
  parkingLotTitle: string
  pricePerHour: number
  availableSlotsText: string
  vehicleLicensePlate: string
  etaText: string
  depositAmount: number
}
