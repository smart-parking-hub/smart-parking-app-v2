import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { apiClient } from '@/shared/api/client'
import type { BackendNotificationDto } from '@/entities/notification'
import { getNotificationStoreSnapshot } from '../store/notificationStore'
import { NotificationsPage } from '../pages/NotificationsPage'

const sampleDtos: BackendNotificationDto[] = [
  {
    id: 1,
    userId: 10,
    title: 'Đã có chỗ trống tại hàng đợi Cát Lái Gate 2',
    content: 'Xe 51D-894.12 đã đến lượt nhận slot đỗ container.',
    channel: 'PUSH',
    type: 'QUEUE',
    targetType: 'QUEUE',
    targetId: 701,
    readAt: null,
    createdAt: '2026-11-04T15:48:12Z',
  },
  {
    id: 2,
    userId: 10,
    title: 'Check-in ALPR thành công tại Sóng Thần 2',
    content: 'Barie vào bãi đã mở lúc 14:15 tại vị trí C-12.',
    channel: 'IN_APP',
    type: 'BOOKING',
    targetType: 'BOOKING',
    targetId: 8821,
    readAt: null,
    createdAt: [2026, 11, 4, 14, 15, 0],
  },
  {
    id: 3,
    userId: 10,
    title: 'Thanh toán tiền cọc PayOS hoàn tất',
    content: 'Giao dịch #TXN-9040 trị giá 100.000 đ đã được ghi nhận.',
    channel: 'IN_APP',
    type: 'PAYMENT',
    targetType: 'PAYMENT',
    targetId: 9040,
    readAt: '2026-11-04T10:35:00Z',
    createdAt: '2026-11-04T10:30:00Z',
  },
  {
    id: 4,
    userId: 10,
    title: 'Cập nhật hồ sơ khiếu nại #KN-55',
    content: 'Bộ phận hỗ trợ đã phản hồi yêu cầu đối chiếu cước.',
    channel: 'IN_APP',
    type: 'SYSTEM',
    targetType: 'DISPUTE',
    targetId: 55,
    readAt: '2026-11-03T09:15:00Z',
    createdAt: '2026-11-03T09:00:00Z',
  },
  {
    id: 5,
    userId: 10,
    title: 'Bảo trì bãi xe Tân Cảng khu B',
    content: 'Khu vực cân tải trọng bảo trì từ 23:00 đến 01:00.',
    channel: 'EMAIL',
    type: 'SYSTEM',
    targetType: 'PARKING_LOT',
    targetId: 12,
    readAt: '2026-11-02T08:00:00Z',
    createdAt: '2026-11-02T08:00:00Z',
  },
  {
    id: 6,
    userId: 10,
    title: 'Thông báo nâng cấp lịch bảo trì hệ thống',
    content: 'Hệ thống sẽ tạm bảo trì định kỳ lúc 02:00 sáng Chủ nhật.',
    channel: 'IN_APP',
    type: 'SYSTEM',
    targetType: null,
    targetId: null,
    readAt: '2026-11-01T08:00:00Z',
    createdAt: '2026-11-01T08:00:00Z',
  },
]

function LocationDisplay() {
  const location = useLocation()
  return (
    <div data-testid="location-probe">
      {location.pathname}::{JSON.stringify(location.state ?? null)}
    </div>
  )
}

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function renderNotificationsPage(client = createTestClient()) {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/notifications']}>
        <NotificationsPage />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function mockStandardNotificationsApi(
  items: BackendNotificationDto[] = sampleDtos,
  initialUnreadCount?: number,
) {
  let serverItems = items.map((item) => ({ ...item }))

  const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
    if (url.includes('/unread-count')) {
      const count =
        initialUnreadCount !== undefined &&
        serverItems.every((it, idx) => it.readAt === items[idx]?.readAt)
          ? initialUnreadCount
          : serverItems.filter((i) => !i.readAt).length
      return Promise.resolve({
        data: { code: 200, data: count },
      } as never)
    }
    return Promise.resolve({
      data: {
        code: 200,
        data: {
          content: serverItems,
          currentPage: 0,
          totalPages: 1,
          totalElements: serverItems.length,
        },
      },
    } as never)
  })

  const postSpy = vi.spyOn(apiClient, 'post').mockImplementation((url: string) => {
    const readMatch = url.match(/\/api\/v1\/notifications\/(\d+)\/read$/)
    if (readMatch) {
      const targetId = Number(readMatch[1])
      serverItems = serverItems.map((item) =>
        item.id === targetId ? { ...item, readAt: '2026-11-04T16:00:00Z' } : item,
      )
      return Promise.resolve({ data: { code: 200, message: 'Đã đọc' } } as never)
    }
    if (url.endsWith('/read-all')) {
      serverItems = serverItems.map((item) => ({
        ...item,
        readAt: item.readAt ?? '2026-11-04T16:00:00Z',
      }))
      return Promise.resolve({ data: { code: 200, message: 'Đã đọc tất cả' } } as never)
    }
    return Promise.resolve({ data: { code: 200, data: null } } as never)
  })

  return { getSpy, postSpy }
}

describe('SCR-025: NotificationsPage (Trung tâm thông báo tài xế)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    getNotificationStoreSnapshot().resetStore()
    window.scrollTo = vi.fn()
  })

  it('shows accessible loading skeleton inside Workspace while initial API request is pending', () => {
    vi.spyOn(apiClient, 'get').mockReturnValue(new Promise(() => {}) as never)

    renderNotificationsPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Trung tâm thông báo' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('notifications-skeleton')).toBeInTheDocument()
    expect(
      screen.getByRole('status', { name: /Đang tải danh sách thông báo/i }),
    ).toBeInTheDocument()
  })

  it('renders Workspace header, Gmail-style compact rows without sidebars or per-row CTA buttons', async () => {
    mockStandardNotificationsApi()

    renderNotificationsPage()

    expect(await screen.findByText('TÀI KHOẢN / THÔNG BÁO')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Trung tâm thông báo' }),
    ).toBeInTheDocument()

    // Compact rows rendered cleanly
    expect(
      await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Check-in ALPR thành công tại Sóng Thần 2'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Thanh toán tiền cọc PayOS hoàn tất'),
    ).toBeInTheDocument()

    // Formatted Jackson array timestamp [2026, 11, 4, 14, 15, 0]
    expect(screen.getAllByText(/04\/11\/2026/).length).toBeGreaterThanOrEqual(2)

    // ProfileSidebarNav & DriverQuickNavSidebarCard & Web Push button are all removed
    expect(screen.queryByText('Tài khoản tài xế')).not.toBeInTheDocument()
    expect(screen.queryByText('Điều Hướng Nghiệp Vụ')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Thông báo/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /WEB PUSH/i }),
    ).not.toBeInTheDocument()

    // No action CTA buttons directly rendered inside inbox rows
    expect(screen.queryByRole('link', { name: /Xem đặt chỗ/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Đến hàng đợi/i })).not.toBeInTheDocument()
  })

  it('renders ErrorState when initial API fails and recovers on Retry button click', async () => {
    const user = userEvent.setup()
    let failInitial = true

    vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
      if (url.includes('/unread-count')) {
        return Promise.resolve({ data: { code: 200, data: 2 } } as never)
      }
      if (failInitial) {
        return Promise.reject(new Error('Không thể kết nối máy chủ thông báo'))
      }
      return Promise.resolve({
        data: {
          code: 200,
          data: {
            content: sampleDtos,
            currentPage: 0,
            totalPages: 1,
            totalElements: sampleDtos.length,
          },
        },
      } as never)
    })

    renderNotificationsPage()

    expect(await screen.findByText('Không thể tải thông báo')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()

    failInitial = false
    await user.click(screen.getByRole('button', { name: /Thử lại/i }))

    expect(
      await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).toBeInTheDocument()
  })

  it('shows inline Error Alert banner without losing data if manual refresh fails after load', async () => {
    const user = userEvent.setup()
    let failNext = false

    vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
      if (url.includes('/unread-count')) {
        return Promise.resolve({ data: { code: 200, data: 2 } } as never)
      }
      if (failNext) {
        return Promise.reject(new Error('Timeout máy chủ'))
      }
      return Promise.resolve({
        data: {
          code: 200,
          data: {
            content: sampleDtos,
            currentPage: 0,
            totalPages: 1,
            totalElements: sampleDtos.length,
          },
        },
      } as never)
    })

    renderNotificationsPage()

    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    failNext = true
    await user.click(
      screen.getByRole('button', { name: 'Làm mới danh sách thông báo' }),
    )

    expect(
      await screen.findByText('Không thể làm mới danh sách thông báo'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).toBeInTheDocument()
  })

  it('filters by light segmented status tabs and backend NotificationTypeEnum chips', async () => {
    const user = userEvent.setup()
    mockStandardNotificationsApi()

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    // Segmented tab role="tab"
    const unreadTab = screen.getByRole('tab', { name: /Chưa đọc/i })
    await user.click(unreadTab)
    expect(unreadTab).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Thanh toán tiền cọc PayOS hoàn tất'),
    ).not.toBeInTheDocument()
    expect(screen.getByText(/Đang lọc trên/i)).toBeInTheDocument()

    // Reset via inline button
    await user.click(screen.getByRole('button', { name: /Xóa bộ lọc/i }))
    expect(screen.getByText('Thanh toán tiền cọc PayOS hoàn tất')).toBeInTheDocument()

    // Filter PAYMENT chip
    await user.click(screen.getByRole('button', { name: 'Thanh toán & Cước' }))
    expect(screen.getByText('Thanh toán tiền cọc PayOS hoàn tất')).toBeInTheDocument()
    expect(
      screen.queryByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).not.toBeInTheDocument()
  })

  it('validates search keyword with Zod + React Hook Form and filters matching items', async () => {
    const user = userEvent.setup()
    mockStandardNotificationsApi()

    renderNotificationsPage()
    await screen.findByText('Check-in ALPR thành công tại Sóng Thần 2')

    const searchInput = screen.getByRole('searchbox', { name: 'Tìm kiếm thông báo' })
    await user.type(searchInput, 'Sóng Thần')

    expect(
      screen.getByText('Check-in ALPR thành công tại Sóng Thần 2'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Thanh toán tiền cọc PayOS hoàn tất'),
    ).not.toBeInTheDocument()

    // Exceed max 100 chars triggers inline Zod error
    await user.clear(searchInput)
    const tooLong = 'a'.repeat(101)
    await user.type(searchInput, tooLong)

    expect(
      await screen.findByText('Từ khóa tìm kiếm tối đa 100 ký tự'),
    ).toBeInTheDocument()
  })

  it('opens Detail Modal on row click, auto-marks unread read via POST API, and shows CTA only when linked entity exists', async () => {
    const user = userEvent.setup()
    const { postSpy } = mockStandardNotificationsApi()

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    const queueRow = screen
      .getByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')
      .closest('li')
    expect(queueRow).toHaveAttribute('data-row-status', 'unread')

    // Click row to open modal and mark read
    await user.click(
      screen.getByRole('button', {
        name: /Đã có chỗ trống tại hàng đợi Cát Lái Gate 2/i,
      }),
    )

    expect(postSpy).toHaveBeenCalledWith('/api/v1/notifications/1/read')
    const dialog = await screen.findByRole('dialog')
    expect(
      within(dialog).getByText('Xe 51D-894.12 đã đến lượt nhận slot đỗ container.'),
    ).toBeInTheDocument()

    const queueAction = within(dialog).getByRole('link', { name: /Đến hàng đợi/i })
    expect(queueAction).toHaveAttribute('href', '/queues')

    await waitFor(() => {
      expect(queueRow).toHaveAttribute('data-row-status', 'read')
    })

    // Close modal via Esc or button and open a system notification without target entity
    await user.click(within(dialog).getByRole('button', { name: 'Đóng' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // Generic SYSTEM notification -> modal opens with full details and ZERO booking CTA buttons
    await user.click(
      screen.getByRole('button', {
        name: /Thông báo nâng cấp lịch bảo trì hệ thống/i,
      }),
    )
    const sysDialog = await screen.findByRole('dialog')
    expect(
      within(sysDialog).getByText(
        'Hệ thống sẽ tạm bảo trì định kỳ lúc 02:00 sáng Chủ nhật.',
      ),
    ).toBeInTheDocument()
    expect(
      within(sysDialog).queryByRole('link', { name: /Xem đặt chỗ/i }),
    ).not.toBeInTheDocument()
    expect(within(sysDialog).queryAllByRole('link')).toHaveLength(0)
  })

  it('deep-links modal CTA with router state when navigating from detail dialog', async () => {
    const user = userEvent.setup()
    mockStandardNotificationsApi()

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    await user.click(
      screen.getByRole('button', {
        name: /Đã có chỗ trống tại hàng đợi Cát Lái Gate 2/i,
      }),
    )
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('link', { name: /Đến hàng đợi/i }))

    expect(screen.getByTestId('location-probe')).toHaveTextContent(
      '/queues::{"targetQueueId":701}',
    )
  })

  it('rolls back optimistic update when auto-mark fails on click and allows retrying inside Detail Modal', async () => {
    const user = userEvent.setup()
    const { postSpy } = mockStandardNotificationsApi()
    postSpy.mockRejectedValueOnce(new Error('Lỗi hệ thống 500'))

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    const queueRow = screen
      .getByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')
      .closest('li')

    await user.click(
      screen.getByRole('button', {
        name: /Đã có chỗ trống tại hàng đợi Cát Lái Gate 2/i,
      }),
    )

    expect(await screen.findByText('Không thể đánh dấu đã đọc')).toBeInTheDocument()
    await waitFor(() => {
      expect(queueRow).toHaveAttribute('data-row-status', 'unread')
    })

    // Retry button is present in open Detail Modal since item is still unread
    const dialog = screen.getByRole('dialog')
    const retryMarkBtn = within(dialog).getByRole('button', {
      name: 'Đánh dấu đã đọc',
    })
    await user.click(retryMarkBtn)

    expect(
      await screen.findByText('Đã đánh dấu thông báo là đã đọc'),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(queueRow).toHaveAttribute('data-row-status', 'read')
    })
  })

  it('marks all notifications read via POST API, clears badge to 0 and disables button', async () => {
    const user = userEvent.setup()
    const { postSpy } = mockStandardNotificationsApi()

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    const markAllBtn = screen.getByRole('button', {
      name: /Đánh dấu tất cả đã đọc/i,
    })
    expect(markAllBtn).toBeEnabled()

    await user.click(markAllBtn)

    expect(postSpy).toHaveBeenCalledWith('/api/v1/notifications/read-all')
    expect(
      await screen.findByText('Đã đánh dấu tất cả thông báo là đã đọc'),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('unread-filter-count')).toHaveTextContent('0')
    })
    expect(markAllBtn).toBeDisabled()
  })

  it('supports server-side pagination with Spring page=0..N params', async () => {
    const user = userEvent.setup()
    const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url: string, config?: unknown) => {
      if (url.includes('/unread-count')) {
        return Promise.resolve({ data: { code: 200, data: 2 } } as never)
      }
      const reqPage = (config as { params?: { page?: number } } | undefined)?.params?.page ?? 0
      const pageItems: BackendNotificationDto[] =
        reqPage === 0
          ? sampleDtos.slice(0, 2)
          : [
              {
                id: 99,
                userId: 10,
                title: 'Thông báo trang 2 từ Backend',
                content: 'Nội dung trang 2 thực tế.',
                type: 'BOOKING',
                targetType: 'BOOKING',
                targetId: 99,
                readAt: null,
                createdAt: '2026-11-01T12:00:00Z',
              },
            ]

      return Promise.resolve({
        data: {
          code: 200,
          data: {
            content: pageItems,
            currentPage: reqPage,
            totalPages: 2,
            totalElements: 21,
          },
        },
      } as never)
    })

    renderNotificationsPage()
    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')

    expect(screen.getByText('Trang 1 / 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Trang sau' }))

    expect(
      await screen.findByText('Thông báo trang 2 từ Backend'),
    ).toBeInTheDocument()
    expect(screen.getByText('Trang 2 / 2')).toBeInTheDocument()
    expect(getSpy).toHaveBeenCalledWith(
      '/api/v1/notifications',
      expect.objectContaining({ params: { page: 1, size: 20 } }),
    )
  })

  it('renders distinct empty states for no-notifications, all-read, and filtered empty results', async () => {
    const user = userEvent.setup()

    // 1. no-notifications
    mockStandardNotificationsApi([], 0)
    const { unmount } = renderNotificationsPage()

    expect(await screen.findByText('Bạn chưa có thông báo nào')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tìm bãi đỗ ngay' })).toHaveAttribute(
      'href',
      '/parking',
    )
    unmount()

    // 2. all-read + filtered
    const allReadDtos = sampleDtos.map((d) => ({
      ...d,
      readAt: '2026-11-04T16:00:00Z',
    }))
    mockStandardNotificationsApi(allReadDtos, 0)
    renderNotificationsPage()

    await screen.findByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2')
    await user.click(screen.getByRole('tab', { name: /Chưa đọc/i }))

    expect(screen.getByText('Bạn đã đọc tất cả thông báo')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Xem tất cả thông báo' }))
    expect(
      screen.getByText('Đã có chỗ trống tại hàng đợi Cát Lái Gate 2'),
    ).toBeInTheDocument()

    // Filter with unmatched search keyword
    await user.type(
      screen.getByRole('searchbox', { name: 'Tìm kiếm thông báo' }),
      'không tồn tại XYZ',
    )
    expect(
      screen.getByText('Không tìm thấy thông báo phù hợp'),
    ).toBeInTheDocument()
  })
})
