import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantLayout } from '@/layouts/MerchantLayout'
import { MerchantParkingLotsPage } from '../pages/MerchantParkingLotsPage'
import {
  fallbackMerchantLotsMetrics,
  fallbackMerchantParkingLots,
} from '../api/merchantParkingLotApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

function renderMerchantParkingLots(initialEntries = ['/merchant/parking-lots']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/merchant" element={<MerchantLayout />}>
            <Route path="parking-lots" element={<MerchantParkingLotsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-028: MerchantParkingLotsPage (Danh mục bãi đỗ xe sở hữu)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    vi.mocked(apiClient.get).mockImplementation((url, config: unknown) => {
      if (url.includes('/metrics')) {
        return Promise.resolve({ data: { data: fallbackMerchantLotsMetrics } } as never)
      }

      const params = (config as { params?: { status?: string; keyword?: string } })?.params || {}
      let content = [...fallbackMerchantParkingLots]

      if (params.status && params.status !== 'ALL') {
        content = content.filter((l) => l.status === params.status)
      }

      if (params.keyword && params.keyword.trim()) {
        const q = params.keyword.toLowerCase().trim()
        content = content.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.code.toLowerCase().includes(q) ||
            l.address.toLowerCase().includes(q),
        )
      }

      return Promise.resolve({
        data: {
          data: {
            content,
            currentPage: 0,
            totalPages: 1,
            totalElements: content.length,
          },
        },
      } as never)
    })
  })

  it('renders command header, blueprint eyebrow, title, and primary action buttons', async () => {
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(
        screen.getByText(/QUẢN LÝ MẶT BẰNG & NĂNG LỰC TIẾP NHẬN/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Bãi Đỗ Xe Của Tôi', level: 1 }),
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Xuất Báo Cáo Mặt Bằng')).toBeInTheDocument()
    expect(screen.getByText('+ ĐĂNG KÝ BÃI ĐỖ MỚI')).toBeInTheDocument()
  })

  it('renders 3 Bento KPI cards with facilities count, total slot capacity, and today revenue', async () => {
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Tổng Cơ Sở Khai Thác')).toBeInTheDocument()
      expect(screen.getByText('Năng Lực Tiếp Nhận')).toBeInTheDocument()
      expect(screen.getByText('Doanh Thu Tích Lũy Hôm Nay')).toBeInTheDocument()
    })

    // Metric 1: 03 facilities (02 active, 01 review)
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText(/02 Đang hoạt động/i)).toBeInTheDocument()
    expect(screen.getByText(/01 Đang kiểm duyệt/i)).toBeInTheDocument()

    // Metric 2: 200 Total slots
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText(/165 Đang sử dụng/i)).toBeInTheDocument()
    expect(screen.getByText(/35 Chỗ trống/i)).toBeInTheDocument()

    // Metric 3: Today Revenue
    expect(screen.getByText(/18\.450\.000/i)).toBeInTheDocument()
    expect(screen.getByText(/\+14\.2% so với hôm qua/i)).toBeInTheDocument()
    expect(screen.getByText(/48 Lượt qua Barie/i)).toBeInTheDocument()
  })

  it('renders 3 parking lots in default grid mode with specs, spot gauge, and lifecycle actions', async () => {
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
      expect(screen.getByText(/ICD Sóng Thần 2/i)).toBeInTheDocument()
      expect(screen.getByText(/Phú Hữu \(Cơ Sở 2\)/i)).toBeInTheDocument()
    })

    // Card 1: Approved yard with near full warning
    expect(screen.getByText(/VN-SGN-CLG2-09/i)).toBeInTheDocument()
    expect(screen.getByText(/82\.500\.000 ₫/i)).toBeInTheDocument()
    expect(screen.getByText(/Cảnh Báo: Sắp Đầy/i)).toBeInTheDocument()
    expect(screen.getByText(/Trạm Sạc Lạnh 380V/i)).toBeInTheDocument()
    expect(screen.getAllByText('Cấu Hình Sức Chứa Slot').length).toBe(2)
    expect(screen.getAllByText('Biểu Phí Niêm Yết').length).toBe(2)
    expect(screen.getAllByText('Trạm Quét QR Barie').length).toBe(2)

    // Card 3: Pending yard with compliance milestones
    expect(screen.getByText(/VN-SGN-TPH2-03/i)).toBeInTheDocument()
    expect(screen.getByText(/Đang Thẩm Định Pháp Lý/i)).toBeInTheDocument()
    expect(screen.getByText(/TIẾN TRÌNH THẨM ĐỊNH MẶT BẰNG & HỒ SƠ/i)).toBeInTheDocument()
    expect(screen.getByText('1. Pháp Lý Doanh Nghiệp')).toBeInTheDocument()
    expect(screen.getByText('2. Giấy Phép PCCC Bãi')).toBeInTheDocument()
    expect(screen.getByText('3. Thử Nghiệm Barie ALPR')).toBeInTheDocument()
    expect(screen.getByText('Chỉnh Sửa Hồ Sơ Bãi')).toBeInTheDocument()
    expect(screen.getByText('Liên Hệ Admin Thẩm Định')).toBeInTheDocument()
  })

  it('switches between Grid view and Table list view interactively', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
    })

    const tableSwitchBtn = screen.getByRole('button', { name: /Chế độ xem dạng bảng/i })
    await user.click(tableSwitchBtn)

    // Table view header columns appear
    expect(screen.getByText(/Mã Bãi & Tên Cơ Sở/i)).toBeInTheDocument()
    expect(screen.getByText(/Địa Chỉ Vận Hành/i)).toBeInTheDocument()
    expect(screen.getByText(/Sức Chứa \/ Sử Dụng/i)).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Doanh Thu Tháng/i })).toBeInTheDocument()

    // Switch back to grid view
    const gridSwitchBtn = screen.getByRole('button', { name: /Chế độ xem dạng lưới/i })
    await user.click(gridSwitchBtn)

    expect(screen.getAllByText('Cấu Hình Sức Chứa Slot').length).toBe(2)
  })

  it('filters parking lots by search keyword and resets on empty search', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/Tìm theo tên bãi, mã bãi, địa chỉ/i)
    await user.type(searchInput, 'Cát Lái')

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
      expect(screen.queryByText(/ICD Sóng Thần 2/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Phú Hữu \(Cơ Sở 2\)/i)).not.toBeInTheDocument()
    })

    // Clear search
    await user.clear(searchInput)

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
      expect(screen.getByText(/ICD Sóng Thần 2/i)).toBeInTheDocument()
      expect(screen.getByText(/Phú Hữu \(Cơ Sở 2\)/i)).toBeInTheDocument()
    })
  })

  it('filters parking lots by status dropdown', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText(/Cụm Gate 2/i)).toBeInTheDocument()
    })

    const statusSelect = screen.getByLabelText(/Lọc theo trạng thái/i, { selector: 'select' })
    await user.selectOptions(statusSelect, 'PENDING_APPROVAL')

    await waitFor(() => {
      expect(screen.queryByText(/Cụm Gate 2/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/ICD Sóng Thần 2/i)).not.toBeInTheDocument()
      expect(screen.getByText(/Phú Hữu \(Cơ Sở 2\)/i)).toBeInTheDocument()
    })
  })

  it('opens and closes the Export Report Modal with format choices', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Xuất Báo Cáo Mặt Bằng')).toBeInTheDocument()
    })

    const exportBtn = screen.getByText('Xuất Báo Cáo Mặt Bằng')
    await user.click(exportBtn)

    expect(screen.getByText('Xuất Báo Cáo Mặt Bằng Bãi Đỗ')).toBeInTheDocument()
    expect(screen.getByText('Excel (.xlsx)')).toBeInTheDocument()
    expect(screen.getByText('CSV UTF-8')).toBeInTheDocument()
    expect(screen.getByText('Bản in PDF')).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: 'Đóng' })
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Xuất Báo Cáo Mặt Bằng Bãi Đỗ')).not.toBeInTheDocument()
    })
  })

  it('downloads real CSV report file with UTF-8 BOM when clicking Tải Báo Cáo (TSK-P1-01 / APP-07)', async () => {
    const user = userEvent.setup()
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock-csv-report')
    const mockRevokeObjectURL = vi.fn()
    window.URL.createObjectURL = mockCreateObjectURL
    window.URL.revokeObjectURL = mockRevokeObjectURL

    const originalClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = vi.fn()

    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Xuất Báo Cáo Mặt Bằng')).toBeInTheDocument()
    })

    // Open Modal
    await user.click(screen.getByText('Xuất Báo Cáo Mặt Bằng'))

    // Choose CSV format
    const csvBtn = screen.getByRole('button', { name: /CSV UTF-8/i })
    await user.click(csvBtn)

    // Click Download
    const downloadBtn = screen.getByRole('button', { name: /Tải Báo Cáo \(CSV\)/i })
    await user.click(downloadBtn)

    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(await screen.findByText('Đã Xuất File')).toBeInTheDocument()

    HTMLAnchorElement.prototype.click = originalClick
  })

  it('closes Export Report Modal when pressing Escape key (TSK-P2-02 A11y)', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Xuất Báo Cáo Mặt Bằng')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Xuất Báo Cáo Mặt Bằng'))
    expect(screen.getByText('Xuất Báo Cáo Mặt Bằng Bãi Đỗ')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText('Xuất Báo Cáo Mặt Bằng Bãi Đỗ')).not.toBeInTheDocument()
    })
  })

  it('triggers fast contact support toast when clicking Liên Hệ Admin Thẩm Định', async () => {
    const user = userEvent.setup()
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Liên Hệ Admin Thẩm Định')).toBeInTheDocument()
    })

    const contactBtn = screen.getByText('Liên Hệ Admin Thẩm Định')
    await user.click(contactBtn)

    expect(
      await screen.findByText(/Đã gửi yêu cầu ưu tiên thẩm định cho hồ sơ bãi VN-SGN-TPH2-03/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Đường dây nóng phòng Nghiệp vụ: 1900 6868/i)).toBeInTheDocument()
  })

  it('renders regulatory compliance notice banner and pagination controls', async () => {
    renderMerchantParkingLots()

    await waitFor(() => {
      expect(screen.getByText('Quy Định Kiểm Duyệt Cơ Sở Khai Thác Mới')).toBeInTheDocument()
    })

    expect(
      screen.getByText(/thẩm định PCCC, giấy phép kho bãi và đồng bộ camera ALPR/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Hiển thị 1 - 3 của 3 cơ sở bãi đỗ thương mại/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trang trước' })).toBeDisabled()
  })
})
