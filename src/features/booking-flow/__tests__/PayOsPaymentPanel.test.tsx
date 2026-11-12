import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { BookingStatusPanel } from '../BookingStatusPanel'
import { loadPayOS, type PayOSConfig } from '../payosCheckout'
import type { Booking } from '../api'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), request: vi.fn() } }))
vi.mock('../payosCheckout', async (original) => ({
  ...await original<typeof import('../payosCheckout')>(), loadPayOS: vi.fn(),
}))

const checkoutUrl = 'https://pay.payos.vn/web/test-payment-link'
const initial: Booking = {
  id: 51, bookingCode: 'BK-SERVER-51', parkingLotId: 7, merchantId: 2,
  parkingLotName: 'Bãi thử nghiệm', vehicleId: 3, vehiclePlate: '51C-TEST',
  status: 'PENDING_PAYMENT', advanceDeposit: 20000, totalAmount: 100000, hourlyRate: 25000,
  expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
  expectedCheckOutTime: new Date(Date.now() + 9000000).toISOString(),
  expiresAt: new Date(Date.now() + 900000).toISOString(),
}
let current: Booking
let sdkConfig: PayOSConfig
let clients: QueryClient[] = []
const exit = vi.fn()
const open = vi.fn(() => {
  const frame = document.createElement('iframe')
  frame.src = 'about:blank'
  document.getElementById(sdkConfig.ELEMENT_ID)?.appendChild(frame)
})

function mount(booking?: Booking) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  clients.push(client)
  const wrap = (value?: Booking) => (
    <QueryClientProvider client={client}><MemoryRouter>
      <BookingStatusPanel bookingId={value?.id ?? current.id} booking={value} />
    </MemoryRouter></QueryClientProvider>
  )
  const view = render(wrap(booking))
  return { ...view, rerenderBooking: (value: Booking) => view.rerender(wrap(value)) }
}
async function openCheckout() {
  const user = userEvent.setup()
  await user.click(await screen.findByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }))
  const frame = await screen.findByTitle('Mã QR thanh toán PayOS')
  fireEvent.load(frame)
  return user
}
beforeEach(() => {
  vi.clearAllMocks()
  current = { ...initial }
  vi.mocked(loadPayOS).mockResolvedValue({ usePayOS: (config) => {
    sdkConfig = config
    return { open, exit }
  } })
  vi.mocked(apiClient.get).mockImplementation(async () => ({ data: { data: current } }))
  vi.mocked(apiClient.post).mockImplementation(async (url) => ({
    data: { data: String(url).endsWith('/sync') ? { status: 'PENDING' } : checkoutUrl },
  }))
  vi.mocked(apiClient.request).mockImplementation(async (config) => apiClient.post(config.url!, config.data))
})
afterEach(() => {
  cleanup()
  clients.forEach((client) => client.clear())
  clients = []
})

describe('PayOS embedded checkout', () => {
  it('checks with the server when returning to the payment tab', async () => {
    mount()
    await openCheckout()
    await act(async () => { window.dispatchEvent(new Event('focus')) })
    await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments/sync', { bookingId: 51 }))
    expect(await screen.findByText(/Chưa ghi nhận thanh toán/)).toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
  })
  it('keeps the booking unpaid when the user manually checks before transferring money', async () => {
    mount()
    const user = await openCheckout()
    await user.click(screen.getByRole('button', { name: 'Kiểm tra trạng thái thanh toán' }))
    expect(await screen.findByText(/Chưa ghi nhận thanh toán/)).toBeInTheDocument()
    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments/sync', { bookingId: 51 })
    expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
  })
  it('loads only on demand and uses the server link, with a hosted fallback and cleanup', async () => {
    mount()
    await screen.findByText('BK-SERVER-51')
    expect(loadPayOS).not.toHaveBeenCalled()
    const user = await openCheckout()
    expect(screen.getByTitle('Mã QR thanh toán PayOS')).toHaveAttribute('src', checkoutUrl)
    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments', { bookingId: 51, paymentType: 'DEPOSIT' })
    expect(sdkConfig).toMatchObject({ CHECKOUT_URL: checkoutUrl, RETURN_URL: window.location.href, embedded: true })
    expect(screen.getByRole('link', { name: 'Mở trang PayOS' })).toHaveAttribute('href', checkoutUrl)
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Đóng QR' }))
    expect(exit).toHaveBeenCalledOnce()
    expect(screen.queryByTitle('Mã QR thanh toán PayOS')).not.toBeInTheDocument()
    expect(apiClient.post).not.toHaveBeenCalledWith(expect.stringContaining('/cancel'), expect.anything())
  })

  it('sends FINAL_PAYMENT when a final-payment booking is supplied through props', async () => {
    mount({ ...current, status: 'AWAITING_FINAL_PAYMENT' })
    await userEvent.click(screen.getByRole('button', { name: 'Thanh toán phần còn lại qua PayOS' }))
    await screen.findByTitle('Mã QR thanh toán PayOS')
    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments', { bookingId: 51, paymentType: 'FINAL_PAYMENT' })
  })

  it('blocks duplicate clicks while creating the payment link', async () => {
    let resolve!: (value: Awaited<ReturnType<typeof apiClient.post>>) => void
    vi.mocked(apiClient.post).mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    mount()
    const user = userEvent.setup()
    const button = await screen.findByRole('button', { name: /Thanh toán cọc.*qua PayOS/ })
    await user.dblClick(button)
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(loadPayOS).not.toHaveBeenCalled()
    resolve({ data: { data: checkoutUrl } } as Awaited<ReturnType<typeof apiClient.post>>)
    await screen.findByTitle('Mã QR thanh toán PayOS')
  })

  it('shows a creation failure and allows retry without reporting payment success', async () => {
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Chưa tạo được thanh toán'))
    mount()
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Chưa tạo được thanh toán')
    expect(loadPayOS).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }))
    await screen.findByTitle('Mã QR thanh toán PayOS')
    expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
  })

  it('retries SDK loading against the same checkout, without creating another payment', async () => {
    vi.mocked(loadPayOS).mockRejectedValueOnce(new Error('CDN không tải được'))
    mount()
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('CDN không tải được')
    await user.click(screen.getByRole('button', { name: 'Thử tải lại QR' }))
    await screen.findByTitle('Mã QR thanh toán PayOS')
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(loadPayOS).toHaveBeenCalledTimes(2)
  })

  it('does not trust a paid callback when the server still reports a pending booking', async () => {
    mount()
    await openCheckout()
    await act(async () => { sdkConfig.onSuccess({ status: 'PAID', bookingId: 999, amount: 1, orderCode: 123 }) })
    await waitFor(() => expect(apiClient.post).toHaveBeenCalledWith('/api/v1/payments/sync', { bookingId: 51 }))
    expect(await screen.findByText(/Chưa ghi nhận thanh toán/)).toBeInTheDocument()
    expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
  })

  it('renders check-in QR only after a refetch confirms the booking on the server', async () => {
    vi.mocked(apiClient.post).mockImplementation(async (url) => {
      if (String(url).endsWith('/sync')) {
        current = { ...current, status: 'PENDING_CHECKIN' }
        return { data: { data: { status: 'SUCCESS' } } }
      }
      return { data: { data: checkoutUrl } }
    })
    mount()
    await openCheckout()
    await act(async () => { sdkConfig.onSuccess({ status: 'PAID' }) })
    expect(await screen.findByTestId('checkin-qr-container')).toBeInTheDocument()
    expect(screen.queryByTitle('Mã QR thanh toán PayOS')).not.toBeInTheDocument()
    expect(exit).toHaveBeenCalledOnce()
  })

  it('shows sync failures and reconciliation status without granting check-in', async () => {
    mount()
    const user = await openCheckout()
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Đối soát tạm gián đoạn'))
    await user.click(screen.getByRole('button', { name: /Kiểm tra trạng thái thanh toán/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Đối soát tạm gián đoạn')
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { data: { status: 'REQUIRES_REVIEW' } } } as Awaited<ReturnType<typeof apiClient.post>>)
    await user.click(screen.getByRole('button', { name: /Kiểm tra trạng thái thanh toán/ }))
    expect(await screen.findByText(/Giao dịch cần đối soát/)).toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
  })

  it('ignores a late SDK callback after closing checkout', async () => {
    mount()
    const user = await openCheckout()
    const oldConfig = sdkConfig
    await user.click(screen.getByRole('button', { name: 'Đóng QR' }))
    oldConfig.onSuccess({ status: 'PAID' })
    expect(apiClient.post).toHaveBeenCalledTimes(1)
  })

  it('does not open a stale checkout if the booking changes while its link is pending', async () => {
    let resolve!: (value: Awaited<ReturnType<typeof apiClient.post>>) => void
    vi.mocked(apiClient.post).mockImplementationOnce(() => new Promise((done) => { resolve = done }))
    const view = mount(current)
    await userEvent.click(screen.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ }))
    view.rerenderBooking({ ...current, id: 52, bookingCode: 'BK-SERVER-52' })
    view.rerenderBooking(current)
    await act(async () => {
      resolve({ data: { data: checkoutUrl } } as Awaited<ReturnType<typeof apiClient.post>>)
    })
    await waitFor(() => expect(screen.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ })).toBeEnabled())
    expect(loadPayOS).not.toHaveBeenCalled()
    expect(screen.queryByTitle('Mã QR thanh toán PayOS')).not.toBeInTheDocument()
  })

  it.each(['EXPIRED', 'CANCELLED', 'COMPLETED'] as const)('does not offer payment for %s bookings', (status) => {
    mount({ ...current, status })
    expect(screen.queryByRole('button', { name: /qua PayOS/ })).not.toBeInTheDocument()
    expect(loadPayOS).not.toHaveBeenCalled()
  })

  it('does not offer payment after the deposit deadline', () => {
    mount({ ...current, expiresAt: new Date(Date.now() - 1000).toISOString() })
    expect(screen.queryByRole('button', { name: /qua PayOS/ })).not.toBeInTheDocument()
  })

  it('removes the payment action at the deadline even without a booking update', async () => {
    vi.useFakeTimers()
    try {
      mount({ ...current, expiresAt: new Date(Date.now() + 2000).toISOString() })
      expect(screen.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ })).toBeEnabled()
      await act(async () => { await vi.advanceTimersByTimeAsync(2000) })
      expect(screen.queryByRole('button', { name: /qua PayOS/ })).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('handles onCancel callback by showing cancel notice and NOT triggering payment sync', async () => {
    mount()
    await openCheckout()
    expect(apiClient.post).toHaveBeenCalledTimes(1) // only initial /api/v1/payments
    await act(async () => {
      sdkConfig.onCancel({ status: 'CANCELLED' })
    })
    // Must NOT call /api/v1/payments/sync
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(apiClient.post).not.toHaveBeenCalledWith('/api/v1/payments/sync', expect.anything())
    expect(
      screen.getByText('Bạn đã hủy bước thanh toán trên PayOS. Booking chưa được xác nhận thanh toán.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Chờ thanh toán cọc')).toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
  })

  it('clears active checkout session when bookingId switches, preventing stale reopen when switching back', async () => {
    const view = mount(current)
    await openCheckout()
    expect(screen.getByTitle('Mã QR thanh toán PayOS')).toBeInTheDocument()

    // Switch to another booking: checkout must close
    view.rerenderBooking({ ...current, id: 52, bookingCode: 'BK-SERVER-52' })
    expect(screen.queryByTitle('Mã QR thanh toán PayOS')).not.toBeInTheDocument()

    // Switch back to booking 51: checkout must NOT magically auto-reopen without user click
    view.rerenderBooking(current)
    expect(screen.queryByTitle('Mã QR thanh toán PayOS')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thanh toán cọc.*qua PayOS/ })).toBeInTheDocument()
  })

  it('uses clean element ID without colons for DOM and CSS selector safety', async () => {
    mount()
    await openCheckout()
    expect(sdkConfig.ELEMENT_ID).not.toContain(':')
    expect(document.getElementById(sdkConfig.ELEMENT_ID)).toBeInTheDocument()
  })
})
