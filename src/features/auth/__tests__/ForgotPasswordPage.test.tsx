import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { AuthPage } from '../index'
import { LoginPage } from '../pages/LoginPage'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import authReducer from '../model/authSlice'

function LocationProbe() {
  const location = useLocation()
  return (
    <div data-testid="location-probe">
      {location.pathname}
      {location.search}
    </div>
  )
}

function setupApp(initialEntry = '/forgot-password') {
  const store = configureStore({ reducer: { auth: authReducer } })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  })

  const view = render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationProbe />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/forgot-password" element={<AuthPage mode="forgot" />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>,
  )

  return { store, queryClient, ...view }
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.restoreAllMocks()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('SCR-012 ForgotPasswordPage (Khôi phục mật khẩu qua OTP)', () => {
  it('AC1 & AC9: renders public route via AuthLayout recovery shell, links from LoginPage, makes no API call on mount, and omits simulator/demo data', async () => {
    const requestSpy = vi.spyOn(apiClient, 'request')
    setupApp('/login')

    const forgotLink = screen.getByRole('link', { name: 'Quên mật khẩu?' })
    expect(forgotLink).toHaveAttribute('href', '/forgot-password')
    fireEvent.click(forgotLink)

    expect(await screen.findByRole('heading', { name: 'Khôi Phục Mật Khẩu' })).toBeInTheDocument()
    expect(screen.getByTestId('location-probe')).toHaveTextContent('/forgot-password')
    expect(requestSpy).not.toHaveBeenCalled()

    const emailInput = screen.getByLabelText(/Email nhận mã xác thực/i)
    expect(emailInput).toHaveValue('')
    expect(screen.queryByText(/TEST SCENARIOS/i)).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue(/dispatch\.ops@vietlogistics/i)).not.toBeInTheDocument()
    expect(screen.queryByDisplayValue('984120')).not.toBeInTheDocument()
    expect(screen.queryByText(/ISO\/IEC 27001/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/AES-256-GCM/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/1900 6886/i)).not.toBeInTheDocument()
  })

  it('AC2: validates blank, invalid and >100 char emails, normalizes email before sending, and stays on Step 1 when send fails', async () => {
    const requestSpy = vi.spyOn(apiClient, 'request')
    setupApp('/forgot-password')

    const emailInput = screen.getByLabelText(/Email nhận mã xác thực/i)
    const sendBtn = screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i })

    // Blank / spaces only
    fireEvent.change(emailInput, { target: { value: '    ' } })
    fireEvent.click(sendBtn)
    expect(await screen.findByRole('alert')).toHaveTextContent('Vui lòng nhập địa chỉ email.')
    expect(requestSpy).not.toHaveBeenCalled()

    // Invalid format
    fireEvent.change(emailInput, { target: { value: 'invalid-email-format' } })
    fireEvent.click(sendBtn)
    expect(await screen.findByRole('alert')).toHaveTextContent('Địa chỉ email không đúng định dạng.')
    expect(requestSpy).not.toHaveBeenCalled()

    // Over 100 chars
    const longEmail = `${'a'.repeat(90)}@example.com`
    fireEvent.change(emailInput, { target: { value: longEmail } })
    fireEvent.click(sendBtn)
    expect(await screen.findByRole('alert')).toHaveTextContent('Email không được vượt quá 100 ký tự.')
    expect(requestSpy).not.toHaveBeenCalled()

    // API failure keeps Step 1 active
    requestSpy.mockRejectedValueOnce(new Error('Dịch vụ gửi thư tạm thời gián đoạn.'))
    fireEvent.change(emailInput, { target: { value: '  Driver.User@Example.COM  ' } })
    fireEvent.click(sendBtn)

    expect(await screen.findByText('Dịch vụ gửi thư tạm thời gián đoạn.')).toBeInTheDocument()
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/v1/auth/forgot-password/otp',
        data: { email: 'driver.user@example.com' },
      }),
    )
    expect(screen.queryByLabelText(/Mã OTP xác thực/i)).not.toBeInTheDocument()

    // Retry succeeds and transitions to Step 2 with generic message
    requestSpy.mockResolvedValueOnce({
      data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
    })
    fireEvent.click(screen.getByRole('button', { name: /Thử gửi lại/i }))

    expect(
      await screen.findByText(/Nếu email đã đăng ký, mã OTP 6 chữ số đã được gửi tới:/i),
    ).toBeInTheDocument()
    expect(screen.getByText('driver.user@example.com')).toBeInTheDocument()
  })

  it('AC3: validates OTP (6 digits, preserves leading zero), password (exact 6, exact 50, non-blank, untrimmed) and confirmation match, and omits confirmPassword from payload', async () => {
    const requestSpy = vi
      .spyOn(apiClient, 'request')
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockRejectedValueOnce(new Error('Thử lại với mật khẩu 50 ký tự'))
      .mockRejectedValueOnce(new Error('Thử lại với khoảng trắng hai đầu'))
      .mockResolvedValueOnce({
        data: { data: null },
      })

    setupApp('/forgot-password')

    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    const otpInput = await screen.findByLabelText(/Mã OTP xác thực/i)
    const newPasswordInput = screen.getByLabelText(/^Mật khẩu mới/i)
    const confirmInput = screen.getByLabelText(/^Xác nhận mật khẩu/i)
    const resetBtn = screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i })

    // Invalid OTP (5 digits) and short password (5 chars)
    fireEvent.change(otpInput, { target: { value: '01234' } })
    fireEvent.change(newPasswordInput, { target: { value: '12345' } })
    fireEvent.change(confirmInput, { target: { value: '12345' } })
    fireEvent.click(resetBtn)

    expect(await screen.findByText('Mã OTP phải gồm đúng 6 chữ số.')).toBeInTheDocument()
    expect(screen.getByText('Mật khẩu mới phải có từ 6 đến 50 ký tự.')).toBeInTheDocument()
    expect(requestSpy).toHaveBeenCalledTimes(1)

    // Non-digit OTP and > 50 chars password
    const password51 = 'p'.repeat(51)
    fireEvent.change(otpInput, { target: { value: '12345a' } })
    fireEvent.change(newPasswordInput, { target: { value: password51 } })
    fireEvent.change(confirmInput, { target: { value: password51 } })
    fireEvent.click(resetBtn)

    expect(await screen.findByText('Mã OTP phải gồm đúng 6 chữ số.')).toBeInTheDocument()
    expect(screen.getByText('Mật khẩu mới phải có từ 6 đến 50 ký tự.')).toBeInTheDocument()
    expect(requestSpy).toHaveBeenCalledTimes(1)

    // Blank spaces password (6 spaces)
    fireEvent.change(otpInput, { target: { value: '012345' } })
    fireEvent.change(newPasswordInput, { target: { value: '      ' } })
    fireEvent.change(confirmInput, { target: { value: '      ' } })
    fireEvent.click(resetBtn)

    expect(await screen.findByText('Mật khẩu mới không được chỉ gồm khoảng trắng.')).toBeInTheDocument()
    expect(requestSpy).toHaveBeenCalledTimes(1)

    // Mismatched confirm password
    fireEvent.change(newPasswordInput, { target: { value: '123456' } })
    fireEvent.change(confirmInput, { target: { value: '123457' } })
    fireEvent.click(resetBtn)

    expect(await screen.findByText('Xác nhận mật khẩu mới không trùng khớp.')).toBeInTheDocument()
    expect(requestSpy).toHaveBeenCalledTimes(1)

    // Exact 6-char boundary password succeeds validation and sends payload
    const password6 = 'Abc123'
    fireEvent.change(otpInput, { target: { value: '007890' } })
    fireEvent.change(newPasswordInput, { target: { value: password6 } })
    fireEvent.change(confirmInput, { target: { value: password6 } })
    fireEvent.click(resetBtn)

    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(2))
    expect(requestSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/v1/auth/forgot-password/reset',
        data: {
          email: 'test@example.com',
          otpCode: '007890',
          newPassword: password6,
        },
      }),
    )
    expect(await screen.findByText('Thử lại với mật khẩu 50 ký tự')).toBeInTheDocument()

    // Exact 50-char boundary password succeeds validation and sends payload
    const password50 = 'P'.repeat(50)
    fireEvent.change(newPasswordInput, { target: { value: password50 } })
    fireEvent.change(confirmInput, { target: { value: password50 } })
    fireEvent.click(resetBtn)

    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(3))
    expect(requestSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/v1/auth/forgot-password/reset',
        data: {
          email: 'test@example.com',
          otpCode: '007890',
          newPassword: password50,
        },
      }),
    )
    expect(await screen.findByText('Thử lại với khoảng trắng hai đầu')).toBeInTheDocument()

    // Valid untrimmed password with leading/trailing spaces & leading-zero OTP
    const validUntrimmedPassword = ' secret123 '
    fireEvent.change(otpInput, { target: { value: '007890' } })
    fireEvent.change(newPasswordInput, { target: { value: validUntrimmedPassword } })
    fireEvent.change(confirmInput, { target: { value: validUntrimmedPassword } })
    fireEvent.click(resetBtn)

    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(4))
    expect(requestSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        method: 'post',
        url: '/api/v1/auth/forgot-password/reset',
        data: {
          email: 'test@example.com',
          otpCode: '007890',
          newPassword: ' secret123 ',
        },
      }),
    )
    expect(requestSpy.mock.calls[3][0].data).not.toHaveProperty('confirmPassword')
  })

  it('AC4 & AC8: locks controls while pending, shows API errors on reset failure without false success, and transitions to success panel without auto-login on reset success', async () => {
    let resolveReset!: (value: unknown) => void
    const requestSpy = vi
      .spyOn(apiClient, 'request')
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockRejectedValueOnce(new Error('Mã OTP không chính xác hoặc đã hết hạn.'))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveReset = resolve
          }),
      )

    const { store } = setupApp('/forgot-password')

    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    const otpInput = await screen.findByLabelText(/Mã OTP xác thực/i)
    const newPasswordInput = screen.getByLabelText(/^Mật khẩu mới/i)
    const confirmInput = screen.getByLabelText(/^Xác nhận mật khẩu/i)

    // First reset attempt fails with wrong OTP
    fireEvent.change(otpInput, { target: { value: '111111' } })
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } })
    fireEvent.change(confirmInput, { target: { value: 'newpass123' } })
    fireEvent.click(screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }))

    expect(
      await screen.findByText('Mã OTP không chính xác hoặc đã hết hạn.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Khôi Phục Thành Công!')).not.toBeInTheDocument()
    // User input is preserved so they can fix OTP
    expect(otpInput).toHaveValue('111111')
    expect(newPasswordInput).toHaveValue('newpass123')

    // Fix OTP and submit; verify pending lock prevents double submit
    fireEvent.change(otpInput, { target: { value: '222222' } })
    const submitBtn = screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i })
    fireEvent.click(submitBtn)
    fireEvent.click(submitBtn)

    expect(await screen.findByRole('button', { name: /Đang đặt lại mật khẩu/i })).toBeDisabled()
    expect(otpInput).toBeDisabled()
    expect(requestSpy).toHaveBeenCalledTimes(3)

    await act(async () => {
      resolveReset({ data: { data: null } })
    })

    expect(await screen.findByRole('heading', { name: 'Khôi Phục Thành Công!' })).toBeInTheDocument()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(store.getState().auth.role).toBeNull()

    const loginCta = screen.getByRole('link', { name: /Đăng Nhập Ngay/i })
    expect(loginCta).toHaveAttribute('href', '/login')
    fireEvent.click(loginCta)
    expect(await screen.findByTestId('location-probe')).toHaveTextContent('/login')
  })

  it('AC5: tracks expiresInSeconds (300s) and resendAfterSeconds (60s) independently via Date.now(), unlocks resend at 60s while OTP remains valid, and clears old OTP on resend success', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-11-08T08:00:00.000Z'))

    const requestSpy = vi
      .spyOn(apiClient, 'request')
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockRejectedValueOnce(new Error('Không gửi lại được mã OTP.'))
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })

    render(
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
      >
        <MemoryRouter>
          <ForgotPasswordPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'timer@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    expect(await screen.findByTestId('otp-ttl-timer')).toHaveTextContent('05:00')
    const resendBtn = screen.getByRole('button', { name: /Gửi lại sau 60s/i })
    expect(resendBtn).toBeDisabled()

    // Type an OTP code before resend
    const otpInput = screen.getByLabelText(/Mã OTP xác thực/i)
    fireEvent.change(otpInput, { target: { value: '123456' } })

    // Advance 60 seconds: resend cooldown reaches 0, but OTP TTL still has 04:00 (240s) left
    await act(async () => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('04:00')
    expect(screen.queryByText('Mã xác thực đã hết hạn')).not.toBeInTheDocument()
    const enabledResendBtn = screen.getByRole('button', { name: /Gửi lại mã OTP mới/i })
    expect(enabledResendBtn).toBeEnabled()

    // Resend failure preserves existing OTP input and shows error banner
    fireEvent.click(enabledResendBtn)
    expect(await screen.findByText('Không gửi lại được mã OTP.')).toBeInTheDocument()
    expect(otpInput).toHaveValue('123456')

    // Resend success resets both timers and clears the old OTP field
    fireEvent.click(screen.getByRole('button', { name: /Gửi lại mã ngay/i }))
    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(otpInput).toHaveValue(''))
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('05:00')
    expect(screen.getByRole('button', { name: /Gửi lại sau 60s/i })).toBeDisabled()

    // Simulate tab delay / clock jump to 300s: TTL clamps at 00:00 and shows expiry banner
    await act(async () => {
      vi.advanceTimersByTime(300_000)
    })
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('00:00')
    expect(screen.getByText('Mã xác thực đã hết hạn')).toBeInTheDocument()
  })

  it('AC6 & AC7: ignores stale async responses when email changes, clears Step 2 secrets on back navigation, and never reads otpCode from response or persists secrets', async () => {
    let resolveSlowSend!: (value: unknown) => void
    const requestSpy = vi
      .spyOn(apiClient, 'request')
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSlowSend = resolve
          }),
      )
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            expiresInSeconds: 300,
            resendAfterSeconds: 60,
            otpCode: '999999',
          },
        },
      })

    const consoleLogSpy = vi.spyOn(console, 'log')
    const consoleInfoSpy = vi.spyOn(console, 'info')
    const { queryClient } = setupApp('/forgot-password')

    const emailInput = screen.getByLabelText(/Email nhận mã xác thực/i)
    fireEvent.change(emailInput, { target: { value: 'stale@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(1))

    // User edits email while slow request for stale@example.com is in flight
    fireEvent.change(emailInput, { target: { value: 'first@example.com' } })

    // When stale request resolves, it must be ignored and stay on Step 1
    await act(async () => {
      resolveSlowSend({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
    })
    const submitBtnAfterStale = await screen.findByRole('button', {
      name: /Gửi Mã Xác Nhận OTP/i,
    })
    expect(screen.queryByText('stale@example.com')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Mã OTP xác thực/i)).not.toBeInTheDocument()

    // Now submit first@example.com
    fireEvent.click(submitBtnAfterStale)

    // Now on Step 2 for first@example.com; enter sensitive OTP and password
    expect(await screen.findByText('first@example.com')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Mã OTP xác thực/i), {
      target: { value: '654321' },
    })
    fireEvent.change(screen.getByLabelText(/^Mật khẩu mới/i), {
      target: { value: 'MySecretPass1' },
    })
    fireEvent.change(screen.getByLabelText(/^Xác nhận mật khẩu/i), {
      target: { value: 'MySecretPass1' },
    })

    // Return to Step 1 and switch to second@example.com
    fireEvent.click(screen.getByRole('button', { name: /Nhập email khác/i }))
    const step1EmailInput = await screen.findByLabelText(/Email nhận mã xác thực/i)
    fireEvent.change(step1EmailInput, { target: { value: 'second@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    expect(await screen.findByText('second@example.com')).toBeInTheDocument()
    // Old OTP and password must be wiped, and leaked otpCode '999999' from response must NEVER be autofilled or displayed
    expect(screen.getByLabelText(/Mã OTP xác thực/i)).toHaveValue('')
    expect(screen.getByLabelText(/^Mật khẩu mới/i)).toHaveValue('')
    expect(screen.getByLabelText(/^Xác nhận mật khẩu/i)).toHaveValue('')
    expect(screen.queryByText('999999')).not.toBeInTheDocument()

    // Verify no secret persistence in storage, query cache, or console logs
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
    expect(consoleLogSpy).not.toHaveBeenCalled()
    expect(consoleInfoSpy).not.toHaveBeenCalled()
    expect(requestSpy).toHaveBeenCalledTimes(3)
  })

  it('AC9: supports keyboard navigation and independent visibility toggles for new and confirm password fields', async () => {
    const user = userEvent.setup()
    vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
      data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
    })

    setupApp('/forgot-password')

    const emailInput = screen.getByLabelText(/Email nhận mã xác thực/i)
    await user.type(emailInput, 'a11y@example.com')
    await user.keyboard('{Enter}')

    const otpInput = await screen.findByLabelText(/Mã OTP xác thực/i)
    const newPasswordInput = screen.getByLabelText(/^Mật khẩu mới/i)
    const confirmPasswordInput = screen.getByLabelText(/^Xác nhận mật khẩu/i)

    expect(otpInput).toBeInTheDocument()
    expect(newPasswordInput).toHaveAttribute('type', 'password')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Hiện mật khẩu mới' }))
    expect(newPasswordInput).toHaveAttribute('type', 'text')
    expect(confirmPasswordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Hiện xác nhận mật khẩu' }))
    expect(confirmPasswordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Ẩn mật khẩu mới' }))
    expect(newPasswordInput).toHaveAttribute('type', 'password')
  })

  it('R1 (AC7): releases OTP and password from MutationCache after reset success, reset failure (including AxiosError config payload), resend, and back navigation', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-11-08T09:00:00.000Z'))

    const axiosFailureWithPayload = Object.assign(
      new Error('Mã OTP đã được sử dụng hoặc vượt quá 5 lần thử.'),
      {
        isAxiosError: true,
        config: {
          data: JSON.stringify({
            email: 'cache@example.com',
            otpCode: '112233',
            newPassword: 'SecretPassword1!',
          }),
        },
        response: {
          status: 429,
          data: { message: 'Mã OTP đã được sử dụng hoặc vượt quá 5 lần thử.' },
          config: {
            data: JSON.stringify({
              email: 'cache@example.com',
              otpCode: '112233',
              newPassword: 'SecretPassword1!',
            }),
          },
        },
      },
    )

    vi.spyOn(apiClient, 'request')
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockRejectedValueOnce(axiosFailureWithPayload)
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockRejectedValueOnce(new Error('Mã OTP không hợp lệ.'))
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockResolvedValueOnce({ data: { data: null } })

    const { queryClient } = setupApp('/forgot-password')

    const assertNoSensitiveMutationCache = () => {
      const mutations = queryClient.getMutationCache().getAll()
      const serialized = JSON.stringify(
        mutations.map((m) => ({
          variables: m.state.variables,
          data: m.state.data,
          error: m.state.error,
        })),
      )
      expect(serialized).not.toContain('112233')
      expect(serialized).not.toContain('445566')
      expect(serialized).not.toContain('778899')
      expect(serialized).not.toContain('SecretPassword1!')
      expect(serialized).not.toContain('SecretPassword2!')
      expect(serialized).not.toContain('SecretPassword3!')
    }

    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'cache@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    const otpInput = await screen.findByLabelText(/Mã OTP xác thực/i)
    const newPasswordInput = screen.getByLabelText(/^Mật khẩu mới/i)
    const confirmInput = screen.getByLabelText(/^Xác nhận mật khẩu/i)

    // 1. Submit reset failure (429 attempt limit) -> form keeps input, error config.data scrubbed, MutationCache clean
    fireEvent.change(otpInput, { target: { value: '112233' } })
    fireEvent.change(newPasswordInput, { target: { value: 'SecretPassword1!' } })
    fireEvent.change(confirmInput, { target: { value: 'SecretPassword1!' } })
    fireEvent.click(screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }))

    expect(
      await screen.findByText(/Mã lỗi 429: Mã OTP đã được sử dụng hoặc vượt quá 5 lần thử\./),
    ).toBeInTheDocument()
    expect(otpInput).toHaveValue('112233')
    expect(newPasswordInput).toHaveValue('SecretPassword1!')
    expect(axiosFailureWithPayload.config).not.toHaveProperty('data')
    expect(axiosFailureWithPayload.response.config).not.toHaveProperty('data')
    await waitFor(() => {
      assertNoSensitiveMutationCache()
      expect(queryClient.getMutationCache().getAll()).toHaveLength(0)
    })

    // 2. Advance 60s and resend after failure -> clears OTP, MutationCache stays clean
    await act(async () => {
      vi.advanceTimersByTime(60_000)
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi lại mã ngay/i }))
    await waitFor(() => expect(otpInput).toHaveValue(''))
    assertNoSensitiveMutationCache()

    // 3. Submit reset failure then navigate back to Step 1 -> clears form & MutationCache
    fireEvent.change(otpInput, { target: { value: '445566' } })
    fireEvent.change(newPasswordInput, { target: { value: 'SecretPassword2!' } })
    fireEvent.change(confirmInput, { target: { value: 'SecretPassword2!' } })
    fireEvent.click(screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }))
    expect(await screen.findByText(/Mã OTP không hợp lệ\./)).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('button', { name: /Nhập email khác/i })[0])
    const step1Input = await screen.findByLabelText(/Email nhận mã xác thực/i)
    await waitFor(() => {
      assertNoSensitiveMutationCache()
      expect(queryClient.getMutationCache().getAll()).toHaveLength(0)
    })

    // 4. Switch to another email, submit reset success -> MutationCache has 0 entries and 0 sensitive variables
    fireEvent.change(step1Input, { target: { value: 'success@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    const otpInput2 = await screen.findByLabelText(/Mã OTP xác thực/i)
    fireEvent.change(otpInput2, { target: { value: '778899' } })
    fireEvent.change(screen.getByLabelText(/^Mật khẩu mới/i), {
      target: { value: 'SecretPassword3!' },
    })
    fireEvent.change(screen.getByLabelText(/^Xác nhận mật khẩu/i), {
      target: { value: 'SecretPassword3!' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i }))

    expect(
      await screen.findByRole('heading', { name: 'Khôi Phục Thành Công!' }),
    ).toBeInTheDocument()
    await waitFor(() => {
      assertNoSensitiveMutationCache()
      expect(queryClient.getMutationCache().getAll()).toHaveLength(0)
      expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
    })
  })

  it('R2 (AC5 & AC6): preserves per-email cooldown and TTL across back navigation without firing duplicate requests before cooldown, isolates other emails, and updates deadlines after cooldown', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-11-08T10:00:00.000Z'))

    const requestSpy = vi
      .spyOn(apiClient, 'request')
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })
      .mockResolvedValueOnce({
        data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
      })

    setupApp('/forgot-password')

    // t = 0s: Send email A
    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'alpha@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    expect(await screen.findByTestId('otp-ttl-timer')).toHaveTextContent('05:00')
    expect(screen.getByRole('button', { name: /Gửi lại sau 60s/i })).toBeDisabled()
    expect(requestSpy).toHaveBeenCalledTimes(1)

    // Type sensitive fields on Step 2 before going back
    fireEvent.change(screen.getByLabelText(/Mã OTP xác thực/i), {
      target: { value: '123456' },
    })
    fireEvent.change(screen.getByLabelText(/^Mật khẩu mới/i), {
      target: { value: 'TempPass123' },
    })

    // Advance +10s (t = 10s): TTL is 04:50, cooldown is 50s
    await act(async () => {
      vi.advanceTimersByTime(10_000)
    })
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('04:50')

    // Click "Nhập email khác" and re-submit email A (with whitespace/uppercase) before cooldown
    fireEvent.click(screen.getByRole('button', { name: /Nhập email khác/i }))
    const emailInputAfterBack = await screen.findByLabelText(/Email nhận mã xác thực/i)
    fireEvent.change(emailInputAfterBack, {
      target: { value: '  ALPHA@Example.com ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    // Must NOT make a new API request; must restore 04:50 TTL and 50s cooldown; must have cleared old OTP/password
    expect(await screen.findByTestId('otp-ttl-timer')).toHaveTextContent('04:50')
    expect(screen.getByRole('button', { name: /Gửi lại sau 50s/i })).toBeDisabled()
    expect(requestSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText(/Mã OTP xác thực/i)).toHaveValue('')
    expect(screen.getByLabelText(/^Mật khẩu mới/i)).toHaveValue('')

    // Advance +5s (t = 15s), go back and submit email B -> handled independently with its own request
    await act(async () => {
      vi.advanceTimersByTime(5_000)
    })
    fireEvent.click(screen.getByRole('button', { name: /Nhập email khác/i }))
    fireEvent.change(await screen.findByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'beta@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    expect(await screen.findByText('beta@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('05:00')
    expect(requestSpy).toHaveBeenCalledTimes(2)

    // Advance +5s (t = 20s), go back and switch to email A -> still has 04:40 TTL and 40s cooldown without new call
    await act(async () => {
      vi.advanceTimersByTime(5_000)
    })
    fireEvent.click(screen.getByRole('button', { name: /Nhập email khác/i }))
    fireEvent.change(await screen.findByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'alpha@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    expect(await screen.findByText('alpha@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('04:40')
    expect(screen.getByRole('button', { name: /Gửi lại sau 40s/i })).toBeDisabled()
    expect(requestSpy).toHaveBeenCalledTimes(2)

    // Advance +40s (t = 60s): email A cooldown expires -> resend sends real request and refreshes deadlines
    await act(async () => {
      vi.advanceTimersByTime(40_000)
    })
    const resendBtn = screen.getByRole('button', { name: /Gửi lại mã OTP mới/i })
    expect(resendBtn).toBeEnabled()
    fireEvent.click(resendBtn)

    await waitFor(() => expect(requestSpy).toHaveBeenCalledTimes(3))
    expect(screen.getByTestId('otp-ttl-timer')).toHaveTextContent('05:00')
    expect(screen.getByRole('button', { name: /Gửi lại sau 60s/i })).toBeDisabled()
  })

  it('R3 (AC9): uses Stitch Variant 1 Inter/Sora typography tokens instead of font-mono across header, stepper, timer, notices, and footer without affecting default AuthLayout', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
      data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
    })

    const { container } = setupApp('/forgot-password')

    // Zero Tailwind font-mono elements on Step 1
    expect(container.querySelectorAll('.font-mono')).toHaveLength(0)

    // Recovery shell scopes --font-inter to Inter and --font-sora to Sora
    const recoveryRoot = container.querySelector('main')?.parentElement
    expect(recoveryRoot?.getAttribute('style')).toContain("'Inter'")
    expect(recoveryRoot?.getAttribute('style')).toContain("'Sora'")

    const heading = screen.getByRole('heading', { name: 'Khôi Phục Mật Khẩu' })
    expect(heading.className).toContain('font-sora')

    const step1Label = screen.getByText('BƯỚC 1')
    expect(step1Label.className).toContain('font-inter')
    expect(step1Label.className).not.toContain('font-mono')

    const footerBar = screen.queryByText(/SMARTTRUCK HUB — BẢO MẬT TÀI KHOẢN/i)
    expect(footerBar).toBeNull()

    // Transition to Step 2 and check timer, email display, and password rules box
    fireEvent.change(screen.getByLabelText(/Email nhận mã xác thực/i), {
      target: { value: 'fonts@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))

    const timerEl = await screen.findByTestId('otp-ttl-timer')
    expect(timerEl.className).toContain('font-inter')
    expect(timerEl.className).not.toContain('font-mono')

    const emailDisplay = container.querySelector('#display-user-email')
    expect(emailDisplay?.className).toContain('font-inter')
    expect(emailDisplay?.className).not.toContain('font-mono')

    expect(container.querySelectorAll('.font-mono')).toHaveLength(0)
  })
})
