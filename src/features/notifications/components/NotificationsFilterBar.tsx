import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCcw } from 'lucide-react'
import { SearchField } from '@/shared/components/SearchField'
import {
  notificationFilterSchema,
  type NotificationFilterFormData,
} from '../schemas/notificationSchemas'
import type {
  NotificationStatusFilter,
  NotificationTypeFilter,
} from '../types/notificationTypes'

interface NotificationsFilterBarProps {
  statusFilter: NotificationStatusFilter
  onStatusFilterChange: (status: NotificationStatusFilter) => void
  typeFilter: NotificationTypeFilter
  onTypeFilterChange: (type: NotificationTypeFilter) => void
  searchKeyword: string
  onSearchKeywordChange: (keyword: string) => void
  onResetFilters: () => void
  serverTotalCount: number
  pageTotalCount: number
  unreadCount: number
  matchedCount: number
}

const TYPE_CHIPS: Array<{ value: NotificationTypeFilter; label: string }> = [
  { value: 'ALL', label: 'Tất cả sự kiện' },
  { value: 'BOOKING', label: 'Đặt chỗ & Barie' },
  { value: 'PAYMENT', label: 'Thanh toán & Cước' },
  { value: 'QUEUE', label: 'Hàng đợi ảo' },
  { value: 'SYSTEM', label: 'Hệ thống & Cảnh báo' },
]

export function NotificationsFilterBar({
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  searchKeyword,
  onSearchKeywordChange,
  onResetFilters,
  serverTotalCount,
  pageTotalCount,
  unreadCount,
  matchedCount,
}: NotificationsFilterBarProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NotificationFilterFormData>({
    resolver: zodResolver(notificationFilterSchema),
    mode: 'onChange',
    defaultValues: {
      statusFilter,
      typeFilter,
      searchKeyword,
    },
  })

  useEffect(() => {
    reset({ statusFilter, typeFilter, searchKeyword })
  }, [statusFilter, typeFilter, searchKeyword, reset])

  const hasActiveFilter =
    statusFilter !== 'ALL' || typeFilter !== 'ALL' || searchKeyword.trim().length > 0

  const handleValidSearchSubmit = (data: NotificationFilterFormData) => {
    onSearchKeywordChange(data.searchKeyword)
  }

  return (
    <div aria-label="Bộ lọc thông báo" className="flex flex-col gap-3">
      {/* Row 1: Light Segmented Status Tabs (matching Disputes & Queues) + SearchField */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Lọc thông báo theo trạng thái"
          className="inline-flex flex-wrap gap-1 self-start rounded-xl border border-slate-200 bg-slate-100/80 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'ALL'}
            data-status="ALL"
            onClick={() => onStatusFilterChange('ALL')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-[15px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <span>Tất cả</span>
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[13px] font-bold tabular-nums text-orange-700">
              {serverTotalCount}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'UNREAD'}
            data-status="UNREAD"
            onClick={() => onStatusFilterChange('UNREAD')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2.5 text-[15px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] ${
              statusFilter === 'UNREAD'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <span>Chưa đọc</span>
            <span
              data-testid="unread-filter-count"
              className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[13px] font-bold tabular-nums text-orange-700"
            >
              {unreadCount}
            </span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleValidSearchSubmit)}
          className="w-full lg:w-[420px] flex flex-col"
          noValidate
        >
          <Controller
            name="searchKeyword"
            control={control}
            render={({ field }) => (
              <SearchField
                id="notifications-search-input"
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
                placeholder="Tìm theo tiêu đề hoặc nội dung thông báo..."
                aria-label="Tìm kiếm thông báo"
                size="lg"
              />
            )}
          />
          {errors.searchKeyword && (
            <p role="alert" className="mt-1.5 text-sm font-medium text-rose-600">
              {errors.searchKeyword.message}
            </p>
          )}
        </form>
      </div>

      {/* Row 2: Light Category Filter Chips */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Lọc theo phân hệ thông báo"
      >
        {TYPE_CHIPS.map((chip) => {
          const isActive = typeFilter === chip.value
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => onTypeFilterChange(chip.value)}
              aria-pressed={isActive}
              data-type={chip.value}
              className={`min-h-[42px] rounded-lg border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] ${
                isActive
                  ? 'border-orange-200 bg-orange-50 text-orange-800 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>

      {/* Transparent Client Filter Scope Helper */}
      {hasActiveFilter && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-slate-600">
          <span>
            Đang lọc trên <strong className="text-slate-900">{pageTotalCount}</strong> thông báo của trang hiện tại
            {' · '}
            <strong className="text-[#d95f00]">{matchedCount}</strong> kết quả khớp
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 font-semibold text-[#9e4300] hover:text-[#d95f00] cursor-pointer focus-visible:outline-none focus-visible:underline"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  )
}
