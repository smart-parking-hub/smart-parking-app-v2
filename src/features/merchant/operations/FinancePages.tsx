import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
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
import { cn } from '@/shared/utils/cn'

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
          <button type="submit" className={button}>
            Áp dụng
          </button>
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
                        className="w-full max-w-12 rounded-t-md bg-brand-primary transition-all hover:brightness-110"
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

  const currentBalance = Number(revenue.data?.currentWalletBalance ?? 0)
  const minWithdrawal = Math.max(
    50000,
    Number(revenue.data?.minWithdrawalAmount ?? 50000),
  )
  const isBalanceInsufficient = Boolean(
    revenue.data && currentBalance < minWithdrawal,
  )
  const isWithdrawDisabled = !revenue.data || isBalanceInsufficient

  return (
    <Workspace
      title="Ví & Yêu cầu rút tiền"
      description="Tạo yêu cầu rút tiền về tài khoản ngân hàng. Mọi yêu cầu đều cần quản trị viên phê duyệt."
      actions={
        <div className="relative inline-flex flex-col items-end">
          <button
            disabled={isWithdrawDisabled}
            className={cn(
              button,
              isWithdrawDisabled && 'cursor-not-allowed opacity-60',
            )}
            onClick={() => setOpen(true)}
            aria-disabled={isWithdrawDisabled}
            title={
              isBalanceInsufficient
                ? `Số dư khả dụng tối thiểu để tạo yêu cầu rút tiền là ${money(minWithdrawal)} (Hiện có: ${money(currentBalance)})`
                : undefined
            }
          >
            + Yêu cầu rút tiền
          </button>
          {isBalanceInsufficient && (
            <span className="mt-1 text-xs text-brand-muted">
              Cần tối thiểu {money(minWithdrawal)} để rút
            </span>
          )}
        </div>
      }
    >
      {isBalanceInsufficient && (
        <Notice>
          Số dư khả dụng hiện tại ({money(currentBalance)}) chưa đạt hạn mức tối thiểu ({money(minWithdrawal)}) để tạo yêu cầu rút tiền về tài khoản ngân hàng.
        </Notice>
      )}
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
              {
                label: 'Số tiền',
                render: (r) => money(r.amount),
                align: 'right',
              },
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
          balance={currentBalance}
          minimum={minWithdrawal}
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

  // Prepopulate bank details from merchant profile if available
  const profileQuery = useQuery({
    queryKey: ['merchant-profile-summary'],
    queryFn: () =>
      getData<{
        bankName?: string
        bankAccountNum?: string
        fullName?: string
      }>('/api/v1/merchant/profile'),
    staleTime: 60_000,
    retry: false,
  })

  useEffect(() => {
    if (profileQuery.data) {
      if (profileQuery.data.bankName && !form.getValues('bankName')) {
        form.setValue('bankName', profileQuery.data.bankName)
      }
      if (
        profileQuery.data.bankAccountNum &&
        !form.getValues('bankAccountNumber')
      ) {
        form.setValue('bankAccountNumber', profileQuery.data.bankAccountNum)
      }
      if (
        profileQuery.data.fullName &&
        !form.getValues('accountHolderName')
      ) {
        form.setValue('accountHolderName', profileQuery.data.fullName)
      }
    }
  }, [profileQuery.data, form])

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

  const isBalanceValid = balance >= minimum

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
        <Notice error={!isBalanceValid}>
          {isBalanceValid ? (
            <span>
              Số dư khả dụng:{' '}
              <strong className="font-semibold">{money(balance)}</strong>. Hạn
              mức rút: Từ{' '}
              <strong className="font-semibold">{money(minimum)}</strong> đến{' '}
              <strong className="font-semibold">{money(balance)}</strong>. Khoản
              tiền sẽ được tạm giữ chờ phê duyệt.
            </span>
          ) : (
            <span>
              Số dư khả dụng hiện tại ({money(balance)}) không đủ hạn mức rút
              tối thiểu ({money(minimum)}).
            </span>
          )}
        </Notice>
        <Field label="Số tiền rút (VND)">
          <input
            type="number"
            step="1000"
            className={control}
            placeholder={`Nhập số tiền từ ${minimum.toLocaleString('vi-VN')} ₫`}
            {...form.register('amount', {
              required: true,
              valueAsNumber: true,
              min: minimum,
              max: balance,
            })}
          />
        </Field>
        {isBalanceValid && (
          <div className="-mt-3 flex items-center gap-2 text-xs text-brand-muted">
            <span>Chọn nhanh:</span>
            <button
              type="button"
              className="font-medium text-brand-primary hover:underline"
              onClick={() =>
                form.setValue('amount', minimum, { shouldValidate: true })
              }
            >
              Tối thiểu ({money(minimum)})
            </button>
            <span>·</span>
            <button
              type="button"
              className="font-medium text-brand-primary hover:underline"
              onClick={() =>
                form.setValue('amount', balance, { shouldValidate: true })
              }
            >
              Toàn bộ ({money(balance)})
            </button>
          </div>
        )}
        {(['bankName', 'bankAccountNumber', 'accountHolderName'] as const).map(
          (key) => (
            <Field
              key={key}
              label={
                {
                  bankName: 'Ngân hàng nhận',
                  bankAccountNumber: 'Số tài khoản thụ hưởng',
                  accountHolderName: 'Tên chủ tài khoản',
                }[key]
              }
            >
              <input
                className={control}
                placeholder={
                  {
                    bankName: 'Ví dụ: Vietcombank, Techcombank…',
                    bankAccountNumber: 'Nhập số tài khoản ngân hàng',
                    accountHolderName: 'NGUYEN VAN A',
                  }[key]
                }
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
            Vui lòng kiểm tra lại thông tin: Số tiền từ {money(minimum)} đến{' '}
            {money(balance)} và điền đầy đủ tài khoản ngân hàng.
          </Notice>
        )}
        {mutation.isError && (
          <Notice error>{errorMessage(mutation.error)}</Notice>
        )}
        <button
          type="submit"
          className={cn(
            `${button} w-full`,
            (!isBalanceValid || mutation.isPending) &&
              'cursor-not-allowed opacity-60',
          )}
          disabled={!isBalanceValid || mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Đang gửi yêu cầu phê duyệt…
            </>
          ) : (
            'Gửi yêu cầu phê duyệt'
          )}
        </button>
      </form>
    </Dialog>
  )
}
