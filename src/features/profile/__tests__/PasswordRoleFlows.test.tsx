import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import { MerchantProfilePage } from '@/features/merchant/profile'
import { ProfilePage } from '../pages/ProfilePage'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }))
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { merchantId: 7, userId: 12, fullName: 'Test', phone: '0901234567' } } })
})
afterEach(cleanup)

describe.each(['merchant', 'driver'] as const)('%s password flow', role => {
  function mount() {
    const cache = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
    render(<QueryClientProvider client={cache}><MemoryRouter>{role === 'merchant' ? <MerchantProfilePage /> : <ProfilePage />}</MemoryRouter></QueryClientProvider>)
    return cache
  }
  async function fill(next = 'new-pass-123', confirmation = next, current = 'current-pass') {
    await screen.findByLabelText('Mật khẩu hiện tại')
    for (const [label, value] of [['Mật khẩu hiện tại', current], ['Mật khẩu mới', next], ['Xác nhận mật khẩu mới', confirmation]]) {
      fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
    }
  }
  const submit = () => fireEvent.submit(screen.getByLabelText('Mật khẩu hiện tại').closest('form')!)

  it('blocks blank current password, length violations, whitespace and mismatched confirmation', async () => {
    mount()
    for (const [next, confirmation, current] of [
      ['new-pass-123', 'new-pass-123', ''], ['short', 'short', 'old'],
      ['x'.repeat(51), 'x'.repeat(51), 'old'], ['      ', '      ', 'old'],
      ['new-pass-123', 'mismatch', 'old'],
    ]) {
      await fill(next, confirmation, current)
      submit()
      await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0))
    }
    expect(apiClient.post).not.toHaveBeenCalled()
  })

  it.each(['123456', 'x'.repeat(50), ' new-pass '])('accepts boundary lengths and preserves password characters (%s)', async next => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: null } })
    const cache = mount()
    await fill(next)
    submit()
    expect(await screen.findByText('Đã đổi mật khẩu thành công.')).toBeVisible()
    expect(apiClient.post).toHaveBeenCalledExactlyOnceWith('/api/v1/users/me/password', { currentPassword: 'current-pass', newPassword: next })
    for (const label of ['Mật khẩu hiện tại', 'Mật khẩu mới', 'Xác nhận mật khẩu mới']) expect(screen.getByLabelText(label, { exact: true })).toHaveValue('')
    expect(cache.getMutationCache().getAll().every(mutation => mutation.state.variables === undefined)).toBe(true)
    fireEvent.change(screen.getByLabelText('Mật khẩu hiện tại'), { target: { value: 'another-current' } })
    await waitFor(() => expect(screen.queryByText('Đã đổi mật khẩu thành công.')).not.toBeInTheDocument())
  })

  it.each([400, 401, 403, 500])('shows server failure (%s) without false success or cached request credentials', async status => {
    const failure = Object.assign(new Error('request failed'), {
      isAxiosError: true,
      response: { status, data: { message: status === 400 ? 'Mật khẩu hiện tại không đúng' : 'Không thể đổi mật khẩu.' } },
      config: { data: JSON.stringify({ currentPassword: 'current-pass', newPassword: 'new-pass-123' }) },
    })
    vi.mocked(apiClient.post).mockRejectedValueOnce(failure).mockResolvedValueOnce({ data: { data: null } })
    const cache = mount()
    await fill()
    submit()
    expect(await screen.findByRole('alert')).toHaveTextContent(failure.response.data.message)
    expect(screen.queryByText('Đã đổi mật khẩu thành công.')).not.toBeInTheDocument()
    expect(failure.config.data).toBeUndefined()
    expect(cache.getMutationCache().getAll().every(mutation => mutation.state.variables === undefined)).toBe(true)
    await fill('new-pass-123', 'new-pass-123', 'correct-pass')
    submit()
    expect(await screen.findByText('Đã đổi mật khẩu thành công.')).toBeVisible()
  })

  it('locks fields and prevents repeated submission while awaiting the API', async () => {
    let resolve!: (response: unknown) => void
    vi.mocked(apiClient.post).mockImplementationOnce(() => new Promise(done => { resolve = done }))
    mount(); await fill(); submit()
    await waitFor(() => expect(screen.getByLabelText('Mật khẩu hiện tại')).toBeDisabled())
    submit(); submit()
    await act(async () => { await Promise.resolve() })
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    await act(async () => resolve({ data: { data: null } }))
    expect(await screen.findByText('Đã đổi mật khẩu thành công.')).toBeVisible()
  })
})
