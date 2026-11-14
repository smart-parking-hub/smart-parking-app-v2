import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { AuthPage } from '../index'

afterEach(() => { cleanup(); vi.restoreAllMocks() })
async function mount(mode: 'register' | 'forgot' = 'register') {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}><MemoryRouter><AuthPage mode={mode} /></MemoryRouter></QueryClientProvider>)
  if (mode === 'register') {
    fireEvent.change(screen.getByLabelText('Họ và tên'), { target: { value: 'Test Driver' } })
    fireEvent.change(screen.getByLabelText('Số điện thoại'), { target: { value: '0901234567' } })
    await userEvent.click(screen.getByRole('button', { name: 'Tiếp tục: Xác thực Email' }))
  }
}
const emailInput = () => screen.getByLabelText(/Email nhận mã xác thực/i)
it('validates email before requesting a code without requiring the remaining registration fields', async () => {
  const request = vi.spyOn(apiClient, 'request')
  await mount(); fireEvent.change(emailInput(), { target: { value: 'invalid-email' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByText('Nhập email hợp lệ để nhận mã.')).toBeInTheDocument(); expect(request).not.toHaveBeenCalled()
})
it('sends normalized email only and uses resend cooldown rather than code expiry', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  await mount(); fireEvent.change(emailInput(), { target: { value: 'Driver@Example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await waitFor(() => expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/otp/send', data: { email: 'driver@example.test' } })))
  expect(await screen.findByText('Mã xác thực đã được gửi')).toBeInTheDocument()
  expect(screen.getByText('driver@example.test')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Gửi lại sau 60s' })).toBeDisabled()
  expect(screen.getByText(/có hiệu lực 5 phút/)).toBeInTheDocument()
})
it('stops claiming delivery when the destination email changes', async () => {
  vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  await mount(); fireEvent.change(emailInput(), { target: { value: 'a@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' })); await screen.findByText('Mã xác thực đã được gửi')
  fireEvent.change(emailInput(), { target: { value: 'b@example.test' } })
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
})
it('keeps forgot-password response generic and uses the reset OTP endpoint', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  await mount('forgot'); fireEvent.change(emailInput(), { target: { value: 'unknown@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: /Gửi Mã Xác Nhận OTP/i }))
  expect(await screen.findByText(/Nếu email đã đăng ký, mã OTP 6 chữ số đã được gửi tới/i)).toBeInTheDocument()
  expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/forgot-password/otp', data: { email: 'unknown@example.test' } }))
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
})
it('reports delivery failure and leaves resend available without a success notice', async () => {
  vi.spyOn(apiClient, 'request').mockRejectedValue(new Error('Chưa gửi được email.'))
  await mount(); fireEvent.change(emailInput(), { target: { value: 'a@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Chưa gửi được email.')
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Gửi mã qua email' })).toBeEnabled()
})

const codeInput = () => screen.getByLabelText('Mã xác thực email (6 số)')
const nextPassword = () => screen.getByRole('button', { name: 'Tiếp tục: Thiết lập mật khẩu' })
const delivery = { data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } }
async function preparePassword() {
  await mount()
  fireEvent.change(emailInput(), { target: { value: 'driver@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await screen.findByText('Mã xác thực đã được gửi')
  fireEvent.change(codeInput(), { target: { value: '123456' } })
  await userEvent.click(nextPassword())
  await waitFor(() => expect(screen.getByLabelText('Mật khẩu')).toBeVisible())
  fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'test-password' } })
}

it('blocks continuing after failed delivery even with six digits entered', async () => {
  const request = vi.spyOn(apiClient, 'request').mockRejectedValue(new Error('Chưa gửi được email.'))
  await mount()
  fireEvent.change(emailInput(), { target: { value: 'driver@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await screen.findByText('Chưa gửi được email.')
  fireEvent.change(codeInput(), { target: { value: '123456' } })
  await userEvent.click(nextPassword())
  expect(await screen.findByText(/Vui lòng gửi mã OTP thành công/)).toBeVisible()
  expect(screen.queryByRole('button', { name: 'Tạo tài khoản' })).not.toBeInTheDocument()
  expect(request).toHaveBeenCalledTimes(1)
})

it('requires password confirmation and rejects whitespace and mismatched passwords before submitting', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await preparePassword()
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  expect(await screen.findByText('Nhập lại mật khẩu để xác nhận.')).toBeVisible()
  fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: 'different-password' } })
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  expect(await screen.findByText('Mật khẩu xác nhận không khớp.')).toBeVisible()
  fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: '      ' } })
  fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: '      ' } })
  await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
  expect(await screen.findByText('Mật khẩu không được chỉ chứa khoảng trắng.')).toBeVisible()
  expect(request).toHaveBeenCalledTimes(2)
})

it.each(['Mã OTP không tồn tại hoặc đã hết hạn!', 'Mã OTP không chính xác!', 'Mã OTP đã được sử dụng!'])(
  'returns server OTP rejection to the email step: %s', async (message) => {
    const request = vi.spyOn(apiClient, 'request').mockResolvedValueOnce(delivery).mockResolvedValueOnce(delivery).mockRejectedValueOnce(new Error(message)).mockResolvedValue(delivery)
    await preparePassword()
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: 'test-password' } })
    await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
    expect(await screen.findByText(message)).toBeVisible()
    expect(nextPassword()).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Tạo tài khoản' })).not.toBeInTheDocument()
    fireEvent.change(codeInput(), { target: { value: '654321' } })
    expect(screen.queryByText(message)).not.toBeInTheDocument()
    await userEvent.click(nextPassword())
    await waitFor(() => expect(screen.getByRole('button', { name: 'Tạo tài khoản' })).toBeVisible())
    await userEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }))
    expect(await screen.findByText('Đăng ký thành công!')).toBeVisible()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ url: '/api/v1/auth/register', data: expect.objectContaining({ otpCode: '654321', email: 'driver@example.test' }) }))
  },
)

it('invalidates old code and delivery when email changes', async () => {
  vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await preparePassword()
  await userEvent.click(screen.getByRole('button', { name: 'Quay lại' }))
  fireEvent.change(emailInput(), { target: { value: 'other@example.test' } })
  expect(codeInput()).toHaveValue('')
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
  fireEvent.change(codeInput(), { target: { value: '123456' } })
  await userEvent.click(nextPassword())
  expect(await screen.findByText(/Vui lòng gửi mã OTP thành công/)).toBeVisible()
})

it('does not submit registration when Enter is pressed on an earlier step', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue(delivery)
  await mount()
  fireEvent.change(emailInput(), { target: { value: 'driver@example.test' } })
  fireEvent.change(codeInput(), { target: { value: '123456' } })
  fireEvent.submit(emailInput().closest('form')!)
  expect(await screen.findByText(/Vui lòng gửi mã OTP thành công/)).toBeVisible()
  expect(request).not.toHaveBeenCalled()
})

it('checks OTP on the server before revealing password fields and keeps rejection at the code step', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValueOnce(delivery)
    .mockRejectedValueOnce(new Error('Mã OTP không chính xác!')).mockResolvedValue(delivery)
  await mount()
  fireEvent.change(emailInput(), { target: { value: 'driver@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await screen.findByText('Mã xác thực đã được gửi')
  fireEvent.change(codeInput(), { target: { value: '000001' } })
  await userEvent.click(nextPassword())
  expect(await screen.findByText('Mã OTP không chính xác!')).toBeVisible()
  expect(screen.getByLabelText('Mật khẩu')).not.toBeVisible()
  expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ url: '/api/v1/auth/otp/verify', data: { email: 'driver@example.test', otpCode: '000001' } }))
  fireEvent.change(codeInput(), { target: { value: '012345' } })
  await userEvent.click(nextPassword())
  await waitFor(() => expect(screen.getByLabelText('Mật khẩu')).toBeVisible())
  expect(request.mock.calls.some(([config]) => config.url === '/api/v1/auth/register')).toBe(false)
})

it('supports Magic Link URL parameters to auto-verify email and advance directly to password step', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { code: 'OTP_VERIFIED' } })
  sessionStorage.setItem('sp_register_draft', JSON.stringify({ fullName: 'Magic User', phone: '0912345678' }))

  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={['/register?email=magic@example.test&otpCode=654321&autoVerify=true']}>
        <AuthPage mode="register" />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/auth/otp/verify',
        data: { email: 'magic@example.test', otpCode: '654321' },
      }),
    ),
  )

  expect(await screen.findByText(/Email đã được xác thực thành công qua liên kết/i)).toBeInTheDocument()
  expect(screen.getByLabelText('Mật khẩu')).toBeVisible()
  sessionStorage.removeItem('sp_register_draft')
})

it('restores draft from sessionStorage and preserves draft across registration steps', async () => {
  sessionStorage.setItem('sp_register_draft', JSON.stringify({ fullName: 'Draft Driver', phone: '0988776655' }))

  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <MemoryRouter initialEntries={['/register']}>
        <AuthPage mode="register" />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  expect(screen.getByLabelText('Họ và tên')).toHaveValue('Draft Driver')
  expect(screen.getByLabelText('Số điện thoại')).toHaveValue('0988776655')
  sessionStorage.removeItem('sp_register_draft')
})

