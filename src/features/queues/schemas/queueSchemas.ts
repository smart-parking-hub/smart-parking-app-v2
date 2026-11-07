import { z } from 'zod'

export const leaveQueueReasonOptions = [
  { value: 'CHANGED_PLAN', label: 'Thay đổi lộ trình / Kế hoạch giao nhận' },
  { value: 'WAIT_TOO_LONG', label: 'Thời gian chờ vượt quá dự kiến' },
  { value: 'FOUND_ALTERNATIVE', label: 'Đã tìm được bãi đỗ xe khác phù hợp hơn' },
  { value: 'EMERGENCY', label: 'Phương tiện gặp sự cố kỹ thuật khẩn cấp' },
  { value: 'OTHER', label: 'Lý do khác' },
] as const

export const leaveQueueSchema = z
  .object({
    reason: z.enum(
      ['CHANGED_PLAN', 'WAIT_TOO_LONG', 'FOUND_ALTERNATIVE', 'EMERGENCY', 'OTHER'],
      {
        required_error: 'Vui lòng chọn lý do rời hàng đợi',
      }
    ),
    customReason: z
      .string()
      .max(200, 'Lý do cụ thể không được vượt quá 200 ký tự')
      .optional()
      .or(z.literal('')),
    contactPhone: z
      .string()
      .regex(
        /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
        'Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)'
      )
      .optional()
      .or(z.literal('')),
    confirmCheckbox: z.boolean().refine((val) => val === true, {
      message: 'Vui lòng xác nhận bạn hiểu việc rời hàng sẽ mất lượt ưu tiên hiện tại',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.reason === 'OTHER' && (!data.customReason || data.customReason.trim().length < 5)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customReason'],
        message: 'Vui lòng nhập chi tiết lý do (tối thiểu 5 ký tự) khi chọn Lý do khác',
      })
    }
  })

export type LeaveQueueFormData = z.infer<typeof leaveQueueSchema>

export const queueFilterSchema = z.object({
  activeTab: z.enum(['ACTIVE', 'HISTORY']).default('ACTIVE'),
  searchKeyword: z.string().max(100, 'Từ khóa tìm kiếm tối đa 100 ký tự').default(''),
  statusFilter: z
    .enum(['ALL', 'CONVERTED', 'CANCELLED', 'EXPIRED', 'WAITING', 'NOTIFIED'])
    .default('ALL'),
})

export type QueueFilterFormData = z.infer<typeof queueFilterSchema>

