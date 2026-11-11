import { z } from 'zod'

export interface DisputeReasonPreset {
  id: string
  label: string
  hint: string
}

export const DISPUTE_REASON_PRESETS: DisputeReasonPreset[] = [
  {
    id: 'EXTRA_CASH',
    label: 'Thu thêm tiền mặt / phụ phí sai quy định tại cổng',
    hint: 'Ví dụ: Bảo vệ thu thêm tiền mặt ngoài hóa đơn ứng dụng hoặc thu sai biểu phí niêm yết.',
  },
  {
    id: 'OVERTIME_BILLING',
    label: 'Tính cước quá giờ hoặc sai biểu phí niêm yết',
    hint: 'Ví dụ: Hệ thống ghi nhận sai giờ vào/ra hoặc áp sai hệ số quá giờ.',
  },
  {
    id: 'PAID_BUT_CLOSED',
    label: 'Bãi xe đóng cửa / hết chỗ dù đã thanh toán giữ chỗ',
    hint: 'Ví dụ: Đã thanh toán cọc qua PayOS (PENDING_CHECKIN) nhưng đến nơi bãi đóng cửa hoặc hết slot.',
  },
  {
    id: 'REJECTED_AT_GATE',
    label: 'Bãi xe từ chối nhận xe dù đã đặt chỗ hợp lệ',
    hint: 'Ví dụ: Có mã QR check-in hợp lệ nhưng bảo vệ từ chối cho xe vào bãi.',
  },
  {
    id: 'VEHICLE_DAMAGE',
    label: 'Sự cố hư hại phương tiện / hàng hóa trong bãi',
    hint: 'Ví dụ: Va quệt, trầy xước hoặc mất mát phụ kiện trong thời gian gửi xe tại bãi.',
  },
  {
    id: 'ALPR_BARRIER',
    label: 'Lỗi barie / camera ALPR không nhận diện biển số',
    hint: 'Ví dụ: Barie không tự động mở khiến xe bị trễ giờ check-in/check-out.',
  },
]

export const DISPUTE_REASON_MAX_LENGTH = 200
export const DISPUTE_DESCRIPTION_MAX_LENGTH = 1500
export const DISPUTE_MAX_ATTACHMENTS = 4
export const DISPUTE_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const DISPUTE_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const createDisputeSchema = z.object({
  bookingId: z
    .number({ invalid_type_error: 'Vui lòng chọn hoặc nhập ID Booking hợp lệ' })
    .int('ID Booking phải là số nguyên')
    .positive('ID Booking phải lớn hơn 0'),
  merchantId: z.number().int().positive().nullable().optional(),
  reason: z
    .string()
    .trim()
    .min(1, 'Vui lòng chọn hoặc nhập lý do khiếu nại')
    .max(DISPUTE_REASON_MAX_LENGTH, `Lý do khiếu nại tối đa ${DISPUTE_REASON_MAX_LENGTH} ký tự`),
  description: z
    .string()
    .max(DISPUTE_DESCRIPTION_MAX_LENGTH, `Mô tả chi tiết tối đa ${DISPUTE_DESCRIPTION_MAX_LENGTH} ký tự`)
    .optional()
    .default(''),
})

export type CreateDisputeFormValues = z.infer<typeof createDisputeSchema>

export interface DisputeBookingSummary {
  id: number
  bookingCode: string
  parkingLotId?: number
  parkingLotName?: string | null
  parkingLotAddress?: string | null
  merchantId?: number | null
  vehiclePlate?: string | null
  status: string
  advanceDeposit?: number
  totalAmount?: number | null
  expectedCheckInTime?: string
  expectedCheckOutTime?: string
  checkInTime?: string | null
  checkOutTime?: string | null
}

/**
 * Verified BookingStatusEnum values allowed to open a dispute.
 * Includes PENDING_CHECKIN (deposit paid via PayOS, not checked in yet) to protect
 * drivers when arriving at a closed/full parking lot.
 */
export const DISPUTE_ELIGIBLE_BOOKING_STATUSES = new Set<string>([
  'PENDING_CHECKIN',
  'CONFIRMED',
  'PARKING',
  'OVERTIME',
  'AWAITING_FINAL_PAYMENT',
  'COMPLETED',
  'REVIEWED',
  'CANCELLED',
])

export function isBookingEligibleForDispute(status: string | null | undefined): boolean {
  if (!status) return false
  return DISPUTE_ELIGIBLE_BOOKING_STATUSES.has(status)
}

