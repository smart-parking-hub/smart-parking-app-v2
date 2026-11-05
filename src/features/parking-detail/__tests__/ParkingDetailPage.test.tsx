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
          <Route path="/dashboard/search" element={<div>Bản đồ tìm bãi (SCR-015)</div>} />
          <Route path="/dashboard/bookings" element={<div>Vé & Đặt chỗ của tôi (SCR-017)</div>} />
          <Route path="/dashboard/queues" element={<div>Hàng đợi ảo Cát Lái (SCR-018)</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('SCR-016: Parking Details & Instant Physical Reservation (Chi tiết bãi đỗ & Đặt giữ chỗ 10p)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation((url: string) => {
      if (url.includes('/api/v1/parking-lots/9999')) {
        const error = new Error('Not Found') as Error & { response?: { status?: number } }
        error.response = { status: 404 }
        return Promise.reject(error)
      }
      if (url.includes('/api/v1/parking-lots/500')) {
        return Promise.reject(new Error('Server Error 500'))
      }
      if (url.includes('/api/v1/parking-lots/')) {
        return Promise.resolve({ data: fallbackFacilityDetail })
      }
      if (url.includes('/api/v1/reviews/')) {
        return Promise.resolve({ data: fallbackDriverReviews })
      }
      return Promise.resolve({ data: {} })
    })

    vi.mocked(apiClient.post).mockImplementation((url: string) => {
      if (url.includes('/api/v1/bookings')) {
        return Promise.resolve({
          data: {
            id: 'BK-2025-CLG2-014',
            bookingId: 'BK-2025-CLG2-014',
            slotBerth: 'BERTH C-14',
            payOsCheckoutUrl: 'https://pay.payos.vn/web/demo-sth-deposit-20',
          },
        })
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

  it('opens interactive 2-step booking flow modal (GAP-05 · SCR-MOD-07) and processes PayOS 20% deposit', async () => {
    renderWithProviders(<ParkingDetailPage />)

    // Modal initially not visible
    expect(screen.queryByText(/GAP-05 · ĐẶT GIỮ CHỖ 10 PHÚT/i)).not.toBeInTheDocument()

    // Click CTA to open modal
    const openModalBtn = screen.getByRole('button', {
      name: /XÁC NHẬN ĐẶT CHỖ & MỞ THANH TOÁN CỌC/i,
    })
    fireEvent.click(openModalBtn)

    // Modal Step 1: Configuration is opened
    expect(screen.getByText(/GAP-05 · ĐẶT GIỮ CHỖ 10 PHÚT/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Bước 1: Xác Nhận Thông Tin & Khóa Slot/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/HOLD TTL/i)).toBeInTheDocument()
    expect(screen.getByText(/Cổng Thanh Toán Quốc Gia PayOS \(VietQR\)/i)).toBeInTheDocument()

    // Step 1: Click Continue to Step 2
    const step1Btn = screen.getByRole('button', {
      name: /TIẾP TỤC THANH TOÁN CỌC/i,
    })
    fireEvent.click(step1Btn)

    // Modal Step 2: PayOS Checkout is displayed
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Bước 2: Thanh Toán Cọc PayOS \(20%\)/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/KẾT NỐI CỔNG PAYOS VIETQR 24\/7/i)).toBeInTheDocument()
    expect(screen.getByText(/STH-BKG-2025-CLG2/i)).toBeInTheDocument()
    expect(screen.getByText(/Mở liên kết thanh toán PayOS Checkout/i)).toBeInTheDocument()

    // Confirm PayOS payment button
    const confirmBtn = screen.getByRole('button', {
      name: /THANH TOÁN .* & MỞ KHÓA BARIE/i,
    })
    fireEvent.click(confirmBtn)

    // Shows loading feedback
    expect(
      screen.getByText(/ĐANG KHÓA SLOT VẬT LÝ & GỬI ALPR\.\.\./i)
    ).toBeInTheDocument()

    // Wait for Step 3: Success confirmation
    await waitFor(
      () => {
        expect(screen.getByText(/GIAO DỊCH PAYOS HOÀN TẤT/i)).toBeInTheDocument()
        expect(screen.getByText(/Giao dịch giữ chỗ thành công/i)).toBeInTheDocument()
        expect(
          screen.getByText(/ĐẶT CHỖ THÀNH CÔNG! Slot/i)
        ).toBeInTheDocument()
      },
      { timeout: 3000 }
    )

    // Outbound action button present
    expect(
      screen.getByText(/XEM VÉ & MÃ QR TẠI ĐẶT CHỖ CỦA TÔI \(SCR-017\)/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/THAM GIA HÀNG ĐỢI ẢO \(SCR-018\)/i)
    ).toBeInTheDocument()

    // Click dismiss button
    const dismissBtn = screen.getByRole('button', {
      name: /ĐÃ HIỂU & QUAY LẠI/i,
    })
    fireEvent.click(dismissBtn)

    // Modal closed
    expect(screen.queryByText(/GAP-05 · ĐẶT GIỮ CHỖ 10 PHÚT/i)).not.toBeInTheDocument()
  })

  it('renders empty state when parking lot does not exist', async () => {
    renderWithProviders(<ParkingDetailPage />, ['/parking/9999'])

    await waitFor(() => {
      expect(screen.getByText(/Bãi Đỗ Xe Không Tồn Tại/i)).toBeInTheDocument()
      expect(screen.getByText(/QUAY LẠI BẢN ĐỒ TÌM BÃI \(SCR-015\)/i)).toBeInTheDocument()
    })
  })
})
