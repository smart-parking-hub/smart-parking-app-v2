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
it('opens the selected server-owned booking even when it is outside the current list page', async () => {
  vi.mocked(apiClient.get).mockImplementation(async url => ({data: {data: String(url).endsWith('/bookings')
    ? {content: [{...booking, id: 99, bookingCode: 'BK-OTHER-99'}], totalElements: 20, totalPages: 3}
    : String(url).includes('/disputes/me') ? {content: []} : booking}}))
  mount(<MyBookingsPage />, '/bookings?bookingId=41', '/bookings')
  expect(await screen.findByRole('heading', {name: /Vé vừa xem.*Bãi Container Cát Lái/})).toBeInTheDocument()
  expect(await screen.findByText('BK-API-41', {exact: true})).toBeInTheDocument()
  expect(apiClient.get).toHaveBeenCalledWith('/api/v1/bookings/41', expect.anything())
  expect(screen.getByRole('button', {name: 'Xem vé & chi tiết'})).toHaveAttribute('aria-expanded', 'false')
})
it('keeps many tickets compact, expands one at a time and requests the next server page', async () => {
  vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
    if (String(url).endsWith('/bookings')) {
      const page = Number((config?.params as { page?: number } | undefined)?.page ?? 0)
      return { data: { data: { content: Array.from({ length: 8 }, (_, index) => ({ ...booking, id: 41 + page * 8 + index, bookingCode: `BK-API-${41 + page * 8 + index}`, status: 'PENDING_PAYMENT' })), totalElements: 24, totalPages: 3, currentPage: page } } }
    }
    return { data: { data: { content: [] } } }
  })
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  const toggles = await screen.findAllByRole('button', { name: 'Xem vé & chi tiết' })
  expect(toggles).toHaveLength(8)
  expect(screen.queryByRole('button', { name: /Thanh toán cọc .* qua PayOS/ })).not.toBeInTheDocument()
  fireEvent.click(toggles[0])
  expect(toggles[0]).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('button', { name: /Thanh toán cọc .* qua PayOS/ })).toBeInTheDocument()
  fireEvent.click(toggles[1])
  expect(toggles[0]).toHaveAttribute('aria-expanded', 'false')
  expect(toggles[1]).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
  expect(await screen.findByText('Số đơn #49')).toBeInTheDocument()
  expect(screen.queryByText(/#41 · BK-API-41/)).not.toBeInTheDocument()
  expect(apiClient.get).toHaveBeenCalledWith('/api/v1/bookings', expect.objectContaining({ params: { page: 1, size: 8, sort: 'createdAt,desc' } }))
  expect(screen.getAllByRole('button', { name: 'Xem vé & chi tiết' })).toHaveLength(8)
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
  const actionTrigger = await screen.findByRole('button', { name: /Tác vụ/i })
  fireEvent.click(actionTrigger)
  const disputeBtn = await screen.findByRole('menuitem', { name: /Gửi khiếu nại/i })
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

it('opens payment history modal for specific booking when clicking Lịch sử thanh toán in action menu (TKT-01)', async () => {
  const mockPayment = {
    id: 101,
    bookingId: 41,
    orderCode: 900101,
    transactionCode: 'TX-PAY-101',
    amount: 10000,
    type: 'DEPOSIT',
    status: 'SUCCESS',
    gateway: 'PAYOS',
    createdAt: '2026-11-16T10:00:00Z',
  }
  vi.mocked(apiClient.get).mockImplementation(async (url) => {
    const urlStr = String(url)
    if (urlStr.endsWith('/bookings')) {
      return { data: { data: { content: [booking] } } }
    }
    if (urlStr.includes('/payments')) {
      return {
        data: {
          data: {
            content: [mockPayment],
            totalElements: 1,
            totalPages: 1,
            currentPage: 0,
          },
        },
      }
    }
    if (urlStr.includes('/disputes/me')) {
      return { data: { data: { content: [] } } }
    }
    return { data: { data: booking } }
  })

  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('BK-API-41')).toBeInTheDocument()

  // Open Actions dropdown
  const actionTrigger = screen.getByRole('button', { name: /Tác vụ/i })
  fireEvent.click(actionTrigger)

  // Click "Lịch sử thanh toán"
  const historyOption = await screen.findByRole('menuitem', { name: /Lịch sử thanh toán/i })
  fireEvent.click(historyOption)

  // Verify modal is opened with title containing booking code
  const modal = await screen.findByRole('dialog')
  expect(within(modal).getByRole('heading', { name: /Lịch sử thanh toán #BK-API-41/i })).toBeInTheDocument()
  expect(await within(modal).findByText('TX-PAY-101')).toBeInTheDocument()
  expect(within(modal).getAllByText('Cọc giữ chỗ').length).toBeGreaterThanOrEqual(1)
  expect(within(modal).getByText('Thành công')).toBeInTheDocument()

  // Close modal
  const closeBtn = within(modal).getAllByRole('button', { name: 'Đóng' })[0]
  fireEvent.click(closeBtn)
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

it('displays ticket payment details directly without intermediate list when booking has multiple transactions', async () => {
  const depositPayment = {
    id: 101,
    bookingId: 41,
    orderCode: 900101,
    transactionCode: 'TX-PAY-DEP-101',
    amount: 100000,
    type: 'DEPOSIT',
    status: 'SUCCESS',
    gateway: 'PAYOS',
    createdAt: '2026-11-16T10:00:00Z',
  }
  const finalPayment = {
    id: 102,
    bookingId: 41,
    orderCode: 900102,
    transactionCode: 'TX-PAY-FIN-102',
    amount: 40000,
    type: 'FINAL_PAYMENT',
    status: 'SUCCESS',
    gateway: 'PAYOS',
    createdAt: '2026-11-16T12:00:00Z',
  }
  vi.mocked(apiClient.get).mockImplementation(async (url) => {
    const urlStr = String(url)
    if (urlStr.endsWith('/bookings')) {
      return { data: { data: { content: [booking] } } }
    }
    if (urlStr.includes('/payments')) {
      return {
        data: {
          data: {
            content: [depositPayment, finalPayment],
            totalElements: 2,
            totalPages: 1,
            currentPage: 0,
          },
        },
      }
    }
    if (urlStr.includes('/disputes/me')) {
      return { data: { data: { content: [] } } }
    }
    return { data: { data: booking } }
  })

  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('BK-API-41')).toBeInTheDocument()

  // Open Actions dropdown and click Lịch sử thanh toán
  const actionTrigger = screen.getByRole('button', { name: /Tác vụ/i })
  fireEvent.click(actionTrigger)
  const historyOption = await screen.findByRole('menuitem', { name: /Lịch sử thanh toán/i })
  fireEvent.click(historyOption)

  // Verify modal is opened
  const modal = await screen.findByRole('dialog')
  expect(within(modal).getByRole('heading', { name: /Lịch sử thanh toán #BK-API-41/i })).toBeInTheDocument()

  // Verify both payments are directly visible with their transaction codes and amounts
  expect(await within(modal).findByText('TX-PAY-DEP-101')).toBeInTheDocument()
  expect(await within(modal).findByText('TX-PAY-FIN-102')).toBeInTheDocument()
  expect(within(modal).getByText(/giao dịch thanh toán cho vé này/i)).toBeInTheDocument()
  expect(within(modal).getByText('TX-PAY-DEP-101')).toBeInTheDocument()
  expect(within(modal).getByText('TX-PAY-FIN-102')).toBeInTheDocument()
})

it('opens QR modal with check-in QR code when clicking Xem QR vé on PENDING_CHECKIN card (TKT-04)', async () => {
  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('BK-API-41')).toBeInTheDocument()

  const qrButton = screen.getByRole('button', { name: /Xem QR vé/i })
  fireEvent.click(qrButton)

  const modal = await screen.findByRole('dialog')
  expect(within(modal).getByRole('heading', { name: /Vé QR check-in #BK-API-41/i })).toBeInTheDocument()
  expect(within(modal).getByTestId('modal-qr-container')).toBeInTheDocument()
  expect(within(modal).getByText('ĐÃ XÁC NHẬN CỌC · SẴN SÀNG CHECK-IN')).toBeInTheDocument()
  expect(within(modal).getByRole('button', { name: /Sao chép mã/i })).toBeInTheDocument()
  expect(within(modal).getByRole('button', { name: /Tải ảnh vé QR/i })).toBeInTheDocument()

  // Close modal
  const closeBtn = within(modal).getAllByRole('button', { name: 'Đóng' })[0]
  fireEvent.click(closeBtn)
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

it('filters bookings by search keyword, status, and resets on Xóa lọc (TKT-05)', async () => {
  vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
    const urlStr = String(url)
    if (urlStr.endsWith('/bookings')) {
      const params = (config?.params as Record<string, unknown>) ?? {}
      if (params.status === 'PENDING_PAYMENT') {
        return { data: { data: { content: [], totalElements: 0, totalPages: 0, currentPage: 0 } } }
      }
      if (params.search === 'Cát Lái') {
        return { data: { data: { content: [booking], totalElements: 1, totalPages: 1, currentPage: 0 } } }
      }
      return { data: { data: { content: [booking], totalElements: 1, totalPages: 1, currentPage: 0 } } }
    }
    return { data: { data: { content: [] } } }
  })

  mount(<MyBookingsPage />, '/bookings', '/bookings')
  expect(await screen.findByText('BK-API-41')).toBeInTheDocument()

  // Type search keyword
  const searchInput = screen.getByPlaceholderText('Mã vé, biển số, tên bãi…')
  fireEvent.change(searchInput, { target: { value: 'Cát Lái' } })

  await waitFor(() => {
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/bookings', expect.objectContaining({
      params: expect.objectContaining({ search: 'Cát Lái' }),
    }))
  })

  // Select status with no results
  const statusSelect = screen.getByLabelText('Trạng thái vé')
  fireEvent.change(statusSelect, { target: { value: 'PENDING_PAYMENT' } })

  expect(await screen.findByText('Không tìm thấy lượt đặt chỗ nào phù hợp với bộ lọc hiện tại.')).toBeInTheDocument()

  // Click clear filters button
  const clearButton = screen.getAllByRole('button', { name: /Xóa bộ lọc/i })[0]
  fireEvent.click(clearButton)

  await waitFor(() => {
    expect(screen.getByPlaceholderText('Mã vé, biển số, tên bãi…')).toHaveValue('')
    expect(screen.getByLabelText('Trạng thái vé')).toHaveValue('')
  })
})

