import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { AuthPage } from '../index'

beforeEach(() => sessionStorage.clear())
afterEach(() => { cleanup(); vi.restoreAllMocks(); sessionStorage.clear() })

function mount(url = '/register') {
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={[url]}><AuthPage mode="register" /></MemoryRouter>
    </QueryClientProvider>,
  )
}

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

const delivery = { data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }
const next = () => screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' })

async function readyToSubmit(initialValues: Record<string, string> = {}) {
  mount()
  fill('Họ và tên', initialValues.fullName ?? 'Test Driver')
  fill('Số điện thoại', initialValues.phone ?? '0901234567')
  if (initialValues.citizenId !== undefined) {
    fill('CCCD / CMND', initialValues.citizenId)
  }
  await userEvent.click(next())
  await waitFor(() => expect(screen.getByLabelText('Email nhận mã xác thực')).toBeVisible())
  fill('Email nhận mã xác thực', initialValues.email ?? 'driver@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await waitFor(() => expect(screen.getByLabelText('Mã xác thực email (6 số)')).toBeVisible())
  fill('Mã xác thực email (6 số)', initialValues.otpCode ?? '012345')
  await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' }))
  await waitFor(() => expect(screen.getByLabelText('Mật khẩu')).toBeVisible())
  fill('Mật khẩu', initialValues.password ?? 'test-password')
  fill('Xác nhận mật khẩu', initialValues.confirmPassword ?? 'test-password')
}

it.each([
  ['', 'Vui lòng nhập họ và tên.'],
  ['   ', 'Vui lòng nhập họ và tên.'],
  ['A', 'Họ và tên phải có ít nhất 2 ký tự.'],
  ['A'.repeat(101), 'Họ và tên không được vượt quá 100 ký tự.'],
])('reports invalid name on blur: %j', async (value, message) => {
  const request = vi.spyOn(apiClient, 'request')
  mount()
  fill('Họ và tên', value)
  fireEvent.blur(screen.getByLabelText('Họ và tên'))
  expect(await screen.findByText(message)).toBeVisible()
  expect(screen.getByLabelText('Họ và tên')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText('Họ và tên')).toHaveAccessibleDescription(expect.stringContaining(message))
  expect(request).not.toHaveBeenCalled()
})

it.each(['0212345678', '091234567', '09123456789', '09abcdefgh'])(
  'blocks invalid phone %s before advancing', async value => {
    const request = vi.spyOn(apiClient, 'request')
    mount()
    fill('Họ và tên', 'Test Driver')
    fill('Số điện thoại', value)
    await userEvent.click(next())
    expect(await screen.findByText(/Số điện thoại Việt Nam chưa hợp lệ/)).toBeVisible()
    expect(screen.getByLabelText('Số điện thoại')).toHaveFocus()
    expect(screen.getByLabelText('Email nhận mã xác thực')).not.toBeVisible()
    expect(request).not.toHaveBeenCalled()
  },
)

it('revalidates a touched phone as the user corrects it', async () => {
  mount()
  fill('Số điện thoại', 'bad')
  fireEvent.blur(screen.getByLabelText('Số điện thoại'))
  expect(await screen.findByText(/Số điện thoại Việt Nam chưa hợp lệ/)).toBeVisible()
  fill('Số điện thoại', '0901234567')
  await waitFor(() => expect(screen.getByLabelText('Số điện thoại')).toHaveAttribute('aria-invalid', 'false'))
})

it('allows empty driver citizen ID but requires it for a merchant', async () => {
  mount()
  fill('Họ và tên', 'Test Driver')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(next())
  expect(screen.getByLabelText('Email nhận mã xác thực')).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
  await userEvent.selectOptions(screen.getByLabelText('Bạn tham gia với vai trò'), 'MERCHANT')
  expect(screen.getByRole('dialog')).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: 'Đổi vai trò và nhập lại' }))
  fill('Họ và tên', 'Test Merchant')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Kết nối ngân hàng' }))
  expect(await screen.findByText('CCCD / CMND là bắt buộc đối với Chủ bãi xe.')).toBeVisible()
  expect(screen.getByLabelText('CCCD / CMND')).toHaveFocus()
})

it.each(['12345678', '1234567890', '12345678901A'])(
  'rejects malformed optional citizen ID %s', async value => {
    mount()
    fill('Họ và tên', 'Test Driver')
    fill('Số điện thoại', '0901234567')
    fill('CCCD / CMND', value)
    await userEvent.click(next())
    expect(await screen.findByText('CCCD / CMND phải gồm 9 hoặc 12 chữ số.')).toBeVisible()
    expect(screen.getByLabelText('CCCD / CMND')).toHaveFocus()
  },
)

it.each(['012345678', '012345678901'])(
  'preserves leading zeros and submits normalized personal data for %s', async citizenId => {
    const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
    await readyToSubmit({ fullName: '  Test Driver  ', phone: '+84 901 234 567', citizenId: ` ${citizenId} ` })
    await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
    await waitFor(() => expect(request).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/v1/auth/register',
      data: expect.objectContaining({ fullName: 'Test Driver', phone: '0901234567', citizenId, otpCode: '012345' }),
    })))
  },
)

it.each([
  ['fullName', 'A', 'Họ và tên', 'Họ và tên phải có ít nhất 2 ký tự.'],
  ['phone', '0212345678', 'Số điện thoại', 'Số điện thoại Việt Nam chưa hợp lệ'],
  ['citizenId', '123', 'CCCD / CMND', 'CCCD / CMND phải gồm 9 hoặc 12 chữ số.'],
])('reveals and focuses invalid field %s during final form submission', async (_field, value, label, message) => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await readyToSubmit()
  fill(label, value)
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  expect(await screen.findByText(message, { exact: false })).toBeVisible()
  expect(screen.getByLabelText(label)).toHaveFocus()
  expect(request).not.toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/register' }))
})

it.each([
  ['Số điện thoại đã tồn tại trong hệ thống!', 'Số điện thoại'],
  ['Email đã tồn tại trong hệ thống!', 'Email nhận mã xác thực'],
])('shows server duplicate error at the visible field: %s', async (message, label) => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await readyToSubmit()
  request.mockRejectedValueOnce(new Error(message))
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  await waitFor(() => expect(screen.getByLabelText(label)).toBeVisible())
  expect(screen.getByLabelText(label)).toHaveFocus()
  expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText(label)).toHaveAccessibleDescription(expect.stringContaining(message))
  expect(screen.queryByText('Đăng ký thành công!')).not.toBeInTheDocument()
})

it('blocks an overlong email before OTP delivery', async () => {
  const request = vi.spyOn(apiClient, 'request')
  mount()
  fill('Họ và tên', 'Test Driver')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(next())
  fill('Email nhận mã xác thực', `${'a'.repeat(90)}@example.test`)
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByText('Email không được vượt quá 100 ký tự.')).toBeVisible()
  expect(request).not.toHaveBeenCalled()
})

it('displays duplicate email rejection when requesting OTP without claiming delivery', async () => {
  const message = 'Email đã tồn tại trong hệ thống!'
  const request = vi.spyOn(apiClient, 'request').mockRejectedValue(new Error(message))
  mount()
  fill('Họ và tên', 'Test Driver')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(next())
  fill('Email nhận mã xác thực', 'existing@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByText(message)).toBeVisible()
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Gửi mã qua email' })).toBeEnabled()
  expect(request).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
    url: '/api/v1/auth/otp/send',
    data: { email: 'existing@example.test', phone: '0901234567' },
  }))
})

it('displays duplicate phone rejection when requesting OTP and returns to info step with focus on phone', async () => {
  const message = 'Số điện thoại đã liên kết với tài khoản khác. Vui lòng đăng nhập hoặc dùng số khác.'
  const request = vi.spyOn(apiClient, 'request').mockRejectedValue(new Error(message))
  mount()
  fill('Họ và tên', 'Test Driver')
  fill('Số điện thoại', '0901234567')
  await userEvent.click(next())
  fill('Email nhận mã xác thực', 'newdriver@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  const alerts = await screen.findAllByText(message)
  expect(alerts.length).toBeGreaterThanOrEqual(1)
  expect(screen.getByLabelText('Số điện thoại')).toBeVisible()
  expect(screen.getByLabelText('Số điện thoại')).toHaveFocus()
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
  expect(request).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
    url: '/api/v1/auth/otp/send',
    data: { email: 'newdriver@example.test', phone: '0901234567' },
  }))
})

it.each(['0912-345-678', '0912.345.678', '(0912) 345 678', '84912345678'])(
  'normalizes phone format %s before sending register OTP', async phone => {
    const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
    mount()
    fill('Họ và tên', 'Test Driver')
    fill('Số điện thoại', phone)
    await userEvent.click(next())
    fill('Email nhận mã xác thực', 'newdriver@example.test')
    await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
    await waitFor(() => expect(request).toHaveBeenCalledWith(expect.objectContaining({
      url: '/api/v1/auth/otp/send',
      data: { email: 'newdriver@example.test', phone: '0912345678' },
    })))
  },
)

it('shows duplicate CCCD rejection on final submission and focuses citizenId field', async () => {
  const message = 'CCCD/CMND đã tồn tại trong hệ thống!'
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await readyToSubmit({ citizenId: '079123456789' })
  request.mockRejectedValueOnce(new Error(message))
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  await waitFor(() => expect(screen.getByLabelText('CCCD / CMND')).toBeVisible())
  expect(screen.getByLabelText('CCCD / CMND')).toHaveFocus()
  expect(screen.getByLabelText('CCCD / CMND')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText('CCCD / CMND')).toHaveAccessibleDescription(expect.stringContaining(message))
  expect(screen.queryByText('Đăng ký thành công!')).not.toBeInTheDocument()
})
