export interface ParkingLotAmenity {
  id: string
  label: string
  description?: string
  iconName?: string
}

export interface ParkingLotTelemetry {
  id: string
  name: string
  address: string
  distanceToPort: string
  availableSpots: number
  totalSpots: number
  spotType: string
  pricePerHour: number
  priceBlockHours: number
  priceBlockAmount: number
  currency: string
  alprResponseTime: string
  weighStationCapacity: string
  operatingHours: string
  verified: boolean
  lastUpdatedMinutesAgo: number
  facilities: Array<{
    title: string
    subtitle: string
    amenityId: string
  }>
}

