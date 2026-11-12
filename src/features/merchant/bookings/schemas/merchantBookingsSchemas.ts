import { z } from 'zod'
import { BOOKING_STATUS_VALUES } from '../types/merchantBookingsTypes'

export const merchantBookingsStatusFilterValues = ['ALL', ...BOOKING_STATUS_VALUES] as const

export const merchantBookingsFilterSchema = z.object({
  statusFilter: z.enum(merchantBookingsStatusFilterValues),
  parkingLotId: z.number().int().positive().nullable(),
  searchKeyword: z
    .string()
    .trim()
    .max(100, 'Từ khóa tìm kiếm tối đa 100 ký tự'),
})

export type MerchantBookingsFilterFormData = z.infer<typeof merchantBookingsFilterSchema>

