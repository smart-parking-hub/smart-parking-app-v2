import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const dashboardFilterSchema = z.object({
  timeRange: z.enum(['ALL', 'TODAY', 'WEEK', 'MONTH'], {
    errorMap: () => ({ message: 'Vui lòng chọn khoảng thời gian hợp lệ' }),
  }),
  autoRefreshInterval: z
    .number({ invalid_type_error: 'Thời gian làm mới phải là số' })
    .min(0, 'Thời gian làm mới không được âm')
    .max(300, 'Thời gian làm mới tối đa 300 giây'),
})

export type DashboardFilterValues = z.infer<typeof dashboardFilterSchema>

interface AdminDashboardFilterFormProps {
  defaultValues?: Partial<DashboardFilterValues>
  onFilterChange: (values: DashboardFilterValues) => void
  onManualRefresh: () => void
  isFetching?: boolean
}

export function AdminDashboardFilterForm({
  defaultValues = { timeRange: 'ALL', autoRefreshInterval: 0 },
  onFilterChange,
  onManualRefresh,
  isFetching = false,
}: AdminDashboardFilterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DashboardFilterValues>({
    resolver: zodResolver(dashboardFilterSchema),
    defaultValues: {
      timeRange: defaultValues.timeRange ?? 'ALL',
      autoRefreshInterval: defaultValues.autoRefreshInterval ?? 0,
    },
  })

  const currentTimeRange = watch('timeRange')

  const handleTimeRangeClick = (range: DashboardFilterValues['timeRange']) => {
    setValue('timeRange', range, { shouldValidate: true })
    handleSubmit(onFilterChange)()
  }

  return (
    <form
      onSubmit={handleSubmit(onFilterChange)}
      data-testid="admin-dashboard-filter-form"
      className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
          Kỳ thống kê:
        </span>
        {(
          [
            ['ALL', 'Toàn thời gian'],
            ['TODAY', 'Hôm nay'],
            ['WEEK', '7 ngày qua'],
            ['MONTH', '30 ngày qua'],
          ] as const
        ).map(([key, label]) => {
          const isActive = currentTimeRange === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTimeRangeClick(key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5 text-xs text-slate-600">
          <span>Tự động làm mới:</span>
          <select
            {...register('autoRefreshInterval', { valueAsNumber: true })}
            aria-label="Tự động làm mới dữ liệu"
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-brand-navy focus:border-brand-navy focus:outline-hidden"
            onChange={(e) => {
              setValue('autoRefreshInterval', Number(e.target.value), {
                shouldValidate: true,
              })
              handleSubmit(onFilterChange)()
            }}
          >
            <option value="0">Tắt</option>
            <option value="30">Mỗi 30 giây</option>
            <option value="60">Mỗi 1 phút</option>
            <option value="300">Mỗi 5 phút</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onManualRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-2xs"
        >
          <span className={isFetching ? 'animate-spin' : ''}>↻</span>
          {isFetching ? 'Đang cập nhật...' : 'Làm mới'}
        </button>
      </div>

      {errors.timeRange && (
        <p className="w-full text-xs text-rose-500">{errors.timeRange.message}</p>
      )}
      {errors.autoRefreshInterval && (
        <p className="w-full text-xs text-rose-500">
          {errors.autoRefreshInterval.message}
        </p>
      )}
    </form>
  )
}

