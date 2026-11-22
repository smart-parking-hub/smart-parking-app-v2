import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
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
import { errorMessage, getData, sendData, type Page } from '@/shared/api/resources'
import {
  fetchBooking,
  fetchBookingsPage,
  formatMoney,
  statusLabels,
  bookingTimeLabel,
  BookingStatusPanel,
  type Booking,
} from '@/features/booking-flow'
import { Modal } from '@/shared/components/Modal'
import { Select } from '@/shared/components/Select'
import { CreateDisputeModal } from '../components/CreateDisputeModal'
import { BookingPaymentHistoryModal } from '../components/BookingPaymentHistoryModal'
import { BookingQrModal } from '../components/BookingQrModal'
import { ReviewBookingModal } from '../components/ReviewBookingModal'
import { bookingReference } from '@/entities/booking/bookingReference'
import { isBookingEligibleForDispute } from '../schemas/disputeSchemas'
import { cn } from '@/shared/utils/cn'

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

const bookingStatusFilterOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán cọc' },
  { value: 'PENDING_CHECKIN', label: 'Chờ check-in' },
  { value: 'PARKING', label: 'Xe đang đỗ trong bãi' },
  { value: 'OVERTIME', label: 'Đỗ quá giờ' },
  { value: 'AWAITING_FINAL_PAYMENT', label: 'Chờ quyết toán' },
  { value: 'COMPLETED', label: 'Đã hoàn tất' },
  { value: 'REVIEWED', label: 'Đã đánh giá' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'EXPIRED', label: 'Đã hết hạn' },
]

export function MyBookingsPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const selectedId = Number(params.get('bookingId'))
  const validSelection = Number.isSafeInteger(selectedId) && selectedId > 0

  const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null)
  const [paymentHistoryBooking, setPaymentHistoryBooking] = useState<Booking | null>(null)
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null)
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null)
  const [detailModalBooking, setDetailModalBooking] = useState<Booking | null>(null)
  const [reviewNotice, setReviewNotice] = useState<string | null>(null)
  const [createdNotice, setCreatedNotice] = useState<Dispute | null>(null)

  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null | undefined>(undefined)

  // Filters state (TKT-05 Manual Filter Action)
  const [draftSearch, setDraftSearch] = useState('')
  const [draftStatus, setDraftStatus] = useState('')
  const [draftFromDate, setDraftFromDate] = useState('')
  const [draftToDate, setDraftToDate] = useState('')

  const [appliedFilters, setAppliedFilters] = useState<{
    search: string
    status: string
    fromDate: string
    toDate: string
  }>({
    search: '',
    status: '',
    fromDate: '',
    toDate: '',
  })

  const activeFilters = useMemo(() => {
    const hasSearch = appliedFilters.search.trim().length > 0
    const hasStatus = appliedFilters.status.trim().length > 0
    const hasFrom = appliedFilters.fromDate.trim().length > 0
    const hasTo = appliedFilters.toDate.trim().length > 0
    return {
      hasFilters: hasSearch || hasStatus || hasFrom || hasTo,
      filters: {
        search: hasSearch ? appliedFilters.search.trim() : undefined,
        status: hasStatus ? appliedFilters.status.trim() : undefined,
        from: hasFrom ? `${appliedFilters.fromDate}T00:00:00` : undefined,
        to: hasTo ? `${appliedFilters.toDate}T23:59:59` : undefined,
      },
    }
  }, [appliedFilters])

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: draftSearch.trim(),
      status: draftStatus,
      fromDate: draftFromDate,
      toDate: draftToDate,
    })
    setPage(0)
  }

  const handleClearFilters = () => {
    setDraftSearch('')
    setDraftStatus('')
    setDraftFromDate('')
    setDraftToDate('')
    setAppliedFilters({
      search: '',
      status: '',
      fromDate: '',
      toDate: '',
    })
    setPage(0)
  }

  const selected = useQuery({
    queryKey: ['booking', selectedId],
    queryFn: () => fetchBooking(selectedId),
    enabled: validSelection,
    retry: false,
    refetchInterval: 10000,
  })

  const detailModalId = detailModalBooking?.id
  const detailQuery = useQuery({
    queryKey: ['booking', detailModalId],
    queryFn: () => fetchBooking(detailModalId!),
    enabled: detailModalId !== undefined,
    retry: false,
  })
  const currentModalBooking = detailModalBooking && (detailQuery.data ?? detailModalBooking)

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

  const filteredBookings = useMemo(() => {
    const content = query.data?.content ?? []
    if (!activeFilters.hasFilters) return content

    return content.filter((b) => {
      if (activeFilters.filters.search) {
        const q = activeFilters.filters.search.toLowerCase()
        const cleanQ = q.replace(/^#/, '')
        const idMatch = String(b.id).includes(cleanQ)
        const codeMatch = (b.bookingCode ?? '').toLowerCase().includes(q)
        const plateMatch = (b.vehiclePlate ?? '').toLowerCase().includes(q)
        const lotMatch = (b.parkingLotName ?? '').toLowerCase().includes(q)
        const addressMatch = (b.parkingLotAddress ?? '').toLowerCase().includes(q)
        if (!idMatch && !codeMatch && !plateMatch && !lotMatch && !addressMatch) {
          return false
        }
      }

      if (activeFilters.filters.status) {
        if (b.status !== activeFilters.filters.status) {
          return false
        }
      }

      if (appliedFilters.fromDate) {
        const checkInDate = b.expectedCheckInTime ? b.expectedCheckInTime.substring(0, 10) : ''
        if (checkInDate && checkInDate < appliedFilters.fromDate) {
          return false
        }
      }

      if (appliedFilters.toDate) {
        const checkInDate = b.expectedCheckInTime ? b.expectedCheckInTime.substring(0, 10) : ''
        if (checkInDate && checkInDate > appliedFilters.toDate) {
          return false
        }
      }

      return true
    })
  }, [query.data?.content, activeFilters, appliedFilters])

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

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewBooking) return
    await sendData('post', '/api/v1/reviews', {
      bookingId: reviewBooking.id,
      rating,
      comment,
    })
    setReviewNotice(`Đã gửi đánh giá cho lượt đặt chỗ #${reviewBooking.bookingCode}`)
    setReviewBooking(null)
    await query.refetch()
  }

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

      {reviewNotice && (
        <ToastContainer>
          <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-4 shadow-xl backdrop-blur-md">
            <Toast
              variant="success"
              title="Đánh giá thành công"
              message={reviewNotice}
              duration={6000}
              onClose={() => setReviewNotice(null)}
              className="border-0 bg-transparent p-0 shadow-none"
            />
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
            <BookingStatusPanel key={selectedId} bookingId={selectedId} booking={selected.data} embedded hideReview />
          )}
        </Panel>
      )}

      {/* Filter and Search Bar (TKT-05 Refined UI/UX with dedicated "Lọc" button) */}
      <section
        aria-label="Bộ lọc tìm kiếm vé đặt chỗ"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition-all space-y-3.5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* Keyword Search */}
          <div className="space-y-1.5 sm:col-span-1 lg:col-span-4">
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
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters()
                  }
                }}
                placeholder="Mã vé, biển số, tên bãi…"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#d95f00] focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20 transition-all"
              />
              {draftSearch && (
                <button
                  type="button"
                  onClick={() => setDraftSearch('')}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5 sm:col-span-1 lg:col-span-3">
            <label htmlFor="status-select" className="block text-xs font-semibold text-slate-700">
              Trạng thái vé
            </label>
            <Select
              id="status-select"
              ariaLabel="Trạng thái vé"
              triggerAriaHidden={true}
              prefixIcon={<Filter className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />}
              value={draftStatus}
              onChange={(val) => setDraftStatus(val)}
              options={bookingStatusFilterOptions}
              placeholder="Tất cả trạng thái"
              size="md"
              variant="default"
              triggerClassName="h-10 rounded-xl border-slate-200 text-xs font-normal"
            />
          </div>

          {/* From Date Filter */}
          <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
            <label htmlFor="from-date" className="block text-xs font-semibold text-slate-700">
              Ngày vào (Từ ngày)
            </label>
            <div className="relative flex items-center group">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 group-hover:text-[#d95f00] transition-colors">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="from-date"
                type="date"
                value={draftFromDate}
                max={draftToDate || undefined}
                onChange={(e) => setDraftFromDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.()
                  } catch (_err) {
                    void _err
                  }
                }}
                title="Vào bãi từ ngày"
                className={cn(
                  'w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs font-normal text-slate-800 transition-all cursor-pointer shadow-2xs',
                  'hover:border-[#d95f00] hover:bg-orange-50/10 hover:shadow-xs',
                  'focus:border-[#d95f00] focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20',
                  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 hover:[&::-webkit-calendar-picker-indicator]:scale-110 [&::-webkit-calendar-picker-indicator]:transition-all',
                  draftFromDate ? 'border-orange-300 bg-orange-50/15' : 'border-slate-200'
                )}
              />
              {draftFromDate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDraftFromDate('')
                  }}
                  aria-label="Xóa ngày bắt đầu"
                  title="Xóa ngày bắt đầu"
                  className="absolute right-7 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* To Date Filter */}
          <div className="space-y-1.5 sm:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="to-date" className="block text-xs font-semibold text-slate-700">
                Ngày vào (Đến ngày)
              </label>
            </div>
            <div className="relative flex items-center group">
              <div className="pointer-events-none absolute left-3 flex items-center text-slate-400 group-hover:text-[#d95f00] transition-colors">
                <Calendar className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="to-date"
                type="date"
                value={draftToDate}
                min={draftFromDate || undefined}
                onChange={(e) => setDraftToDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker?.()
                  } catch (_err) {
                    void _err
                  }
                }}
                title="Vào bãi đến ngày"
                className={cn(
                  'w-full h-10 rounded-xl border bg-white pl-9 pr-8 text-xs font-normal text-slate-800 transition-all cursor-pointer shadow-2xs',
                  'hover:border-[#d95f00] hover:bg-orange-50/10 hover:shadow-xs',
                  'focus:border-[#d95f00] focus:outline-none focus:ring-2 focus:ring-[#d95f00]/20',
                  '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 hover:[&::-webkit-calendar-picker-indicator]:scale-110 [&::-webkit-calendar-picker-indicator]:transition-all',
                  draftToDate ? 'border-orange-300 bg-orange-50/15' : 'border-slate-200'
                )}
              />
              {draftToDate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDraftToDate('')
                  }}
                  aria-label="Xóa ngày kết thúc"
                  title="Xóa ngày kết thúc"
                  className="absolute right-7 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer z-10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Button: Lọc */}
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#d95f00] text-white hover:bg-[#b84f00] text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
              title="Áp dụng bộ lọc"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Lọc</span>
            </button>
          </div>
        </div>

        {/* Active filter summary pill */}
        {activeFilters.hasFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Đang lọc theo:</span>
            {appliedFilters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#d95f00] font-medium border border-orange-200/60">
                Từ khóa: "{appliedFilters.search}"
                <button
                  type="button"
                  onClick={() => {
                    setDraftSearch('')
                    setAppliedFilters((prev) => ({ ...prev, search: '' }))
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {appliedFilters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200/60">
                Trạng thái: {statusLabels[appliedFilters.status as keyof typeof statusLabels] ?? appliedFilters.status}
                <button
                  type="button"
                  onClick={() => {
                    setDraftStatus('')
                    setAppliedFilters((prev) => ({ ...prev, status: '' }))
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {appliedFilters.fromDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Từ ngày: {appliedFilters.fromDate}
                <button
                  type="button"
                  onClick={() => {
                    setDraftFromDate('')
                    setAppliedFilters((prev) => ({ ...prev, fromDate: '' }))
                    setPage(0)
                  }}
                  className="hover:text-red-700 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {appliedFilters.toDate && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200">
                Đến ngày: {appliedFilters.toDate}
                <button
                  type="button"
                  onClick={() => {
                    setDraftToDate('')
                    setAppliedFilters((prev) => ({ ...prev, toDate: '' }))
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
        <div role="status" aria-label="Đang tải đặt chỗ…" className="overflow-hidden rounded-2xl border border-brand-border bg-white p-6 space-y-4 animate-pulse">
          <span className="sr-only">Đang tải đặt chỗ…</span>
          <div className="flex justify-between items-center pb-4 border-b border-brand-border">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="h-8 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      ) : query.isError ? (
        <Notice error>
          <div>
            {errorMessage(query.error)}
            <button className={secondary} onClick={() => void query.refetch()}>
              Thử lại
            </button>
          </div>
        </Notice>
      ) : !filteredBookings.length ? (
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
            {activeFilters.hasFilters ? filteredBookings.length : (query.data.totalElements ?? filteredBookings.length)} lượt đặt chỗ{' '}
            {activeFilters.hasFilters ? '(theo bộ lọc)' : ''} · Mở từng vé để xem QR, thanh toán và chi tiết.
          </p>

          {/* Bookings Table với Sticky Action Column trên Mobile */}
          <div role="region" aria-label="Bảng vé đặt chỗ" className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs focus-visible:outline-2 focus-visible:outline-brand-primary">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0 z-20">
                <tr>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Mã vé / Đơn</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Bãi đỗ xe</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Biển số</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Thời gian vào / ra</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Cọc & Phí</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Trạng thái</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-right sticky right-0 bg-slate-100/95 z-30 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xs">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings
                  .filter((booking) => !selected.data || booking.id !== selectedId)
                  .map((booking, idx) => {
                    const existingDispute = disputeByBookingId.get(booking.id)
                    const canDispute = isBookingEligibleForDispute(booking.status)
                    const expanded =
                      expandedId === booking.id ||
                      (!validSelection && expandedId === undefined && filteredBookings.length === 1)

                    return (
                      <Fragment key={booking.id}>
                        <tr
                          className={`group hover:bg-slate-50/70 transition-colors ${
                            expanded ? 'bg-orange-50/20' : ''
                          }`}
                        >
                          {/* 1. Mã vé */}
                          <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                            <span
                              className="font-mono font-bold text-slate-900 block truncate max-w-44"
                              title={bookingReference(booking)}
                            >
                              {booking.status === 'PENDING_PAYMENT' ? (
                                <>
                                  <span>Số đơn</span>
                                  <span className="text-slate-500 ml-1">#{booking.id}</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-slate-400">#{booking.id} · </span>
                                  <span>{booking.bookingCode}</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* 2. Bãi đỗ */}
                          <td className="py-3.5 px-4 max-w-[200px] align-middle">
                            <div
                              className="font-semibold text-slate-900 truncate"
                              title={booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}
                            >
                              {booking.parkingLotName || `Bãi đỗ #${booking.parkingLotId}`}
                            </div>
                            {booking.parkingLotAddress && (
                              <div
                                className="text-[11px] text-slate-500 truncate mt-0.5"
                                title={booking.parkingLotAddress}
                              >
                                {booking.parkingLotAddress}
                              </div>
                            )}
                          </td>

                          {/* 3. Biển số xe */}
                          <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                            {booking.vehiclePlate ? (
                              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                                {booking.vehiclePlate}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          {/* 4. Khung giờ */}
                          <td className="py-3.5 px-4 whitespace-nowrap align-middle text-[11px] leading-relaxed">
                            <div>
                              Vào: <strong className="font-medium text-slate-900">{bookingTimeLabel(booking.expectedCheckInTime)}</strong>
                            </div>
                            <div>
                              Ra: <strong className="font-medium text-slate-900">{bookingTimeLabel(booking.expectedCheckOutTime)}</strong>
                            </div>
                          </td>

                          {/* 5. Tiền cọc & Phí */}
                          <td className="py-3.5 px-4 whitespace-nowrap align-middle text-[11px] leading-relaxed">
                            <div>
                              Cọc: <strong className="font-semibold text-emerald-700">{formatMoney(booking.advanceDeposit)}</strong>
                            </div>
                            <div>
                              {['AWAITING_FINAL_PAYMENT', 'COMPLETED', 'REVIEWED'].includes(booking.status)
                                ? 'Quyết toán: '
                                : 'Dự kiến: '}
                              <strong className="font-medium text-slate-900">
                                {booking.totalAmount == null ? 'Chưa có' : formatMoney(booking.totalAmount)}
                              </strong>
                            </div>
                          </td>

                          {/* 6. Trạng thái */}
                          <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge value={booking.status} size="sm">
                                {statusLabels[booking.status] ?? booking.status}
                              </Badge>
                              {existingDispute && (
                                <Badge value={existingDispute.status} size="sm" dot>
                                  Khiếu nại KN-{existingDispute.id}
                                </Badge>
                              )}
                            </div>
                          </td>

                          {/* 7. Thao tác: Nút Chi tiết, Đánh giá, Tác vụ (Sticky bên phải để luôn hiển thị trên mobile) */}
                          <td className={`py-3.5 px-4 whitespace-nowrap align-middle text-right sticky right-0 z-10 shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.08)] transition-colors ${
                            expanded ? 'bg-orange-50/95' : 'bg-white/95 group-hover:bg-slate-50/95'
                          }`}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Nút Xem QR vé (cho PENDING_CHECKIN hoặc PARKING / OVERTIME) */}
                              {['PENDING_CHECKIN', 'PARKING', 'OVERTIME'].includes(booking.status) && (
                                <button
                                  type="button"
                                  onClick={() => setQrModalBooking(booking)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#d95f00] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b84e00] focus-visible:ring-2 focus-visible:ring-[#d95f00] shadow-2xs hover:shadow transition-all cursor-pointer"
                                  title={booking.status === 'PENDING_CHECKIN' ? 'Xem mã QR check-in vào bãi' : 'Xem mã QR check-out ra bãi'}
                                >
                                  <QrCode className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                                  <span>{booking.status === 'PENDING_CHECKIN' ? 'Xem QR vé' : 'QR check-out'}</span>
                                </button>
                              )}

                              {/* Nút Đánh giá (cho COMPLETED hoặc REVIEWED) - monochrome / trắng đen */}
                              {['COMPLETED', 'REVIEWED'].includes(booking.status) && (
                                <button
                                  type="button"
                                  onClick={() => setReviewBooking(booking)}
                                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors shadow-2xs cursor-pointer"
                                >
                                  <span>{booking.status === 'COMPLETED' ? 'Đánh giá' : 'Đã đánh giá'}</span>
                                </button>
                              )}

                              {/* Xem khiếu nại nếu đã có */}
                              {existingDispute && (
                                <Link
                                  to={`/disputes/${existingDispute.id}`}
                                  className="inline-flex items-center gap-1 rounded-xl border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-brand-primary-active hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Xem khiếu nại #KN-{existingDispute.id}</span>
                                </Link>
                              )}

                              {/* Nút Chi tiết - mở modal ra giữa màn hình */}
                              <button
                                type="button"
                                className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-brand-primary cursor-pointer transition-colors shadow-2xs"
                                aria-label="Xem vé & chi tiết"
                                aria-expanded={detailModalBooking?.id === booking.id || expanded}
                                onClick={() => {
                                  setDetailModalBooking(booking)
                                  setExpandedId(booking.id)
                                }}
                              >
                                <span>Chi tiết</span>
                              </button>

                              {/* Dropdown Tác vụ - side='top' cho các dòng gần cuối bảng */}
                              <Dropdown>
                                <DropdownTrigger
                                  className="gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors shadow-2xs"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
                                  <span className="hidden sm:inline">Tác vụ</span>
                                  <span className="sr-only">cho đơn {bookingReference(booking)}</span>
                                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                </DropdownTrigger>
                                <DropdownContent
                                  align="right"
                                  side={idx >= (query.data.content?.length ?? 0) - 2 ? 'top' : 'bottom'}
                                  width="w-60"
                                >
                                  {booking.status === 'PENDING_CHECKIN' && (
                                    <DropdownItem
                                      icon={<QrCode className="h-4 w-4 text-brand-orange" />}
                                      onClick={() => setQrModalBooking(booking)}
                                    >
                                      Xem mã QR check-in
                                    </DropdownItem>
                                  )}
                                  {['PARKING', 'OVERTIME'].includes(booking.status) && (
                                    <DropdownItem
                                      icon={<QrCode className="h-4 w-4 text-brand-orange" />}
                                      onClick={() => setQrModalBooking(booking)}
                                    >
                                      Xem mã QR check-out
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
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
              </tbody>
            </table>
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

      {reviewBooking && (
        <ReviewBookingModal
          isOpen={Boolean(reviewBooking)}
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {/* Modal hiển thị chi tiết vé ra giữa màn hình */}
      {currentModalBooking && (
        <Modal
          isOpen={Boolean(currentModalBooking)}
          onClose={() => {
            setDetailModalBooking(null)
            setExpandedId(null)
          }}
          maxWidth="xl"
          className="flex flex-col max-h-[90vh] overflow-hidden p-0 max-w-3xl"
        >
          <div className="flex flex-col max-h-[90vh] overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 shrink-0 pr-12">
              <h3 className="font-sora text-lg font-semibold text-slate-900 break-all">
                Chi tiết lượt đặt chỗ {bookingReference(currentModalBooking)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Bãi đỗ: <strong className="text-slate-800">{currentModalBooking.parkingLotName || `#${currentModalBooking.parkingLotId}`}</strong>
                {currentModalBooking.vehiclePlate && (
                  <> · Biển số: <strong className="font-mono text-slate-800">{currentModalBooking.vehiclePlate}</strong></>
                )}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <BookingStatusPanel
                bookingId={currentModalBooking.id}
                embedded
                hideReview
              />
            </div>
            <div className="flex justify-end border-t border-slate-100 px-6 py-3 shrink-0 bg-slate-50/50">
              <button
                type="button"
                className={`${secondary} !min-h-10 !px-4 !py-2 !text-xs cursor-pointer`}
                onClick={() => {
                  setDetailModalBooking(null)
                  setExpandedId(null)
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Workspace>
  )
}
