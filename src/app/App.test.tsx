import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('SmartTruckHub - Public Landing Page (SCR-001)', () => {
  it('renders home hero and all 8 main sections successfully', () => {
    render(<App />)

    // 1. Brand Logo
    expect(screen.getAllByText(/SMART/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/TRUCK/i).length).toBeGreaterThan(0)

    // 2. Home Hero Headline
    expect(
      screen.getByRole('heading', {
        name: /Sự Kết Tinh Giữa Công Nghệ Và Bãi Đỗ Xe Tải/i,
      }),
    ).toBeInTheDocument()

    // 3. Metrics Banner
    expect(screen.getByText(/20K\+/i)).toBeInTheDocument()
    expect(screen.getByText(/Lượt Xe Lưu Bãi \/ Ngày/i)).toBeInTheDocument()

    // 4. Services Grid
    expect(screen.getByText(/DANH MỤC DỊCH VỤ CHUYÊN DỤNG/i)).toBeInTheDocument()
    expect(screen.getByText(/Bãi Container & Depot Cảng/i)).toBeInTheDocument()

    // 5. Why Us Bento
    expect(screen.getByText(/ĐỘ TIN CẬY TUYỆT ĐỐI/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /Được Thiết Kế Cho Doanh Nghiệp Không Thể Chấp Nhận Rủi Ro\./i,
      }),
    ).toBeInTheDocument()

    // 6. How It Works (4 Steps)
    expect(screen.getByText(/QUY TRÌNH 4 BƯỚC ĐƠN GIẢN/i)).toBeInTheDocument()

    // 7. Pricing Matrix
    expect(screen.getByText(/BIỂU PHÍ NIÊM YẾT MINH BẠCH/i)).toBeInTheDocument()
    expect(screen.getByText(/Bảng Giá Thuê Bãi Theo Loại Phương Tiện/i)).toBeInTheDocument()

    // 8. Testimonials & Final Conversion CTA
    expect(screen.getByText(/BẢO CHỨNG TỪ KHÁCH HÀNG THỰC TẾ/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: /Sẵn Sàng Số Hóa Điểm Đỗ Xe Tải Không Còn Bất Cứ Bất Ngờ Nào\?/i,
      }),
    ).toBeInTheDocument()
  })
})
