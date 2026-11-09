import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AdminDashboardPage,
  AdminParkingLotsPage,
  AdminLotDetailPage,
} from '../index'
import { AdminLayout } from '@/layouts/AdminLayout'
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

describe('GROUP 10 - Admin Parking Lots Moderation & Dashboard', () => {
  describe('AdminDashboardPage', () => {
    it('renders dashboard metrics and highlights pending alert badges when count > 0', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        totalUsers: 1500,
        totalDrivers: 1200,
        totalMerchants: 300,
        totalParkingLots: 45,
        pendingParkingLots: 4,
        pendingWithdrawals: 2,
        openDisputes: 1,
        platformRevenue: 150000000,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <AdminDashboardPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Bãi đang chờ thẩm định')).toBeInTheDocument()
      expect(screen.getByText('Yêu cầu rút tiền')).toBeInTheDocument()
      expect(screen.getByText('Tranh chấp đang mở')).toBeInTheDocument()

      // Check attention badges
      const alertBadges = screen.getAllByText('Cần xử lý')
      expect(alertBadges.length).toBe(3)

      // Check primary link buttons
      const links = screen.getAllByRole('link', { name: /Mở bàn xử lý/i })
      expect(links.length).toBe(3)
      expect(links[0]).toHaveAttribute('href', '/admin/parking-lots')
    })

    it('does not show "Cần xử lý" badges when alert counts are 0', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        totalUsers: 50,
        totalDrivers: 40,
        totalMerchants: 10,
        totalParkingLots: 5,
        pendingParkingLots: 0,
        pendingWithdrawals: 0,
        openDisputes: 0,
        platformRevenue: 5000000,
      })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <AdminDashboardPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      expect(await screen.findByText('Bãi đang chờ thẩm định')).toBeInTheDocument()
      expect(screen.queryByText('Cần xử lý')).not.toBeInTheDocument()
    })
  })

  describe('AdminParkingLotsPage', () => {
    it('renders table with "Xử lý" column and "Thẩm định" CTA button styled with brand orange', async () => {
      vi.mocked(getData).mockResolvedValueOnce({
        content: [
          {
            id: 101,
            name: 'Bãi xe Cát Lái Express',
            address: 'Đường Nguyễn Thị Định, Cát Lái, Q2',
            merchantId: 88,
            status: 'PENDING_APPROVAL',
            totalSlots: 100,
            availableSlots: 100,
            hourlyRate: 35000,
            overnightRate: 150000,
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

      expect(await screen.findByText('Bãi xe Cát Lái Express')).toBeInTheDocument()
      expect(screen.getByText('Đường Nguyễn Thị Định, Cát Lái, Q2')).toBeInTheDocument()
      expect(screen.getByText('#88')).toBeInTheDocument()

      const reviewCta = screen.getByRole('link', { name: /Thẩm định/i })
      expect(reviewCta).toBeInTheDocument()
      expect(reviewCta).toHaveAttribute('href', '/admin/parking-lots/101')
      expect(reviewCta.className).toContain('bg-[#d95f00]')
      expect(reviewCta.className).toContain('text-white')
    })
  })

  describe('AdminLotDetailPage & DecisionDialog (P0 Verification TSK-P0-02)', () => {
    const mockLot = {
      id: 101,
      name: 'Bãi xe Tân Cảng Logistics',
      address: 'Xích Thổ, TP Thủ Đức, TP HCM',
      merchantId: 77,
      merchantName: 'Công ty Vận Tải Đông Nam',
      merchantPhone: '0912345678',
      status: 'PENDING_APPROVAL',
      totalSlots: 80,
      availableSlots: 80,
      hourlyRate: 30000,
      overnightRate: 140000,
      slots: [],
      images: [],
    }

    it('TSK-P0-02: allows approving WITHOUT typing a reason (reason is optional)', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockLot)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots/101']}>
            <Routes>
              <Route path="/admin/parking-lots/:id" element={<AdminLotDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      // Wait for lot detail query to resolve
      const approveBtn = await screen.findByRole('button', { name: 'Duyệt & công bố' })
      expect(approveBtn).toBeInTheDocument()
      expect(approveBtn.className).toContain('bg-[#d95f00]')
      expect(approveBtn.className).toContain('text-white')
      await user.click(approveBtn)

      // Dialog opens
      expect(screen.getByText('Ghi chú phê duyệt (Tùy chọn)')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/Nhập ghi chú hoặc khuyến nghị cho chủ bãi \(không bắt buộc\)/i),
      ).toBeInTheDocument()

      // Submit immediately without typing anything in textarea
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      expect(submitBtn.className).toContain('bg-[#d95f00]')
      expect(submitBtn.className).toContain('text-white')
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/parking-lots/101/approve',
          { reason: '' },
        )
      })
      expect(await screen.findByRole('dialog', { name: 'Duyệt bãi thành công' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Xác nhận quyết định' })).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Đã hiểu' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('requires a reason when rejecting parking lot submission (validation error if empty)', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockLot)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots/101']}>
            <Routes>
              <Route path="/admin/parking-lots/:id" element={<AdminLotDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      // Wait for lot detail query to resolve
      const rejectBtn = await screen.findByRole('button', { name: 'Từ chối hồ sơ' })
      await user.click(rejectBtn)

      // Dialog opens with mandatory requirement
      expect(screen.getByText('Lý do / ghi chú quyết định')).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa bổ sung/i),
      ).toBeInTheDocument()

      // Try submitting without typing
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      // Validation error must appear, sendData must NOT be called
      expect(
        await screen.findByText('Nhập lý do quyết định.'),
      ).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()

      // Type rejection reason and submit
      const textarea = screen.getByPlaceholderText(
        /Nhập rõ lý do từ chối hoặc các điểm cần chỉnh sửa bổ sung/i,
      )
      await user.type(textarea, 'Hồ sơ thiếu chứng nhận phòng cháy chữa cháy PCCC')
      await user.click(submitBtn)

      await waitFor(() => {
        expect(sendData).toHaveBeenCalledWith(
          'put',
          '/api/v1/admin/parking-lots/101/reject',
          { reason: 'Hồ sơ thiếu chứng nhận phòng cháy chữa cháy PCCC' },
        )
      })
      expect(await screen.findByRole('dialog', { name: 'Đã từ chối hồ sơ bãi' })).toBeInTheDocument()
    })

    it('requires a reason when requesting changes (Yêu cầu bổ sung)', async () => {
      const user = userEvent.setup()
      vi.mocked(getData).mockResolvedValue(mockLot)
      vi.mocked(sendData).mockResolvedValueOnce({ success: true })

      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/parking-lots/101']}>
            <Routes>
              <Route path="/admin/parking-lots/:id" element={<AdminLotDetailPage />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>,
      )

      // Wait for lot detail query to resolve
      const reqChangesBtn = await screen.findByRole('button', { name: 'Yêu cầu bổ sung' })
      await user.click(reqChangesBtn)

      expect(screen.getByText('Lý do / ghi chú quyết định')).toBeInTheDocument()

      // Try empty submit
      const submitBtn = screen.getByRole('button', { name: 'Xác nhận quyết định' })
      await user.click(submitBtn)

      expect(
        await screen.findByText('Nhập lý do quyết định.'),
      ).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()
    })
  })

  describe('AdminLayout Harmonization', () => {
    it('renders header logout button and identifies the active sidebar destination', () => {
      render(
        <QueryClientProvider client={createTestQueryClient()}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <AdminLayout />
          </MemoryRouter>
        </QueryClientProvider>,
      )

      // Logout button in header
      const logoutBtn = screen.getByRole('button', { name: /Đăng xuất/i })
      expect(logoutBtn).toBeInTheDocument()

      // Active sidebar item "Tổng quan"
      const activeLink = screen.getByRole('link', { name: 'Tổng quan' })
      expect(activeLink).toHaveAttribute('aria-current', 'page')
    })
  })
})
