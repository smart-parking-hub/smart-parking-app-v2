import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { SearchParkingPage } from '../pages/SearchParkingPage'
import { fallbackParkingLots } from '../api/parkingSearchApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))
vi.mock('../components/InteractiveMapCanvas', () => ({
  InteractiveMapCanvas: () => (
    <section aria-label="Bản đồ bãi đỗ OpenStreetMap" />
  ),
}))

function renderWithProviders(
  ui: React.ReactElement,
  initialEntries = ['/parking'],
) {
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

describe('SCR-015: Interactive Parking Search & Map (Bản đồ tìm kiếm bãi đỗ)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        content: fallbackParkingLots,
        totalElements: fallbackParkingLots.length,
        totalPages: 1,
        size: 20,
        number: 0,
      },
    })
  })

  it('renders top filter bar with vehicle selector, 5 classifications and radius slider', async () => {
    renderWithProviders(<SearchParkingPage />)

    // 1. Vehicle selector & classifications
    expect(screen.getByText(/Phương tiện điều hành/i)).toBeInTheDocument()
    expect(
      screen.getAllByText(/Container 40\/45FT/i).length,
    ).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Tải nặng \(>10T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe khách \(16–45 chỗ\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Tải nhỏ \(<3.5T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Khách \/ Sedan/i)).toBeInTheDocument()

    // 2. Radius slider & full lots toggle
    expect(screen.getByText(/Bán kính quét:/i)).toBeInTheDocument()
    expect(screen.getByText(/Hiện bãi đã đầy/i)).toBeInTheDocument()
    expect(screen.getByText(/Sắp xếp theo/i)).toBeInTheDocument()
  })

  it('renders location search, actual lot values and the interactive map region', async () => {
    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getAllByText(/Trạm Dừng & Bãi Container Tân Cảng - Phú Hữu/i)
          .length,
      ).toBeGreaterThanOrEqual(1)
    })

    // Search bar & count
    expect(
      screen.getByPlaceholderText(/Nhập địa chỉ cảng, KCN hoặc bến bãi.../i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Vị trí của tôi/i)).toBeInTheDocument()

    // Yard cards
    expect(screen.getByText(/Gợi ý phù hợp/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Depot Container Cát Lái Gate 2/i),
    ).toBeInTheDocument()

    // Map canvas
    expect(
      screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenStreetMap' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Lưu lượng xe 85%/i)).not.toBeInTheDocument()
  })

  it('interactively opens and confirms Quick Booking Drawer for 10-minute hold', async () => {
    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(screen.getAllByText(/ĐẶT GIỮ CHỖ 10P/i).length).toBeGreaterThan(0)
    })

    // Click quick book on first yard card
    const quickBookBtn = screen.getAllByText(/ĐẶT GIỮ CHỖ 10P/i)[0]
    fireEvent.click(quickBookBtn)

    // Drawer should open with details
    expect(
      screen.getByText(/Đặt giữ chỗ khẩn cấp \(10 Phút\)/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Bãi sẽ khóa slot vật lý ngay sau khi bạn xác nhận/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Thời gian giữ chỗ: 10 phút./i)).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(
        /51D-894.12 · Rơ-moóc 40FT \(Tài xế: Trần Quốc Tuấn\)/i,
      ),
    ).toBeInTheDocument()

    // Confirm booking
    const confirmBtn = screen.getByText(/XÁC NHẬN GIỮ CHỖ/i)
    fireEvent.click(confirmBtn)

    // Success confirmation screen
    expect(screen.getByText(/Giữ Chỗ Thành Công!/i)).toBeInTheDocument()
  })

  it('displays empty state when no parking lots match criteria and allows expanding radius', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 20,
        number: 0,
      },
    })

    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/Không Tìm Thấy Bãi Đỗ Xe Nào Phù Hợp/i),
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText(/Mở rộng bán kính \(35km\)/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Đặt lại bộ lọc/i)).toBeInTheDocument()

    // Click expand radius
    const expandBtn = screen.getByText(/Mở rộng bán kính \(35km\)/i)
    fireEvent.click(expandBtn)
  })

  it('displays error alert with ERR_GEO_DISPATCH_TIMEOUT when server request fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(
      new Error('Network connection timeout'),
    )

    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/ERR_GEO_DISPATCH_TIMEOUT/i),
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/Tải lại bãi xe/i)).toBeInTheDocument()
  })
})
