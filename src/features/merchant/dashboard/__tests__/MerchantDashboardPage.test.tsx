import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantLayout } from '@/layouts/MerchantLayout'
import { MerchantDashboardPage } from '../pages/MerchantDashboardPage'
import { fallbackMerchantDashboardData } from '../api/merchantDashboardApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

function renderMerchantPage(initialEntries = ['/merchant/dashboard']) {
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
            <Route path="dashboard" element={<MerchantDashboardPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-026: MerchantDashboardPage (Bảng Điều Khiển Doanh Thu & Lưu Lượng Chủ Bãi)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        totalRevenue: fallbackMerchantDashboardData.kpis.totalMonthlyRevenueNet,
        walletBalance: fallbackMerchantDashboardData.kpis.walletBalance,
        content: [],
      },
    })
  })

  it('renders merchant layout sidebar with 8 items and header controls', async () => {
    renderMerchantPage()

    // 1. Sidebar Brand & Ops badge
    expect(screen.getAllByText(/SMARTTRUCK/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/MERCHANT OPS/i).length).toBeGreaterThanOrEqual(1)

    // 2. Sidebar Navigation Items
    expect(screen.getByText('Tổng quan')).toBeInTheDocument()
    expect(screen.getByText('Bãi đỗ của tôi')).toBeInTheDocument()
    expect(screen.getByText('Quản lý đặt chỗ')).toBeInTheDocument()
    expect(screen.getByText('Trạm Barie & Quét QR')).toBeInTheDocument()
    expect(screen.getByText('Báo cáo doanh thu')).toBeInTheDocument()
    expect(screen.getByText('Ví & Rút tiền')).toBeInTheDocument()
    expect(screen.getByText('Xử lý khiếu nại')).toBeInTheDocument()
    expect(screen.getByText('Hồ sơ bến bãi')).toBeInTheDocument()

    // 3. Technical Footer
    expect(screen.getByText(/1900 6868 \(Nhánh 2\)/i)).toBeInTheDocument()
    expect(screen.getByText(/ISO 27001/i)).toBeInTheDocument()

    // 4. Header Breadcrumb & Profile
    expect(screen.getByText('Tổng quan vận hành')).toBeInTheDocument()
    expect(screen.getByText(/Lê Văn Thành \(Tổng Kho Tân Cảng\)/i)).toBeInTheDocument()
    expect(screen.getByText('#MCH-88219')).toBeInTheDocument()
  })

  it('renders command surface and 4 Bento KPI cards with financial metrics', async () => {
    renderMerchantPage()

    await waitFor(() => {
      expect(screen.getByText('Bảng Điều Khiển Doanh Thu & Lưu Lượng')).toBeInTheDocument()
    })

    // Command Header
    expect(
      screen.getByText(/TỔNG QUAN VẬN HÀNH BẾN BÃI · CẬP NHẬT REALTIME 10S/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Mở Trạm Quét Barie ALPR')).toBeInTheDocument()
    expect(screen.getByText('+ Đăng Ký Bãi Đỗ Mới')).toBeInTheDocument()

    // KPI 1: Tổng Doanh Thu Tháng (NET)
    expect(screen.getByText(/TỔNG DOANH THU THÁNG \(NET\)/i)).toBeInTheDocument()
    expect(screen.getByText('148.500.000')).toBeInTheDocument()
    expect(screen.getByText('+14.2%')).toBeInTheDocument()
    expect(screen.getByText(/Ví: 42.800.000 ₫/i)).toBeInTheDocument()

    // KPI 2: Tỷ Lệ Lấp Đầy Trung Bình
    expect(screen.getByText(/TỶ LỆ LẤP ĐẦY TRUNG BÌNH/i)).toBeInTheDocument()
    expect(screen.getByText('82.5%')).toBeInTheDocument()
    expect(screen.getByText(/\(165\/200 Slot\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Cont 40FT: 92%/i)).toBeInTheDocument()

    // KPI 3: Lượt Check-in Hôm Nay
    expect(screen.getByText(/LƯỢT CHECK-IN HÔM NAY/i)).toBeInTheDocument()
    expect(screen.getByText('48')).toBeInTheDocument()
    expect(screen.getByText(/0.18s Barie/i)).toBeInTheDocument()

    // KPI 4: Lệnh Rút Tiền Đang Chờ
    expect(screen.getByText(/LỆNH RÚT TIỀN ĐANG CHỜ/i)).toBeInTheDocument()
    expect(screen.getByText('25.000.000')).toBeInTheDocument()
    expect(screen.getByText('PENDING')).toBeInTheDocument()
  })

  it('renders 65:35 operational split with revenue chart, manifest table, 3 live yards, and ALPR cameras', async () => {
    renderMerchantPage()

    await waitFor(() => {
      expect(
        screen.getByText(/Doanh Thu & Lưu Lượng 7 Ngày Gần Nhất/i),
      ).toBeInTheDocument()
    })

    // SECTION 1: Revenue Volume Chart
    expect(screen.getAllByText(/7 Ngày Gần Nhất/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Đỉnh điểm lưu lượng: 18\/02\/2026/i)).toBeInTheDocument()
    expect(screen.getByText(/26.400.000 ₫ \(72 lượt vào\/ra\)/i)).toBeInTheDocument()

    // SECTION 2: 5 Check-in Manifest items
    expect(screen.getByText(/5 Đơn Check-in Gần Nhất Cần Chú Ý/i)).toBeInTheDocument()
    expect(screen.getByText('60C-912.44')).toBeInTheDocument()
    expect(screen.getByText(/QUÁ HẠN \+15 PHÚT/i)).toBeInTheDocument()
    expect(screen.getByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText(/CẮM ĐIỆN LẠNH · ĐANG ĐỖ/i)).toBeInTheDocument()
    expect(screen.getByText('72H-019.82')).toBeInTheDocument()
    expect(screen.getByText('29C-553.19')).toBeInTheDocument()
    expect(screen.getByText('15C-408.77')).toBeInTheDocument()

    // SECTION 3: 3 Live Yards
    expect(screen.getByText(/Tình Trạng 03 Cụm Bãi/i)).toBeInTheDocument()
    expect(screen.getByText('Cát Lái Gate 2')).toBeInTheDocument()
    expect(screen.getByText(/90% SẮP ĐẦY/i)).toBeInTheDocument()
    expect(screen.getByText('ICD Sóng Thần 2')).toBeInTheDocument()
    expect(screen.getByText(/81% BÌNH THƯỜNG/i)).toBeInTheDocument()
    expect(screen.getByText('Depot Tân Cảng Phú Hữu')).toBeInTheDocument()
    expect(screen.getByText('PENDING_APPROVAL')).toBeInTheDocument()

    // SECTION 4: ALPR Gate Cameras
    expect(screen.getByText(/Trạm Barie & Camera ALPR/i)).toBeInTheDocument()
    expect(screen.getByText('CAM-01 LÀN VÀO')).toBeInTheDocument()
    expect(screen.getByText('CAM-02 LÀN RA')).toBeInTheDocument()
    expect(screen.getByText(/MỞ TRẠM QUÉT QR BARIE CHECK-IN \/ CHECK-OUT/i)).toBeInTheDocument()
  })
})
