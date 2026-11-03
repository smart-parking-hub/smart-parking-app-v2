import { apiClient } from '@/shared/api/client'
import type {
  PendingTicketDto,
  RepayPaymentResponse,
  ReleaseSlotResponse,
  DemoConfirmResponse,
} from '../types/paymentCancelTypes'

export const fallbackPendingTicket: PendingTicketDto = {
  bookingId: 2,
  bookingCode: 'BK-2026-9104',
  parkingLotName: 'Bãi Container Tân Cảng Cát Lái Gate 2',
  berthCode: 'Slot Berth C-114 (Shore-Power)',
  vehiclePlate: 'Đầu kéo 51D-894.12',
  trailerSpecs: '40ft HC • 32.5 Tấn',
  depositAmount: 100000,
  depositAmountText: '100.000 ₫',
  sessionCode: 'PAYOS-CAN-99124',
  totalHoldSeconds: 600,
  initialRemainingSeconds: 405, // 06 minutes 45 seconds
  waitingNextVehiclePlate: '50LD-112.44',
  entryGateLane: 'Làn số 04',
  shorePowerAvailable: true,
  spotsMatrix: [
    { code: 'C-111', status: 'OCCUPIED', label: 'XE ĐẬU' },
    { code: 'C-112', status: 'OCCUPIED', label: 'XE ĐẬU' },
    { code: 'C-113', status: 'OCCUPIED', label: 'XE ĐẬU' },
    { code: 'C-114', status: 'HELD', label: 'GIỮ CHỖ' },
    { code: 'C-115', status: 'OCCUPIED', label: 'XE ĐẬU' },
    { code: 'C-116', status: 'OCCUPIED', label: 'XE ĐẬU' },
    { code: 'C-117', status: 'VACANT', label: 'TRỐNG' },
    { code: 'C-118', status: 'VACANT', label: 'TRỐNG' },
  ],
}

export async function fetchPendingTicketApi(
  bookingId?: number
): Promise<PendingTicketDto> {
  if (bookingId) {
    try {
      const response = await apiClient.get<{ data: Partial<PendingTicketDto> }>(
        `/api/v1/bookings/${bookingId}`
      )
      if (response.data?.data) {
        return {
          ...fallbackPendingTicket,
          ...response.data.data,
          bookingId,
        }
      }
    } catch {
      // Fallback ok
    }
  }
  return fallbackPendingTicket
}

export async function repayDepositApi(
  bookingId: number
): Promise<RepayPaymentResponse> {
  try {
    const response = await apiClient.post<{ checkoutUrl: string }>(
      `/api/v1/bookings/${bookingId}/pay-deposit`
    )
    if (response.data?.checkoutUrl) {
      return { success: true, checkoutUrl: response.data.checkoutUrl }
    }
  } catch {
    // Fallback simulation
  }
  return {
    success: true,
    checkoutUrl: 'https://pay.payos.vn/web/demo-repay-checkout',
  }
}

export async function confirmDemoDepositApi(
  bookingId: number
): Promise<DemoConfirmResponse> {
  try {
    await apiClient.post('/api/v1/payments/demo-confirm', { bookingId })
    return {
      success: true,
      message: 'Đã xác nhận cọc thử nghiệm thành công! Hệ thống đang phát hành mã QR mở cổng Berth C-114.',
    }
  } catch {
    // Fallback simulation
  }
  return {
    success: true,
    message: 'Đã xác nhận cọc thử nghiệm thành công! Hệ thống đang phát hành mã QR mở cổng Berth C-114.',
  }
}

export async function releaseSlotApi(
  bookingId: number
): Promise<ReleaseSlotResponse> {
  try {
    await apiClient.post(`/api/v1/bookings/${bookingId}/cancel`, {
      reason: 'Driver released hold slot early from payment cancel page',
    })
    return {
      success: true,
      message: 'Đã hủy đặt chỗ thành công. Slot C-114 đã được trả về hàng đợi hệ thống.',
    }
  } catch {
    // Fallback simulation
  }
  return {
    success: true,
    message: 'Đã hủy đặt chỗ thành công. Slot C-114 đã được trả về hàng đợi hệ thống.',
  }
}
