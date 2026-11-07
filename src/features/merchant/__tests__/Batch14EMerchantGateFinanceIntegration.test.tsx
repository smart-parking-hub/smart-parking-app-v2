import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

import { MerchantLotPage } from '../operations/LotPages'
import { MerchantBookingsPage, MerchantBookingDetailPage } from '../operations/BookingsPages'
import { MerchantScannerPage } from '../operations/ScannerPage'
import { MerchantRevenuePage, MerchantWithdrawalsPage } from '../operations/FinancePages'
import { getData, sendData } from '@/shared/api/resources'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
  sendData: vi.fn(),
}))

const mockGetData = vi.mocked(getData)
const mockSendData = vi.mocked(sendData)

const mockLotPricing = {
  id: 1,
  name: 'Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)',
  address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
  status: 'APPROVED',
  pricingRules: [
    {
      id: 10,
      vehicleType: 'CONTAINER_40FT',
      basePricePerHour: 35000,
      surgeMultiplier: 1.25,
      surgeStartTime: '06:00',
      surgeEndTime: '18:00',
      overtimePenaltyMultiplier: 1.5,
    },
  ],
}

const mockBookingsPage = {
  content: [
    {
      id: 101,
      bookingCode: 'BK-2026-X01',
      vehicleLicensePlate: '51D-894.12',
      vehiclePlate: '51D-894.12',
      parkingLotId: 1,
      parkingLotName: 'Bãi Cát Lái Gate 2',
      expectedCheckInTime: '2026-11-08T08:00:00Z',
      expectedCheckOutTime: '2026-11-08T14:00:00Z',
      advanceDeposit: 50000,
      totalAmount: 180000,
      status: 'PENDING_CHECKIN',
    },
    {
      id: 102,
      bookingCode: 'BK-2026-X02',
      vehicleLicensePlate: '60C-912.44',
      vehiclePlate: '60C-912.44',
      parkingLotId: 1,
      parkingLotName: 'Bãi Cát Lái Gate 2',
      expectedCheckInTime: '2026-11-08T07:30:00Z',
      expectedCheckOutTime: '2026-11-08T12:30:00Z',
      checkInTime: '2026-11-08T07:45:00Z',
      advanceDeposit: 40000,
      totalAmount: 150000,
      status: 'PARKING',
    },
    {
      id: 103,
      bookingCode: 'BK-2026-X03',
      vehicleLicensePlate: '72A-345.67',
      vehiclePlate: '72A-345.67',
      parkingLotId: 1,
      parkingLotName: 'Bãi Cát Lái Gate 2',
      expectedCheckInTime: '2026-11-07T10:00:00Z',
      expectedCheckOutTime: '2026-11-07T16:00:00Z',
      checkInTime: '2026-11-07T10:05:00Z',
      checkOutTime: '2026-11-07T15:50:00Z',
      advanceDeposit: 30000,
      totalAmount: 120000,
      status: 'COMPLETED',
    },
  ],
  currentPage: 0,
  totalPages: 1,
  totalElements: 3,
}

const mockBookingDetail = {
  id: 101,
  bookingCode: 'BK-2026-X01',
  vehicleLicensePlate: '51D-894.12',
  vehiclePlate: '51D-894.12',
  parkingLotId: 1,
  parkingLotName: 'Bãi Cát Lái Gate 2',
  expectedCheckInTime: '2026-11-08T08:00:00Z',
  expectedCheckOutTime: '2026-11-08T14:00:00Z',
  checkInTime: null,
  checkOutTime: null,
  advanceDeposit: 50000,
  totalAmount: 180000,
  status: 'PENDING_CHECKIN',
}

const mockRevenueData = {
  totalGrossRevenue: 120000000,
  totalNetRevenue: 108000000,
  totalPlatformFee: 12000000,
  currentWalletBalance: 65400000,
  minWithdrawalAmount: 50000,
  completedBookings: 320,
  series: [
    { period: '2026-11-01', revenue: 15000000, bookingCount: 42 },
    { period: '2026-11-02', revenue: 18500000, bookingCount: 51 },
  ],
}

const mockWithdrawalsData = {
  content: [
    {
      id: 501,
      amount: 25000000,
      bankName: 'Vietcombank',
      maskedBankAccount: '******1234',
      requestedAt: '2026-11-05T09:00:00Z',
      status: 'APPROVED',
      decisionReason: 'Đã giải ngân qua NAPAS 247',
    },
    {
      id: 502,
      amount: 15000000,
      bankName: 'Techcombank',
      maskedBankAccount: '******5678',
      requestedAt: '2026-11-07T14:30:00Z',
      status: 'PENDING',
      decisionReason: null,
    },
  ],
  currentPage: 0,
  totalPages: 1,
  totalElements: 2,
}

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/']) {
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

describe('BATCH-14E: Merchant Gate, Bookings & Financial Settlement Integration (SCR-033 to SCR-038)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Mock HTMLDialogElement for jsdom
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
    }
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
    }
  })

  // -------------------------------------------------------------
  // SCR-033: Merchant Pricing Configuration Page
  // -------------------------------------------------------------
  it('SCR-033: MerchantLotPage (pricing mode) renders 5 vehicle pricing rules and saves bulk tariff', async () => {
    mockGetData.mockResolvedValue(mockLotPricing)
    mockSendData.mockResolvedValueOnce({ success: true })

    renderWithProviders(
      <Routes>
        <Route path="/merchant/parking-lots/:id/pricing" element={<MerchantLotPage mode="pricing" />} />
        <Route path="/merchant/parking-lots" element={<div>Danh Mục Bãi</div>} />
      </Routes>,
      ['/merchant/parking-lots/1/pricing'],
    )

    // Workspace & Header
    expect(await screen.findByRole('heading', { level: 1, name: /Ma trận biểu phí/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /← Danh mục bãi/i })).toBeInTheDocument()

    // 4 tab navigation pills
    expect(screen.getByRole('link', { name: 'Tổng quan' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hồ sơ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sức chứa' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Biểu phí' })).toBeInTheDocument()

    // Wait for pricing form to render
    expect(await screen.findByText('Biểu phí cho 5 loại phương tiện')).toBeInTheDocument()
    expect(screen.getByText('Đầu kéo / Container')).toBeInTheDocument()

    // Submit form
    const saveButton = screen.getByRole('button', { name: /Lưu thay đổi/i })
    expect(saveButton).toBeInTheDocument()
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        'put',
        '/api/v1/merchant/parking-lots/1/pricing/bulk',
        expect.objectContaining({
          pricingRules: expect.any(Array),
        }),
      )
    })
    expect(await screen.findByText('Đã lưu cấu hình thành công.')).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-034: Merchant Bookings Management Page
  // -------------------------------------------------------------
  it('SCR-034: MerchantBookingsPage renders KPI metrics, filter tabs, and links to QR Scanner', async () => {
    mockGetData.mockResolvedValueOnce(mockBookingsPage)

    renderWithProviders(
      <Routes>
        <Route path="/merchant/bookings" element={<MerchantBookingsPage />} />
        <Route path="/merchant/qr-scanner" element={<div>Trạm Quét QR</div>} />
      </Routes>,
      ['/merchant/bookings'],
    )

    // Page Header
    expect(await screen.findByRole('heading', { level: 1, name: /Điều phối đặt chỗ/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Mở trạm quét QR →/i })).toBeInTheDocument()

    // Wait for data load
    expect(await screen.findByText('Tổng lượt đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Chờ vào · trang này')).toBeInTheDocument()
    expect(screen.getByText('Đang đỗ · trang này')).toBeInTheDocument()
    expect(screen.getByText('Hoàn tất · trang này')).toBeInTheDocument()

    // Status filter tabs with counts
    expect(screen.getByRole('tab', { name: /Tất cả trạng thái/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Chờ vào bãi/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Đang đỗ xe/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Đã hoàn tất/i })).toBeInTheDocument()

    // Table rows
    expect(screen.getByText('BK-2026-X01')).toBeInTheDocument()
    expect(screen.getByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText('BK-2026-X02')).toBeInTheDocument()
    expect(screen.getByText('60C-912.44')).toBeInTheDocument()

    // Filter by PARKING
    const parkingTab = screen.getByRole('tab', { name: /Đang đỗ xe/i })
    fireEvent.click(parkingTab)

    // Only PARKING row is shown
    expect(screen.getByText('BK-2026-X02')).toBeInTheDocument()
    expect(screen.queryByText('BK-2026-X01')).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-035: Merchant Booking Detail Page
  // -------------------------------------------------------------
  it('SCR-035: MerchantBookingDetailPage renders vehicle journey timeline and gate dispatch action', async () => {
    mockGetData.mockResolvedValueOnce(mockBookingDetail)

    renderWithProviders(
      <Routes>
        <Route path="/merchant/bookings/:id" element={<MerchantBookingDetailPage />} />
        <Route path="/merchant/bookings" element={<div>Danh sách đặt chỗ</div>} />
        <Route path="/merchant/qr-scanner" element={<div>Trạm Scanner</div>} />
      </Routes>,
      ['/merchant/bookings/101'],
    )

    // Header & Dossier Code
    expect(await screen.findByRole('heading', { level: 1, name: /Hồ sơ đặt chỗ #101/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Danh sách đặt chỗ/i })).toBeInTheDocument()

    // 4 Metrics
    expect(await screen.findByText('Mã vé')).toBeInTheDocument()
    expect(screen.getByText('BK-2026-X01')).toBeInTheDocument()
    expect(screen.getByText('Đặt cọc')).toBeInTheDocument()
    expect(screen.getByText('Tổng phí')).toBeInTheDocument()

    // Vehicle Journey Panel
    expect(screen.getByText('Hành trình phương tiện')).toBeInTheDocument()
    expect(screen.getByText('Biển kiểm soát')).toBeInTheDocument()
    expect(screen.getByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText('Bãi Cát Lái Gate 2')).toBeInTheDocument()

    // Dispatch QR Link with prefilled query parameters
    const qrLink = screen.getByRole('link', { name: /Xử lý tại trạm QR →/i })
    expect(qrLink).toBeInTheDocument()
    expect(qrLink.getAttribute('href')).toContain('/merchant/qr-scanner?code=BK-2026-X01&lot=1')
  })

  // -------------------------------------------------------------
  // SCR-036: Barie Gate Terminal & QR Scanner Station
  // -------------------------------------------------------------
  it('SCR-036: MerchantScannerPage performs check-in, check-out settlement dialog and cash confirmation', async () => {
    mockGetData.mockResolvedValueOnce({
      content: [{ id: 1, name: 'Bãi Cát Lái Gate 2' }],
      totalPages: 1,
      totalElements: 1,
    })
    mockSendData
      .mockResolvedValueOnce({
        bookingCode: 'BK-2026-X02',
        totalAmount: 150000,
        advanceDeposit: 40000,
        amountDue: 110000,
        parkingMinutes: 240,
        bookingStatus: 'AWAITING_FINAL_PAYMENT',
      })
      .mockResolvedValueOnce(null)

    renderWithProviders(<MerchantScannerPage />, ['/merchant/qr-scanner?code=BK-2026-X02&lot=1'])

    // Header & Eyebrow
    expect(await screen.findByText(/GATE CONTROL \/ MERCHANT/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Trạm kiểm soát QR/i })).toBeInTheDocument()

    // Camera Panel & Badge
    expect(screen.getByText('Camera tại cổng')).toBeInTheDocument()
    expect(screen.getByText('CAMERA TẮT')).toBeInTheDocument()

    // Switch to XE RA mode
    const outButton = screen.getByRole('button', { name: 'XE RA' })
    fireEvent.click(outButton)

    // Wait for lots query to populate select
    expect(await screen.findByText('Bãi Cát Lái Gate 2')).toBeInTheDocument()

    // Submit checkout query
    const submitBtn = screen.getByRole('button', { name: 'Kiểm tra & quyết toán xe ra' })
    fireEvent.click(submitBtn)

    // Settlement Dialog opens
    expect(await screen.findByText('Quyết toán lượt đỗ')).toBeInTheDocument()
    expect(screen.getByText('BK-2026-X02')).toBeInTheDocument()
    expect(screen.getByText('240 phút')).toBeInTheDocument()
    expect(screen.getByText('CÒN PHẢI THU')).toBeInTheDocument()

    // Cash confirmation
    const confirmCashBtn = screen.getByRole('button', { name: /Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ/i })
    expect(confirmCashBtn).toBeInTheDocument()
    fireEvent.click(confirmCashBtn)

    await waitFor(() => {
      expect(mockSendData).toHaveBeenLastCalledWith(
        'post',
        '/api/v1/merchant/confirm-cash',
        { bookingCode: 'BK-2026-X02', parkingLotId: 1 },
      )
    })
  })

  // -------------------------------------------------------------
  // SCR-037: Merchant Revenue Reports & Analytics
  // -------------------------------------------------------------
  it('SCR-037: MerchantRevenuePage displays revenue KPIs, time grouping and series visualization', async () => {
    mockGetData.mockResolvedValueOnce(mockRevenueData)

    renderWithProviders(<MerchantRevenuePage />, ['/merchant/revenue'])

    // Header & Eyebrow
    expect(await screen.findByText(/FINANCE \/ REVENUE/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Hiệu quả kinh doanh/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ví & Rút tiền →/i })).toBeInTheDocument()

    // Filter controls
    expect(screen.getByLabelText(/Từ ngày/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Đến ngày/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nhóm thời gian/i)).toBeInTheDocument()

    // 4 Metrics
    expect(await screen.findByText('Doanh thu gộp')).toBeInTheDocument()
    expect(screen.getByText('Doanh thu thực nhận')).toBeInTheDocument()
    expect(screen.getByText('Phí nền tảng')).toBeInTheDocument()
    expect(screen.getByText('Số dư khả dụng')).toBeInTheDocument()

    // Series Panel
    expect(screen.getByText('Nhịp doanh thu')).toBeInTheDocument()
    expect(screen.getByText('2026-11-01')).toBeInTheDocument()
    expect(screen.getByText('42 lượt')).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-038: Merchant Wallet & Withdrawals Desk (TSK-P0-01)
  // -------------------------------------------------------------
  it('SCR-038: MerchantWithdrawalsPage enforces TSK-P0-01 guard when balance < 50k and opens payout modal when eligible', async () => {
    // Eligible balance >= 50,000 VND
    mockGetData
      .mockImplementation(async (url: string) => {
        if (url === '/api/v1/merchant/revenue') return mockRevenueData
        if (url === '/api/v1/withdrawals') return mockWithdrawalsData
        if (url === '/api/v1/merchant/profile') {
          return {
            bankName: 'Vietcombank',
            bankAccountNum: '0071001234567',
            fullName: 'Lê Văn Thành',
          }
        }
        return {}
      })

    renderWithProviders(<MerchantWithdrawalsPage />, ['/merchant/withdrawals'])

    // Header
    expect(await screen.findByRole('heading', { level: 1, name: /Ví & Yêu cầu rút tiền/i })).toBeInTheDocument()

    // Wait for revenue metrics to resolve
    expect(await screen.findByText('Thực nhận tích lũy')).toBeInTheDocument()

    // Withdrawal action button is ENABLED since currentWalletBalance = 65,400,000 >= 50,000
    const withdrawBtn = screen.getByRole('button', { name: /\+ Yêu cầu rút tiền/i })
    expect(withdrawBtn).toBeEnabled()

    // Open Dialog
    fireEvent.click(withdrawBtn)
    expect(await screen.findByText('Tạo yêu cầu rút tiền')).toBeInTheDocument()

    // Verify auto-prefilled bank details from merchant profile
    expect(await screen.findByDisplayValue('Vietcombank')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0071001234567')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Lê Văn Thành')).toBeInTheDocument()

    // Quick select buttons: Tối thiểu & Toàn bộ
    const minQuickBtn = screen.getByRole('button', { name: /Tối thiểu/i })
    expect(minQuickBtn).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Toàn bộ/i })).toBeInTheDocument()

    // Click quick select minimum amount (50,000 VND)
    fireEvent.click(minQuickBtn)

    // Submit withdrawal
    mockSendData.mockResolvedValueOnce({ success: true, id: 999 })
    const submitWithdrawBtn = screen.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' })
    fireEvent.click(submitWithdrawBtn)

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        'post',
        '/api/v1/withdrawals',
        expect.objectContaining({
          bankName: 'Vietcombank',
          bankAccountNumber: '0071001234567',
          accountHolderName: 'Lê Văn Thành',
        }),
      )
    })
  })

  it('SCR-038: TSK-P0-01 disables withdrawal button with explanatory tooltip when wallet balance < 50,000 VND', async () => {
    // Insufficient balance: 35,000 VND < 50,000 VND
    mockGetData.mockImplementation(async (url: string) => {
      if (url === '/api/v1/merchant/revenue') {
        return {
          ...mockRevenueData,
          currentWalletBalance: 35000,
          minWithdrawalAmount: 50000,
        }
      }
      if (url === '/api/v1/withdrawals') return mockWithdrawalsData
      return {}
    })

    renderWithProviders(<MerchantWithdrawalsPage />, ['/merchant/withdrawals'])

    expect(await screen.findByRole('heading', { level: 1, name: /Ví & Yêu cầu rút tiền/i })).toBeInTheDocument()

    // Wait for revenue metrics to resolve
    expect(await screen.findByText('Thực nhận tích lũy')).toBeInTheDocument()

    // Button MUST be disabled
    const withdrawBtn = screen.getByRole('button', { name: /\+ Yêu cầu rút tiền/i })
    expect(withdrawBtn).toBeDisabled()

    // Warning notice explaining insufficient balance
    expect(await screen.findByText(/Cần tối thiểu/i)).toBeInTheDocument()
    expect(await screen.findByText(/chưa đạt hạn mức tối thiểu/i)).toBeInTheDocument()
  })
})
