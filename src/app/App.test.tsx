import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { DriverSolutionsPage } from '@/features/landing'
import { App } from './App'

describe('SmartTruckHub - 2 Distinct Landing Screens', () => {
  describe('Trang Chủ (Home Landing Page - SCR-001)', () => {
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

  describe('Trang Giải Pháp Tài Xế (Driver Solutions Page - SCR-001B)', () => {
    it('renders driver-specific hero, pain points, workflow and interactive amenity filter', () => {
      render(
        <MemoryRouter>
          <DriverSolutionsPage />
        </MemoryRouter>,
      )

      // 1. Driver Hero
      expect(
        screen.getByRole('heading', {
          name: /Lộ Trình Chủ Động\. Không Còn Cảnh Đậu Tràn Lề Đường Chờ Lốt\./i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Giải Pháp Vận Tải Thực Địa · 45,000\+ Bác Tài Toàn Quốc/i),
      ).toBeInTheDocument()

      // 2. Pain Points Bento
      expect(
        screen.getByText(/NHỮNG NỖI LO THƯỜNG TRỰC CỦA TÀI XẾ CONTAINER/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Được Thiết Kế Bởi Những Người Thấu Hiểu Bác Tài\./i,
        }),
      ).toBeInTheDocument()

      // 3. Driver Workflow
      expect(screen.getByText(/QUY TRÌNH VẬN HÀNH THỰC TẾ/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Vào Bãi Nhanh Gọn\. Không Cần Chờ Nhân Viên Soát Vé\./i,
        }),
      ).toBeInTheDocument()

      // 4. Real-time Amenity Filter & Interactive Toggle
      expect(
        screen.getByText(/BỘ LỌC THỰC TẾ THEO NHU CẦU XE NẶNG/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Tìm Bãi Có Đúng Tiện Ích Xe Bạn Cần\./i,
        }),
      ).toBeInTheDocument()

      const reeferButton = screen.getByRole('button', {
        name: /Cắm Sạc Điện Reefer 380V/i,
      })
      expect(reeferButton).toBeInTheDocument()
      fireEvent.click(reeferButton)
      expect(reeferButton.className).toContain('bg-[#F97316]')

      // 5. Testimonials & CTA
      expect(screen.getByText(/TIẾNG NÓI TỪ CỘNG ĐỒNG BÁC TÀI/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Lái Xe An Tâm Hơn Trên Mọi Chặng Đường\. Bắt Đầu Ngay Hôm Nay\./i,
        }),
      ).toBeInTheDocument()
    })
  })
})
