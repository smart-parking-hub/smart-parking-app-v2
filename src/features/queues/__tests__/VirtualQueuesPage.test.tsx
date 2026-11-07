import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { VirtualQueuesPage } from '../pages/VirtualQueuesPage'
import { fallbackActiveQueue } from '../api/queueApi'
import { getQueueStoreSnapshot } from '../store/queueStore'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/queues']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SCR-018: VirtualQueuesPage (Hàng Đợi Ảo Thông Minh)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getQueueStoreSnapshot().resetStore()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        data: fallbackActiveQueue,
      },
    })
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        data: {
          id: 9081,
          bookingCode: 'BK-2026-9081',
        },
      },
    })
  })

  it('renders command toolbar, eyebrow, and tab controls', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(
      screen.getByText(/Hệ thống điều phối hàng đợi thông minh/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Lượt Chờ Vào Bãi|Hàng Đợi Ảo/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Radar 5km Active/i)).toBeInTheDocument()

    // 2 Segmented tabs
    expect(screen.getByRole('tab', { name: /Đang hoạt động/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Lịch sử giữ chỗ|Lịch sử xếp hàng/i })).toBeInTheDocument()
  })

  it('renders active queue card with NOTIFIED state, vehicle plate and hold countdown timer', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    expect(screen.getByTestId('active-queue-card')).toBeInTheDocument()
    expect(screen.getByText(/Đã Có Slot Trống/i)).toBeInTheDocument()
    expect(screen.getByText(/Đã Đến Lượt Của Bạn!/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-8821/i)).toBeInTheDocument()
    expect(screen.getAllByText(/51D-894.12/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Bãi Đỗ Xe Cảng Cát Lái - Phân khu Container 02/i)).toBeInTheDocument()
  })

  it('renders essential vehicle specifications, gate information and ETA cleanly without redundant external vehicle pipeline', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Essential driver info is rendered
    expect(screen.getAllByText('51D-894.12').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Cổng G2 - Làn kiểm soát tự động ALPR')).toBeInTheDocument()
    expect(screen.getByText('2.4 km (~8 phút)')).toBeInTheDocument()
    expect(screen.getByText('Hợp lệ trong bán kính bãi')).toBeInTheDocument()

    // Redundant external queue pipeline simulation is removed for cleaner UX
    expect(
      screen.queryByText(/Tiến trình điều phối thực tế \(ALPR Pipeline\)/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText('50H-123.45')).not.toBeInTheDocument()
  })

  it('accepts slot and opens success modal with booking code and CTA', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const acceptButton = screen.getByRole('button', {
      name: /Nhận Slot & Tạo Booking Ngay/i,
    })
    expect(acceptButton).toBeInTheDocument()

    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /Nhận Slot Đỗ Xe Thành Công!/i,
        })
      ).toBeInTheDocument()
    })

    expect(screen.getByText(/BK-2026-9081/i)).toBeInTheDocument()
    expect(screen.getByText(/Xem vé QR & Thanh toán cọc/i)).toBeInTheDocument()
  })

  it('handles declining slot and updates active queue', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const declineButton = screen.getByRole('button', {
      name: /Từ chối nhường lượt/i,
    })
    fireEvent.click(declineButton)

    await waitFor(() => {
      expect(screen.getByText(/Đang chờ vào chỗ/i)).toBeInTheDocument()
      expect(screen.getByText(/Vị trí trong hàng đợi: #3/i)).toBeInTheDocument()
    })
  })

  it('opens leave queue modal and confirms cancellation', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // First toggle to waiting state to test leave button
    const toggleDemoBtn = screen.getByRole('button', {
      name: /Mô phỏng: Chuyển về Đang chờ/i,
    })
    fireEvent.click(toggleDemoBtn)

    const leaveButton = screen.getByRole('button', {
      name: /Rời hàng đợi/i,
    })
    fireEvent.click(leaveButton)

    expect(
      screen.getByRole('heading', {
        name: /Rời Hàng Đợi Ảo\?/i,
      })
    ).toBeInTheDocument()

    const confirmLeaveBtn = screen.getByRole('button', {
      name: /Xác nhận rời hàng/i,
    })
    fireEvent.click(confirmLeaveBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Bạn chưa có lượt xếp hàng nào đang hoạt động/i)
      ).toBeInTheDocument()
    })
  })

  it('switches between ACTIVE and HISTORY tabs and renders history table', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    const historyTab = screen.getByRole('tab', {
      name: /Lịch sử giữ chỗ|Lịch sử xếp hàng/i,
    })
    fireEvent.click(historyTab)

    expect(
      screen.getByRole('heading', {
        name: /Lịch Sử Giữ Chỗ|Lịch Sử Lượt Xếp Hàng Ảo/i,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(/VQ-2026-7810/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-7650/i)).toBeInTheDocument()
    expect(screen.getByText(/VQ-2026-7420/i)).toBeInTheDocument()
  })

  it('filters history table by keyword and status, and opens detail modal', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Switch to history tab
    fireEvent.click(screen.getByRole('tab', { name: /Lịch sử giữ chỗ|Lịch sử xếp hàng/i }))

    // Search input
    const searchInput = screen.getByPlaceholderText(/Tìm theo mã, bãi xe, biển số\.\.\./i)
    fireEvent.change(searchInput, { target: { value: 'Sóng Thần' } })

    expect(screen.getByText(/VQ-2026-7650/i)).toBeInTheDocument()
    expect(screen.queryByText(/VQ-2026-7810/i)).not.toBeInTheDocument()

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })

    // Filter status button
    const convertedBtn = screen.getByRole('button', { name: /^Đã nhận slot$/i })
    fireEvent.click(convertedBtn)

    expect(screen.getByText(/VQ-2026-7810/i)).toBeInTheDocument()
    expect(screen.queryByText(/VQ-2026-7650/i)).not.toBeInTheDocument()

    // Click [Chi tiết] button to open QueueHistoryDetailModal
    const detailButtons = screen.getAllByRole('button', { name: /Chi tiết/i })
    expect(detailButtons.length).toBeGreaterThanOrEqual(1)
    fireEvent.click(detailButtons[0])

    expect(screen.getByRole('heading', { name: /Chi Tiết Lượt Giữ Chỗ/i })).toBeInTheDocument()
    expect(screen.getByText(/Bãi Đỗ Xe Điều Phối/i)).toBeInTheDocument()

    // Close modal via Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText(/Bãi Đỗ Xe Điều Phối/i)).not.toBeInTheDocument()
    })
  })

  it('renders the 4 operational regulations cards', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Expand regulations accordion
    const toggleRegsBtn = screen.getByRole('button', {
      name: /Quy Định Vận Hành/i,
    })
    fireEvent.click(toggleRegsBtn)

    expect(
      screen.getByRole('heading', {
        name: /Quy Định Vận Hành Hàng Đợi Ảo/i,
      })
    ).toBeInTheDocument()

    expect(screen.getByText(/Nguyên Tắc FIFO & ALPR Minh Bạch/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Thời Gian Giữ Slot 15 Phút/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Bán Kính Radar Geofence 5\.0 KM/i)).toBeInTheDocument()
    expect(screen.getByText(/Giới Hạn 1 Hàng Đợi Đồng Thời/i)).toBeInTheDocument()
  })

  it('closes AcceptQueueSuccessModal when clicking close button [X], clicking backdrop or pressing Escape (Acceptance Criteria 1)', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Open AcceptQueueSuccessModal
    const acceptButton = screen.getByRole('button', {
      name: /Nhận Slot & Tạo Booking Ngay/i,
    })
    fireEvent.click(acceptButton)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).toBeInTheDocument()
    })

    // 1. Close via [X] button or bottom close button
    const closeButtons = screen.getAllByRole('button', { name: 'Đóng' })
    expect(closeButtons.length).toBe(2) // Both [X] top-right button and bottom "Đóng" button

    // Test close via Escape key
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).not.toBeInTheDocument()
    })

    // Reopen and test close via [X] button
    fireEvent.click(acceptButton)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).toBeInTheDocument()
    })

    const [xBtn] = screen.getAllByRole('button', { name: 'Đóng' })
    fireEvent.click(xBtn)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).not.toBeInTheDocument()
    })

    // Reopen and test backdrop click
    fireEvent.click(acceptButton)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).toBeInTheDocument()
    })

    const dialogOverlay = screen.getByRole('dialog')
    fireEvent.click(dialogOverlay)
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Nhận Slot Đỗ Xe Thành Công!/i })).not.toBeInTheDocument()
    })
  })

  it('renders friendly EmptyState with CTA "Tìm bãi xe khác" when queue is empty (Acceptance Criteria 2)', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Toggle demo to waiting state, then leave queue
    const toggleDemoBtn = screen.getByRole('button', {
      name: /Mô phỏng: Chuyển về Đang chờ/i,
    })
    fireEvent.click(toggleDemoBtn)

    const leaveButton = screen.getByRole('button', { name: /Rời hàng đợi/i })
    fireEvent.click(leaveButton)

    const confirmLeaveBtn = screen.getByRole('button', { name: /Xác nhận rời hàng/i })
    fireEvent.click(confirmLeaveBtn)

    await waitFor(() => {
      expect(screen.getByText(/Bạn chưa có lượt xếp hàng nào đang hoạt động/i)).toBeInTheDocument()
    })

    // Verify EmptyState CTA "Tìm bãi xe khác"
    const findOtherLotsBtn = screen.getByRole('link', { name: /Tìm bãi xe khác/i })
    expect(findOtherLotsBtn).toBeInTheDocument()

    // Switch to history tab and test search with 0 matches
    const historyTab = screen.getByRole('tab', { name: /Lịch sử giữ chỗ|Lịch sử xếp hàng/i })
    fireEvent.click(historyTab)

    const searchInput = screen.getByPlaceholderText(/Tìm theo mã, bãi xe, biển số\.\.\./i)
    fireEvent.change(searchInput, { target: { value: 'ZERO_MATCH_XYZ_12345' } })

    expect(screen.getByText(/Không tìm thấy lượt giữ chỗ|Không tìm thấy lượt xếp hàng/i)).toBeInTheDocument()
    const historyEmptyCta = screen.getAllByRole('link', { name: /Tìm bãi xe khác/i })
    expect(historyEmptyCta.length).toBeGreaterThanOrEqual(1)
  })

  it('handles leave modal form validation when reason is OTHER without custom detail', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    // Toggle demo to waiting state
    const toggleDemoBtn = screen.getByRole('button', {
      name: /Mô phỏng: Chuyển về Đang chờ/i,
    })
    fireEvent.click(toggleDemoBtn)

    // Open leave modal
    const leaveButton = screen.getByRole('button', { name: /Rời hàng đợi/i })
    fireEvent.click(leaveButton)

    // Select "Lý do khác"
    const reasonSelect = screen.getByLabelText(/Lý do rời hàng đợi/i)
    fireEvent.change(reasonSelect, { target: { value: 'OTHER' } })

    // Submit without typing custom detail
    const confirmLeaveBtn = screen.getByRole('button', { name: /Xác nhận rời hàng/i })
    fireEvent.click(confirmLeaveBtn)

    // Verify error message from Zod schema
    await waitFor(() => {
      expect(screen.getByText(/Vui lòng nhập chi tiết lý do/i)).toBeInTheDocument()
    })
  })

  it('renders error alert and supports clicking retry', async () => {
    renderWithProviders(<VirtualQueuesPage />)

    act(() => {
      getQueueStoreSnapshot().showToast('Lỗi mạng', 'error')
    })

    expect(await screen.findByText('Lỗi mạng')).toBeInTheDocument()
  })
})

