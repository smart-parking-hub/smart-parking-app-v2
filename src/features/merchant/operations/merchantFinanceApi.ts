import { z } from 'zod'
import { getData, type Page } from '@/shared/api/resources'
import type { Revenue } from '@/entities/operations'

export const revenueFiltersSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  granularity: z.enum(['DAY', 'MONTH', 'YEAR']),
}).refine(({ startDate, endDate }) => !startDate || !endDate || endDate >= startDate, {
  path: ['endDate'],
  message: 'Ngày kết thúc phải từ ngày bắt đầu.',
})

export type RevenueFilters = z.infer<typeof revenueFiltersSchema>
export type RevenuePoint = Revenue['series'][number]

export function groupRevenueSeries(points: RevenuePoint[], granularity: RevenueFilters['granularity']) {
  const groups = new Map<string, RevenuePoint>()
  for (const point of points) {
    const period = point.period.slice(0, granularity === 'YEAR' ? 4 : granularity === 'MONTH' ? 7 : 10)
    const group = groups.get(period) ?? { period, revenue: 0, bookingCount: 0 }
    group.revenue += point.revenue
    group.bookingCount += point.bookingCount
    groups.set(period, group)
  }
  return [...groups.values()].sort((a, b) => a.period.localeCompare(b.period))
}

export function getMerchantRevenue({ startDate, endDate }: Pick<RevenueFilters, 'startDate' | 'endDate'>) {
  // The current service returns daily points even for MONTH/YEAR; group those points locally.
  return getData<Revenue>('/api/v1/merchant/revenue', {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    granularity: 'DAY',
  })
}

export interface MerchantLedgerEntry {
  id: number
  bookingId: number | null
  entryType: string
  grossAmount: number
  feePercent: number
  feeAmount: number
  netAmount: number
  note: string | null
  createdAt: string
}

export const ledgerEntryLabels: Record<string, string> = {
  SETTLEMENT_CREDIT: 'Cộng doanh thu',
  WITHDRAWAL_HOLD: 'Giữ tiền rút',
  WITHDRAWAL_REFUND: 'Hoàn tiền rút',
  ADJUSTMENT: 'Điều chỉnh',
}

export function getMerchantLedger(page: number) {
  return getData<Page<MerchantLedgerEntry>>('/api/v1/merchant/revenue/ledger', { page, size: 20 })
}
