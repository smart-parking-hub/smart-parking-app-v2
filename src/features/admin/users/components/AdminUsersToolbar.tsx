import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, RotateCcw, X } from 'lucide-react'
import {
  adminUsersFilterSchema,
  type AdminUserFilterValues,
} from '../types/adminUsersSchemas'
import { useAdminUsersStore } from '../store/adminUsersStore'
import type { RoleFilter, StatusFilter } from '../types/adminUsersTypes'

interface AdminUsersToolbarProps {
  totalCount: number
  filteredCount: number
}

export function AdminUsersToolbar({
  totalCount,
  filteredCount,
}: AdminUsersToolbarProps) {
  const keyword = useAdminUsersStore((s) => s.keyword)
  const roleFilter = useAdminUsersStore((s) => s.roleFilter)
  const statusFilter = useAdminUsersStore((s) => s.statusFilter)
  const setKeyword = useAdminUsersStore((s) => s.setKeyword)
  const setRoleFilter = useAdminUsersStore((s) => s.setRoleFilter)
  const setStatusFilter = useAdminUsersStore((s) => s.setStatusFilter)
  const resetFilters = useAdminUsersStore((s) => s.resetFilters)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<AdminUserFilterValues>({
    resolver: zodResolver(adminUsersFilterSchema),
    defaultValues: {
      keyword,
      role: roleFilter,
      status: statusFilter,
    },
  })

  const currentKeyword = watch('keyword')
  const currentRole = watch('role')
  const currentStatus = watch('status')

  // Synchronize store when form fields change
  const onSubmit = (values: AdminUserFilterValues) => {
    setKeyword(values.keyword)
    setRoleFilter(values.role as RoleFilter)
    setStatusFilter(values.status as StatusFilter)
  }

  // Handle immediate change for selects
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as RoleFilter
    setValue('role', val, { shouldValidate: true })
    setRoleFilter(val)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as StatusFilter
    setValue('status', val, { shouldValidate: true })
    setStatusFilter(val)
  }

  const handleClearKeyword = () => {
    setValue('keyword', '', { shouldValidate: true })
    setKeyword('')
  }

  const handleReset = () => {
    reset({
      keyword: '',
      role: 'ALL',
      status: 'ALL',
    })
    resetFilters()
  }

  // Keep form in sync if store is reset externally
  useEffect(() => {
    setValue('keyword', keyword)
    setValue('role', roleFilter)
    setValue('status', statusFilter)
  }, [keyword, roleFilter, statusFilter, setValue])

  const hasActiveFilters =
    Boolean(currentKeyword) || currentRole !== 'ALL' || currentStatus !== 'ALL'

  return (
    <form
      role="search"
      aria-label="Bộ lọc danh bạ tài khoản"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs md:flex-row md:items-center md:justify-between"
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            {...register('keyword')}
            type="search"
            aria-label="Tìm kiếm người dùng"
            placeholder="Tìm theo họ tên, SĐT hoặc #ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-9 py-2 text-xs text-brand-navy placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all"
            onChange={(e) => {
              setValue('keyword', e.target.value, { shouldValidate: true })
              setKeyword(e.target.value)
            }}
          />
          {currentKeyword && (
            <button
              type="button"
              onClick={handleClearKeyword}
              aria-label="Xóa từ khóa tìm kiếm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Role select */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-role" className="sr-only">
            Vai trò
          </label>
          <select
            id="filter-role"
            aria-label="Lọc theo vai trò"
            value={currentRole}
            onChange={handleRoleChange}
            className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-medium text-brand-navy focus:border-brand-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ROLE_DRIVER">Tài xế (Driver)</option>
            <option value="ROLE_MERCHANT">Chủ bãi (Merchant)</option>
            <option value="ROLE_ADMIN">Quản trị viên (Admin)</option>
          </select>
        </div>

        {/* Status select */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-status" className="sr-only">
            Trạng thái
          </label>
          <select
            id="filter-status"
            aria-label="Lọc theo trạng thái"
            value={currentStatus}
            onChange={handleStatusChange}
            className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-medium text-brand-navy focus:border-brand-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="BANNED">Đã khóa</option>
            <option value="LOCKED">Tạm khóa</option>
          </select>
        </div>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-navy transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Đặt lại</span>
          </button>
        )}
      </div>

      {/* Account counter badge */}
      <div
        data-testid="admin-users-counter"
        className="flex items-center gap-1.5 text-xs text-slate-500"
      >
        <span>
          <strong className="font-semibold text-slate-800">{filteredCount}</strong>{' '}
          / {totalCount} tài khoản
        </span>
      </div>
    </form>
  )
}
