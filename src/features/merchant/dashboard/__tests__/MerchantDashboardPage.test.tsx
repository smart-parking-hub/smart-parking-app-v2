import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
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
    vi.mocked(apiClient.get).mockImplementation(async url => ({
      data: {
        data: {
          ...responses,
          '/api/v1/merchant/revenue': { totalNetRevenue: 123456, currentWalletBalance: 4000, series: [{ period: '2026-11-07', revenue: 123456, bookingCount: 1 }] },
          '/api/v1/merchant/parking-lots': { content: [{ id: 15, name: 'Bãi của tôi', address: 'Địa chỉ bãi', status: 'REJECTED' }], totalElements: 1 },
          '/api/v1/merchant/bookings': { content: [{ id: 8, bookingCode: 'BK-8', vehicleLicensePlate: '51C-12345', parkingLotName: 'Bãi của tôi', status: 'CANCELLED' }], totalElements: 1 },
        }[url]
      }
    }))
    renderPage()
    expect(await screen.findByText(/123.456/, { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'BK-8' })).toHaveAttribute('href', '/merchant/bookings/8')
    expect(screen.getByText('Đã hủy')).toBeInTheDocument()
    expect(screen.getAllByText('Từ chối').length).toBeGreaterThan(0)
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

  it('GAP-22: filters revenue chart and cash/channel stats by selected parking lot from dropdown', async () => {
    vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
      const params = config?.params as Record<string, unknown> | undefined
      if (url === '/api/v1/merchant/revenue' && params?.parkingLotId === 10) {
        return {
          data: {
            data: {
              totalNetRevenue: 300000,
              currentWalletBalance: 100000,
              completedBookings: 3,
              onlineTransferNetRevenue: 200000,
              onlineTransferCount: 2,
              counterQrNetRevenue: 100000,
              counterQrCount: 1,
              totalCashRevenue: 75000,
              totalCashBookings: 2,
              periodCashRevenue: 75000,
              periodCashBookings: 2,
              revenueByParkingLot: [
                {
                  parkingLotId: 10,
                  onlineTransferRevenue: 200000,
                  onlineTransferCount: 2,
                  counterQrRevenue: 100000,
                  counterQrCount: 1,
                  cashRevenue: 75000,
                  cashBookingCount: 2,
                  periodOnlineTransferRevenue: 200000,
                  periodOnlineTransferCount: 2,
                  periodCounterQrRevenue: 100000,
                  periodCounterQrCount: 1,
                  periodCashRevenue: 75000,
                  periodCashBookingCount: 2,
                },
              ],
              series: [
                {
                  period: '2026-11-01',
                  revenue: 300000,
                  onlineTransferRevenue: 200000,
                  counterQrRevenue: 100000,
                  cashRevenue: 75000,
                  cashBookingCount: 2,
                  bookingCount: 3,
                },
              ],
            },
          },
        }
      }
      return {
        data: {
          data: {
            ...responses,
            '/api/v1/merchant/revenue': {
              totalNetRevenue: 500000,
              currentWalletBalance: 100000,
              onlineTransferNetRevenue: 350000,
              onlineTransferCount: 4,
              counterQrNetRevenue: 150000,
              counterQrCount: 2,
              totalCashRevenue: 120000,
              totalCashBookings: 3,
              periodCashRevenue: 120000,
              periodCashBookings: 3,
              revenueByParkingLot: [
                {
                  parkingLotId: 10,
                  onlineTransferRevenue: 200000,
                  onlineTransferCount: 2,
                  counterQrRevenue: 100000,
                  counterQrCount: 1,
                  cashRevenue: 75000,
                  cashBookingCount: 2,
                  periodOnlineTransferRevenue: 200000,
                  periodOnlineTransferCount: 2,
                  periodCounterQrRevenue: 100000,
                  periodCounterQrCount: 1,
                  periodCashRevenue: 75000,
                  periodCashBookingCount: 2,
                },
              ],
              series: [
                {
                  period: '2026-11-01',
                  revenue: 500000,
                  onlineTransferRevenue: 350000,
                  counterQrRevenue: 150000,
                  cashRevenue: 120000,
                  cashBookingCount: 3,
                  bookingCount: 5,
                },
              ],
            },
            '/api/v1/merchant/parking-lots': {
              content: [
                { id: 10, name: 'Bãi ICD Tân Cảng', address: 'Quận 9', status: 'APPROVED' },
                { id: 20, name: 'Bãi Cát Lái B', address: 'Thủ Đức', status: 'APPROVED' },
              ],
              totalElements: 2,
            },
          }[url],
        },
      }
    })

    renderPage()
    expect((await screen.findAllByText('Bãi ICD Tân Cảng')).length).toBeGreaterThan(0)

    // Verify all-lots cash KPI, 2-channel cards (Chuyển khoản + Tiền mặt), grouped chart bars, and per-lot table (including lot 20 with 0 cash)
    expect(screen.getByText('TỔNG DOANH THU')).toBeInTheDocument()
    expect(screen.getByTestId('merchant-kpi-cash-value')).toHaveTextContent(/120\.000/)
    expect(screen.getByTestId('channel-card-transfer')).toHaveTextContent(/500\.000/)
    expect(screen.getByTestId('channel-card-cash')).toHaveTextContent(/120\.000/)
    expect(screen.queryByTestId('channel-card-counter-qr')).not.toBeInTheDocument()
    expect(screen.getByTestId('bar-transfer-2026-11-01')).toBeInTheDocument()
    expect(screen.getByTestId('bar-cash-2026-11-01')).toBeInTheDocument()
    expect(screen.getByTestId('lot-revenue-row-10')).toHaveTextContent(/75\.000/)
    expect(screen.getByTestId('lot-revenue-row-20')).toHaveTextContent(/0\s*₫/)
    expect(screen.getByTestId('lot-revenue-total-row')).toHaveTextContent('Tổng cộng (2 bãi đỗ)')

    const lotCombobox = screen.getByRole('combobox', { name: 'Mở bộ lọc cơ sở bãi đỗ' })
    expect(lotCombobox.tagName).toBe('BUTTON')

    fireEvent.click(lotCombobox)
    const lotListbox = await screen.findByRole('listbox', { name: 'Mở bộ lọc cơ sở bãi đỗ' })
    fireEvent.click(within(lotListbox).getByRole('option', { name: 'Bãi ICD Tân Cảng' }))

    expect(await screen.findByText('Đang xem bãi: Bãi ICD Tân Cảng')).toBeInTheDocument()
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/merchant/revenue',
        expect.objectContaining({
          params: expect.objectContaining({ parkingLotId: 10, granularity: 'DAY' }),
        }),
      )
    })
    await waitFor(() => {
      expect(screen.getByTestId('merchant-kpi-cash-value')).toHaveTextContent(/75\.000/)
    })
  })

  it('SP-S3-UI-01: selects time range pills and synchronizes with merchantDashboardStore and API (F-01, F-05)', async () => {
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

    // Verify API called with date range params (F-01, F-05)
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v1/merchant/revenue',
        expect.objectContaining({
          params: expect.objectContaining({
            granularity: 'DAY',
            startDate: expect.any(String),
            endDate: expect.any(String),
          }),
        }),
      )
    })

    // Click "Hôm nay"
    const todayBtn = await screen.findByRole('button', { name: 'Hôm nay' })
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

  it('SP-S3-UI-01: displays error toast when manual refresh fails (F-02)', async () => {
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

    // Make next refetch fail
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'))

    const refreshBtn = screen.getByRole('button', { name: /Làm mới dữ liệu/i })
    fireEvent.click(refreshBtn)

    expect(
      await screen.findByText('Không thể làm mới dữ liệu. Vui lòng kiểm tra kết nối.'),
    ).toBeInTheDocument()
  })
})
