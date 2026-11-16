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
const magicUrl = '/register?email=driver%40example.test&otpCode=012345&autoVerify=true'

async function readyToSubmit(url = magicUrl) {
  mount(url)
  await waitFor(() => expect(screen.getByLabelText('Mật khẩu')).toBeVisible())
  fill('Mật khẩu', 'test-password')
  fill('Xác nhận mật khẩu', 'test-password')
}

function draft(values: Record<string, string> = {}) {
  sessionStorage.setItem('sp_register_draft', JSON.stringify({
    role: 'DRIVER', fullName: 'Test Driver', phone: '0901234567', ...values,
  }))
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
    draft({ fullName: '  Test Driver  ', phone: '+84 901 234 567', citizenId: ` ${citizenId} ` })
    await readyToSubmit()
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
])('reveals and focuses invalid restored %s after magic-link verification', async (field, value, label, message) => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  draft({ [field]: value })
  await readyToSubmit()
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  expect(await screen.findByText(message, { exact: false })).toBeVisible()
  expect(screen.getByLabelText(label)).toHaveFocus()
  expect(request).not.toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/register' }))
})

it.each([
  ['Số điện thoại đã tồn tại trong hệ thống!', 'Số điện thoại'],
  ['Email đã tồn tại trong hệ thống!', 'Email nhận mã xác thực'],
])('shows server duplicate error at the visible field: %s', async (message, label) => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValueOnce(delivery).mockRejectedValueOnce(new Error(message))
  draft()
  await readyToSubmit()
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  await waitFor(() => expect(screen.getByLabelText(label)).toBeVisible())
  expect(screen.getByLabelText(label)).toHaveFocus()
  expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'true')
  expect(screen.getByLabelText(label)).toHaveAccessibleDescription(expect.stringContaining(message))
  expect(screen.queryByText('Đăng ký thành công!')).not.toBeInTheDocument()
  expect(request).toHaveBeenCalledTimes(2)
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
    url: '/api/v1/auth/otp/send', data: { email: 'existing@example.test' },
  }))
})
