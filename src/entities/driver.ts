import type { VehicleType } from './operations'

export interface DriverEntity {
  id: number
  fullName: string
  phoneNumber: string
  email?: string
  licenseNumber?: string
  licenseClass?: string
  experienceYears?: number
  isVerified: boolean
  avatarUrl?: string
}

export interface DriverVehicleEntity {
  id: number
  licensePlate: string
  trailerLicensePlate?: string
  vehicleType: VehicleType
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
  registeredAt: string
}

export interface DriverBookingEntity {
  id: number
  bookingCode: string
  parkingLotName: string
  parkingLotAddress: string
  vehicleLicensePlate: string
  trailerLicensePlate?: string
  berthNumber?: string
  expectedCheckInTime: string
  expectedCheckOutTime?: string
  parkingDuration?: string
  totalPrice?: number
  depositAmount?: number
  status: string
}

export interface DriverMetricsEntity {
  vehicleTotal: number
  bookingTotal: number
  activeCount: number
  queueCount: number
}

