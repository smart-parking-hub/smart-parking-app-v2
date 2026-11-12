import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantDashboardPage } from '../pages/MerchantDashboardPage'
import { MerchantHeader } from '@/layouts/merchant/MerchantHeader'
import { getMerchantDashboardStoreSnapshot } from '../store/merchantDashboardStore'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn() } }))
const responses: Record<string, unknown> = {
  '/api/v1/merchant/revenue': { totalNetRevenue: 0, currentWalletBalance: 0, series: [] },
  '/api/v1/merchant/parking-lots': { content: [], totalElements: 0 },
  '/api/v1/merchant/bookings': { content: [], totalElements: 0 },
  '/api/v1/merchant/profile': { merchantId: 27, fullName: 'Chủ bãi mới' },
}
function renderPage() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter><MerchantHeader /><MerchantDashboardPage /></MemoryRouter>
  </QueryClientProvider>)
}
beforeEach(() => {
  vi.resetAllMocks()
  getMerchantDashboardStoreSnapshot().resetStore()
  vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: responses[url] } }))
})
describe('Merchant dashboard real data', () => {
  it('shows empty data and the current merchant instead of demo revenue and identity', async () => {
    renderPage()
    expect(await screen.findByText(/Bạn chưa có bãi đỗ nào/)).toBeInTheDocument()
    expect(await screen.findByText('Chủ bãi mới')).toBeInTheDocument()
    expect(screen.getByText('#MCH-27')).toBeInTheDocument()
    expect(screen.getByText('Chưa có lượt đặt chỗ.')).toBeInTheDocument()
    expect(screen.getByText('Chưa có dữ liệu biểu đồ doanh thu.')).toBeInTheDocument()
    expect(screen.queryByText('148.500.000')).not.toBeInTheDocument()
    expect(screen.queryByText(/Cát Lái/)).not.toBeInTheDocument()
    expect(screen.queryByText('05')).not.toBeInTheDocument()
    expect(screen.queryByText(/88219/)).not.toBeInTheDocument()
  })
  it('reads the API envelope and displays net revenue, owned yards and real booking status', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: {
      ...responses,
      '/api/v1/merchant/revenue': { totalNetRevenue: 123456, currentWalletBalance: 4000, series: [{ period: '2026-11-07', revenue: 123456, bookingCount: 1 }] },
      '/api/v1/merchant/parking-lots': { content: [{ id: 15, name: 'Bãi của tôi', address: 'Địa chỉ bãi', status: 'REJECTED' }], totalElements: 1 },
      '/api/v1/merchant/bookings': { content: [{ id: 8, bookingCode: 'BK-8', vehicleLicensePlate: '51C-12345', parkingLotName: 'Bãi của tôi', status: 'CANCELLED' }], totalElements: 1 },
    }[url] } }))
    renderPage()
    expect(await screen.findByText(/123.456/, { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'BK-8' })).toHaveAttribute('href', '/merchant/bookings/8')
    expect(screen.getByText('Đã hủy')).toBeInTheDocument()
    expect(screen.getByText('Từ chối')).toBeInTheDocument()
    expect(screen.getByText(/2026-11-07/)).toBeInTheDocument()
  })
  it.each([401, 403, 500])('shows an error on HTTP %s and retries without substituting sample data', async status => {
    vi.mocked(apiClient.get).mockRejectedValue({ response: { status } })
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải dữ liệu')
    expect(screen.queryByText('148.500.000')).not.toBeInTheDocument()
    vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: responses[url] } }))
    fireEvent.click(screen.getByRole('button', { name: 'Tải lại dữ liệu' }))
    expect(await screen.findByText(/Bạn chưa có bãi đỗ nào/)).toBeInTheDocument()
  })
  it('rejects malformed responses instead of reporting an empty account', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => url === '/api/v1/merchant/profile' ? { data: { data: responses[url] } } : { data: { content: [] } })
    renderPage()
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText(/Bạn chưa có bãi đỗ nào/)).not.toBeInTheDocument()
  })

  it('GAP-22: filters revenue chart by selected parking lot from dropdown', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => ({
      data: {
        data: {
          ...responses,
          '/api/v1/merchant/revenue': {
            totalNetRevenue: 500000,
            currentWalletBalance: 100000,
            series: [{ period: '2026-11-01', revenue: 500000, bookingCount: 5 }],
          },
          '/api/v1/merchant/parking-lots': {
            content: [
              { id: 10, name: 'Bãi ICD Tân Cảng', address: 'Quận 9', status: 'APPROVED' },
              { id: 20, name: 'Bãi Cát Lái B', address: 'Thủ Đức', status: 'APPROVED' },
            ],
            totalElements: 2,
          },
          '/api/v1/merchant/parking-lots/10/revenue': {
            totalRevenue: 300000,
            completedBookings: 3,
            series: [{ period: '2026-11-01', revenue: 300000, bookingCount: 3 }],
          },
        }[url],
      },
    }))

    renderPage()
    expect((await screen.findAllByText('Bãi ICD Tân Cảng')).length).toBeGreaterThan(0)

    const select = screen.getByLabelText('Lọc theo cơ sở bãi đỗ')
    expect(select).toBeInTheDocument()

    fireEvent.change(select, { target: { value: '10' } })

    expect(await screen.findByText('Đang xem bãi: Bãi ICD Tân Cảng')).toBeInTheDocument()
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/10/revenue', expect.anything())
  })

  it('SP-S3-UI-01: selects time range pills and synchronizes with merchantDashboardStore', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => ({
      data: {
        data: {
          ...responses,
          '/api/v1/merchant/parking-lots': {
            content: [{ id: 10, name: 'Bãi ICD Tân Cảng', address: 'Quận 9', status: 'APPROVED' }],
            totalElements: 1,
          },
        }[url],
      },
    }))

    renderPage()
    expect((await screen.findAllByText('Bãi ICD Tân Cảng')).length).toBeGreaterThan(0)

    // Default timeRange is ALL
    expect(getMerchantDashboardStoreSnapshot().timeRange).toBe('ALL')

    // Click "7 ngày qua"
    const weekBtn = screen.getByRole('button', { name: '7 ngày qua' })
    fireEvent.click(weekBtn)
    expect(getMerchantDashboardStoreSnapshot().timeRange).toBe('WEEK')

    // Click "Hôm nay"
    const todayBtn = screen.getByRole('button', { name: 'Hôm nay' })
    fireEvent.click(todayBtn)
    expect(getMerchantDashboardStoreSnapshot().timeRange).toBe('TODAY')
  })

  it('SP-S3-UI-01: clicks manual refresh button and displays floating success toast', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => ({
      data: {
        data: {
          ...responses,
          '/api/v1/merchant/parking-lots': {
            content: [{ id: 10, name: 'Bãi ICD Tân Cảng', address: 'Quận 9', status: 'APPROVED' }],
            totalElements: 1,
          },
        }[url],
      },
    }))

    renderPage()
    expect((await screen.findAllByText('Bãi ICD Tân Cảng')).length).toBeGreaterThan(0)

    // Find and click "Làm mới dữ liệu" button
    const refreshBtn = screen.getByRole('button', { name: /Làm mới dữ liệu/i })
    expect(refreshBtn).toBeInTheDocument()
    fireEvent.click(refreshBtn)

    // Assert Toast appears
    expect(
      await screen.findByText('Dữ liệu bảng điều khiển chủ bãi đã được làm mới thành công!'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('merchant-dashboard-toast')).toBeInTheDocument()

    // Click close on toast
    const closeToastBtn = screen.getByRole('button', { name: 'Đóng thông báo' })
    fireEvent.click(closeToastBtn)
    expect(
      screen.queryByText('Dữ liệu bảng điều khiển chủ bãi đã được làm mới thành công!'),
    ).not.toBeInTheDocument()
  })
})
