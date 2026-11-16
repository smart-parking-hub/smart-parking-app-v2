import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { DriverWalletPage } from './DriverWalletPage'
import { WalletDepositPayment } from './WalletDepositPayment'
import { BookingStatusPanel } from '@/features/booking-flow/BookingStatusPanel'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
afterEach(cleanup)
const envelope = (data: unknown) => ({ data: { data } })
function mount(ui: React.ReactNode) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}><MemoryRouter>{ui}</MemoryRouter></QueryClientProvider>)
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).endsWith('/payments/wallet') ? null : String(url).endsWith('/transactions')
    ? { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
    : { availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
})
it('recovers held money by booking after the payment POST response is lost', async () => {
  let held = false
  const pendingChanged = vi.fn()
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).endsWith('/payments/wallet')
    ? (held ? { id: 75, status: 'PENDING' } : null)
    : { availableAmount: held ? 2000 : 8000, heldAmount: held ? 6000 : 0, currency: 'VND', enabled: true }))
  vi.mocked(apiClient.request).mockImplementation(async () => { held = true; throw new Error('response lost') })
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} onPendingChange={pendingChanged} />)
  const pay = screen.getByRole('button', { name: /Trả.*bằng ví/ })
  await waitFor(() => expect(pay).toBeEnabled())
  await userEvent.click(pay)
  expect(await screen.findByText(/Tiền đang được giữ/)).toBeInTheDocument()
  expect(await screen.findByText(/2\.000/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Đang xác nhận cọc bằng ví/ })).toBeDisabled()
  await waitFor(() => expect(pendingChanged).toHaveBeenLastCalledWith(true))
  expect(apiClient.request).toHaveBeenCalledTimes(1)
  expect(apiClient.get).toHaveBeenCalledWith('/api/v1/payments/wallet', expect.objectContaining({ params: { bookingId: 41 } }))
})
it('restores a pending wallet payment when the booking screen is reopened', async () => {
  const pendingChanged = vi.fn()
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).endsWith('/payments/wallet')
    ? { id: 76, status: 'PENDING' }
    : { availableAmount: 2000, heldAmount: 6000, currency: 'VND', enabled: true }))
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} onPendingChange={pendingChanged} />)
  expect(await screen.findByText(/Tiền đang được giữ/)).toBeInTheDocument()
  await waitFor(() => expect(pendingChanged).toHaveBeenLastCalledWith(true))
  expect(apiClient.request).not.toHaveBeenCalled()
})
it('blocks additional payment when the booking payment lookup is unavailable', async () => {
  const pendingChanged = vi.fn()
  vi.mocked(apiClient.get).mockImplementation(async url => {
    if (String(url).endsWith('/payments/wallet')) throw new Error('lookup unavailable')
    return envelope({ availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true })
  })
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} onPendingChange={pendingChanged} />)
  expect(await screen.findByText(/Chưa kiểm tra được giao dịch ví/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Trả.*bằng ví/ })).toBeDisabled()
  await waitFor(() => expect(pendingChanged).toHaveBeenLastCalledWith(true))
})
it('accepts the backend envelope that omits null data when no wallet payment exists', async () => {
  vi.mocked(apiClient.get).mockImplementation(async url => String(url).endsWith('/payments/wallet')
    ? { data: { success: true } } : envelope({ availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} />)
  await waitFor(() => expect(screen.getByRole('button', { name: /Trả.*bằng ví/ })).toBeEnabled())
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
it('allows another payment method after the backend releases a failed wallet attempt', async () => {
  const pendingChanged = vi.fn()
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).endsWith('/payments/wallet')
    ? { id: 77, status: 'FAILED' } : { availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} onPendingChange={pendingChanged} />)
  expect(await screen.findByText(/Tiền giữ đã được trả lại ví/)).toBeInTheDocument()
  await waitFor(() => expect(pendingChanged).toHaveBeenLastCalledWith(false))
  expect(screen.getByRole('button', { name: /Trả.*bằng ví/ })).toBeDisabled()
})
it.each([
  ['REQUESTED', /Khoản hoàn vào ví đang được xử lý/],
  ['PROCESSING', /Khoản hoàn vào ví đang được xử lý/],
  ['COMPLETED', /Đã cộng vào ví tài xế/],
  ['REQUIRES_RECONCILIATION', /Khoản hoàn vào ví cần đối soát/],
  ['FAILED', /Khoản hoàn vào ví chưa hoàn thành/],
] as const)('shows the actual positive-refund state %s', (refundStatus, message) => {
  mount(<BookingStatusPanel bookingId={41} booking={{ id: 41, bookingCode: 'BK-REFUND', parkingLotId: 7, merchantId: 9,
    vehicleId: 3, status: 'CANCELLED', advanceDeposit: 16000, totalAmount: 80000, hourlyRate: 10000,
    expectedCheckInTime: '2026-11-18T12:00:00', expectedCheckOutTime: '2026-11-18T15:00:00', expiresAt: '2026-11-18T12:15:00',
    refundAmount: 8000, refundStatus, refundChannel: 'WALLET' }} />)
  expect(screen.getByText(message)).toBeInTheDocument()
  if (refundStatus !== 'COMPLETED') expect(screen.queryByText(/Đã cộng vào ví tài xế/)).not.toBeInTheDocument()
})
it.each(['NONE', 'REQUESTED', 'COMPLETED'])('does not promise a wallet refund when amount is zero (%s)', async refundStatus => {
  mount(<BookingStatusPanel bookingId={41} booking={{ id: 41, bookingCode: 'BK-ZERO', parkingLotId: 7, merchantId: 9,
    vehicleId: 3, status: 'CANCELLED', advanceDeposit: 16000, totalAmount: 80000, hourlyRate: 10000,
    expectedCheckInTime: '2026-11-18T12:00:00', expectedCheckOutTime: '2026-11-18T15:00:00', expiresAt: '2026-11-18T12:15:00',
    refundAmount: 0, refundStatus, refundChannel: 'WALLET' }} />)
  expect(screen.queryByText(/Khoản hoàn vào ví đang được xử lý/)).not.toBeInTheDocument()
  expect(screen.queryByText(/Đã cộng vào ví tài xế/)).not.toBeInTheDocument()
})
it('shows real balance, empty activity and limits without top-up or withdraw actions', async () => {
  mount(<DriverWalletPage />)
  expect(await screen.findByText(/8\.000/)).toBeInTheDocument()
  expect(await screen.findByText(/Chưa có biến động ví/)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Nạp|Rút/ })).not.toBeInTheDocument()
  expect(screen.getByText(/chưa hỗ trợ nạp, rút/)).toBeInTheDocument()
})
it('disables wallet payment when 8000 is insufficient for 16000 without issuing a write', async () => {
  mount(<WalletDepositPayment bookingId={41} amount={16000} onComplete={async () => {}} />)
  expect(await screen.findByText(/Ví thiếu/)).toHaveTextContent(/8\.000/)
  expect(screen.getByRole('button', { name: /Trả.*bằng ví/ })).toBeDisabled()
  expect(apiClient.request).not.toHaveBeenCalled()
})
it('pays the whole 6000 using only bookingId and refreshes server state', async () => {
  const completed = vi.fn(async () => {})
  vi.mocked(apiClient.request).mockResolvedValue(envelope({ id: 71, status: 'SUCCESS' }))
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={completed} />)
  await screen.findByText(/8\.000/)
  await userEvent.click(screen.getByRole('button', { name: /Trả.*bằng ví/ }))
  await waitFor(() => expect(completed).toHaveBeenCalledOnce())
  expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({ method: 'post', url: '/api/v1/payments/wallet', data: { bookingId: 41 } }))
  expect(screen.getByRole('button', { name: /Trả.*bằng ví/ })).toBeDisabled()
})
it('shows pending hold and prevents a duplicate click until the backend decides', async () => {
  let posted = false
  vi.mocked(apiClient.request).mockResolvedValue(envelope({ id: 72, status: 'PENDING' }))
  vi.mocked(apiClient.request).mockImplementation(async () => { posted = true; return envelope({ id: 72, status: 'PENDING' }) })
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).includes('/payments/')
    ? (posted ? { id: 72, status: 'PENDING' } : null) : { availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
  mount(<WalletDepositPayment bookingId={41} amount={6000} onComplete={async () => {}} />)
  await screen.findByText(/8\.000/)
  await userEvent.click(screen.getByRole('button', { name: /Trả.*bằng ví/ }))
  expect(await screen.findByText(/Tiền đang được giữ/)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Đang xác nhận cọc bằng ví/ })).toBeDisabled()
})
it('reports API failure without inventing a balance or claiming a refund', async () => {
  vi.mocked(apiClient.get).mockRejectedValue(new Error('API 500'))
  mount(<DriverWalletPage />)
  expect((await screen.findAllByRole('alert'))[0]).toHaveTextContent('API 500')
  expect(screen.queryByText(/8\.000/)).not.toBeInTheDocument()
})
