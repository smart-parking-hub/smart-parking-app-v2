import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { DepositStatements } from './index'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
afterEach(cleanup)
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { content: [{ paymentId: 71, bookingId: 41, refundId: 2, paymentStatus: 'SUCCESS', gateway: 'PAYOS',
    depositCollected: 16000, refundAmount: 8000, refundCompleted: 8000, refundOutstanding: 0, refundStatus: 'COMPLETED', refundChannel: 'WALLET', escrowRemaining: 0,
    depositPlatformFee: 800, depositMerchantNet: 7200, reconciled: true }], currentPage: 0, totalElements: 1, totalPages: 1 } } })
})
function mount(scope: 'merchant' | 'admin') {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><DepositStatements scope={scope} /></MemoryRouter></QueryClientProvider>)
}
it('loads on demand and displays the ledger allocation of a 16000 deposit', async () => {
  mount('merchant')
  expect(apiClient.get).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('button', { name: 'Xem đối soát tiền cọc' }))
  expect(await screen.findByText(/16\.000/)).toBeInTheDocument()
  expect(screen.getByText(/7\.200/)).toBeInTheDocument()
  expect(screen.getByText('Ví tài xế · COMPLETED')).toBeInTheDocument()
  expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/revenue/deposits', { params: { page: 0, size: 20 } })
  expect(screen.queryByRole('button', { name: 'Thử lại hoàn ví' })).not.toBeInTheDocument()
})
it('shows API failure instead of asserting that the money reconciles', async () => {
  vi.mocked(apiClient.get).mockRejectedValue(new Error('Đối soát gián đoạn'))
  mount('admin')
  await userEvent.click(screen.getByRole('button', { name: 'Xem đối soát tiền cọc' }))
  expect((await screen.findAllByRole('alert'))[0]).toHaveTextContent('Đối soát gián đoạn')
  expect(screen.queryByText('Khớp')).not.toBeInTheDocument()
})

it('shows unverified refund requests to admins without permitting an unverified credit', async () => {
  vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: { content: String(url).endsWith('/admin/refunds')
    ? [{ id: 3, bookingId: 41, paymentId: null, refundAmount: 8000, refundChannel: 'WALLET', status: 'REQUIRES_RECONCILIATION', verificationNote: 'Thiếu giao dịch gốc' }] : [],
    currentPage: 0, totalPages: 1, totalElements: 1 } } }))
  mount('admin')
  await userEvent.click(screen.getByRole('button', { name: 'Xem đối soát tiền cọc' }))
  expect(await screen.findByText('Thiếu giao dịch gốc')).toBeInTheDocument()
  expect(screen.getByText('Chưa xác minh')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Thử lại hoàn ví' })).not.toBeInTheDocument()
})

it('lets an admin retry a verified wallet request and refreshes the authoritative status', async () => {
  let completed=false
  vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data: { content: String(url).endsWith('/admin/refunds')
    ? [{ id: 9, bookingId: 41, paymentId: 71, refundAmount: 8000, refundChannel: 'WALLET', status: completed ? 'COMPLETED' : 'REQUIRES_RECONCILIATION' }] : [],
    currentPage: 0, totalPages: 1, totalElements: 1 } } }))
  vi.mocked(apiClient.request).mockImplementation(async () => { completed=true; return { data: { data: { status: 'COMPLETED' } } } })
  mount('admin')
  await userEvent.click(screen.getByRole('button', { name: 'Xem đối soát tiền cọc' }))
  await userEvent.click(await screen.findByRole('button', { name: 'Thử lại hoàn ví' }))
  await waitFor(() => expect(screen.getByText('COMPLETED')).toBeInTheDocument())
  expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({ method: 'post', url: '/api/v1/admin/refunds/9/retry-wallet' }))
  expect(screen.queryByRole('button', { name: 'Thử lại hoàn ví' })).not.toBeInTheDocument()
})
