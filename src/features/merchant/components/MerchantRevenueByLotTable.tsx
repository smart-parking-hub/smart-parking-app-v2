import { Banknote, CheckCircle2, Filter } from 'lucide-react'
import type { LotRevenueBreakdown } from '@/entities/operations'
import { Badge, Panel, money } from '@/shared/components/Workspace'
import { resolveLotTransferGross } from './merchantRevenueMetrics'

export interface LotTableItem {
  id: number
  name: string
  address?: string | null
  status?: string | null
}

export interface MerchantRevenueByLotTableProps {
  lots: LotTableItem[]
  breakdowns: LotRevenueBreakdown[]
  selectedLotId: number | null
  onSelectLot: (lotId: number | null) => void
  usePeriodValues: boolean
  useGrossTransfer?: boolean
  periodLabel: string
}

export function MerchantRevenueByLotTable({
  lots,
  breakdowns,
  selectedLotId,
  onSelectLot,
  usePeriodValues,
  useGrossTransfer = false,
  periodLabel,
}: MerchantRevenueByLotTableProps) {
  const breakdownByLotId = new Map<number, LotRevenueBreakdown>()
  for (const b of breakdowns) {
    breakdownByLotId.set(b.parkingLotId, b)
  }

  const resolveTransfer = (stats?: LotRevenueBreakdown) => {
    if (!stats) return 0
    if (useGrossTransfer) {
      return resolveLotTransferGross(stats, usePeriodValues)
    }
    if (usePeriodValues) {
      return (
        (stats.periodOnlineTransferRevenue ?? 0) +
        (stats.periodCounterQrRevenue ?? 0)
      )
    }
    return (
      (stats.onlineTransferRevenue ?? 0) +
      (stats.counterQrRevenue ?? 0)
    )
  }

  const resolveExtra = (stats?: LotRevenueBreakdown) => {
    const net = usePeriodValues ? stats?.periodUnclassifiedTransferRevenue : stats?.unclassifiedTransferRevenue
    const gross = usePeriodValues ? stats?.periodUnclassifiedTransferGrossRevenue : stats?.unclassifiedTransferGrossRevenue
    const pending = usePeriodValues ? stats?.periodPendingSettlementGrossRevenue : stats?.pendingSettlementGrossRevenue
    return {
      unclassified: (useGrossTransfer ? gross ?? net : net) ?? 0,
      pending: useGrossTransfer ? pending ?? 0 : 0,
    }
  }

  const rows = lots.map((lot) => {
    const stats = breakdownByLotId.get(lot.id)
    const transfer = resolveTransfer(stats)
    const transferCount = usePeriodValues
      ? (stats?.periodOnlineTransferCount ?? 0) + (stats?.periodCounterQrCount ?? 0)
      : (stats?.onlineTransferCount ?? 0) + (stats?.counterQrCount ?? 0)
    const cash = usePeriodValues
      ? (stats?.periodCashRevenue ?? 0)
      : (stats?.cashRevenue ?? 0)
    const cashCount = usePeriodValues
      ? (stats?.periodCashBookingCount ?? 0)
      : (stats?.cashBookingCount ?? 0)

    const cumulativeCash = stats?.cashRevenue ?? 0
    const extra = resolveExtra(stats)
    const total = transfer + cash + extra.unclassified + extra.pending

    return {
      lot,
      transfer,
      transferCount,
      cash,
      cashCount,
      cumulativeCash,
      total,
      ...extra,
    }
  })

  const knownIds = new Set(lots.map((l) => l.id))
  for (const b of breakdowns) {
    if (knownIds.has(b.parkingLotId)) continue
    const transfer = resolveTransfer(b)
    const transferCount = usePeriodValues
      ? (b.periodOnlineTransferCount ?? 0) + (b.periodCounterQrCount ?? 0)
      : (b.onlineTransferCount ?? 0) + (b.counterQrCount ?? 0)
    const cash = (usePeriodValues ? b.periodCashRevenue : b.cashRevenue) ?? 0
    const cashCount = usePeriodValues
      ? b.periodCashBookingCount
      : b.cashBookingCount
    const extra = resolveExtra(b)
    rows.push({
      lot: {
        id: b.parkingLotId,
        name: `Bãi đỗ #${b.parkingLotId}`,
        address: null,
        status: null,
      },
      transfer,
      transferCount,
      cash,
      cashCount,
      cumulativeCash: b.cashRevenue,
      total: transfer + cash + extra.unclassified + extra.pending,
      ...extra,
    })
  }

  const grandTransfer = rows.reduce((sum, r) => sum + r.transfer, 0)
  const grandTransferCount = rows.reduce((sum, r) => sum + r.transferCount, 0)
  const grandCash = rows.reduce((sum, r) => sum + r.cash, 0)
  const grandCashCount = rows.reduce((sum, r) => sum + r.cashCount, 0)
  const grandCumulativeCash = rows.reduce((sum, r) => sum + r.cumulativeCash, 0)
  const grandUnclassified = rows.reduce((sum, r) => sum + r.unclassified, 0)
  const grandPending = rows.reduce((sum, r) => sum + r.pending, 0)
  const hasUnclassified = rows.some((r) => r.unclassified !== 0)
  const grandTotal = grandTransfer + grandCash + grandUnclassified + grandPending

  if (rows.length === 0) {
    return null
  }

  return (
    <Panel className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-[#d95f00]">
            <Banknote className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-sora text-base font-bold text-[#0d1c2e] lg:text-lg">
              Thống kê tiền mặt &amp; chuyển khoản theo từng bãi
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kỳ hiển thị: <strong>{periodLabel}</strong> · Nhấn vào từng bãi để lọc nhanh toàn bộ biểu đồ và chỉ số.
            </p>
          </div>
        </div>
        {selectedLotId !== null && (
          <button
            type="button"
            onClick={() => onSelectLot(null)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-[#b84e00] hover:bg-orange-100 transition-colors cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Xem tổng tất cả bãi</span>
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90">
        <div className="overflow-x-auto">
          <table
            data-testid="merchant-revenue-by-lot-table"
            className="w-full min-w-[680px] text-left text-sm tabular-nums"
          >
          <caption className="sr-only">
            Bảng thống kê tổng và riêng từng bãi theo chuyển khoản và tiền mặt
          </caption>
          <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="py-3 pl-5 pr-3 md:pl-6">
                Cơ sở bãi đỗ
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                {useGrossTransfer ? 'Chuyển khoản (trước phí)' : 'Chuyển khoản (sau phí)'}
              </th>
              <th scope="col" className="px-3 py-3 text-right">
                Tiền mặt
              </th>
              {hasUnclassified && <th scope="col" className="px-3 py-3 text-right">Chưa phân loại</th>}
              <th scope="col" className="px-3 py-3 text-right">
                {useGrossTransfer ? 'Tổng doanh thu (trước phí)' : 'Tổng thực thu'}
              </th>
              <th scope="col" className="py-3 pl-3 pr-5 text-right md:pr-6">
                Tỷ trọng tiền mặt
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const isSelected = selectedLotId === row.lot.id
              const cashShareOfTotal =
                row.total > 0 ? Math.round((row.cash / row.total) * 1000) / 10 : 0
              const cashShareOfMerchant =
                grandCash > 0 ? Math.round((row.cash / grandCash) * 1000) / 10 : 0

              return (
                <tr
                  key={row.lot.id}
                  data-testid={`lot-revenue-row-${row.lot.id}`}
                  className={`transition-colors ${
                    isSelected ? 'bg-orange-50/70' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3.5 pl-5 pr-3 md:pl-6">
                    <button
                      type="button"
                      onClick={() => onSelectLot(isSelected ? null : row.lot.id)}
                      className="group flex flex-col items-start text-left cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#0d1c2e] group-hover:text-[#d95f00] group-hover:underline">
                        {isSelected && (
                          <CheckCircle2
                            className="h-3.5 w-3.5 shrink-0 text-[#d95f00]"
                            aria-hidden="true"
                          />
                        )}
                        <span>{row.lot.name}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {row.lot.address || '—'}
                      </span>
                      <span className="mt-1">
                        {row.lot.status ? (
                          <Badge value={row.lot.status} size="sm" />
                        ) : (
                          <span
                            data-testid={`lot-status-unknown-${row.lot.id}`}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                          >
                            Chưa xác định
                          </span>
                        )}
                      </span>
                    </button>
                  </td>

                  <td className="px-3 py-3.5 text-right align-top">
                    <p className="font-mono font-semibold text-[#0d1c2e]">
                      {money(row.transfer)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.transferCount} GD
                    </p>
                  </td>

                  <td className="px-3 py-3.5 text-right align-top">
                    <p className="font-mono font-bold text-[#0d1c2e]">
                      {money(row.cash)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.cashCount} lượt
                    </p>
                    {usePeriodValues && row.cumulativeCash !== row.cash && (
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Tích lũy: {money(row.cumulativeCash)}
                      </p>
                    )}
                  </td>
                  {hasUnclassified && <td className="px-3 py-3.5 text-right align-top font-mono">{money(row.unclassified)}</td>}

                  <td className="px-3 py-3.5 text-right align-top">
                    <p className="font-mono font-bold text-[#0d1c2e]">
                      {money(row.total)}
                    </p>
                    {row.pending > 0 && <p className="mt-0.5 text-xs text-slate-500">Chờ quyết toán: {money(row.pending)}</p>}
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {cashShareOfTotal}% tiền mặt
                    </p>
                  </td>

                  <td className="py-3.5 pl-3 pr-5 text-right align-top md:pr-6">
                    <div className="ml-auto flex w-28 flex-col items-end gap-1">
                      <span className="font-mono text-xs font-semibold text-[#0d1c2e]">
                        {cashShareOfMerchant}% tổng TM
                      </span>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{ width: `${Math.min(100, cashShareOfMerchant)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>

          <tfoot className="border-t border-slate-200 bg-slate-100 text-[#0d1c2e]">
            <tr data-testid="lot-revenue-total-row">
              <th
                scope="row"
                className="py-3.5 pl-5 pr-3 text-left font-sora text-xs font-bold uppercase tracking-wider text-slate-700 md:pl-6"
              >
                Tổng cộng ({rows.length} bãi đỗ)
              </th>
              <td className="px-3 py-3.5 text-right">
                <p className="font-mono font-bold text-[#0d1c2e]">
                  {money(grandTransfer)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {grandTransferCount} GD
                </p>
              </td>
              <td className="px-3 py-3.5 text-right">
                <p className="font-mono font-bold text-[#d95f00]">
                  {money(grandCash)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {grandCashCount} lượt
                </p>
                {usePeriodValues && grandCumulativeCash !== grandCash && (
                  <p className="text-[10px] text-slate-500">
                    Tích lũy: {money(grandCumulativeCash)}
                  </p>
                )}
              </td>
              {hasUnclassified && <td className="px-3 py-3.5 text-right font-mono font-bold">{money(grandUnclassified)}</td>}
              <td className="px-3 py-3.5 text-right">
                <p className="font-mono font-bold text-[#0d1c2e]">
                  {money(grandTotal)}
                </p>
                {grandPending > 0 && <p className="text-xs text-slate-500">Chờ quyết toán: {money(grandPending)}</p>}
                <p className="text-[11px] text-slate-500">
                  Chuyển khoản + Tiền mặt{hasUnclassified ? ' + Chưa phân loại' : ''}{grandPending > 0 ? ' + Chờ quyết toán' : ''}
                </p>
              </td>
              <td className="py-3.5 pl-3 pr-5 text-right font-mono text-xs font-bold text-[#d95f00] md:pr-6">
                {grandTotal > 0
                  ? `${Math.round((grandCash / grandTotal) * 1000) / 10}%`
                  : '0%'}
              </td>
            </tr>
          </tfoot>
        </table>
        </div>
      </div>
    </Panel>
  )
}
