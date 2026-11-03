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

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/parking']) {
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
    expect(screen.getByText(/Container 40\/45FT/i)).toBeInTheDocument()
    expect(screen.getByText(/Tải nặng \(>10T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Tải trung \(3.5-10T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Tải nhỏ \(<3.5T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Khách \/ Sedan/i)).toBeInTheDocument()

    // 2. Radius slider & full lots toggle
    expect(screen.getByText(/Bán kính quét:/i)).toBeInTheDocument()
    expect(screen.getByText(/Hiện bãi đã đầy/i)).toBeInTheDocument()
    expect(screen.getByText(/Sắp xếp theo/i)).toBeInTheDocument()
  })

  it('renders location bar, yard list, map canvas with direction banner and traffic alert', async () => {
    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getAllByText(/Trạm Dừng & Bãi Container Tân Cảng - Phú Hữu/i).length,
      ).toBeGreaterThanOrEqual(1)
    })

    // Search bar & count
    expect(screen.getByPlaceholderText(/Nhập địa chỉ cảng, KCN hoặc bến bãi.../i)).toBeInTheDocument()
    expect(screen.getByText(/Vị trí của tôi/i)).toBeInTheDocument()

    // Yard cards
    expect(screen.getByText(/BEST MATCH · TỐI ƯU TẢI TRỌNG/i)).toBeInTheDocument()
    expect(screen.getByText(/Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2/i)).toBeInTheDocument()
    expect(screen.getByText(/Depot Container Cát Lái Gate 2/i)).toBeInTheDocument()

    // Map canvas
    expect(screen.getByText(/LỘ TRÌNH TỐI ƯU XE CONTAINER 40FT/i)).toBeInTheDocument()
    expect(screen.getByText(/XE CỦA BẠN \(51D-894.12\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Bản đồ OSM Cảng Biển V2.4/i)).toBeInTheDocument()
    expect(screen.getByText(/Đoạn Đỗ Xuân Hợp qua Nguyễn Duy Trinh mật độ cao:/i)).toBeInTheDocument()
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
    expect(screen.getByText(/Đặt giữ chỗ khẩn cấp \(10 Phút\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Bãi sẽ khóa slot vật lý ngay sau khi bạn xác nhận/i)).toBeInTheDocument()
    expect(screen.getByText(/Thời gian giữ chỗ: 10 phút./i)).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(/51D-894.12 · Rơ-moóc 40FT \(Tài xế: Trần Quốc Tuấn\)/i),
    ).toBeInTheDocument()

    // Confirm booking
    const confirmBtn = screen.getByText(/XÁC NHẬN GIỮ CHỖ/i)
    fireEvent.click(confirmBtn)

    // Success confirmation screen
    expect(screen.getByText(/Giữ Chỗ Thành Công!/i)).toBeInTheDocument()
  })
})
