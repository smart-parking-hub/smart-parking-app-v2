import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EditMerchantParkingLotPage } from '../pages/EditMerchantParkingLotPage'
import * as api from '../api/merchantParkingLotApi'
import type { MerchantParkingLotDetailData } from '../types/merchantParkingLotTypes'

function renderPage(lotId = 1) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/merchant/parking-lots/${lotId}/edit`]}>
        <Routes>
          <Route
            path="/merchant/parking-lots/:parkingLotId/edit"
            element={<EditMerchantParkingLotPage />}
          />
          <Route
            path="/merchant/parking-lots/:parkingLotId"
            element={<div>CHI TIẾT BÃI ĐỖ MOCK</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-031: EditMerchantParkingLotPage (Chỉnh sửa & Cập nhật hồ sơ bãi đỗ xe)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders all key sections, Admin feedback alert, 4 form cards and 3 right column widgets', async () => {
    // Mock lot in CHANGES_REQUESTED status
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      name: 'Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)',
      address: 'Đường Gò Cát, Phường Phú Hữu, TP. Thủ Đức, TP. Hồ Chí Minh',
      status: 'CHANGES_REQUESTED',
      code: 'TAN-CANG-PH2',
      reviewReason:
        'Cần kéo lại ghim GPS đúng cổng Barie và bổ sung ảnh kiểm định PCCC đêm.',
    })

    renderPage(1)

    // Wait for initial render
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Chỉnh Sửa & Cập Nhật Hồ Sơ Bãi Đỗ/i }),
      ).toBeInTheDocument()
    })

    // 1. Breadcrumb and Header
    expect(screen.getByText(/HỒ SƠ BẾN BÃI & THẨM ĐỊNH KỸ THUẬT/i)).toBeInTheDocument()
    expect(screen.getByText(/YÊU CẦU BỔ SUNG \(CHANGES REQUESTED\)/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Quay lại Chi Tiết Bãi/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i })).toBeInTheDocument()

    // 2. Admin Review Alert Banner
    expect(
      screen.getByText(/BIÊN BẢN YÊU CẦU BỔ SUNG TỪ HỘI ĐỒNG THẨM ĐỊNH ADMIN/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/ĐỢT XÉT DUYỆT #02/i)).toBeInTheDocument()
    expect(screen.getByText(/Tọa độ GPS cổng vào:/i)).toBeInTheDocument()
    expect(screen.getByText(/Hệ thống chiếu sáng & PCCC:/i)).toBeInTheDocument()
    expect(screen.getByText(/Tĩnh không hạ tầng:/i)).toBeInTheDocument()

    // 3. 4 Form Panels in Left Column
    expect(screen.getByText('Thông Tin Mặt Bằng & Pháp Lý Vận Hành')).toBeInTheDocument()
    expect(screen.getByLabelText(/Tên bãi đỗ thương mại/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Địa chỉ kinh doanh đăng ký/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Hotline điều phối trực ban 24\/7/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tĩnh không cổng tiếp nhận/i)).toBeInTheDocument()

    expect(screen.getByText('Tọa Độ GPS Cổng Barie (Chuẩn WGS-84 RTK)')).toBeInTheDocument()
    expect(screen.getByLabelText(/Vĩ độ \(Latitude - North\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kinh độ \(Longitude - East\)/i)).toBeInTheDocument()

    expect(screen.getByText('Hình Ảnh Hiện Trường & Thẩm Định PCCC Bổ Sung')).toBeInTheDocument()
    expect(screen.getByText('TỐI THIỂU 4 ẢNH CHUẨN')).toBeInTheDocument()
    expect(screen.getByText(/Đèn Đêm & Trụ PCCC/i)).toBeInTheDocument()

    expect(
      screen.getByText('Mô Tả Bổ Sung Giải Trình Của Chủ Bãi (Merchant Response)'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Ghi chú phúc đáp trực tiếp/i)).toBeInTheDocument()

    // 4. 3 Right Column Cards
    expect(screen.getByText('Tọa Độ Ghim Thực Địa')).toBeInTheDocument()
    expect(screen.getByText('RTK < 0.5m')).toBeInTheDocument()
    expect(screen.getByText('Quy Chuẩn Thẩm Định Gatekeeper')).toBeInTheDocument()
    expect(screen.getByText('Tiến độ hoàn thiện hồ sơ')).toBeInTheDocument()
    expect(screen.getByText(/3\/3 HẠNG MỤC/i)).toBeInTheDocument()

    // 5. Sticky Footer
    expect(screen.getByText(/Rev 2\.1/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Hủy Bỏ Thay Đổi/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lưu Bản Nháp Nội Bộ/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN/i }),
    ).toBeInTheDocument()
  })

  it('enforces lockout mode when parking lot is APPROVED', async () => {
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 2,
      name: 'Bãi Đỗ Xe Vận Tải Sóng Thần',
      status: 'APPROVED',
    })

    renderPage(2)

    await waitFor(() => {
      expect(screen.getByText(/Hồ sơ hiện không thể chỉnh sửa/i)).toBeInTheDocument()
    })

    // Check warning and disabled submit button
    expect(screen.getByText(/STATUS: APPROVED/i)).toBeInTheDocument()
    const submitBtn = screen.getByRole('button', { name: /GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN/i })
    expect(submitBtn).toBeDisabled()
  })

  it('calibrates coordinates when clicking the calibration button', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByLabelText(/Vĩ độ/i)).toBeInTheDocument()
    })

    const latInput = screen.getByLabelText(/Vĩ độ/i) as HTMLInputElement
    const lngInput = screen.getByLabelText(/Kinh độ/i) as HTMLInputElement
    const calibrateBtn = screen.getByRole('button', {
      name: /Đã hiệu chỉnh \+15m theo tim đường Gò Cát/i,
    })

    await user.click(calibrateBtn)

    expect(Number(latInput.value)).toBeCloseTo(10.785514, 5)
    expect(Number(lngInput.value)).toBeCloseTo(106.804289, 5)
  })

  it('resets coordinates when clicking reset button', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'REJECTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByLabelText(/Vĩ độ/i)).toBeInTheDocument()
    })

    const latInput = screen.getByLabelText(/Vĩ độ/i) as HTMLInputElement
    const lngInput = screen.getByLabelText(/Kinh độ/i) as HTMLInputElement
    const resetBtn = screen.getByRole('button', { name: /Khôi phục tọa độ ban đầu/i })

    await user.click(resetBtn)

    expect(Number(latInput.value)).toBeCloseTo(10.785421, 5)
    expect(Number(lngInput.value)).toBeCloseTo(106.804152, 5)
  })

  it('saves local draft to localStorage when clicking Lưu Bản Nháp Nội Bộ', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Lưu Bản Nháp Nội Bộ/i })).toBeInTheDocument()
    })

    const draftBtn = screen.getByRole('button', { name: /Lưu Bản Nháp Nội Bộ/i })
    await user.click(draftBtn)

    expect(localStorage.getItem('merchant_lot_edit_draft_1')).not.toBeNull()
    expect(screen.getByText(/Đã lưu bản nháp nội bộ thành công/i)).toBeInTheDocument()
  })

  it('opens and closes the history inspection modal', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i })).toBeInTheDocument()
    })

    const historyBtn = screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i })
    await user.click(historyBtn)

    expect(screen.getByText('Nhật Ký Thẩm Định Mặt Bằng')).toBeInTheDocument()
    expect(screen.getByText(/ĐỢT 02 · CHANGES REQUESTED/i)).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /Đóng Nhật Ký/i })
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Nhật Ký Thẩm Định Mặt Bằng')).not.toBeInTheDocument()
    })
  })

  it('closes history modal when pressing Escape key (TSK-P2-02 A11y)', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Xem Lịch Sử Thẩm Định/i }))
    expect(screen.getByText('Nhật Ký Thẩm Định Mặt Bằng')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Nhật Ký Thẩm Định Mặt Bằng')).not.toBeInTheDocument()
    })
  })

  it('submits updated parking lot and triggers updateMerchantParkingLot API', async () => {
    const user = userEvent.setup()
    const updateSpy = vi.spyOn(api, 'updateMerchantParkingLot').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      name: 'Depot Container Tân Cảng - Phú Hữu (Đã Cập Nhật)',
      status: 'PENDING_APPROVAL',
    })

    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN/i }),
      ).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: /GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        }),
      )
    })
  })

  it('prevents duplicate submissions by disabling submit button while submitting (TSK-P2-01)', async () => {
    const user = userEvent.setup()
    let resolveUpdate!: (value: MerchantParkingLotDetailData) => void
    vi.spyOn(api, 'updateMerchantParkingLot').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve
        }),
    )

    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'CHANGES_REQUESTED',
    })

    renderPage(1)

    const submitBtn = await screen.findByRole('button', {
      name: /GỬI LẠI HỒ SƠ KIỂM DUYỆT ADMIN/i,
    })
    await user.click(submitBtn)

    // Button should be disabled with spinner
    expect(screen.getByRole('button', { name: /ĐANG GỬI HỒ SƠ.../i })).toBeDisabled()

    // Resolve update
    resolveUpdate({
      ...api.fallbackMerchantLotDetailData,
      id: 1,
      status: 'PENDING_APPROVAL',
    })
  })
})
