import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantSlotsPage } from '../pages/MerchantSlotsPage'
import * as api from '../api/merchantSlotsApi'
import type { SlotMatrixItem, SimpleLotHeaderInfo } from '../types/merchantSlotsTypes'
const lot: SimpleLotHeaderInfo = { id: 35, name: 'Ben Cang Quan 1', address: 'Quận 1, TP.HCM', status: 'APPROVED' }
const slots: SlotMatrixItem[] = [
 { id: 1, vehicleType: 'CONTAINER', typeNameVi: 'Xe container', totalCapacity: 30, availableCapacity: 2, occupiedCapacity: 28 },
 { id: 2, vehicleType: 'HEAVY_TRUCK', typeNameVi: 'Xe tải nặng', totalCapacity: 30, availableCapacity: 0, occupiedCapacity: 30 },
 { id: 3, vehicleType: 'LIGHT_TRUCK', typeNameVi: 'Xe tải nhẹ', totalCapacity: 20, availableCapacity: 6, occupiedCapacity: 14 },
]

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
    vi.spyOn(api, 'fetchMerchantLotSimpleInfo').mockResolvedValue(lot)
    vi.spyOn(api, 'fetchMerchantLotSlots').mockResolvedValue(slots)
    vi.spyOn(api, 'updateMerchantLotSlotsBulk').mockImplementation(async (_id, payload) => {
      const payloadMap = new Map(payload.slots.map((s) => [s.vehicleType, s.totalCapacity]))
      return slots.map((item) => {
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

  it('renders only the lot and vehicle categories returned by the API', async () => {
    renderPage(35)
    expect(await screen.findByText('Ben Cang Quan 1')).toBeInTheDocument()
    expect(screen.getByText('Bãi #35')).toBeInTheDocument()
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('80')
    expect(screen.getByTestId('kpi-occupied-cap')).toHaveTextContent('72')
    expect(screen.getByTestId('kpi-available-cap')).toHaveTextContent('8')
    expect(screen.queryByText(/ALPR|TCVN|Cát Lái|tbl_parking_slots/)).not.toBeInTheDocument()
  })
  it('shows an empty state without invented capacity', async () => {
    vi.spyOn(api, 'fetchMerchantLotSlots').mockResolvedValue([])
    renderPage()
    expect(await screen.findByText('Chưa có cấu hình sức chứa')).toBeInTheDocument()
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('0')
    expect(screen.getByRole('button', { name: 'Lưu sức chứa' })).toBeDisabled()
  })
  it('creates capacity for selected types on an empty lot and saves the real bulk payload', async () => {
    vi.spyOn(api, 'fetchMerchantLotSlots').mockResolvedValue([])
    vi.spyOn(api, 'updateMerchantLotSlotsBulk').mockImplementation(async (_id, payload) => payload.slots.map((slot, index) => ({
      ...slot, id: index + 10, typeNameVi: api.vehicleNames[slot.vehicleType], availableCapacity: slot.totalCapacity, occupiedCapacity: 0,
    })))
    const user = userEvent.setup()
    renderPage(35)
    const select = await screen.findByLabelText('Loại xe cần thêm')
    await user.selectOptions(select, 'HEAVY_TRUCK')
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    expect(screen.getByLabelText('Sức chứa')).toHaveValue(0)
    expect(screen.getByText(/Chưa lưu · nhập số chỗ/)).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Sức chứa'), { target: { value: '25' } })
    await user.selectOptions(select, 'CONTAINER')
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    fireEvent.change(screen.getAllByLabelText('Sức chứa')[1], { target: { value: '10' } })
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('35')
    await user.click(screen.getByRole('button', { name: 'Lưu sức chứa' }))
    await screen.findByText('Lưu cấu hình sức chứa thành công!')
    expect(api.updateMerchantLotSlotsBulk).toHaveBeenCalledWith(35, { slots: [
      { vehicleType: 'HEAVY_TRUCK', totalCapacity: 25 },
      { vehicleType: 'CONTAINER', totalCapacity: 10 },
    ] })
    expect(screen.queryByText(/Chưa lưu · nhập số chỗ/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lưu sức chứa' })).toBeDisabled()
  })
  it('offers only missing types and reset discards additions without saving', async () => {
    const user = userEvent.setup()
    renderPage()
    const select = await screen.findByLabelText('Loại xe cần thêm')
    expect(Array.from(select.querySelectorAll('option')).map((option) => option.value)).toEqual(['BUS_COACH', 'SEDAN_SUV'])
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    expect(screen.getAllByRole('spinbutton')).toHaveLength(4)
    expect(select.querySelectorAll('option')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Hủy thay đổi' }))
    expect(screen.getAllByRole('spinbutton')).toHaveLength(3)
    expect(select.querySelectorAll('option')).toHaveLength(2)
    expect(api.updateMerchantLotSlotsBulk).not.toHaveBeenCalled()
  })
  it('removes one unsaved type, preserves other edits and excludes the removed type from save', async () => {
    const user = userEvent.setup()
    renderPage(35)
    const select = await screen.findByLabelText('Loại xe cần thêm')
    await user.click(screen.getByRole('button', { name: 'Tăng sức chứa Xe container' }))
    await user.selectOptions(select, 'BUS_COACH')
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    fireEvent.change(screen.getAllByRole('spinbutton')[3], { target: { value: '10' } })
    await user.selectOptions(select, 'SEDAN_SUV')
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    expect(screen.queryByLabelText('Loại xe cần thêm')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Bỏ loại xe Xe khách' }))
    expect(screen.getAllByRole('spinbutton')).toHaveLength(4)
    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(31)
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('81')
    expect(screen.getByRole('option', { name: 'Xe khách' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Bỏ loại xe Xe container' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Lưu sức chứa' }))
    await waitFor(() => expect(api.updateMerchantLotSlotsBulk).toHaveBeenCalled())
    expect(api.updateMerchantLotSlotsBulk).toHaveBeenCalledWith(35, { slots: [
      { vehicleType: 'CONTAINER', totalCapacity: 31 },
      { vehicleType: 'HEAVY_TRUCK', totalCapacity: 30 },
      { vehicleType: 'LIGHT_TRUCK', totalCapacity: 20 },
      { vehicleType: 'SEDAN_SUV', totalCapacity: 0 },
    ] })
  })
  it('returns to empty state after removing the only added type and permits adding it again', async () => {
    vi.spyOn(api, 'fetchMerchantLotSlots').mockResolvedValue([])
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: 'Thêm loại xe' }))
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '12' } })
    await user.click(screen.getByRole('button', { name: 'Bỏ loại xe Xe container' }))
    expect(screen.getByText('Chưa có cấu hình sức chứa')).toBeInTheDocument()
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('0')
    expect(screen.getByRole('button', { name: 'Lưu sức chứa' })).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Loại xe cần thêm'), 'CONTAINER')
    await user.click(screen.getByRole('button', { name: 'Thêm loại xe' }))
    expect(screen.getByRole('spinbutton')).toHaveValue(0)
    expect(api.updateMerchantLotSlotsBulk).not.toHaveBeenCalled()
  })
  it('blocks adding types to a suspended lot', async () => {
    vi.spyOn(api, 'fetchMerchantLotSimpleInfo').mockResolvedValue({ ...lot, status: 'SUSPENDED' })
    renderPage()
    expect(await screen.findByRole('button', { name: 'Thêm loại xe' })).toBeDisabled()
    expect(screen.getByLabelText('Loại xe cần thêm')).toBeDisabled()
  })
  it('shows API errors with retry instead of sample data', async () => {
    vi.spyOn(api, 'fetchMerchantLotSlots').mockRejectedValue(new Error('Offline'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được dữ liệu')
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
  it('keeps edits after a rejected save and never announces success', async () => {
    vi.spyOn(api, 'updateMerchantLotSlotsBulk').mockRejectedValue(new Error('Không thể lưu'))
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Tăng sức chứa Xe container' }))
    await userEvent.click(screen.getByRole('button', { name: 'Lưu sức chứa' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể lưu')
    expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(31)
    expect(screen.queryByText(/Lưu cấu hình sức chứa thành công/)).not.toBeInTheDocument()
  })
  it('FN-032-02 & FN-032-03: Kiểm tra Khóa Ràng Buộc Bất Biến (Occupied Invariant)', async () => {
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Ở card TRUCK_HEAVY: occupied = 30, totalCapacity = 30 -> Nút [-] phải bị disabled
    const decreaseHeavyTruckBtn = screen.getByRole('button', {
      name: /Giảm sức chứa Xe tải nặng/i,
    })
    expect(decreaseHeavyTruckBtn).toBeDisabled()

    // Tìm input của CONTAINER (đang có 30, occupied là 28)
    const inputs = screen.getAllByRole('spinbutton')
    const containerInput = inputs[0]
    expect(containerInput).toHaveValue(30)

    // Thử nhập giá trị 20 (nhỏ hơn occupied = 28) bằng single change event
    fireEvent.change(containerInput, { target: { value: '20' } })

    // Tự động ép về ngưỡng tối thiểu 28 và hiển thị cảnh báo
    expect(containerInput).toHaveValue(30)
    await waitFor(() => {
      expect(
        screen.getByText(/Sức chứa của Xe container phải là số nguyên từ 28/i),
      ).toBeInTheDocument()
    })
  })

  it('FN-032-04: Tăng sức chứa qua Stepper [+] và cập nhật Realtime KPI', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Tăng sức chứa của CONTAINER bằng nút [+]
    const increaseContainerBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Xe container/i,
    })
    await user.click(increaseContainerBtn)

    // Tổng sức chứa tăng từ 80 -> 81
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('81')
    // Khả dụng tăng từ 08 -> 09
    expect(screen.getByTestId('kpi-available-cap')).toHaveTextContent('9')
  })

  it('FN-032-05: Khôi phục gốc khi bấm Hủy thay đổi', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Tăng sức chứa CONTAINER
    const increaseBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Xe container/i,
    })
    await user.click(increaseBtn)
    expect(screen.getByTestId('kpi-total-cap')).toHaveTextContent('81')

    // Nút Khôi Phục Gốc (Hủy Thay Đổi) sáng lên
    const resetBtn = screen.getByRole('button', {
      name: /Hủy thay đổi/i,
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
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Tăng sức chứa 1 loại xe
    const increaseBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Xe container/i,
    })
    await user.click(increaseBtn)

    // Bấm Lưu cấu hình hàng loạt
    const saveBtn = screen.getByRole('button', {
      name: /Lưu sức chứa/i,
    })
    expect(saveBtn).not.toBeDisabled()
    await user.click(saveBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Lưu cấu hình sức chứa thành công!/i),
      ).toBeInTheDocument()
    })
  })

  it('FN-032-07: Mở ConfirmDecreaseModal khi giảm sức chứa, đóng modal bằng phím Escape và khóa cuộn trang nền (TSK-P2-02 A11y)', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Container: đang có 30, occupied 28. Bấm giảm 1 slot xuống 29 (hợp lệ >= 28)
    const decreaseContainerBtn = screen.getByRole('button', {
      name: /Giảm sức chứa Xe container/i,
    })
    await user.click(decreaseContainerBtn)

    // Bấm nút Lưu cấu hình hàng loạt -> kích hoạt Modal xác nhận vì có giảm sức chứa
    const saveBtn = screen.getByRole('button', {
      name: /Lưu sức chứa/i,
    })
    await user.click(saveBtn)

    // Modal hiển thị chuẩn A11y
    const modal = await screen.findByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Xác nhận giảm sức chứa?')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')

    // Nhấn phím Escape để đóng modal
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(document.body.style.overflow).toBe('')
  })

  it('FN-032-08: Ngăn chặn gửi 2 request trùng lặp (double-click) khi đang lưu cấu hình hàng loạt (TSK-P2-01)', async () => {
    let resolveMutation!: (value: typeof slots) => void
    const pendingPromise = new Promise<typeof slots>((resolve) => {
      resolveMutation = resolve
    })
    vi.spyOn(api, 'updateMerchantLotSlotsBulk').mockReturnValue(pendingPromise)

    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText(/Cấu hình sức chứa/i)).toBeInTheDocument()
    })

    // Tăng sức chứa 1 loại xe
    const increaseBtn = screen.getByRole('button', {
      name: /Tăng sức chứa Xe container/i,
    })
    await user.click(increaseBtn)

    const saveBtn = screen.getByRole('button', {
      name: /Lưu sức chứa/i,
    })
    expect(saveBtn).not.toBeDisabled()

    // Click lần 1
    await user.click(saveBtn)

    // Khi mutation đang in-flight: nút phải bị disabled kèm aria-busy và không thể click tiếp
    expect(saveBtn).toBeDisabled()
    expect(saveBtn).toHaveAttribute('aria-busy', 'true')
    expect(api.updateMerchantLotSlotsBulk).toHaveBeenCalledTimes(1)

    // Click lần 2 khi đang pending
    await user.click(saveBtn)
    expect(api.updateMerchantLotSlotsBulk).toHaveBeenCalledTimes(1)

    // Resolve mutation
    resolveMutation(slots)
    await waitFor(() => {
      expect(
        screen.getByText(/Lưu cấu hình sức chứa thành công!/i),
      ).toBeInTheDocument()
    })
  })
})
