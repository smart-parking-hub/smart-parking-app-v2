import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Receipt,
  ShieldAlert,
  QrCode,
  Search,
  RotateCcw,
  Calendar,
  Filter,
  X,
} from 'lucide-react'
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
import {
  fetchBooking,
  fetchBookingsPage,
  formatMoney,
  statusLabels,
  bookingTimeLabel,
  BookingStatusPanel,
  type Booking,
} from '@/features/booking-flow'
import { CreateDisputeModal } from '../components/CreateDisputeModal'
import { BookingPaymentHistoryModal } from '../components/BookingPaymentHistoryModal'
import { BookingQrModal } from '../components/BookingQrModal'
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
  const [paymentHistoryBooking, setPaymentHistoryBooking] = useState<Booking | null>(null)
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null)
  const [createdNotice, setCreatedNotice] = useState<Dispute | null>(null)

  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null | undefined>(undefined)

  // Filters state (TKT-05)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const activeFilters = useMemo(() => {
    const hasSearch = search.trim().length > 0
    const hasStatus = status.trim().length > 0
    const hasFrom = fromDate.trim().length > 0
    const hasTo = toDate.trim().length > 0
    return {
      hasFilters: hasSearch || hasStatus || hasFrom || hasTo,
      filters: {
        search: hasSearch ? search.trim() : undefined,
        status: hasStatus ? status.trim() : undefined,
        from: hasFrom ? `${fromDate}T00:00:00` : undefined,
        to: hasTo ? `${toDate}T23:59:59` : undefined,
      },
    }
  }, [search, status, fromDate, toDate])

  const handleClearFilters = () => {
    setSearch('')
    setStatus('')
    setFromDate('')
    setToDate('')
    setPage(0)
  }

  const selected = useQuery({
    queryKey: ['booking', selectedId],
    queryFn: () => fetchBooking(selectedId),
    enabled: validSelection,
    retry: false,
    refetchInterval: 10000,
  })

  const scrolledSelection = useRef<number | null>(null)
  useEffect(() => {
    if (!selected.data || scrolledSelection.current === selectedId) return
    scrolledSelection.current = selectedId
    document.getElementById(`selected-booking-${selectedId}`)?.scrollIntoView?.({ block: 'start' })
  }, [selected.data, selectedId])

  const query = useQuery({
    queryKey: ['real-bookings', page, activeFilters.filters],
    queryFn: () => fetchBookingsPage(page, 8, activeFilters.filters),
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

      {/* Selected single booking via deep link ?bookingId=... */}
      {validSelection && (
        <Panel className="space-y-4 ring-2 ring-brand-primary/20">
          <div
            id={`selected-booking-${selectedId}`}
            className="scroll-mt-[calc(var(--driver-header-height)+1rem)]"
          >
            <h2 className="font-sora text-lg font-semibold">
              Vé vừa xem{selected.data ? ` · ${selected.data.parkingLotName || `Bãi đỗ #${selected.data.parkingLotId}`}` : ''}
            </h2>
            <Link to="/bookings" className="mt-2 inline-block text-sm text-brand-muted underline">
              Đóng vé đang chọn
            </Link>
          </div>
          {selected.isPending ? (
            <p role="status">Đang tải vé đang chọn…</p>
          ) : selected.isError ? (
            <Notice error>
              <div>
                {errorMessage(selected.error)}
                <button className={`${secondary} mt-2`} onClick={() => void selected.refetch()}>
                  Thử tải lại vé
                </button>
              </div>
            </Notice>
          ) : (
            <BookingStatusPanel key={selectedId} bookingId={selectedId} booking={selected.data} embedded />
          )}
        </Panel>
      )}

      {/* Filter and Search Bar (TKT-05 Refined UI/UX) */}
      <section
        aria-label="Bộ lọc tìm kiếm vé đặt chỗ"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label htmlFor="search-input" className="block text-xs font-semibold text-slate-700">
              Tìm kiếm
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(0)
                }}
                placeholder="Mã vé, biển số, tên bãi…"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPage(0)
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label htmlFor="status-select" className="block text-xs font-semibold text-slate-700">
              Trạng thái vé
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                <Filter className="h-4 w-4" aria-hidden="true" />
              </div>
              <select
                id="status-select"
                aria-label="Trạng thái vé"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPage(0)
                }}
                className="w-full h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-900 hover:border-slate-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer font-medium"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING_PAYMENT">Chờ thanh toán cọc</option>
                <option value="PENDING_CHECKIN">Chờ check-in</option>
                <option value="PARKING">Xe đang đỗ trong bãi</option>
                <option value="OVERTIME">Đỗ quá giờ</option>
                <option value="AWAITING_FINAL_PAYMENT">Chờ quyết toán</option>
                <option value="COMPLETED">Đã hoàn tất</option>
                <option value="REVIEWED">Đã đánh giá</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="EXPIRED">Đã hết hạn</option>
              </select>
              <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* From Date Filter */}
          <div className="space-y-1.5">
            <label htmlFor="from-date" className="block text-xs font-semibold text-slate-700">
              Ngày vào (Từ ngày)
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  setPage(0)
                }}
                title="Vào bãi từ ngày"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 hover:border-slate-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>
          </div>

          {/* To Date Filter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="to-date" className="block text-xs font-semibold text-slate-700">
                Ngày vào (Đến ngày)
              </label>
              {activeFilters.hasFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#d95f00] hover:text-[#b34e00] transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value)
                  setPage(0)
                }}
                title="Vào bãi đến ngày"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 hover:border-slate-300 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Active filter summary pill */}
        {activeFilters.hasFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Đang lọc theo:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#d95f00] font-medium border border-orange-200/60">
                Từ khóa: "{search}"
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200/60">
                Trạng thái: {statusLabels[status as keyof typeof statusLabels] ?? status}
                <button
                  type="button"
                  onClick={() => {
                    setStatus('')
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {fromDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Từ ngày: {fromDate}
                <button
                  type="button"
                  onClick={() => {
                    setFromDate('')
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {toDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Đến ngày: {toDate}
                <button
                  type="button"
                  onClick={() => {
                    setToDate('')
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}
      </section>

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
        <Notice>
          {activeFilters.hasFilters ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span>Không tìm thấy lượt đặt chỗ nào phù hợp với bộ lọc hiện tại.</span>
              <button className={`${secondary} !text-xs !py-1.5`} onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          ) : page === 0 ? (
            'Bạn chưa có lượt đặt chỗ nào.'
          ) : (
            <>
              Không có lượt đặt chỗ ở trang này.{' '}
              <button className={secondary} onClick={() => setPage(0)}>
                Về trang đầu
              </button>
            </>
          )}
        </Notice>
      ) : (
        <>
          <p className="text-sm text-brand-muted">
            {query.data.totalElements ?? query.data.content.length} lượt đặt chỗ{' '}
            {activeFilters.hasFilters ? '(theo bộ lọc)' : ''} · Mở từng vé để xem QR, thanh toán và chi tiết.
          </p>

          {/* Cards Grid (TKT-03 restructured layout) */}
          <div className="grid items-start gap-4 xl:grid-cols-2">
            {query.data.content
              .filter((booking) => !selected.data || booking.id !== selectedId)
              .map((booking) => {
                const existingDispute = disputeByBookingId.get(booking.id)
                const canDispute = isBookingEligibleForDispute(booking.status)
                const expanded =
                  expandedId === booking.id ||
                  (!validSelection && expandedId === undefined && query.data.content.length === 1)

                return (
                  <Panel
                    key={booking.id}
                    className="!p-4 sm:!p-5 flex flex-col justify-between transition-shadow hover:shadow-md border border-slate-200/90 rounded-2xl"
                  >
                    <div>
                      {/* 1. Header: Mã vé + Trạng thái + Tác vụ */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="max-w-56 truncate rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800"
                            title={bookingReference(booking)}
                          >
                            {booking.status === 'PENDING_PAYMENT'
                              ? `Số đơn #${booking.id}`
                              : `#${booking.id} · ${booking.bookingCode}`}
                          </span>
                          <Badge value={booking.status} size="sm">
                            {statusLabels[booking.status] ?? booking.status}
                          </Badge>
                          {existingDispute && (
                            <Badge value={existingDispute.status} size="sm" dot>
                              Khiếu nại KN-{existingDispute.id}
                            </Badge>
                          )}
                        </div>

                        {/* Menu tác vụ (TKT-01, TKT-02) */}
                        <div
                          role="region"
                          aria-label={`Menu tác vụ đơn ${bookingReference(booking)}`}
                          className="flex items-center gap-1.5"
                        >
                          <Dropdown>
                            <DropdownTrigger
                              className="gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors shadow-2xs"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
                              <span className="hidden sm:inline">Tác vụ</span>
                              <span className="sr-only">cho đơn {bookingReference(booking)}</span>
                              <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                            </DropdownTrigger>
                            <DropdownContent align="right" width="w-60">
                              {booking.status === 'PENDING_CHECKIN' && (
                                <DropdownItem
                                  icon={<QrCode className="h-4 w-4 text-brand-orange" />}
                                  onClick={() => setQrModalBooking(booking)}
                                >
                                  Xem mã QR check-in
                                </DropdownItem>
                              )}
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
                                onClick={() => setPaymentHistoryBooking(booking)}
                              >
                                Lịch sử thanh toán
                              </DropdownItem>
                            </DropdownContent>
                          </Dropdown>
                        </div>
                      </div>

                      {/* 2. Body: Tên bãi, địa chỉ, Biển số */}
                      <div className="py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h2
                              className="font-sora text-base font-semibold text-slate-900 truncate"
                              title={booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}
                            >
                              {booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}
                            </h2>
                            <p
                              className="mt-1 line-clamp-1 text-xs text-brand-muted"
                              title={booking.parkingLotAddress ?? undefined}
                            >
                              {booking.parkingLotAddress || 'Chưa có địa chỉ chi tiết'}
                            </p>
                          </div>
                          {booking.vehiclePlate && (
                            <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-bold text-slate-800">
                              {booking.vehiclePlate}
                            </span>
                          )}
                        </div>

                        {/* 3. Time & Pricing (TKT-03) */}
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-xs">
                          <div>
                            <div className="text-slate-500 text-[11px] font-medium">Khung giờ dự kiến:</div>
                            <div className="mt-0.5 space-y-0.5">
                              <div>
                                Vào: <strong className="font-medium text-slate-900">{bookingTimeLabel(booking.expectedCheckInTime)}</strong>
                              </div>
                              <div>
                                Ra: <strong className="font-medium text-slate-900">{bookingTimeLabel(booking.expectedCheckOutTime)}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="sm:border-l sm:border-slate-200 sm:pl-3">
                            <div className="text-slate-500 text-[11px] font-medium">Thông tin tiền:</div>
                            <div className="mt-0.5 space-y-0.5">
                              <div>
                                Tiền cọc: <strong className="font-semibold text-emerald-700">{formatMoney(booking.advanceDeposit)}</strong>
                              </div>
                              <div>
                                {['AWAITING_FINAL_PAYMENT', 'COMPLETED', 'REVIEWED'].includes(booking.status)
                                  ? 'Phí quyết toán: '
                                  : 'Phí dự kiến: '}
                                <strong className="font-medium text-slate-900">
                                  {booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Footer: Action Buttons (TKT-02, TKT-04) */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {booking.status === 'PENDING_CHECKIN' && (
                          <button
                            type="button"
                            onClick={() => setQrModalBooking(booking)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#341100] px-3 py-1.5 text-xs font-semibold text-[#d95f00] border border-[#d95f00]/30 hover:bg-[#4a1800] focus-visible:ring-2 focus-visible:ring-[#d95f00] transition-colors cursor-pointer"
                          >
                            <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Xem QR vé</span>
                          </button>
                        )}

                        {existingDispute ? (
                          <Link
                            to={`/disputes/${existingDispute.id}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-brand-primary-active hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Xem khiếu nại #KN-{existingDispute.id}</span>
                          </Link>
                        ) : canDispute ? (
                          <button
                            type="button"
                            onClick={() => setDisputeBooking(booking)}
                            aria-label={`Gửi khiếu nại đơn ${bookingReference(booking)}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand-primary hover:bg-brand-primary-subtle hover:text-brand-primary-active focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors shadow-2xs cursor-pointer"
                          >
                            <ShieldAlert className="h-3.5 w-3.5 text-brand-primary" aria-hidden="true" />
                            <span>Gửi khiếu nại</span>
                          </button>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className={`${secondary} !px-3 !py-1.5 !text-xs hover:border-brand-primary/40 focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer transition-colors`}
                        aria-expanded={expanded}
                        aria-controls={`booking-detail-${booking.id}`}
                        onClick={() => setExpandedId(expanded ? null : booking.id)}
                      >
                        <span>{expanded ? 'Thu gọn' : 'Xem vé & chi tiết'}</span>
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div id={`booking-detail-${booking.id}`} className="mt-4 border-t border-brand-border pt-4">
                        <BookingStatusPanel bookingId={booking.id} booking={booking} embedded />
                      </div>
                    )}
                  </Panel>
                )
              })}
          </div>

          {(query.data.totalPages ?? 1) > 1 && (
            <nav aria-label="Phân trang vé đặt chỗ" className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-brand-muted">
                Trang {page + 1} / {query.data.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  className={secondary}
                  disabled={page === 0 || query.isFetching}
                  onClick={() => {
                    setExpandedId(undefined)
                    setPage(page - 1)
                  }}
                >
                  Trang trước
                </button>
                <button
                  className={secondary}
                  disabled={page + 1 >= query.data.totalPages || query.isFetching}
                  onClick={() => {
                    setExpandedId(undefined)
                    setPage(page + 1)
                  }}
                >
                  Trang sau
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {/* Modals */}
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

      {paymentHistoryBooking && (
        <BookingPaymentHistoryModal
          isOpen={Boolean(paymentHistoryBooking)}
          booking={paymentHistoryBooking}
          onClose={() => setPaymentHistoryBooking(null)}
        />
      )}

      {qrModalBooking && (
        <BookingQrModal
          isOpen={Boolean(qrModalBooking)}
          booking={qrModalBooking}
          onClose={() => setQrModalBooking(null)}
        />
      )}
    </Workspace>
  )
}
