import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

import { MerchantDashboardPage } from '../dashboard/pages/MerchantDashboardPage'
import { MerchantProfilePage } from '../profile/pages/MerchantProfilePage'
import { MerchantParkingLotsPage } from '../parking-lots/pages/MerchantParkingLotsPage'
import { CreateMerchantParkingLotPage } from '../parking-lots/pages/CreateMerchantParkingLotPage'
import { MerchantParkingLotDetailPage } from '../parking-lots/pages/MerchantParkingLotDetailPage'
import { EditMerchantParkingLotPage } from '../parking-lots/pages/EditMerchantParkingLotPage'
import { MerchantSlotsPage } from '../slots/pages/MerchantSlotsPage'

import * as parkingLotApi from '../parking-lots/api/merchantParkingLotApi'
import * as slotsApi from '../slots/api/merchantSlotsApi'
import type { SlotMatrixItem, SimpleLotHeaderInfo } from '../slots/types/merchantSlotsTypes'

const mockSlotMatrix: SlotMatrixItem[] = [
  { id: 1, vehicleType: 'CONTAINER', typeNameVi: 'Xe container', totalCapacity: 30, availableCapacity: 2, occupiedCapacity: 28 },
  { id: 2, vehicleType: 'HEAVY_TRUCK', typeNameVi: 'Xe tải nặng', totalCapacity: 10, availableCapacity: 0, occupiedCapacity: 10 },
]
const mockLotInfo: SimpleLotHeaderInfo = {
  id: 1, name: 'Bãi Tân Cảng', address: 'Cát Lái, TP. Thủ Đức', status: 'APPROVED',
}

// Mock apiClient
vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockMerchantProfile = {
  merchantId: 7,
  userId: 12,
  fullName: 'Lê Văn Thành',
  phone: '0901234567',
  email: 'thanh.le@tancang.vn',
  address: 'Cát Lái, TP. Thủ Đức',
  emergencyContact: '0909 999 888',
  businessLicense: 'GP-123456',
  bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
  bankAccountNum: '0071001234567',
  maskedBankAccount: '******34567',
  walletBalance: 42800000,
  verificationLabel: 'Đã xác thực',
}

const mockDashboardRevenue = {
  totalNetRevenue: 82500000,
  currentWalletBalance: 42800000,
  series: [{ period: 'T11', revenue: 82500000, bookingCount: 48 }],
}

const mockDashboardLots = {
  content: [
    {
      id: 1,
      name: 'Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)',
      address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
      status: 'APPROVED',
      createdAt: '2026-01-10T08:30:00Z',
      ratingAverage: 4.9,
    },
  ],
  currentPage: 0,
  totalPages: 1,
  totalElements: 1,
}

const mockDashboardBookings = {
  content: [
    {
      id: 101,
      bookingCode: 'BK-CL-2026-01',
      vehicleLicensePlate: '51D-894.12',
      parkingLotName: 'Bãi Đỗ Xe Tân Cảng',
      status: 'CONFIRMED',
    },
  ],
  totalElements: 1,
}

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

describe('BATCH-14D: Merchant Yard Infrastructure Integration (SCR-026 to SCR-032)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Mock window helper functions for canvas/blobs/scrolling
    window.scrollTo = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn()
    }

    // Default apiClient.get mocks
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('merchant/revenue')) {
        return Promise.resolve({
          data: {
            data: mockDashboardRevenue,
          },
        })
      }
      if (url.includes('merchant/bookings')) {
        return Promise.resolve({
          data: {
            data: mockDashboardBookings,
          },
        })
      }
      if (url.includes('merchant/profile')) {
        return Promise.resolve({
          data: {
            data: mockMerchantProfile,
          },
        })
      }
      if (url.includes('parking-lots/1') || url.includes('parking-lots/101')) {
        return Promise.resolve({
          data: {
            data: parkingLotApi.fallbackMerchantLotDetailData,
          },
        })
      }
      if (url.includes('merchant/parking-lots')) {
        return Promise.resolve({
          data: {
            data: mockDashboardLots,
          },
        })
      }
      if (url.includes('slots')) {
        return Promise.resolve({
          data: {
            data: mockSlotMatrix,
          },
        })
      }
      return Promise.resolve({ data: { data: {} } })
    })

    // Default apiClient.post & put mocks
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { success: true, id: 999, message: 'Thành công' } },
    })
    vi.mocked(apiClient.put).mockResolvedValue({
      data: { data: { success: true, message: 'Cập nhật thành công' } },
    })

    // Mock slots API
    vi.spyOn(slotsApi, 'fetchMerchantLotSimpleInfo').mockResolvedValue(mockLotInfo)
    vi.spyOn(slotsApi, 'fetchMerchantLotSlots').mockResolvedValue(mockSlotMatrix)
    vi.spyOn(slotsApi, 'updateMerchantLotSlotsBulk').mockResolvedValue(mockSlotMatrix)
  })

  // -------------------------------------------------------------
  // SCR-026: Merchant Dashboard Page
  // -------------------------------------------------------------
  it('SCR-026: MerchantDashboardPage renders executive KPI panels and recent bookings', async () => {
    renderWithProviders(<MerchantDashboardPage />, ['/merchant/dashboard'])

    // 4 KPI metrics
    expect(await screen.findByText('TỔNG DOANH THU THỰC NHẬN')).toBeInTheDocument()
    expect(screen.getByText('SỐ DƯ VÍ')).toBeInTheDocument()
    expect(screen.getByText('BÃI ĐỖ CỦA TÔI')).toBeInTheDocument()
    expect(screen.getByText('TỔNG LƯỢT ĐẶT CHỖ')).toBeInTheDocument()

    // Sections
    expect(screen.getByText('Doanh thu theo kỳ')).toBeInTheDocument()
    expect(screen.getByText('Đặt chỗ gần nhất')).toBeInTheDocument()
    expect(screen.getByText('BK-CL-2026-01')).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-027: Merchant Profile Page
  // -------------------------------------------------------------
  it('SCR-027: MerchantProfilePage renders verified legal dossier, tax code, and toggles bank account mask', async () => {
    renderWithProviders(<MerchantProfilePage />, ['/merchant/profile'])

    // Header & Section
    expect(await screen.findByRole('heading', { level: 1, name: /Hồ sơ chủ bãi/i })).toBeInTheDocument()
    expect(screen.getByText(/Quản lý thông tin liên hệ, giấy tờ và tài khoản nhận tiền/i)).toBeInTheDocument()

    // Form fields
    expect(await screen.findByDisplayValue('Lê Văn Thành')).toBeInTheDocument()
    expect(screen.getByText('******34567')).toBeInTheDocument()

    // Bank Account Masking Toggle
    const toggleMaskBtn = screen.getByRole('button', { name: 'Hiển thị số tài khoản' })
    expect(toggleMaskBtn).toBeInTheDocument()
    fireEvent.click(toggleMaskBtn)

    // Button updates to hide and field reveals actual number
    expect(screen.getByRole('button', { name: 'Ẩn số tài khoản' })).toBeInTheDocument()
    expect(screen.getByText('0071001234567')).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-028: Merchant Parking Lots Registry Page
  // -------------------------------------------------------------
  it('SCR-028: MerchantParkingLotsPage renders KPI cards, lot cards, and handles CSV export', async () => {
    renderWithProviders(<MerchantParkingLotsPage />, ['/merchant/parking-lots'])

    // Header & Title
    expect(await screen.findByRole('heading', { name: /Bãi đỗ xe của tôi/i, level: 1 })).toBeInTheDocument()

    // 3 KPI metric labels
    expect(screen.getByText('Tổng Cơ Sở')).toBeInTheDocument()
    expect(screen.getByText('Đã Phê Duyệt')).toBeInTheDocument()
    expect(screen.getByText('Đang Chờ Duyệt')).toBeInTheDocument()

    // Wait for facility card to render
    expect(await screen.findByText('Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)')).toBeInTheDocument()

    // Export CSV Button
    const exportBtn = screen.getByRole('button', { name: 'Xuất CSV trang hiện tại' })
    expect(exportBtn).toBeInTheDocument()
    expect(exportBtn).not.toBeDisabled()
    fireEvent.click(exportBtn)
  })

  // -------------------------------------------------------------
  // SCR-029: Create Merchant Parking Lot Wizard Page
  // -------------------------------------------------------------
  it('SCR-029: CreateMerchantParkingLotPage renders 3-step wizard, navigates steps, and supports AI description', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/merchant/parking-lots/new" element={<CreateMerchantParkingLotPage />} />
        <Route path="/merchant/parking-lots" element={<div>Danh Sách Bãi Đỗ</div>} />
      </Routes>,
      ['/merchant/parking-lots/new']
    )

    // Wizard Stepper & Initial Step 0 Form
    expect(await screen.findByText(/QUY TRÌNH THẨM ĐỊNH MẶT BẰNG & MỞ BẾN BÃI MỚI/i)).toBeInTheDocument()
    expect(screen.getByText(/Đăng Ký Bãi Đỗ Xe & Depot Mới/i)).toBeInTheDocument()
    expect(screen.getByText('Thông Tin Cơ Bản & Tiện Ích')).toBeInTheDocument()
    expect(screen.getByText('Tọa Độ GPS & Ranh Giới Mặt Bằng')).toBeInTheDocument()
    expect(screen.getByText('Hồ Sơ PCCC & Xác Nhận Gửi Duyệt')).toBeInTheDocument()

    // Fill lot name
    const nameInput = screen.getByLabelText(/Tên Bãi Đỗ Khai Báo/i)
    fireEvent.change(nameInput, { target: { value: 'Bãi Xe Container Tân Cảng Cát Lái 2' } })

    // AI Copilot generator button
    const aiButton = screen.getByRole('button', { name: /Áp Dụng Nội Dung AI Vào Hồ Sơ/i })
    expect(aiButton).toBeInTheDocument()
    fireEvent.click(aiButton)

    // Verify AI generated description is populated
    expect(await screen.findByText(/Nội dung AI Fretrix-Dispatch đã đồng bộ vào hồ sơ/i)).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-030: Merchant Parking Lot Detail Page
  // -------------------------------------------------------------
  it('SCR-030: MerchantParkingLotDetailPage renders facility dossier, capacity matrix, and operational links', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/merchant/parking-lots/:parkingLotId" element={<MerchantParkingLotDetailPage />} />
      </Routes>,
      ['/merchant/parking-lots/1']
    )

    // Facility title & Dossier
    expect(await screen.findByText('Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)')).toBeInTheDocument()
    expect(screen.getByText('Thông tin hồ sơ')).toBeInTheDocument()
    expect(screen.getByText('Thư Viện Thực Tế Hạ Tầng Bãi Đỗ')).toBeInTheDocument()
    expect(screen.getByText('Vị trí bãi đỗ')).toBeInTheDocument()
    expect(screen.getByText('Sức chứa chỗ đỗ')).toBeInTheDocument()
    expect(screen.getByText('Bảng giá')).toBeInTheDocument()

    // Navigation and Action links
    expect(screen.getByRole('link', { name: /Chỉnh sửa hồ sơ/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cấu hình chỗ đỗ/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cấu hình bảng giá/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Mở quét QR/i })).toBeInTheDocument()
  })

  // -------------------------------------------------------------
  // SCR-031: Edit Merchant Parking Lot Page
  // -------------------------------------------------------------
  it('SCR-031: EditMerchantParkingLotPage renders edit form cards and supports local draft saving', async () => {
    vi.spyOn(parkingLotApi, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...parkingLotApi.fallbackMerchantLotDetailData,
      id: 1,
      name: 'Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)',
      address: 'Đường Gò Cát, Phường Phú Hữu, TP. Thủ Đức, TP. Hồ Chí Minh',
      status: 'CHANGES_REQUESTED',
      reviewReason: 'Cần kéo lại ghim GPS đúng cổng Barie và bổ sung ảnh kiểm định PCCC đêm.',
    })

    renderWithProviders(
      <Routes>
        <Route path="/merchant/parking-lots/:parkingLotId/edit" element={<EditMerchantParkingLotPage />} />
        <Route path="/merchant/parking-lots/:parkingLotId" element={<div>CHI TIẾT BÃI ĐỖ MOCK</div>} />
      </Routes>,
      ['/merchant/parking-lots/1/edit']
    )

    // Header & Form cards
    expect(await screen.findByRole('heading', { name: /Chỉnh Sửa & Cập Nhật Hồ Sơ Bãi Đỗ/i })).toBeInTheDocument()
    expect(screen.getByText(/HỒ SƠ BẾN BÃI & THẨM ĐỊNH KỸ THUẬT/i)).toBeInTheDocument()
    expect(screen.getByText('Thông Tin Mặt Bằng & Pháp Lý Vận Hành')).toBeInTheDocument()
    expect(screen.getByText('Tọa Độ GPS Cổng Barie (Chuẩn WGS-84 RTK)')).toBeInTheDocument()

    // Click Lưu Bản Nháp Nội Bộ
    const draftBtn = screen.getByRole('button', { name: /Lưu Bản Nháp Nội Bộ/i })
    expect(draftBtn).toBeInTheDocument()
    fireEvent.click(draftBtn)

    // Toast notification confirms draft saved
    expect(await screen.findByText(/Đã lưu bản nháp nội bộ thành công/i)).toBeInTheDocument()
    expect(localStorage.getItem('merchant_lot_edit_draft_1')).not.toBeNull()

    // Open and close inspection history modal
    const historyBtn = screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i })
    fireEvent.click(historyBtn)
    expect(await screen.findByText('Nhật Ký Thẩm Định Mặt Bằng')).toBeInTheDocument()

    // Close on Escape key (TSK-P2-02 A11y)
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText('Nhật Ký Thẩm Định Mặt Bằng')).not.toBeInTheDocument()
    })
  })

  // -------------------------------------------------------------
  // SCR-032: Merchant Slots Configuration Page
  // -------------------------------------------------------------
  it('SCR-032: MerchantSlotsPage renders 5 vehicle classes, enforces invariant rule, and handles decrease modal', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/merchant/parking-lots/:parkingLotId/slots" element={<MerchantSlotsPage />} />
        <Route path="/merchant/parking-lots/:parkingLotId" element={<div>CHI TIET BAI DO</div>} />
      </Routes>,
      ['/merchant/parking-lots/1/slots']
    )

    // Header & Invariant Rule Banner
    expect(await screen.findByText(/Cấu Hình Sức Chứa Bãi Đỗ/i)).toBeInTheDocument()
    expect(screen.getByText(/Quy Chuẩn Bảo Toàn Thực Địa & Khóa Ràng Buộc Vật Lý/i)).toBeInTheDocument()

    // 5 Vehicle Classes rendered
    expect(screen.getByText(/Container 40FT \/ 45FT Reefer & Khô/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Nặng 3-4 Chân & Đầu Kéo Bobtail/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Trung & Nhẹ/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Khách & Xe Đưa Đón Chuyên Dụng/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Ô Tô Con & Xe Hỗ TrỢ Kỹ Thuật/i)).toBeInTheDocument()

    // Invariant check: heavy truck at max capacity is disabled
    const decreaseHeavyTruckBtn = screen.getByRole('button', { name: /Giảm sức chứa Xe Tải Nặng 3-4 Chân/i })
    expect(decreaseHeavyTruckBtn).toBeDisabled()

    // Click decrease button on Container 40FT (capacity 30 > occupied 28)
    const decreaseBtn = screen.getByRole('button', { name: /Giảm sức chứa Container 40FT/i })
    expect(decreaseBtn).toBeInTheDocument()
    fireEvent.click(decreaseBtn)

    // Save changes button triggers ConfirmDecreaseModal
    const saveButton = screen.getByRole('button', { name: /LƯU CẤU HÌNH SỨC CHỨA HÀNG LOẠT/i })
    fireEvent.click(saveButton)

    // ConfirmDecreaseModal opens
    const confirmModal = await screen.findByRole('dialog')
    expect(confirmModal).toBeInTheDocument()
    expect(confirmModal).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Xác nhận giảm sức chứa?')).toBeInTheDocument()

    // Dismiss modal via Escape key
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
