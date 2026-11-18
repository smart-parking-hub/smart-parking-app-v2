import { Banknote, Building2, CreditCard, HelpCircle } from 'lucide-react'
import { Panel, money } from '@/shared/components/Workspace'

export interface MerchantChannelBreakdownCardsProps {
  transferAmount: number
  transferCount: number
  cashAmount: number
  cashBookingCount: number
  unclassifiedAmount?: number
  unclassifiedCount?: number
  pendingAmount?: number
  scopeLabel: string
  periodLabel: string
}

export function MerchantChannelBreakdownCards({
  transferAmount,
  transferCount,
  cashAmount,
  cashBookingCount,
  unclassifiedAmount = 0,
  unclassifiedCount = 0,
  pendingAmount = 0,
  scopeLabel,
  periodLabel,
}: MerchantChannelBreakdownCardsProps) {
  const hasUnclassified = unclassifiedAmount > 0 || unclassifiedCount > 0
  const totalCombined = transferAmount + cashAmount + unclassifiedAmount + pendingAmount
  const pct = (value: number) =>
    totalCombined > 0 ? Math.round((value / totalCombined) * 1000) / 10 : 0

  const transferPct = pct(transferAmount)
  const cashPct = pct(cashAmount)
  const unclassifiedPct = pct(unclassifiedAmount)

  const channels = [
    {
      key: 'transfer',
      label: 'Chuyển khoản (trước phí)',
      amount: transferAmount,
      count: transferCount,
      countUnit: 'giao dịch',
      share: transferPct,
      icon: CreditCard,
      iconBg: 'bg-slate-900/5 text-[#0d1c2e] border-slate-200',
      valueColor: 'text-[#0d1c2e]',
    },
    {
      key: 'cash',
      label: 'Tiền mặt',
      amount: cashAmount,
      count: cashBookingCount,
      countUnit: 'lượt',
      share: cashPct,
      icon: Banknote,
      iconBg: 'bg-orange-50 text-[#d95f00] border-orange-200',
      valueColor: 'text-[#0d1c2e]',
    },
    ...(hasUnclassified
      ? [
        {
          key: 'unclassified',
          label: 'Chưa phân loại (trước phí)',
          amount: unclassifiedAmount,
          count: unclassifiedCount,
          countUnit: 'giao dịch',
          share: unclassifiedPct,
          icon: HelpCircle,
          iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
          valueColor: 'text-amber-900',
        },
      ]
      : []),
  ] as const

  return (
    <Panel className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#d95f00]">
            PHÂN BỔ THEO HÌNH THỨC THANH TOÁN
          </p>
          <h2 className="mt-0.5 font-sora text-base font-bold text-[#0d1c2e] lg:text-lg">
            Chi tiết kênh doanh thu · {scopeLabel}
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
          <Building2 className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          <span>{periodLabel}</span>
          <span className="text-slate-300">·</span>
          <span className="font-mono tabular-nums text-[#0d1c2e]">
            Tổng doanh thu (trước phí): {money(totalCombined)}
          </span>
        </div>
      </div>

      {pendingAmount > 0 && <p className="text-xs text-slate-600">
        Chờ quyết toán: <strong>{money(pendingAmount)}</strong>. Đã tính vào tổng doanh thu trước phí, chưa cộng vào ví.
      </p>}

      {/* Horizontal channel proportion strip */}
      {totalCombined > 0 && (
        <div className="space-y-1.5" aria-label="Tỷ trọng theo kênh doanh thu">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            {transferAmount > 0 && (
              <div
                style={{ width: `${(transferAmount / totalCombined) * 100}%` }}
                className="bg-slate-400 transition-all duration-300"
                title={`Chuyển khoản: ${transferPct}%`}
              />
            )}
            {cashAmount > 0 && (
              <div
                style={{ width: `${(cashAmount / totalCombined) * 100}%` }}
                className="bg-orange-500 transition-all duration-300"
                title={`Tiền mặt: ${cashPct}%`}
              />
            )}
            {unclassifiedAmount > 0 && (
              <div
                style={{ width: `${(unclassifiedAmount / totalCombined) * 100}%` }}
                className="bg-amber-400 transition-all duration-300"
                title={`Chưa phân loại: ${unclassifiedPct}%`}
              />
            )}
            {pendingAmount > 0 && <div
              style={{ width: `${(pendingAmount / totalCombined) * 100}%` }}
              className="bg-slate-200"
              title={`Chờ quyết toán: ${pct(pendingAmount)}%`}
            />}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-slate-400" />
              Chuyển khoản ({transferPct}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-orange-500" />
              Tiền mặt ({cashPct}%)
            </span>
            {unclassifiedAmount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-amber-800">
                <span className="h-2.5 w-2.5 rounded-xs bg-amber-400" />
                Chưa phân loại ({unclassifiedPct}%)
              </span>
            )}
            {pendingAmount > 0 && <span>Chờ quyết toán ({pct(pendingAmount)}%)</span>}
          </div>
        </div>
      )}

      <div
        data-testid="merchant-channel-breakdown-cards"
        className={`grid grid-cols-1 gap-3.5 ${hasUnclassified ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
      >
        {channels.map((ch) => {
          const Icon = ch.icon
          return (
            <div
              key={ch.key}
              data-testid={`channel-card-${ch.key}`}
              className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition-colors hover:bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${ch.iconBg}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-[#0d1c2e]">{ch.label}</p>
                </div>
                <span className="rounded-lg bg-white px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums text-slate-700 border border-slate-200">
                  {ch.share}%
                </span>
              </div>

              <div className="mt-3.5 flex items-baseline justify-between gap-2">
                <p
                  className={`font-sora text-xl font-bold tabular-nums ${ch.valueColor}`}
                >
                  {money(ch.amount)}
                </p>
                <p className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                  {ch.count} {ch.countUnit}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
