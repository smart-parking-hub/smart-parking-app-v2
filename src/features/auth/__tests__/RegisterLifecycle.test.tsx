import { StrictMode } from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { BANKS_QUERY_KEY } from '@/entities/bank/api/banks'
import { RegisterPage } from '../pages/RegisterPage'
import {
  hasProtectedRegistrationData,
  getRegistrationDefaults,
  cleanLegacyRegisterDraftStorage,
  LEGACY_REGISTER_DRAFT_KEY,
} from '../model/registrationLifecycle'

function NavigationHelper() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div>
      <div data-testid="current-location">{location.pathname + location.search + location.hash}</div>
      <button data-testid="nav-back" onClick={() => navigate(-1)}>Go back</button>
      <button
        data-testid="nav-second-link"
        onClick={() => navigate('/register?email=second@example.test&otpCode=111111&autoVerify=true')}
      >
        Receive second link
      </button>
      <button
        data-testid="nav-extra-query"
        onClick={() => navigate('/register?ref=partner&email=extra@example.test&otpCode=222222&autoVerify=true#faq')}
      >
        Receive link with extra query and hash
      </button>
    </div>
  )
}

function renderRegister(initialEntry = '/register', queryClient?: QueryClient, strict = false) {
  const client =
    queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

  const content = (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/register"
            element={
              <>
                <RegisterPage mode="register" />
                <NavigationHelper />
              </>
            }
          />
          <Route path="/login" element={<><div data-testid="login-page">Login Page</div><NavigationHelper /></>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )

  return render(strict ? <StrictMode>{content}</StrictMode> : content)
}

function fill(labelText: string | RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } })
}

function deferred() {
  let resolve!: (value: unknown) => void
  let reject!: (reason: Error) => void
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

const otpResponse = { data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }

async function completeInfo() {
  fill('Họ và tên', 'Review Person')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))
}

async function verifySentCode() {
  fill('Email nhận mã xác thực', 'current@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await screen.findByText('Mã xác thực đã được gửi')
  fill('Mã xác thực email (6 số)', '012345')
  await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
  await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
}

describe('SP-AUTH-REG-RESET-01: Registration Lifecycle & Role Switch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('Pure lifecycle helpers', () => {
    it('returns empty defaults for DRIVER and MERCHANT', () => {
      const driverDefaults = getRegistrationDefaults('DRIVER')
      expect(driverDefaults.role).toBe('DRIVER')
      expect(driverDefaults.fullName).toBe('')
      expect(driverDefaults.phone).toBe('')
      expect(driverDefaults.bankName).toBe('')
      expect(driverDefaults.bankAccountNum).toBe('')
      expect(driverDefaults.citizenId).toBe('')
      expect(driverDefaults.email).toBe('')
      expect(driverDefaults.otpCode).toBe('')
      expect(driverDefaults.password).toBe('')

      const merchantDefaults = getRegistrationDefaults('MERCHANT')
      expect(merchantDefaults.role).toBe('MERCHANT')
      expect(merchantDefaults.fullName).toBe('')
    })

    it('correctly detects protected data even if untrimmed or hidden', () => {
      expect(hasProtectedRegistrationData({})).toBe(false)
      expect(hasProtectedRegistrationData({ fullName: '' })).toBe(false)
      expect(hasProtectedRegistrationData({ fullName: ' ' })).toBe(true)
      expect(hasProtectedRegistrationData({ bankAccountNum: '123' })).toBe(true)
      expect(hasProtectedRegistrationData({}, { sent: true })).toBe(true)
      expect(hasProtectedRegistrationData({}, { isVerified: true })).toBe(true)
      expect(hasProtectedRegistrationData({}, { hasParamOtp: true })).toBe(true)
      expect(hasProtectedRegistrationData({}, { hasLinkOtp: true })).toBe(true)
    })

    it('safely cleans legacy draft storage without clearing other keys', () => {
      sessionStorage.setItem(LEGACY_REGISTER_DRAFT_KEY, '{"fullName":"Old"}')
      sessionStorage.setItem('other_key', 'keep_me')
      cleanLegacyRegisterDraftStorage()
      expect(sessionStorage.getItem(LEGACY_REGISTER_DRAFT_KEY)).toBeNull()
      expect(sessionStorage.getItem('other_key')).toBe('keep_me')
    })
  })

  describe('AC1 & AC2: Memory-only session and legacy draft isolation', () => {
    it('cleans up legacy draft on mount and starts completely blank', () => {
      sessionStorage.setItem(
        LEGACY_REGISTER_DRAFT_KEY,
        JSON.stringify({ fullName: 'Legacy User', phone: '0901234567', role: 'MERCHANT' }),
      )
      const removeSpy = vi.spyOn(Storage.prototype, 'removeItem')

      renderRegister()

      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('')
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      expect(removeSpy).toHaveBeenCalledWith(LEGACY_REGISTER_DRAFT_KEY)
      expect(sessionStorage.getItem(LEGACY_REGISTER_DRAFT_KEY)).toBeNull()
    })

    it('does not crash and deletes malformed JSON or unknown role in legacy draft', () => {
      sessionStorage.setItem(LEGACY_REGISTER_DRAFT_KEY, '{invalid-json')
      const first = renderRegister()
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(sessionStorage.getItem(LEGACY_REGISTER_DRAFT_KEY)).toBeNull()

      first.unmount()
      sessionStorage.setItem(
        LEGACY_REGISTER_DRAFT_KEY,
        JSON.stringify({ role: 'UNKNOWN_ROLE', fullName: 'Ghost' }),
      )
      renderRegister()
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(sessionStorage.getItem(LEGACY_REGISTER_DRAFT_KEY)).toBeNull()
    })

    it('operates normally in memory even if sessionStorage.removeItem throws', () => {
      vi.spyOn(sessionStorage, 'removeItem').mockImplementation(() => {
        throw new DOMException('SecurityError: Access is denied', 'SecurityError')
      })

      renderRegister()
      fill('Họ và tên', 'Normal Memory User')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Normal Memory User')
    })

    it('does not write registration inputs to sessionStorage or localStorage', () => {
      const setSessionSpy = vi.spyOn(sessionStorage, 'setItem')
      const setLocalSpy = vi.spyOn(localStorage, 'setItem')

      renderRegister()
      fill('Họ và tên', 'Memory Only')
      fill('Số điện thoại', '0901234567')

      expect(setSessionSpy).not.toHaveBeenCalledWith(LEGACY_REGISTER_DRAFT_KEY, expect.anything())
      expect(setLocalSpy).not.toHaveBeenCalledWith(LEGACY_REGISTER_DRAFT_KEY, expect.anything())
    })

    it('R3: pageshow.persisted resets to empty DRIVER and closes open confirmation dialog', async () => {
      renderRegister()
      fill('Họ và tên', 'Old Person')
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      expect(screen.getByRole('dialog')).toBeVisible()

      const event = new Event('pageshow')
      Object.defineProperty(event, 'persisted', { value: true })
      act(() => window.dispatchEvent(event))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
    })

    it('pageshow with persisted: false does not reset user inputs', async () => {
      renderRegister()
      fill('Họ và tên', 'Active Typing')
      const event = new Event('pageshow')
      Object.defineProperty(event, 'persisted', { value: false })
      act(() => window.dispatchEvent(event))
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Active Typing')
    })
  })

  describe('AC3: Immediate role change when form has no data', () => {
    it('switches DRIVER -> MERCHANT immediately without dialog when empty', async () => {
      renderRegister()
      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      expect(roleSelect).toHaveValue('DRIVER')
      expect(screen.getByText('Tiếp tục: Xác thực Email')).toBeInTheDocument()

      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('MERCHANT')
      expect(screen.getByText('Tiếp tục: Kết nối ngân hàng')).toBeInTheDocument()
      expect(screen.getByText('Ngân hàng')).toBeInTheDocument()
    })

    it('switches MERCHANT -> DRIVER immediately without dialog when empty', async () => {
      renderRegister()
      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')
      expect(roleSelect).toHaveValue('MERCHANT')

      await userEvent.selectOptions(roleSelect, 'DRIVER')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('DRIVER')
      expect(screen.getByText('Tiếp tục: Xác thực Email')).toBeInTheDocument()
      expect(screen.queryByText('Ngân hàng')).not.toBeInTheDocument()
    })

    it('is a no-op when re-selecting the current role', async () => {
      renderRegister()
      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'DRIVER')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('DRIVER')
    })

    it('switches immediately and clears red error if field was only blurred without text', async () => {
      renderRegister()
      const phoneInput = screen.getByLabelText('Số điện thoại')
      fireEvent.blur(phoneInput)

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('MERCHANT')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('AC4: Confirmation dialog when data is present', () => {
    it('opens confirmation dialog with required text when data is present', async () => {
      renderRegister()
      fill('Họ và tên', 'Nguyen Van A')

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeVisible()
      expect(screen.getByText('Đổi sang vai trò Chủ bãi?')).toBeVisible()
      expect(
        screen.getByText(
          'Thông tin đã nhập cho vai trò hiện tại sẽ bị xóa, bao gồm thông tin cá nhân, ngân hàng và xác thực email. Bạn cần nhập lại từ đầu.',
        ),
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Giữ vai trò hiện tại' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' })).toBeVisible()
    })

    it('cancels role change and preserves all data when clicking "Giữ vai trò hiện tại"', async () => {
      renderRegister()
      fill('Họ và tên', 'Nguyen Van A')
      fill('Số điện thoại', '0901234567')

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      await userEvent.click(screen.getByRole('button', { name: 'Giữ vai trò hiện tại' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyen Van A')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0901234567')
    })

    it('cancels role change on close button', async () => {
      renderRegister()
      fill('Họ và tên', 'Nguyen Van A')

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeVisible()

      // Click Close button
      await userEvent.click(screen.getByRole('button', { name: 'Đóng' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyen Van A')
    })

    it('cancels role change on backdrop click', async () => {
      renderRegister()
      fill('Họ và tên', 'Nguyen Van Backdrop')

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeVisible()

      // Click the dialog element itself to trigger backdrop click
      fireEvent.click(dialog)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyen Van Backdrop')
    })

    it('cancel preserves the entered merchant bank account number', async () => {
      renderRegister()
      // Start as MERCHANT
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      fill('Họ và tên', 'Merchant Deep')
      fill('Số điện thoại', '0901234567')
      fill('CCCD / CMND', '123456789012')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))

      fill('Số tài khoản ngân hàng', '9876543210')
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))

      // On info step, try switching to DRIVER
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')
      expect(screen.getByRole('dialog')).toBeVisible()

      // Cancel
      await userEvent.click(screen.getByRole('button', { name: 'Giữ vai trò hiện tại' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('MERCHANT')

      // Go forward to bank step: account number is still preserved!
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))
      expect(screen.getByLabelText('Số tài khoản ngân hàng')).toHaveValue('9876543210')
    })
  })

  describe('AC5: Confirmation resets all fields, errors, and memory (A -> B -> A)', () => {
    it('clears personal fields and announces the confirmed role change', async () => {
      renderRegister()
      fill('Họ và tên', 'Test Driver')
      fill('Số điện thoại', '0901234567')

      const roleSelect = screen.getByLabelText('Bạn tham gia với vai trò')
      await userEvent.selectOptions(roleSelect, 'MERCHANT')

      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(roleSelect).toHaveValue('MERCHANT')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('')
      expect(screen.getByText('Đã chuyển sang Chủ bãi. Vui lòng nhập thông tin đăng ký mới.')).toBeInTheDocument()
    })

    it('does not retain cached draft when switching A -> B -> A', async () => {
      renderRegister()
      // Step A: DRIVER with Name A
      fill('Họ và tên', 'Driver Name A')
      fill('Số điện thoại', '0901111111')

      // Switch to B: MERCHANT
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')

      // Fill Name B
      fill('Họ và tên', 'Merchant Name B')
      fill('Số điện thoại', '0902222222')

      // Switch back to A: DRIVER
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      // A must be empty, NOT restored to Driver Name A!
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('')
    })

    it('confirm role change clears the send notice and resend timer', async () => {
      vi.spyOn(apiClient, 'request').mockResolvedValue({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      renderRegister()
      fill('Họ và tên', 'Full Step Driver')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'full@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await screen.findByText('Mã xác thực đã được gửi')

      // Go back to info and change role to MERCHANT
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      expect(screen.getByRole('dialog')).toBeVisible()

      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('MERCHANT')
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('')
      expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Gửi lại sau/ })).not.toBeInTheDocument()
    })
  })

  describe('AC6: Back/Next within the same role preserves memory without extra API calls', () => {
    it('preserves data across step navigation without firing requests', async () => {
      const requestSpy = vi.spyOn(apiClient, 'request')
      renderRegister()

      fill('Họ và tên', 'Test Driver')
      fill('Số điện thoại', '0901234567')

      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      expect(screen.getByLabelText('Email nhận mã xác thực')).toBeVisible()

      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))

      expect(screen.getByLabelText('Họ và tên')).toBeVisible()
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('Test Driver')
      expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0901234567')
      expect(requestSpy).not.toHaveBeenCalled()
    })
  })

  describe('AC7: Asynchronous generation guard ignores stale callbacks', () => {
    it('discards delayed send OTP response if role was reset while request was in-flight', async () => {
      let resolveOtp: (val: unknown) => void = () => {}
      const delayedOtpPromise = new Promise((resolve) => {
        resolveOtp = resolve
      })
      vi.spyOn(apiClient, 'request').mockReturnValue(delayedOtpPromise as never)

      renderRegister()
      fill('Họ và tên', 'Test Driver')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'driver@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))

      // Go back to info and switch role to MERCHANT (advances generation)
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      // Now late OTP response arrives from old generation
      await act(async () => {
        resolveOtp({
          data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60, email: 'driver@example.test' } },
        })
      })

      // The new session must remain at info step with NO stale sent notice
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('MERCHANT')
      expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
    })

    it('R2: delayed send from A cannot install cooldown after B has started a new send', async () => {
      let resolveOld!: (value: unknown) => void
      let rejectNew!: (reason: unknown) => void
      const request = vi.spyOn(apiClient, 'request')
      request.mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve }) as never)
      request.mockReturnValueOnce(new Promise((_resolve, reject) => { rejectNew = reject }) as never)

      renderRegister()
      fill('Họ và tên', 'Test Person')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'old@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')

      fill('Họ và tên', 'Test Person')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'new@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))

      // Late resolve of A with 777s cooldown
      await act(async () => {
        resolveOld({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 777 } } })
      })
      // Rejection of B
      await act(async () => {
        rejectNew(new Error('New send failed'))
      })

      await screen.findByText('New send failed')
      expect(screen.queryByRole('button', { name: /Gửi lại sau 77\ds/ })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Gửi mã qua email' })).toBeEnabled()
    })

    it('delayed send rejection from A after B started does not trigger error notice on B', async () => {
      let rejectOld!: (reason: unknown) => void
      let resolveNew!: (value: unknown) => void
      const request = vi.spyOn(apiClient, 'request')
      request.mockReturnValueOnce(new Promise((_resolve, reject) => { rejectOld = reject }) as never)
      request.mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve }) as never)

      renderRegister()
      fill('Họ và tên', 'Person One')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'first@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')

      fill('Họ và tên', 'Person Two')
      fill('Số điện thoại', '0907654321')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'second@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))

      // Reject A late
      await act(async () => {
        rejectOld(new Error('Old request failed'))
      })
      // Resolve B
      await act(async () => {
        resolveNew({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
      })

      expect(screen.queryByText('Old request failed')).not.toBeInTheDocument()
      expect(await screen.findByText('Mã xác thực đã được gửi')).toBeInTheDocument()
    })

    it('disables role changing while verify is pending', async () => {
      const requestSpy = vi.spyOn(apiClient, 'request')
      requestSpy.mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      requestSpy.mockReturnValueOnce(new Promise(() => {}) as never)

      renderRegister()
      fill('Họ và tên', 'Test Driver')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'driver@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await waitFor(() => expect(screen.getByText('Mã xác thực đã được gửi')).toBeVisible())

      fill('Mã xác thực email (6 số)', '123456')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))

      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toBeDisabled()
    })
  })

  describe('AC8: Single-intake Magic Link URL handling', () => {
    it('R1: non-auto magic link can verify its supplied code without sending a replacement', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: null } })
      renderRegister('/register?email=link@example.test&otpCode=012345')

      fill('Họ và tên', 'Test Person')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('link@example.test')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('012345')

      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() =>
        expect(request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/v1/auth/otp/verify',
            data: { email: 'link@example.test', otpCode: '012345' },
          }),
        ),
      )
      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
    })

    it('R1 alias: non-auto magic link with "otp" query parameter verifies on Continue', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: null } })
      renderRegister('/register?email=alias@example.test&otp=654321')

      fill('Họ và tên', 'Alias Person')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('alias@example.test')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('654321')

      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() =>
        expect(request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/v1/auth/otp/verify',
            data: { email: 'alias@example.test', otpCode: '654321' },
          }),
        ),
      )
    })

    it('R1 error: server rejection keeps user at email step with error message', async () => {
      vi.spyOn(apiClient, 'request').mockRejectedValue(new Error('Mã OTP đã hết hạn!'))
      renderRegister('/register?email=expired@example.test&otpCode=000000')

      fill('Họ và tên', 'Expired Person')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(await screen.findByText('Mã OTP đã hết hạn!')).toBeVisible()
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).not.toBeVisible()
    })

    it('R4: a second magic link on the same mounted route is consumed independently', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: null } })
      renderRegister('/register?email=first@example.test&otpCode=012345&autoVerify=true')

      await screen.findByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')

      await userEvent.click(screen.getByTestId('nav-second-link'))

      await waitFor(() =>
        expect(request).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/v1/auth/otp/verify',
            data: { email: 'second@example.test', otpCode: '111111' },
          }),
        ),
      )
    })

    it('R5: strict mode cold link mounts and verifies exactly once', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: null } })
      renderRegister('/register?email=strict@example.test&otpCode=012345&autoVerify=true', undefined, true)

      await screen.findByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')
      expect(screen.getByLabelText('Họ và tên')).toBeVisible()
      expect(request).toHaveBeenCalledTimes(1)
    })

    it('preserves non-sensitive query params and hash when cleaning URL params', async () => {
      vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { code: 'OTP_VERIFIED' } })
      renderRegister()

      await userEvent.click(screen.getByTestId('nav-extra-query'))

      await waitFor(() => {
        const locationText = screen.getByTestId('current-location').textContent ?? ''
        expect(locationText).toContain('ref=partner')
        expect(locationText).toContain('#faq')
        expect(locationText).not.toContain('email=')
        expect(locationText).not.toContain('otpCode=')
      })
    })

    it('clears magic link verified state when user subsequently confirms role change', async () => {
      vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { code: 'OTP_VERIFIED' } })

      renderRegister('/register?email=magic%40example.test&otpCode=998877&autoVerify=true')

      await waitFor(() =>
        expect(
          screen.getByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.'),
        ).toBeVisible(),
      )

      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      expect(screen.getByRole('dialog')).toBeVisible()

      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      expect(
        screen.queryByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.'),
      ).not.toBeInTheDocument()
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('MERCHANT')
    })
  })

  describe('AC9: Role payload isolation upon final submission', () => {
    it('DRIVER registration submits exact 3-step contract without bankName or bankAccountNum', async () => {
      const requestSpy = vi.spyOn(apiClient, 'request').mockResolvedValue({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })

      renderRegister()

      // Step 1: Info
      fill('Họ và tên', 'Driver Final Test')
      fill('Số điện thoại', '0901234567')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      // Step 2: Email
      fill('Email nhận mã xác thực', 'driver-final@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      fill('Mã xác thực email (6 số)', '123456')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))

      // Step 3: Password
      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
      fill('Mật khẩu', 'final-password')
      fill('Xác nhận mật khẩu', 'final-password')
      await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))

      await waitFor(() =>
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/v1/auth/register',
            data: {
              role: 'DRIVER',
              fullName: 'Driver Final Test',
              phone: '0901234567',
              citizenId: '',
              email: 'driver-final@example.test',
              otpCode: '123456',
              password: 'final-password',
            },
          }),
        ),
      )
      const registerCall = requestSpy.mock.calls.find((c) => c[0].url === '/api/v1/auth/register')
      expect(registerCall?.[0].data).not.toHaveProperty('bankName')
      expect(registerCall?.[0].data).not.toHaveProperty('bankAccountNum')
    })

    it('switching from MERCHANT with bank info to DRIVER isolates payload with no bank remnants', async () => {
      const requestSpy = vi.spyOn(apiClient, 'request').mockResolvedValue({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })

      renderRegister()
      // Start as MERCHANT
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      fill('Họ và tên', 'Old Merchant')
      fill('Số điện thoại', '0909999888')
      fill('CCCD / CMND', '079123456789')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))

      fill('Số tài khoản ngân hàng', '190399998888')
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))

      // Switch to DRIVER
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')
      expect(screen.getByRole('dialog')).toBeVisible()
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))

      // Enter clean DRIVER info
      fill('Họ và tên', 'New Driver Clean')
      fill('Số điện thoại', '0901112233')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))

      fill('Email nhận mã xác thực', 'new-driver@example.test')
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      fill('Mã xác thực email (6 số)', '654321')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))

      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
      fill('Mật khẩu', 'clean-pass123')
      fill('Xác nhận mật khẩu', 'clean-pass123')
      await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))

      await waitFor(() =>
        expect(requestSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/api/v1/auth/register',
            data: {
              role: 'DRIVER',
              fullName: 'New Driver Clean',
              phone: '0901112233',
              citizenId: '',
              email: 'new-driver@example.test',
              otpCode: '654321',
              password: 'clean-pass123',
            },
          }),
        ),
      )
      const registerCall = requestSpy.mock.calls.find((c) => c[0].url === '/api/v1/auth/register')
      expect(registerCall?.[0].data).not.toHaveProperty('bankName')
      expect(registerCall?.[0].data).not.toHaveProperty('bankAccountNum')
    })
  })

  describe('Round 2: RR1, RR2 and missing RR3 evidence', () => {
    it('RR1: editing and restoring a sent OTP requires fresh verification without resetting cooldown', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue(otpResponse)
      renderRegister()
      await completeInfo()
      await verifySentCode()
      await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      fill('Mã xác thực email (6 số)', '999999')
      fill('Mã xác thực email (6 số)', '012345')
      expect(screen.getByRole('button', { name: /Gửi lại sau/ })).toBeDisabled()
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() => expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(2))
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/send'))).toHaveLength(1)
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible()
    })

    it.each(['otpCode', 'otp'])('RR1: editing and restoring a link %s permanently discards eligibility', async param => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue(otpResponse)
      renderRegister(`/register?email=link@example.test&${param}=012345`)
      await completeInfo()
      fill('Mã xác thực email (6 số)', '999999')
      fill('Mã xác thực email (6 số)', '012345')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(request).not.toHaveBeenCalled()
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).not.toBeVisible()
      expect(screen.getByText('Vui lòng gửi mã OTP thành công đến email này trước khi tiếp tục.')).toBeVisible()
      await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await screen.findByText('Mã xác thực đã được gửi')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('')
      fill('Mã xác thực email (6 số)', '654321')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
    })

    it('RR1: changing email and restoring it does not restore link code or proof', async () => {
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue(otpResponse)
      renderRegister('/register?email=link@example.test&otpCode=012345&autoVerify=true')
      await screen.findByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')
      await completeInfo()
      fill('Email nhận mã xác thực', 'other@example.test')
      fill('Email nhận mã xác thực', 'link@example.test')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('')
      fill('Mã xác thực email (6 số)', '012345')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(request).toHaveBeenCalledTimes(1)
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).not.toBeVisible()
    })

    it.each(['Mã OTP đã hết hạn!', 'Dịch vụ xác thực tạm thời không khả dụng.'])('RR2: autoVerify shows visible server error: %s', async message => {
      vi.spyOn(apiClient, 'request').mockRejectedValue(new Error(message))
      renderRegister('/register?email=link@example.test&otpCode=012345&autoVerify=true')
      expect(await screen.findByRole('alert')).toHaveTextContent(message)
      expect(screen.getByLabelText('Họ và tên')).toBeVisible()
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Giữ vai trò hiện tại' }))
      expect(screen.getByRole('alert')).toHaveTextContent(message)
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
      expect(screen.queryByText(message)).not.toBeInTheDocument()
    })

    it.each(['email', 'code', 'resend'])('RR2: clears autoVerify error on %s and allows recovery', async action => {
      const request = vi.spyOn(apiClient, 'request').mockRejectedValueOnce(new Error('Expired link')).mockResolvedValue(otpResponse)
      renderRegister('/register?email=link@example.test&otpCode=012345&autoVerify=true')
      await screen.findByText('Expired link')
      await completeInfo()
      if (action === 'email') fill('Email nhận mã xác thực', 'updated@example.test')
      if (action === 'code') fill('Mã xác thực email (6 số)', '999999')
      if (action === 'resend') await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      expect(screen.queryByText('Expired link')).not.toBeInTheDocument()
      if (action !== 'resend') await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
      await screen.findByText('Mã xác thực đã được gửi')
      fill('Mã xác thực email (6 số)', '654321')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(2)
    })

    it.each([
      { outcome: 'resolve', order: 'before B' }, { outcome: 'reject', order: 'before B' },
      { outcome: 'resolve', order: 'after B' }, { outcome: 'reject', order: 'after B' },
    ])('RR2/RR3: stale verify A $outcome $order cannot change B proof or errors', async ({ outcome, order }) => {
      const old = deferred()
      const current = deferred()
      const request = vi.spyOn(apiClient, 'request').mockReturnValueOnce(old.promise as never).mockReturnValueOnce(current.promise as never)
      renderRegister('/register?email=first@example.test&otpCode=012345&autoVerify=true')
      await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
      await userEvent.click(screen.getByTestId('nav-second-link'))
      await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
      if (order === 'after B') await act(async () => current.resolve(otpResponse))
      await act(async () => {
        if (outcome === 'resolve') old.resolve(otpResponse)
        else old.reject(new Error('Stale A verification failed'))
      })
      if (order === 'before B') {
        expect(screen.queryByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')).not.toBeInTheDocument()
        expect(screen.getByLabelText('Bạn tham gia với vai trò')).toBeDisabled()
        await act(async () => current.resolve(otpResponse))
      }
      await screen.findByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')
      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('second@example.test')
      expect(screen.queryByText('Stale A verification failed')).not.toBeInTheDocument()
      await completeInfo()
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
      expect(request).toHaveBeenCalledTimes(2)
    })

    it.each(['resolve', 'reject'])('RR3: stale verify %s after pageshow reset cannot restore data, errors or proof', async outcome => {
      const old = deferred()
      const request = vi.spyOn(apiClient, 'request').mockReturnValue(old.promise as never)
      renderRegister('/register?email=old@example.test&otpCode=012345&autoVerify=true')
      await waitFor(() => expect(request).toHaveBeenCalledTimes(1))
      const event = new Event('pageshow')
      Object.defineProperty(event, 'persisted', { value: true })
      act(() => window.dispatchEvent(event))
      await act(async () => {
        if (outcome === 'resolve') old.resolve(otpResponse)
        else old.reject(new Error('Old verification error'))
      })
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toHaveValue('DRIVER')
      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('')
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.queryByText(/Email đã được xác thực qua liên kết/)).not.toBeInTheDocument()
      await completeInfo()
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).not.toBeVisible()
      expect(request).toHaveBeenCalledTimes(1)
    })

    it('RR2: a new link clears a visible autoVerify error and verifies the new code once', async () => {
      const request = vi.spyOn(apiClient, 'request').mockRejectedValueOnce(new Error('Expired first link')).mockResolvedValue(otpResponse)
      renderRegister('/register?email=old@example.test&otpCode=012345&autoVerify=true')
      await screen.findByText('Expired first link')
      await userEvent.click(screen.getByTestId('nav-second-link'))
      await screen.findByText('Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.')
      expect(screen.queryByText('Expired first link')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('second@example.test')
      expect(request).toHaveBeenCalledTimes(2)
    })

    it.each(['resolve', 'reject'] as const)('RR3: submit pending locks role, prevents duplicate requests and handles queued link on %s', async outcome => {
      const registration = deferred()
      const request = vi.spyOn(apiClient, 'request').mockImplementation(config =>
        config.url === '/api/v1/auth/register' ? registration.promise as never : Promise.resolve(otpResponse))
      renderRegister()
      await completeInfo()
      await verifySentCode()
      fill('Mật khẩu', 'current-password')
      fill('Xác nhận mật khẩu', 'current-password')
      await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
      expect(screen.getByLabelText('Bạn tham gia với vai trò')).toBeDisabled()
      expect(document.getElementById('auth-role-trigger')).toBeDisabled()
      const formElement = screen.getByLabelText('Mật khẩu', { exact: true }).closest('form')!
      fireEvent.submit(formElement)
      fireEvent.submit(formElement)
      await userEvent.click(screen.getByTestId('nav-second-link'))
      await waitFor(() => expect(screen.getByTestId('current-location')).toHaveTextContent('/register'))
      expect(screen.getByTestId('current-location')).not.toHaveTextContent('otpCode')
      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('current@example.test')
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).toHaveValue('current-password')
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/register'))).toHaveLength(1)
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(1)
      expect(request.mock.calls.find(([c]) => c.url?.endsWith('/register'))?.[0].data).toEqual({
        role: 'DRIVER', fullName: 'Review Person', phone: '0901234567', citizenId: '',
        email: 'current@example.test', otpCode: '012345', password: 'current-password',
      })
      await act(async () => {
        if (outcome === 'resolve') registration.resolve(otpResponse)
        else registration.reject(new Error('Registration temporarily unavailable'))
      })
      if (outcome === 'resolve') {
        await screen.findByRole('heading', { name: /Đăng ký thành công/i })
        expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(1)
      } else {
        await waitFor(() => expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('second@example.test'))
        await waitFor(() => expect(screen.getByLabelText('Mật khẩu', { exact: true })).toBeVisible())
        expect(screen.getByLabelText('Mật khẩu', { exact: true })).toHaveValue('')
        expect(screen.getByLabelText('Xác nhận mật khẩu')).toHaveValue('')
        expect(screen.queryByText('Registration temporarily unavailable')).not.toBeInTheDocument()
        expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(2)
      }
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/register'))).toHaveLength(1)
    })

    it('RR3: cancel preserves deep merchant fields, errors, visibility, cooldown and proof; confirm clears them and retains bank catalog', async () => {
      const bank = { name: 'Review Bank Full', shortName: 'Review Bank', bin: '970436', code: 'VCB', logo: 'https://example.test/bank.png' }
      const cache = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
      cache.setQueryData(BANKS_QUERY_KEY, [bank])
      const request = vi.spyOn(apiClient, 'request').mockResolvedValue(otpResponse)
      renderRegister('/register', cache)
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      fill('Họ và tên', 'Old Merchant')
      fill('Số điện thoại', '0901234567')
      fill('CCCD / CMND', '012345678901')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))
      fill('Tên ngân hàng', 'Review Bank')
      fill('Số tài khoản ngân hàng', '0123456789')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))
      await verifySentCode()
      fill('Mật khẩu', 'old-password')
      fill('Xác nhận mật khẩu', 'mismatch')
      fireEvent.blur(screen.getByLabelText('Xác nhận mật khẩu'))
      await screen.findByText('Mật khẩu xác nhận không khớp.')
      await userEvent.click(screen.getByRole('button', { name: /^Hiện mật khẩu$/ }))
      const backToInfo = async () => {
        for (let i = 0; i < 3; i++) await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
      }
      await backToInfo()
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')
      await userEvent.click(screen.getByRole('button', { name: 'Giữ vai trò hiện tại' }))
      await waitFor(() => expect(document.getElementById('auth-role-trigger')).toHaveFocus())
      expect(screen.getByLabelText('Tên ngân hàng')).toHaveValue('Review Bank')
      expect(screen.getByLabelText('Số tài khoản ngân hàng')).toHaveValue('0123456789')
      expect(screen.getByLabelText('Email nhận mã xác thực')).toHaveValue('current@example.test')
      expect(screen.getByLabelText('Mã xác thực email (6 số)')).toHaveValue('012345')
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).toHaveAttribute('type', 'text')
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).toHaveValue('old-password')
      expect(screen.getByLabelText('Xác nhận mật khẩu')).toHaveValue('mismatch')
      expect(screen.getByLabelText('Xác nhận mật khẩu')).toHaveAttribute('aria-invalid', 'true')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))
      expect(screen.getByRole('button', { name: /Gửi lại sau/ })).toBeDisabled()
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(screen.getByText('Mật khẩu xác nhận không khớp.')).toBeVisible()
      expect(request.mock.calls.filter(([c]) => c.url?.endsWith('/otp/verify'))).toHaveLength(1)
      await backToInfo()
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'DRIVER')
      await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
      await waitFor(() => expect(screen.getByLabelText('Họ và tên')).toHaveFocus())
      for (const label of ['Họ và tên', 'Số điện thoại', 'CCCD / CMND', 'Email nhận mã xác thực', 'Mã xác thực email (6 số)', 'Mật khẩu', 'Xác nhận mật khẩu']) {
        expect(screen.getByLabelText(label, { exact: true })).toHaveValue('')
      }
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).toHaveAttribute('type', 'password')
      expect(screen.getByLabelText('Xác nhận mật khẩu')).toHaveAttribute('aria-invalid', 'false')
      expect(screen.queryByText('Mật khẩu xác nhận không khớp.')).not.toBeInTheDocument()
      await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
      expect(screen.getByLabelText('Tên ngân hàng')).toHaveValue('')
      expect(screen.getByLabelText('Số tài khoản ngân hàng')).toHaveValue('')
      expect(screen.getByLabelText('Tên ngân hàng').parentElement?.querySelector('img')).toBeNull()
      expect(cache.getQueryData(BANKS_QUERY_KEY)).toEqual([bank])
      fill('Họ và tên', 'New Merchant')
      fill('Số điện thoại', '0907654321')
      fill('CCCD / CMND', '987654321012')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))
      fill('Tên ngân hàng', 'Review Bank')
      fill('Số tài khoản ngân hàng', '9988776655')
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))
      expect(screen.getByRole('button', { name: 'Gửi mã qua email' })).toBeEnabled()
      await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
      expect(screen.getByLabelText('Mật khẩu', { exact: true })).not.toBeVisible()
      await verifySentCode()
      fill('Mật khẩu', 'new-password')
      fill('Xác nhận mật khẩu', 'new-password')
      await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
      await screen.findByRole('heading', { name: /Đăng ký thành công/i })
      expect(request.mock.calls.find(([c]) => c.url?.endsWith('/register'))?.[0].data).toEqual({
        role: 'MERCHANT', fullName: 'New Merchant', phone: '0907654321', citizenId: '987654321012',
        bankName: 'Review Bank', bankAccountNum: '9988776655', email: 'current@example.test',
        otpCode: '012345', password: 'new-password',
      })
    })
  })

  describe('AC11: Navigation and bank catalog preservation', () => {
    it('navigating away to /login and back to /register presents a clean session', async () => {
      renderRegister()
      fill('Họ và tên', 'Temporary User')

      await userEvent.click(screen.getByRole('link', { name: 'Đăng nhập' }))
      expect(screen.getByTestId('login-page')).toBeInTheDocument()

      await userEvent.click(screen.getByTestId('nav-back'))
      expect(screen.getByLabelText('Họ và tên')).toHaveValue('')
    })
  })
})
