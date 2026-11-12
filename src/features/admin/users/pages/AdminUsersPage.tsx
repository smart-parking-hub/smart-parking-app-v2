import { useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Workspace } from '@/shared/components/Workspace'
import { QueryState } from '@/shared/components/QueryState'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import {
  fetchAdminUsers,
  ADMIN_USERS_QUERY_KEY,
} from '../api/adminUsersApi'
import { useAdminUsersStore } from '../store/adminUsersStore'
import { AdminUsersToolbar } from '../components/AdminUsersToolbar'
import { AdminUsersTable } from '../components/AdminUsersTable'
import { AdminUserBanModal } from '../components/AdminUserBanModal'
import type { AdminUser } from '../types/adminUsersTypes'

export function AdminUsersPage() {
  const keyword = useAdminUsersStore((s) => s.keyword)
  const roleFilter = useAdminUsersStore((s) => s.roleFilter)
  const statusFilter = useAdminUsersStore((s) => s.statusFilter)
  const page = useAdminUsersStore((s) => s.page)
  const setPage = useAdminUsersStore((s) => s.setPage)
  const resetFilters = useAdminUsersStore((s) => s.resetFilters)
  const toast = useAdminUsersStore((s) => s.toast)
  const clearToast = useAdminUsersStore((s) => s.clearToast)

  const query = useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, page],
    queryFn: ({ signal }) => fetchAdminUsers({ page, size: 50 }, signal),
    retry: false,
  })

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      clearToast()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, clearToast])

  return (
    <Workspace
      title="Quản lý người dùng"
      eyebrow="TÀI KHOẢN & PHÂN QUYỀN"
      description="Kiểm soát trạng thái tài khoản và truy vết các hành vi cần chú ý."
    >
      {/* Toast Feedback Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : toast.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800'
                : 'border-slate-200 bg-white text-slate-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          ) : (
            <Info className="h-5 w-5 text-slate-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={clearToast}
            aria-label="Đóng thông báo"
            className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <QueryState query={query}>
        {(data) => (
          <AdminUsersContent
            dataContent={data.content || []}
            totalPages={data.totalPages || 1}
            totalElements={data.totalElements ?? data.content?.length ?? 0}
            keyword={keyword}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            page={page}
            onPageChange={setPage}
            onResetFilters={resetFilters}
          />
        )}
      </QueryState>

      {/* Decision Ban/Unban Modal */}
      <AdminUserBanModal />
    </Workspace>
  )
}

interface AdminUsersContentProps {
  dataContent: AdminUser[]
  totalPages: number
  totalElements: number
  keyword: string
  roleFilter: string
  statusFilter: string
  page: number
  onPageChange: (page: number) => void
  onResetFilters: () => void
}

function AdminUsersContent({
  dataContent,
  totalPages,
  totalElements,
  keyword,
  roleFilter,
  statusFilter,
  page,
  onPageChange,
  onResetFilters,
}: AdminUsersContentProps) {
  // Client-side filtering across the fetched dataset
  const filteredUsers = useMemo(() => {
    return dataContent.filter((user) => {
      // Keyword matching (Name, Phone, Email, #ID)
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const matchName = user.fullName?.toLowerCase().includes(kw)
        const matchPhone = user.phone?.toLowerCase().includes(kw)
        const matchEmail = user.email?.toLowerCase().includes(kw)
        const matchId = String(user.id).includes(kw)
        if (!matchName && !matchPhone && !matchEmail && !matchId) {
          return false
        }
      }

      // Role matching
      if (roleFilter !== 'ALL') {
        const cleanUserRole = user.role?.replace(/^ROLE_/, '')
        const cleanFilterRole = roleFilter.replace(/^ROLE_/, '')
        if (cleanUserRole !== cleanFilterRole) {
          return false
        }
      }

      // Status matching
      if (statusFilter !== 'ALL') {
        if (user.status !== statusFilter) {
          return false
        }
      }

      return true
    })
  }, [dataContent, keyword, roleFilter, statusFilter])

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <AdminUsersToolbar
        totalCount={dataContent.length}
        filteredCount={filteredUsers.length}
      />

      {/* Table or Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Info className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-sora text-sm font-semibold text-slate-800">
            Không tìm thấy tài khoản phù hợp
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Không có người dùng nào khớp với bộ lọc hiện tại. Vui lòng thử tìm kiếm khác hoặc đặt lại bộ lọc.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      ) : (
        <AdminUsersTable
          users={filteredUsers}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
