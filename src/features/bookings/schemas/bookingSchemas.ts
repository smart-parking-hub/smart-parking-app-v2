import { z } from 'zod'

export const cancelBookingSchema = z.object({
  reason: z
    .string()
    .min(1, 'Vui lòng chọn hoặc nhập lý do hủy đặt chỗ')
    .max(200, 'Lý do hủy không được vượt quá 200 ký tự'),
  contactPhone: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại liên hệ không hợp lệ (VD: 0912345678)')
    .optional()
    .or(z.literal('')),
  preferredResolution: z
    .enum(['REFUND_WALLET', 'REFUND_BANK', 'DISPUTE_SUPPORT'], {
      invalid_type_error: 'Phương thức hoàn cọc không hợp lệ',
    })
    .default('REFUND_WALLET'),
  bankAccount: z
    .string()
    .max(50, 'Số tài khoản không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  note: z
    .string()
    .max(500, 'Ghi chú bổ sung không vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
})

export type CancelBookingFormData = z.infer<typeof cancelBookingSchema>

export const reviewBookingSchema = z.object({
  bookingId: z.number().int().positive('Mã đặt chỗ không hợp lệ'),
  rating: z
    .number({ invalid_type_error: 'Vui lòng chọn số sao đánh giá' })
    .int()
    .min(1, 'Đánh giá tối thiểu 1 sao')
    .max(5, 'Đánh giá tối đa 5 sao'),
  comment: z
    .string()
    .max(500, 'Nội dung đánh giá không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
})

export type ReviewBookingFormData = z.infer<typeof reviewBookingSchema>

export const bookingFilterSchema = z.object({
  activeTab: z.enum(['ALL', 'ACTIVE', 'PENDING_PAYMENT', 'COMPLETED', 'CANCELLED']),
  searchKeyword: z.string().max(100, 'Từ khóa tìm kiếm tối đa 100 ký tự'),
})

export type BookingFilterFormData = z.infer<typeof bookingFilterSchema>

