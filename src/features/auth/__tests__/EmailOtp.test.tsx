import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { AuthPage } from '../index'

afterEach(() => { cleanup(); vi.restoreAllMocks() })
function mount(mode: 'register' | 'forgot' = 'register') {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}><MemoryRouter><AuthPage mode={mode} /></MemoryRouter></QueryClientProvider>)
}
const emailInput = () => screen.getByLabelText('Email nhận mã xác thực')
it('validates email before requesting a code without requiring the remaining registration fields', async () => {
  const request = vi.spyOn(apiClient, 'request')
  mount(); fireEvent.change(emailInput(), { target: { value: 'invalid-email' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByText('Nhập email hợp lệ để nhận mã.')).toBeInTheDocument(); expect(request).not.toHaveBeenCalled()
})
it('sends normalized email only and uses resend cooldown rather than code expiry', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  mount(); fireEvent.change(emailInput(), { target: { value: 'Driver@Example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  await waitFor(() => expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/otp/send', data: { email: 'driver@example.test' } })))
  expect(await screen.findByText('Mã xác thực đã được gửi')).toBeInTheDocument()
  expect(screen.getByText('driver@example.test')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Gửi lại sau 60s' })).toBeDisabled()
  expect(screen.getByText(/có hiệu lực 5 phút/)).toBeInTheDocument()
})
it('stops claiming delivery when the destination email changes', async () => {
  vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  mount(); fireEvent.change(emailInput(), { target: { value: 'a@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' })); await screen.findByText('Mã xác thực đã được gửi')
  fireEvent.change(emailInput(), { target: { value: 'b@example.test' } })
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
})
it('keeps forgot-password response generic and uses the reset OTP endpoint', async () => {
  const request = vi.spyOn(apiClient, 'request').mockResolvedValue({ data: { data: { expiresInSeconds: 300, resendAfterSeconds: 60 } } })
  mount('forgot'); fireEvent.change(emailInput(), { target: { value: 'unknown@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByText(/Nếu email đã đăng ký/)).toBeInTheDocument()
  expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/v1/auth/forgot-password/otp', data: { email: 'unknown@example.test' } }))
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
})
it('reports delivery failure and leaves resend available without a success notice', async () => {
  vi.spyOn(apiClient, 'request').mockRejectedValue(new Error('Chưa gửi được email.'))
  mount(); fireEvent.change(emailInput(), { target: { value: 'a@example.test' } })
  await userEvent.click(screen.getByRole('button', { name: 'Gửi mã qua email' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Chưa gửi được email.')
  expect(screen.queryByText('Mã xác thực đã được gửi')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Gửi mã qua email' })).toBeEnabled()
})
