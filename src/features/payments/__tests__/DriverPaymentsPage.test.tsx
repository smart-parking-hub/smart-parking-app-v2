import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { DriverPaymentsPage } from '../pages/DriverPaymentsPage'
import { fallbackTransactions } from '../api/paymentApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/payments']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SCR-019: DriverPaymentsPage (Lịch sử thanh toán & Hóa đơn VAT)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        data: {
          content: fallbackTransactions,
          totalElements: fallbackTransactions.length,
          totalPages: 1,
        },
      },
    })
  })

  it('renders command header, TT78 ticker, title, and action CTA buttons', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    expect(
      screen.getByText(/KẾT NỐI TỔNG CỤC THUẾ \(HĐĐT TT78\):/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Lịch Sử Thanh Toán & Hóa Đơn VAT/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/VTP-VN-51C-LOGISTICS/i)).toBeInTheDocument()
    expect(screen.getAllByText(/0301489271/i).length).toBeGreaterThanOrEqual(1)

    // Action buttons
    expect(
      screen.getByRole('button', { name: /CẤU HÌNH XUẤT HÓA ĐƠN CÔNG TY/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /XUẤT BÁO CÁO EXCEL \/ PDF ➞/i })
    ).toBeInTheDocument()
  })

  it('renders 4 Bento financial metrics tiles', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    expect(screen.getByText(/TỔNG CHI PHÍ THÁNG NÀY/i)).toBeInTheDocument()
    expect(screen.getByText(/3.420.000/i)).toBeInTheDocument()
    expect(screen.getByText(/18 lượt đỗ container/i)).toBeInTheDocument()

    expect(screen.getByText(/TIỀN CỌC ĐÃ HOÀN TRẢ/i)).toBeInTheDocument()
    expect(screen.getByText(/400.000/i)).toBeInTheDocument()

    expect(screen.getByText(/PHẠT QUÁ GIỜ PHÁT SINH/i)).toBeInTheDocument()
    expect(screen.getByText(/CHUẨN GIỜ/i)).toBeInTheDocument()

    expect(screen.getByText(/HĐĐT VAT ĐÃ ĐỒNG BỘ/i)).toBeInTheDocument()
    expect(screen.getByText(/\/ 18 HĐ/i)).toBeInTheDocument()
  })

  it('renders filter toolbar with search input and segmented category tags', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    expect(
      screen.getByPlaceholderText(/Tra cứu: Mã giao dịch PayOS, Mã Booking/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Tháng 02\/2026 \(01\/02 - 28\/02\)/i)).toBeInTheDocument()

    // Segmented filters
    expect(screen.getByRole('button', { name: /Tất cả \(8\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tiền cọc giữ slot/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Quyết toán khoản cuối/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hoàn cọc/i })).toBeInTheDocument()
  })

  it('renders master transaction table with transaction codes, fees, and PDF buttons', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    expect(screen.getByText(/Bảng Kê Chi Tiết Giao Dịch PayOS & Tiền Bãi/i)).toBeInTheDocument()
    expect(screen.getByText(/8 BẢN GHI ĐỐI SOÁT/i)).toBeInTheDocument()

    expect(screen.getAllByText('TXN-2026-9040').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('REF-2026-1102')).toBeInTheDocument()
    expect(screen.getByText('TXN-2026-9032')).toBeInTheDocument()
    expect(screen.getByText('TXN-2026-8874')).toBeInTheDocument()

    // Check PDF VAT buttons
    expect(screen.getAllByRole('button', { name: /PDF VAT/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('renders receipt inspector panel for selected transaction with cost breakdown', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    expect(screen.getByTestId('receipt-inspector-panel')).toBeInTheDocument()
    expect(screen.getByText(/BIÊN LAI ĐIỆN TỬ CHÍNH THỨC/i)).toBeInTheDocument()
    expect(screen.getByText(/Chi Tiết Thanh Toán #TXN-2026-9040/i)).toBeInTheDocument()
    expect(screen.getByText(/Berth 114 \(Reefer Hookup 380V\) - Gate 2/i)).toBeInTheDocument()

    // Breakdown lines
    expect(screen.getByText(/Phí lưu bãi Container Reefer \(12 giờ\)/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Phụ thu cấp điện lạnh chuyên dụng \(Shore Power 3-Phase\)/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Thuế Giá Trị Gia Tăng \(VAT 8%\)/i)).toBeInTheDocument()
    expect(screen.getByText(/TỔNG CỘNG THANH TOÁN \(ĐÃ VAT\)/i)).toBeInTheDocument()
  })

  it('updates receipt inspector when selecting another transaction row', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const rowRefund = screen.getByText('REF-2026-1102')
    fireEvent.click(rowRefund)

    await waitFor(() => {
      expect(
        screen.getByText(/Chi Tiết Thanh Toán #REF-2026-1102/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/TỔNG TIỀN HOÀN TRẢ/i)).toBeInTheDocument()
    })
  })

  it('filters transaction list by keyword', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const searchInput = screen.getByPlaceholderText(/Tra cứu: Mã giao dịch PayOS, Mã Booking/i)
    fireEvent.change(searchInput, { target: { value: 'Sóng Thần' } })

    expect(screen.getByText('TXN-2026-8874')).toBeInTheDocument()
    expect(screen.queryByText('TXN-2026-8519')).not.toBeInTheDocument()
  })

  it('filters transaction list by category tag', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const refundCategoryBtn = screen.getByRole('button', { name: /Hoàn cọc \(2\)/i })
    fireEvent.click(refundCategoryBtn)

    expect(screen.getByText('REF-2026-1102')).toBeInTheDocument()
    expect(screen.queryByText('TXN-2026-9040')).not.toBeInTheDocument()
  })

  it('opens and saves company invoice configuration modal', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const openConfigBtn = screen.getByRole('button', {
      name: /CẤU HÌNH XUẤT HÓA ĐƠN CÔNG TY/i,
    })
    fireEvent.click(openConfigBtn)

    expect(
      screen.getByRole('heading', { name: /Cấu Hình Hóa Đơn Doanh Nghiệp/i })
    ).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /Lưu Cấu Hình/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Đã lưu cấu hình doanh nghiệp thành công!/i)
      ).toBeInTheDocument()
    })
  })

  it('opens export report modal and simulates report download', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const exportBtn = screen.getByRole('button', {
      name: /XUẤT BÁO CÁO EXCEL \/ PDF ➞/i,
    })
    fireEvent.click(exportBtn)

    expect(
      screen.getByRole('heading', { name: /Xuất Báo Cáo Sổ Cái Chi Phí/i })
    ).toBeInTheDocument()

    const downloadExcelBtn = screen.getByRole('button', { name: /Tải tệp EXCEL/i })
    fireEvent.click(downloadExcelBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Tệp báo cáo đã được tải xuống máy!/i)
      ).toBeInTheDocument()
    })
  })

  it('opens send receipt email modal and simulates email dispatch', async () => {
    renderWithProviders(<DriverPaymentsPage />)

    const sendEmailBtn = screen.getByRole('button', {
      name: /GỬI QUA EMAIL KẾ TOÁN/i,
    })
    fireEvent.click(sendEmailBtn)

    expect(
      screen.getByRole('heading', { name: /Gửi Biên Lai \/ HĐĐT Qua Email/i })
    ).toBeInTheDocument()

    const confirmSendBtn = screen.getByRole('button', { name: /Gửi Ngay/i })
    fireEvent.click(confirmSendBtn)

    await waitFor(() => {
      expect(screen.getByText(/Đã gửi email thành công!/i)).toBeInTheDocument()
    })
  })
})
