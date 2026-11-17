import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronDown, ExternalLink, MoreHorizontal, Receipt, ShieldAlert } from 'lucide-react'
import type { Dispute } from '@/entities/operations'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from '@/shared/components/Dropdown'
import { Toast, ToastContainer } from '@/shared/components/Toast'
import { Workspace, Panel, Notice, Badge, secondary } from '@/shared/components/Workspace'
import { errorMessage, getData, type Page } from '@/shared/api/resources'
import { fetchBooking, fetchBookingsPage, formatMoney, statusLabels, bookingTimeLabel, BookingStatusPanel, type Booking } from '@/features/booking-flow'
import { CreateDisputeModal } from '../components/CreateDisputeModal'
import { bookingReference } from '@/entities/booking/bookingReference'
import { isBookingEligibleForDispute } from '../schemas/disputeSchemas'

async function fetchDisputesLookupSafe(): Promise<Dispute[]> {
  try {
    const raw = await getData<unknown>('/api/v1/disputes/me', { page: 0, size: 100 })
    if (
      raw &&
      typeof raw === 'object' &&
      'content' in raw &&
      Array.isArray((raw as { content?: unknown }).content)
    ) {
      return (raw as Page<Dispute>).content.filter(
        (item): item is Dispute =>
          item !== null &&
          typeof item === 'object' &&
          typeof item.id === 'number' &&
          typeof item.bookingId === 'number',
      )
    }
  } catch {
    // Non-blocking lookup: bookings list remains functional even if disputes service is unreachable
  }
  return []
}

export function MyBookingsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const selectedId = Number(params.get('bookingId'))
  const validSelection = Number.isSafeInteger(selectedId) && selectedId > 0
  const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null)
  const [createdNotice, setCreatedNotice] = useState<Dispute | null>(null)
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null | undefined>(undefined)
  const selected = useQuery({ queryKey: ['booking', selectedId], queryFn: () => fetchBooking(selectedId), enabled: validSelection, retry: false, refetchInterval: 10000 })
  const scrolledSelection = useRef<number | null>(null)
  useEffect(() => {
    if (!selected.data || scrolledSelection.current === selectedId) return
    scrolledSelection.current = selectedId
    document.getElementById(`selected-booking-${selectedId}`)?.scrollIntoView?.({ block: 'start' })
  }, [selected.data, selectedId])

  const query = useQuery({
    queryKey: ['real-bookings', page],
    queryFn: () => fetchBookingsPage(page),
    retry: false,
    refetchInterval: 10000,
  })

  const disputesLookupQuery = useQuery({
    queryKey: ['driver-disputes-lookup'],
    queryFn: fetchDisputesLookupSafe,
    enabled: query.isSuccess && (query.data?.content.length ?? 0) > 0,
    retry: false,
    staleTime: 30_000,
  })

  const disputeByBookingId = useMemo(() => {
    const map = new Map<number, Dispute>()
    for (const item of disputesLookupQuery.data ?? []) {
      map.set(item.bookingId, item)
    }
    return map
  }, [disputesLookupQuery.data])

  return (
    <Workspace
      title="Các lượt đặt chỗ của tôi"
      description="Theo dõi tiền cọc, hạn giữ chỗ, mã check-in và gửi khiếu nại trực tiếp theo từng đơn."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/disputes" className={secondary}>
            <ShieldAlert className="h-4 w-4 text-brand-primary" aria-hidden="true" />
            <span>Trung tâm khiếu nại</span>
          </Link>
          <Link to="/parking" className={secondary}>
            Tìm bãi trên bản đồ
          </Link>
        </div>
      }
    >
      {createdNotice && (
        <ToastContainer>
          <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-4 shadow-xl backdrop-blur-md">
            <Toast
              variant="success"
              title={`Đã gửi khiếu nại #KN-${createdNotice.id}`}
              message="Hồ sơ đã được chuyển tới quản trị viên và chủ bãi để đối soát."
              duration={8000}
              onClose={() => setCreatedNotice(null)}
              className="border-0 bg-transparent p-0 shadow-none"
            />
            <Link to={`/disputes/${createdNotice.id}`} className={`${secondary} self-start text-xs`}>
              Xem tiến độ xử lý #KN-{createdNotice.id}
            </Link>
          </div>
        </ToastContainer>
      )}

      {validSelection && <Panel className="space-y-4 ring-2 ring-brand-primary/20">
        <div id={`selected-booking-${selectedId}`} className="scroll-mt-[calc(var(--driver-header-height)+1rem)]"><h2 className="font-sora text-lg font-semibold">Vé vừa xem{selected.data ? ` · ${selected.data.parkingLotName || `Bãi đỗ #${selected.data.parkingLotId}`}` : ''}</h2><Link to="/bookings" className="mt-2 inline-block text-sm text-brand-muted underline">Đóng vé đang chọn</Link></div>
        {selected.isPending ? <p role="status">Đang tải vé đang chọn…</p> : selected.isError ? <Notice error><div>{errorMessage(selected.error)}<button className={`${secondary} mt-2`} onClick={() => void selected.refetch()}>Thử tải lại vé</button></div></Notice> : <BookingStatusPanel key={selectedId} bookingId={selectedId} booking={selected.data} embedded />}
      </Panel>}
      {query.isPending ? (
        <p role="status">Đang tải đặt chỗ…</p>
      ) : query.isError ? (
        <Notice error>
          <div>
            {errorMessage(query.error)}
            <button className={secondary} onClick={() => void query.refetch()}>
              Thử lại
            </button>
          </div>
        </Notice>
      ) : !query.data.content.length ? (
        <Notice>{page === 0 ? 'Bạn chưa có lượt đặt chỗ nào.' : 'Không có lượt đặt chỗ ở trang này.'}{page > 0 && <button className={secondary} onClick={() => setPage(0)}>Về trang đầu</button>}</Notice>
      ) : (
        <>
        <p className="text-sm text-brand-muted">{query.data.totalElements ?? query.data.content.length} lượt đặt chỗ · Mở từng vé để xem QR, thanh toán và chi tiết.</p>
        <div className="grid items-start gap-3 xl:grid-cols-2">
        {query.data.content.filter(booking => !selected.data || booking.id !== selectedId).map((booking) => {
          const existingDispute = disputeByBookingId.get(booking.id)
          const canDispute = isBookingEligibleForDispute(booking.status)
          const expanded = expandedId === booking.id || (!validSelection && expandedId === undefined && query.data.content.length === 1)

          return (
            <Panel key={booking.id} className="!p-4 sm:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-sora text-base font-semibold">{booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}</h2>
                  <p className="mt-1 truncate text-xs text-brand-muted" title={booking.parkingLotAddress ?? undefined}>{booking.parkingLotAddress}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="max-w-56 truncate rounded-md bg-slate-100 px-2 py-0.5 font-mono font-semibold text-slate-800" title={bookingReference(booking)}>
                      {booking.status === 'PENDING_PAYMENT' ? `Số đơn #${booking.id}` : `#${booking.id} · ${booking.bookingCode}`}
                    </span>
                    {booking.vehiclePlate && (
                      <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono font-semibold text-slate-700">
                        {booking.vehiclePlate}
                      </span>
                    )}
                    {existingDispute && (
                      <Badge value={existingDispute.status} size="sm" dot>
                        Khiếu nại KN-{existingDispute.id}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Menu tác vụ đơn đỗ xe */}
                <div
                  role="region"
                  aria-label={`Menu tác vụ đơn ${bookingReference(booking)}`}
                  className="flex flex-wrap items-center gap-2 self-start sm:self-center"
                >
                  {existingDispute ? (
                    <Link
                      to={`/disputes/${existingDispute.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-semibold text-brand-primary-active hover:bg-orange-100 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Xem khiếu nại #KN-{existingDispute.id}</span>
                    </Link>
                  ) : canDispute ? (
                    <button
                      type="button"
                      onClick={() => setDisputeBooking(booking)}
                      aria-label={`Gửi khiếu nại đơn ${bookingReference(booking)}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:border-brand-primary hover:bg-brand-primary-subtle hover:text-brand-primary-active transition-colors shadow-2xs cursor-pointer"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-brand-primary" aria-hidden="true" />
                      <span>Gửi khiếu nại</span>
                    </button>
                  ) : null}

                  <Dropdown>
                    <DropdownTrigger
                      className="gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
                      <span className="hidden sm:inline">Tác vụ</span>
                      <span className="sr-only">cho đơn {bookingReference(booking)}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    </DropdownTrigger>
                    <DropdownContent align="right" width="w-60">
                      {existingDispute ? (
                        <DropdownItem
                          icon={<ExternalLink className="h-4 w-4 text-brand-primary" />}
                          onClick={() => navigate(`/disputes/${existingDispute.id}`)}
                        >
                          Xem khiếu nại #KN-{existingDispute.id}
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          icon={<ShieldAlert className="h-4 w-4 text-brand-primary" />}
                          disabled={!canDispute}
                          onClick={() => setDisputeBooking(booking)}
                        >
                          {canDispute ? 'Gửi khiếu nại sự cố / phí' : 'Chưa thể khiếu nại ở trạng thái này'}
                        </DropdownItem>
                      )}
                      <DropdownSeparator />
                      <DropdownItem
                        icon={<Receipt className="h-4 w-4 text-slate-500" />}
                        onClick={() => navigate('/payments')}
                      >
                        Lịch sử thanh toán
                      </DropdownItem>
                    </DropdownContent>
                  </Dropdown>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                  <Badge value={booking.status}>{statusLabels[booking.status]}</Badge>
                  <span className="text-brand-muted">Vào <strong className="font-medium text-brand-navy">{bookingTimeLabel(booking.expectedCheckInTime)}</strong><br/>Ra <strong className="font-medium text-brand-navy">{bookingTimeLabel(booking.expectedCheckOutTime)}</strong></span>
                  <span className="text-brand-muted">{['AWAITING_FINAL_PAYMENT','COMPLETED','REVIEWED'].includes(booking.status) ? 'Phí quyết toán' : 'Phí dự kiến'}<strong className="ml-2 text-brand-navy">{booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}</strong><br/>Cọc <strong className="ml-2 text-brand-navy">{formatMoney(booking.advanceDeposit)}</strong></span>
                </div>
                <button type="button" className={`${secondary} !px-3 !py-2 !text-xs`} aria-expanded={expanded} aria-controls={`booking-detail-${booking.id}`} onClick={() => setExpandedId(expanded ? null : booking.id)}>
                  {expanded ? 'Thu gọn' : 'Xem vé & chi tiết'}<ChevronDown size={14} className={expanded ? 'rotate-180' : ''} aria-hidden="true"/>
                </button>
              </div>
              {expanded && <div id={`booking-detail-${booking.id}`} className="mt-4 border-t border-brand-border pt-4"><BookingStatusPanel bookingId={booking.id} booking={booking} embedded /></div>}
            </Panel>
          )
        })}
        </div>
        {(query.data.totalPages ?? 1) > 1 && <nav aria-label="Phân trang vé đặt chỗ" className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-brand-muted">Trang {page + 1} / {query.data.totalPages}</span>
          <div className="flex gap-2"><button className={secondary} disabled={page === 0 || query.isFetching} onClick={() => { setExpandedId(undefined); setPage(page - 1) }}>Trang trước</button><button className={secondary} disabled={page + 1 >= query.data.totalPages || query.isFetching} onClick={() => { setExpandedId(undefined); setPage(page + 1) }}>Trang sau</button></div>
        </nav>}
        </>
      )}

      {disputeBooking && (
        <CreateDisputeModal
          isOpen={Boolean(disputeBooking)}
          initialBooking={disputeBooking}
          onClose={() => setDisputeBooking(null)}
          onSuccess={(created) => {
            setCreatedNotice(created)
            setDisputeBooking(null)
          }}
        />
      )}
    </Workspace>
  )
}
