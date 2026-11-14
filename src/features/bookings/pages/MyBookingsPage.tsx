import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
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
import { fetchBookings, BookingStatusPanel, type Booking } from '@/features/booking-flow'
import { CreateDisputeModal } from '../components/CreateDisputeModal'
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
  const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null)
  const [createdNotice, setCreatedNotice] = useState<Dispute | null>(null)

  const query = useQuery({
    queryKey: ['real-bookings'],
    queryFn: fetchBookings,
    retry: false,
    refetchInterval: 10000,
  })

  const disputesLookupQuery = useQuery({
    queryKey: ['driver-disputes-lookup'],
    queryFn: fetchDisputesLookupSafe,
    enabled: query.isSuccess && (query.data?.length ?? 0) > 0,
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
      ) : !query.data.length ? (
        <Notice>Bạn chưa có lượt đặt chỗ nào.</Notice>
      ) : (
        query.data.map((booking) => {
          const existingDispute = disputeByBookingId.get(booking.id)
          const canDispute = isBookingEligibleForDispute(booking.status)

          return (
            <Panel key={booking.id} title={booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}>
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-brand-muted">{booking.parkingLotAddress}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono font-semibold text-slate-800">
                      #{booking.id} · {booking.bookingCode}
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
                  aria-label={`Menu tác vụ đơn ${booking.bookingCode}`}
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
                      aria-label={`Gửi khiếu nại đơn ${booking.bookingCode}`}
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
                      <span className="sr-only">cho đơn {booking.bookingCode}</span>
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

              <BookingStatusPanel bookingId={booking.id} booking={booking} />
            </Panel>
          )
        })
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
