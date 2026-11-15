import { useQuery } from '@tanstack/react-query'
import { ShieldCheck } from 'lucide-react'
import type { Withdrawal } from '@/entities/operations'
import { BANKS_QUERY_KEY, BankLogo, fetchBanks } from '@/entities/bank'
import { money } from '@/shared/components/Workspace'

export type WithdrawalInfo = Pick<Withdrawal, 'id' | 'amount'> & Partial<Pick<Withdrawal,
  'bankName' | 'bankAccountNumber' | 'maskedBankAccount' | 'accountHolderName' | 'merchantName'>>

export function WithdrawalSummary({ withdrawal }: { withdrawal: WithdrawalInfo }) {
  const banks = useQuery({
    queryKey: BANKS_QUERY_KEY,
    queryFn: ({ signal }) => fetchBanks(signal),
    staleTime: 86400000,
    gcTime: 86400000,
    retry: false,
    enabled: Boolean(withdrawal.bankName),
  })
  const bankName = withdrawal.bankName?.trim() ?? ''
  const normalized = bankName.toLocaleLowerCase('vi')
  const bank = banks.data?.find(item =>
    [item.shortName, item.name, item.code, item.bin].some(name => name.toLocaleLowerCase('vi') === normalized),
  ) ?? banks.data?.find(item =>
    [item.shortName, item.code].some(name => normalized.startsWith(`${name.toLocaleLowerCase('vi')} `)),
  )
  const account = withdrawal.bankAccountNumber?.trim()

  return (
    <section aria-label="Thông tin chuyển khoản" className="overflow-hidden rounded-2xl border border-brand-border text-brand-navy">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-surface px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
          Lệnh rút tiền #{withdrawal.id}
        </p>
        <div className="sm:text-right">
          <p className="mb-1 text-xs text-brand-muted">Số tiền duyệt chi</p>
          <p className="font-sora text-2xl font-bold tabular-nums text-brand-primary">
            {money(withdrawal.amount)}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center gap-3">
          <BankLogo key={bank?.bin ?? bankName} bank={bank} prominent />
          <div className="min-w-0">
            <p className="text-xs text-brand-muted">Ngân hàng thụ hưởng</p>
            <p className="mt-1 break-words text-base font-semibold">{bankName || 'Chưa có thông tin ngân hàng'}</p>
          </div>
        </div>

        <dl className="space-y-4">
          <div className="rounded-xl border border-brand-border bg-brand-surface/60 px-4 py-3">
            <dt className="text-xs text-brand-muted">Số tài khoản</dt>
            <dd className="mt-1 select-all break-all font-mono text-2xl font-bold leading-snug tracking-wide tabular-nums">
              {account || withdrawal.maskedBankAccount || '—'}
            </dd>
            {!account && <dd className="mt-1 text-xs text-brand-muted">Chưa có số tài khoản đầy đủ.</dd>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-brand-muted">Tên chủ tài khoản</dt>
              <dd className="mt-1 break-words text-sm font-semibold uppercase">{withdrawal.accountHolderName || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-brand-muted">Chủ bãi thụ hưởng</dt>
              <dd className="mt-1 break-words text-sm font-medium">{withdrawal.merchantName || '—'}</dd>
            </div>
          </div>
        </dl>
      </div>

      <p className="flex items-start gap-2 border-t border-brand-border px-5 py-3 text-xs leading-relaxed text-brand-muted">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        Vui lòng kiểm tra kỹ số tài khoản và ngân hàng thụ hưởng trước khi bấm xác nhận chuyển tiền.
      </p>
    </section>
  )
}
