import { z } from 'zod'
import { getData } from '@/shared/api/resources'

const amount = z.number().finite()
const page = <T extends z.ZodTypeAny>(item: T) => z.object({
  content: z.array(item), totalElements: z.number().int().nonnegative(),
})
const revenueSchema = z.object({
  totalNetRevenue: amount, currentWalletBalance: amount,
  series: z.array(z.object({ period: z.string(), revenue: amount, bookingCount: amount })),
})
const lotSchema = z.object({ id: z.number(), name: z.string(), address: z.string().nullish(), status: z.string() })
const bookingSchema = z.object({
  id: z.number(), bookingCode: z.string(), vehicleLicensePlate: z.string().nullish(),
  parkingLotName: z.string().nullish(), status: z.string(),
})

export async function fetchRevenueStats(
  parkingLotId?: number | null,
  startDate?: string,
  endDate?: string,
) {
  if (parkingLotId) {
    const raw = await getData<unknown>(`/api/v1/merchant/parking-lots/${parkingLotId}/revenue`, {
      startDate,
      endDate,
    })
    const lotRevenueSchema = z.object({
      totalRevenue: amount.nullish(),
      completedBookings: z.number().int().nullish(),
      series: z.array(z.object({ period: z.string(), revenue: amount, bookingCount: amount })).nullish(),
    })
    const parsed = lotRevenueSchema.parse(raw)

    if (parsed.series && parsed.series.length > 0) {
      return {
        totalNetRevenue: parsed.totalRevenue ?? 0,
        totalGrossRevenue: parsed.totalRevenue ?? 0,
        currentWalletBalance: 0,
        series: parsed.series,
      }
    }

    // Connect to payment-service to get the real financial series and revenue for this lot
    try {
      const paymentRaw = await getData<unknown>('/api/v1/merchant/revenue', {
        parkingLotId,
        startDate,
        endDate,
        granularity: 'DAY',
      })
      const paymentParsed = revenueSchema.parse(paymentRaw)
      if (paymentParsed.series && paymentParsed.series.length > 0) {
        return paymentParsed
      }
      if (paymentParsed.totalNetRevenue > 0) {
        return paymentParsed
      }
    } catch {
      // ignore fallback error
    }

    return {
      totalNetRevenue: parsed.totalRevenue ?? 0,
      totalGrossRevenue: parsed.totalRevenue ?? 0,
      currentWalletBalance: 0,
      series: parsed.series ?? [],
    }
  }

  const raw = await getData<unknown>('/api/v1/merchant/revenue', {
    startDate,
    endDate,
    granularity: 'DAY',
  })
  return revenueSchema.parse(raw)
}

export async function fetchMerchantDashboardData() {
  const [revenue, lots, bookings] = await Promise.all([
    getData<unknown>('/api/v1/merchant/revenue'),
    getData<unknown>('/api/v1/merchant/parking-lots', { page: 0, size: 5 }),
    getData<unknown>('/api/v1/merchant/bookings', { page: 0, size: 5, sort: 'createdAt,desc' }),
  ])
  return {
    revenue: revenueSchema.parse(revenue),
    lots: page(lotSchema).parse(lots),
    bookings: page(bookingSchema).parse(bookings),
  }
}
