import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { errorMessage } from '@/shared/api/resources'
import { Alert } from '@/shared/components/Alert'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { EmptyState } from '@/shared/components/EmptyState'
import { ErrorState } from '@/shared/components/ErrorState'
import { Toast } from '@/shared/components/Toast'
import {
  button,
  secondary,
  Workspace,
} from '@/shared/components/Workspace'
import {
  buildBookingBarrierSummary,
  computeRemainingBookingAmount,
  formatBookingDateTime,
  formatBookingMoney,
  parseValidBookingRouteId,
} from '../api/merchantBookingsApi'
import { MerchantBookingBarrierTimeline } from '../components/MerchantBookingBarrierTimeline'
import {
  MerchantBookingDetailSidebar,
  MerchantBookingJourneyPanel,
  MerchantBookingTariffAndRefundPanel,
} from '../components/MerchantBookingDetailSections'
import { MerchantBookingDetailSkeleton } from '../components/MerchantBookingDetailSkeleton'
import { useMerchantBookingDetailQuery } from '../hooks/useMerchantBookingsQuery'
import type { MerchantBookingToastState } from '../types/merchantBookingsTypes'

export function MerchantBookingDetailPage() {
  const { id } = useParams()
  const validBookingId = useMemo(() => parseValidBookingRouteId(id), [id])
  const detailQuery = useMerchantBookingDetailQuery(validBookingId)
  const data = detailQuery.data

  const [copiedCode, setCopiedCode] = useState(false)
  const [toast, setToast] = useState<MerchantBookingToastState | null>(null)
  const nextToastIdRef = useRef(1)
  const copyTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current)
      }
    }
  }, [])

  const emitToast = (
    title: string,
    variant: MerchantBookingToastState['variant'] = 'info',
    message?: string,
  ) => {
    setToast({
      id: nextToastIdRef.current++,
      title,
      message,
      variant,
    })
  }

  const handleCopyBookingCode = async (bookingCode: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(bookingCode)
      }
    } catch {
      // Clipboard API may be unavailable in restricted contexts; still emit feedback toast.
    }

    setCopiedCode(true)
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current)
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedCode(false)
    }, 1800)

    emitToast(
      'Đã sao chép mã đặt chỗ',
      'success',
      'Mã vé đã được lưu vào khay nhớ tạm để tra cứu tại trạm cổng.',
    )
  }

  const handleRefresh = async () => {
    if (validBookingId === null) return
    setToast(null)
    const result = await detailQuery.refetch()
    if (!result.isError && result.data) {
      emitToast(
        'Đã cập nhật hồ sơ đặt chỗ',
        'success',
        'Dữ liệu đơn và nhật ký barie đã được đồng bộ mới nhất.',
      )
    }
  }

  const remainingAmount = useMemo(
    () => (data ? computeRemainingBookingAmount(data) : null),
    [data],
  )
  const barrierSummary = useMemo(
    () => (data ? buildBookingBarrierSummary(data) : null),
    [data],
  )

  return (
    <Workspace
      title={id ? `Hồ sơ đặt chỗ #${id}` : 'Hồ sơ đặt chỗ'}
      eyebrow="CHI TIẾT VÉ / MERCHANT"
      description="Xem hành trình xe, nhật ký barie theo mốc thời gian, biểu phí áp dụng và chi tiết hoàn tiền."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <Link className={secondary} to="/merchant/bookings">
            ← Danh sách đặt chỗ
          </Link>
          {validBookingId !== null && (
            <button
              type="button"
              onClick={() => void handleRefresh()}
              disabled={detailQuery.isFetching}
              aria-busy={detailQuery.isFetching}
              aria-label="Làm mới hồ sơ đặt chỗ"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-slate-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${detailQuery.isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Làm mới</span>
            </button>
          )}
          <Link className={button} to="/merchant/qr-scanner">
            Mở trạm quét QR
          </Link>
        </div>
      }
    >
      {validBookingId === null ? (
        <EmptyState
          variant="card"
          title="Mã đơn đặt chỗ không hợp lệ"
          description="Đường dẫn hồ sơ cần chứa mã đơn dạng số nguyên dương (ví dụ: /merchant/bookings/101)."
          action={
            <Link className={button} to="/merchant/bookings">
              Quay về danh sách đặt chỗ
            </Link>
          }
        />
      ) : detailQuery.isPending && !data ? (
        <MerchantBookingDetailSkeleton />
      ) : detailQuery.isError && !data ? (
        <ErrorState
          variant="card"
          title="Không thể tải hồ sơ đặt chỗ"
          description={errorMessage(detailQuery.error)}
          onRetry={() => void detailQuery.refetch()}
          isRetrying={detailQuery.isFetching}
        />
      ) : !data || !barrierSummary ? (
        <EmptyState
          variant="card"
          title="Không tìm thấy hồ sơ đặt chỗ"
          description="Đơn đặt chỗ không tồn tại hoặc máy chủ chưa trả về dữ liệu chi tiết."
          action={
            <Link className={button} to="/merchant/bookings">
              Quay về danh sách đặt chỗ
            </Link>
          }
        />
      ) : (
        <div data-testid="merchant-booking-detail-content" className="space-y-6">
          {detailQuery.isError && (
            <Alert
              variant="error"
              title="Không thể làm mới hồ sơ đặt chỗ"
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleRefresh()}
                  isLoading={detailQuery.isFetching}
                >
                  Thử lại
                </Button>
              }
            >
              {errorMessage(detailQuery.error)}
            </Alert>
          )}

          <div
            data-testid="merchant-booking-detail-metrics"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-4"
          >
            <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-2xs">
              <p className="font-mono text-xs uppercase text-brand-muted">Mã vé</p>
              <p className="mt-2.5 break-all font-mono font-sora text-xl md:text-2xl font-bold text-brand-navy">
                {data.bookingCode}
              </p>
              <p className="mt-1.5 text-xs text-brand-muted tabular-nums">
                Khởi tạo: {formatBookingDateTime(data.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-2xs">
              <p className="font-mono text-xs uppercase text-brand-muted">Trạng thái</p>
              <div className="mt-2.5 flex items-center min-h-[32px]">
                <Badge value={data.status} dot size="md" />
              </div>
              <p className="mt-1.5 text-xs text-brand-muted">
                Tình trạng xử lý hiện tại tại bãi
              </p>
            </div>

            <div className="rounded-2xl border border-brand-border bg-white p-4 md:p-5 shadow-2xs">
              <p className="font-mono text-xs uppercase text-brand-muted">Đặt cọc</p>
              <p className="mt-2.5 font-mono font-sora text-xl md:text-2xl font-bold tabular-nums text-brand-navy">
                {formatBookingMoney(data.advanceDeposit)}
              </p>
              <p className="mt-1.5 text-xs text-brand-muted">
                Khoản giữ chỗ đã ghi nhận
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200/90 bg-orange-50/45 p-4 md:p-5 shadow-2xs">
              <p className="font-mono text-xs uppercase text-[#9e4300]">Tổng phí</p>
              <p className="mt-2.5 font-mono font-sora text-xl md:text-2xl font-bold tabular-nums text-[#9e4300]">
                {formatBookingMoney(data.totalAmount)}
              </p>
              {remainingAmount !== null && (
                <p className="mt-1.5 text-xs font-medium text-[#9e4300]/85 tabular-nums">
                  Còn lại sau cọc: {formatBookingMoney(remainingAmount)}
                </p>
              )}
            </div>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(310px,1fr)]">
            <div className="min-w-0 space-y-6">
              <MerchantBookingBarrierTimeline summary={barrierSummary} />
              <MerchantBookingJourneyPanel booking={data} />
              <MerchantBookingTariffAndRefundPanel
                booking={data}
                remainingAmount={remainingAmount}
              />
            </div>

            <div className="min-w-0 lg:sticky lg:top-6">
              <MerchantBookingDetailSidebar
                booking={data}
                barrierSummary={barrierSummary}
                copiedCode={copiedCode}
                isFetching={detailQuery.isFetching}
                onCopyBookingCode={(code) => void handleCopyBookingCode(code)}
              />
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed top-20 right-4 sm:right-6 z-[100] w-[calc(100%-2rem)] max-w-md sm:w-auto animate-in fade-in slide-in-from-top-2 slide-in-from-right-4 duration-200"
          aria-live="polite"
        >
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </Workspace>
  )
}
