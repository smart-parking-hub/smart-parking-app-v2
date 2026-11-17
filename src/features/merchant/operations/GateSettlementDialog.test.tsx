import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getData, sendData } from '@/shared/api/resources'
import { GateSettlementDialog } from './GateSettlementDialog'
import type { Settlement } from '@/entities/operations'

vi.mock('@/shared/api/resources', async original => ({ ...await original<typeof import('@/shared/api/resources')>(), getData: vi.fn(), sendData: vi.fn() }))
interface MockPayOsConfig {
  ELEMENT_ID?: string
  CHECKOUT_URL?: string
  onSuccess?: (event: unknown) => void
  onCancel?: (event: unknown) => void
  onExit?: () => void
}
let payosConfig: MockPayOsConfig | undefined
vi.mock('@/features/booking-flow/payosCheckout', async original => ({
  ...await original<typeof import('@/features/booking-flow/payosCheckout')>(),
  loadPayOS: vi.fn(async () => ({
    usePayOS: (config: MockPayOsConfig) => {
      payosConfig = config
      return {
        open: () => {
          const frame = document.createElement('iframe')
          if (config.ELEMENT_ID) {
            document.getElementById(config.ELEMENT_ID)?.appendChild(frame)
          }
        },
        exit: vi.fn(),
      }
    },
  })),
}))
const get = vi.mocked(getData)
const send = vi.mocked(sendData)
const settlement: Settlement = { bookingId: 41, bookingCode: 'BK-41', totalAmount: 40000, advanceDeposit: 8000, amountDue: 32000, parkingMinutes: 60, bookingStatus: 'AWAITING_FINAL_PAYMENT' }
const booking = { id: 41, bookingCode: 'BK-41', parkingLotId: 12, status: 'AWAITING_FINAL_PAYMENT' }
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
beforeEach(() => { vi.resetAllMocks(); get.mockResolvedValue(booking) })
afterEach(cleanup)
function mount(onComplete = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return { ...render(<QueryClientProvider client={client}><GateSettlementDialog settlement={settlement} parkingLotId={12} onClose={vi.fn()} onComplete={onComplete}/></QueryClientProvider>), onComplete }
}
describe('Gate final payment confirmation', () => {
  it('keeps the bill unpaid until server confirmation and observes PayOS completion', async () => {
    send.mockResolvedValueOnce('https://pay.payos.vn/web/test-checkout-41')
    const { onComplete } = mount()
    await waitFor(() => expect(get).toHaveBeenCalledTimes(1))
    expect(onComplete).not.toHaveBeenCalled()
    expect(screen.getByText(/32\.000/)).toBeInTheDocument()
    const qrBtn = await screen.findByRole('button', { name: 'Thanh toán bằng QR' })
    fireEvent.click(qrBtn)
    await waitFor(() => expect(send).toHaveBeenCalledWith('post', '/api/v1/payments/gate/final-link', { bookingId: 41 }))
    await waitFor(() => expect(payosConfig).toBeDefined())
    get.mockResolvedValueOnce({ ...booking, status: 'COMPLETED', finalPaymentMethod: 'PAYOS' })
    await act(async () => { payosConfig.onSuccess() })
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ amountDue: 0, bookingStatus: 'COMPLETED', finalPaymentMethod: 'PAYOS' })))
  })
  it('sends exactly the outstanding amount and completes only after cash acknowledgement', async () => {
    let resolve!: () => void
    send.mockImplementationOnce(() => new Promise<void>(done => { resolve = done }))
    const { onComplete } = mount()
    const cash = screen.getByRole('button', { name: /Đã nhận đủ tiền mặt/ })
    fireEvent.click(cash)
    await waitFor(() => expect(cash).toBeDisabled())
    fireEvent.click(cash)
    expect(send).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledWith('post', '/api/v1/merchant/confirm-cash', { bookingCode: 'BK-41', parkingLotId: 12, amount: 32000 })
    expect(onComplete).not.toHaveBeenCalled()
    await act(async () => resolve())
    await waitFor(() => expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ amountDue: 0, finalPaymentMethod: 'CASH' })))
  })
  it('does not accept another booking or report completion when the status query fails', async () => {
    get.mockResolvedValue({ ...booking, id: 99, status: 'COMPLETED' })
    const { onComplete } = mount()
    expect(await screen.findByText(/Kết quả không khớp/)).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()
  })
  it('disables cash after the server has accepted PayOS while completion is pending', async () => {
    get.mockResolvedValue({ ...booking, finalPaymentMethod: 'PAYOS' })
    const { onComplete } = mount()
    await waitFor(() => expect(screen.getByRole('button', { name: /Đã nhận đủ tiền mặt/ })).toBeDisabled())
    expect(onComplete).not.toHaveBeenCalled()
  })
  it('does not complete a dismissed session when an old status request resolves', async () => {
    let resolve!: (data: typeof booking) => void
    get.mockImplementationOnce(() => new Promise(done => { resolve = done }))
    const { unmount, onComplete } = mount()
    await waitFor(() => expect(get).toHaveBeenCalledTimes(1))
    unmount()
    await act(async () => resolve({ ...booking, status: 'COMPLETED' }))
    expect(onComplete).not.toHaveBeenCalled()
  })
})
