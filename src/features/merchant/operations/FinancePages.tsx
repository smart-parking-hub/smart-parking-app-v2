import { useId, useLayoutEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoaderCircle } from 'lucide-react'
import type { Revenue, Withdrawal } from '@/entities/operations'
import { BankField, BANKS_QUERY_KEY, type Bank } from '@/entities/bank'
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
import { Toast, ToastContainer } from '@/shared/components/Toast'
import { cn } from '@/shared/utils/cn'

export { MerchantRevenuePage } from './MerchantRevenuePage'

type WithdrawalForm = {
  amount: number
  bankName: string
  bankAccountNumber: string
  accountHolderName: string
}

export function MerchantWithdrawalsPage() {
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
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
      {toastMessage && (
        <ToastContainer position="top-right">
          <Toast
            variant="success"
            title="Thành công"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </ToastContainer>
      )}
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
          onSuccess={() => setToastMessage('Yêu cầu rút tiền thành công. Tiền sẽ được đối soát và chuyển trong 24h.')}
          onClose={() => setOpen(false)}
        />
      )}
    </Workspace>
  )
}

function WithdrawalDialog({
  balance,
  minimum,
  onSuccess,
  onClose,
}: {
  balance: number
  minimum: number
  onSuccess?: () => void
  onClose: () => void
}) {
  const formId = useId()
  const cache = useQueryClient()
  const [accountChoice, setAccountChoice] = useState<'default' | 'other'>('default')

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

  const profile = profileQuery.data
  const hasDefaultAccount = Boolean(
    profile?.bankName?.trim() &&
      /^\d{1,30}$/.test(profile?.bankAccountNum ?? '') &&
      profile?.fullName?.trim(),
  )
  const useDefaultAccount = accountChoice === 'default' && hasDefaultAccount
  const waitingForDefault = accountChoice === 'default' && profileQuery.isPending
  const form = useForm<WithdrawalForm>({
    resolver: zodResolver(
      z.object({
        amount: z.number().min(minimum).max(balance).int(),
        bankName: useDefaultAccount
          ? z.string()
          : z.string().trim().refine(
              value => cache.getQueryData<Bank[]>(BANKS_QUERY_KEY)
                ?.some(bank => bank.shortName === value),
              'Chọn ngân hàng từ danh sách.',
            ),
        bankAccountNumber: useDefaultAccount
          ? z.string()
          : z.string().regex(/^\d{1,30}$/),
        accountHolderName: useDefaultAccount ? z.string() : z.string().trim().min(1),
      }),
    ),
    defaultValues: { bankName: '', bankAccountNumber: '', accountHolderName: '' },
  })

  const mutation = useMutation({
    mutationFn: (data: WithdrawalForm) => sendData('post', '/api/v1/withdrawals', data),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['merchant-withdrawals'] })
      void cache.invalidateQueries({ queryKey: ['merchant-revenue'] })
      onSuccess?.()
      onClose()
    },
  })

  const isBalanceValid = balance >= minimum
  const errorCount = Object.keys(form.formState.errors).length
  useLayoutEffect(() => {
    if (errorCount > 0) {
      document.getElementById(formId)?.querySelector<HTMLElement>('[aria-invalid="true"]')?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [errorCount, formId])

  return (
    <Dialog
      title="Tạo yêu cầu rút tiền"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
      footer={<div className="space-y-4">
        {errorCount > 0 && (
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
          form={formId}
          className={cn(
            `${button} w-full`,
            (!isBalanceValid || waitingForDefault || mutation.isPending) &&
              'cursor-not-allowed opacity-60',
          )}
          disabled={!isBalanceValid || waitingForDefault || mutation.isPending}
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
      </div>}
    >
      <form
        id={formId}
        onSubmit={form.handleSubmit((data) => {
          if (waitingForDefault || mutation.isPending) return
          mutation.mutate(
            useDefaultAccount
              ? {
                  amount: data.amount,
                  bankName: profile?.bankName ?? '',
                  bankAccountNumber: profile?.bankAccountNum ?? '',
                  accountHolderName: profile?.fullName ?? '',
                }
              : data,
          )
        })}
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
          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                inputMode="numeric"
                className={cn(control, 'tabular-nums')}
                placeholder={`Nhập số tiền từ ${minimum.toLocaleString('vi-VN')} ₫`}
                value={
                  Number.isFinite(field.value)
                    ? field.value.toLocaleString('vi-VN')
                    : ''
                }
                aria-invalid={Boolean(form.formState.errors.amount)}
                onChange={(event) => {
                  const input = event.currentTarget
                  const raw = input.value
                  if (!/^[\d.,\s]*$/.test(raw)) return
                  const digitsBeforeCursor = raw
                    .slice(0, input.selectionStart ?? raw.length)
                    .replace(/\D/g, '').length
                  const digits = raw.replace(/\D/g, '')
                  const amount = digits ? Number(digits) : Number.NaN
                  if (digits && !Number.isSafeInteger(amount)) return
                  field.onChange(amount)
                  requestAnimationFrame(() => {
                    let cursor = 0
                    let seen = 0
                    while (
                      cursor < input.value.length && seen < digitsBeforeCursor
                    ) {
                      if (/\d/.test(input.value[cursor])) seen++
                      cursor++
                    }
                    input.setSelectionRange(cursor, cursor)
                  })
                }}
              />
            )}
          />
        </Field>
        {isBalanceValid && (
          <div className="-mt-2 flex flex-wrap items-center gap-2 text-xs text-brand-muted">
            <span className="font-medium">Chọn nhanh:</span>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-brand-primary hover:bg-slate-100 hover:border-brand-primary transition-colors cursor-pointer"
              onClick={() =>
                form.setValue('amount', minimum, { shouldValidate: true })
              }
            >
              Tối thiểu ({money(minimum)})
            </button>
            <button
              type="button"
              className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-brand-primary hover:bg-slate-100 hover:border-brand-primary transition-colors cursor-pointer"
              onClick={() =>
                form.setValue('amount', balance, { shouldValidate: true })
              }
            >
              Toàn bộ ({money(balance)})
            </button>
          </div>
        )}
        <fieldset className="space-y-3" disabled={mutation.isPending}>
          <legend className="mb-3 text-sm font-medium">Tài khoản nhận tiền</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={cn(
              'flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm',
              useDefaultAccount || waitingForDefault
                ? 'border-brand-primary bg-brand-surface'
                : 'border-brand-border',
              !hasDefaultAccount && !profileQuery.isPending && 'cursor-not-allowed opacity-50',
            )}>
              <input
                type="radio"
                name="receiving-account"
                value="default"
                checked={useDefaultAccount || waitingForDefault}
                disabled={!hasDefaultAccount || profileQuery.isPending}
                onChange={() => { setAccountChoice('default'); form.clearErrors() }}
                className="accent-brand-primary"
              />
              Tài khoản mặc định
            </label>
            <label className={cn(
              'flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm',
              !useDefaultAccount && !waitingForDefault
                ? 'border-brand-primary bg-brand-surface'
                : 'border-brand-border',
            )}>
              <input
                type="radio"
                name="receiving-account"
                value="other"
                checked={!useDefaultAccount && !waitingForDefault}
                onChange={() => { setAccountChoice('other'); form.clearErrors() }}
                className="accent-brand-primary"
              />
              Tài khoản khác
            </label>
          </div>
          {waitingForDefault ? (
            <p role="status" className="text-sm text-brand-muted">Đang tải tài khoản mặc định…</p>
          ) : useDefaultAccount ? (
            <div className="rounded-xl border border-brand-border bg-brand-surface p-4 text-sm">
              <p className="font-semibold">{profile?.bankName}</p>
              <p className="mt-1 break-all tabular-nums">{profile?.bankAccountNum}</p>
              <p className="mt-1 break-words text-brand-muted">{profile?.fullName}</p>
              <p className="mt-3 text-xs text-brand-muted">Tài khoản ngân hàng đã lưu trong hồ sơ.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-brand-muted">
                {profileQuery.isError
                  ? 'Không tải được tài khoản mặc định. Bạn có thể nhập tài khoản nhận tiền bên dưới.'
                  : !hasDefaultAccount && !profileQuery.isPending
                    ? 'Hồ sơ chưa có đủ thông tin tài khoản mặc định. Vui lòng nhập tài khoản nhận tiền.'
                    : 'Nhập tài khoản dùng cho yêu cầu này. Tài khoản mặc định trong hồ sơ vẫn được giữ nguyên.'}
              </p>
              <BankField
                control={form.control}
                name="bankName"
                label="Ngân hàng nhận"
                disabled={mutation.isPending}
              />
              {(['bankAccountNumber', 'accountHolderName'] as const).map(
                (key) => (
                  <Field
                    key={key}
                    label={
                      {
                        bankAccountNumber: 'Số tài khoản thụ hưởng',
                        accountHolderName: 'Tên chủ tài khoản',
                      }[key]
                    }
                  >
                    <input
                      className={control}
                      placeholder={
                        {
                          bankAccountNumber: 'Nhập số tài khoản ngân hàng',
                          accountHolderName: 'NGUYEN VAN A',
                        }[key]
                      }
                      inputMode={key === 'bankAccountNumber' ? 'numeric' : undefined}
                      aria-invalid={Boolean(form.formState.errors[key])}
                      {...form.register(key)}
                    />
                  </Field>
                ),
              )}
            </div>
          )}
        </fieldset>
      </form>
    </Dialog>
  )
}
