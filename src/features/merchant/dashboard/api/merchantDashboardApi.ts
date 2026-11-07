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
