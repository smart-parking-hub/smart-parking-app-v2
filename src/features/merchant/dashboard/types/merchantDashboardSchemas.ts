import { z } from 'zod'

export const merchantDashboardFilterSchema = z.object({
  parkingLotId: z.number().nullable().optional(),
  timeRange: z
    .enum(['ALL', 'TODAY', 'WEEK', 'MONTH'], {
      errorMap: () => ({ message: 'Vui lòng chọn khoảng thời gian hợp lệ' }),
    })
    .default('ALL'),
})

export type MerchantDashboardFilterValues = z.infer<
  typeof merchantDashboardFilterSchema
>

