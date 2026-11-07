import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

import { VirtualQueuesPage } from '@/features/queues/pages/VirtualQueuesPage'
import { DriverPaymentsPage } from '@/features/payments/pages/DriverPaymentsPage'
import { VehiclesPage } from '@/features/vehicles/pages/VehiclesPage'
import { DisputesPage } from '@/features/disputes'
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { fallbackActiveQueue } from '@/features/queues/api/queueApi'
import { fallbackMetrics } from '@/features/payments/api/paymentApi'
import { fallbackNotificationsList } from '@/features/notifications/api/notificationApi'

// Mock apiClient
vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('BATCH-14C: Driver Operations Integration (SCR-018 to SCR-024)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock window helper functions for canvas/blobs
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn()
    }

    // Default mocks for API endpoints across the 7 screens
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('queues')) {
        return Promise.resolve({
          data: {
            data: fallbackActiveQueue,
          },
        })
      }
      if (url.includes('payments') || url.includes('transactions')) {
        return Promise.resolve({
          data: {
            data: {
              content: [
                {
                  id: 1,
                  bookingId: 9081,
                  parkingLotId: 1,
                  gateway: 'PAYOS',
                  transactionCode: 'TXN-2026-9081',
                  orderCode: 123456,
                  amount: 100000,
                  type: 'DEPOSIT',
                  status: 'SUCCESS',
                  createdAt: '2026-02-20T14:15:00Z',
                },
              ],
              totalElements: 1,
              totalPages: 1,
              currentPage: 0,
            },
          },
        })
      }
      if (url.includes('metrics')) {
        return Promise.resolve({
          data: {
            data: fallbackMetrics,
          },
        })
      }
      if (url.includes('vehicles')) {
        return Promise.resolve({
          data: {
            data: {
              content: [
                {
                  id: 1,
                  licensePlate: '51D-894.12',
                  vehicleType: 'CONTAINER',
                  weightTon: 39.5,
                  brandModel: 'Hyundai Xcient 440PS',
                  status: 'ACTIVE',
                },
                {
                  id: 2,
                  licensePlate: '51R-024.89',
                  vehicleType: 'CONTAINER',
                  weightTon: 32.8,
                  brandModel: 'CIMC 3 Trục',
                  status: 'ACTIVE',
                },
              ],
              totalElements: 2,
              totalPages: 1,
              currentPage: 0,
            },
          },
        })
      }
      if (url.includes('disputes')) {
        return Promise.resolve({
          data: {
            data: {
              content: [
                {
                  id: 101,
                  bookingId: 9081,
                  reason: 'Sai lệch thời gian đỗ thực tế tại barie',
                  description: 'Camera nhận diện sai biển số phụ xe container',
                  status: 'OPEN',
                  compensationAmount: 50000,
                  amount: 50000,
                  createdAt: '2026-02-18T10:00:00Z',
                },
              ],
              totalElements: 1,
              totalPages: 1,
              currentPage: 0,
            },
          },
        })
      }
      if (url.includes('notifications')) {
        return Promise.resolve({
          data: {
            data: {
              items: fallbackNotificationsList,
              totalElements: fallbackNotificationsList.length,
            },
          },
        })
      }
      if (url.includes('profile') || url.includes('users/me')) {
        return Promise.resolve({
          data: {
            data: {
              id: 1,
              fullName: 'Trần Quốc Tuấn',
              phone: '0909 128 374',
              email: 'tuan.tran@smarttruck.vn',
              address: 'Khu công nghiệp Cát Lái, P. Thạnh Mỹ Lợi, TP. Thủ Đức',
              emergencyContact: '0912 345 678',
            },
          },
        })
      }
      return Promise.resolve({ data: { data: {} } })
    })

    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { success: true, message: 'Thao tác thành công!' } },
    })
  })

  // -------------------------------------------------------------
  // SCR-018: Virtual Queues
  // -------------------------------------------------------------
  it('SCR-018: VirtualQueuesPage renders active queue card, accepts slot, and handles modal a11y', async () => {
    renderWithProviders(<VirtualQueuesPage />, ['/dashboard/queues'])

    // Toolbar Header & Title
    expect(screen.getByText(/Hệ thống điều phối hàng đợi thông minh/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Lượt Chờ Vào Bãi/i,
      })
    ).toBeInTheDocument()

    // Active Queue Card details
    expect(await screen.findByText(/Đã Đến Lượt Của Bạn!/i)).toBeInTheDocument()
    expect(screen.getByText(/Đã Có Slot Trống/i)).toBeInTheDocument()
    expect(screen.getByText(/Cảng Cát Lái/i)).toBeInTheDocument()

    // Accept slot CTA button
    const acceptBtn = screen.getByRole('button', { name: /Nhận Slot & Tạo Booking Ngay/i })
    expect(acceptBtn).toBeInTheDocument()

    // Click to accept slot
    fireEvent.click(acceptBtn)

    // AcceptQueueSuccessModal opens
    const successModal = await screen.findByRole('dialog')
    expect(successModal).toBeInTheDocument()
    expect(screen.getByText(/Nhận Slot Đỗ Xe Thành Công!/i)).toBeInTheDocument()

    // Test Escape key dismissal (TSK-P2-02 A11y requirement)
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText(/Nhận Slot Đỗ Xe Thành Công!/i)).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------
  // SCR-019 & SCR-020: Driver Payments & Financial Invoices
  // -------------------------------------------------------------
  it('SCR-019 & SCR-020: DriverPaymentsPage renders metrics, transaction table, and opens details panel', async () => {
    renderWithProviders(<DriverPaymentsPage />, ['/dashboard/payments'])

    // Workspace Header & Eyebrow
    expect(await screen.findByText('Lịch sử thanh toán')).toBeInTheDocument()
    expect(screen.getByText('TÀI KHOẢN / GIAO DỊCH')).toBeInTheDocument()

    // Metrics
    expect(await screen.findByText('Tổng giao dịch')).toBeInTheDocument()
    expect(screen.getByText('Đã thanh toán trên trang này')).toBeInTheDocument()

    // Transaction item
    expect(await screen.findByText('TXN-2026-9081')).toBeInTheDocument()
    expect(screen.getByText('Booking #9081')).toBeInTheDocument()

    // Open detail panel
    const detailBtn = screen.getByRole('button', { name: /Chi tiết giao dịch/i })
    fireEvent.click(detailBtn)

    // Details panel is shown
    expect(await screen.findByRole('heading', { name: 'Chi tiết giao dịch' })).toBeInTheDocument()
    expect(screen.getByText('Mã đơn thanh toán')).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-021 & SCR-022: Fleet Management & Add/Edit Vehicles
  // -------------------------------------------------------------
  it('SCR-021 & SCR-022: VehiclesPage renders vehicle list and opens editor panel', async () => {
    renderWithProviders(<VehiclesPage />, ['/dashboard/vehicles'])

    // Workspace Header & Eyebrow
    expect(await screen.findByText(/Đội xe của tôi/i)).toBeInTheDocument()
    expect(screen.getByText('TÀI KHOẢN / PHƯƠNG TIỆN')).toBeInTheDocument()

    // Registered vehicles table
    expect(await screen.findByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText('Hyundai Xcient 440PS')).toBeInTheDocument()

    // Open Add Vehicle Editor (+ Thêm phương tiện)
    const addBtn = screen.getByRole('button', { name: /Thêm phương tiện/i })
    fireEvent.click(addBtn)

    // Editor Panel opens
    expect(await screen.findByRole('heading', { name: /Thêm phương tiện/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Biển số xe/i)).toBeInTheDocument()

    // Close Editor via Hủy
    const cancelBtn = screen.getByRole('button', { name: /Hủy/i })
    fireEvent.click(cancelBtn)
    expect(screen.queryByRole('heading', { name: /Thêm phương tiện/i })).not.toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-023: Driver Disputes & Incident Reports
  // -------------------------------------------------------------
  it('SCR-023: DisputesPage renders dispute list, columns, and opens report modal', async () => {
    renderWithProviders(<DisputesPage role="driver" />, ['/disputes'])

    // Title & Eyebrow
    expect(await screen.findByText(/Trung tâm khiếu nại/i)).toBeInTheDocument()
    expect(screen.getByText('DRIVER / SUPPORT')).toBeInTheDocument()

    // Table Columns & Data
    expect(await screen.findByText('KN-101')).toBeInTheDocument()
    expect(screen.getByText('#9081')).toBeInTheDocument()
    expect(screen.getByText(/Sai lệch thời gian đỗ thực tế/i)).toBeInTheDocument()
    expect(screen.getByText('50.000 ₫')).toBeInTheDocument()

    // Action CTA: + Gửi khiếu nại
    const createBtn = screen.getByRole('button', { name: /\+ Gửi khiếu nại/i })
    expect(createBtn).toBeInTheDocument()
    fireEvent.click(createBtn)

    // Modal dialog opens
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Gửi phản ánh về lượt đỗ/i)).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-024: Driver Settings & Notifications
  // -------------------------------------------------------------
  it('SCR-024: NotificationsPage and ProfilePage render settings and verified driver details', async () => {
    // 1. Notifications Page
    renderWithProviders(<NotificationsPage />, ['/dashboard/notifications'])

    expect(await screen.findByText(/LUỒNG SỰ KIỆN THỜI GIAN THỰC/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Trung Tâm Thông Báo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /BẬT THÔNG BÁO ĐẨY WEB PUSH 24\/7/i })).toBeInTheDocument()

    // 2. Profile Page
    renderWithProviders(<ProfilePage />, ['/dashboard/profile'])

    expect(await screen.findByRole('heading', { level: 1, name: /Hồ sơ tài xế/i })).toBeInTheDocument()
    expect(screen.getByText(/Cập nhật thông tin cá nhân/i)).toBeInTheDocument()
    expect(screen.getByText(/Tổng quan/i)).toBeInTheDocument()
    expect(await screen.findByDisplayValue('Trần Quốc Tuấn')).toBeInTheDocument()
  })
})
