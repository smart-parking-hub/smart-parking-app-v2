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

export function computeDateRange(timeRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'): {
  startDate?: string
  endDate?: string
} {
  if (timeRange === 'ALL') {
    return {}
  }

  const now = new Date()
  const formatDate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const endDate = formatDate(now)

  if (timeRange === 'TODAY') {
    return { startDate: endDate, endDate }
  }

  if (timeRange === 'WEEK') {
    const past = new Date(now)
    past.setDate(past.getDate() - 6)
    return { startDate: formatDate(past), endDate }
  }

  if (timeRange === 'MONTH') {
    const past = new Date(now)
    past.setDate(past.getDate() - 29)
    return { startDate: formatDate(past), endDate }
  }

  return {}
}
