import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { VirtualQueuesPage } from '../pages/VirtualQueuesPage'
import { fallbackActiveQueue } from '../api/queueApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/queues']) {
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

describe('SCR-018: VirtualQueuesPage (Hàng Đợi Ảo Thông Minh)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        data: fallbackActiveQueue,
      },
    })
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        data: {
          id: 9081,
          bookingCode: 'BK-2026-9081',
        },
      },
    })
  })

  it('renders command toolbar, eyebrow, telemetry chips, and tab controls', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(
      screen.getByText(/Hệ thống điều phối hàng đợi thông minh/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Hàng Đợi Ảo \(Virtual Queues\)/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Radar 5km Active/i)).toBeInTheDocument()
    expect(screen.getByText(/18 xe đang chờ • ~4.2p\/xe/i)).toBeInTheDocument()

    // 2 Segmented tabs
    expect(screen.getByRole('tab', { name: /Đang hoạt động/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Lịch sử xếp hàng/i })).toBeInTheDocument()
  })

  it('renders active queue card with NOTIFIED state, vehicle plate and hold countdown timer', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(screen.getByTestId('active-queue-card')).toBeInTheDocument()
    expect(screen.getByText(/Đã Có Slot Trống/i)).toBeInTheDocument()
    expect(screen.getByText(/Đã Đến Lượt Của Bạn!/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-8821/i)).toBeInTheDocument()
    expect(screen.getAllByText(/51D-894.12/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Bãi Đỗ Xe Cảng Cát Lái - Phân khu Container 02/i)).toBeInTheDocument()
    expect(screen.getByText(/Berth #B04 \(Cẩu chuyên dụng 40FT\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Ưu tiên Hàng Lạnh Reefer 380V/i)).toBeInTheDocument()
  })

  it('renders ALPR timeline flow with vehicle items and user highlight', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(
      screen.getByText(/Tiến trình điều phối thực tế \(ALPR Pipeline\)/i)
    ).toBeInTheDocument()
    expect(screen.getByText('50H-123.45')).toBeInTheDocument()
    expect(screen.getByText('60C-982.11')).toBeInTheDocument()
    expect(screen.getByText(/Xe xuất bãi trước/i)).toBeInTheDocument()
  })

  it('accepts slot and opens success modal with booking code and CTA', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const acceptButton = screen.getByRole('button', {
      name: /Nhận Slot & Tạo Booking Ngay/i,
    })
    expect(acceptButton).toBeInTheDocument()

    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Nhận Slot Đỗ Xe Thành Công!/i,
        })
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/BK-2026-9081/i)).toBeInTheDocument()
    expect(screen.getByText(/Xem vé QR & Thanh toán cọc/i)).toBeInTheDocument()
  })

  it('handles declining slot and updates active queue', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const declineButton = screen.getByRole('button', {
      name: /Từ chối nhường lượt/i,
    })
    fireEvent.click(declineButton)

    await waitFor(() => {
      expect(screen.getByText(/Đang Xếp Hàng Chờ/i)).toBeInTheDocument()
      expect(screen.getByText(/Vị trí trong hàng đợi: #3/i)).toBeInTheDocument()
    })
  })

  it('opens leave queue modal and confirms cancellation', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // First toggle to waiting state to test leave button
    const toggleDemoBtn = screen.getByRole('button', {
      name: /Mô phỏng: Chuyển về Đang chờ/i,
    })
    fireEvent.click(toggleDemoBtn)

    const leaveButton = screen.getByRole('button', {
      name: /Rời hàng đợi/i,
    })
    fireEvent.click(leaveButton)

    expect(
      screen.getByRole('heading', {
        name: /Rời Hàng Đợi Ảo\?/i,
      })
    ).toBeInTheDocument()

    const confirmLeaveBtn = screen.getByRole('button', {
      name: /Xác nhận rời hàng/i,
    })
    fireEvent.click(confirmLeaveBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Bạn chưa có lượt xếp hàng nào đang hoạt động/i)
      ).toBeInTheDocument()
    })
  })

  it('switches between ACTIVE and HISTORY tabs and renders history table', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const historyTab = screen.getByRole('tab', {
      name: /Lịch sử xếp hàng/i,
    })
    fireEvent.click(historyTab)

    expect(
      screen.getByRole('heading', {
        name: /Lịch Sử Lượt Xếp Hàng Ảo/i,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(/VQ-2026-7810/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-7650/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-7420/i)).toBeInTheDocument()
  })

  it('filters history table by keyword and status', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Switch to history tab
    fireEvent.click(screen.getByRole('tab', { name: /Lịch sử xếp hàng/i }))

    // Search input
    const searchInput = screen.getByPlaceholderText(/Tìm theo mã, bãi xe, biển số\.\.\./i)
    fireEvent.change(searchInput, { target: { value: 'Sóng Thần' } })

    expect(screen.getByText(/VQ-2026-7650/i)).toBeInTheDocument()
    expect(screen.queryByText(/VQ-2026-7810/i)).not.toBeInTheDocument()

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })

    // Filter status button
    const convertedBtn = screen.getByRole('button', { name: /^Đã nhận slot$/i })
    fireEvent.click(convertedBtn)

    expect(screen.getByText(/VQ-2026-7810/i)).toBeInTheDocument()
    expect(screen.queryByText(/VQ-2026-7650/i)).not.toBeInTheDocument()
  })

  it('renders the 4 operational regulations cards', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(
      screen.getByRole('heading', {
        name: /Quy Định Vận Hành Hàng Đợi Ảo/i,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(/Nguyên Tắc FIFO & ALPR Minh Bạch/i)).toBeInTheDocument()
    expect(screen.getByText(/Thời Gian Giữ Slot 15 Phút/i)).toBeInTheDocument()
    expect(screen.getByText(/Bán Kính Radar Geofence 5\.0 KM/i)).toBeInTheDocument()
    expect(screen.getByText(/Giới Hạn 1 Hàng Đợi Đồng Thời/i)).toBeInTheDocument()
  })
})
