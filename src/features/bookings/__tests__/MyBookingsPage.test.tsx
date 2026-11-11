import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
afterEach(cleanup)
function mount(ui: React.ReactNode, path: string, route: string) {
  return render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
const booking = {
  id: 41,
  bookingCode: 'BK-API-41',
  parkingLotId: 7,
  merchantId: 9,
  parkingLotName: 'Bãi Container Cát Lái',
  vehicleId: 3,
  vehiclePlate: '51C-TEST',
  status: 'PENDING_CHECKIN',
  advanceDeposit: 10000,
  totalAmount: 50000,
  hourlyRate: 25000,
  overtimePenaltyMultiplier: 2,
  surgeMultiplier: 1,
  expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
  expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
  expiresAt: new Date(Date.now() + 5400000).toISOString(),
}
import { MyBookingsPage } from '../pages/MyBookingsPage'
beforeEach(() => {
  vi.clearAllMocks()
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-receipt')
  window.URL.revokeObjectURL = vi.fn()
  vi.mocked(apiClient.get).mockImplementation(async (url) => ({
    data: {
      data: String(url).endsWith('/bookings')
        ? { content: [booking] }
        : String(url).includes('/disputes/me')
          ? { content: [], totalElements: 0, totalPages: 1, currentPage: 0 }
          : booking,
    },
  }))
  vi.mocked(apiClient.request).mockResolvedValue({
    data: {
      data: {
        id: 555,
        bookingId: 41,
        merchantId: 9,
        driverId: 3,
        reason: 'Bãi xe đóng cửa / hết chỗ dù đã thanh toán giữ chỗ',
        description: 'Đến cổng bãi đóng cửa',
        status: 'PENDING',
        resolution: '',
        createdAt: '2026-11-10T10:00:00Z',
        updatedAt: '2026-11-10T10:00:00Z',
      },
    },
  })
})
it('renders the server booking and check-in state without inventing a parking state', async () => {
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('BK-API-41')).toBeInTheDocument()
  expect(screen.getByText('Đã cọc · Chờ check-in')).toBeInTheDocument()
  expect(screen.queryByText('Đang đỗ tại bãi')).not.toBeInTheDocument()
})
it('shows an empty list when the API returns no bookings', async () => {
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { content: [] } } })
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('Bạn chưa có lượt đặt chỗ nào.')).toBeInTheDocument()
})
it('reports request errors and retries without sample bookings', async () => {
  vi.mocked(apiClient.get).mockRejectedValue(new Error('Không tải được booking'))
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được booking')
  expect(screen.queryByText('BK-API-41')).not.toBeInTheDocument()
  fireEvent.click(screen.getByText('Thử lại'))
  expect(apiClient.get).toHaveBeenCalledTimes(2)
})
it('allows opening CreateDisputeModal from PENDING_CHECKIN booking action menu and submitting with merchantId', async () => {
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  const disputeBtn = await screen.findByRole('button', { name: /Gửi khiếu nại/i })
  fireEvent.click(disputeBtn)

  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByRole('heading', { name: 'Gửi phản ánh về lượt đỗ' })).toBeInTheDocument()
  fireEvent.click(
    within(dialog).getByRole('button', {
      name: 'Bãi xe đóng cửa / hết chỗ dù đã thanh toán giữ chỗ',
    }),
  )
  fireEvent.click(within(dialog).getByRole('button', { name: 'Gửi khiếu nại' }))

  await waitFor(() => {
    expect(apiClient.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/v1/disputes',
        data: expect.objectContaining({
          bookingId: 41,
          merchantId: 9,
          reason: 'Bãi xe đóng cửa / hết chỗ dù đã thanh toán giữ chỗ',
        }),
      }),
    )
  })

  expect(await screen.findByText(/Đã gửi khiếu nại #KN-555/i)).toBeInTheDocument()
})
it('hides dispute CTA for PENDING_PAYMENT and shows existing dispute link when booking already has a dispute', async () => {
  vi.mocked(apiClient.get).mockImplementation(async (url) => {
    if (String(url).endsWith('/bookings')) {
      return {
        data: {
          data: {
            content: [
              booking,
              { ...booking, id: 42, bookingCode: 'BK-API-42', status: 'PENDING_PAYMENT' },
            ],
          },
        },
      }
    }
    if (String(url).includes('/disputes/me')) {
      return {
        data: {
          data: {
            content: [
              {
                id: 88,
                bookingId: 41,
                merchantId: 9,
                driverId: 3,
                reason: 'Thu thêm tiền mặt tại cổng',
                description: '',
                status: 'PENDING',
                resolution: '',
                createdAt: '2026-11-10T10:00:00Z',
                updatedAt: '2026-11-10T10:00:00Z',
              },
            ],
            totalElements: 1,
            totalPages: 1,
            currentPage: 0,
          },
        },
      }
    }
    return { data: { data: booking } }
  })

  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByRole('link', { name: /Xem khiếu nại #KN-88/i })).toHaveAttribute(
    'href',
    '/disputes/88',
  )
  expect(screen.queryByRole('button', { name: /Gửi khiếu nại/i })).not.toBeInTheDocument()
})
