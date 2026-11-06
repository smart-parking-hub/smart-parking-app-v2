import { Provider } from 'react-redux'
import { store } from '@/app/store'
import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getData, sendData } from '@/shared/api/resources'
import { MerchantScannerPage } from './ScannerPage'
import { MerchantWithdrawalsPage } from './FinancePages'
import { RequireRole, sessionRole } from '@/features/auth'
import { DecisionDialog } from '@/features/admin'
import { DisputesPage } from '@/features/disputes'
import { vehicleTypes } from '@/entities/operations'
import { MerchantLotPage } from './LotPages'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
  sendData: vi.fn(),
}))
const get = vi.mocked(getData)
const send = vi.mocked(sendData)
function show(children: ReactNode, route = '/') {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <Provider store={store}><MemoryRouter initialEntries={[route]}>{children}</MemoryRouter></Provider>
    </QueryClientProvider>,
  )
}
const page = {
  content: [{ id: 12, name: 'Bãi kiểm thử' }],
  totalPages: 1,
  totalElements: 1,
}
function token(role: string, exp = Math.floor(Date.now() / 1000) + 300) {
  return `test.${btoa(JSON.stringify({ role, exp }))}.signature`
}
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
  }
})
beforeEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
  get.mockResolvedValue(page)
})
afterEach(cleanup)
describe('Session and role access', () => {
  it('rejects missing, malformed and expired sessions', () => {
    expect(sessionRole()).toBeNull()
    localStorage.setItem('access_token', 'broken')
    expect(sessionRole()).toBeNull()
    localStorage.setItem('access_token', token('ROLE_ADMIN', 1))
    expect(sessionRole()).toBeNull()
  })
  it('reads the backend ROLE_ claim', () => {
    localStorage.setItem('access_token', token('ROLE_MERCHANT'))
    expect(sessionRole()).toBe('MERCHANT')
  })
  it('redirects a driver away from admin screens', async () => {
    localStorage.setItem('access_token', token('ROLE_DRIVER'))
    show(
      <Routes>
        <Route
          path="/"
          element={
            <RequireRole role="ADMIN">
              <p>Secret admin</p>
            </RequireRole>
          }
        />
        <Route path="/403" element={<p>Access denied</p>} />
      </Routes>,
    )
    expect(await screen.findByText('Access denied')).toBeInTheDocument()
    expect(screen.queryByText('Secret admin')).not.toBeInTheDocument()
  })
})
describe('Gate settlement contract', () => {
  it('sends both lot and booking code when checking in', async () => {
    send.mockResolvedValue(null)
    show(<MerchantScannerPage />)
    await screen.findByText('Bãi kiểm thử')
    fireEvent.change(screen.getByLabelText('Bãi kiểm soát'), {
      target: { value: '12' },
    })
    fireEvent.change(screen.getByLabelText('Mã đặt chỗ / Nội dung QR'), {
      target: { value: 'BK-001' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận xe vào bãi' }))
    await waitFor(() =>
      expect(send).toHaveBeenCalledWith('post', '/api/v1/merchant/check-in', {
        parkingLotId: 12,
        bookingCode: 'BK-001',
      }),
    )
    expect(
      await screen.findByText('Xe đã được ghi nhận vào bãi.'),
    ).toBeInTheDocument()
  })
  it('does not confirm cash until the attendant explicitly confirms settlement', async () => {
    send
      .mockResolvedValueOnce({
        bookingCode: 'BK-001',
        totalAmount: 200000,
        advanceDeposit: 50000,
        amountDue: 150000,
        parkingMinutes: 180,
        bookingStatus: 'AWAITING_FINAL_PAYMENT',
      })
      .mockResolvedValueOnce(null)
    show(<MerchantScannerPage />, '/?code=BK-001&lot=12')
    await screen.findByText('Bãi kiểm thử')
    fireEvent.click(screen.getByRole('button', { name: 'XE RA' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Kiểm tra & quyết toán xe ra' }),
    )
    expect(await screen.findByText('Quyết toán lượt đỗ')).toBeInTheDocument()
    expect(send).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: /Đã nhận đủ tiền mặt/ }))
    await waitFor(() =>
      expect(send).toHaveBeenLastCalledWith(
        'post',
        '/api/v1/merchant/confirm-cash',
        { bookingCode: 'BK-001', parkingLotId: 12 },
      ),
    )
  })
  it('surfaces backend errors without marking a vehicle admitted', async () => {
    send.mockRejectedValue(new Error('Vé đã hết hạn'))
    show(<MerchantScannerPage />, '/?code=BK-001&lot=12')
    await screen.findByText('Bãi kiểm thử')
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận xe vào bãi' }))
    expect(await screen.findByText('Vé đã hết hạn')).toBeInTheDocument()
    expect(
      screen.queryByText('Xe đã được ghi nhận vào bãi.'),
    ).not.toBeInTheDocument()
  })
})
describe('Finance, disputes and lot configuration', () => {
  it('requires a reason before submitting an admin decision and shows server rejection', async () => {
    send.mockRejectedValue(new Error('Yêu cầu đã được xử lý'))
    show(
      <DecisionDialog
        decision={{
          title: 'Duyệt chi',
          path: '/api/v1/admin/withdrawals/4/approve',
        }}
        onClose={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận quyết định' }))
    expect(
      await screen.findByText('Nhập lý do quyết định.'),
    ).toBeInTheDocument()
    expect(send).not.toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('Lý do / ghi chú quyết định'), {
      target: { value: 'Đã đối chiếu ngân hàng' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận quyết định' }))
    expect(await screen.findByText('Yêu cầu đã được xử lý')).toBeInTheDocument()
  })
  it('keeps withdrawal unavailable when wallet cannot load', async () => {
    get.mockRejectedValue(new Error('Ví tạm thời không khả dụng'))
    show(<MerchantWithdrawalsPage />)
    expect(
      await screen.findAllByText('Ví tạm thời không khả dụng'),
    ).toHaveLength(2)
    expect(
      screen.getByRole('button', { name: '+ Yêu cầu rút tiền' }),
    ).toBeDisabled()
  })
  it('disables withdrawal button with explanation when wallet balance < 50000', async () => {
    get.mockImplementation(async (url) => {
      if (url === '/api/v1/merchant/revenue') {
        return {
          currentWalletBalance: 20000,
          totalNetRevenue: 20000,
          minWithdrawalAmount: 50000,
          totalGrossRevenue: 22000,
          totalPlatformFee: 2000,
          completedBookings: 1,
        }
      }
      return page
    })
    show(<MerchantWithdrawalsPage />)
    await screen.findByText('Số dư khả dụng')
    const btn = await screen.findByRole('button', { name: '+ Yêu cầu rút tiền' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('title', expect.stringContaining('50.000'))
    expect(await screen.findByText(/chưa đạt hạn mức tối thiểu/i)).toBeInTheDocument()
  })
  it('enables withdrawal button when wallet balance >= 50000 and opens dialog with quick select', async () => {
    get.mockImplementation(async (url) => {
      if (url === '/api/v1/merchant/revenue') {
        return {
          currentWalletBalance: 500000,
          totalNetRevenue: 500000,
          minWithdrawalAmount: 50000,
          totalGrossRevenue: 550000,
          totalPlatformFee: 50000,
          completedBookings: 10,
        }
      }
      if (url === '/api/v1/merchant/profile') {
        return {
          bankName: 'Vietcombank',
          bankAccountNum: '0123456789',
          fullName: 'NGUYEN VAN TEST',
        }
      }
      return page
    })
    send.mockResolvedValue(null)
    show(<MerchantWithdrawalsPage />)
    await screen.findByText('Số dư khả dụng')
    const btn = await screen.findByRole('button', { name: '+ Yêu cầu rút tiền' })
    expect(btn).not.toBeDisabled()
    fireEvent.click(btn)

    expect(await screen.findByText('Tạo yêu cầu rút tiền')).toBeInTheDocument()
    const minBtn = screen.getByRole('button', { name: /Tối thiểu/i })
    fireEvent.click(minBtn)
    expect(screen.getByLabelText('Số tiền rút (VND)')).toHaveValue(50000)

    const maxBtn = screen.getByRole('button', { name: /Toàn bộ/i })
    fireEvent.click(maxBtn)
    expect(screen.getByLabelText('Số tiền rút (VND)')).toHaveValue(500000)

    fireEvent.change(screen.getByLabelText('Ngân hàng nhận'), {
      target: { value: 'Vietcombank' },
    })
    fireEvent.change(screen.getByLabelText('Số tài khoản thụ hưởng'), {
      target: { value: '0123456789' },
    })
    fireEvent.change(screen.getByLabelText('Tên chủ tài khoản'), {
      target: { value: 'NGUYEN VAN TEST' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu phê duyệt' }))
    await waitFor(() =>
      expect(send).toHaveBeenCalledWith('post', '/api/v1/withdrawals', {
        amount: 500000,
        bankName: 'Vietcombank',
        bankAccountNumber: '0123456789',
        accountHolderName: 'NGUYEN VAN TEST',
      }),
    )
  })
  it('renders a driver complaint list with an empty state', async () => {
    get.mockResolvedValue({ ...page, content: [], totalElements: 0 })
    show(<DisputesPage role="driver" />)
    expect(
      await screen.findByText('Không có dữ liệu phù hợp.'),
    ).toBeInTheDocument()
    expect(get).toHaveBeenCalledWith('/api/v1/disputes/me', {
      page: 0,
      size: 20,
    })
  })
  it('preserves all five vehicle types and submits the real pricing contract', async () => {
    get.mockResolvedValue({
      id: 12,
      name: 'Bãi',
      status: 'APPROVED',
      slots: [],
      pricingRules: [],
    })
    send.mockResolvedValue(null)
    show(
      <Routes>
        <Route path="/lots/:id" element={<MerchantLotPage mode="pricing" />} />
      </Routes>,
      '/lots/12',
    )
    await screen.findByText('Biểu phí cho 5 loại phương tiện')
    expect(screen.getAllByLabelText('Giá giờ (VND)')).toHaveLength(5)
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    await waitFor(() => expect(send).toHaveBeenCalled())
    expect(send.mock.calls[0][1]).toBe(
      '/api/v1/merchant/parking-lots/12/pricing/bulk',
    )
    expect(send.mock.calls[0][2]).toEqual({
      pricingRules: vehicleTypes.map((vehicleType) => ({
        vehicleType,
        basePricePerHour: 10000,
        surgeMultiplier: 1,
        surgeStartTime: null,
        surgeEndTime: null,
        overtimePenaltyMultiplier: 1,
      })),
    })
  })
  it('enforces occupied invariant and right-aligned input in SlotEditor', async () => {
    get.mockResolvedValue({
      id: 12,
      name: 'Bãi kiểm thử sức chứa',
      status: 'APPROVED',
      slots: [
        { id: 1, vehicleType: 'CONTAINER', totalCapacity: 30, availableCapacity: 5 },
      ],
      pricingRules: [],
    })
    send.mockResolvedValue(null)
    show(
      <Routes>
        <Route path="/lots/:id" element={<MerchantLotPage mode="slots" />} />
      </Routes>,
      '/lots/12',
    )
    await screen.findByText('Phân bổ chỗ đỗ')
    expect(await screen.findByText(/Đang đỗ thực tế:/i)).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    const containerInput = screen.getByLabelText(/Tổng sức chứa \(min: 25\)/i)
    expect(containerInput).toHaveAttribute('min', '25')
  })
  it('prevents duplicate submissions in pricing editor while request is pending', async () => {
    let resolveMutation!: (value: null) => void
    const pendingPromise = new Promise<null>((resolve) => {
      resolveMutation = resolve
    })
    get.mockResolvedValue({
      id: 12,
      name: 'Bãi',
      status: 'APPROVED',
      slots: [],
      pricingRules: [],
    })
    send.mockReturnValue(pendingPromise)
    show(
      <Routes>
        <Route path="/lots/:id" element={<MerchantLotPage mode="pricing" />} />
      </Routes>,
      '/lots/12',
    )
    await screen.findByText('Biểu phí cho 5 loại phương tiện')
    const submitBtn = screen.getByRole('button', { name: 'Lưu thay đổi' })
    fireEvent.click(submitBtn)
    await waitFor(() => expect(submitBtn).toBeDisabled())
    expect(submitBtn).toHaveTextContent(/Đang lưu/i)
    fireEvent.click(submitBtn)
    expect(send).toHaveBeenCalledTimes(1)
    resolveMutation(null)
    await waitFor(() =>
      expect(screen.getByText('Đã lưu cấu hình thành công.')).toBeInTheDocument(),
    )
  })
})
