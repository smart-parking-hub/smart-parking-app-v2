import { act, cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { getData } from '@/shared/api/resources'
import { SESSION_EVENT } from '@/features/auth'
import { UnreadNotificationDot } from '../components/UnreadNotificationDot'

vi.mock('@/shared/api/resources', async original => ({
  ...await original<typeof import('@/shared/api/resources')>(), getData: vi.fn(),
}))
beforeEach(() => { vi.resetAllMocks(); localStorage.setItem('access_token', 'session-a') })
afterEach(cleanup)
function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  render(<QueryClientProvider client={client}><UnreadNotificationDot /></QueryClientProvider>)
  return client
}
it('shows the red dot for unread messages and removes it after read invalidation', async () => {
  vi.mocked(getData).mockResolvedValue(2)
  const client = mount()
  expect(await screen.findByRole('img', { name: 'Có thông báo chưa đọc' })).toHaveClass('bg-red-600')
  vi.mocked(getData).mockResolvedValue(0)
  await act(() => client.invalidateQueries({ queryKey: ['notification-indicator'] }))
  await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument())
})
it.each([0, -1, '2', null])('hides the dot for zero or invalid counts: %s', async count => {
  vi.mocked(getData).mockResolvedValue(count)
  mount()
  await waitFor(() => expect(getData).toHaveBeenCalled())
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
it('does not carry unread state into another session', async () => {
  vi.mocked(getData).mockResolvedValueOnce(3).mockResolvedValue(0)
  mount()
  await screen.findByRole('img')
  act(() => {
    localStorage.setItem('access_token', 'session-b')
    window.dispatchEvent(new Event(SESSION_EVENT))
  })
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  await waitFor(() => expect(getData).toHaveBeenCalledTimes(2))
})
