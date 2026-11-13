import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getData, sendData } from '@/shared/api/resources'
import { SESSION_EVENT } from '@/features/auth'
import { AdminNotificationsPage } from '../pages/AdminNotificationsPage'
import type { AdminNotification } from '../api/adminNotifications'

vi.mock('@/shared/api/resources', async importOriginal => ({
  ...await importOriginal<typeof import('@/shared/api/resources')>(),
  getData: vi.fn(),
  sendData: vi.fn(),
}))

const endpoint = '/api/v1/notifications'
const clients: QueryClient[] = []
let items: AdminNotification[]

function notification(id: number, read = false): AdminNotification {
  return {
    id, title: `Thông báo ${id}`, content: `Nội dung thông báo ${id}`,
    readAt: read ? '2026-11-12T08:00:00' : null,
    createdAt: '2026-11-12T07:30:00',
  }
}

function pageResponse(page = 0) {
  return {
    content: items.slice(page * 20, (page + 1) * 20),
    currentPage: page, totalPages: Math.ceil(items.length / 20), totalElements: items.length,
  }
}

function mockRequests() {
  vi.mocked(getData).mockImplementation(async (url, params) => url.endsWith('unread-count')
    ? items.filter(item => item.readAt == null).length
    : pageResponse((params as { page: number }).page))
  vi.mocked(sendData).mockImplementation(async (_method, url) => {
    const id = url.match(/\/(\d+)\/read$/)?.[1]
    items = items.map(item => (!id || item.id === Number(id)) ? { ...item, readAt: '2026-11-12T08:00:00' } : item)
    return undefined
  })
}

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } } })
  clients.push(client)
  return { client, ...render(<QueryClientProvider client={client}><AdminNotificationsPage /></QueryClientProvider>) }
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(done => { resolve = done })
  return { promise, resolve }
}

beforeEach(() => {
  vi.resetAllMocks()
  localStorage.setItem('access_token', 'test-session-a')
  items = [notification(1), notification(2, true)]
  mockRequests()
})
afterEach(() => {
  cleanup()
  for (const client of clients.splice(0)) client.clear()
  localStorage.clear()
})

describe('SCR-052 Admin notifications', () => {
  it('shows a loading skeleton and disables bulk actions until data settles', async () => {
    const pending = deferred<ReturnType<typeof pageResponse>>()
    vi.mocked(getData).mockImplementation(async url => url === endpoint ? pending.promise : 1)
    mount()
    expect(screen.getByRole('status', { name: 'Đang tải thông báo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
    await act(async () => pending.resolve(pageResponse()))
    expect(await screen.findByRole('article', { name: 'Thông báo 1' })).toBeInTheDocument()
  })

  it('renders API fields, dates and distinct read states without interpreting HTML', async () => {
    items[0].content = '<img src=x onerror=alert(1)>\nNội dung nhiều dòng'
    items[0].createdAt = [2026, 11, 12, 7, 30]
    mount()
    const row = await screen.findByRole('article', { name: 'Thông báo 1' })
    expect(within(row).getByText('Chưa đọc')).toBeInTheDocument()
    expect(within(row).getByText(/<img src=x onerror=alert\(1\)>/)).toBeInTheDocument()
    expect(row.querySelector('img')).toBeNull()
    expect(within(row).getByText(/12\/11\/2026/)).toBeInTheDocument()
    expect(within(screen.getByRole('article', { name: 'Thông báo 2' })).getAllByText('Đã đọc')[0]).toBeInTheDocument()
    expect(screen.getByText('1 thông báo chưa đọc')).toBeInTheDocument()
    expect(getData).toHaveBeenCalledWith(endpoint, { page: 0, size: 20 }, { signal: expect.any(AbortSignal) })
    expect(getData).toHaveBeenCalledWith(`${endpoint}/unread-count`, undefined, { signal: expect.any(AbortSignal) })
    expect(screen.getAllByRole('button', { name: /^Đánh dấu đã đọc:/ })).toHaveLength(1)
  })

  it('shows a successful empty state and disables mark-all at zero unread', async () => {
    items = []
    mount()
    expect(await screen.findByText('Bạn chưa có thông báo')).toBeInTheDocument()
    expect(screen.getByText('0 thông báo chưa đọc')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
  })

  it('retains access to history beyond 100 records with zero-based server pagination', async () => {
    const user = userEvent.setup()
    items = Array.from({ length: 101 }, (_, index) => notification(index + 1, true))
    mount()
    await screen.findByRole('article', { name: 'Thông báo 1' })
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled()
    for (let page = 1; page <= 5; page++) {
      await user.click(screen.getByRole('button', { name: 'Trang sau' }))
      await screen.findByRole('article', { name: `Thông báo ${page * 20 + 1}` })
    }
    expect(getData).toHaveBeenCalledWith(endpoint, { page: 5, size: 20 }, expect.any(Object))
    expect(screen.getByRole('button', { name: 'Trang sau' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Trang trước' }))
    expect(await screen.findByRole('article', { name: 'Thông báo 81' })).toBeInTheDocument()
  })

  it('marks all account notifications even when unread items are on another cached page', async () => {
    const user = userEvent.setup()
    items = Array.from({ length: 21 }, (_, index) => notification(index + 1, index < 20))
    mount()
    await screen.findByText('1 thông báo chưa đọc')
    await user.click(screen.getByRole('button', { name: 'Trang sau' }))
    await screen.findByRole('article', { name: 'Thông báo 21' })
    await user.click(screen.getByRole('button', { name: 'Trang trước' }))
    await screen.findByRole('article', { name: 'Thông báo 1' })
    expect(screen.queryByRole('button', { name: /^Đánh dấu đã đọc:/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }))
    await screen.findByText('0 thông báo chưa đọc')
    expect(sendData).toHaveBeenCalledExactlyOnceWith('put', `${endpoint}/read-all`)
    await user.click(screen.getByRole('button', { name: 'Trang sau' }))
    const last = await screen.findByRole('article', { name: 'Thông báo 21' })
    expect(within(last).getAllByText('Đã đọc')[0]).toBeInTheDocument()
  })

  it('supports keyboard read, prevents duplicate writes and waits for server confirmation', async () => {
    const user = userEvent.setup()
    const pending = deferred<void>()
    vi.mocked(sendData).mockImplementation(async () => {
      await pending.promise
      items[0] = { ...items[0], readAt: '2026-11-12T08:00:00' }
    })
    mount()
    const button = await screen.findByRole('button', { name: 'Đánh dấu đã đọc: Thông báo 1' })
    button.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(button).toBeDisabled())
    fireEvent.click(button)
    expect(sendData).toHaveBeenCalledExactlyOnceWith('put', `${endpoint}/1/read`)
    expect(within(screen.getByRole('article', { name: 'Thông báo 1' })).getByText('Chưa đọc')).toBeInTheDocument()
    await act(async () => pending.resolve())
    await screen.findByText('0 thông báo chưa đọc')
    expect(within(screen.getByRole('article', { name: 'Thông báo 1' })).getAllByText('Đã đọc')[0]).toBeInTheDocument()
  })

  it.each(['single', 'all'])('keeps unread state on a failed %s mutation and allows retry', async mode => {
    const user = userEvent.setup()
    vi.mocked(sendData).mockRejectedValueOnce(new Error('Kết nối gián đoạn'))
    mount()
    const name = mode === 'single' ? 'Đánh dấu đã đọc: Thông báo 1' : 'Đánh dấu tất cả đã đọc'
    await user.click(await screen.findByRole('button', { name }))
    await screen.findByText(/Kết nối gián đoạn/)
    expect(screen.getByText('1 thông báo chưa đọc')).toBeInTheDocument()
    expect(screen.queryByText('Đã cập nhật trạng thái đọc thông báo.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name }))
    await screen.findByText('0 thông báo chưa đọc')
    expect(sendData).toHaveBeenCalledTimes(2)
  })

  it('reports list failures separately from empty data and supports retry', async () => {
    const user = userEvent.setup()
    vi.mocked(getData).mockImplementation(async url => {
      if (url === endpoint) throw new Error('Không kết nối được máy chủ')
      return 1
    })
    mount()
    await screen.findByText('Không tải được thông báo')
    expect(screen.queryByText('Bạn chưa có thông báo')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
    mockRequests()
    await user.click(screen.getByRole('button', { name: 'Thử lại danh sách' }))
    expect(await screen.findByRole('article', { name: 'Thông báo 1' })).toBeInTheDocument()
  })

  it.each([new Error('Count unavailable'), 'invalid-count'])('never substitutes zero for an unavailable/invalid unread count (%s)', async failure => {
    const user = userEvent.setup()
    vi.mocked(getData).mockImplementation(async url => {
      if (url.endsWith('unread-count')) {
        if (failure instanceof Error) throw failure
        return failure
      }
      return pageResponse()
    })
    mount()
    await screen.findByText('Không tải được số thông báo chưa đọc')
    expect(screen.queryByText('0 thông báo chưa đọc')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeDisabled()
    mockRequests()
    await user.click(screen.getByRole('button', { name: 'Thử lại số chưa đọc' }))
    expect(await screen.findByText('1 thông báo chưa đọc')).toBeInTheDocument()
  })

  it('distinguishes a successful write from a failed refresh and recovers without resending', async () => {
    const user = userEvent.setup()
    let failRefresh = false
    vi.mocked(getData).mockImplementation(async url => {
      if (url === endpoint && failRefresh) throw new Error('Lỗi tải lại')
      return url === endpoint ? pageResponse() : items.filter(item => item.readAt == null).length
    })
    vi.mocked(sendData).mockImplementation(async () => {
      items = items.map(item => ({ ...item, readAt: '2026-11-12T08:00:00' }))
      failRefresh = true
    })
    mount()
    await user.click(await screen.findByRole('button', { name: 'Đánh dấu đã đọc: Thông báo 1' }))
    await screen.findByText('Đã ghi nhận thao tác, chưa làm mới được dữ liệu')
    expect(screen.queryByText('Đã cập nhật trạng thái đọc thông báo.')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đánh dấu đã đọc: Thông báo 1' })).toBeDisabled()
    failRefresh = false
    await user.click(screen.getByRole('button', { name: 'Thử lại danh sách' }))
    await screen.findByText('Đã cập nhật trạng thái đọc thông báo.')
    expect(sendData).toHaveBeenCalledTimes(1)
  })

  it('removes the previous account UI and isolates cache immediately on a same-role session change', async () => {
    const nextAccount = deferred<ReturnType<typeof pageResponse>>()
    const { client } = mount()
    await screen.findByRole('article', { name: 'Thông báo 1' })
    const previousScope = client.getQueryCache().getAll()[0].queryKey[1]
    vi.mocked(getData).mockImplementation(async url => url === endpoint ? nextAccount.promise : 0)
    act(() => {
      localStorage.setItem('access_token', 'test-session-b')
      window.dispatchEvent(new Event(SESSION_EVENT))
    })
    expect(screen.queryByRole('article', { name: 'Thông báo 1' })).not.toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Đang tải thông báo' })).toBeInTheDocument()
    items = [notification(999, true)]
    await act(async () => nextAccount.resolve(pageResponse()))
    expect(await screen.findByRole('article', { name: 'Thông báo 999' })).toBeInTheDocument()
    const keys = JSON.stringify(client.getQueryCache().getAll().map(query => query.queryKey))
    expect(keys).not.toContain('test-session-')
    expect(client.getQueryCache().getAll().every(query => query.queryKey[1] !== previousScope)).toBe(true)
  })

  it('does not send a queued mark-all request under a different account session', async () => {
    const user = userEvent.setup()
    const canceled = deferred<void>()
    const { client } = mount()
    await screen.findByText('1 thông báo chưa đọc')
    vi.spyOn(client, 'cancelQueries').mockReturnValueOnce(canceled.promise)
    await user.click(screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' }))
    act(() => {
      localStorage.setItem('access_token', 'test-session-b')
      window.dispatchEvent(new Event(SESSION_EVENT))
    })
    await act(async () => canceled.resolve())
    await waitFor(() => expect(client.getMutationCache().getAll().every(mutation => mutation.state.status !== 'pending')).toBe(true))
    expect(sendData).not.toHaveBeenCalled()
    expect(await screen.findByText('1 thông báo chưa đọc')).toBeInTheDocument()
  })
})
