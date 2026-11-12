import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Filter, RotateCcw } from 'lucide-react'
import { SearchField } from '@/shared/components/SearchField'
import { Select, type SelectOption } from '@/shared/components/Select'
import {
  merchantBookingsFilterSchema,
  type MerchantBookingsFilterFormData,
} from '../schemas/merchantBookingsSchemas'
import {
  ALL_STATUS_FILTER_OPTIONS,
  PRIMARY_STATUS_TABS,
  type MerchantBookingLotOption,
  type MerchantBookingStatusCounts,
  type MerchantBookingStatusFilter,
} from '../types/merchantBookingsTypes'

interface MerchantBookingsFilterBarProps {
  statusFilter: MerchantBookingStatusFilter
  onStatusFilterChange: (status: MerchantBookingStatusFilter) => void
  parkingLotId: number | null
  onParkingLotIdChange: (lotId: number | null) => void
  searchKeyword: string
  onSearchKeywordChange: (keyword: string) => void
  onResetFilters: () => void
  lotOptions: MerchantBookingLotOption[]
  statusCounts: MerchantBookingStatusCounts
  displayedCount: number
  totalMatchedCount: number
}

export function MerchantBookingsFilterBar({
  statusFilter,
  onStatusFilterChange,
  parkingLotId,
  onParkingLotIdChange,
  searchKeyword,
  onSearchKeywordChange,
  onResetFilters,
  lotOptions,
  statusCounts,
  displayedCount,
  totalMatchedCount,
}: MerchantBookingsFilterBarProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MerchantBookingsFilterFormData>({
    resolver: zodResolver(merchantBookingsFilterSchema),
    mode: 'onChange',
    defaultValues: {
      statusFilter,
      parkingLotId,
      searchKeyword,
    },
  })

  useEffect(() => {
    reset({ statusFilter, parkingLotId, searchKeyword })
  }, [statusFilter, parkingLotId, searchKeyword, reset])

  const hasActiveFilter =
    statusFilter !== 'ALL' || parkingLotId !== null || searchKeyword.trim().length > 0

  const selectedLotOption = lotOptions.find((lot) => lot.id === parkingLotId)

  const lotSelectOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: '',
        label: `Tất cả bãi đỗ (${lotOptions.length > 0 ? `${lotOptions.length} bãi` : 'toàn hệ thống'})`,
      },
      ...lotOptions.map((lot) => ({
        value: String(lot.id),
        label: lot.name,
      })),
    ],
    [lotOptions],
  )

  const statusSelectOptions = useMemo<SelectOption[]>(
    () =>
      ALL_STATUS_FILTER_OPTIONS.map((option) => ({
        value: option.value,
        label: option.shortLabel,
        badge: option.badge,
      })),
    [],
  )

  const handleValidSearchSubmit = (data: MerchantBookingsFilterFormData) => {
    onSearchKeywordChange(data.searchKeyword)
  }

  return (
    <div
      aria-label="Bộ lọc đơn đặt chỗ"
      className="rounded-t-2xl border-b border-slate-100 bg-white px-4 py-3.5 flex flex-col gap-3"
    >
      {/* Row 1: Search Field + Custom Styled Selects (Parking Lot & Detailed Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
        <form
          onSubmit={handleSubmit(handleValidSearchSubmit)}
          className="lg:col-span-5 flex flex-col"
          noValidate
        >
          <Controller
            name="searchKeyword"
            control={control}
            render={({ field }) => (
              <SearchField
                id="merchant-bookings-search-input"
                value={field.value}
                onChange={(val) => {
                  field.onChange(val)
                  if (val.trim().length <= 100) {
                    onSearchKeywordChange(val)
                  }
                }}
                onSearch={(val) => {
                  if (val.trim().length <= 100) {
                    onSearchKeywordChange(val)
                  }
                }}
                onClear={() => {
                  setValue('searchKeyword', '', { shouldValidate: true })
                  onSearchKeywordChange('')
                }}
                placeholder="Tìm mã đơn, biển số xe hoặc bãi đỗ..."
                aria-label="Tìm kiếm đơn đặt chỗ"
                size="md"
              />
            )}
          />
          {errors.searchKeyword && (
            <p role="alert" className="mt-1 text-xs font-medium text-rose-600">
              {errors.searchKeyword.message}
            </p>
          )}
        </form>

        <div className="lg:col-span-4 min-w-0">
          <label htmlFor="merchant-bookings-lot-filter" className="sr-only">
            Lọc theo bãi đỗ
          </label>
          <Controller
            name="parkingLotId"
            control={control}
            render={({ field }) => (
              <Select
                id="merchant-bookings-lot-filter"
                value={field.value ? String(field.value) : ''}
                onChange={(val) => {
                  const parsed = val ? Number(val) : null
                  const normalized =
                    typeof parsed === 'number' && Number.isFinite(parsed) && parsed > 0
                      ? parsed
                      : null
                  field.onChange(normalized)
                  onParkingLotIdChange(normalized)
                }}
                options={lotSelectOptions}
                placeholder=""
                prefixIcon={
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                }
                ariaLabel="Mở bộ lọc bãi đỗ"
                variant="default"
                size="md"
                dropdownClassName="w-full min-w-[260px]"
              />
            )}
          />
        </div>

        <div className="lg:col-span-3 min-w-0">
          <label htmlFor="merchant-bookings-status-select" className="sr-only">
            Lọc theo trạng thái chi tiết
          </label>
          <Controller
            name="statusFilter"
            control={control}
            render={({ field }) => (
              <Select
                id="merchant-bookings-status-select"
                value={field.value}
                onChange={(val) => {
                  const next = val as MerchantBookingStatusFilter
                  field.onChange(next)
                  onStatusFilterChange(next)
                }}
                options={statusSelectOptions}
                placeholder=""
                prefixIcon={
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                }
                ariaLabel="Mở bộ lọc trạng thái chi tiết"
                variant="default"
                size="md"
                dropdownClassName="w-full min-w-[260px] lg:left-auto lg:right-0"
              />
            )}
          />
        </div>
      </div>

      {/* Row 2: Quick Status Tabs (Reflecting All Matching Records Above, Never Capped by Per-Page 5) */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5">
        <div
          role="tablist"
          aria-label="Bộ lọc trạng thái"
          className="inline-flex flex-wrap gap-1 self-start rounded-xl border border-slate-200 bg-slate-100/80 p-1"
        >
          {PRIMARY_STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.id]
            const isSelected = statusFilter === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                data-status-tab={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/70'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-mono font-bold tabular-nums ${
                    isSelected
                      ? 'bg-orange-100 text-[#9e4300]'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Inline Active Filter Helper Strip */}
        {hasActiveFilter && (
          <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-orange-50/60 border border-orange-100 px-3 py-1.5 text-xs text-slate-600">
            <span>
              Đang hiển thị <strong className="text-[#d95f00] tabular-nums">{displayedCount}</strong> /{' '}
              <strong className="text-slate-900 tabular-nums">{totalMatchedCount}</strong> đơn phù hợp
              {selectedLotOption && (
                <>
                  {' · '}Bãi đỗ: <strong className="text-slate-900">{selectedLotOption.name}</strong>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 font-semibold text-[#9e4300] hover:text-[#d95f00] cursor-pointer focus-visible:outline-none focus-visible:underline"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

