import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  ExternalLink,
  FileWarning,
  MapPin,
  PhoneCall,
  RefreshCw,
  Search,
} from 'lucide-react'
import type { Dispute } from '@/entities/operations'
import { errorMessage, type Page } from '@/shared/api/resources'
import { Breadcrumb } from '@/shared/components/Breadcrumb'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/Skeleton'
import { Toast } from '@/shared/components/Toast'
import {
  Badge,
  DataTable,
  Notice,
  Panel,
  Workspace,
  secondary,
} from '@/shared/components/Workspace'
import { CreateDisputeModal, type DisputeBookingSummary } from '@/features/bookings'
import { formatMoney, statusLabels, type Booking } from '@/features/booking-flow'
import {
  disputeTimeLabel,
  fetchBookingSummarySafe,
  fetchDriverBookingsMapSafe,
  fetchDriverDisputeById,
  fetchDriverDisputesPage,
  fetchPaymentsForBookingSafe,
  normalizeDisputeStatus,
  parseDisputeDescription,
} from '../api/driverDisputesApi'
import { CompensationRecordCard } from '../components/CompensationRecordCard'
import { DisputeEvidenceGallery } from '../components/DisputeEvidenceGallery'
import { DisputeMobileCard } from '../components/DisputeMobileCard'
import { DisputeStatusStepper } from '../components/DisputeStatusStepper'

type StatusFilter = 'ALL' | 'PENDING' | 'RESOLVED' | 'REJECTED'

function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia('(max-width: 767px)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const onChange = () => setIsMobile(mediaQuery.matches)
    onChange()
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    }
    mediaQuery.addListener(onChange)
    return () => mediaQuery.removeListener(onChange)
  }, [])

  return isMobile
}

export function DriverDisputesPage({ detail = false }: { detail?: boolean }) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const prefillBookingId = params.get('bookingId')

  const [openCreateModal, setOpenCreateModal] = useState(() => Boolean(prefillBookingId))
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [mobileSearch, setMobileSearch] = useState('')
  const [createdToast, setCreatedToast] = useState<Dispute | null>(null)
  const isMobile = useIsMobileViewport()

  const listQuery = useQuery({
    queryKey: ['disputes', 'driver', undefined, page],
    queryFn: () => fetchDriverDisputesPage(page, 20),
    enabled: !detail,
    retry: false,
  })

  const detailQuery = useQuery({
    queryKey: ['disputes', 'driver', id, 0],
    queryFn: () => fetchDriverDisputeById(id ?? ''),
    enabled: detail && Boolean(id),
    retry: false,
  })

  const listRows = useMemo(() => {
    const raw = listQuery.data as Page<Dispute> | undefined
    return Array.isArray(raw?.content) ? raw.content : []
  }, [listQuery.data])

  const bookingsMapQuery = useQuery({
    queryKey: ['disputes-driver-bookings-map'],
    queryFn: fetchDriverBookingsMapSafe,
    enabled: !detail && listRows.length > 0,
    retry: false,
    staleTime: 60_000,
  })

  const statusCounts = useMemo(() => {
    let pending = 0
    let resolved = 0
    let rejected = 0
    for (const row of listRows) {
      const normalized = normalizeDisputeStatus(row.status)
      if (normalized === 'RESOLVED') resolved += 1
      else if (normalized === 'REJECTED') rejected += 1
      else pending += 1
    }
    return {
      totalOnServer: listQuery.data?.totalElements ?? listRows.length,
      allOnPage: listRows.length,
      pending,
      resolved,
      rejected,
    }
  }, [listRows, listQuery.data?.totalElements])

  const filteredRows = useMemo(() => {
    return listRows.filter((row) => {
      if (statusFilter === 'ALL') return true
      return normalizeDisputeStatus(row.status) === statusFilter
    })
  }, [listRows, statusFilter])

  const mobileFilteredRows = useMemo(() => {
    const kw = mobileSearch.trim().toLocaleLowerCase('vi')
    if (!kw) return filteredRows
    const map = bookingsMapQuery.data ?? {}
    return filteredRows.filter((row) => {
      const booking = map[row.bookingId]
      const hay = `${row.id} KN-${row.id} ${row.bookingId} ${booking?.bookingCode ?? ''} ${row.reason}`.toLocaleLowerCase('vi')
      return hay.includes(kw)
    })
  }, [filteredRows, mobileSearch, bookingsMapQuery.data])

  if (detail) {
    return (
      <Workspace
        title={`Hồ sơ khiếu nại #${id}`}
        eyebrow="DRIVER / SUPPORT"
        description="Theo dõi tiến độ xử lý, kết quả bồi thường và thông tin đơn đỗ xe liên kết."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Link className={secondary} to="/disputes">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Danh sách</span>
            </Link>
            <Link className={secondary} to="/bookings">
              <span>Đơn đỗ xe của tôi</span>
            </Link>
          </div>
        }
      >
        <Breadcrumb
          items={[
            { label: 'Trung tâm khiếu nại', href: '/disputes' },
            { label: `Hồ sơ KN-${id}` },
          ]}
        />

        {detailQuery.isPending ? (
          <div className="space-y-4">
            <Skeleton variant="card" />
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Skeleton variant="card" />
              </div>
              <div className="lg:col-span-5">
                <Skeleton variant="card" />
              </div>
            </div>
          </div>
        ) : detailQuery.isError ? (
          <Notice error>
            <div className="flex flex-wrap items-center justify-between gap-3 w-full">
              <span>{errorMessage(detailQuery.error)}</span>
              <button
                type="button"
                className={secondary}
                onClick={() => void detailQuery.refetch()}
              >
                Thử lại
              </button>
            </div>
          </Notice>
        ) : detailQuery.data ? (
          <DriverDisputeDetailContent dispute={detailQuery.data} />
        ) : (
          <Notice>Không tìm thấy thông tin khiếu nại.</Notice>
        )}
      </Workspace>
    )
  }

  const bookingsMap = bookingsMapQuery.data ?? {}
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1)

  return (
    <Workspace
      title="Trung tâm khiếu nại"
      eyebrow="DRIVER / SUPPORT"
      description="Khởi tạo khiếu nại về phí thu thêm, từ chối nhận xe hoặc sự cố bãi đỗ; theo dõi tiến độ Admin và biên bản bồi thường."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Link className={secondary} to="/bookings">
            <span>Lượt đặt chỗ của tôi</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-colors shadow-xs cursor-pointer"
            onClick={() => setOpenCreateModal(true)}
          >
            + Gửi khiếu nại
          </button>
        </div>
      }
    >
      {createdToast && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Toast
            variant="success"
            title={`Đã gửi khiếu nại #KN-${createdToast.id}`}
            message="Hồ sơ của bạn đã được ghi nhận ở trạng thái Chờ xử lý."
            duration={8000}
            onClose={() => setCreatedToast(null)}
            className="max-w-full"
          />
          <Link to={`/disputes/${createdToast.id}`} className={secondary}>
            Xem hồ sơ #KN-{createdToast.id}
          </Link>
        </div>
      )}

      {listQuery.isPending ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
          <Skeleton variant="table" rows={5} />
        </div>
      ) : listQuery.isError ? (
        <Notice error>
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <span>{errorMessage(listQuery.error)}</span>
            <button
              type="button"
              className={secondary}
              onClick={() => void listQuery.refetch()}
            >
              Thử lại
            </button>
          </div>
        </Notice>
      ) : (
        <>
          {/* Thẻ KPI gọn, nền trắng chữ đen đồng nhất */}
          <div
            aria-label="Thống kê hồ sơ khiếu nại"
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            {[
              { label: 'Tổng hồ sơ', value: statusCounts.totalOnServer },
              { label: 'Chờ xử lý', value: statusCounts.pending },
              { label: 'Đã giải quyết', value: statusCounts.resolved },
              { label: 'Từ chối', value: statusCounts.rejected },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200/90 bg-white px-4 py-3 shadow-2xs"
              >
                <p className="text-sm md:text-base font-medium text-slate-900">{stat.label}</p>
                <p className="mt-1 font-sora text-2xl md:text-3xl font-bold tabular-nums text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bộ lọc trạng thái đồng bộ với tab segmented nền sáng */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Lọc khiếu nại theo trạng thái"
              className="inline-flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1"
            >
              {(
                [
                  ['ALL', 'Tất cả', statusCounts.allOnPage],
                  ['PENDING', 'Chờ xử lý', statusCounts.pending],
                  ['RESOLVED', 'Đã giải quyết', statusCounts.resolved],
                  ['REJECTED', 'Từ chối', statusCounts.rejected],
                ] as const
              ).map(([tabKey, label, count]) => {
                const active = statusFilter === tabKey
                return (
                  <button
                    key={tabKey}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStatusFilter(tabKey)}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold tabular-nums text-orange-700">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              disabled={listQuery.isFetching}
              onClick={() => void listQuery.refetch()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`h-4 w-4 ${listQuery.isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Làm mới</span>
            </button>
          </div>

          {listRows.length === 0 ? (
            <EmptyState
              icon={FileWarning}
              title="Bạn chưa có hồ sơ khiếu nại nào"
              description="Nếu gặp sự cố thu thêm tiền mặt tại cổng, tính sai cước quá giờ hoặc bãi xe từ chối nhận xe dù đã đặt cọc, hãy tạo khiếu nại để Admin hỗ trợ đối soát."
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenCreateModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b84e00] transition-colors shadow-xs cursor-pointer"
                  >
                    Tạo khiếu nại đầu tiên
                  </button>
                  <Link to="/bookings" className={secondary}>
                    Chọn từ Đơn đỗ xe
                  </Link>
                </div>
              }
            />
          ) : isMobile ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={mobileSearch}
                  onChange={(event) => setMobileSearch(event.target.value)}
                  placeholder="Tìm mã KN-, booking hoặc lý do..."
                  aria-label="Tìm kiếm khiếu nại"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>

              {mobileFilteredRows.length === 0 ? (
                <EmptyState
                  variant="card"
                  title="Không có hồ sơ phù hợp"
                  description="Thử chọn trạng thái khác hoặc xóa từ khóa tìm kiếm."
                  action={
                    <button
                      type="button"
                      className={secondary}
                      onClick={() => {
                        setStatusFilter('ALL')
                        setMobileSearch('')
                      }}
                    >
                      Xóa bộ lọc
                    </button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {mobileFilteredRows.map((dispute) => (
                    <DisputeMobileCard
                      key={dispute.id}
                      dispute={dispute}
                      booking={bookingsMap[dispute.bookingId]}
                      detailHref={`/disputes/${dispute.id}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <button
                  type="button"
                  className={secondary}
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trước
                </button>
                <span className="text-sm font-semibold tabular-nums text-slate-700">
                  Trang {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className={secondary}
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          ) : filteredRows.length === 0 ? (
            <EmptyState
              variant="card"
              title="Không có khiếu nại ở trạng thái này"
              description="Chuyển về tab Tất cả để xem lại toàn bộ hồ sơ trên trang hiện tại."
              action={
                <button
                  type="button"
                  className={secondary}
                  onClick={() => setStatusFilter('ALL')}
                >
                  Xem tất cả trạng thái
                </button>
              }
            />
          ) : (
            <DataTable
              rows={filteredRows}
              page={page}
              totalPages={totalPages}
              totalItems={statusCounts.totalOnServer}
              onPage={setPage}
              detailLink={(r) => `/disputes/${r.id}`}
              searchPlaceholder="Tìm theo mã KN-, mã booking hoặc lý do..."
              searchText={(r) => {
                const booking = bookingsMap[r.bookingId]
                return `${r.id} KN-${r.id} ${r.bookingId} ${booking?.bookingCode ?? ''} ${r.reason}`
              }}
              columns={[
                {
                  label: 'Hồ sơ',
                  align: 'left',
                  render: (r) => <span className="font-semibold tabular-nums text-slate-900">KN-{r.id}</span>,
                },
                {
                  label: 'Booking',
                  align: 'left',
                  render: (r) => {
                    const booking = bookingsMap[r.bookingId]
                    return (
                      <div className="space-y-0.5 text-left">
                        <span className="font-medium tabular-nums text-slate-900">
                          #{r.bookingId}
                        </span>
                        {booking?.bookingCode && (
                          <p className="text-xs tabular-nums text-slate-500">
                            {booking.bookingCode}
                          </p>
                        )}
                      </div>
                    )
                  },
                },
                {
                  label: 'Lý do',
                  render: (r) => (
                    <p className="max-w-md font-medium leading-snug text-slate-900">
                      {r.reason}
                    </p>
                  ),
                },
                {
                  label: 'Tiền bồi thường',
                  align: 'right',
                  render: (r) => {
                    const amt = r.compensationAmount ?? r.amount
                    return (
                      <span className="tabular-nums font-medium">
                        {typeof amt === 'number' && Number.isFinite(amt)
                          ? `${new Intl.NumberFormat('vi-VN').format(amt)} ₫`
                          : '—'}
                      </span>
                    )
                  },
                },
                { label: 'Thời gian', render: (r) => disputeTimeLabel(r.createdAt) },
                {
                  label: 'Trạng thái',
                  render: (r) => <Badge value={r.status} dot />,
                },
              ]}
            />
          )}
        </>
      )}

      {openCreateModal && (
        <CreateDisputeModal
          isOpen={openCreateModal}
          initialBookingId={prefillBookingId}
          onClose={() => setOpenCreateModal(false)}
          onSuccess={(created) => {
            setCreatedToast(created)
          }}
        />
      )}
    </Workspace>
  )
}

function DriverDisputeDetailContent({ dispute }: { dispute: Dispute }) {
  const bookingQuery = useQuery({
    queryKey: ['dispute-linked-booking', dispute.bookingId],
    queryFn: () => fetchBookingSummarySafe(dispute.bookingId),
    enabled: Boolean(dispute.bookingId),
    retry: false,
    staleTime: 60_000,
  })

  const paymentsQuery = useQuery({
    queryKey: ['dispute-linked-payments', dispute.bookingId],
    queryFn: () => fetchPaymentsForBookingSafe(dispute.bookingId),
    enabled: Boolean(dispute.bookingId),
    retry: false,
    staleTime: 60_000,
  })

  const linkedBooking: DisputeBookingSummary | null = bookingQuery.data ?? null
  const linkedPayments = paymentsQuery.data ?? []
  const parsed = useMemo(
    () => parseDisputeDescription(dispute.description),
    [dispute.description],
  )

  return (
    <div className="space-y-5">
      {/* 1. Thanh tiến độ giải quyết gọn ngang */}
      <DisputeStatusStepper
        status={dispute.status}
        bookingId={dispute.bookingId}
        merchantId={dispute.merchantId}
        createdAt={dispute.createdAt}
        updatedAt={dispute.updatedAt}
      />

      {/* 2. Bố cục 2 cột 7/5 tận dụng chiều ngang, đồng nhất 1 format & cỡ chữ dễ đọc */}
      <div className="grid items-start gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <Panel>
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className="font-sora text-lg font-semibold leading-snug text-slate-900">
                  {dispute.reason}
                </h2>
                <Badge value={dispute.status} size="md" dot />
              </div>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-slate-700">
                  Nội dung phản ánh
                </p>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">
                  {parsed.body || 'Chưa có mô tả bổ sung.'}
                </p>
              </div>

              <DisputeEvidenceGallery
                evidenceUrls={dispute.evidenceUrls ?? []}
                localAttachmentRefs={parsed.localAttachmentRefs}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
                <span>Ngày gửi: {disputeTimeLabel(dispute.createdAt)}</span>
                {dispute.updatedAt && (
                  <span>Cập nhật: {disputeTimeLabel(dispute.updatedAt)}</span>
                )}
              </div>
            </div>
          </Panel>

          <CompensationRecordCard dispute={dispute} payments={linkedPayments} />
        </div>

        <aside className="lg:col-span-5">
          <Panel title="Thông tin đơn đỗ liên kết">
            {linkedBooking ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="font-sora text-base font-semibold text-slate-900">
                    {linkedBooking.parkingLotName || `Đơn đỗ #${dispute.bookingId}`}
                  </p>
                  {linkedBooking.parkingLotAddress && (
                    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" aria-hidden="true" />
                      <span>{linkedBooking.parkingLotAddress}</span>
                    </p>
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
                  <div>
                    <dt className="text-sm text-slate-500">Mã đơn</dt>
                    <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                      {linkedBooking.bookingCode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Trạng thái</dt>
                    <dd className="mt-0.5 text-base font-semibold text-slate-900">
                      {statusLabels[linkedBooking.status as Booking['status']] ?? linkedBooking.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Biển số xe</dt>
                    <dd className="mt-0.5 text-base font-semibold text-slate-900">
                      {linkedBooking.vehiclePlate || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Tiền cọc</dt>
                    <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                      {typeof linkedBooking.advanceDeposit === 'number'
                        ? formatMoney(linkedBooking.advanceDeposit)
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">Tổng phí</dt>
                    <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                      {typeof linkedBooking.totalAmount === 'number'
                        ? formatMoney(linkedBooking.totalAmount)
                        : 'Chưa quyết toán'}
                    </dd>
                  </div>
                  {linkedBooking.expectedCheckInTime && (
                    <div>
                      <dt className="text-sm text-slate-500">Check-in dự kiến</dt>
                      <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                        {disputeTimeLabel(linkedBooking.expectedCheckInTime)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <Link
                    to="/bookings"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                    <span>Xem đơn đỗ xe</span>
                  </Link>
                  <a
                    href="tel:0908123456"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                    <span>0908 123 456</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-slate-500">ID Booking</dt>
                    <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                      #{dispute.bookingId}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-500">ID Chủ bãi</dt>
                    <dd className="mt-0.5 text-base font-semibold tabular-nums text-slate-900">
                      {dispute.merchantId != null ? `#${dispute.merchantId}` : 'Đang đối soát'}
                    </dd>
                  </div>
                </dl>

                <div className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <Link
                    to="/bookings"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                    <span>Xem đơn đỗ xe</span>
                  </Link>
                  <a
                    href="tel:0908123456"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 text-brand-primary" aria-hidden="true" />
                    <span>0908 123 456</span>
                  </a>
                </div>
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  )
}

