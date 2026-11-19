import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { DriverDashboardPage } from '../pages/DriverDashboardPage'
import { DriverLayout } from '@/layouts/DriverLayout'
import * as driverApi from '../api/driverApi'
import { fallbackDashboardData } from './dashboardFixtures'

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
      if (url === '/api/v1/users/me') return Promise.resolve({ data: { data: { fullName: 'Trần Quốc Tuấn' } } })
      if (url === '/api/v1/queues/me') return Promise.resolve({ data: { data: null } })
      if (url.includes('vehicles')) {
        return Promise.resolve({
          data: {data: {
            content: [],
            totalElements: 3,
            totalPages: 1,
            size: 10,
            number: 0,
          }},
        })
      }
      if (url.includes('bookings')) {
        return Promise.resolve({
          data: {data: {
            content: [
              fallbackDashboardData.activeBooking!,
              ...fallbackDashboardData.recentBookings,
            ].map(b=>({...b,vehiclePlate:b.vehicleLicensePlate,advanceDeposit:b.depositAmount,totalAmount:b.totalPrice})),
            totalElements: 48,
            totalPages: 3,
            size: 20,
            number: 0,
          }},
        })
      }
      return Promise.reject(new Error('Not found'))
    })
  })

  it('renders driver welcome banner, 4 KPI cards, active trip card, shortcuts and recent table', async () => {
    renderWithProviders(<DriverDashboardPage />)

    // 1. Welcome banner greeting
    await waitFor(() => {
      expect(screen.getByText(/Xin Chào,/i)).toBeInTheDocument()
      expect(screen.getByText(/Bác Tài/i)).toBeInTheDocument()
    })
    expect(
      screen.getByText(/HẠ TẦNG ĐIỀU PHỐI ĐIỂM ĐỖ THÔNG MINH/i),
    ).toBeInTheDocument()

    // 2. Bento Grid 3 KPIs
    expect(screen.getByText(/03 Phương Tiện/i)).toBeInTheDocument()
    expect(screen.getByText(/48 Lượt/i)).toBeInTheDocument()
    expect(screen.getByText(/01 Chuyến Đang Đỗ/i)).toBeInTheDocument()
    expect(screen.queryByText(/00 Suất Chờ/i)).not.toBeInTheDocument()

    // 3. Active Trip Card details
    expect(screen.getByRole('heading', { name: 'Chuyến đỗ đang hoạt động' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bãi Đỗ Xe Container Sóng Thần 2' })).toBeInTheDocument()
    expect(screen.getAllByText(/51D-894.12/i).length).toBeGreaterThan(0)
    expect(screen.getByText('Chưa được phân vị trí')).toBeInTheDocument()

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
    renderWithProviders(<DriverDashboardPage />)

    // Wait for content to render
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Mã QR xuất bãi' })).toBeInTheDocument()
    })

    // Click to open QR Modal
    const openBtn = screen.getByRole('button', { name: 'Mã QR xuất bãi' })
    fireEvent.click(openBtn)

    // Modal elements should be visible
    expect(screen.getByRole('dialog', { name: 'Mã QR xuất bãi' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'QR xuất bãi BK-2026-9081' })).toBeInTheDocument()
    expect(screen.queryByText(/BK-2026-9081-OUT/i)).not.toBeInTheDocument()

    // Close modal via confirm button
    const closeBtn = screen.getByRole('button', { name: 'Đóng' })
    fireEvent.click(closeBtn)

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('renders DriverLayout with shared Header and Footer', () => {
    renderWithProviders(<DriverLayout />)

    // Header elements
    const brandElements = screen.getAllByText(/SMARTTRUCK/i)
    expect(brandElements.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/CỔNG THÔNG TIN TÀI XẾ/i)).toBeInTheDocument()
    expect(screen.queryByText(/TRỰC TUYẾN/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/HOTLINE ĐIỀU PHỐI 24\/7:/i)).not.toBeInTheDocument()

    // Footer elements
    expect(screen.getByText(/V2.8.4-OPS/i)).toBeInTheDocument()
    expect(screen.getByText(/ISO\/IEC 27001:2022/i)).toBeInTheDocument()
    expect(screen.getByText(/1900 6868/i)).toBeInTheDocument()
    expect(screen.getByText(/SmartTruckHub Logistics Network/i)).toBeInTheDocument()
  })

  it('renders Empty State when driver has 0 vehicles and 0 bookings', async () => {
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('vehicles')) {
        return Promise.resolve({
          data: {data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 10,
            number: 0,
          }},
        })
      }
      if (url.includes('bookings')) {
        return Promise.resolve({
          data: {data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 20,
            number: 0,
          }},
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    renderWithProviders(<DriverDashboardPage />)

    await waitFor(() => {
      expect(screen.getByText(/Chưa Có Hoạt Động Điều Phối Nào/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/Đăng Ký Xe Đầu Tiên/i)).toBeInTheDocument()
    expect(screen.getByText(/Tìm Bãi Đỗ Xe & Bảng Giá/i)).toBeInTheDocument()
  })

  it('shows an API error instead of sample parking activity when offline', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))
    renderWithProviders(<DriverDashboardPage />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải dữ liệu')
    expect(screen.queryByText(/48 Lượt/i)).not.toBeInTheDocument()
  })

  it('renders Error State and allows retrying when fetchDriverDashboardData throws', async () => {
    vi.spyOn(driverApi, 'fetchDriverDashboardData').mockRejectedValueOnce(
      new Error('ERR_DISPATCH_TIMEOUT'),
    )

    renderWithProviders(<DriverDashboardPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/Không thể tải dữ liệu điều phối bến bãi/i),
      ).toBeInTheDocument()
    })

    expect(screen.getByRole('alert')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: /thử lại/i })
    expect(retryBtn).toBeInTheDocument()
  })

  it('validates quick search form using Zod schema', async () => {
    renderWithProviders(<DriverDashboardPage />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Tra cứu nhanh biển số/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Tra cứu nhanh biển số/i)
    const submitBtn = screen.getByText(/Tra Cứu Nhanh/i)

    // Submit with 1 character (invalid per Zod schema min(2))
    fireEvent.change(searchInput, { target: { value: 'a' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Vui lòng nhập tối thiểu 2 ký tự để tra cứu/i),
      ).toBeInTheDocument()
    })

    // Submit with valid string
    fireEvent.change(searchInput, { target: { value: '51D-894.12' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Đang lọc mã: "51D-894.12"/i),
      ).toBeInTheDocument()
    })
  })
})
