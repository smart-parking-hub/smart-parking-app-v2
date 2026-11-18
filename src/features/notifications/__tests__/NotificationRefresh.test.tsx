import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { apiClient } from '@/shared/api/client'
import { getData } from '@/shared/api/resources'
import { PortalNotificationsPage } from '../pages/PortalNotificationsPage'
import { useNotificationsListQuery } from '../hooks/useNotificationsQuery'

vi.mock('@/shared/api/resources', async importOriginal => ({
  ...await importOriginal<typeof import('@/shared/api/resources')>(),
  getData: vi.fn(),
}))

afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks() })

function setup() {
  vi.useFakeTimers()
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
  return { client, wrapper }
}

describe('notification delivery refresh', () => {
  it('driver fetches new server records while the inbox stays open', async () => {
    const { client, wrapper } = setup()
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { data: { content: [], totalElements: 0, totalPages: 0 } } })
    renderHook(() => useNotificationsListQuery(1), { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(1) })
    expect(get).toHaveBeenCalledTimes(1)
    await act(async () => { await vi.advanceTimersByTimeAsync(15_000) })
    expect(get).toHaveBeenCalledTimes(2)
    client.clear()
  })

  it('merchant displays a newly delivered notification without reloading', async () => {
    const { client, wrapper } = setup()
    vi.mocked(getData).mockResolvedValueOnce({ content: [], totalElements: 0, totalPages: 0 })
      .mockResolvedValue({ content: [{ id: 11, title: 'Đơn đặt chỗ mới #99', content: 'Đã ghi vào DB', readAt: null, createdAt: '2026-11-17T15:00:00' }], totalElements: 1, totalPages: 1 })
    render(<PortalNotificationsPage />, { wrapper })
    await act(async () => { await vi.advanceTimersByTimeAsync(1) })
    expect(screen.queryByText('Đơn đặt chỗ mới #99')).not.toBeInTheDocument()
    await act(async () => { await vi.advanceTimersByTimeAsync(15_000) })
    expect(screen.getByText('Đơn đặt chỗ mới #99')).toBeInTheDocument()
    client.clear()
  })
})
