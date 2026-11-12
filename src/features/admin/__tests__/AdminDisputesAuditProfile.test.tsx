import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { DisputesPage } from '@/features/disputes'
import { AdminAuditLogsPage } from '../index'
import { PortalNotificationsPage } from '@/features/notifications'
import { AdminProfilePage } from '../pages/AdminProfilePage'
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

describe('GROUP 12 - Admin Disputes Docket, Audit Trail & Security Profile', () => {
  describe('Admin Disputes Docket & Arbitration Tribunal (SCR-049 & SCR-050)', () => {
    const mockDispute = {
      id: 10,
      bookingId: 50,
      merchantId: 8,
      driverId: 102,
      reason: 'Thu phí quá giá niêm yết',
      description: 'Nhân viên bãi thu 50.000đ trong khi giá trên app là 20.000đ',
      status: 'PENDING',
      resolution: '',
      createdAt: '2026-11-06T09:00:00Z',
      updatedAt: '2026-11-06T09:00:00Z',
    }

    it('renders admin disputes list with dossier code, booking ID, reason and pending badge', async () => {
      vi.mocked(getData).mockResolvedValue({
        content: [mockDispute],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/disputes']}>
            <Routes>
              <Route path="/admin/disputes" element={<DisputesPage role="admin" />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const dossiers = await screen.findAllByText('KN-10')
      expect(dossiers.length).toBeGreaterThan(0)
      expect(screen.getAllByText(/#50/).length).toBeGreaterThan(0)
      expect(screen.getAllByText('Thu phí quá giá niêm yết').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Chờ xử lý').length).toBeGreaterThan(0)
    })

    it('AC1: Admin opens dispute detail, inputs arbitration verdict and closes file with RESOLVED status', async () => {
      const user = userEvent.setup()
      let disputeData = { ...mockDispute }

      vi.mocked(getData).mockImplementation(async () => disputeData)
      vi.mocked(sendData).mockImplementation(async (_method, _url, body) => {
        disputeData = {
          ...disputeData,
          status: 'RESOLVED',
          resolution: (body as { resolution: string }).resolution,
        }
        return disputeData
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/disputes/10']}>
            <Routes>
              <Route
                path="/admin/disputes/:id"
                element={<DisputesPage role="admin" detail />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Thu phí quá giá niêm yết')).toBeInTheDocument()
      expect(screen.getByText(/Nhân viên bãi thu 50.000đ/)).toBeInTheDocument()

      const resolveBtn = screen.getByRole('button', { name: 'Ghi nhận phán quyết' })
      expect(resolveBtn).toBeInTheDocument()
      expect(resolveBtn.className).toContain('bg-[#d95f00]')
      expect(resolveBtn.className).toContain('text-white')

      await user.click(resolveBtn)

      expect(screen.getByText('Phán quyết khiếu nại')).toBeInTheDocument()
      const textarea = screen.getByPlaceholderText('Nhập phán quyết và giải pháp xử lý tranh chấp...')
      expect(textarea).toBeInTheDocument()

      const submitBtn = screen.getByRole('button', { name: 'Xác nhận phán quyết' })
      expect(submitBtn.className).toContain('bg-[#d95f00]')
      expect(submitBtn.className).toContain('text-white')

      await user.type(
        textarea,
        'Yêu cầu bãi hoàn trả 30.000đ chênh lệch vào ví tài xế trong 24h.',
      )
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/disputes/10/resolve',
          { resolution: 'Yêu cầu bãi hoàn trả 30.000đ chênh lệch vào ví tài xế trong 24h.' },
        )
      })

      expect(await screen.findByText('Đã giải quyết')).toBeInTheDocument()
      expect(
        screen.getByText('Yêu cầu bãi hoàn trả 30.000đ chênh lệch vào ví tài xế trong 24h.'),
      ).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Ghi nhận phán quyết' })).not.toBeInTheDocument()
    })

    it('validates resolution text is required before submitting verdict', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({ ...mockDispute })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/disputes/10']}>
            <Routes>
              <Route
                path="/admin/disputes/:id"
                element={<DisputesPage role="admin" detail />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const resolveBtn = await screen.findByRole('button', { name: 'Ghi nhận phán quyết' })
      await user.click(resolveBtn)

      const submitBtn = screen.getByRole('button', { name: 'Xác nhận phán quyết' })
      await user.click(submitBtn)

      expect(await screen.findByText('Nhập nội dung giải quyết.')).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()
    })
  })

  describe('Merchant Disputes Tracking & Details (SCR-039 & SCR-040)', () => {
    const mockDispute = {
      id: 11,
      bookingId: 88,
      merchantId: 8,
      driverId: 105,
      reason: 'Xe bị chặn barie khi ra bãi',
      description: 'Lỗi nhận diện biển số nên barier không mở',
      status: 'RESOLVED',
      resolution: 'Đã cập nhật lại firmware camera nhận diện.',
      createdAt: '2026-11-06T10:00:00Z',
      updatedAt: '2026-11-06T11:00:00Z',
    }

    it('renders merchant disputes list querying merchant endpoint', async () => {
      vi.mocked(getData).mockResolvedValue({
        content: [mockDispute],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/merchant/disputes']}>
            <Routes>
              <Route path="/merchant/disputes" element={<DisputesPage role="merchant" />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const dossiers = await screen.findAllByText('KN-11')
      expect(dossiers.length).toBeGreaterThan(0)
      expect(getData).toHaveBeenCalledWith('/api/v1/disputes/merchant', expect.any(Object))
    })

    it('renders merchant dispute detail with resolution without admin verdict button', async () => {
      vi.mocked(getData).mockResolvedValue(mockDispute)

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/merchant/disputes/11']}>
            <Routes>
              <Route
                path="/merchant/disputes/:id"
                element={<DisputesPage role="merchant" detail />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Xe bị chặn barie khi ra bãi')).toBeInTheDocument()
      expect(screen.getByText('Đã cập nhật lại firmware camera nhận diện.')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Ghi nhận phán quyết' })).not.toBeInTheDocument()
    })
  })

  describe('AdminAuditLogsPage (SCR-051 & Immutable-Log-Card-View)', () => {
    const mockLogs = [
      {
        id: 1,
        actorUserId: 9,
        action: 'USER_LOCK',
        targetType: 'USER',
        targetId: 104,
        detail: 'Khóa tài khoản vi phạm chính sách bãi đỗ gian lận',
        result: 'SUCCESS',
        createdAt: '2026-11-06T08:00:00Z',
      },
      {
        id: 2,
        actorUserId: 12,
        action: 'WITHDRAWAL_APPROVE',
        targetType: 'WITHDRAWAL',
        targetId: 77,
        detail: 'Duyệt lệnh rút tiền hạn mức 10.000.000 ₫',
        result: 'SUCCESS',
        createdAt: '2026-11-06T08:15:00Z',
      },
    ]

    it('AC2: renders both audit logs table and responsive mobile card view displaying Actor ID, timestamp and result', async () => {
      vi.mocked(getData).mockResolvedValue({
        content: mockLogs,
        totalPages: 1,
        totalElements: 2,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/audit-logs']}>
            <AdminAuditLogsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const actorElements = await screen.findAllByText(/Actor #9/)
      expect(actorElements.length).toBeGreaterThanOrEqual(1)
      expect(getData).toHaveBeenCalledWith('/api/v1/admin/audit-logs', expect.any(Object))

      const actionElements = screen.getAllByText('USER_LOCK')
      expect(actionElements.length).toBeGreaterThanOrEqual(1)

      const successBadges = screen.getAllByText('Thành công')
      expect(successBadges.length).toBeGreaterThanOrEqual(2)

      expect(
        screen.getAllByText(/Khóa tài khoản vi phạm chính sách bãi đỗ gian lận/).length,
      ).toBeGreaterThanOrEqual(1)
    })
  })

  describe('PortalNotificationsPage (SCR-052)', () => {
    const mockNotifications = [
      {
        id: 1,
        title: 'Có bãi đỗ mới gửi thẩm định',
        content: 'Bãi xe Vạn Hạnh Mall đã nộp hồ sơ xin duyệt vận hành.',
        type: 'SYSTEM',
        readAt: null,
        createdAt: '2026-11-06T07:30:00Z',
      },
      {
        id: 2,
        title: 'Yêu cầu rút tiền mới',
        content: 'Chủ bãi Bến Thành vừa gửi yêu cầu rút 5.000.000 ₫.',
        type: 'FINANCE',
        readAt: '2026-11-06T07:40:00Z',
        createdAt: '2026-11-06T07:35:00Z',
      },
    ]

    it('AC3: renders "Đánh dấu tất cả đã đọc" button in brand orange and triggers PUT /read-all', async () => {
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

      const items = await screen.findAllByText('Có bãi đỗ mới gửi thẩm định')
      expect(items.length).toBeGreaterThanOrEqual(1)

      const markAllBtn = screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })
      expect(markAllBtn).toBeInTheDocument()
      expect(markAllBtn.className).toContain('bg-[#d95f00]')
      expect(markAllBtn.className).toContain('text-white')

      await user.click(markAllBtn)
      expect(sendData).toHaveBeenCalledWith('put', '/api/v1/notifications/read-all')
    })
  })

  describe('AdminProfilePage (SCR-053)', () => {
    const mockProfile = {
      fullName: 'Quản Trị Viên Trưởng',
      phone: '0909123456',
      email: 'admin@smartparkinghub.vn',
      emergencyContact: '0909999888',
      address: '77 Nguyễn Du, Q1, TP.HCM',
    }

    it('AC3: renders profile update and password change submit buttons in brand orange and handles submission', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockProfile)
      vi.mocked(sendData).mockResolvedValue({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/profile']}>
            <AdminProfilePage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const saveBtn = await screen.findByRole('button', { name: 'Lưu hồ sơ' })
      expect(saveBtn).toBeInTheDocument()
      expect(saveBtn.className).toContain('bg-[#d95f00]')
      expect(saveBtn.className).toContain('text-white')

      const passwordBtn = screen.getByRole('button', { name: 'Cập nhật mật khẩu' })
      expect(passwordBtn).toBeInTheDocument()
      expect(passwordBtn.className).toContain('bg-[#d95f00]')
      expect(passwordBtn.className).toContain('text-white')

      await user.click(saveBtn)
      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/users/me',
          expect.objectContaining({
            fullName: 'Quản Trị Viên Trưởng',
            email: 'admin@smartparkinghub.vn',
          }),
        )
      })
    })
  })
})
