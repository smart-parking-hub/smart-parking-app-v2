import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { DashboardHomePage } from '../pages/DashboardHomePage'
import { DriverLayout } from '@/layouts/DriverLayout'
import { fallbackDashboardData } from '../api/dashboardApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/dashboard']) {
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
    </QueryClientProvider>,
  )
}

describe('SCR-014: Driver Dashboard Home (Tổng quan Tài xế)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('vehicles')) {
        return Promise.resolve({
          data: {
            content: [],
            totalElements: 3,
            totalPages: 1,
            size: 10,
            number: 0,
          },
        })
      }
      if (url.includes('bookings')) {
        return Promise.resolve({
          data: {
            content: [
              fallbackDashboardData.activeBooking!,
              ...fallbackDashboardData.recentBookings,
            ],
            totalElements: 48,
            totalPages: 3,
            size: 20,
            number: 0,
          },
        })
      }
      return Promise.reject(new Error('Not found'))
    })
  })

  it('renders driver welcome banner, 4 KPI cards, active trip card, shortcuts and recent table', async () => {
    renderWithProviders(<DashboardHomePage />)

    // 1. Welcome banner greeting
    await waitFor(() => {
      expect(screen.getByText(/Xin Chào, Bác Tài Trần Quốc Tuấn/i)).toBeInTheDocument()
    })
    expect(
      screen.getByText(/HẠ TẦNG ĐIỀU PHỐI ĐIỂM ĐỖ THÔNG MINH/i),
    ).toBeInTheDocument()

    // 2. Bento Grid 4 KPIs
    expect(screen.getByText(/03 Đầu Kéo/i)).toBeInTheDocument()
    expect(screen.getByText(/48 Lượt/i)).toBeInTheDocument()
    expect(screen.getByText(/01 Chuyến Đang Đỗ/i)).toBeInTheDocument()
    expect(screen.getByText(/00 Suất Chờ/i)).toBeInTheDocument()

    // 3. Active Trip Card details
    expect(screen.getByText(/CHUYẾN ĐỖ ĐANG HOẠT ĐỘNG THỜI GIAN THỰC/i)).toBeInTheDocument()
    expect(screen.getByText(/Bãi Đỗ Xe Container Sóng Thần 2/i)).toBeInTheDocument()
    expect(screen.getAllByText(/51D-894.12/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/BERTH C-12/i).length).toBeGreaterThan(0)

    // 4. Quick Shortcuts Matrix
    expect(screen.getByText(/Nghiệp Vụ Tài Xế Nhanh/i)).toBeInTheDocument()
    expect(screen.getByText(/Tìm Bãi Đỗ & Bảng Giá/i)).toBeInTheDocument()
    expect(screen.getByText(/Quản Lý Phương Tiện/i)).toBeInTheDocument()
    expect(screen.getByText(/Hóa Đơn Điện Tử VAT/i)).toBeInTheDocument()
    expect(screen.getByText(/Cảnh Báo Tĩnh Không & Cân/i)).toBeInTheDocument()

    // 5. Recent Bookings Table
    expect(screen.getByText(/Lịch Sử Đỗ Xe Gần Đây/i)).toBeInTheDocument()
    expect(screen.getByText(/BK-2026-9040/i)).toBeInTheDocument()
    expect(screen.getByText(/Depot Tân Cảng Long Bình/i)).toBeInTheDocument()
  })

  it('interactively opens and closes the ALPR QR Code Modal', async () => {
    renderWithProviders(<DashboardHomePage />)

    // Wait for content to render
    await waitFor(() => {
      expect(screen.getByText(/MÃ QR XUẤT BÃI \(BARIE CHECK-OUT\)/i)).toBeInTheDocument()
    })

    // Click to open QR Modal
    const openBtn = screen.getByText(/MÃ QR XUẤT BÃI \(BARIE CHECK-OUT\)/i)
    fireEvent.click(openBtn)

    // Modal elements should be visible
    expect(screen.getByText(/ALPR FAST-CHECKOUT PASS/i)).toBeInTheDocument()
    expect(screen.getByText(/Mã QR Barie Xuất Bãi/i)).toBeInTheDocument()
    expect(screen.getByText(/BK-2026-9081-OUT/i)).toBeInTheDocument()

    // Close modal via confirm button
    const closeBtn = screen.getByText(/HOÀN TẤT & ĐÓNG MÃ QR/i)
    fireEvent.click(closeBtn)

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByText(/ALPR FAST-CHECKOUT PASS/i)).not.toBeInTheDocument()
    })
  })

  it('renders DriverLayout with shared Header and Footer', () => {
    renderWithProviders(<DriverLayout />)

    // Header elements (hotline and 'TRỰC TUYẾN' removed per design request)
    const brandElements = screen.getAllByText(/SMARTTRUCK/i)
    expect(brandElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/DRIVER OPS/i)).toBeInTheDocument()
    expect(screen.queryByText(/TRỰC TUYẾN/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/HOTLINE ĐIỀU PHỐI 24\/7:/i)).not.toBeInTheDocument()

    // Footer elements (support hotline retained)
    expect(screen.getByText(/V2.8.4-OPS/i)).toBeInTheDocument()
    expect(screen.getByText(/ISO\/IEC 27001:2022/i)).toBeInTheDocument()
    expect(screen.getByText(/1900 6868/i)).toBeInTheDocument()
    expect(screen.getByText(/SmartTruckHub Logistics Network/i)).toBeInTheDocument()
  })
})
