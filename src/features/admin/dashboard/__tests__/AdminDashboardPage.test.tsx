import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboardPage } from '../pages/AdminDashboardPage'
import { fetchAdminDashboardData } from '../api/adminDashboardApi'
import type { AdminDashboardData } from '../types/adminDashboardTypes'

vi.mock('../api/adminDashboardApi', async () => {
  const actual = await vi.importActual('../api/adminDashboardApi')
  return {
    ...actual,
    fetchAdminDashboardData: vi.fn(),
  }
})

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
}

const mockDashboardData: AdminDashboardData = {
  totalUsers: 1520,
  totalDrivers: 1200,
  totalMerchants: 320,
  totalParkingLots: 48,
  pendingParkingLots: 5,
  totalBookings: 890,
  pendingWithdrawals: 3,
  openDisputes: 2,
  platformRevenue: 185000000,
}

describe('AdminDashboardPage (SCR-042)', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = createTestQueryClient()
  })

  it('renders all macro metrics, triage action panels, user ecosystem, and system health status', async () => {
    vi.mocked(fetchAdminDashboardData).mockResolvedValueOnce(mockDashboardData)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    // Workspace Header
    expect(screen.getByText('Toàn cảnh vận hành')).toBeInTheDocument()
    expect(screen.getByText('SMARTTRUCK / COMMAND CENTER')).toBeInTheDocument()

    // Macro Metrics
    expect(await screen.findByText('185.000.000 ₫')).toBeInTheDocument()
    expect(screen.getByText('Doanh thu nền tảng')).toBeInTheDocument()
    expect(screen.getByText('Bãi đỗ')).toBeInTheDocument()
    expect(screen.getByText('Tổng lượt đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Người dùng')).toBeInTheDocument()

    // Triage Action Panels
    expect(screen.getByText('Bãi đang chờ thẩm định')).toBeInTheDocument()
    expect(screen.getByText('Yêu cầu rút tiền')).toBeInTheDocument()
    expect(screen.getByText('Tranh chấp đang mở')).toBeInTheDocument()

    const triageLinks = screen.getAllByRole('link', { name: /Mở bàn xử lý/i })
    expect(triageLinks).toHaveLength(3)
    expect(triageLinks[0]).toHaveAttribute('href', '/admin/parking-lots')
    expect(triageLinks[1]).toHaveAttribute('href', '/admin/withdrawals')
    expect(triageLinks[2]).toHaveAttribute('href', '/admin/disputes')

    // Triage Alert Badges (count > 0 shows "Cần xử lý")
    const alertBadges = screen.getAllByText('Cần xử lý')
    expect(alertBadges.length).toBeGreaterThanOrEqual(3)

    // User Ecosystem Card
    expect(
      screen.getByText(
        '1200 tài xế · 320 chủ bãi đang được hệ thống quản lý.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Quản lý tài khoản/i })).toHaveAttribute(
      'href',
      '/admin/users',
    )

    // System Health Card
    expect(screen.getByText('ALPR & Trạm Barie tự động')).toBeInTheDocument()
    expect(screen.getByText('Cổng thanh toán & đối soát ví')).toBeInTheDocument()
    expect(screen.getByText('Hàng đợi ảo & điều phối slot')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Đối soát ví/i })).toHaveAttribute(
      'href',
      '/admin/transactions',
    )
    expect(screen.getByRole('link', { name: /Nhật ký kiểm toán/i })).toHaveAttribute(
      'href',
      '/admin/audit-logs',
    )
  })

  it('renders "Đã xử lý xong" when triage backlog is zero', async () => {
    vi.mocked(fetchAdminDashboardData).mockResolvedValueOnce({
      ...mockDashboardData,
      pendingParkingLots: 0,
      pendingWithdrawals: 0,
      openDisputes: 0,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await screen.findByText('185.000.000 ₫')
    const completedBadges = screen.getAllByText('Đã xử lý xong')
    expect(completedBadges).toHaveLength(3)
    expect(screen.queryByText('Cần xử lý')).not.toBeInTheDocument()
  })

  it('supports time-range selection and manual refresh via AdminDashboardFilterForm', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchAdminDashboardData).mockResolvedValue(mockDashboardData)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await screen.findByText('Toàn cảnh vận hành')
    await screen.findByText('185.000.000 ₫')

    // Click on 7 ngày qua
    const weekButton = screen.getByRole('button', { name: '7 ngày qua' })
    await user.click(weekButton)
    expect(weekButton).toHaveClass('bg-brand-navy')

    // Wait for the query to settle after filter change
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Làm mới/i }),
      ).toBeInTheDocument()
    })

    // Click refresh button
    const refreshBtn = screen.getByRole('button', { name: /Làm mới/i })
    await user.click(refreshBtn)

    expect(fetchAdminDashboardData).toHaveBeenCalled()
  })

  it('handles error state with retry button', async () => {
    const user = userEvent.setup()
    vi.mocked(fetchAdminDashboardData).mockRejectedValueOnce(
      new Error('Mất kết nối máy chủ'),
    )

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <AdminDashboardPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Mất kết nối máy chủ')).toBeInTheDocument()
    const retryBtn = screen.getByRole('button', { name: 'Thử lại' })
    expect(retryBtn).toBeInTheDocument()

    // Mock successful response on retry
    vi.mocked(fetchAdminDashboardData).mockResolvedValueOnce(mockDashboardData)
    await user.click(retryBtn)

    expect(await screen.findByText('185.000.000 ₫')).toBeInTheDocument()
  })
})
