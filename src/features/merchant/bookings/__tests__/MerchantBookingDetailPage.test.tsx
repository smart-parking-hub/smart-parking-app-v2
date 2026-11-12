import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { store } from '@/app/store'
import type { Booking } from '@/entities/operations'
import { RequireRole } from '@/features/auth'
import { getData } from '@/shared/api/resources'
import {
  buildBookingBarrierSummary,
  computeRemainingBookingAmount,
  parseValidBookingRouteId,
} from '../api/merchantBookingsApi'
import { MerchantBookingDetailPage } from '../pages/MerchantBookingDetailPage'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
}))

const mockGetData = vi.mocked(getData)

function renderDetailApp(
  ui: ReactNode,
  initialEntries = ['/merchant/bookings/901'],
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
      </Provider>
    </QueryClientProvider>,
  )
}

function createJwt(role = 'ROLE_MERCHANT') {
  const payload = {
    role,
    sub: '0901234567',
    exp: Math.floor(Date.now() / 1000) + 3600,
  }
  return `test.${btoa(JSON.stringify(payload))}.sig`
}

const completedBooking: Booking = {
  id: 901,
  bookingCode: 'BK-2026-901',
  driverId: 501,
  vehicleId: 301,
  parkingLotId: 12,
  merchantId: 2,
  vehiclePlate: '51D-901.88',
  vehicleLicensePlate: '51D-901.88',
  vehicleType: 'CONTAINER',
  parkingLotName: 'Bãi Cát Lái Gate 2',
  parkingLotAddress: 'Số 10 Nguyễn Thị Định, TP. Thủ Đức',
  status: 'COMPLETED',
  hourlyRate: 40000,
  surgeMultiplier: 1.5,
  surgeStartTime: '17:00',
  surgeEndTime: '21:00',
  overtimePenaltyMultiplier: 2,
  advanceDeposit: 80000,
  totalAmount: 280000,
  createdAt: '2026-11-12T06:30:00Z',
  expiresAt: '2026-11-12T06:45:00Z',
  expectedCheckInTime: '2026-11-12T08:00:00Z',
  expectedCheckOutTime: '2026-11-12T12:00:00Z',
  checkInTime: '2026-11-12T07:45:00Z',
  checkOutTime: '2026-11-12T12:45:00Z',
}

const overtimeBooking: Booking = {
  ...completedBooking,
  id: 902,
  bookingCode: 'BK-2026-902',
  vehiclePlate: '60C-902.11',
  vehicleLicensePlate: '60C-902.11',
  status: 'OVERTIME',
  checkInTime: '2026-11-12T08:15:00Z',
  checkOutTime: null,
}

const cancelledBooking: Booking = {
  id: 903,
  bookingCode: 'BK-2026-903',
  driverId: 503,
  vehicleId: 303,
  parkingLotId: 15,
  merchantId: 2,
  vehiclePlate: '72A-903.55',
  vehicleLicensePlate: '72A-903.55',
  vehicleType: 'HEAVY_TRUCK',
  parkingLotName: 'Depot Bình Dương 1',
  parkingLotAddress: 'QL13, Thuận An, Bình Dương',
  status: 'CANCELLED',
  hourlyRate: 30000,
  advanceDeposit: 60000,
  totalAmount: 180000,
  createdAt: '2026-11-10T08:00:00Z',
  expiresAt: '2026-11-10T08:15:00Z',
  expectedCheckInTime: '2026-11-11T10:00:00Z',
  expectedCheckOutTime: '2026-11-11T16:00:00Z',
  cancelledAt: '2026-11-11T07:30:00Z',
  cancellationReason: 'Tài xế điều chuyển lộ trình gấp',
  refundAmount: 60000,
  refundPercentage: 100,
  refundPolicy: 'Hoàn 100% trước 24h',
  refundStatus: 'REFUNDED',
  refundReference: 'RF-90301',
}

describe('SCR-035: MerchantBookingDetailPage & Barrier Timeline Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Pure Booking Detail & Barrier Timeline Utilities', () => {
    it('validates positive numeric route IDs and rejects malformed strings or non-positive numbers', () => {
      expect(parseValidBookingRouteId('101')).toBe(101)
      expect(parseValidBookingRouteId(' 88 ')).toBe(88)
      expect(parseValidBookingRouteId(42)).toBe(42)

      expect(parseValidBookingRouteId(undefined)).toBeNull()
      expect(parseValidBookingRouteId('')).toBeNull()
      expect(parseValidBookingRouteId('abc')).toBeNull()
      expect(parseValidBookingRouteId('12abc')).toBeNull()
      expect(parseValidBookingRouteId('0')).toBeNull()
      expect(parseValidBookingRouteId('-5')).toBeNull()
      expect(parseValidBookingRouteId('12.5')).toBeNull()
    })

    it('computes remaining amount safely and clamps at 0', () => {
      expect(computeRemainingBookingAmount({ totalAmount: 280000, advanceDeposit: 80000 })).toBe(
        200000,
      )
      expect(computeRemainingBookingAmount({ totalAmount: 50000, advanceDeposit: 80000 })).toBe(0)
      expect(computeRemainingBookingAmount({ totalAmount: null, advanceDeposit: 50000 })).toBeNull()
    })

    it('builds chronological barrier events across COMPLETED, AWAITING_FINAL_PAYMENT, EXPIRED, and Jackson array timestamps', () => {
      const completedSummary = buildBookingBarrierSummary(completedBooking)
      expect(completedSummary.plannedDurationLabel).toBe('4 giờ')
      expect(completedSummary.parkingDurationLabel).toBe('5 giờ')
      expect(completedSummary.checkInVarianceLabel).toBe('Sớm 15 phút')
      expect(completedSummary.checkOutVarianceLabel).toBe('Quá dự kiến 45 phút')
      expect(completedSummary.events.map((e) => e.id)).toEqual([
        'created',
        'hold-confirmed',
        'gate-check-in',
        'gate-check-out',
        'settlement-completed',
      ])

      const awaitingCashSummary = buildBookingBarrierSummary({
        ...completedBooking,
        status: 'AWAITING_FINAL_PAYMENT',
        createdAt: [2026, 11, 12, 6, 30, 0],
        expiresAt: [2026, 11, 12, 6, 45, 0],
        expectedCheckInTime: [2026, 11, 12, 8, 0, 0],
        expectedCheckOutTime: [2026, 11, 12, 12, 0, 0],
        checkInTime: [2026, 11, 12, 8, 2, 0],
        checkOutTime: [2026, 11, 12, 12, 0, 0],
      })
      expect(awaitingCashSummary.checkInVarianceLabel).toBe('Đúng giờ hẹn')
      expect(awaitingCashSummary.events.at(-1)?.id).toBe('settlement-cash-pending')
      expect(awaitingCashSummary.events.at(-1)?.deltaBadge?.label).toContain('200.000')

      const expiredSummary = buildBookingBarrierSummary({
        ...completedBooking,
        status: 'EXPIRED',
        checkInTime: null,
        checkOutTime: null,
      })
      expect(expiredSummary.events.map((e) => e.id)).toEqual([
        'created',
        'hold-expired',
      ])
    })
  })

  it('shows Loading Skeleton then renders full dossier, remaining balance, and Barrier Log Timeline', async () => {
    let resolvePending!: (value: Booking) => void
    mockGetData.mockReturnValueOnce(
      new Promise((resolve) => {
        resolvePending = resolve
      }),
    )

    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
        <Route path="/merchant/bookings" element={<div>Danh sách</div>} />
      </Routes>,
      ['/merchant/bookings/901'],
    )

    expect(screen.getByTestId('merchant-booking-detail-skeleton')).toBeInTheDocument()

    resolvePending(completedBooking)

    expect(await screen.findByText('Nhật ký Barie & Tiến trình Vận hành')).toBeInTheDocument()
    expect(screen.getByText('BK-2026-901')).toBeInTheDocument()
    expect(screen.getByText('Phần còn lại sau cọc')).toBeInTheDocument()
    expect(screen.getByText(/Còn lại sau cọc:/)).toBeInTheDocument()

    const summaryStrip = screen.getByTestId('barrier-timeline-metrics')
    expect(within(summaryStrip).getByText('4 giờ')).toBeInTheDocument()
    expect(within(summaryStrip).getByText('5 giờ')).toBeInTheDocument()
    expect(within(summaryStrip).getByText('Sớm 15 phút')).toBeInTheDocument()
    expect(within(summaryStrip).getByText('Quá dự kiến 45 phút')).toBeInTheDocument()

    const timeline = screen.getByRole('list', {
      name: 'Tiến trình nhật ký barie và trạng thái đơn',
    })
    expect(within(timeline).getByText('Khởi tạo đơn đặt chỗ')).toBeInTheDocument()
    expect(within(timeline).getByText('Barie xác nhận xe vào bãi (Check-in)')).toBeInTheDocument()
    expect(within(timeline).getByText('Barie xác nhận xe ra bãi (Check-out)')).toBeInTheDocument()
    expect(within(timeline).getByText('Hoàn tất quyết toán & giải phóng chỗ đỗ')).toBeInTheDocument()

    expect(
      screen.getByText(/Nhật ký được tổng hợp trực tiếp từ các mốc thời gian xác thực/i),
    ).toBeInTheDocument()

    // Completed booking keeps gate CTA styled as secondary instead of primary orange
    const gateLink = screen.getByRole('link', { name: 'Xử lý tại trạm QR →' })
    expect(gateLink.className).not.toContain('bg-[#d95f00]')
  })

  it('guards malformed :id params with EmptyState without firing API calls, and handles empty response payload', async () => {
    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
        <Route path="/merchant/bookings" element={<div>Danh sách đặt chỗ</div>} />
      </Routes>,
      ['/merchant/bookings/not-an-id'],
    )

    expect(await screen.findByText('Mã đơn đặt chỗ không hợp lệ')).toBeInTheDocument()
    expect(mockGetData).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Quay về danh sách đặt chỗ' })).toHaveAttribute(
      'href',
      '/merchant/bookings',
    )

    cleanup()
    mockGetData.mockResolvedValueOnce(null)

    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
      </Routes>,
      ['/merchant/bookings/4040'],
    )

    expect(await screen.findByText('Không tìm thấy hồ sơ đặt chỗ')).toBeInTheDocument()
  })

  it('highlights actionable QR gate CTA on OVERTIME bookings and renders cancellation + refund log on CANCELLED bookings', async () => {
    mockGetData.mockResolvedValueOnce(overtimeBooking)

    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
      </Routes>,
      ['/merchant/bookings/902'],
    )

    expect(
      await screen.findByText('Cảnh báo phương tiện đỗ quá giờ dự kiến'),
    ).toBeInTheDocument()
    expect(screen.getByText('Phạt quá giờ x2')).toBeInTheDocument()
    expect(screen.getByText('Chờ quét QR đóng lượt & mở barie ra')).toBeInTheDocument()

    const overtimeGateLink = screen.getByRole('link', { name: 'Xử lý tại trạm QR →' })
    expect(overtimeGateLink.className).toContain('bg-[#d95f00]')
    expect(overtimeGateLink).toHaveAttribute(
      'href',
      '/merchant/qr-scanner?code=BK-2026-902&lot=12',
    )

    cleanup()
    mockGetData.mockResolvedValueOnce(cancelledBooking)

    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
      </Routes>,
      ['/merchant/bookings/903'],
    )

    expect(
      await screen.findByText('Đơn đặt chỗ đã hủy trước khi vào bãi'),
    ).toBeInTheDocument()
    expect(screen.getByText('Tài xế điều chuyển lộ trình gấp')).toBeInTheDocument()
    expect(screen.getByText('Hoàn 100% trước 24h')).toBeInTheDocument()
    expect(screen.getByText('RF-90301')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('handles initial ErrorState + Retry recovery, non-blocking background refresh Alert, Refresh Toast, and Copy Toast', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })

    mockGetData
      .mockRejectedValueOnce(new Error('Không tìm thấy booking'))
      .mockResolvedValueOnce(completedBooking)
      .mockRejectedValueOnce(new Error('Mất kết nối tạm thời'))
      .mockResolvedValueOnce(completedBooking)

    renderDetailApp(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
      </Routes>,
      ['/merchant/bookings/901'],
    )

    // Initial ErrorState
    expect(await screen.findByText('Không thể tải hồ sơ đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Không tìm thấy booking')).toBeInTheDocument()

    // Retry recovers page
    fireEvent.click(screen.getByRole('button', { name: /Thử lại/i }))
    expect(await screen.findByText('BK-2026-901')).toBeInTheDocument()

    // Background refresh fails -> non-blocking Alert + keeps dossier visible
    const refreshBtn = screen.getByRole('button', { name: 'Làm mới hồ sơ đặt chỗ' })
    fireEvent.click(refreshBtn)
    expect(
      await screen.findByText('Không thể làm mới hồ sơ đặt chỗ'),
    ).toBeInTheDocument()
    expect(screen.getByText('Mất kết nối tạm thời')).toBeInTheDocument()
    expect(screen.getByText('BK-2026-901')).toBeInTheDocument()

    // Subsequent refresh succeeds -> clears Alert & shows Toast
    fireEvent.click(refreshBtn)
    expect(await screen.findByText('Đã cập nhật hồ sơ đặt chỗ')).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.queryByText('Không thể làm mới hồ sơ đặt chỗ'),
      ).not.toBeInTheDocument()
    })

    // Copy booking code button -> clipboard write & Toast
    fireEvent.click(screen.getByRole('button', { name: /Sao chép mã vé để tra cứu/i }))
    expect(writeTextMock).toHaveBeenCalledWith('BK-2026-901')
    expect(await screen.findByText('Đã sao chép mã đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Đã sao chép mã vé')).toBeInTheDocument()
  })

  it('enforces MERCHANT RBAC guard on /merchant/bookings/:id', async () => {
    localStorage.setItem('access_token', createJwt('ROLE_DRIVER'))

    renderDetailApp(
      <Routes>
        <Route
          path="/merchant/bookings/:id"
          element={
            <RequireRole role="MERCHANT">
              <MerchantBookingDetailPage />
            </RequireRole>
          }
        />
        <Route path="/403" element={<p>Không có quyền truy cập</p>} />
      </Routes>,
      ['/merchant/bookings/901'],
    )

    expect(await screen.findByText('Không có quyền truy cập')).toBeInTheDocument()
    expect(mockGetData).not.toHaveBeenCalled()
  })
})

