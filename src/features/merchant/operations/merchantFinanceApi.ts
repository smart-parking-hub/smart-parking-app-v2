import { z } from 'zod'
import { getData, type Page } from '@/shared/api/resources'
import type { Revenue, RevenueSeriesPoint } from '@/entities/operations'

export const revenueFiltersSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
    granularity: z.enum(['DAY', 'MONTH', 'YEAR']),
    parkingLotId: z.string().optional().default(''),
  })
  .refine(
    ({ startDate, endDate }) => !startDate || !endDate || endDate >= startDate,
    {
      path: ['endDate'],
      message: 'Ngày kết thúc phải từ ngày bắt đầu.',
    },
  )

export type RevenueFilters = z.infer<typeof revenueFiltersSchema>
export type RevenuePoint = RevenueSeriesPoint

export interface MerchantLotOption {
  id: number
  name: string
  address?: string | null
  status: string
}

export function groupRevenueSeries(
  points: RevenuePoint[],
  granularity: RevenueFilters['granularity'],
): RevenuePoint[] {
  const groups = new Map<string, RevenuePoint>()
  for (const point of points) {
    const period = point.period.slice(
      0,
      granularity === 'YEAR' ? 4 : granularity === 'MONTH' ? 7 : 10,
    )
    const group = groups.get(period) ?? {
      period,
      revenue: 0,
      bookingCount: 0,
      onlineTransferRevenue: 0,
      counterQrRevenue: 0,
      cashRevenue: 0,
      onlineTransferCount: 0,
      counterQrCount: 0,
      cashBookingCount: 0,
    }
    const online = point.onlineTransferRevenue ?? Math.max(0, point.revenue - (point.counterQrRevenue ?? 0))
    const counterQr = point.counterQrRevenue ?? 0
    const cash = point.cashRevenue ?? 0

    group.revenue += point.revenue
    group.bookingCount += point.bookingCount
    group.onlineTransferRevenue = (group.onlineTransferRevenue ?? 0) + online
    group.counterQrRevenue = (group.counterQrRevenue ?? 0) + counterQr
    group.cashRevenue = (group.cashRevenue ?? 0) + cash
    group.onlineTransferCount = (group.onlineTransferCount ?? 0) + (point.onlineTransferCount ?? 0)
    group.counterQrCount = (group.counterQrCount ?? 0) + (point.counterQrCount ?? 0)
    group.cashBookingCount = (group.cashBookingCount ?? 0) + (point.cashBookingCount ?? 0)
    groups.set(period, group)
  }
  return [...groups.values()].sort((a, b) => a.period.localeCompare(b.period))
}

export function getMerchantRevenue({
  startDate,
  endDate,
  parkingLotId,
}: Pick<RevenueFilters, 'startDate' | 'endDate' | 'parkingLotId'>) {
  // The current service returns daily points even for MONTH/YEAR; group those points locally.
  const params: Record<string, string | number | undefined> = {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    granularity: 'DAY',
  }
  if (parkingLotId && Number(parkingLotId) > 0) {
    params.parkingLotId = Number(parkingLotId)
  }
  return getData<Revenue>('/api/v1/merchant/revenue', params)
}

export function getMerchantLotsForRevenue() {
  return getData<Page<MerchantLotOption>>('/api/v1/merchant/parking-lots', {
    page: 0,
    size: 100,
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
  return getData<Page<MerchantLedgerEntry>>(
    '/api/v1/merchant/revenue/ledger',
    { page, size: 5 },
  )
}
