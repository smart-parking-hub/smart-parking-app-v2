import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AdminTransactionsPage,
  AdminWithdrawalsPage,
  AdminAuditLogsPage,
} from '../index'
import { DisputesPage } from '@/features/disputes'
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

describe('BATCH-14G: Admin Finance, Arbitration Tribunal & Security Audit (SCR-047 to SCR-053)', () => {
  /* =======================================================================
   * SCR-047: Admin Financial Transactions & Reconciliation Ledger (/admin/transactions)
   * ======================================================================= */
  describe('SCR-047: Admin Financial Transactions Ledger (/admin/transactions)', () => {
    const mockTransaction = {
      id: 901,
      transactionCode: 'TXN-20261107-001',
      bookingCode: 'BK-88899',
      amount: 120000,
      type: 'DEPOSIT',
      gateway: 'PAYOS',
      bookingId: 12,
      payerUserId: 21,
      payerPhone: 'USER#21',
      merchantId: 31,
      updatedAt: '2026-11-07T09:00:00',
      status: 'SUCCESS',
      merchantName: 'Bãi xe Logistics Cát Lái',
      createdAt: '2026-11-07T08:15:00Z',
    }

    it('renders transaction ledger table and loads transaction detail dialog', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValueOnce({
        content: [mockTransaction],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/transactions']}>
            <AdminTransactionsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect((await screen.findAllByText('TXN-20261107-001'))[0]).toBeInTheDocument()
      expect(screen.getAllByText('BK-88899')[0]).toBeInTheDocument()
      expect(screen.getAllByText('120.000 ₫')[0]).toBeInTheDocument()

      const auditBtn = screen.getAllByRole('button', { name: /Xem chi tiết giao dịch/ })[0]
      expect(auditBtn).toBeInTheDocument()
      vi.mocked(getData).mockResolvedValueOnce(mockTransaction)
      await user.click(auditBtn)

      expect(await screen.findByText('Chi tiết giao dịch')).toBeInTheDocument()
      expect(screen.getByText('Số tiền giao dịch')).toBeInTheDocument()
      expect(screen.getByText('Bãi xe Logistics Cát Lái')).toBeInTheDocument()
      expect(screen.getAllByText('PAYOS')[0]).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-048: Admin Merchant Payout Authorization Desk (/admin/withdrawals)
   * ======================================================================= */
  describe('SCR-048: Admin Merchant Payout Authorization Desk (/admin/withdrawals)', () => {
    const mockWithdrawal = {
      id: 55,
      merchantName: 'Công ty Cổ phần Vận tải Tân Cảng',
      amount: 25000000,
      status: 'PENDING',
      requestedAt: '2026-11-07T09:00:00Z',
      bankName: 'MBBank Chi nhánh Sài Gòn',
      maskedBankAccount: '**** 9988',
      accountHolderName: 'CTY CP VAN TAI TAN CANG',
      decisionReason: '',
    }

    it('displays pending withdrawal with beneficiary bank details and allows approving payout', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        content: [mockWithdrawal],
        totalPages: 1,
        totalElements: 1,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/withdrawals']}>
            <AdminWithdrawalsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('#55')).toBeInTheDocument()
      expect(screen.getByText('Công ty Cổ phần Vận tải Tân Cảng')).toBeInTheDocument()
      expect(screen.getByText('25.000.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('MBBank Chi nhánh Sài Gòn')).toBeInTheDocument()

      const approveBtn = screen.getByRole('button', { name: 'Duyệt chi' })
      expect(approveBtn).toBeInTheDocument()
      expect(approveBtn.className).toContain('bg-[#d95f00]')
      await user.click(approveBtn)

      // Payout modal displays full bank verification info
      expect(await screen.findByText('Lệnh rút tiền #55')).toBeInTheDocument()
      expect(screen.getByText('CTY CP VAN TAI TAN CANG')).toBeInTheDocument()
      expect(screen.getByText('**** 9988')).toBeInTheDocument()

      // Fill bank confirmation ref note
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Đã đối soát ủy nhiệm chi VCB-FT261107001')

      // Confirm payout
      const confirmBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(confirmBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/withdrawals/55/approve',
          { reason: 'Đã đối soát ủy nhiệm chi VCB-FT261107001' },
        )
      })
    })

    it('requires a reason when rejecting a withdrawal payout', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        content: [mockWithdrawal],
        totalPages: 1,
        totalElements: 1,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/withdrawals']}>
            <AdminWithdrawalsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('#55')).toBeInTheDocument()

      const rejectBtn = screen.getByRole('button', { name: 'Từ chối' })
      await user.click(rejectBtn)

      // Rejection requires reason
      const confirmBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(confirmBtn)
      expect(await screen.findByText('Nhập lý do quyết định.')).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()

      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Tài khoản thụ hưởng không khớp với tên doanh nghiệp đăng ký')
      await user.click(confirmBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/withdrawals/55/reject',
          { reason: 'Tài khoản thụ hưởng không khớp với tên doanh nghiệp đăng ký' },
        )
      })
    }, 15000)
  })

  /* =======================================================================
   * SCR-049: Admin Disputes Arbitration Docket (/admin/disputes)
   * ======================================================================= */
  describe('SCR-049: Admin Disputes Arbitration Docket (/admin/disputes)', () => {
    it('queries /api/v1/disputes/admin and renders list of disputes with docket IDs and status', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 201,
            bookingId: 889,
            driverId: 105,
            merchantId: 12,
            reason: 'Thu thêm phụ phí không thông báo',
            amount: 75000,
            status: 'PENDING',
            createdAt: '2026-11-07T08:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/disputes']}>
            <DisputesPage role="admin" />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('KN-201')).toBeInTheDocument()
      expect(screen.getByText('#889')).toBeInTheDocument()
      expect(screen.getByText('Thu thêm phụ phí không thông báo')).toBeInTheDocument()
      expect(screen.getByText('75.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('Chờ xử lý')).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-050: Admin Dispute Judicial Dossier (/admin/disputes/:id)
   * ======================================================================= */
  describe('SCR-050: Admin Dispute Judicial Dossier (/admin/disputes/:id)', () => {
    const mockDispute = {
      id: 201,
      bookingId: 889,
      driverId: 105,
      merchantId: 12,
      reason: 'Thu thêm phụ phí không thông báo',
      description: 'Bãi thu thêm 75.000đ tiền lưu đêm ngoài giá hợp đồng.',
      status: 'PENDING',
      resolution: '',
      createdAt: '2026-11-07T08:00:00Z',
    }

    it(
      'renders dispute dossier, enters judicial resolution, and issues binding verdict',
      async () => {
        const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockDispute)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/disputes/201']}>
            <Routes>
              <Route
                path="/admin/disputes/:id"
                element={<DisputesPage role="admin" detail />}
              />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Thu thêm phụ phí không thông báo')).toBeInTheDocument()
      expect(screen.getByText(/Bãi thu thêm 75.000đ/)).toBeInTheDocument()

      const resolveBtn = screen.getByRole('button', { name: 'Ghi nhận phán quyết' })
      expect(resolveBtn).toBeInTheDocument()
      expect(resolveBtn.className).toContain('bg-[#d95f00]')
      await user.click(resolveBtn)

      // Dialog opens
      expect(await screen.findByText('Phán quyết khiếu nại')).toBeInTheDocument()
      const textarea = screen.getByPlaceholderText('Nhập phán quyết và giải pháp xử lý tranh chấp...')
      await user.type(
        textarea,
        'Yêu cầu bãi hoàn trả 75.000đ cho tài xế và kiểm điểm nhân viên trực cổng.',
      )

      const submitBtn = screen.getByRole('button', { name: 'Xác nhận phán quyết' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/disputes/201/resolve',
          {
            resolution:
              'Yêu cầu bãi hoàn trả 75.000đ cho tài xế và kiểm điểm nhân viên trực cổng.',
          },
        )
      })
    }, 15000)
  })

  /* =======================================================================
   * SCR-051: Platform System Audit Logs Trail (/admin/audit-logs)
   * ======================================================================= */
  describe('SCR-051: Platform System Audit Logs Trail (/admin/audit-logs)', () => {
    it('queries /api/v1/admin/audit-logs and renders immutable audit records', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 1001,
            actorUserId: 1,
            action: 'ADMIN_BAN_USER',
            targetType: 'USER',
            targetId: 305,
            detail: 'Khóa tài khoản do vi phạm điều khoản hủy đặt chỗ',
            result: 'SUCCESS',
            createdAt: '2026-11-07T10:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/audit-logs']}>
            <AdminAuditLogsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      const actorBadges = await screen.findAllByText('Actor #1')
      expect(actorBadges.length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('ADMIN_BAN_USER').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/USER #305/).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Khóa tài khoản do vi phạm điều khoản hủy đặt chỗ').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Thành công').length).toBeGreaterThanOrEqual(1)
    })
  })

  /* =======================================================================
   * SCR-052: Admin Operations Notifications Center (/admin/notifications)
   * ======================================================================= */
  describe('SCR-052: Admin Operations Notifications Center (/admin/notifications)', () => {
    it('queries /api/v1/notifications and marks all as read', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        content: [
          {
            id: 880,
            title: 'Hồ sơ bãi đỗ mới',
            content: 'Bãi đỗ Tân Cảng Logistics đang chờ duyệt.',
            type: 'LOT_SUBMISSION',
            readAt: null,
            createdAt: '2026-11-07T08:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 1,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/notifications']}>
            <PortalNotificationsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Hồ sơ bãi đỗ mới')).toBeInTheDocument()
      const markAllBtn = screen.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })
      await user.click(markAllBtn)

      expect(sendData).toHaveBeenCalledWith('put', '/api/v1/notifications/read-all')
    })
  })

  /* =======================================================================
   * SCR-053: Admin Security Credentials & Profile (/admin/profile)
   * ======================================================================= */
  describe('SCR-053: Admin Security Credentials & Profile (/admin/profile)', () => {
    const mockProfile = {
      fullName: 'Quản Trị Viên Hệ Thống',
      email: 'admin@smartparkinghub.com',
      phone: '0909000111',
      address: 'TP. Hồ Chí Minh',
      emergencyContact: '0909000999',
    }

    it('queries /api/v1/users/me, saves contact info, and updates administrative password', async () => {
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

      expect(await screen.findByDisplayValue('Quản Trị Viên Hệ Thống')).toBeInTheDocument()
      expect(screen.getByText('Thông tin cá nhân')).toBeInTheDocument()
      expect(screen.getByText('Đổi mật khẩu')).toBeInTheDocument()

      // Update contact info
      const saveBtn = screen.getByRole('button', { name: 'Lưu hồ sơ' })
      expect(saveBtn).toBeInTheDocument()
      expect(saveBtn.className).toContain('bg-[#d95f00]')
      await user.click(saveBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith('put', '/api/v1/users/me', mockProfile)
      })

      // Update password
      const oldPassInput = screen.getByLabelText('Mật khẩu hiện tại')
      const newPassInput = screen.getByLabelText('Mật khẩu mới')
      await user.type(oldPassInput, 'AdminPass@123')
      await user.type(newPassInput, 'NewSecurePass@2026')

      const changePassBtn = screen.getByRole('button', { name: 'Cập nhật mật khẩu' })
      await user.click(changePassBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith('post', '/api/v1/users/me/password', {
          currentPassword: 'AdminPass@123',
          newPassword: 'NewSecurePass@2026',
        })
      })
    })
  })
})
