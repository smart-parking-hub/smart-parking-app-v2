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
  cash: number
  cashBookings: number
  /** Unified gross revenue before platform fee: transferGross + cash */
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

  const transferCount = usePeriodValues
    ? num(data.periodOnlineTransferCount) +
      num(data.periodCounterQrCount) +
      num(data.periodUnclassifiedTransferCount)
    : num(data.onlineTransferCount) +
      num(data.counterQrCount) +
      num(data.unclassifiedTransferCount)

  const channelNet = usePeriodValues
    ? num(data.periodOnlineTransferNetRevenue) +
      num(data.periodCounterQrNetRevenue) +
      num(data.periodUnclassifiedTransferNetRevenue)
    : num(data.onlineTransferNetRevenue) +
      num(data.counterQrNetRevenue) +
      num(data.unclassifiedTransferNetRevenue)

  const hasChannelNet = usePeriodValues
    ? hasAnyDefined(
        data.periodOnlineTransferNetRevenue,
        data.periodCounterQrNetRevenue,
        data.periodUnclassifiedTransferNetRevenue,
      ) && (channelNet !== 0 || transferCount > 0)
    : hasAnyDefined(
        data.onlineTransferNetRevenue,
        data.counterQrNetRevenue,
        data.unclassifiedTransferNetRevenue,
      ) && (channelNet !== 0 || transferCount > 0)

  const transferNet = usePeriodValues
    ? hasAnyDefined(data.periodTotalNetRevenue) &&
      (num(data.periodTotalNetRevenue) !== 0 || !hasChannelNet)
      ? num(data.periodTotalNetRevenue)
      : channelNet
    : hasChannelNet
      ? channelNet
      : num(data.totalNetRevenue)

  const channelGross = usePeriodValues
    ? num(data.periodOnlineTransferGrossRevenue) +
      num(data.periodCounterQrGrossRevenue) +
      num(data.periodUnclassifiedTransferGrossRevenue)
    : num(data.onlineTransferGrossRevenue) +
      num(data.counterQrGrossRevenue) +
      num(data.unclassifiedTransferGrossRevenue)

  const totalGrossField = usePeriodValues
    ? num(data.periodTotalGrossRevenue)
    : num(data.totalGrossRevenue)

  const explicitFeeField = usePeriodValues
    ? num(data.periodTotalPlatformFee)
    : num(data.totalPlatformFee)

  // Prefer explicit channel gross -> explicit total gross -> reconstructed (net + fee) -> fallback net (legacy mocks)
  let transferGross: number
  if (channelGross !== 0) {
    transferGross = channelGross
  } else if (totalGrossField !== 0) {
    transferGross = totalGrossField
  } else if (transferNet !== 0 && explicitFeeField !== 0) {
    transferGross = transferNet + explicitFeeField
  } else if (
    hasAnyDefined(
      usePeriodValues
        ? data.periodTotalGrossRevenue
        : data.totalGrossRevenue,
    ) &&
    transferNet === 0
  ) {
    transferGross = 0
  } else {
    transferGross = transferNet
  }

  const platformFee = usePeriodValues
    ? hasAnyDefined(data.periodTotalPlatformFee) &&
      (num(data.periodTotalPlatformFee) !== 0 ||
        transferGross === transferNet)
      ? num(data.periodTotalPlatformFee)
      : Math.max(0, transferGross - transferNet)
    : hasAnyDefined(data.totalPlatformFee) &&
        (num(data.totalPlatformFee) !== 0 || transferGross === transferNet)
      ? num(data.totalPlatformFee)
      : Math.max(0, transferGross - transferNet)

  return {
    transferGross,
    transferNet,
    platformFee,
    transferCount,
    cash,
    cashBookings,
    totalGrossCombined: transferGross + cash,
  }
}

export function resolveLotTransferGross(
  stats: LotRevenueBreakdown | undefined,
  usePeriodValues: boolean,
): number {
  if (!stats) return 0
  if (usePeriodValues) {
    const periodGross =
      num(stats.periodOnlineTransferGrossRevenue) +
      num(stats.periodCounterQrGrossRevenue) +
      num(stats.periodUnclassifiedTransferGrossRevenue)
    if (periodGross !== 0) return periodGross
    return (
      num(stats.periodOnlineTransferRevenue) +
      num(stats.periodCounterQrRevenue) +
      num(stats.periodUnclassifiedTransferRevenue)
    )
  }
  const allTimeGross =
    num(stats.onlineTransferGrossRevenue) +
    num(stats.counterQrGrossRevenue) +
    num(stats.unclassifiedTransferGrossRevenue)
  if (allTimeGross !== 0) return allTimeGross
  return (
    num(stats.onlineTransferRevenue) +
    num(stats.counterQrRevenue) +
    num(stats.unclassifiedTransferRevenue)
  )
}
