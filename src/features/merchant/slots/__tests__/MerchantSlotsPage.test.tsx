import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantSlotsPage } from '../pages/MerchantSlotsPage'
import * as api from '../api/merchantSlotsApi'

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
      <MemoryRouter initialEntries={[`/merchant/parking-lots/${lotId}/slots`]}>
        <Routes>
          <Route
            path="/merchant/parking-lots/:parkingLotId/slots"
            element={<MerchantSlotsPage />}
          />
          <Route
            path="/merchant/parking-lots/:parkingLotId"
            element={<div>CHI TIET BAI DO SCR-030</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-032: MerchantSlotsPage (Cấu hình sức chứa bãi đỗ theo loại xe)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Mock API để tránh gọi HTTP thực tế qua Axios trong JSDOM
    vi.spyOn(api, 'fetchMerchantLotSimpleInfo').mockResolvedValue(api.fallbackLotInfo)
    vi.spyOn(api, 'fetchMerchantLotSlots').mockResolvedValue(api.fallbackSlotMatrix)
    vi.spyOn(api, 'updateMerchantLotSlotsBulk').mockImplementation(async (_id, payload) => {
      const payloadMap = new Map(payload.slots.map((s) => [s.vehicleType, s.totalCapacity]))
      return api.fallbackSlotMatrix.map((item) => {
        if (payloadMap.has(item.vehicleType)) {
          const newTotal = payloadMap.get(item.vehicleType)!
          return {
            ...item,
            totalCapacity: newTotal,
            availableCapacity: Math.max(0, newTotal - item.occupiedCapacity),
          }
        }
        return item
      })
    })
  })

  it('FN-032-01: Hiển thị đầy đủ thông tin bãi đỗ, KPI và 5 loại xe chuẩn', async () => {
    renderPage(1)

    // Chờ tải xong skeleton
    await waitFor(() => {
      expect(
        screen.getByText(/Cấu Hình Sức Chứa Bãi Đỗ/i),
      ).toBeInTheDocument()
    })

    // Header & Code (kiểm tra tồn tại)
    expect(screen.getAllByText(/VN-SGN-CLG2-09/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Bãi Đỗ Xe & Trạm Container Tân Cảng/i)).toBeInTheDocument()

    // 3 Quick navigations
    expect(screen.getByText(/Về Chi Tiết Bãi/i)).toBeInTheDocument()
    expect(screen.getByText(/Trạm Quét QR Barie/i)).toBeInTheDocument()
    expect(screen.getByText(/Biểu Phí Niêm Yết/i)).toBeInTheDocument()

    // Invariant protection banner
    expect(
      screen.getByText(/Quy Chuẩn Bảo Toàn Thực Địa & Khóa Ràng Buộc Vật Lý/i),
    ).toBeInTheDocument()

    // KPIs ban đầu: Tổng 80, Đang đỗ 72, Khả dụng 08
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('80')
    expect(screen.getByTestId('kpi-occupied-cap')).toHaveTextContent('72')
    expect(screen.getByTestId('kpi-available-cap')).toHaveTextContent('08')

    // 5 Thẻ loại xe
    expect(screen.getByText(/Container 40FT \/ 45FT Reefer & Khô/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Nặng 3-4 Chân & Đầu Kéo Bobtail/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Trung & Nhẹ/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Khách & Xe Đưa Đón Chuyên Dụng/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Ô Tô Con & Xe Hỗ Trợ Kỹ Thuật/i)).toBeInTheDocument()

    // Surface Weight Calculator
    expect(screen.getByText(/TCVN 4054:2005/i)).toBeInTheDocument()
    expect(screen.getByText(/4\.800 Tấn/i)).toBeInTheDocument()

    // Virtual queue card
    expect(screen.getByText(/Cơ Chế Hàng Đợi Ảo 15 Phút/i)).toBeInTheDocument()
  })

  it('FN-032-02 & FN-032-03: Kiểm tra Khóa Ràng Buộc Bất Biến (Occupied Invariant)', async () => {
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu Hình Sức Chứa Bãi Đỗ/i)).toBeInTheDocument()
    })

    // Ở card TRUCK_HEAVY: occupied = 30, totalCapacity = 30 -> Nút [-] phải bị disabled
    const decreaseHeavyTruckBtn = screen.getByRole('button', {
      name: /Giảm sức chứa Xe Tải Nặng 3-4 Chân/i,
    })
    expect(decreaseHeavyTruckBtn).toBeDisabled()

    // Tìm input của CONTAINER (đang có 30, occupied là 28)
    const inputs = screen.getAllByRole('spinbutton')
    const containerInput = inputs[0]
    expect(containerInput).toHaveValue(30)

    // Thử nhập giá trị 20 (nhỏ hơn occupied = 28) bằng single change event
    fireEvent.change(containerInput, { target: { value: '20' } })

    // Tự động ép về ngưỡng tối thiểu 28 và hiển thị cảnh báo
    expect(containerInput).toHaveValue(28)
    await waitFor(() => {
      expect(
        screen.getByText(/Sức chứa tối thiểu của Container 40FT \/ 45FT Reefer & Khô phải là 28/i),
      ).toBeInTheDocument()
    })
  })

  it('FN-032-04: Tăng sức chứa qua Stepper [+] và cập nhật Realtime KPI', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu Hình Sức Chứa Bãi Đỗ/i)).toBeInTheDocument()
    })

    // Tăng sức chứa của CONTAINER bằng nút [+]
    const increaseContainerBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Container 40FT/i,
    })
    await user.click(increaseContainerBtn)

    // Tổng sức chứa tăng từ 80 -> 81
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('81')
    // Khả dụng tăng từ 08 -> 09
    expect(screen.getByTestId('kpi-available-cap')).toHaveTextContent('09')
  })

  it('FN-032-05: Khôi phục gốc khi bấm Hủy thay đổi', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu Hình Sức Chứa Bãi Đỗ/i)).toBeInTheDocument()
    })

    // Tăng sức chứa CONTAINER
    const increaseBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Container 40FT/i,
    })
    await user.click(increaseBtn)
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('81')

    // Nút Khôi Phục Gốc (Hủy Thay Đổi) sáng lên
    const resetBtn = screen.getByRole('button', {
      name: /Khôi Phục Gốc \(Hủy Thay Đổi\)/i,
    })
    expect(resetBtn).not.toBeDisabled()

    // Bấm reset
    await user.click(resetBtn)

    // Quay lại 80
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('80')
    expect(
      screen.getByText(/Đã khôi phục ma trận sức chứa về thông số ban đầu/i),
    ).toBeInTheDocument()
  })

  it('FN-032-06: Lưu cấu hình hàng loạt (Bulk Save)', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu Hình Sức Chứa Bãi Đỗ/i)).toBeInTheDocument()
    })

    // Tăng sức chứa 1 loại xe
    const increaseBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Container 40FT/i,
    })
    await user.click(increaseBtn)

    // Bấm Lưu cấu hình hàng loạt
    const saveBtn = screen.getByRole('button', {
      name: /LƯU CẤU HÌNH SỨC CHỨA HÀNG LOẠT/i,
    })
    expect(saveBtn).not.toBeDisabled()
    await user.click(saveBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Lưu cấu hình sức chứa thành công!/i),
      ).toBeInTheDocument()
    })
  })
})
