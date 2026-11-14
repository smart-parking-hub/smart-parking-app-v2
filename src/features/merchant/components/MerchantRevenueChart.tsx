import { money } from '@/shared/components/Workspace'
import type { RevenuePoint } from '../operations/merchantFinanceApi'

export function MerchantRevenueChart({ points }: { points: RevenuePoint[] }) {
  const maxRevenue = Math.max(1, ...points.map(point => Math.abs(point.revenue)))
  if (!points.length || points.every(point => point.revenue === 0 && point.bookingCount === 0)) {
    return <p className="py-12 text-center text-sm text-brand-muted">Chưa có doanh thu trong khoảng thời gian này.</p>
  }
  return (
    <figure aria-label="Biểu đồ doanh thu theo kỳ">
      <figcaption className="mb-4 text-sm text-brand-muted">
        Doanh thu sau phí từ thanh toán thành công; chưa đồng nghĩa với tiền đã quyết toán vào ví.
      </figcaption>
      <div className="flex min-h-64 items-end gap-3 overflow-x-auto border-b border-brand-border pb-3" tabIndex={0} aria-label="Cuộn các kỳ doanh thu">
        {points.map(point => (
          <div key={point.period} className="flex min-w-24 flex-1 flex-col items-center gap-3">
            <span className="whitespace-nowrap text-xs font-semibold">{money(point.revenue)}</span>
            <div aria-hidden="true" className="w-full max-w-12 rounded-t-md bg-brand-primary"
              style={{ height: `${Math.abs(point.revenue) / maxRevenue * 180}px` }} />
            <span className="text-xs text-brand-muted">{point.period}</span>
            <span className="text-xs">{point.bookingCount} lượt</span>
          </div>
        ))}
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold">Xem bảng số liệu doanh thu</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left tabular-nums">
            <caption className="sr-only">Số liệu của biểu đồ doanh thu</caption>
            <thead><tr><th scope="col" className="p-2">Kỳ</th><th scope="col" className="p-2">Doanh thu sau phí</th><th scope="col" className="p-2">Lượt ghi nhận</th></tr></thead>
            <tbody>{points.map(point => <tr key={point.period} className="border-t border-brand-border"><th scope="row" className="p-2 font-normal">{point.period}</th><td className="p-2">{money(point.revenue)}</td><td className="p-2">{point.bookingCount}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
