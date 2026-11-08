import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { LoginPage } from '../pages/LoginPage'
import { AuthPage, AuthSuccess, AccessPage } from '../index'
import authReducer from '../model/authSlice'

function renderWithContext(ui: React.ReactNode, initialEntry = '/login') {
  const store = configureStore({ reducer: { auth: authReducer } })
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>{ui}</MemoryRouter>
      </QueryClientProvider>
    </Provider>
  )
}

describe('BATCH-14A: Authentication & Access Control Pages Integration', () => {
  it('SCR-010: LoginPage renders inside AuthLayout with branding, inputs, and password toggle', () => {
    renderWithContext(<LoginPage />, '/login')

    // Brand elements in AuthLayout (both desktop aside and mobile header)
    expect(screen.getAllByText('SMARTTRUCK HUB').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Một điểm đỗ.')).toBeInTheDocument()

    // Form elements
    expect(screen.getByRole('heading', { name: 'Chào mừng trở lại.' })).toBeInTheDocument()
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument()
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hiện mật khẩu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Đăng nhập$/ })).toBeInTheDocument()
  })

  it('SCR-011: RegisterPage renders inside AuthLayout with role selection, password toggle, and OTP triggers', () => {
    renderWithContext(<AuthPage mode="register" />, '/register')

    expect(screen.getByRole('heading', { name: 'Bắt đầu hành trình mới.' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Bạn tham gia với vai trò' })).toBeInTheDocument()
    expect(screen.getByLabelText('Họ và tên')).toBeInTheDocument()
    expect(screen.getByLabelText('Số điện thoại')).toBeInTheDocument()
    expect(screen.getByLabelText('Email nhận mã xác thực')).toBeInTheDocument()
    expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Gửi mã/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tạo tài khoản' })).toBeInTheDocument()

    // Password visibility toggle
    const toggleBtn = screen.getByLabelText('Hiện mật khẩu')
    fireEvent.click(toggleBtn)
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('type', 'text')
  })

  it('SCR-012: ForgotPasswordPage renders inside AuthLayout with OTP wizard and new password toggle', async () => {
    vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
      data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } },
    })
    renderWithContext(<AuthPage mode="forgot" />, '/forgot-password')

    expect(screen.getByRole('heading', { name: 'Khôi Phục Mật Khẩu' })).toBeInTheDocument()
    const emailField = screen.getByLabelText(/Email nhận mã xác thực/i)
    expect(emailField).toBeInTheDocument()
    const sendOtpBtn = screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i })
    expect(sendOtpBtn).toBeInTheDocument()

    fireEvent.change(emailField, { target: { value: 'driver@example.com' } })
    fireEvent.click(sendOtpBtn)

    expect(await screen.findByLabelText(/Mã OTP xác thực/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Mật khẩu mới/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Xác nhận mật khẩu/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đặt Lại Mật Khẩu/i })).toBeInTheDocument()

    // Password toggle
    const toggleBtn = screen.getByRole('button', { name: 'Hiện mật khẩu mới' })
    fireEvent.click(toggleBtn)
    expect(screen.getByLabelText(/^Mật khẩu mới/i)).toHaveAttribute('type', 'text')
  })

  it('SCR-011/SCR-012: AuthSuccess displays status card and link to LoginPage', () => {
    renderWithContext(<AuthSuccess mode="register" />)

    expect(screen.getByText('TÀI KHOẢN ĐÃ SẴN SÀNG')).toBeInTheDocument()
    expect(screen.getByText('Đăng ký thành công!')).toBeInTheDocument()
    const loginLink = screen.getByRole('link', { name: /Đến trang đăng nhập/ })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('SCR-013: AccessPage renders 403 Forbidden with navigation back to Home and Login', () => {
    renderWithContext(<AccessPage notFound={false} />, '/403')

    expect(screen.getByText('SMARTTRUCK / 403')).toBeInTheDocument()
    expect(screen.getByText('Bạn chưa có quyền truy cập.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang chủ' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveAttribute('href', '/login')
  })

  it('SCR-013: AccessPage renders 404 Not Found with navigation back to Home and Login', () => {
    renderWithContext(<AccessPage notFound={true} />, '/random-url')

    expect(screen.getByText('SMARTTRUCK / 404')).toBeInTheDocument()
    expect(screen.getByText('Không tìm thấy trang.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang chủ' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveAttribute('href', '/login')
  })
})
