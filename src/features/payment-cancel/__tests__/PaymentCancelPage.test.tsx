import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { PaymentCancelPage } from '../pages/PaymentCancelPage'
import { repayDepositApi, releaseSlotApi, confirmDemoDepositApi } from '../api/paymentCancelApi'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
afterEach(cleanup)
beforeEach(() => vi.clearAllMocks())
it('cancel compatibility entry uses the unified result and never renders demo data', () => {
  render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={['/payment/cancel']}><PaymentCancelPage /></MemoryRouter></QueryClientProvider>)
  expect(screen.getByRole('heading', {name: 'Không tìm thấy vé'})).toBeInTheDocument()
  expect(screen.queryByText(/C-114|PAYOS-CAN|chưa bị trừ tiền|06:45/)).not.toBeInTheDocument()
  expect(apiClient.request).not.toHaveBeenCalled()
})
it.each([repayDepositApi, releaseSlotApi, confirmDemoDepositApi])('legacy adapter propagates server failures instead of simulating success', async action => {
  vi.mocked(apiClient.request).mockRejectedValue(new Error('Máy chủ không xác nhận'))
  await expect(action(239)).rejects.toThrow('Máy chủ không xác nhận')
})
it('legacy retry uses the canonical payment endpoint and validated URL', async () => {
  vi.mocked(apiClient.request).mockResolvedValue({ data: { data: 'https://pay.payos.vn/web/real-order' } })
  await expect(repayDepositApi(239)).resolves.toEqual({ success: true, checkoutUrl: 'https://pay.payos.vn/web/real-order' })
  expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/payments', data: { bookingId: 239, paymentType: 'DEPOSIT' } }))
})
