import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { ParkingDetailPage } from '../pages/ParkingDetailPage'
import {
  fallbackFacilityDetail,
  fallbackDriverReviews,
} from '../api/parkingDetailApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/parking/1']) {
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
          <Route path="/parking/:id" element={ui} />
          <Route path="/dashboard/parking/:id" element={ui} />
          <Route path="/parking" element={<div>Bản đồ tìm bãi</div>} />
          <Route path="/queues" element={<div>Hàng đợi ảo</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SCR-016: Parking Details & Instant Physical Reservation (Chi tiết bãi đỗ & Đặt giữ chỗ)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('/api/v1/parking-lots/')) {
        return Promise.resolve({ data: fallbackFacilityDetail })
      }
      if (url.includes('/api/v1/reviews/')) {
        return Promise.resolve({ data: fallbackDriverReviews })
      }
      return Promise.resolve({ data: {} })
    })
  })

  it('renders breadcrumb back navigation and realtime pulse status', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByText(/QUAY LẠI BẢN ĐỒ TÌM BÃI/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/CẬP NHẬT TRẠNG THÁI REALTIME: CÁT LÁI GATE 2/i)
    ).toBeInTheDocument()
  })

  it('renders facility header card with verified badge, code, rating and clearance specs', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByText(/ĐÃ KIỂM DUYỆT BỞI SMARTTRUCK \(VERIFIED YARD\)/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/VN-SGN-CLG2-09/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Bãi Đỗ Xe & Trạm Dịch Vụ Container Tân Cảng - Cát Lái/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/4\.9/)).toBeInTheDocument()
    expect(screen.getByText(/0908 123 456/i)).toBeInTheDocument()
    expect(
      screen.getByText(/GATE CLEARANCE: 4\.8M TẢI TRỌNG MAX 60T/i)
    ).toBeInTheDocument()
  })

  it('renders photo gallery with 3 infrastructure inspection images and captions', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(screen.getByText(/Barie ALPR tự động 0\.2s/i)).toBeInTheDocument()
    expect(screen.getByText(/Bê tông cốt thép 60 Tấn/i)).toBeInTheDocument()
    expect(screen.getByText(/Trạm cắm Reefer 380V/i)).toBeInTheDocument()
  })

  it('renders live slot capacity matrix for 5 vehicle categories with progress bars', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByText(/Trạng Thái Sức Chứa Thời Gian Thực/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/TOTAL: 70\/175 TRỐNG/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Xe Đầu Kéo & Container 40FT \/ 45FT/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/MẬT ĐỘ CAO 85%/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Nặng \(trên 10 tấn - 3, 4 chân\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Trung \(3\.5 - 10 tấn\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe Tải Nhỏ \(< 3\.5 tấn\)/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Xe Khách & Ô Tô Con Hỗ Trợ Đội Xe/i)
    ).toBeInTheDocument()
  })

  it('renders transparent pricing rules table for all vehicles and deposit notice', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Biểu Phí Niêm Yết Minh Bạch/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/QUY ĐỊNH VẬN HÀNH 2025/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Container 40FT \/ 45FT/i).length).toBeGreaterThanOrEqual(1)
    expect(
      screen.getByText(/Phí cọc giữ chỗ vật lý cố định/i)
    ).toBeInTheDocument()
  })

  it('renders 8 logistics amenities and equipment badges', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Hạ Tầng Dịch Vụ & Hỗ Trợ Bác Tài/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/Bảo Vệ Tuần Tra 24\/7/i)).toBeInTheDocument()
    expect(screen.getByText(/Camera AI 360° Giám Sát/i)).toBeInTheDocument()
    expect(screen.getByText(/Barie Tự Động ALPR/i)).toBeInTheDocument()
    expect(screen.getByText(/Phòng Tắm Nước Nóng/i)).toBeInTheDocument()
    expect(screen.getByText(/Phòng Nghỉ Máy Lạnh/i)).toBeInTheDocument()
    expect(screen.getByText(/Cắm Sạc Reefer 380V/i)).toBeInTheDocument()
    expect(screen.getByText(/Trạm Cân Điện Tử 100T/i)).toBeInTheDocument()
    expect(screen.getByText(/Cơm Tài Xế Đối Diện/i)).toBeInTheDocument()
  })

  it('renders real driver reviews with verified vehicle plates', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Đánh Giá Bác Tài Thực Tế/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/284 NHẬN XÉT/i)).toBeInTheDocument()
    expect(screen.getByText(/Nguyễn Long/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe 15C-902\.11/i)).toBeInTheDocument()
    expect(screen.getByText(/Trần Hoàng/i)).toBeInTheDocument()
    expect(screen.getByText(/Võ Quốc Khánh/i)).toBeInTheDocument()
  })

  it('renders sticky reservation desk with countdown, vehicle plate and financial ledger', async () => {
    renderWithProviders(<ParkingDetailPage />)

    expect(screen.getByText(/ĐIỀU PHỐI TỨC THÌ/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /ĐẶT GIỮ CHỖ VẬT LÝ/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/LOCK 10 PHÚT/i)).toBeInTheDocument()
    expect(screen.getByText(/51D-894\.12/i)).toBeInTheDocument()
    expect(screen.getByText(/12 SLOT TRỐNG/i)).toBeInTheDocument()
    expect(screen.getByText(/PHÙ HỢP HOÀN TOÀN VỚI XE BẠN/i)).toBeInTheDocument()
    expect(screen.getByText(/Tổng thanh toán cọc ngay:/i)).toBeInTheDocument()
    expect(
      screen.getByText(/XÁC NHẬN ĐẶT CHỖ & MỞ THANH TOÁN CỌC/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Tham Gia Hàng Đợi Ảo Cát Lái/i)
    ).toBeInTheDocument()
  })

  it('opens interactive booking flow modal and processes payment simulation', async () => {
    renderWithProviders(<ParkingDetailPage />)

    // Modal initially not visible
    expect(screen.queryByText(/THANH TOÁN GIỮ CHỖ VẬT LÝ/i)).not.toBeInTheDocument()

    // Click CTA to open modal
    const openModalBtn = screen.getByRole('button', {
      name: /XÁC NHẬN ĐẶT CHỖ & MỞ THANH TOÁN CỌC/i,
    })
    fireEvent.click(openModalBtn)

    // Modal is opened
    expect(screen.getByText(/THANH TOÁN GIỮ CHỖ VẬT LÝ/i)).toBeInTheDocument()
    expect(screen.getByText(/Xác Nhận Giữ Slot \(10 Phút\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Ví Tài Xế SmartTruck Pay/i)).toBeInTheDocument()
    expect(screen.getByText(/Tài Khoản Doanh Nghiệp \(Post-Paid\)/i)).toBeInTheDocument()

    // Confirm payment button
    const confirmBtn = screen.getByRole('button', {
      name: /THANH TOÁN 100\.000 ₫ & MỞ KHÓA BARIE/i,
    })
    fireEvent.click(confirmBtn)

    // Shows loading feedback
    expect(
      screen.getByText(/ĐANG KHÓA SLOT VẬT LÝ & GỬI ALPR\.\.\./i)
    ).toBeInTheDocument()

    // Wait for success confirmation
    await waitFor(
      () => {
        expect(
          screen.getByText(/Giao dịch giữ chỗ thành công/i)
        ).toBeInTheDocument()
        expect(
          screen.getByText(/ĐẶT CHỖ THÀNH CÔNG! Slot BERTH C-14/i)
        ).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Click dismiss button
    const understandBtn = screen.getByRole('button', {
      name: /ĐÃ HIỂU & QUAY LẠI/i,
    })
    fireEvent.click(understandBtn)

    // Modal closed
    expect(screen.queryByText(/THANH TOÁN GIỮ CHỖ VẬT LÝ/i)).not.toBeInTheDocument()
  })
})
