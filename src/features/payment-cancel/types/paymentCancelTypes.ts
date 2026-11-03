export type BerthSpotStatus = 'OCCUPIED' | 'HELD' | 'VACANT'

export interface BerthSpotItem {
  code: string
  status: BerthSpotStatus
  label: string
}

export interface PendingTicketDto {
  bookingId: number
  bookingCode: string
  parkingLotName: string
  berthCode: string
  vehiclePlate: string
  trailerSpecs: string
  depositAmount: number
  depositAmountText: string
  sessionCode: string
  totalHoldSeconds: number
  initialRemainingSeconds: number
  waitingNextVehiclePlate: string
  entryGateLane: string
  shorePowerAvailable: boolean
  spotsMatrix: BerthSpotItem[]
}

export interface RepayPaymentResponse {
  success: boolean
  checkoutUrl: string
}

export interface ReleaseSlotResponse {
  success: boolean
  message: string
}

export interface DemoConfirmResponse {
  success: boolean
  message: string
}
