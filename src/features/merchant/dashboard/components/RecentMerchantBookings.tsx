import { ArrowRight, CarFront, ClipboardList, MapPin } from 'lucide-react'
import { useId } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/shared/components/Badge'
import type { fetchMerchantDashboardData } from '../api/merchantDashboardApi'

type RecentBookings = Awaited<ReturnType<typeof fetchMerchantDashboardData>>['bookings']['content']

export function RecentMerchantBookings({ bookings }: { bookings: RecentBookings }) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="@container min-w-0 overflow-hidden rounded-2xl border border-brand-border bg-white font-body text-brand-navy"
    >
      <header className="flex items-start gap-3 px-5 py-5 @min-[640px]:px-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-muted">
          <ClipboardList size={20} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 id={titleId} className="font-heading text-base font-semibold tracking-tight @min-[640px]:text-lg">
              Đặt chỗ gần nhất
            </h2>
            {bookings.length > 0 && (
              <span className="rounded-md bg-brand-surface px-2 py-0.5 text-xs font-semibold tabular-nums text-brand-muted">
                {bookings.length} lượt
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-brand-muted">Theo dõi các lượt đặt chỗ mới nhất.</p>
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="mx-5 mb-5 rounded-xl border border-dashed border-brand-border bg-brand-surface px-4 py-8 text-center @min-[640px]:mx-6">
          <p className="text-sm font-semibold">Chưa có lượt đặt chỗ.</p>
          <p className="mt-1 text-sm text-brand-muted">Các lượt đặt chỗ mới sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <table className="block w-full table-fixed text-sm @min-[640px]:table">
          <caption className="sr-only">Các lượt đặt chỗ gần nhất: mã đặt chỗ, biển số, bãi đỗ và trạng thái.</caption>
          <thead className="hidden border-y border-brand-border bg-brand-surface/70 text-left text-xs font-semibold text-brand-muted @min-[640px]:table-header-group">
            <tr>
              <th scope="col" className="w-[25%] py-3 pl-6 pr-3">Mã đặt chỗ</th>
              <th scope="col" className="w-[19%] px-3 py-3">Biển số xe</th>
              <th scope="col" className="px-3 py-3">Bãi đỗ</th>
              <th scope="col" className="w-[160px] py-3 pl-3 pr-6 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="block divide-y divide-brand-border @min-[640px]:table-row-group">
            {bookings.map((booking) => (
              <tr key={booking.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-5 py-4 transition-colors hover:bg-brand-surface/60 @min-[640px]:table-row @min-[640px]:p-0">
                <td className="order-1 min-w-0 @min-[640px]:py-5 @min-[640px]:pl-6 @min-[640px]:pr-3">
                  <Link
                    to={`/merchant/bookings/${booking.id}`}
                    title={booking.bookingCode}
                    aria-label={booking.bookingCode}
                    className="inline-flex max-w-full items-center rounded-md font-mono text-xs font-semibold text-brand-navy decoration-brand-primary underline-offset-4 transition-colors hover:text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-4 active:opacity-70"
                  >
                    <span aria-hidden="true" className="truncate">
                      {booking.bookingCode.length > 20
                        ? `${booking.bookingCode.slice(0, 8)}…${booking.bookingCode.slice(-6)}`
                        : booking.bookingCode}
                    </span>
                  </Link>
                </td>
                <td className="order-3 min-w-0 @min-[640px]:px-3 @min-[640px]:py-5">
                  <span className="inline-flex max-w-full items-center gap-2 font-semibold tabular-nums">
                    <CarFront size={15} strokeWidth={1.75} className="shrink-0 text-brand-muted @min-[640px]:hidden" aria-hidden="true" />
                    <span className="truncate">{booking.vehicleLicensePlate || '—'}</span>
                  </span>
                </td>
                <td className="order-4 col-span-2 min-w-0 @min-[640px]:px-3 @min-[640px]:py-5">
                  <span className="flex items-start gap-2 text-brand-muted" title={booking.parkingLotName || undefined}>
                    <MapPin size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 @min-[640px]:hidden" aria-hidden="true" />
                    <span className="line-clamp-2 leading-5">{booking.parkingLotName || '—'}</span>
                  </span>
                </td>
                <td className="order-2 text-right @min-[640px]:py-5 @min-[640px]:pl-3 @min-[640px]:pr-6">
                  <Badge value={booking.status} dot className="max-w-full border-transparent px-2.5 py-1 text-[11px] normal-case tracking-normal" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <footer className="border-t border-brand-border">
        <Link
          to="/merchant/bookings"
          className="group flex min-h-14 items-center justify-between gap-3 px-5 py-4 text-sm font-semibold transition-colors hover:bg-brand-surface hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary active:bg-brand-surface @min-[640px]:px-6"
        >
          Xem tất cả đặt chỗ
          <ArrowRight size={17} strokeWidth={1.75} className="shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
        </Link>
      </footer>
    </section>
  )
}
