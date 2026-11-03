import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MyBookingsPage } from '../pages/MyBookingsPage'
import { fallbackBookingsList } from '../api/bookingApi'
import * as qrExportUtil from '../utils/qrExportUtil'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/bookings']) {
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

describe('SCR-017: MyBookingsPage (Quản lý danh sách đặt chỗ & Vé đỗ xe điện tử QR)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: fallbackBookingsList,
    })
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true },
    })
    window.alert = vi.fn()
  })

  it('renders command toolbar, eyebrow, telemetry chips, 5 status tabs and search input', async () => {
    renderWithProviders(<MyBookingsPage />)

    expect(
      screen.getByText(/VÉ XE ĐIỆN TỬ & ĐIỀU PHỐI VẬN TẢI • ZERO-GREEN STRICT OPS/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Quản Lý Đặt Chỗ Của Tôi/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Đồng bộ ALPR:/i)).toBeInTheDocument()
    expect(screen.getByText(/100% ONLINE/i)).toBeInTheDocument()
    expect(screen.getByText(/Biển số hoạt động:/i)).toBeInTheDocument()

    // 5 Status tabs
    expect(screen.getByRole('button', { name: /Tất cả/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đang hoạt động/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chờ thanh toán/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đã hoàn thành/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đã hủy/i })).toBeInTheDocument()

    // Search input
    expect(
      screen.getByPlaceholderText(/Tìm theo mã BK, biển số xe, tên bãi đỗ\.\.\./i)
    ).toBeInTheDocument()
  })

  it('renders master list with 4 sample booking cards and selected active card', async () => {
    renderWithProviders(<MyBookingsPage />)

    expect(
      screen.getByText(/DANH SÁCH PHIÊN VẬN HÀNH \(4 ĐƠN\)/i)
    ).toBeInTheDocument()
    expect(screen.getAllByText(/BK-2026-9081/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/BK-2026-9104/i)).toBeInTheDocument()
    expect(screen.getByText(/BK-2026-8812/i)).toBeInTheDocument()
    expect(screen.getByText(/BK-2026-8705/i)).toBeInTheDocument()

    // Active badge
    expect(screen.getByText(/ĐANG ĐỖ TẠI BÃI \(3H 45M\)/i)).toBeInTheDocument()
  })

  it('switches selected booking card when clicked, updating detail view', async () => {
    renderWithProviders(<MyBookingsPage />)

    // Click card 2 (BK-2026-9104 - Tân Cảng Phú Hữu)
    const card2 = screen.getByText(/BK-2026-9104/i)
    fireEvent.click(card2)

    // Detail view should reflect BK-2026-9104
    await waitFor(() => {
      expect(screen.getAllByText(/BK-2026-9104/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/Tân Cảng - Phú Hữu/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('filters booking list by status tabs', async () => {
    renderWithProviders(<MyBookingsPage />)

    // Click tab 'Chờ thanh toán'
    const pendingTab = screen.getByRole('button', { name: /Chờ thanh toán/i })
    fireEvent.click(pendingTab)

    expect(screen.getAllByText(/BK-2026-9104/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/BK-2026-8812/i)).not.toBeInTheDocument()

    // Click tab 'Đã hoàn thành'
    const completedTab = screen.getByRole('button', { name: /Đã hoàn thành/i })
    fireEvent.click(completedTab)

    expect(screen.getAllByText(/BK-2026-8812/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/BK-2026-8705/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/BK-2026-9104/i)).not.toBeInTheDocument()
  })

  it('filters booking list by search keyword', async () => {
    renderWithProviders(<MyBookingsPage />)

    const searchInput = screen.getByPlaceholderText(
      /Tìm theo mã BK, biển số xe, tên bãi đỗ\.\.\./i
    )
    fireEvent.change(searchInput, { target: { value: 'Xuân Lộc' } })

    expect(screen.getAllByText(/BK-2026-8705/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/BK-2026-9081/i)).not.toBeInTheDocument()
  })

  it('renders 4-step bento stepper, QR code terminal panel with gate token STH-9081', async () => {
    renderWithProviders(<MyBookingsPage />)

    expect(screen.getByText(/TIẾN TRÌNH VẬN HÀNH BẾN BÃI/i)).toBeInTheDocument()
    expect(screen.getByText(/Khóa slot 10p/i)).toBeInTheDocument()
    expect(screen.getByText(/Cọc PayOS & QR/i)).toBeInTheDocument()
    expect(screen.getByText(/Đang đỗ thực tế/i)).toBeInTheDocument()
    expect(screen.getByText(/Tất toán xuất bãi/i)).toBeInTheDocument()

    // QR panel
    expect(screen.getByText(/GATE-TOKEN: STH-9081/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /Mã QR Barie Check-out Tự Động/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/LÀN 02 \(OUT CONTAINER NẶNG\)/i)).toBeInTheDocument()
  })

  it('renders tariff audit table with reefer surcharge and remaining amount', async () => {
    renderWithProviders(<MyBookingsPage />)

    expect(
      screen.getByText(/BẢNG ĐỐI SOÁT CƯỚC PHÍ CHI TIẾT/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Giá cơ bản niêm yết/i)).toBeInTheDocument()
    expect(screen.getByText(/Phụ phí cắm điện lạnh 380V Reefer/i)).toBeInTheDocument()
    expect(screen.getByText(/Tiền cọc giữ slot đã thanh toán/i)).toBeInTheDocument()
    expect(
      screen.getByText(/TỔNG TIỀN CẦN THANH TOÁN XUẤT CỔNG:/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/120\.000 đ/i)).toBeInTheDocument()
  })

  it('triggers QR export download when clicking TẢI VÉ QR (PNG)', async () => {
    const exportSpy = vi
      .spyOn(qrExportUtil, 'exportSvgToPng')
      .mockResolvedValue(true)

    renderWithProviders(<MyBookingsPage />)

    const downloadBtn = screen.getByRole('button', {
      name: /TẢI VÉ QR \(PNG\)/i,
    })
    fireEvent.click(downloadBtn)

    await waitFor(() => {
      expect(exportSpy).toHaveBeenCalled()
    })
  })

  it('opens PayOS checkout modal and simulates payment completion', async () => {
    renderWithProviders(<MyBookingsPage />)

    const payFinalBtn = screen.getByRole('button', {
      name: /THANH TOÁN KHOẢN CUỐI QUA PAYOS VIETQR/i,
    })
    fireEvent.click(payFinalBtn)

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /PayOS VietQR Chuyển Khoản 24\/7/i,
      })
    ).toBeInTheDocument()

    // Simulate payment click
    const simulateBtn = screen.getByRole('button', {
      name: /MÔ PHỎNG QUÉT THANH TOÁN THÀNH CÔNG/i,
    })
    fireEvent.click(simulateBtn)

    await waitFor(
      () => {
        expect(
          screen.getByText(/Giao dịch PayOS đã xác nhận thành công!/i)
        ).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('opens cancel booking modal and review modal for appropriate lifecycle items', async () => {
    renderWithProviders(<MyBookingsPage />)

    // Select pending payment card to see cancel button
    const card2 = screen.getByText(/BK-2026-9104/i)
    fireEvent.click(card2)

    await waitFor(() => {
      expect(screen.getByText(/Hủy đặt chỗ này/i)).toBeInTheDocument()
    })

    const cancelBtn = screen.getByText(/Hủy đặt chỗ này/i)
    fireEvent.click(cancelBtn)

    expect(screen.getByText(/XÁC NHẬN HỦY VÉ/i)).toBeInTheDocument()
    expect(screen.getByText(/Giữ lại vé/i)).toBeInTheDocument()

    // Close cancel modal
    fireEvent.click(screen.getByText(/Giữ lại vé/i))
    expect(screen.queryByText(/XÁC NHẬN HỦY VÉ/i)).not.toBeInTheDocument()

    // Select completed card to see review button
    const card3 = screen.getByText(/BK-2026-8812/i)
    fireEvent.click(card3)

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /ĐÁNH GIÁ TRẢI NGHIỆM BÃI ĐỖ XE/i,
        })
      ).toBeInTheDocument()
    })

    const reviewBtn = screen.getByRole('button', {
      name: /ĐÁNH GIÁ TRẢI NGHIỆM BÃI ĐỖ XE/i,
    })
    fireEvent.click(reviewBtn)

    expect(screen.getByText(/ĐÁNH GIÁ CHUYẾN ĐI/i)).toBeInTheDocument()
    expect(screen.getByText(/Mức độ hài lòng:/i)).toBeInTheDocument()
  })
})
