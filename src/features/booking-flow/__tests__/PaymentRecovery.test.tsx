import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { PaymentResultPage } from '../PaymentResultPage'
import { paymentRecovery } from '../paymentRecovery'
import type { Booking, PaymentResult } from '../api'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), request: vi.fn() } }))
const booking: Booking = { id: 239, bookingCode: 'BK-REAL-239', parkingLotId: 3, merchantId: 9, parkingLotName: 'Bãi thật', vehicleId: 1, vehiclePlate: '71C-1234', status: 'PENDING_PAYMENT', advanceDeposit: 4000, totalAmount: 20000, hourlyRate: 10000, expectedCheckInTime: '2026-11-15T03:00:00', expectedCheckOutTime: '2026-11-15T05:00:00', expiresAt: new Date(Date.now() + 600000).toISOString() }
const clients: QueryClient[] = []
afterEach(() => { cleanup(); clients.forEach(client => client.clear()); clients.length = 0 })
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: booking } })
  vi.mocked(apiClient.request).mockResolvedValue({ data: { data: { status: 'FAILED', type: 'DEPOSIT', canRetry: true } } })
})
function mount(path = '/payment/cancel?bookingId=239&orderCode=2391&status=CANCELLED') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } }); clients.push(client)
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[path]}><PaymentResultPage cancelled /></MemoryRouter></QueryClientProvider>)
}
describe('server-driven recovery states', () => {
  it.each<[Booking['status'], PaymentResult | null, string, string]>([
    ['PENDING_PAYMENT', {status: 'FAILED', canRetry: true}, 'Thanh toán chưa hoàn tất', 'pay'],
    ['PENDING_PAYMENT', {status: 'PENDING', canResume: true}, 'Thanh toán chưa hoàn tất', 'pay'],
    ['PENDING_PAYMENT', {status: 'PENDING'}, 'Bạn đã dừng thanh toán', 'check'],
    ['PENDING_PAYMENT', null, 'Bạn đã dừng thanh toán', 'check'],
    ['PENDING_PAYMENT', {status: 'SUCCESS', type: 'DEPOSIT'}, 'Đã ghi nhận thanh toán', 'check'],
    ['PENDING_CHECKIN', {status: 'PENDING'}, 'Đã thanh toán cọc', 'ticket'],
    ['PARKING', {status: 'SUCCESS'}, 'Xe đang đỗ tại bãi', 'ticket'],
    ['OVERTIME', {status: 'SUCCESS'}, 'Xe đang đỗ tại bãi', 'ticket'],
    ['COMPLETED', {status: 'SUCCESS'}, 'Đã hoàn tất thanh toán', 'ticket'],
    ['REVIEWED', {status: 'SUCCESS'}, 'Đã hoàn tất thanh toán', 'ticket'],
    ['EXPIRED', {status: 'FAILED', canRetry: true}, 'Vé đã hết hạn', 'search'],
    ['CANCELLED', {status: 'PENDING'}, 'Vé đã hủy', 'search'],
    ['PENDING_PAYMENT', {status: 'REQUIRES_REVIEW'}, 'Khoản thanh toán cần kiểm tra', 'support'],
    ['PENDING_CHECKIN', {status: 'REFUNDED'}, 'Giao dịch đã được hoàn tiền', 'ticket'],
    ['AWAITING_FINAL_PAYMENT', {status: 'FAILED', canRetry: true}, 'Chưa hoàn tất thanh toán phần còn lại', 'pay'],
  ])('%s with %j has the correct message and action', (status, payment, title, action) => {
    expect(paymentRecovery({...booking, status}, payment, Date.now(), true)).toMatchObject({title, action})
  })
  it('expired deposit never offers a retry even when an old response granted it', () => {
    expect(paymentRecovery({...booking, expiresAt: '2020-01-01T00:00:00'}, {status: 'FAILED', canRetry: true}, Date.now(), true).action).toBe('search')
  })
  it('final payment has no deposit deadline', () => {
    expect(paymentRecovery({...booking, status: 'AWAITING_FINAL_PAYMENT', expiresAt: '2020-01-01T00:00:00'}, {status: 'FAILED', canRetry: true}, Date.now(), true).action).toBe('pay')
  })
})

it('shows real booking details and a server-approved retry without demo blocks', async () => {
  mount()
  expect(await screen.findByRole('heading', {name: 'Thanh toán chưa hoàn tất'})).toBeInTheDocument()
  expect(screen.getByText('BK-REAL-239')).toBeInTheDocument()
  expect(screen.getByRole('button', {name: /Thanh toán lại 4.000/})).toBeInTheDocument()
  expect(screen.getByRole('link', {name: 'Về vé của tôi'})).toHaveAttribute('href', '/bookings?bookingId=239')
  expect(screen.queryByText(/C-114|PAYOS-CAN|chưa bị trừ tiền|SANDBOX/)).not.toBeInTheDocument()
  expect(apiClient.request).toHaveBeenCalledWith(expect.objectContaining({url: '/api/v1/payments/sync', data: {bookingId: 239, orderCode: 2391}}))
})
it('does not trust PAID URL flags and locks retry while sync is unresolved', async () => {
  vi.mocked(apiClient.request).mockResolvedValue({data: {data: {status: 'PENDING'}}})
  mount('/payment/return?bookingId=239&status=PAID&code=00')
  expect(await screen.findByRole('heading', {name: 'Bạn đã dừng thanh toán'})).toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /Thanh toán lại/})).not.toBeInTheDocument()
  expect(screen.queryByRole('link', {name: 'Xem vé QR'})).not.toBeInTheDocument()
})
it('renders a sync error with real ticket details and no additional payment action', async () => {
  vi.mocked(apiClient.request).mockRejectedValue(new Error('PayOS chưa phản hồi'))
  mount()
  expect(await screen.findByRole('alert')).toHaveTextContent('PayOS chưa phản hồi')
  expect(screen.getByText('BK-REAL-239')).toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /Thanh toán lại/})).not.toBeInTheDocument()
})
it('never invents ticket data on forbidden/not-found response', async () => {
  vi.mocked(apiClient.get).mockRejectedValue(new Error('Bạn không có quyền xem vé'))
  mount()
  expect(await screen.findByRole('alert')).toHaveTextContent('Bạn không có quyền xem vé')
  expect(screen.queryByText('BK-REAL-239')).not.toBeInTheDocument()
})
it('requires explicit booking cancellation and preserves visible errors on failure', async () => {
  vi.mocked(apiClient.request).mockImplementation(async config => {
    if (config.url?.endsWith('/cancel')) throw new Error('Chưa hủy được vé')
    return {data: {data: {status: 'FAILED', canRetry: true}}}
  })
  mount()
  fireEvent.click(await screen.findByText('Tôi không còn muốn giữ chỗ'))
  fireEvent.click(screen.getByRole('button', {name: 'Hủy đặt chỗ'}))
  expect(apiClient.request).not.toHaveBeenCalledWith(expect.objectContaining({url: '/api/v1/bookings/239/cancel'}))
  fireEvent.click(screen.getByRole('button', {name: 'Xác nhận hủy đặt chỗ'}))
  expect(await screen.findByRole('alert')).toHaveTextContent('Chưa hủy được vé')
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
it('does not use the demo fallback or submit twice when a retry fails', async () => {
  let rejectPayment: (error: Error) => void = () => {}
  vi.mocked(apiClient.request).mockImplementation(async config => {
    if (config.url === '/api/v1/payments') return new Promise((_resolve, reject) => { rejectPayment = reject })
    return {data: {data: {status: 'FAILED', canRetry: true}}}
  })
  mount()
  const pay = await screen.findByRole('button', {name: /Thanh toán lại 4.000/})
  fireEvent.click(pay); fireEvent.click(pay)
  await waitFor(() => expect(apiClient.request).toHaveBeenCalledTimes(2))
  rejectPayment(new Error('Chưa tạo được giao dịch'))
  expect(await screen.findByRole('alert')).toHaveTextContent('Chưa tạo được giao dịch')
  expect(screen.queryByRole('link', {name: /demo/})).not.toBeInTheDocument()
})
