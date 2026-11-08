import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { LoginPage } from '../pages/LoginPage'
import { AuthPage, AccessPage } from '../index'
import authReducer from '../model/authSlice'

function createTestContext(initialEntry = '/login') {
  const store = configureStore({ reducer: { auth: authReducer } })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return {
    store,
    queryClient,
    renderWithProviders: (ui: React.ReactNode) =>
      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[initialEntry]}>{ui}</MemoryRouter>
          </QueryClientProvider>
        </Provider>,
      ),
  }
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('GROUP 13 - Authentication & Access Control Guards Hardening', () => {
  describe('LoginPage & LoginForm Accessibility (SCR-010 & A11y-Focus-Visible-Rings)', () => {
    it('AC1: inputs and submit button contain brand orange focus-visible ring styles for keyboard Tab navigation', () => {
      const { renderWithProviders } = createTestContext('/login')
      renderWithProviders(<LoginPage />)

      const phoneInput = screen.getByLabelText('Số điện thoại')
      const passwordInput = screen.getByLabelText('Mật khẩu')
      const submitBtn = screen.getByRole('button', { name: /^Đăng nhập$/ })

      // Verify focus-visible ring token #d95f00
      expect(phoneInput.className).toContain('focus-visible:ring-[#d95f00]')
      expect(passwordInput.className).toContain('focus-visible:ring-[#d95f00]')
      expect(submitBtn.className).toContain('focus-visible:ring-[#d95f00]')
      expect(submitBtn.className).toContain('bg-[#d95f00]')
      expect(submitBtn.className).toContain('text-white')
    })

    it('AC1: keyboard Tab key navigates sequentially across interactive form controls', async () => {
      const user = userEvent.setup()
      const { renderWithProviders } = createTestContext('/login')
      renderWithProviders(<LoginPage />)

      const phoneInput = screen.getByLabelText('Số điện thoại')
      const passwordInput = screen.getByLabelText('Mật khẩu')
      const rememberCheckbox = screen.getByRole('checkbox', { name: 'Ghi nhớ số điện thoại' })
      const showPasswordBtn = screen.getByRole('button', { name: 'Hiện mật khẩu' })
      const submitBtn = screen.getByRole('button', { name: /^Đăng nhập$/ })

      // Focus starts and moves with Tab
      phoneInput.focus()
      expect(phoneInput).toHaveFocus()

      await user.tab()
      expect(passwordInput).toHaveFocus()

      await user.tab()
      expect(showPasswordBtn).toHaveFocus()

      await user.tab()
      expect(rememberCheckbox).toHaveFocus()

      await user.tab()
      expect(submitBtn).toHaveFocus()
    })

    it('AC2: validation error messages have role="alert" for screen reader semantics', async () => {
      const user = userEvent.setup()
      const { renderWithProviders } = createTestContext('/login')
      renderWithProviders(<LoginPage />)

      const submitBtn = screen.getByRole('button', { name: /^Đăng nhập$/ })
      await user.click(submitBtn)

      const alerts = await screen.findAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(2)

      const phoneError = screen.getByText('Số điện thoại Việt Nam chưa hợp lệ.')
      expect(phoneError).toHaveAttribute('role', 'alert')
      expect(phoneError.className).toContain('text-red-700')

      const passwordError = screen.getByText('Mật khẩu phải từ 6 đến 50 ký tự.')
      expect(passwordError).toHaveAttribute('role', 'alert')
      expect(passwordError.className).toContain('text-red-700')
    })
  })

  describe('RegisterPage Accessibility (SCR-011)', () => {
    it('AC1 & AC2: Register form has orange focus-visible rings and validation alerts', async () => {
      const user = userEvent.setup()
      const { renderWithProviders } = createTestContext('/register')
      renderWithProviders(<AuthPage mode="register" />)

      const submitBtn = screen.getByRole('button', { name: 'Tạo tài khoản' })
      expect(submitBtn.className).toContain('bg-[#d95f00]')
      expect(submitBtn.className).toContain('text-white')
      expect(submitBtn.className).toContain('focus-visible:ring-[#d95f00]')

      const roleSelect = screen.getByRole('combobox', { name: 'Bạn tham gia với vai trò' })
      expect(roleSelect.className).toContain('focus-visible:ring-[#d95f00]')

      // Submitting empty form triggers validation alerts
      await user.click(submitBtn)
      const alerts = await screen.findAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('ForgotPasswordPage Accessibility (SCR-012)', () => {
    it('AC1: Forgot password form has orange focus-visible rings on submit button and OTP trigger', () => {
      const { renderWithProviders } = createTestContext('/forgot-password')
      renderWithProviders(<AuthPage mode="forgot" />)

      const emailInput = screen.getByLabelText(/Email nhận mã xác thực/i)
      expect(emailInput.className).toContain('focus-visible:ring-[#d95f00]')

      const otpBtn = screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i })
      expect(otpBtn.className).toContain('bg-[#d95f00]')
      expect(otpBtn.className).toContain('text-white')
      expect(otpBtn.className).toContain('focus-visible:ring-[#d95f00]')
    })
  })

  describe('Access Control & Error Pages (SCR-013 & 404)', () => {
    it('AC3: 403 Forbidden page renders "Về trang chủ" button in brand orange with white text', () => {
      const { renderWithProviders } = createTestContext('/403')
      renderWithProviders(<AccessPage notFound={false} />)

      expect(screen.getByText('SMARTTRUCK / 403')).toBeInTheDocument()
      expect(screen.getByText('Bạn chưa có quyền truy cập.')).toBeInTheDocument()

      const homeBtn = screen.getByRole('link', { name: 'Về trang chủ' })
      expect(homeBtn).toBeInTheDocument()
      expect(homeBtn.className).toContain('bg-[#d95f00]')
      expect(homeBtn.className).toContain('text-white')
      expect(homeBtn).toHaveAttribute('href', '/')

      const loginLink = screen.getByRole('link', { name: 'Đăng nhập' })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('AC3: 404 Not Found page renders "Về trang chủ" button in brand orange with white text', () => {
      const { renderWithProviders } = createTestContext('/non-existent-page')
      renderWithProviders(<AccessPage notFound={true} />)

      expect(screen.getByText('SMARTTRUCK / 404')).toBeInTheDocument()
      expect(screen.getByText('Không tìm thấy trang.')).toBeInTheDocument()

      const homeBtn = screen.getByRole('link', { name: 'Về trang chủ' })
      expect(homeBtn).toBeInTheDocument()
      expect(homeBtn.className).toContain('bg-[#d95f00]')
      expect(homeBtn.className).toContain('text-white')
      expect(homeBtn).toHaveAttribute('href', '/')
    })
  })
})
