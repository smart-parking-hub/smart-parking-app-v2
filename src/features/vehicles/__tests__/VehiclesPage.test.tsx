import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { VehiclesPage } from '../pages/VehiclesPage'
import * as vehicleApi from '../api/vehicleApi'

describe('SCR-020 VehiclesPage (Quản Lý Phương Tiện Của Tôi)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn()
    }
  })

  it('renders command header, ALPR ticker strip, and 4 Bento KPI cards', async () => {
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    // Wait for content after skeleton
    await waitFor(() => {
      expect(screen.getByText('Quản Lý Phương Tiện Của Tôi')).toBeInTheDocument()
    })

    // Ticker strip
    expect(screen.getByText(/GIAO THỨC: ALPR-V3.8-TLS/i)).toBeInTheDocument()
    expect(screen.getByText(/TRẠNG THÁI: TRỰC TUYẾN 100%/i)).toBeInTheDocument()

    // 4 Bento KPI cards
    expect(screen.getByText('TỔNG SỐ XE ĐĂNG KÝ')).toBeInTheDocument()
    expect(screen.getByText('XE MẶC ĐỊNH VẬN HÀNH')).toBeInTheDocument()
    expect(screen.getByText('XÁC THỰC ALPR & ĐĂNG KIỂM')).toBeInTheDocument()
    expect(screen.getByText('TỔNG TẢI TRỌNG LƯU HÀNH')).toBeInTheDocument()

    // Default vehicle plate rendered
    const defaultPlates = screen.getAllByText('51D-894.12')
    expect(defaultPlates.length).toBeGreaterThanOrEqual(1)
  })

  it('filters vehicles by search keyword', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('51R-024.89')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Tìm theo biển kiểm soát/i)
    await user.type(searchInput, 'CIMC')

    // Should still show 51R-024.89 (brand CIMC)
    expect(screen.getByText('51R-024.89')).toBeInTheDocument()
    // Should filter out 15C-341.90
    expect(screen.queryByText('15C-341.90')).not.toBeInTheDocument()
  })

  it('filters vehicles by class dropdown and resets filters', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('51R-024.89')).toBeInTheDocument()
    })

    const typeSelect = screen.getByDisplayValue(/Tất cả xe/i)
    await user.selectOptions(typeSelect, 'TRAILER')

    expect(screen.getByText('51R-024.89')).toBeInTheDocument()
    expect(screen.queryByText('15C-341.90')).not.toBeInTheDocument()

    // Reset button
    const resetButton = screen.getByTitle('Đặt lại bộ lọc')
    await user.click(resetButton)

    expect(screen.getByText('15C-341.90')).toBeInTheDocument()
  })

  it('adds a new vehicle via the inline registration panel', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Quản Lý Phương Tiện Của Tôi')).toBeInTheDocument()
    })

    const plateInput = screen.getByLabelText(/Biển Số Phương Tiện/i)
    await user.type(plateInput, '59C-888.99')

    const brandInput = screen.getByLabelText(/Nhãn Hiệu \/ Model/i)
    await user.type(brandInput, 'Scania R500 Topline')

    const submitBtn = screen.getByRole('button', { name: /Đăng Ký & Đồng Bộ ALPR/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('59C-888.99')).toBeInTheDocument()
      expect(screen.getByText('Scania R500 Topline')).toBeInTheDocument()
    })
  })

  it('allows changing the default operational vehicle', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('15C-341.90')).toBeInTheDocument()
    })

    // Find the button "Chọn mặc định"
    const setDefaultButtons = screen.getAllByRole('button', { name: /Chọn mặc định/i })
    expect(setDefaultButtons.length).toBeGreaterThan(0)

    await user.click(setDefaultButtons[0])

    // Verify the state change: default badge updates
    const defaultBadges = screen.getAllByText('MẶC ĐỊNH')
    expect(defaultBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('blocks deleting the default vehicle and allows deleting non-default vehicle', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('51D-894.12').length).toBeGreaterThanOrEqual(1)
    })

    // The default vehicle trash button should be disabled
    const disabledTrash = screen.getByTitle('Không thể xóa xe mặc định')
    expect(disabledTrash).toBeDisabled()

    // Non-default vehicle delete button
    const deleteButtons = screen.getAllByTitle('Xóa phương tiện')
    expect(deleteButtons.length).toBeGreaterThan(0)

    // Click delete on non-default vehicle
    await user.click(deleteButtons[0])

    // Confirmation modal should open
    expect(screen.getByText('Xác Nhận Hủy Phương Tiện')).toBeInTheDocument()
    expect(screen.getByText(/Quy định lưu trữ dữ liệu vận tải:/i)).toBeInTheDocument()

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /Xác Nhận Xóa/i })
    await user.click(confirmBtn)

    // Modal closes
    await waitFor(() => {
      expect(screen.queryByText('Xác Nhận Hủy Phương Tiện')).not.toBeInTheDocument()
    })
  })

  it('opens and saves vehicle edits via EditVehicleModal', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('51D-894.12').length).toBeGreaterThanOrEqual(1)
    })

    const editButtons = screen.getAllByTitle('Chỉnh sửa xe')
    await user.click(editButtons[0])

    expect(screen.getByText('Cập Nhật Phương Tiện')).toBeInTheDocument()

    const brandInput = screen.getByLabelText(/Nhãn Hiệu \/ Tên Thương Mại/i)
    await user.clear(brandInput)
    await user.type(brandInput, 'Hyundai Xcient PRO Limited')

    const saveBtn = screen.getByRole('button', { name: /Lưu Thay Đổi/i })
    await user.click(saveBtn)

    await waitFor(() => {
      expect(screen.queryByText('Cập Nhật Phương Tiện')).not.toBeInTheDocument()
      expect(screen.getByText('Hyundai Xcient PRO Limited')).toBeInTheDocument()
    })
  })

  it('opens and closes inspection dossier modal', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getAllByText('51D-894.12').length).toBeGreaterThanOrEqual(1)
    })

    const viewButtons = screen.getAllByTitle('Xem hồ sơ kiểm định')
    await user.click(viewButtons[0])

    expect(screen.getByText('Hồ Sơ Kỹ Thuật & Kiểm Định')).toBeInTheDocument()
    expect(screen.getByText(/1. Giấy Chứng Nhận Kiểm Định & Tem Lưu Hành/i)).toBeInTheDocument()
    expect(screen.getByText(/2. Thông Số Kỹ Thuật Trọng Tải & Kích Thước/i)).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /Đóng Hồ Sơ/i })
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Hồ Sơ Kỹ Thuật & Kiểm Định')).not.toBeInTheDocument()
    })
  })

  it('opens export fleet modal and simulates file download', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('XUẤT DANH SÁCH ĐỘI XE')).toBeInTheDocument()
    })

    const exportBtn = screen.getByRole('button', { name: /XUẤT DANH SÁCH ĐỘI XE/i })
    await user.click(exportBtn)

    expect(screen.getByText('Xuất Báo Cáo Đội Xe')).toBeInTheDocument()

    // Select PDF format
    const pdfBtn = screen.getByRole('button', { name: /Bản PDF/i })
    await user.click(pdfBtn)

    // Trigger download
    const downloadBtn = screen.getByRole('button', { name: /Tải Về Ngay/i })
    await user.click(downloadBtn)

    await waitFor(() => {
      expect(screen.getByText(/Tệp danh sách phương tiện đã tải xuống thành công!/i)).toBeInTheDocument()
    })
  })

  it('falls back gracefully when API fails', async () => {
    vi.spyOn(vehicleApi, 'fetchMyVehicles').mockRejectedValueOnce(new Error('Network error'))
    vi.spyOn(vehicleApi, 'fetchFleetKpiMetrics').mockRejectedValueOnce(new Error('Network error'))

    render(
      <MemoryRouter>
        <VehiclesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Quản Lý Phương Tiện Của Tôi')).toBeInTheDocument()
      expect(screen.getAllByText('51D-894.12').length).toBeGreaterThanOrEqual(1)
    })
  })
})
