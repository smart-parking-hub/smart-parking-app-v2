import { money } from '@/shared/components/Workspace'
import type { RevenuePoint } from '../operations/merchantFinanceApi'

export function MerchantRevenueChart({ points }: { points: RevenuePoint[] }) {
  const normalized = points.map((point) => {
    const transfer = point.revenue ?? 0
    const cash = point.cashRevenue ?? 0
    return {
      ...point,
      transfer,
      cash,
      combined: transfer + cash,
    }
  })

  const maxBar = Math.max(
    1,
    ...normalized.map((point) =>
      Math.max(Math.abs(point.transfer), Math.abs(point.cash)),
    ),
  )

  if (
    !normalized.length ||
    normalized.every((point) => point.combined === 0 && point.bookingCount === 0)
  ) {
    return (
      <p className="py-12 text-center text-sm text-brand-muted">
        Chưa có doanh thu trong khoảng thời gian này.
      </p>
    )
  }

  return (
    <figure aria-label="Biểu đồ doanh thu theo kỳ">
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-brand-muted">
        <span>So sánh 2 cột đứng cạnh nhau: Chuyển khoản (sau phí) và Tiền mặt.</span>
        <span className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#0d1c2e]" />
            Chuyển khoản (sau phí)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#d95f00]" />
            Tiền mặt
          </span>
        </span>
      </figcaption>

      <div
        className="flex min-h-64 items-end gap-4 overflow-x-auto border-b border-brand-border pb-3 pt-4"
        tabIndex={0}
        aria-label="Cuộn các kỳ doanh thu"
      >
        {normalized.map((point) => {
          const transferPx =
            point.transfer > 0
              ? Math.max(6, (Math.abs(point.transfer) / maxBar) * 168)
              : 0
          const cashPx =
            point.cash > 0
              ? Math.max(6, (Math.abs(point.cash) / maxBar) * 168)
              : 0

          return (
            <div
              key={point.period}
              className="flex min-w-28 flex-1 flex-col items-center gap-2"
            >
              <span className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-brand-navy">
                {money(point.combined)}
              </span>

              {/* 2 grouped bars side by side */}
              <div className="flex h-[176px] items-end justify-center gap-1.5">
                <div
                  aria-hidden="true"
                  title={`Chuyển khoản: ${money(point.transfer)}`}
                  className="w-5 rounded-t-md bg-[#0d1c2e]"
                  style={{ height: `${transferPx}px` }}
                />
                <div
                  aria-hidden="true"
                  title={`Tiền mặt: ${money(point.cash)}`}
                  className="w-5 rounded-t-md bg-[#d95f00]"
                  style={{ height: `${cashPx}px` }}
                />
              </div>

              <span className="text-xs font-medium text-brand-muted">
                {point.period}
              </span>
              <span className="text-[11px] text-slate-600">
                {point.bookingCount} lượt
              </span>
            </div>
          )
        })}
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold">
          Xem bảng số liệu doanh thu
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[540px] text-left tabular-nums">
            <caption className="sr-only">
              Số liệu của biểu đồ doanh thu theo chuyển khoản và tiền mặt
            </caption>
            <thead>
              <tr className="border-b border-brand-border text-xs uppercase text-brand-muted">
                <th scope="col" className="p-2">
                  Kỳ
                </th>
                <th scope="col" className="p-2 text-right">
                  Chuyển khoản
                </th>
                <th scope="col" className="p-2 text-right">
                  Tiền mặt
                </th>
                <th scope="col" className="p-2 text-right">
                  Tổng thực thu
                </th>
                <th scope="col" className="p-2 text-right">
                  Lượt ghi nhận
                </th>
              </tr>
            </thead>
            <tbody>
              {normalized.map((point) => (
                <tr key={point.period} className="border-t border-brand-border">
                  <th scope="row" className="p-2 font-normal">
                    {point.period}
                  </th>
                  <td className="p-2 text-right">{money(point.transfer)}</td>
                  <td className="p-2 text-right font-semibold text-[#d95f00]">
                    {money(point.cash)}
                  </td>
                  <td className="p-2 text-right font-semibold">
                    {money(point.combined)}
                  </td>
                  <td className="p-2 text-right">{point.bookingCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
