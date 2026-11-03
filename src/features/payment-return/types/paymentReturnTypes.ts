export type PaymentSyncState =
  | 'idle'
  | 'syncing'
  | 'success'
  | 'pending'
  | 'cancelled'
  | 'error'

export interface PaymentSyncPayload {
  orderCode?: number
  paymentLinkId?: string
  bookingId?: number
}

export interface PaymentReturnManifestDto {
  bookingId: number
  bookingCode: string
  transactionCode: string
  paymentChannel: string
  bankName: string
  amount: number
  amountText: string
  parkingLotName: string
  parkingLotAddress: string
  berthCode: string
  amenitiesText: string
  vehiclePlate: string
  trailerPlate?: string
  guaranteedUntilText: string
  depositStatusText: string
  gateVehicleId: string
  syncLatencyText: string
  status: 'PAID_VERIFIED' | 'SUCCESS' | 'PENDING' | 'CANCELLED' | 'ERROR'
}

export interface DemoDepositPayload {
  bookingId: number
  amount?: number
  merchantId?: number
  parkingLotId?: number
}
