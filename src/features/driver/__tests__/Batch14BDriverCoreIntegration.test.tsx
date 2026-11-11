import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

import { DriverDashboardPage } from '../pages/DriverDashboardPage'
import { SearchParkingPage } from '@/features/parking-search/pages/SearchParkingPage'
import { ParkingDetailPage } from '@/features/parking-detail/pages/ParkingDetailPage'
import { MyBookingsPage } from '@/features/bookings/pages/MyBookingsPage'
import { fallbackParkingLots } from '@/features/parking-search/api/parkingSearchApi'
import {
  fallbackDriverReviews,
} from '@/features/parking-detail/api/parkingDetailApi'
import { getBookingStoreSnapshot } from '@/features/bookings/store/bookingStore'

// Mocks
vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

vi.mock('@/features/parking-search/components/InteractiveMapCanvas', () => ({
  InteractiveMapCanvas: () => (
    <section aria-label="Bản đồ bãi đỗ OpenStreetMap" data-testid="mock-osm-canvas" />
  ),
}))

function renderWithProviders(
  ui: React.ReactElement,
  initialEntries = ['/']
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('BATCH-14B: Driver Core — Search, Detail & Bookings Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('smart-truck-parking.driver_name', 'Trần Quốc Tuấn')
    getBookingStoreSnapshot().resetStore()

    // Default API mock implementation
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('vehicles')) {
        return Promise.resolve({
          data: {
            data: {
              content: [
                {
                  id: 1,
                  licensePlate: '51D-894.12',
                  vehicleType: 'CONTAINER',
                  weightTon: 39.5,
                  brandModel: 'Hyundai Xcient 440PS',
                  status: 'ACTIVE',
                },
              ],
              totalElements: 3,
              totalPages: 1,
              currentPage: 0,
            },
          },
        })
      }
      if (url.includes('bookings') || url.includes('my-bookings')) {
        return Promise.resolve({
          data: {
            data: {
              content: [
                {
                  id: 9081,
                  bookingCode: 'BK-2026-9081',
                  parkingLotId: 1,
                  merchantId: 1,
                  parkingLotName: 'Bãi Đỗ Xe Container Sóng Thần 2',
                  parkingLotAddress: 'ICD Sóng Thần, Quốc Lộ 1A, Phường An Bình, TP. Dĩ An, Tỉnh Bình Dương',
                  vehicleId: 1,
                  vehiclePlate: '51D-894.12',
                  status: 'PARKING',
                  advanceDeposit: 100000,
                  totalAmount: 180000,
                  hourlyRate: 40000,
                  expectedCheckInTime: '2026-02-20T14:15:00Z',
                  expectedCheckOutTime: '2026-02-20T20:15:00Z',
                  expiresAt: '2026-02-20T20:15:00Z',
                },
              ],
              totalElements: 48,
              totalPages: 5,
              currentPage: 0,
            },
          },
        })
      }
      if (url.match(/\/parking-lots\/\d+/)) {
        return Promise.resolve({
          data: {
            data: {
              id: 1,
              name: 'Bãi Đỗ Xe & Trạm Dịch Vụ Container Tân Cảng - Cát Lái (Cụm Gate 2)',
              address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức, TP. Hồ Chí Minh',
              status: 'ACTIVE',
              merchantId: 1,
              slots: [
                { vehicleType: 'CONTAINER', availableCapacity: 12, totalCapacity: 80 },
                { vehicleType: 'HEAVY_TRUCK', availableCapacity: 18, totalCapacity: 40 },
              ],
              pricingRules: [
                { vehicleType: 'CONTAINER', basePricePerHour: 50000, surgeMultiplier: 1.2, surgeStartTime: '06:00', surgeEndTime: '09:00', overtimePenaltyMultiplier: 1.5 },
                { vehicleType: 'HEAVY_TRUCK', basePricePerHour: 40000, surgeMultiplier: 1.0, surgeStartTime: null, surgeEndTime: null, overtimePenaltyMultiplier: 1.2 },
              ],
            },
          },
        })
      }
      if (url.includes('parking-lots') || url.includes('search')) {
        return Promise.resolve({
          data: {
            data: {
              content: fallbackParkingLots,
              totalElements: fallbackParkingLots.length,
              totalPages: 1,
              currentPage: 0,
            },
          },
        })
      }
      if (url.includes('reviews')) {
        return Promise.resolve({
          data: {
            data: fallbackDriverReviews,
          },
        })
      }
      return Promise.resolve({ data: { data: {} } })
    })

    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, message: 'Thao tác thành công!' },
    })
  })

  // -------------------------------------------------------------
  // SCR-014: Driver Dashboard Home
  // -------------------------------------------------------------
  it('SCR-014: DriverDashboardPage renders welcome banner, 4 KPI cards, active trip, and quick search', async () => {
    renderWithProviders(<DriverDashboardPage />, ['/dashboard'])

    // Welcome banner & telemetry
    await waitFor(() => {
      expect(screen.getByText(/Xin Chào,/i)).toBeInTheDocument()
      expect(screen.getByText(/Bác Tài/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/Trần Quốc Tuấn/i)).toBeInTheDocument()

    // Quick search form
    const searchInput = screen.getByPlaceholderText(/Tra cứu nhanh biển số, mã đặt chỗ/i)
    expect(searchInput).toBeInTheDocument()

    // KPI grid: 4 stat cards
    expect(screen.getByText(/03 Đầu Kéo/i)).toBeInTheDocument()
    expect(screen.getByText(/48 Lượt Đỗ/i)).toBeInTheDocument()
    expect(screen.getByText(/Chuyến Đang Đỗ/i)).toBeInTheDocument()
    expect(screen.getByText(/Suất Chờ/i)).toBeInTheDocument()

    // Active trip card
    expect(screen.getByText(/CHUYẾN ĐỖ ĐANG HOẠT ĐỘNG THỜI GIAN THỰC/i)).toBeInTheDocument()
    expect(screen.getAllByText(/51D-894.12/i).length).toBeGreaterThan(0)

    // ALPR fast-checkout modal interaction
    const qrTrigger = screen.getByRole('button', { name: /Mở vé QR check-out/i })
    expect(qrTrigger).toBeInTheDocument()
    fireEvent.click(qrTrigger)

    // QR modal should be displayed
    expect(screen.getByRole('heading', { name: /Mã QR Barie Xuất Bãi/i })).toBeInTheDocument()
    expect(screen.getByText(/ALPR FAST-CHECKOUT PASS/i)).toBeInTheDocument()

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /HOÀN TẤT & ĐÓNG MÃ QR/i })
    fireEvent.click(closeBtn)
    await waitFor(() => {
      expect(screen.queryByText(/ALPR FAST-CHECKOUT PASS/i)).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------
  // SCR-015: Search Parking & Interactive Map
  // -------------------------------------------------------------
  it('SCR-015: SearchParkingPage renders filters, yard list, map canvas, and opens 10-minute hold drawer', async () => {
    renderWithProviders(<SearchParkingPage />, ['/dashboard/search'])

    // Top Header & Subtitle
    expect(screen.getByText(/Điểm đỗ phù hợp. Hành trình an tâm./i)).toBeInTheDocument()
    expect(screen.getByText(/Bản đồ OpenStreetMap/i)).toBeInTheDocument()

    // Wait for data load and map canvas
    await waitFor(() => {
      expect(screen.getByTestId('mock-osm-canvas')).toBeInTheDocument()
    })

    // SmartLocationBar with search input and full lots toggle
    expect(screen.getByPlaceholderText(/Nhập địa chỉ cảng, KCN hoặc bến bãi.../i)).toBeInTheDocument()
    expect(screen.getByText(/Hiện bãi đã đầy/i)).toBeInTheDocument()

    // Yard List displays parking lot cards with 10p hold buttons
    await waitFor(() => {
      expect(screen.getAllByText(/ĐẶT GIỮ CHỖ 10P/i).length).toBeGreaterThan(0)
    })

    const quickBookButtons = screen.getAllByRole('button', { name: /ĐẶT GIỮ CHỖ 10P/i })
    expect(quickBookButtons.length).toBeGreaterThan(0)

    // Open quick book drawer
    fireEvent.click(quickBookButtons[0])

    // Quick book drawer should open
    expect(
      screen.getByRole('dialog', { name: 'Panel giữ chỗ nhanh 10 phút' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Đặt giữ chỗ khẩn cấp (10 Phút)', level: 2 })
    ).toBeInTheDocument()

    // Close drawer
    const closeDrawerBtn = screen.getByRole('button', { name: /Đóng/i })
    fireEvent.click(closeDrawerBtn)
  })

  // -------------------------------------------------------------
  // SCR-016: Parking Details & Instant Physical Reservation
  // -------------------------------------------------------------
  it('SCR-016: ParkingDetailPage renders facility dossier, capacity matrix, pricing rules, and booking flow', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/parking/:id" element={<ParkingDetailPage />} />
      </Routes>,
      ['/parking/1']
    )

    // Facility header & navigation
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Bãi Đỗ Xe & Trạm Dịch Vụ Container Tân Cảng - Cát Lái/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Về bản đồ/i })).toBeInTheDocument()

    // Slot capacity matrix and pricing panel
    expect(screen.getByText(/Sức chứa và bảng giá/i)).toBeInTheDocument()
    expect(screen.getByText(/12\/80 chỗ trống/i)).toBeInTheDocument()
    expect(screen.getByText(/18\/40 chỗ trống/i)).toBeInTheDocument()

    // Reservation flow panel is present
    expect(await screen.findByText(/Đặt chỗ tại bãi/i)).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-017: My Bookings & Electronic QR Ticket
  // -------------------------------------------------------------
  it('SCR-017: MyBookingsPage renders master booking docket and status panel', async () => {
    renderWithProviders(<MyBookingsPage />, ['/dashboard/bookings'])

    // Command toolbar & heading
    expect(await screen.findByRole('heading', { name: /Các lượt đặt chỗ của tôi/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Tìm bãi trên bản đồ/i })).toBeInTheDocument()

    // Master list item
    expect(await screen.findByText('Bãi Đỗ Xe Container Sóng Thần 2')).toBeInTheDocument()
    expect(screen.getByText(/ICD Sóng Thần/i)).toBeInTheDocument()

    // Status badge / panel
    expect(screen.getByText(/Đang đỗ tại bãi/i)).toBeInTheDocument()
  })
})
