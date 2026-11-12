import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import type { Booking } from '@/entities/operations'
import { errorMessage } from '@/shared/api/resources'
import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { Toast } from '@/shared/components/Toast'
import { button, Workspace } from '@/shared/components/Workspace'
import { resolveBookingPlate } from '../api/merchantBookingsApi'
import { MerchantBookingsFilterBar } from '../components/MerchantBookingsFilterBar'
import { MerchantBookingsMetrics } from '../components/MerchantBookingsMetrics'
import { MerchantBookingsPagination } from '../components/MerchantBookingsPagination'
import { MerchantBookingsSkeleton } from '../components/MerchantBookingsSkeleton'
import { MerchantBookingsTable } from '../components/MerchantBookingsTable'
import {
  useMerchantBookingLotsFilterQuery,
  useMerchantBookingsListQuery,
  useMerchantBookingsSummaryQuery,
} from '../hooks/useMerchantBookingsQuery'
import {
  getMerchantBookingsStoreSnapshot,
  useMerchantBookingsStore,
} from '../store/merchantBookingsStore'
import type {
  MerchantBookingEmptyVariant,
  MerchantBookingLotOption,
  MerchantBookingStatusCounts,
} from '../types/merchantBookingsTypes'

function matchesBookingKeyword(row: Booking, normalizedKeyword: string): boolean {
  if (!normalizedKeyword) return true
  const plate = resolveBookingPlate(row)
  const haystack =
    `${row.bookingCode ?? ''} ${plate} ${row.parkingLotName ?? ''}`.toLocaleLowerCase('vi')
  return haystack.includes(normalizedKeyword)
}

export function MerchantBookingsPage() {
  const [searchParams] = useSearchParams()
  const rawLotParam = searchParams.get('parkingLotId')
  const urlInitialLotId = useMemo(() => {
    if (!rawLotParam) return null
    const parsed = Number(rawLotParam)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }, [rawLotParam])

  const [isUrlSynced, setIsUrlSynced] = useState(() => urlInitialLotId === null)

  const page = useMerchantBookingsStore((s) => s.page)
  const pageSize = useMerchantBookingsStore((s) => s.pageSize)
  const statusFilter = useMerchantBookingsStore((s) => s.statusFilter)
  const parkingLotId = useMerchantBookingsStore((s) => s.parkingLotId)
  const searchKeyword = useMerchantBookingsStore((s) => s.searchKeyword)
  const toast = useMerchantBookingsStore((s) => s.toast)

  const setPage = useMerchantBookingsStore((s) => s.setPage)
  const setStatusFilter = useMerchantBookingsStore((s) => s.setStatusFilter)
  const setParkingLotId = useMerchantBookingsStore((s) => s.setParkingLotId)
  const setSearchKeyword = useMerchantBookingsStore((s) => s.setSearchKeyword)
  const resetFilters = useMerchantBookingsStore((s) => s.resetFilters)
  const showToast = useMerchantBookingsStore((s) => s.showToast)
  const clearToast = useMerchantBookingsStore((s) => s.clearToast)

  useEffect(() => {
    if (urlInitialLotId !== null) {
      setParkingLotId(urlInitialLotId)
    }
    setIsUrlSynced(true)
  }, [urlInitialLotId, setParkingLotId])

  useEffect(() => {
    return () => {
      getMerchantBookingsStoreSnapshot().resetStore()
    }
  }, [])

  const effectiveLotId = isUrlSynced ? parkingLotId : urlInitialLotId

  const listQuery = useMerchantBookingsListQuery(page, pageSize, effectiveLotId)
  const summaryQuery = useMerchantBookingsSummaryQuery(effectiveLotId)
  const lotsQuery = useMerchantBookingLotsFilterQuery()

  const pageData = listQuery.data
  const summaryData = summaryQuery.data
  const pageRows = useMemo(
    () => (pageData?.content ?? []).slice(0, pageSize),
    [pageData?.content, pageSize],
  )

  const lotOptions = useMemo<MerchantBookingLotOption[]>(() => {
    const merged = new Map<number, MerchantBookingLotOption>()

    for (const lot of lotsQuery.data ?? []) {
      merged.set(lot.id, lot)
    }

    for (const row of summaryData?.items ?? pageRows) {
      if (
        typeof row.parkingLotId === 'number' &&
        Number.isFinite(row.parkingLotId) &&
        row.parkingLotId > 0 &&
        row.parkingLotName?.trim() &&
        !merged.has(row.parkingLotId)
      ) {
        merged.set(row.parkingLotId, {
          id: row.parkingLotId,
          name: row.parkingLotName.trim(),
        })
      }
    }

    return Array.from(merged.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'vi'),
    )
  }, [lotsQuery.data, summaryData?.items, pageRows])

  const selectedLotName = useMemo(
    () => lotOptions.find((lot) => lot.id === effectiveLotId)?.name ?? null,
    [lotOptions, effectiveLotId],
  )

  const normalizedKeyword = searchKeyword.trim().toLocaleLowerCase('vi')
  const hasClientFilter = statusFilter !== 'ALL' || Boolean(normalizedKeyword)

  const keywordMatchedPool = useMemo(() => {
    const pool = summaryData?.items ?? pageRows
    if (!normalizedKeyword) return pool
    return pool.filter((row) => matchesBookingKeyword(row, normalizedKeyword))
  }, [summaryData?.items, pageRows, normalizedKeyword])

  const serverTotalCount = summaryData?.totalElements ?? pageData?.totalElements ?? pageRows.length

  const statusCounts = useMemo<MerchantBookingStatusCounts>(
    () => ({
      ALL: normalizedKeyword ? keywordMatchedPool.length : serverTotalCount,
      PENDING_CHECKIN: keywordMatchedPool.filter((row) => row.status === 'PENDING_CHECKIN').length,
      PARKING: keywordMatchedPool.filter((row) => row.status === 'PARKING').length,
      COMPLETED: keywordMatchedPool.filter((row) => row.status === 'COMPLETED').length,
    }),
    [normalizedKeyword, keywordMatchedPool, serverTotalCount],
  )

  const filteredFullList = useMemo(() => {
    if (!hasClientFilter) return pageRows
    return keywordMatchedPool.filter(
      (row) => statusFilter === 'ALL' || row.status === statusFilter,
    )
  }, [hasClientFilter, keywordMatchedPool, pageRows, statusFilter])

  const paginationTotalItems = hasClientFilter ? filteredFullList.length : serverTotalCount
  const paginationTotalPages = hasClientFilter
    ? Math.max(1, Math.ceil(filteredFullList.length / pageSize))
    : Math.max(1, pageData?.totalPages ?? Math.ceil(serverTotalCount / pageSize))
  const paginationCurrentPage = hasClientFilter
    ? summaryData
      ? Math.min(page, paginationTotalPages - 1)
      : 0
    : pageData?.currentPage ?? page

  const displayedRows = useMemo(() => {
    if (!hasClientFilter) return pageRows
    if (summaryData) {
      return filteredFullList.slice(
        paginationCurrentPage * pageSize,
        (paginationCurrentPage + 1) * pageSize,
      )
    }
    return filteredFullList.slice(0, pageSize)
  }, [hasClientFilter, pageRows, summaryData, filteredFullList, paginationCurrentPage, pageSize])

  const emptyVariant: MerchantBookingEmptyVariant =
    serverTotalCount === 0 && !normalizedKeyword && statusFilter === 'ALL' && effectiveLotId === null
      ? 'no-bookings'
      : 'filtered'

  const handleRefresh = async () => {
    clearToast()
    const [bookingsRes] = await Promise.all([
      listQuery.refetch(),
      lotsQuery.refetch(),
      summaryQuery.refetch(),
    ])
    if (!bookingsRes.isError) {
      showToast('Đã cập nhật danh sách đặt chỗ', 'success')
    }
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        window.scrollTo(0, 0)
      }
    }
  }

  const isRefreshing = listQuery.isFetching

  return (
    <Workspace
      title="Điều phối đặt chỗ"
      description="Theo dõi lịch đến, xe đang đỗ và các lượt đã quyết toán."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={isRefreshing}
            aria-busy={isRefreshing}
            aria-label="Làm mới danh sách đặt chỗ"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00]"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Làm mới</span>
          </button>

          <Link className={button} to="/merchant/qr-scanner">
            Mở trạm quét QR →
          </Link>
        </div>
      }
    >
      {listQuery.isPending && !pageData ? (
        <MerchantBookingsSkeleton />
      ) : listQuery.isError && !pageData ? (
        <ErrorState
          variant="card"
          title="Không thể tải danh sách đặt chỗ"
          description="Hệ thống tạm thời chưa thể kết nối để lấy danh sách đặt chỗ. Vui lòng thử lại."
          errorDetail={errorMessage(listQuery.error)}
          onRetry={() => void handleRefresh()}
          isRetrying={listQuery.isFetching}
        />
      ) : (
        <div
          data-testid="merchant-bookings-container"
          className="space-y-4"
        >
          {listQuery.isError && (
            <Alert
              variant="error"
              title="Không thể làm mới danh sách đặt chỗ"
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleRefresh()}
                  isLoading={listQuery.isFetching}
                >
                  Thử lại
                </Button>
              }
            >
              {errorMessage(listQuery.error)}
            </Alert>
          )}

          <MerchantBookingsMetrics
            totalElements={serverTotalCount}
            pageRows={pageRows}
            selectedLotName={selectedLotName}
          />

          <div
            data-testid="merchant-bookings-panel"
            aria-label="Khu vực lọc và bảng đơn đặt chỗ khách hàng"
            className="rounded-2xl border border-brand-border bg-white shadow-2xs"
          >
            <MerchantBookingsFilterBar
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              parkingLotId={effectiveLotId}
              onParkingLotIdChange={setParkingLotId}
              searchKeyword={searchKeyword}
              onSearchKeywordChange={setSearchKeyword}
              onResetFilters={resetFilters}
              lotOptions={lotOptions}
              statusCounts={statusCounts}
              displayedCount={displayedRows.length}
              totalMatchedCount={hasClientFilter ? paginationTotalItems : serverTotalCount}
            />

            <div className="overflow-hidden rounded-b-2xl">
              {displayedRows.length === 0 ? (
                <>
                  <EmptyState
                    variant="plain"
                    className="py-8 lg:py-10"
                    title={
                      emptyVariant === 'no-bookings'
                        ? 'Chưa có đơn đặt chỗ nào'
                        : 'Không tìm thấy đơn đặt chỗ phù hợp'
                    }
                    description={
                      emptyVariant === 'no-bookings'
                        ? 'Khi tài xế đặt chỗ tại các bãi đỗ của bạn, danh sách điều phối sẽ hiển thị tại đây.'
                        : 'Thử thay đổi bộ lọc trạng thái, chọn lại bãi đỗ hoặc xóa từ khóa tìm kiếm.'
                    }
                    action={
                      emptyVariant === 'filtered' ? (
                        <Button type="button" variant="secondary" onClick={resetFilters}>
                          Xóa toàn bộ bộ lọc
                        </Button>
                      ) : (
                        <Link className={button} to="/merchant/qr-scanner">
                          Mở trạm quét QR →
                        </Link>
                      )
                    }
                  />

                  {paginationTotalItems > 0 && paginationTotalPages > 1 && (
                    <MerchantBookingsPagination
                      embedded
                      currentPage={paginationCurrentPage}
                      totalPages={paginationTotalPages}
                      pageSize={pageSize}
                      totalItems={paginationTotalItems}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <>
                  <MerchantBookingsTable
                    rows={displayedRows}
                    isFetching={listQuery.isFetching}
                  />

                  {paginationTotalItems > 0 && (
                    <MerchantBookingsPagination
                      embedded
                      currentPage={paginationCurrentPage}
                      totalPages={paginationTotalPages}
                      pageSize={pageSize}
                      totalItems={paginationTotalItems}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Toast Notifications */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[60] max-w-md w-[calc(100%-3rem)] sm:w-auto"
          aria-live="polite"
        >
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onClose={clearToast}
          />
        </div>
      )}
    </Workspace>
  )
}
