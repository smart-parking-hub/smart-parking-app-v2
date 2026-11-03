export type QueueStatus =
  | 'WAITING'
  | 'NOTIFIED'
  | 'CONVERTED'
  | 'EXPIRED'
  | 'CANCELLED'

export type QueueTab = 'ACTIVE' | 'HISTORY'

export interface TimelineVehicleItem {
  id: string
  label: string
  plate: string
  statusText: string
  isUser?: boolean
  isPast?: boolean
}

export interface ActiveQueueItem {
  id: number
  queueCode: string
  parkingLotName: string
  parkingLotAddress: string
  gateName?: string
  berthCode?: string
  priorityLabel?: string
  vehiclePlate: string
  vehicleSpec: string
  distanceKm: number
  etaMinutes: number
  status: QueueStatus
  statusBadgeLabel: string
  holdSecondsRemaining?: number
  totalDurationSeconds?: number
  responseDeadlineText?: string
  position?: number
  peopleAhead?: number
  estimatedWaitMinutes?: number
  checkOutSpeedText?: string
  radarCurrentLocation?: string
  registeredAtText?: string
  timelineFlow?: TimelineVehicleItem[]
}

export interface QueueHistoryItem {
  id: number
  queueCode: string
  registeredAtText: string
  parkingLotName: string
  parkingLotAddress: string
  vehiclePlate: string
  vehicleSpec: string
  initialPosition: number
  waitTimeText: string
  status: QueueStatus
  statusText: string
  bookingId?: number
}

export interface QueueTelemetryData {
  processingCount: number
  avgReleaseMinutes: number
  radarRadiusKm: number
  fairQueueRate: string
}

export interface QueueRegulationItem {
  number: string
  iconName: string
  title: string
  description: string
  tag: string
}
