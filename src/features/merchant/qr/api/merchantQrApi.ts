import { sendData } from '@/shared/api/resources'
import type { Settlement } from '@/entities/operations'

export interface CheckInPayload {
  bookingCode: string
  parkingLotId: number
}

export interface CheckOutPayload {
  bookingCode: string
  parkingLotId: number
}

export interface ConfirmCashPayload {
  bookingCode: string
  parkingLotId: number
  amount?: number
}

export async function merchantCheckInApi(payload: CheckInPayload): Promise<void> {
  return sendData('post', '/api/v1/merchant/check-in', payload)
}

export async function merchantCheckOutApi(payload: CheckOutPayload): Promise<Settlement | null> {
  return sendData<Settlement | null>('post', '/api/v1/merchant/check-out', payload)
}

export async function confirmCashPaymentApi(payload: ConfirmCashPayload): Promise<void> {
  return sendData('post', '/api/v1/merchant/confirm-cash', payload)
}
