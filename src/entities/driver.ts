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

export type DriverQueueStatus =
  | 'WAITING'
  | 'NOTIFIED'
  | 'CONVERTED'
  | 'EXPIRED'
  | 'CANCELLED'

export interface DriverQueueEntity {
  id: number
  queueCode: string
  parkingLotId?: number
  parkingLotName: string
  parkingLotAddress: string
  gateName?: string
  berthCode?: string
  priorityLabel?: string
  vehiclePlate: string
  vehicleSpec: string
  distanceKm: number
  etaMinutes: number
  status: DriverQueueStatus
  statusBadgeLabel: string
  position?: number
  peopleAhead?: number
  estimatedWaitMinutes?: number
  holdSecondsRemaining?: number
  totalDurationSeconds?: number
  responseDeadlineText?: string
  registeredAtText?: string
}

export interface DriverQueueTelemetry {
  processingCount: number
  avgReleaseMinutes: number
  radarRadiusKm: number
  fairQueueRate: string
}

