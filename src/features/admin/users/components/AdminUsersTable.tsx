import { Link } from 'react-router-dom'
import { Lock, Unlock } from 'lucide-react'
import { DataTable, type Column } from '@/shared/components/DataTable'
import { Badge } from '@/shared/components/Badge'
import { date } from '@/shared/components/Workspace'
import type { AdminUser } from '../types/adminUsersTypes'
import { useAdminUsersStore } from '../store/adminUsersStore'

interface AdminUsersTableProps {
  users: AdminUser[]
  page: number
  totalPages: number
  totalElements?: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function AdminUsersTable({
  users,
  page,
  totalPages,
  totalElements,
  onPageChange,
  isLoading = false,
}: AdminUsersTableProps) {
  const openBanModal = useAdminUsersStore((s) => s.openBanModal)

  const columns: Column<AdminUser>[] = [
    {
      key: 'identity',
      label: 'Tài khoản',
      render: (r) => (
        <div>
          <Link
            to={`/admin/users/${r.id}`}
            className="font-semibold text-brand-navy hover:text-[#d95f00] transition-colors"
          >
            #{r.id} {r.fullName ? `· ${r.fullName}` : ''}
          </Link>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Điện thoại',
      render: (r) => <span className="font-mono text-xs">{r.phone}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (r) => r.email || '—',
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (r) => <Badge value={r.role} />,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (r) => <Badge value={r.status} />,
    },
    {
      key: 'createdAt',
      label: 'Ngày tham gia',
      render: (r) => (
        <span className="whitespace-nowrap text-xs text-brand-muted">
          {date(r.createdAt)}
        </span>
      ),
    },
  ]

  const renderActions = (r: AdminUser) => {
    const isTargetAdmin = r.role === 'ROLE_ADMIN' || r.role === 'ADMIN'
    const isBanned = r.status === 'BANNED'

    return (
      <div className="flex items-center gap-2">
        <Link
          to={`/admin/users/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-surface hover:text-[#d95f00] transition-colors shadow-xs"
        >
          Quản trị
        </Link>
        <button
          type="button"
          disabled={isTargetAdmin}
          title={
            isTargetAdmin
              ? 'Không thể khóa tài khoản Quản trị viên'
              : isBanned
                ? 'Mở khóa tài khoản'
                : 'Khóa tài khoản'
          }
          onClick={() => openBanModal(r, isBanned ? 'unban' : 'ban')}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
            isBanned
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          {isBanned ? (
            <>
              <Unlock className="h-3 w-3" />
              <span>Mở khóa</span>
            </>
          ) : (
            <>
              <Lock className="h-3 w-3" />
              <span>Khóa</span>
            </>
          )}
        </button>
      </div>
    )
  }

  const renderMobileCard = (r: AdminUser) => (
    <Link
      to={`/admin/users/${r.id}`}
      className="admin-user-card block rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors"
      aria-label={`Quản trị tài khoản #${r.id}`}
    >
      <div className="admin-user-card-top flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="admin-user-identity flex items-center gap-2.5">
          <span
            className="admin-user-avatar flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy/10 font-bold text-xs text-brand-navy"
            aria-hidden="true"
          >
            {r.fullName?.trim().charAt(0).toLocaleUpperCase('vi') || '#'}
          </span>
          <div>
            <strong className="block text-sm font-semibold text-brand-navy">
              {r.fullName || `Tài khoản #${r.id}`}
            </strong>
            <small className="text-xs text-slate-400">
              #{r.id} · {date(r.createdAt)}
            </small>
          </div>
        </div>
        <Badge value={r.status} />
      </div>
      <dl className="grid grid-cols-2 gap-2 py-3 text-xs">
        <div>
          <dt className="text-slate-400">Điện thoại</dt>
          <dd className="font-mono text-slate-700">{r.phone || '—'}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Email</dt>
          <dd className="truncate text-slate-700">{r.email || '—'}</dd>
        </div>
      </dl>
      <div className="admin-user-card-bottom flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <Badge value={r.role} />
        <span className="font-semibold text-brand-primary">
          Quản trị tài khoản →
        </span>
      </div>
    </Link>
  )

  return (
    <DataTable
      rows={users}
      page={page}
      totalPages={totalPages}
      totalItems={totalElements}
      onPage={onPageChange}
      isLoading={isLoading}
      columns={[...columns, { label: 'Xử lý', render: renderActions }]}
      detailLink={(r) => `/admin/users/${r.id}`}
      renderMobileCard={renderMobileCard}
      emptyText="Không tìm thấy tài khoản phù hợp với điều kiện lọc."
    />
  )
}

