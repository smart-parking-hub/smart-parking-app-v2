import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import type { Revenue, Withdrawal } from '@/entities/operations'
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
  Notice,
  Field,
  DataTable,
  Badge,
  Dialog,
  money,
  date,
  control,
  button,
} from '@/shared/components/Workspace'
export function MerchantRevenuePage() {
  const filters = useForm({
    defaultValues: { startDate: '', endDate: '', granularity: 'DAY' },
  })
  const [range, setRange] = useState(filters.getValues())
  const query = useQuery({
    queryKey: ['merchant-revenue', range],
    queryFn: () => getData<Revenue>('/api/v1/merchant/revenue', range),
    retry: false,
  })
  return (
    <Workspace
      title="Hiệu quả kinh doanh"
      eyebrow="FINANCE / REVENUE"
      description="Theo dõi doanh thu, phí nền tảng và dòng tiền thực nhận."
      actions={
        <Link className={button} to="/merchant/withdrawals">
          Ví & Rút tiền →
        </Link>
      }
    >
      <Panel>
        <form
          className="flex flex-wrap items-end gap-4"
          onSubmit={filters.handleSubmit((data) => setRange(data))}
        >
          <Field label="Từ ngày">
            <input
              type="date"
              className={control}
              {...filters.register('startDate')}
            />
          </Field>
          <Field label="Đến ngày">
            <input
              type="date"
              className={control}
              {...filters.register('endDate', {
                validate: (value) =>
                  !value ||
                  !filters.getValues('startDate') ||
                  value >= filters.getValues('startDate'),
              })}
            />
          </Field>
          <Field label="Nhóm thời gian">
            <select className={control} {...filters.register('granularity')}>
              <option value="DAY">Theo ngày</option>
              <option value="MONTH">Theo tháng</option>
              <option value="YEAR">Theo năm</option>
            </select>
          </Field>
          <button className={button}>Áp dụng</button>
          {filters.formState.errors.endDate && (
            <Notice error>Ngày kết thúc phải từ ngày bắt đầu.</Notice>
          )}
        </form>
      </Panel>
      <QueryState query={query}>
        {(data) => (
          <>
            <Metrics
              items={[
                {
                  label: 'Doanh thu gộp',
                  value: money(data.totalGrossRevenue),
                },
                {
                  label: 'Doanh thu thực nhận',
                  value: money(data.totalNetRevenue),
                },
                { label: 'Phí nền tảng', value: money(data.totalPlatformFee) },
                {
                  label: 'Số dư khả dụng',
                  value: money(data.currentWalletBalance),
                },
              ]}
            />
            <Panel title="Nhịp doanh thu">
              <div className="flex min-h-64 items-end gap-3 overflow-x-auto border-b border-brand-border pb-3">
                {data.series?.length ? (
                  data.series.map((point) => (
                    <div
                      key={point.period}
                      className="flex min-w-16 flex-1 flex-col items-center gap-3"
                    >
                      <span className="text-xs font-semibold">
                        {money(point.revenue)}
                      </span>
                      <div
                        className="w-full max-w-12 rounded-t-md bg-brand-orange"
                        style={{
                          height: `${Math.max(4, (point.revenue / Math.max(1, ...data.series.map((p) => p.revenue))) * 180)}px`,
                        }}
                      />
                      <span className="text-xs text-brand-muted">
                        {point.period}
                      </span>
                      <span className="text-xs">{point.bookingCount} lượt</span>
                    </div>
                  ))
                ) : (
                  <p className="m-auto text-sm text-brand-muted">
                    Chưa có chuỗi dữ liệu doanh thu.
                  </p>
                )}
              </div>
            </Panel>
            <Panel title="Đối soát">
              <p className="text-sm leading-7 text-brand-muted">
                Đã hoàn tất {data.completedBookings ?? 0} lượt đặt chỗ. Số liệu
                được cập nhật theo phản hồi máy chủ. Bộ lọc chỉ có hiệu lực khi
                dịch vụ doanh thu hỗ trợ tổng hợp theo khoảng thời gian.
              </p>
            </Panel>
          </>
        )}
      </QueryState>
    </Workspace>
  )
}
export function MerchantWithdrawalsPage() {
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const query = useQuery({
    queryKey: ['merchant-withdrawals', page],
    queryFn: () =>
      getData<Page<Withdrawal>>('/api/v1/withdrawals', { page, size: 20 }),
    retry: false,
  })
  const revenue = useQuery({
    queryKey: ['merchant-revenue', 'wallet'],
    queryFn: () => getData<Revenue>('/api/v1/merchant/revenue'),
    retry: false,
  })
  return (
    <Workspace
      title="Ví & Yêu cầu rút tiền"
      description="Tạo yêu cầu rút tiền về tài khoản ngân hàng. Mọi yêu cầu đều cần quản trị viên phê duyệt."
      actions={
        <button
          disabled={!revenue.data}
          className={button}
          onClick={() => setOpen(true)}
        >
          + Yêu cầu rút tiền
        </button>
      }
    >
      <QueryState query={revenue}>
        {(data) => (
          <Metrics
            items={[
              {
                label: 'Số dư khả dụng',
                value: money(data.currentWalletBalance),
              },
              {
                label: 'Thực nhận tích lũy',
                value: money(data.totalNetRevenue),
              },
              {
                label: 'Rút tối thiểu',
                value: money(data.minWithdrawalAmount ?? 50000),
              },
              {
                label: 'Quy trình',
                value: 'Chờ phê duyệt',
                note: 'Kiểm tra tài khoản nhận trước khi gửi',
              },
            ]}
          />
        )}
      </QueryState>
      <QueryState query={query}>
        {(data) => (
          <DataTable
            rows={data.content}
            page={page}
            totalPages={data.totalPages}
            onPage={setPage}
            columns={[
              { label: 'Yêu cầu', render: (r) => `WD-${r.id}` },
              { label: 'Số tiền', render: (r) => money(r.amount) },
              {
                label: 'Ngân hàng',
                render: (r) =>
                  `${r.bankName || '—'} · ${r.maskedBankAccount || '—'}`,
              },
              { label: 'Ngày yêu cầu', render: (r) => date(r.requestedAt) },
              {
                label: 'Trạng thái',
                render: (r) => <Badge value={r.status} />,
              },
              { label: 'Phản hồi', render: (r) => r.decisionReason || '—' },
            ]}
          />
        )}
      </QueryState>
      {open && revenue.data && (
        <WithdrawalDialog
          balance={revenue.data.currentWalletBalance}
          minimum={Math.max(50000, revenue.data.minWithdrawalAmount || 0)}
          onClose={() => setOpen(false)}
        />
      )}
    </Workspace>
  )
}
function WithdrawalDialog({
  balance,
  minimum,
  onClose,
}: {
  balance: number
  minimum: number
  onClose: () => void
}) {
  const cache = useQueryClient()
  const form = useForm<{
    amount: number
    bankName: string
    bankAccountNumber: string
    accountHolderName: string
  }>()
  const mutation = useMutation({
    mutationFn: (data: {
      amount: number
      bankName: string
      bankAccountNumber: string
      accountHolderName: string
    }) => sendData('post', '/api/v1/withdrawals', data),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['merchant-withdrawals'] })
      void cache.invalidateQueries({ queryKey: ['merchant-revenue'] })
      onClose()
    },
  })
  return (
    <Dialog
      title="Tạo yêu cầu rút tiền"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-5"
      >
        <Notice>
          Khả dụng: {money(balance)}. Khoản tiền được giữ khi tạo yêu cầu chờ
          duyệt.
        </Notice>
        <Field label="Số tiền (VND)">
          <input
            type="number"
            className={control}
            {...form.register('amount', {
              required: true,
              valueAsNumber: true,
              min: minimum,
              max: balance,
            })}
          />
        </Field>
        {(['bankName', 'bankAccountNumber', 'accountHolderName'] as const).map(
          (key) => (
            <Field
              key={key}
              label={
                {
                  bankName: 'Ngân hàng',
                  bankAccountNumber: 'Số tài khoản',
                  accountHolderName: 'Tên chủ tài khoản',
                }[key]
              }
            >
              <input
                className={control}
                {...form.register(key, {
                  required: true,
                  ...(key === 'bankAccountNumber'
                    ? { pattern: /^\d{1,30}$/ }
                    : {}),
                })}
              />
            </Field>
          ),
        )}
        {Object.keys(form.formState.errors).length > 0 && (
          <Notice error>
            Kiểm tra thông tin ngân hàng và số tiền: từ {money(minimum)} đến{' '}
            {money(balance)}.
          </Notice>
        )}
        {mutation.isError && (
          <Notice error>{errorMessage(mutation.error)}</Notice>
        )}
        <button className={`${button} w-full`} disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang gửi…' : 'Gửi yêu cầu phê duyệt'}
        </button>
      </form>
    </Dialog>
  )
}
