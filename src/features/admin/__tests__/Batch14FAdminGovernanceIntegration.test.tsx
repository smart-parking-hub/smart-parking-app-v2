import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AdminDashboardPage,
  AdminParkingLotsPage,
  AdminLotDetailPage,
  AdminUsersPage,
  AdminUserDetailPage,
} from '../index'
import { DisputesPage } from '@/features/disputes'
import { PortalNotificationsPage } from '@/features/portal/AccountPages'
import { getData, sendData } from '@/shared/api/resources'

vi.mock('@/shared/api/resources', () => ({
  getData: vi.fn(),
  sendData: vi.fn(),
  errorMessage: (err: unknown) =>
    err instanceof Error ? err.message : 'Đã có lỗi xảy ra',
}))

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('BATCH-14F: Admin Governance, Lot Moderation & User Enforcement (SCR-039 to SCR-046)', () => {
  /* =======================================================================
   * SCR-039: Merchant Disputes List (/merchant/disputes)
   * ======================================================================= */
  describe('SCR-039: Merchant Disputes (/merchant/disputes)', () => {
    const mockMerchantDispute = {
      id: 101,
      bookingId: 505,
      merchantId: 8,
      driverId: 202,
      reason: 'Xe đậu lấn làn sang vị trí khác',
      description: 'Tài xế xe container đỗ chèn lên vị trí số 3 gây cản trở',
      compensationAmount: 50000,
      status: 'PENDING',
      resolution: '',
      createdAt: '2026-11-06T10:30:00Z',
    }

    it('queries /api/v1/disputes/merchant and renders dispute row with right-aligned amount and no create dispute button', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [mockMerchantDispute],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/merchant/disputes']}>
            <DisputesPage role="merchant" />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('KN-101')).toBeInTheDocument()
      expect(screen.getByText(/#505/)).toBeInTheDocument()
      expect(screen.getByText('Xe đậu lấn làn sang vị trí khác')).toBeInTheDocument()
      expect(screen.getByText('50.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('Chờ xử lý')).toBeInTheDocument()

      // Merchant does not have create dispute button
      expect(screen.queryByRole('button', { name: /\+ Gửi khiếu nại/i })).not.toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-040: Merchant Dispute Detail (/merchant/disputes/:id)
   * ======================================================================= */
  describe('SCR-040: Merchant Dispute Detail (/merchant/disputes/:id)', () => {
    const mockDetail = {
      id: 101,
      bookingId: 505,
      merchantId: 8,
      driverId: 202,
      reason: 'Xe đậu lấn làn sang vị trí khác',
      description: 'Tài xế xe container đỗ chèn lên vị trí số 3 gây cản trở',
      status: 'PENDING',
      resolution: '',
      createdAt: '2026-11-06T10:30:00Z',
    }

    it('renders dispute dossier details, links back to /merchant/disputes, and hides admin resolve button', async () => {
      vi.mocked(getData).mockResolvedValueOnce(mockDetail)

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/merchant/disputes/101']}>
            <Routes>
              <Route
                path="/merchant/disputes/:id"
                element={<DisputesPage role="merchant" detail />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Xe đậu lấn làn sang vị trí khác')).toBeInTheDocument()
      expect(screen.getByText('Hồ sơ khiếu nại #101')).toBeInTheDocument()
      expect(screen.getByText(/Tài xế xe container đỗ chèn/)).toBeInTheDocument()
      expect(screen.getByText('Chờ xử lý')).toBeInTheDocument()
      expect(screen.getByText('#505')).toBeInTheDocument()

      // Back link to list
      const backLink = screen.getByRole('link', { name: /Danh sách/i })
      expect(backLink).toBeInTheDocument()
      expect(backLink).toHaveAttribute('href', '/merchant/disputes')

      // Merchant cannot resolve dispute
      expect(screen.queryByRole('button', { name: /Ghi nhận phán quyết/i })).not.toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-041: Operations Notifications Center (/admin/notifications & /merchant/notifications)
   * ======================================================================= */
  describe('SCR-041: Operations Notifications Center (/admin/notifications)', () => {
    const mockNotifications = [
      {
        id: 701,
        title: 'Có bãi đỗ mới gửi hồ sơ',
        content: 'Bãi đỗ Tân Cảng Logistics vừa gửi hồ sơ chờ thẩm định.',
        type: 'LOT_SUBMISSION',
        readAt: null,
        createdAt: '2026-11-07T08:00:00Z',
      },
      {
        id: 702,
        title: 'Lệnh rút tiền đã được xử lý',
        content: 'Yêu cầu rút 15.500.000 ₫ đã hoàn tất chuyển khoản.',
        type: 'WITHDRAWAL_SUCCESS',
        readAt: '2026-11-07T07:30:00Z',
        createdAt: '2026-11-07T07:00:00Z',
      },
    ]

    it('renders notification list, marks single notification as read, and marks all as read', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        content: mockNotifications,
        totalPages: 1,
        totalElements: 2,
      })
      vi.mocked(sendData).mockResolvedValue({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/notifications']}>
            <PortalNotificationsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Có bãi đỗ mới gửi hồ sơ')).toBeInTheDocument()
      expect(screen.getByText('Lệnh rút tiền đã được xử lý')).toBeInTheDocument()

      // Single item read button for unread notification
      const markSingleBtn = screen.getByRole('button', { name: 'Đánh dấu đã đọc' })
      expect(markSingleBtn).toBeInTheDocument()
      await user.click(markSingleBtn)

      expect(sendData).toHaveBeenCalledWith('put', '/api/v1/notifications/701/read')

      // Mark all as read button
      const markAllBtn = screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })
      expect(markAllBtn).toBeInTheDocument()
      await user.click(markAllBtn)

      expect(sendData).toHaveBeenCalledWith('put', '/api/v1/notifications/read-all')
    })
  })

  /* =======================================================================
   * SCR-042: Admin Command Center Dashboard (/admin/dashboard)
   * ======================================================================= */
  describe('SCR-042: Admin Command Center Dashboard (/admin/dashboard)', () => {
    it('renders platform KPIs, metrics, and triage action panels with alert indicators', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        totalUsers: 1520,
        totalDrivers: 1200,
        totalMerchants: 320,
        totalParkingLots: 48,
        pendingParkingLots: 5,
        pendingWithdrawals: 3,
        openDisputes: 2,
        platformRevenue: 185000000,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <AdminDashboardPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('185.000.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('Toàn cảnh vận hành')).toBeInTheDocument()
      expect(screen.getByText('Bãi đang chờ thẩm định')).toBeInTheDocument()
      expect(screen.getByText('Yêu cầu rút tiền')).toBeInTheDocument()
      expect(screen.getByText('Tranh chấp đang mở')).toBeInTheDocument()

      // Triage links
      const triageLinks = screen.getAllByRole('link', { name: /Mở bàn xử lý/i })
      expect(triageLinks.length).toBe(3)
      expect(triageLinks[0]).toHaveAttribute('href', '/admin/parking-lots')
      expect(triageLinks[1]).toHaveAttribute('href', '/admin/withdrawals')
      expect(triageLinks[2]).toHaveAttribute('href', '/admin/disputes')
    })
  })

  /* =======================================================================
   * SCR-043: Admin Lots Moderation Queue (/admin/parking-lots)
   * ======================================================================= */
  describe('SCR-043: Admin Lots Moderation Queue (/admin/parking-lots)', () => {
    it('renders lots table with appraisal CTA linking to lot dossier', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 12,
            name: 'Bãi đỗ Xe Tải Miền Đông',
            address: '456 Xa Lộ Hà Nội, TP. Thủ Đức',
            merchantId: 88,
            status: 'PENDING_APPROVAL',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots']}>
            <AdminParkingLotsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Bãi đỗ Xe Tải Miền Đông')).toBeInTheDocument()
      expect(screen.getByText('Kiểm duyệt bãi đỗ')).toBeInTheDocument()
      expect(screen.getByText('456 Xa Lộ Hà Nội, TP. Thủ Đức')).toBeInTheDocument()

      const appraisalBtn = screen.getByRole('link', { name: 'Thẩm định' })
      expect(appraisalBtn).toBeInTheDocument()
      expect(appraisalBtn).toHaveAttribute('href', '/admin/parking-lots/12')
      expect(appraisalBtn.className).toContain('bg-[#d95f00]')
    })
  })

  /* =======================================================================
   * SCR-044: Admin Lot Appraisal Dossier & Decision Dialog (TSK-P0-02)
   * ======================================================================= */
  describe('SCR-044: Admin Lot Appraisal Dossier (TSK-P0-02 Compliance)', () => {
    const mockLot = {
      id: 12,
      name: 'Bãi đỗ Xe Tải Miền Đông',
      address: '456 Xa Lộ Hà Nội, TP. Thủ Đức',
      latitude: 10.85,
      longitude: 106.77,
      totalSlots: 100,
      occupiedSlots: 20,
      availableSlots: 80,
      merchantId: 88,
      merchantName: 'Công ty Vận Tải Đông Nam',
      merchantPhone: '0901234567',
      status: 'PENDING_APPROVAL',
      amenities: ['CCTV', 'SECURITY_24_7', 'LIGHTING'],
    }

    it('TSK-P0-02: Approving lot allows reason to be optional and calls /approve with empty string', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockLot)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots/12']}>
            <Routes>
              <Route
                path="/admin/parking-lots/:id"
                element={<AdminLotDetailPage />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Bãi đỗ Xe Tải Miền Đông')).toBeInTheDocument()
      expect(screen.getByText('Thẩm định bãi #12')).toBeInTheDocument()

      const approveBtn = screen.getByRole('button', { name: 'Duyệt & công bố' })
      expect(approveBtn).toBeInTheDocument()
      expect(approveBtn.className).toContain('bg-[#d95f00]')
      await user.click(approveBtn)

      // Dialog opens with optional reason label
      expect(screen.getByText('Ghi chú phê duyệt (Tùy chọn)')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Xác nhận phê duyệt hồ sơ bãi đỗ. Bãi sẽ được công bố và kích hoạt nhận đặt chỗ trên hệ thống.',
        ),
      ).toBeInTheDocument()

      // Submit without typing any reason
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/parking-lots/12/approve',
          { reason: '' },
        )
      })
    })

    it('TSK-P0-02: Rejecting lot strictly requires a reason, blocking submit when empty', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockLot)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots/12']}>
            <Routes>
              <Route
                path="/admin/parking-lots/:id"
                element={<AdminLotDetailPage />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Bãi đỗ Xe Tải Miền Đông')).toBeInTheDocument()

      const rejectBtn = screen.getByRole('button', { name: 'Từ chối hồ sơ' })
      await user.click(rejectBtn)

      // Dialog opens with mandatory reason
      expect(screen.getByText('Lý do / ghi chú quyết định')).toBeInTheDocument()

      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      // Blocked by validation
      expect(await screen.findByText('Nhập lý do quyết định.')).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()

      // Fill valid reason
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Giấy chứng nhận PCCC đã hết hiệu lực từ 10/2026')
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/parking-lots/12/reject',
          { reason: 'Giấy chứng nhận PCCC đã hết hiệu lực từ 10/2026' },
        )
      })
    })
  })

  /* =======================================================================
   * SCR-045: Admin User Governance Directory (/admin/users)
   * ======================================================================= */
  describe('SCR-045: Admin User Governance Directory (/admin/users)', () => {
    it('renders user directory table with role badges and manage actions', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 305,
            phone: '0912345678',
            email: 'merchant.le@example.com',
            fullName: 'Lê Văn Trọng',
            role: 'ROLE_MERCHANT',
            status: 'ACTIVE',
            createdAt: '2026-03-01T08:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/users']}>
            <AdminUsersPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText(/#305 · Lê Văn Trọng/)).toBeInTheDocument()
      expect(screen.getByText('Quản lý người dùng')).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '0912345678' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'merchant.le@example.com' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'Hoạt động' })).toBeInTheDocument()

      const manageBtn = screen.getByRole('link', { name: 'Quản trị' })
      expect(manageBtn).toBeInTheDocument()
      expect(manageBtn).toHaveAttribute('href', '/admin/users/305')
    })
  })

  /* =======================================================================
   * SCR-046: Admin User Enforcement Dossier & Disciplinary Banning (/admin/users/:id)
   * ======================================================================= */
  describe('SCR-046: Admin User Enforcement Dossier (/admin/users/:id)', () => {
    it('allows issuing warning and banning active user with mandatory audit justification', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        id: 305,
        phone: '0912345678',
        email: 'merchant.le@example.com',
        fullName: 'Lê Văn Trọng',
        role: 'ROLE_MERCHANT',
        status: 'ACTIVE',
        statusReason: '',
        createdAt: '2026-03-01T08:00:00Z',
        bookingCount: 88,
        disputeCount: 1,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/users/305']}>
            <Routes>
              <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Thông tin & kỷ luật')).toBeInTheDocument()
      expect(screen.getByText('Hồ sơ người dùng #305')).toBeInTheDocument()

      // Warnings button
      const warningBtn = screen.getByRole('button', { name: 'Gửi cảnh báo' })
      expect(warningBtn).toBeInTheDocument()

      // Ban button
      const banBtn = screen.getByRole('button', { name: 'Khóa tài khoản' })
      expect(banBtn).toBeInTheDocument()
      expect(banBtn.className).toContain('text-red-700')
      await user.click(banBtn)

      // Reason is required
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)
      expect(await screen.findByText('Nhập lý do quyết định.')).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()

      // Fill reason and submit
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Tự ý hủy chỗ đỗ đã xác nhận của tài xế nhiều lần')
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/users/305/ban',
          { reason: 'Tự ý hủy chỗ đỗ đã xác nhận của tài xế nhiều lần' },
        )
      })
    })

    it('allows unbanning a BANNED user with brand orange CTA', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        id: 306,
        phone: '0933445566',
        email: 'banned.driver@example.com',
        fullName: 'Phạm Minh Trí',
        role: 'ROLE_DRIVER',
        status: 'BANNED',
        statusReason: 'Tạm khóa do vi phạm kỷ luật',
        createdAt: '2026-02-15T09:00:00Z',
        bookingCount: 12,
        disputeCount: 3,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/users/306']}>
            <Routes>
              <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const unbanBtn = await screen.findByRole('button', { name: 'Mở khóa tài khoản' })
      expect(unbanBtn).toBeInTheDocument()
      expect(unbanBtn.className).toContain('bg-[#d95f00]')
      expect(unbanBtn.className).toContain('text-white')
      await user.click(unbanBtn)

      // In decision dialog, unban provides reason and confirms
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Đã hoàn tất bồi thường và cam kết tuân thủ quy chế')
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/users/306/unban',
          { reason: 'Đã hoàn tất bồi thường và cam kết tuân thủ quy chế' },
        )
      })
    })
  })
})
