import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { DriverWalletPage } from './DriverWalletPage'
import { WalletDepositPayment } from './WalletDepositPayment'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
afterEach(cleanup)
const envelope = (data: unknown) => ({ data: { data } })
function mount(ui: React.ReactNode) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}><MemoryRouter>{ui}</MemoryRouter></QueryClientProvider>)
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).endsWith('/transactions')
    ? { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
    : { availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
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
  vi.mocked(apiClient.request).mockResolvedValue(envelope({ id: 72, status: 'PENDING' }))
  vi.mocked(apiClient.get).mockImplementation(async url => envelope(String(url).includes('/payments/') ? { id: 72, status: 'PENDING' } : { availableAmount: 8000, heldAmount: 0, currency: 'VND', enabled: true }))
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
