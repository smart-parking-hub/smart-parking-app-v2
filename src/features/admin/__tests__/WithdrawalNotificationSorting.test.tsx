import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { getData } from '@/shared/api/resources'
import { AdminWithdrawalsPage } from '../index'
import { AdminNotificationsPage } from '../pages/AdminNotificationsPage'
import { PortalNotificationsPage } from '@/features/notifications'
import type { ReactNode } from 'react'

vi.mock('@/shared/api/resources', async original => ({
  ...await original<typeof import('@/shared/api/resources')>(), getData: vi.fn(), sendData: vi.fn(),
}))

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(getData).mockImplementation(async url => url.endsWith('unread-count') ? 0 : {
    content: [], totalPages: 0, totalElements: 0, currentPage: 0,
  })
})
afterEach(cleanup)

function mount(child: ReactNode) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>{child}</MemoryRouter>
  </QueryClientProvider>)
}

it('requests withdrawal amount ordering from the server, starting at page zero', async () => {
  mount(<AdminWithdrawalsPage />)
  await waitFor(() => expect(getData).toHaveBeenCalledWith('/api/v1/admin/withdrawals', {
    page: 0, size: 20, sort: 'requestedAt,desc',
  }))
  fireEvent.change(screen.getByLabelText('Sắp xếp yêu cầu rút tiền'), { target: { value: 'amount,asc' } })
  await waitFor(() => expect(getData).toHaveBeenCalledWith('/api/v1/admin/withdrawals', {
    page: 0, size: 20, sort: 'amount,asc',
  }))
})

it.each([
  ['merchant', <PortalNotificationsPage />], ['admin', <AdminNotificationsPage />],
])('requests oldest first notifications for %s through the API', async (_role, child) => {
  mount(child)
  await waitFor(() => expect(getData).toHaveBeenCalled())
  fireEvent.change(screen.getByLabelText('Sắp xếp thông báo'), { target: { value: 'createdAt,asc' } })
  await waitFor(() => expect(vi.mocked(getData).mock.calls.some(([url, params]) =>
    url === '/api/v1/notifications' && (params as { sort?: string; page?: number })?.sort === 'createdAt,asc'
    && (params as { page?: number }).page === 0)).toBe(true))
})

it('returns to the first notification page when the ordering changes', async () => {
  vi.mocked(getData).mockImplementation(async url => url.endsWith('unread-count') ? 1 : {
    content: [{ id: 1, title: 'Tin kiểm thử', content: 'Nội dung', readAt: null, createdAt: '2026-11-13T12:00:00' }],
    totalPages: 2, totalElements: 21, currentPage: 0,
  })
  mount(<AdminNotificationsPage />)
  await screen.findByRole('article', { name: 'Tin kiểm thử' })
  fireEvent.click(screen.getByRole('button', { name: 'Trang sau' }))
  await waitFor(() => expect(vi.mocked(getData).mock.calls.some(([, params]) =>
    (params as { page?: number })?.page === 1)).toBe(true))
  fireEvent.change(screen.getByLabelText('Sắp xếp thông báo'), { target: { value: 'createdAt,asc' } })
  await waitFor(() => expect(getData).toHaveBeenCalledWith('/api/v1/notifications', {
    page: 0, size: 20, sort: 'createdAt,asc',
  }, expect.any(Object)))
})
