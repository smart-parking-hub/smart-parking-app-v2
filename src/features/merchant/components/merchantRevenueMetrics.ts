import type { LotRevenueBreakdown } from '@/entities/operations'

export interface ScopedRevenueInput {
  totalGrossRevenue?: number | null
  totalPlatformFee?: number | null
  totalNetRevenue?: number | null
  periodTotalGrossRevenue?: number | null
  periodTotalPlatformFee?: number | null
  periodTotalNetRevenue?: number | null
  onlineTransferGrossRevenue?: number | null
  onlineTransferNetRevenue?: number | null
  onlineTransferCount?: number | null
  periodOnlineTransferGrossRevenue?: number | null
  periodOnlineTransferNetRevenue?: number | null
  periodOnlineTransferCount?: number | null
  counterQrGrossRevenue?: number | null
  counterQrNetRevenue?: number | null
  counterQrCount?: number | null
  periodCounterQrGrossRevenue?: number | null
  periodCounterQrNetRevenue?: number | null
  periodCounterQrCount?: number | null
  unclassifiedTransferGrossRevenue?: number | null
  unclassifiedTransferNetRevenue?: number | null
  unclassifiedTransferCount?: number | null
  periodUnclassifiedTransferGrossRevenue?: number | null
  periodUnclassifiedTransferNetRevenue?: number | null
  periodUnclassifiedTransferCount?: number | null
  totalCashRevenue?: number | null
  totalCashBookings?: number | null
  periodCashRevenue?: number | null
  periodCashBookings?: number | null
}

export interface ScopedRevenueMetrics {
  transferGross: number
  transferNet: number
  platformFee: number
  transferCount: number
  unclassifiedGross: number
  unclassifiedNet: number
  unclassifiedCount: number
  cash: number
  cashBookings: number
  /** Unified gross revenue before platform fee: transferGross + unclassifiedGross + cash */
  totalGrossCombined: number
}

const num = (v: number | null | undefined): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : 0

const hasAnyDefined = (...values: Array<number | null | undefined>): boolean =>
  values.some((v) => typeof v === 'number' && Number.isFinite(v))

/**
 * Single source of truth for scoped merchant revenue metrics shared by
 * MerchantDashboardPage and MerchantRevenuePage so both screens always display
 * identical figures for the same payload, lot, and period filter.
 */
export function resolveScopedRevenueMetrics(
  data: ScopedRevenueInput,
  usePeriodValues: boolean,
): ScopedRevenueMetrics {
  const cash = usePeriodValues
    ? num(data.periodCashRevenue)
    : num(data.totalCashRevenue)
  const cashBookings = usePeriodValues
    ? num(data.periodCashBookings)
    : num(data.totalCashBookings)

  // PR #103 F-01: Isolate identified transfer channels from legacy unclassified transactions
  const transferCount = usePeriodValues
    ? num(data.periodOnlineTransferCount) + num(data.periodCounterQrCount)
    : num(data.onlineTransferCount) + num(data.counterQrCount)

  const unclassifiedCount = usePeriodValues
    ? num(data.periodUnclassifiedTransferCount)
    : num(data.unclassifiedTransferCount)

  const unclassifiedNet = usePeriodValues
    ? num(data.periodUnclassifiedTransferNetRevenue)
    : num(data.unclassifiedTransferNetRevenue)

  const unclassifiedGross = usePeriodValues
    ? num(data.periodUnclassifiedTransferGrossRevenue)
    : num(data.unclassifiedTransferGrossRevenue)

  const identifiedChannelNet = usePeriodValues
    ? num(data.periodOnlineTransferNetRevenue) +
      num(data.periodCounterQrNetRevenue)
    : num(data.onlineTransferNetRevenue) +
      num(data.counterQrNetRevenue)

  const hasIdentifiedChannelNet = usePeriodValues
    ? hasAnyDefined(
        data.periodOnlineTransferNetRevenue,
        data.periodCounterQrNetRevenue,
      )
    : hasAnyDefined(
        data.onlineTransferNetRevenue,
        data.counterQrNetRevenue,
      )

  const hasExplicitTotalNet = hasAnyDefined(
    usePeriodValues ? data.periodTotalNetRevenue : data.totalNetRevenue,
  )
  const totalNetField = usePeriodValues
    ? num(data.periodTotalNetRevenue)
    : num(data.totalNetRevenue)

  const transferNet = hasIdentifiedChannelNet
    ? identifiedChannelNet
    : hasExplicitTotalNet
      ? Math.max(0, totalNetField - unclassifiedNet)
      : 0

  const hasIdentifiedChannelGross = usePeriodValues
    ? hasAnyDefined(
        data.periodOnlineTransferGrossRevenue,
        data.periodCounterQrGrossRevenue,
      )
    : hasAnyDefined(
        data.onlineTransferGrossRevenue,
        data.counterQrGrossRevenue,
      )

  const identifiedChannelGross = usePeriodValues
    ? num(data.periodOnlineTransferGrossRevenue) +
      num(data.periodCounterQrGrossRevenue)
    : num(data.onlineTransferGrossRevenue) +
      num(data.counterQrGrossRevenue)

  const hasExplicitTotalGross = hasAnyDefined(
    usePeriodValues ? data.periodTotalGrossRevenue : data.totalGrossRevenue,
  )
  const totalGrossField = usePeriodValues
    ? num(data.periodTotalGrossRevenue)
    : num(data.totalGrossRevenue)

  const hasExplicitFee = hasAnyDefined(
    usePeriodValues ? data.periodTotalPlatformFee : data.totalPlatformFee,
  )
  const explicitFeeField = usePeriodValues
    ? num(data.periodTotalPlatformFee)
    : num(data.totalPlatformFee)

  let transferGross: number
  if (hasIdentifiedChannelGross) {
    transferGross = identifiedChannelGross
  } else if (hasExplicitTotalGross) {
    transferGross = Math.max(0, totalGrossField - unclassifiedGross)
  } else if (hasExplicitFee && transferNet !== 0) {
    transferGross = transferNet + explicitFeeField
  } else {
    transferGross = transferNet
  }

  const platformFee = hasExplicitFee
    ? explicitFeeField
    : Math.max(0, transferGross + unclassifiedGross - (transferNet + unclassifiedNet))

  return {
    transferGross,
    transferNet,
    platformFee,
    transferCount,
    unclassifiedGross,
    unclassifiedNet,
    unclassifiedCount,
    cash,
    cashBookings,
    totalGrossCombined: transferGross + unclassifiedGross + cash,
  }
}

export function resolveLotTransferGross(
  stats: LotRevenueBreakdown | undefined,
  usePeriodValues: boolean,
): number {
  if (!stats) return 0
  if (usePeriodValues) {
    if (
      hasAnyDefined(
        stats.periodOnlineTransferGrossRevenue,
        stats.periodCounterQrGrossRevenue,
        stats.periodUnclassifiedTransferGrossRevenue,
      )
    ) {
      return (
        num(stats.periodOnlineTransferGrossRevenue) +
        num(stats.periodCounterQrGrossRevenue) +
        num(stats.periodUnclassifiedTransferGrossRevenue)
      )
    }
    return (
      num(stats.periodOnlineTransferRevenue) +
      num(stats.periodCounterQrRevenue) +
      num(stats.periodUnclassifiedTransferRevenue)
    )
  }
  if (
    hasAnyDefined(
      stats.onlineTransferGrossRevenue,
      stats.counterQrGrossRevenue,
      stats.unclassifiedTransferGrossRevenue,
    )
  ) {
    return (
      num(stats.onlineTransferGrossRevenue) +
      num(stats.counterQrGrossRevenue) +
      num(stats.unclassifiedTransferGrossRevenue)
    )
  }
  return (
    num(stats.onlineTransferRevenue) +
    num(stats.counterQrRevenue) +
    num(stats.unclassifiedTransferRevenue)
  )
}
