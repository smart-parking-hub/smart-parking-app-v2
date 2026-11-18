import { z } from 'zod'
import { getData } from '@/shared/api/resources'

const amount = z.number().finite()
const nonNegInt = z.number().int().nonnegative()
const optAmount = amount.nullish().transform((v) => v ?? 0)
const optCount = nonNegInt.nullish().transform((v) => v ?? 0)

const page = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    content: z.array(item),
    totalElements: z.number().int().nonnegative(),
  })

const seriesPointSchema = z.object({
  period: z.string(),
  revenue: amount,
  bookingCount: amount,
  onlineTransferRevenue: optAmount,
  counterQrRevenue: optAmount,
  cashRevenue: optAmount,
  onlineTransferCount: optCount,
  counterQrCount: optCount,
  cashBookingCount: optCount,
})

const lotBreakdownSchema = z.object({
  parkingLotId: z.number().int(),
  onlineTransferGrossRevenue: optAmount,
  onlineTransferRevenue: optAmount,
  onlineTransferCount: optCount,
  counterQrGrossRevenue: optAmount,
  counterQrRevenue: optAmount,
  counterQrCount: optCount,
  cashRevenue: optAmount,
  cashBookingCount: optCount,
  periodOnlineTransferRevenue: optAmount,
  periodOnlineTransferCount: optCount,
  periodCounterQrRevenue: optAmount,
  periodCounterQrCount: optCount,
  periodCashRevenue: optAmount,
  periodCashBookingCount: optCount,
})

const revenueSchema = z.object({
  totalNetRevenue: amount,
  totalGrossRevenue: optAmount,
  totalPlatformFee: optAmount,
  currentWalletBalance: amount,
  completedBookings: z.number().int().nullish(),
  onlineTransferGrossRevenue: optAmount,
  onlineTransferNetRevenue: optAmount,
  onlineTransferCount: optCount,
  periodOnlineTransferNetRevenue: optAmount,
  periodOnlineTransferCount: optCount,
  counterQrGrossRevenue: optAmount,
  counterQrNetRevenue: optAmount,
  counterQrCount: optCount,
  periodCounterQrNetRevenue: optAmount,
  periodCounterQrCount: optCount,
  totalCashRevenue: optAmount,
  totalCashBookings: optCount,
  periodCashRevenue: optAmount,
  periodCashBookings: optCount,
  revenueByParkingLot: z
    .array(lotBreakdownSchema)
    .nullish()
    .transform((v) => v ?? []),
  series: z.array(seriesPointSchema),
})

const lotSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().nullish(),
  status: z.string(),
})

const bookingSchema = z.object({
  id: z.number(),
  bookingCode: z.string(),
  vehicleLicensePlate: z.string().nullish(),
  parkingLotName: z.string().nullish(),
  status: z.string(),
})

export async function fetchRevenueStats(
  parkingLotId?: number | null,
  startDate?: string,
  endDate?: string,
) {
  const raw = await getData<unknown>('/api/v1/merchant/revenue', {
    parkingLotId: parkingLotId ?? undefined,
    startDate,
    endDate,
    granularity: 'DAY',
  })
  return revenueSchema.parse(raw)
}

export async function fetchMerchantDashboardData(
  startDate?: string,
  endDate?: string,
) {
  const revenueParams =
    startDate || endDate
      ? { startDate, endDate, granularity: 'DAY' }
      : undefined

  const [revenue, lots, bookings] = await Promise.all([
    getData<unknown>('/api/v1/merchant/revenue', revenueParams),
    getData<unknown>('/api/v1/merchant/parking-lots', { page: 0, size: 50 }),
    getData<unknown>('/api/v1/merchant/bookings', {
      page: 0,
      size: 5,
      sort: 'createdAt,desc',
    }),
  ])
  return {
    revenue: revenueSchema.parse(revenue),
    lots: page(lotSchema).parse(lots),
    bookings: page(bookingSchema).parse(bookings),
  }
}
