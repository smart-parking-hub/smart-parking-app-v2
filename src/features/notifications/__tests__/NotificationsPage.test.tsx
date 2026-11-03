import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NotificationsPage } from '../pages/NotificationsPage'
import * as notificationApi from '../api/notificationApi'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('SCR-025: NotificationsPage (Trung Tâm Thông Báo Driver Ops)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn()
    }
  })

  it('renders command hero, real-time ticker strip, status filter bar, and category chips', async () => {
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    // Wait for content after skeleton
    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    // Header & Ticker
    expect(
      screen.getByText(/LUỒNG SỰ KIỆN THỜI GIAN THỰC/i)
    ).toBeInTheDocument()

    // Header buttons
    expect(
      screen.getByRole('button', { name: /ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /BẬT THÔNG BÁO ĐẨY WEB PUSH 24\/7/i })
    ).toBeInTheDocument()

    // Status filter buttons
    expect(screen.getByRole('button', { name: /^Tất cả \(\d+\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Chưa đọc/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Quan trọng & Khẩn cấp/i })
    ).toBeInTheDocument()

    // Category chips
    expect(screen.getByRole('button', { name: /Tất cả sự kiện/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hàng đợi ảo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đặt chỗ & Barie/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Thanh toán & HĐĐT/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Cảnh báo lộ trình/i })).toBeInTheDocument()

    // Profile Sidebar Nav (Cấu hình tài khoản vận hành)
    expect(screen.getByText('CẤU HÌNH TÀI KHOẢN VẬN HÀNH')).toBeInTheDocument()
    expect(screen.getByText('Thông tin cá nhân & Giấy phép')).toBeInTheDocument()
    expect(screen.getByText('Đội xe của tôi')).toBeInTheDocument()
    expect(screen.getByText('3 XE')).toBeInTheDocument()
    expect(screen.getByText('Lịch sử cước & Hóa đơn VAT')).toBeInTheDocument()
    expect(screen.getByText('18 HÓA ĐƠN')).toBeInTheDocument()
    expect(screen.getByText('Đổi mật khẩu bảo mật')).toBeInTheDocument()
    expect(screen.getByText('Thiết lập thông báo hệ thống')).toBeInTheDocument()

    // Sidebar Cards
    expect(screen.getByText('Kênh Nhận Tin Driver')).toBeInTheDocument()
    expect(screen.getByText('Thống Kê Vận Hành Hôm Nay')).toBeInTheDocument()
    expect(screen.getByText('Gặp Trục Trặc Nhận Slot?')).toBeInTheDocument()
    expect(screen.getByText(/HOTLINE: 1900 6868/i)).toBeInTheDocument()
  })

  it('filters notifications by status (unread and urgent)', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    // Initial items visible
    expect(
      screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)
    ).toBeInTheDocument()

    // Filter by Unread
    const unreadTab = screen.getByRole('button', { name: /Chưa đọc/i })
    await user.click(unreadTab)

    // Read item should not be in the unread list
    expect(
      screen.queryByText(/HOÀN CỌC THÀNH CÔNG 100.000 ₫ VỀ TÀI KHOẢN GỐC/i)
    ).not.toBeInTheDocument()

    // Filter by Urgent
    const urgentTab = screen.getByRole('button', { name: /Quan trọng & Khẩn cấp/i })
    await user.click(urgentTab)

    // Urgent item should be visible
    expect(
      screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /CẢNH BÁO TĨNH KHÔNG/i })
    ).toBeInTheDocument()
  })

  it('filters notifications by category chips', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    // Click Queue Alerts category
    const queueChip = screen.getByRole('button', { name: /Hàng đợi ảo/i })
    await user.click(queueChip)

    expect(
      screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)
    ).toBeInTheDocument()
    // Gate event should be filtered out
    expect(
      screen.queryByText(/BARIE VÀO BÃI ĐÃ MỞ — CHECK-IN THÀNH CÔNG/i)
    ).not.toBeInTheDocument()

    // Click Payments category
    const paymentChip = screen.getByRole('button', { name: /Thanh toán & HĐĐT/i })
    await user.click(paymentChip)

    expect(
      screen.getByText(/ĐÃ ĐỒNG BỘ HÓA ĐƠN ĐIỆN TỬ VAT/i)
    ).toBeInTheDocument()
  })

  it('marks an unread notification as read on click', async () => {
    const user = userEvent.setup()
    const markSpy = vi.spyOn(notificationApi, 'markAsReadApi')

    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const unreadCard = screen
      .getByText(/ĐÃ ĐỒNG BỘ HÓA ĐƠN ĐIỆN TỬ VAT/i)
      .closest('article')
    expect(unreadCard).toHaveAttribute('data-row-status', 'unread')

    if (unreadCard) {
      await user.click(unreadCard)
    }

    expect(markSpy).toHaveBeenCalledWith(3)
    await waitFor(() => {
      expect(unreadCard).toHaveAttribute('data-row-status', 'read')
    })
  })

  it('marks all notifications as read via header button', async () => {
    const user = userEvent.setup()
    const markAllSpy = vi.spyOn(notificationApi, 'markAllAsReadApi')

    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const markAllBtn = screen.getByRole('button', {
      name: /ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC/i,
    })
    expect(markAllBtn).toBeEnabled()

    await user.click(markAllBtn)

    expect(markAllSpy).toHaveBeenCalled()

    // Unread count badge updates to 00
    await waitFor(() => {
      const unreadCountBadge = screen.getByRole('button', { name: /Chưa đọc/i })
      expect(unreadCountBadge).toHaveTextContent('00')
    })
  })

  it('handles Web Push 24/7 activation button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const webPushBtn = screen.getByRole('button', {
      name: /BẬT THÔNG BÁO ĐẨY WEB PUSH 24\/7/i,
    })
    await user.click(webPushBtn)

    expect(screen.getByText('ĐÃ KÍCH HOẠT PUSH 24/7')).toBeInTheDocument()
  })

  it('toggles notification channels in the sidebar', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const zaloToggle = screen.getByRole('switch', {
      name: /Bật tắt Zalo OA Điều Phối/i,
    })
    expect(zaloToggle).toHaveAttribute('aria-checked', 'false')

    await user.click(zaloToggle)

    expect(zaloToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('navigates to virtual queues when claiming slot', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const claimBtn = screen.getByRole('button', { name: /NHẬN SLOT NGAY/i })
    await user.click(claimBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/queues', {
      state: { claimBookingId: 1 },
    })
  })

  it('simulates downloading VAT invoice PDF', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    const downloadBtn = screen.getByRole('button', { name: /Tải file PDF HĐĐT/i })
    await user.click(downloadBtn)

    expect(downloadBtn).toBeInTheDocument()
  })

  it('handles pagination between pages', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    // Page 1 has 5 items
    expect(screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)).toBeInTheDocument()

    // Click Page 2
    const page2Btn = screen.getByRole('button', { name: '2' })
    await user.click(page2Btn)

    // Item from page 2 should now be visible
    expect(
      screen.getByText(/ĐÃ GIỮ CHỖ THÀNH CÔNG SLOT BERTH C-114 TẠI CÁT LÁI/i)
    ).toBeInTheDocument()
  })

  it('shows empty state and allows resetting filters', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
    })

    // Mark all as read first
    const markAllBtn = screen.getByRole('button', {
      name: /ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC/i,
    })
    await user.click(markAllBtn)

    // Then switch to unread tab
    const unreadTab = screen.getByRole('button', { name: /Chưa đọc/i })
    await user.click(unreadTab)

    // Should render empty state
    expect(
      screen.getByText('Không tìm thấy thông báo nào')
    ).toBeInTheDocument()

    // Click reset button
    const resetBtn = screen.getByRole('button', { name: /Xem tất cả thông báo/i })
    await user.click(resetBtn)

    // All notifications restored
    expect(
      screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)
    ).toBeInTheDocument()
  })

  it('falls back gracefully when API fails', async () => {
    vi.spyOn(notificationApi, 'fetchNotificationsApi').mockRejectedValueOnce(
      new Error('Network error')
    )

    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Trung Tâm Thông Báo')).toBeInTheDocument()
      expect(
        screen.getByText(/ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2/i)
      ).toBeInTheDocument()
    })
  })

  it('renders ProfileSidebarNav with active notifications tab and valid navigation links', async () => {
    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('CẤU HÌNH TÀI KHOẢN VẬN HÀNH')).toBeInTheDocument()
    })

    const profileLink = screen.getByText('Thông tin cá nhân & Giấy phép').closest('a')
    expect(profileLink).toHaveAttribute('href', '/profile')

    const vehiclesLink = screen.getByText('Đội xe của tôi').closest('a')
    expect(vehiclesLink).toHaveAttribute('href', '/vehicles')

    const paymentsLink = screen.getByText('Lịch sử cước & Hóa đơn VAT').closest('a')
    expect(paymentsLink).toHaveAttribute('href', '/payments')

    const passwordLink = screen.getByText('Đổi mật khẩu bảo mật').closest('a')
    expect(passwordLink).toHaveAttribute('href', '/change-password')

    // Notifications tab is active, not an anchor tag
    const notifActive = screen.getByText('Thiết lập thông báo hệ thống')
    expect(notifActive.closest('a')).toBeNull()
  })
})
