import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Lot, Withdrawal } from '@/entities/operations'
import {
  getData,
  sendData,
  errorMessage,
  type Page,
} from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import {
  Workspace,
  Metrics,
  Panel,
  Badge,
  DataTable,
  Dialog,
  Field,
  Notice,
  money,
  date,
  control,
  secondary,
  type Column,
} from '@/shared/components/Workspace'
import { LotOverview } from '@/features/merchant/operations'

interface User {
  id: number
  phone: string
  email: string
  fullName?: string
  role: string
  status: string
  statusReason?: string
  createdAt: string
  bookingCount?: number
  disputeCount?: number
}

interface Transaction {
  id: number
  transactionCode: string
  bookingCode: string
  amount: number
  type: string
  gateway: string
  status: string
  merchantName: string
  createdAt: string
}

interface Audit {
  id: number
  actorUserId: number
  action: string
  targetType: string
  targetId: number
  detail: string
  result: string
  createdAt: string
}

interface Dashboard {
  totalUsers: number
  totalDrivers: number
  totalMerchants: number
  totalParkingLots: number
  pendingParkingLots: number
  totalBookings: number
  pendingWithdrawals: number
  openDisputes: number
  platformRevenue: number
}

export function AdminDashboardPage() {
  const query = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getData<Dashboard>('/api/v1/admin/dashboard'),
    retry: false,
  })

  return (
    <Workspace
      title="Toàn cảnh vận hành"
      eyebrow="SMARTTRUCK / COMMAND CENTER"
      description="Các quyết định hôm nay bắt đầu từ dữ liệu chính xác."
    >
      <QueryState query={query}>
        {(data) => (
          <>
            <Metrics
              items={[
                {
                  label: 'Doanh thu nền tảng',
                  value: money(data.platformRevenue),
                },
                { label: 'Bãi đỗ', value: data.totalParkingLots },
                { label: 'Tổng lượt đặt chỗ', value: data.totalBookings },
                { label: 'Người dùng', value: data.totalUsers },
              ]}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [
                  'parking-lots',
                  'Bãi đang chờ thẩm định',
                  data.pendingParkingLots,
                ],
                ['withdrawals', 'Yêu cầu rút tiền', data.pendingWithdrawals],
                ['disputes', 'Tranh chấp đang mở', data.openDisputes],
              ].map(([path, title, count]) => {
                const isAlert = typeof count === 'number' && count > 0
                return (
                  <Panel key={String(path)}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-brand-muted">{title}</p>
                      {isAlert && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                          Cần xử lý
                        </span>
                      )}
                    </div>
                    <p
                      className={`my-5 font-sora text-5xl font-semibold tracking-tight ${
                        isAlert ? 'text-[#d95f00]' : 'text-brand-navy'
                      }`}
                    >
                      {count}
                    </p>
                    <Link
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-surface hover:text-[#d95f00] transition-colors"
                      to={`/admin/${path}`}
                    >
                      Mở bàn xử lý →
                    </Link>
                  </Panel>
                )
              })}
            </div>
            <Panel title="Cộng đồng vận tải">
              <p className="text-sm text-brand-muted">
                {data.totalDrivers} tài xế · {data.totalMerchants} chủ bãi đang
                được hệ thống quản lý.
              </p>
            </Panel>
          </>
        )}
      </QueryState>
    </Workspace>
  )
}

function AdminList<T extends { id: number }>({
  title,
  path,
  columns,
  detailLink,
  actions,
}: {
  title: string
  path: string
  columns: Column<T>[]
  detailLink?: (r: T) => string
  actions?: (r: T) => React.ReactNode
}) {
  const [page, setPage] = useState(0)
  const query = useQuery({
    queryKey: ['admin-list', path, page],
    queryFn: () => getData<Page<T>>(path, { page, size: 20 }),
    retry: false,
  })

  return (
    <Workspace title={title} eyebrow="ADMIN / OPERATIONS">
      <QueryState query={query}>
        {(data) => (
          <DataTable
            rows={data.content}
            page={page}
            totalPages={data.totalPages}
            onPage={setPage}
            columns={
              actions
                ? [...columns, { label: 'Xử lý', render: actions }]
                : columns
            }
            detailLink={detailLink}
          />
        )}
      </QueryState>
    </Workspace>
  )
}

export function AdminParkingLotsPage() {
  return (
    <AdminList<Lot>
      title="Kiểm duyệt bãi đỗ"
      path="/api/v1/admin/parking-lots"
      detailLink={(r) => `/admin/parking-lots/${r.id}`}
      columns={[
        {
          label: 'Bãi đỗ',
          render: (r) => (
            <span className="font-semibold text-brand-navy">{r.name}</span>
          ),
        },
        { label: 'Địa chỉ', render: (r) => r.address },
        { label: 'Chủ bãi', render: (r) => `#${r.merchantId}` },
        { label: 'Trạng thái', render: (r) => <Badge value={r.status} /> },
      ]}
      actions={(r) => (
        <Link
          to={`/admin/parking-lots/${r.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#d95f00] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs"
        >
          Thẩm định
        </Link>
      )}
    />
  )
}

export function AdminUsersPage() {
  return (
    <AdminList<User>
      title="Quản lý người dùng"
      path="/api/v1/admin/users"
      detailLink={(r) => `/admin/users/${r.id}`}
      columns={[
        { label: 'Tài khoản', render: (r) => `#${r.id}` },
        { label: 'Điện thoại', render: (r) => r.phone },
        { label: 'Email', render: (r) => r.email },
        { label: 'Vai trò', render: (r) => r.role },
        { label: 'Trạng thái', render: (r) => <Badge value={r.status} /> },
        { label: 'Ngày tham gia', render: (r) => date(r.createdAt) },
      ]}
    />
  )
}

export function AdminAuditLogsPage() {
  return (
    <AdminList<Audit>
      title="Nhật ký kiểm toán"
      path="/api/v1/admin/audit-logs"
      columns={[
        { label: 'Thời điểm', render: (r) => date(r.createdAt) },
        { label: 'Người thao tác', render: (r) => `#${r.actorUserId}` },
        { label: 'Hành động', render: (r) => r.action },
        { label: 'Đối tượng', render: (r) => `${r.targetType} #${r.targetId}` },
        { label: 'Chi tiết', render: (r) => r.detail },
        { label: 'Kết quả', render: (r) => r.result },
      ]}
    />
  )
}

export function AdminTransactionsPage() {
  const [selected, setSelected] = useState<Transaction | null>(null)
  return (
    <>
      <AdminList<Transaction>
        title="Giám sát giao dịch"
        path="/api/v1/admin/transactions"
        columns={[
          { label: 'Mã giao dịch', render: (r) => r.transactionCode },
          { label: 'Booking', render: (r) => r.bookingCode },
          { label: 'Số tiền', render: (r) => money(r.amount) },
          { label: 'Loại', render: (r) => r.type },
          { label: 'Trạng thái', render: (r) => <Badge value={r.status} /> },
          { label: 'Thời điểm', render: (r) => date(r.createdAt) },
        ]}
        actions={(r) => (
          <button className={secondary} onClick={() => setSelected(r)}>
            Đối soát
          </button>
        )}
      />
      {selected && (
        <Dialog title="Chi tiết đối soát" onClose={() => setSelected(null)}>
          <dl className="space-y-4">
            {[
              ['Mã giao dịch', selected.transactionCode],
              ['Booking', selected.bookingCode],
              ['Chủ bãi', selected.merchantName],
              ['Cổng thanh toán', selected.gateway],
              ['Số tiền', money(selected.amount)],
              ['Trạng thái', selected.status],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <dt>{label}</dt>
                <dd className="font-semibold">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </Dialog>
      )}
    </>
  )
}

interface Decision {
  title: string
  path: string
  method?: 'put' | 'post'
  action?: string
  isOptionalReason?: boolean
}

export function DecisionDialog({
  decision,
  onClose,
}: {
  decision: Decision
  onClose: () => void
}) {
  const cache = useQueryClient()
  const form = useForm<{ reason: string }>()
  const isLotApproval =
    Boolean(decision.isOptionalReason) ||
    (decision.path.includes('/parking-lots/') &&
      (decision.action === 'approve' || decision.path.endsWith('/approve')))

  const mutation = useMutation({
    mutationFn: (data: { reason?: string }) =>
      sendData(decision.method || 'put', decision.path, {
        reason: data.reason?.trim() || '',
      }),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['admin-list'] })
      void cache.invalidateQueries({ queryKey: ['admin-detail'] })
      void cache.invalidateQueries({ queryKey: ['admin-dashboard'] })
      onClose()
    },
  })

  return (
    <Dialog
      title={decision.title}
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((data) => {
          if (mutation.isPending) return
          mutation.mutate(data)
        })}
      >
        <Notice>
          {isLotApproval
            ? 'Xác nhận phê duyệt hồ sơ bãi đỗ. Bãi sẽ được công bố và kích hoạt nhận đặt chỗ trên hệ thống.'
            : 'Kiểm tra hồ sơ trước khi xác nhận. Quyết định được lưu vào nhật ký hệ thống.'}
        </Notice>
        <Field
          label={
            isLotApproval
              ? 'Ghi chú phê duyệt (Tùy chọn)'
              : 'Lý do / ghi chú quyết định'
          }
        >
          <textarea
            rows={5}
            placeholder={
              isLotApproval
                ? 'Nhập ghi chú hoặc khuyến nghị cho chủ bãi (không bắt buộc)...'
                : 'Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa bổ sung...'
            }
            className={control}
            {...form.register('reason', {
              required: !isLotApproval ? 'Nhập lý do quyết định.' : false,
              validate: !isLotApproval
                ? (value) => !!value?.trim() || 'Nhập lý do quyết định.'
                : undefined,
            })}
          />
        </Field>
        {form.formState.errors.reason && (
          <Notice error>
            {form.formState.errors.reason.message || 'Nhập lý do quyết định.'}
          </Notice>
        )}
        {mutation.isError && (
          <Notice error>{errorMessage(mutation.error)}</Notice>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={onClose}
            className={secondary}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {mutation.isPending ? 'Đang xử lý…' : 'Xác nhận quyết định'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}

export function AdminWithdrawalsPage() {
  const [decision, setDecision] = useState<Decision | null>(null)
  return (
    <>
      <AdminList<Withdrawal>
        title="Phê duyệt rút tiền"
        path="/api/v1/admin/withdrawals"
        columns={[
          { label: 'Yêu cầu', render: (r) => `#${r.id}` },
          { label: 'Chủ bãi', render: (r) => r.merchantName },
          { label: 'Số tiền', render: (r) => money(r.amount) },
          {
            label: 'Tài khoản nhận',
            render: (r) =>
              `${r.bankName || '—'} · ${r.maskedBankAccount || '—'} · ${r.accountHolderName || '—'}`,
          },
          { label: 'Trạng thái', render: (r) => <Badge value={r.status} /> },
          { label: 'Phản hồi', render: (r) => r.decisionReason || '—' },
        ]}
        actions={(r) =>
          r.status === 'PENDING' ? (
            <div className="flex gap-2">
              {[
                ['approve', 'Duyệt chi'],
                ['reject', 'Từ chối'],
              ].map(([action, title]) => (
                <button
                  key={action}
                  className={
                    action === 'approve'
                      ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs cursor-pointer'
                      : secondary
                  }
                  onClick={() =>
                    setDecision({
                      title,
                      path: `/api/v1/admin/withdrawals/${r.id}/${action}`,
                      action,
                    })
                  }
                >
                  {title}
                </button>
              ))}
            </div>
          ) : (
            'Đã xử lý'
          )
        }
      />
      {decision && (
        <DecisionDialog decision={decision} onClose={() => setDecision(null)} />
      )}
    </>
  )
}

export function AdminLotDetailPage() {
  const { id } = useParams()
  const [decision, setDecision] = useState<Decision | null>(null)
  const query = useQuery({
    queryKey: ['admin-detail', 'lot', id],
    queryFn: () => getData<Lot>(`/api/v1/admin/parking-lots/${id}`),
    retry: false,
  })

  return (
    <Workspace
      title={`Thẩm định bãi #${id}`}
      actions={
        <Link className={secondary} to="/admin/parking-lots">
          ← Danh sách bãi
        </Link>
      }
    >
      <QueryState query={query}>
        {(lot) => (
          <>
            <LotOverview lot={lot} />
            <Panel title="Quyết định kiểm duyệt">
              <p className="mb-5 text-sm text-brand-muted">
                Chủ bãi: {lot.merchantName || `#${lot.merchantId}`} ·{' '}
                {lot.merchantPhone || 'Chưa có số điện thoại'}
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  ['approve', 'Duyệt & công bố'],
                  ['request-changes', 'Yêu cầu bổ sung'],
                  ['reject', 'Từ chối hồ sơ'],
                ].map(([action, title]) => (
                  <button
                    key={action}
                    className={
                      action === 'approve'
                        ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs cursor-pointer'
                        : secondary
                    }
                    onClick={() =>
                      setDecision({
                        title,
                        path: `/api/v1/admin/parking-lots/${id}/${action}`,
                        action,
                      })
                    }
                  >
                    {title}
                  </button>
                ))}
              </div>
            </Panel>
          </>
        )}
      </QueryState>
      {decision && (
        <DecisionDialog decision={decision} onClose={() => setDecision(null)} />
      )}
    </Workspace>
  )
}

export function AdminUserDetailPage() {
  const { id } = useParams()
  const [decision, setDecision] = useState<Decision | null>(null)
  const query = useQuery({
    queryKey: ['admin-detail', 'user', id],
    queryFn: () => getData<User>(`/api/v1/admin/users/${id}`),
    retry: false,
  })

  return (
    <Workspace
      title={`Hồ sơ người dùng #${id}`}
      actions={
        <Link className={secondary} to="/admin/users">
          ← Người dùng
        </Link>
      }
    >
      <QueryState query={query}>
        {(data) => (
          <>
            <Metrics
              items={[
                { label: 'Tài khoản', value: data.fullName || data.phone },
                { label: 'Trạng thái', value: <Badge value={data.status} /> },
                { label: 'Lượt đặt chỗ', value: data.bookingCount ?? 0 },
                { label: 'Khiếu nại', value: data.disputeCount ?? 0 },
              ]}
            />
            <Panel title="Thông tin & kỷ luật">
              <dl className="mb-6 grid gap-4 text-sm sm:grid-cols-2">
                {[
                  ['Điện thoại', data.phone],
                  ['Email', data.email],
                  ['Vai trò', data.role],
                  ['Ngày tạo', date(data.createdAt)],
                  ['Ghi chú trạng thái', data.statusReason],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-brand-muted">{label}</dt>
                    <dd className="mt-2">{value || '—'}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3">
                {[
                  [
                    data.status === 'BANNED' ? 'unban' : 'ban',
                    data.status === 'BANNED'
                      ? 'Mở khóa tài khoản'
                      : 'Khóa tài khoản',
                  ],
                  ['warnings', 'Gửi cảnh báo'],
                ].map(([action, title]) => (
                  <button
                    key={action}
                    className={secondary}
                    onClick={() =>
                      setDecision({
                        title,
                        path: `/api/v1/admin/users/${id}/${action}`,
                        action,
                        method: action === 'warnings' ? 'post' : 'put',
                      })
                    }
                  >
                    {title}
                  </button>
                ))}
              </div>
            </Panel>
          </>
        )}
      </QueryState>
      {decision && (
        <DecisionDialog decision={decision} onClose={() => setDecision(null)} />
      )}
    </Workspace>
  )
}
