import { DepositStatements } from '@/features/deposit-statements'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Building2, Calendar } from 'lucide-react'
import { QueryState } from '@/shared/components/QueryState'
import { Select, type SelectOption } from '@/shared/components/Select'
import {
  Workspace,
  Panel,
  Notice,
  money,
  button,
} from '@/shared/components/Workspace'
import { MerchantRevenueChart } from '../components/MerchantRevenueChart'
import { MerchantWalletLedger } from '../components/MerchantWalletLedger'
import { MerchantChannelBreakdownCards } from '../components/MerchantChannelBreakdownCards'
import { MerchantRevenueByLotTable } from '../components/MerchantRevenueByLotTable'
import { MerchantDatePicker } from '../components/MerchantDatePicker'
import { resolveScopedRevenueMetrics } from '../components/merchantRevenueMetrics'
import {
  getMerchantLotsForRevenue,
  getMerchantRevenue,
  groupRevenueSeries,
  revenueFiltersSchema,
  type RevenueFilters,
} from './merchantFinanceApi'

const GRANULARITY_OPTIONS: SelectOption[] = [
  { value: 'DAY', label: 'Theo ngày' },
  { value: 'MONTH', label: 'Theo tháng' },
  { value: 'YEAR', label: 'Theo năm' },
]

export function MerchantRevenuePage() {
  const filters = useForm<RevenueFilters>({
    resolver: zodResolver(revenueFiltersSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      granularity: 'DAY',
      parkingLotId: '',
    },
  })
  const [range, setRange] = useState<RevenueFilters>(filters.getValues())

  const lotsQuery = useQuery({
    queryKey: ['merchant-revenue-lots'],
    queryFn: getMerchantLotsForRevenue,
    retry: false,
  })

  const query = useQuery({
    queryKey: [
      'merchant-revenue',
      {
        startDate: range.startDate,
        endDate: range.endDate,
        parkingLotId: range.parkingLotId || '',
      },
    ],
    queryFn: () => getMerchantRevenue(range),
    retry: false,
  })

  const lots = useMemo(
    () => (Array.isArray(lotsQuery.data?.content) ? lotsQuery.data.content : []),
    [lotsQuery.data?.content],
  )

  const lotSelectOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: `Tất cả bãi đỗ (${lots.length})` },
      ...lots.map((lot) => ({ value: String(lot.id), label: lot.name })),
    ],
    [lots],
  )

  const selectedLotId =
    range.parkingLotId && Number(range.parkingLotId) > 0
      ? Number(range.parkingLotId)
      : null
  const selectedLotName = lots.find((l) => l.id === selectedLotId)?.name
  const hasDateFilter = Boolean(range.startDate || range.endDate)
  const periodLabel = hasDateFilter
    ? `${range.startDate || '...'} → ${range.endDate || '...'}`
    : 'Toàn thời gian'

  const handleSelectLotFromTable = (lotId: number | null) => {
    const nextLotStr = lotId ? String(lotId) : ''
    filters.setValue('parkingLotId', nextLotStr)
    setRange((prev) => ({ ...prev, parkingLotId: nextLotStr }))
  }

  return (
    <Workspace
      title="Hiệu quả kinh doanh"
      eyebrow="FINANCE / REVENUE"
      description="Theo dõi doanh thu chuyển khoản, tiền mặt thu tại bãi, phí nền tảng và dòng tiền thực nhận theo từng bãi."
      actions={
        <Link className={button} to="/merchant/withdrawals">
          Ví &amp; Rút tiền →
        </Link>
      }
    >
      <Panel>
        <form
          className="flex flex-wrap lg:flex-nowrap items-end gap-4 w-full"
          onSubmit={filters.handleSubmit(setRange)}
        >
          <div className="flex flex-col min-w-0 gap-2 text-sm font-medium w-full sm:w-auto sm:min-w-[220px] lg:max-w-[440px]">
            <label htmlFor="revenue-lot-filter">Cơ sở bãi đỗ</label>
            <Controller
              name="parkingLotId"
              control={filters.control}
              render={({ field }) => (
                <Select
                  id="revenue-lot-filter"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  options={lotSelectOptions}
                  placeholder=""
                  prefixIcon={
                    <Building2
                      className="w-4 h-4 text-slate-400 shrink-0"
                      aria-hidden="true"
                    />
                  }
                  ariaLabel="Mở bộ lọc cơ sở bãi đỗ"
                  variant="default"
                  size="md"
                  dropdownClassName="w-full min-w-[260px]"
                />
              )}
            />
          </div>

          <Controller
            name="startDate"
            control={filters.control}
            render={({ field }) => (
              <MerchantDatePicker
                id="revenue-start-date"
                label="Từ ngày"
                value={field.value ?? ''}
                onChange={field.onChange}
                className="sm:w-auto sm:flex-1 sm:min-w-[155px]"
              />
            )}
          />

          <Controller
            name="endDate"
            control={filters.control}
            render={({ field }) => (
              <MerchantDatePicker
                id="revenue-end-date"
                label="Đến ngày"
                value={field.value ?? ''}
                onChange={field.onChange}
                hasError={Boolean(filters.formState.errors.endDate)}
                ariaDescribedBy={
                  filters.formState.errors.endDate
                    ? 'revenue-date-error'
                    : undefined
                }
                className="sm:w-auto sm:flex-1 sm:min-w-[155px]"
              />
            )}
          />

          <div className="flex flex-col min-w-0 gap-2 text-sm font-medium w-full sm:flex-1 sm:min-w-[155px]">
            <label htmlFor="revenue-granularity-filter">Nhóm thời gian</label>
            <Controller
              name="granularity"
              control={filters.control}
              render={({ field }) => (
                <Select
                  id="revenue-granularity-filter"
                  value={field.value}
                  onChange={(val) =>
                    field.onChange(val as RevenueFilters['granularity'])
                  }
                  options={GRANULARITY_OPTIONS}
                  placeholder=""
                  prefixIcon={
                    <Calendar
                      className="w-4 h-4 text-slate-400 shrink-0"
                      aria-hidden="true"
                    />
                  }
                  ariaLabel="Mở bộ lọc nhóm thời gian"
                  variant="default"
                  size="md"
                  dropdownClassName="w-full min-w-[180px]"
                />
              )}
            />
          </div>

          <button
            type="submit"
            className={`${button} h-[44px] shrink-0 px-6`}
          >
            Áp dụng
          </button>
          {filters.formState.errors.endDate && (
            <div id="revenue-date-error">
              <Notice error>{filters.formState.errors.endDate.message}</Notice>
            </div>
          )}
        </form>
      </Panel>

      <QueryState query={query}>
        {(data) => {
          const points = groupRevenueSeries(data.series ?? [], range.granularity)
          const periodTransferChartRevenue = points.reduce(
            (sum, point) => sum + point.revenue,
            0,
          )
          const periodCashChartRevenue = points.reduce(
            (sum, point) => sum + (point.cashRevenue ?? 0),
            0,
          )

          const metrics = resolveScopedRevenueMetrics(data, hasDateFilter)
          const scopedCashRevenue = metrics.cash
          const scopedCashBookings = metrics.cashBookings
          const scopedTransferGross = metrics.transferGross
          const scopedTransferNet = metrics.transferNet
          const scopedPlatformFee = metrics.platformFee
          const scopedCombinedRevenue = metrics.totalGrossCombined
          const transferCount = metrics.transferCount

          const scopeLabel = selectedLotName
            ? selectedLotName
            : `Tất cả bãi đỗ (${lots.length})`

          return (
            <>
              {/* Uniform 5-Card KPI Strip: Cards 1-4 share exact lot + date scope & gross/net basis; Card 5 explicitly labeled account-wide wallet balance */}
              <div
                data-testid="merchant-revenue-kpis"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              >
                <Panel>
                  <p className="text-xs text-brand-muted">
                    {hasDateFilter
                      ? 'Tổng Doanh thu trong kỳ (trước phí)'
                      : 'Tổng Doanh thu (trước phí)'}
                  </p>
                  <p
                    data-testid="revenue-kpi-total-value"
                    className="mt-3 font-sora text-2xl font-bold tabular-nums"
                  >
                    {money(scopedCombinedRevenue)}
                  </p>
                </Panel>

                <Panel>
                  <p className="text-xs text-brand-muted">
                    {hasDateFilter
                      ? 'Tiền mặt thu tại bãi (trong kỳ)'
                      : 'Tiền mặt thu tại bãi'}
                  </p>
                  <p
                    data-testid="revenue-kpi-cash-value"
                    className="mt-3 font-sora text-2xl font-bold tabular-nums"
                  >
                    {money(scopedCashRevenue)}
                  </p>
                </Panel>

                <Panel>
                  <p className="text-xs text-brand-muted">
                    {hasDateFilter
                      ? 'Thực nhận chuyển khoản trong kỳ (sau phí)'
                      : 'Thực nhận chuyển khoản (sau phí)'}
                  </p>
                  <p
                    data-testid="revenue-kpi-net-value"
                    className="mt-3 font-sora text-2xl font-bold tabular-nums"
                  >
                    {money(scopedTransferNet)}
                  </p>
                </Panel>

                <Panel>
                  <p className="text-xs text-brand-muted">
                    {hasDateFilter ? 'Phí nền tảng (trong kỳ)' : 'Phí nền tảng'}
                  </p>
                  <p
                    data-testid="revenue-kpi-fee-value"
                    className="mt-3 font-sora text-2xl font-bold tabular-nums"
                  >
                    {money(scopedPlatformFee)}
                  </p>
                </Panel>

                <Panel>
                  <p className="text-xs text-brand-muted">
                    Số dư ví khả dụng (Toàn tài khoản)
                  </p>
                  <p
                    data-testid="revenue-kpi-wallet-value"
                    className="mt-3 font-sora text-2xl font-bold tabular-nums"
                  >
                    {money(data.currentWalletBalance)}
                  </p>
                </Panel>
              </div>

              {/* All Lots -> show Per-Lot Breakdown Table ONLY; Specific Lot -> show Channel Breakdown + Revenue Rhythm ONLY */}
              {selectedLotId === null ? (
                lots.length > 0 && (
                  <MerchantRevenueByLotTable
                    lots={lots}
                    breakdowns={data.revenueByParkingLot ?? []}
                    selectedLotId={selectedLotId}
                    onSelectLot={handleSelectLotFromTable}
                    usePeriodValues={hasDateFilter}
                    useGrossTransfer={true}
                    periodLabel={periodLabel}
                  />
                )
              ) : (
                <>
                  <MerchantChannelBreakdownCards
                    transferAmount={scopedTransferGross}
                    transferCount={transferCount}
                    cashAmount={scopedCashRevenue}
                    cashBookingCount={scopedCashBookings}
                    scopeLabel={scopeLabel}
                    periodLabel={periodLabel}
                  />

                  <Panel title="Nhịp doanh thu">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <p>
                          Chuyển khoản (sau phí) trong kỳ:{' '}
                          <strong>{money(periodTransferChartRevenue)}</strong>
                        </p>
                        <p className="text-[#d95f00]">
                          Tiền mặt trong kỳ:{' '}
                          <strong>{money(periodCashChartRevenue)}</strong>
                        </p>
                        <p>
                          Tổng thực thu trong kỳ:{' '}
                          <strong>
                            {money(
                              periodTransferChartRevenue +
                                periodCashChartRevenue,
                            )}
                          </strong>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectLotFromTable(null)}
                        className="font-mono text-xs font-semibold text-[#d95f00] hover:underline cursor-pointer"
                      >
                        ← Xem tất cả bãi đỗ
                      </button>
                    </div>
                    {points.length > 0 && (
                      <p className="mb-4 text-xs text-brand-muted">
                        Kỳ hiển thị: {points[0].period} →{' '}
                        {points[points.length - 1].period}
                        {selectedLotName ? ` · Bãi: ${selectedLotName}` : ''}
                      </p>
                    )}
                    <MerchantRevenueChart points={points} />
                  </Panel>
                </>
              )}
            </>
          )
        }}
      </QueryState>

      <MerchantWalletLedger />
      <DepositStatements scope="merchant" />
    </Workspace>
  )
}
