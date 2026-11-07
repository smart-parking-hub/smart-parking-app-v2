import { z } from 'zod'
import { getData } from '@/shared/api/resources'
export const paymentTypeLabels = { DEPOSIT: 'Cọc giữ chỗ', FINAL_PAYMENT: 'Thanh toán cuối', PENALTY: 'Phí phạt', REFUND: 'Hoàn tiền' } as const
export const paymentStatusLabels = { PENDING: 'Chờ thanh toán', SUCCESS: 'Thành công', FAILED: 'Thất bại', REFUNDED: 'Đã hoàn tiền', REQUIRES_REVIEW: 'Cần đối soát' } as const
const paymentSchema = z.object({
  id: z.number().int().positive(), bookingId: z.number().int().positive(), parkingLotId: z.number().int().positive().nullish(),
  gateway: z.string(), transactionCode: z.string().nullish(), orderCode: z.number().nullish(),
  amount: z.union([z.number(), z.string().trim().min(1)]).pipe(z.coerce.number().finite().nonnegative()),
  type: z.enum(['DEPOSIT', 'FINAL_PAYMENT', 'PENALTY', 'REFUND']),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'REQUIRES_REVIEW']),
  createdAt: z.string().nullish(),
})
const pageSchema = z.object({ content: z.array(paymentSchema), currentPage: z.number().int().nonnegative(), totalPages: z.number().int().nonnegative(), totalElements: z.number().int().nonnegative() })
export type PaymentRecord = z.infer<typeof paymentSchema>
export async function fetchPaymentPage(page: number) {
  return pageSchema.parse(await getData<unknown>('/api/v1/payments', { page, size: 20, sort: 'id,desc' }))
}
export const paymentMoney = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
export function paymentTime(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(/(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+07:00`)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}
