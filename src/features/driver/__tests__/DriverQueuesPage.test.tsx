import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { DriverQueuesPage } from '@/features/driver'
import { fallbackActiveQueue } from '@/features/driver'
import { getQueueStoreSnapshot } from '@/features/driver'

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

describe('SCR-018: DriverQueuesPage Export & Integration Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getQueueStoreSnapshot().resetStore()
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

  it('renders correctly via DriverQueuesPage export from @/features/driver', async () => {
    renderWithProviders(<DriverQueuesPage />)

    expect(
      screen.getByText(/Hệ thống điều phối hàng đợi thông minh/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Lượt Chờ Vào Bãi|Hàng Đợi/i,
      })
    ).toBeInTheDocument()

    // Outbound link to SCR-015 Parking Search
    const searchOtherBtn = screen.getByRole('link', { name: /Tìm bãi/i })
    expect(searchOtherBtn).toBeInTheDocument()
    expect(searchOtherBtn).toHaveAttribute('href', '/parking')
  })

  it('completes the accept slot flow and directs outbound to SCR-017 Bookings', async () => {
    renderWithProviders(<DriverQueuesPage />)

    const acceptBtn = screen.getByRole('button', {
      name: /Nhận Slot & Tạo Booking Ngay/i,
    })
    fireEvent.click(acceptBtn)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Đã Có Chỗ Đỗ Xe!|Nhận Slot Đỗ Xe Thành Công!/i })
      ).toBeInTheDocument()
    })

    // Outbound CTA link to /bookings (SCR-017)
    const viewTicketLink = screen.getByRole('link', {
      name: /Xem vé QR & Thanh toán cọc/i,
    })
    expect(viewTicketLink).toBeInTheDocument()
    expect(viewTicketLink).toHaveAttribute('href', '/bookings')
  })
})
