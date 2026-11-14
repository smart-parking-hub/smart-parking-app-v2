import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AdminUsersPage,
  AdminUserDetailPage,
  AdminTransactionsPage,
  AdminWithdrawalsPage,
} from '../index'
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

describe('GROUP 11 - Admin User Governance & Financial Settlement Ledger', () => {
  describe('AdminWithdrawalsPage (SCR-048 & Payout-Confirmation-Dialog-Polish)', () => {
    const mockWithdrawal = {
      id: 88,
      merchantName: 'Công ty Kho Bãi Sài Gòn',
      amount: 15500000,
      status: 'PENDING',
      requestedAt: '2026-11-05T08:30:00Z',
      processedAt: '',
      decisionReason: '',
      bankName: 'Vietcombank Chi nhánh Tân Định',
      maskedBankAccount: '**** 5678',
      accountHolderName: 'CTY CP KHO BAI SAI GON',
    }

    it('renders withdrawal ledger table with right-aligned amount and bank info', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [mockWithdrawal],
        totalPages: 1,
        totalElements: 1,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/withdrawals']}>
            <AdminWithdrawalsPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('#88')).toBeInTheDocument()
      expect(screen.getByText('Công ty Kho Bãi Sài Gòn')).toBeInTheDocument()
      expect(screen.getByText('15.500.000 ₫')).toBeInTheDocument()
      expect(screen.getByText('Vietcombank Chi nhánh Tân Định')).toBeInTheDocument()
      expect(screen.getByText(/5678/)).toBeInTheDocument()

      const approveBtn = screen.getByRole('button', { name: 'Duyệt chi' })
      expect(approveBtn).toBeInTheDocument()
      expect(approveBtn.className).toContain('bg-[#d95f00]')
      expect(approveBtn.className).toContain('text-white')

      const rejectBtn = screen.getByRole('button', { name: 'Từ chối' })
      expect(rejectBtn).toBeInTheDocument()
    })

    it('AC1: displays full beneficiary bank details (bank name, masked account, account holder, amount) in confirmation dialog before approve', async () => {
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

      const approveBtn = await screen.findByRole('button', { name: 'Duyệt chi' })
      await user.click(approveBtn)

      // Dialog opens with full bank payout confirmation card
      expect(screen.getByText('Lệnh rút tiền #88')).toBeInTheDocument()
      expect(screen.getByText('CTY CP KHO BAI SAI GON')).toBeInTheDocument()
      expect(screen.getAllByText('Vietcombank Chi nhánh Tân Định').length).toBeGreaterThanOrEqual(2)
      expect(screen.getAllByText(/5678/).length).toBeGreaterThanOrEqual(2)
      expect(
        screen.getByText(/Vui lòng kiểm tra kỹ số tài khoản và ngân hàng thụ hưởng trước khi bấm xác nhận chuyển tiền/i),
      ).toBeInTheDocument()

      // Fill in payout audit reason
      const textarea = screen.getByPlaceholderText(/Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i)
      await user.type(textarea, 'Đã đối soát ủy nhiệm chi VCB-FT261105001')

      // Submit
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/withdrawals/88/approve',
          { reason: 'Đã đối soát ủy nhiệm chi VCB-FT261105001' },
        )
      })
    })
  })

  describe('AdminTransactionsPage (SCR-047 & Table-Numeric-Alignment)', () => {
    const mockTransaction = {
      id: 501,
      transactionCode: 'TXN-9021-X1',
      bookingCode: 'BK-CATLAI-091',
      amount: 450000,
      type: 'DEPOSIT',
      gateway: 'PAYOS',
      bookingId: 12,
      payerUserId: 21,
      payerPhone: 'USER#21',
      merchantId: 31,
      updatedAt: '2026-11-07T09:00:00',
      status: 'SUCCESS',
      merchantName: 'Bãi xe Container Tân Cảng',
      createdAt: '2026-11-06T14:20:00Z',
    }

    it('AC2: renders transaction table with right-aligned amount and loads detail dialog on "Xem chi tiết"', async () => {
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

      expect((await screen.findAllByText('TXN-9021-X1'))[0]).toBeInTheDocument()
      expect(screen.getAllByText('BK-CATLAI-091')[0]).toBeInTheDocument()

      // Amount cell check
      const amountEl = screen.getAllByText('450.000 ₫')[0]
      expect(amountEl).toBeInTheDocument()
      expect(amountEl.className).toContain('tabular-nums')

      // Load the authoritative transaction detail
      const auditBtn = screen.getAllByRole('button', { name: /Xem chi tiết giao dịch/ })[0]
      expect(auditBtn).toBeInTheDocument()
      vi.mocked(getData).mockResolvedValueOnce(mockTransaction)
      await user.click(auditBtn)

      // Dialog opens
      expect(
        await screen.findByText('Chi tiết giao dịch'),
      ).toBeInTheDocument()
      expect(screen.getByText('Số tiền giao dịch')).toBeInTheDocument()
      expect(screen.getByText('Bãi xe Container Tân Cảng')).toBeInTheDocument()
      expect(screen.getAllByText('PAYOS')[0]).toBeInTheDocument()
      expect(screen.getAllByText('Đặt cọc').length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('AdminUsersPage & AdminUserDetailPage (SCR-045 & SCR-046)', () => {
    it('renders user list table and navigation links', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 202,
            phone: '0988776655',
            email: 'driver.hoang@example.com',
            fullName: 'Hoàng Văn Nam',
            role: 'ROLE_DRIVER',
            status: 'ACTIVE',
            createdAt: '2026-01-15T09:00:00Z',
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

      expect(await screen.findByRole('cell', { name: '#202 · Hoàng Văn Nam' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '0988776655' })).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: 'driver.hoang@example.com' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Quản trị tài khoản #202' })).toHaveAttribute('href', '/admin/users/202')

      const manageLink = screen.getByRole('link', { name: 'Quản trị' })
      expect(manageLink).toBeInTheDocument()
      expect(manageLink).toHaveAttribute('href', '/admin/users/202')
    })

    it('renders user detail with disciplinary actions and allows banning active user', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue({
        id: 202,
        phone: '0988776655',
        email: 'driver.hoang@example.com',
        fullName: 'Hoàng Văn Nam',
        role: 'ROLE_DRIVER',
        status: 'ACTIVE',
        statusReason: 'Tài khoản bình thường',
        createdAt: '2026-01-15T09:00:00Z',
        bookingCount: 15,
        disputeCount: 0,
      })
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/users/202']}>
            <Routes>
              <Route path="/admin/users/:id" element={<AdminUserDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Thông tin & kỷ luật')).toBeInTheDocument()

      // Banning button
      const banBtn = screen.getByRole('button', { name: 'Khóa tài khoản' })
      expect(banBtn).toBeInTheDocument()
      expect(banBtn.className).toContain('text-red-700')
      await user.click(banBtn)

      // Dialog opens
      expect(screen.getByText('Lý do / ghi chú quyết định')).toBeInTheDocument()
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa/i,
      )
      await user.type(textarea, 'Vi phạm quy chế đặt chỗ quá hạn không nhận slot')

      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/users/202/ban',
          { reason: 'Vi phạm quy chế đặt chỗ quá hạn không nhận slot' },
        )
      })
    })

    it('renders "Mở khóa tài khoản" with brand orange button when user status is BANNED', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        id: 203,
        phone: '0977665544',
        email: 'banned.user@example.com',
        fullName: 'Trần Văn Tạm Khóa',
        role: 'ROLE_DRIVER',
        status: 'BANNED',
        statusReason: 'Tạm khóa do khiếu nại',
        createdAt: '2026-02-10T10:00:00Z',
        bookingCount: 5,
        disputeCount: 2,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/users/203']}>
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
    })
  })
})
