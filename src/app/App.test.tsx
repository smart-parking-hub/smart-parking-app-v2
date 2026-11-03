import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { DriverSolutionsPage, OwnerSolutionsPage } from '@/features/landing'
import { App } from './App'

describe('SmartTruckHub - 3 Distinct Landing Screens', () => {
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

  describe('Trang Giải Pháp Chủ Bãi (Owner Solutions Page - SCR-001C)', () => {
    it('renders owner hero, pain points, interactive ROI calculator, merchant features, workflow, testimonials, FAQ and registration form', () => {
      render(
        <MemoryRouter>
          <OwnerSolutionsPage />
        </MemoryRouter>,
      )

      // 1. Owner Hero
      expect(
        screen.getByText(/HẠ TẦNG LOGISTICS SỐ HÓA · DÀNH CHO CHỦ MẶT BẰNG & CẢNG ICD/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Chuyển Đổi Số Bến Bãi\./i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/120\+ Đối tác mặt bằng/i)).toBeInTheDocument()
      expect(screen.getByText(/Cát Lái Hub Node 04/i)).toBeInTheDocument()

      // 2. 4 Pain Points
      expect(screen.getByText(/SO SÁNH HIỆU QUẢ VẬN HÀNH THỰC TẾ/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /4 Lỗ Hổng Khiến Chủ Bãi Thất Thoát Hàng Trăm Triệu Mỗi Năm\./i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Thất Thoát Tiền Mặt Bảo Vệ Ca Trực/i)).toBeInTheDocument()

      // 3. Interactive ROI Calculator
      expect(screen.getByText(/CÔNG CỤ MÔ PHỎNG HIỆU QUẢ ĐẦU TƯ/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Ước Tính Doanh Thu Khai Thác Bãi Của Bạn Mỗi Tháng\./i,
        }),
      ).toBeInTheDocument()

      // Check default computed revenue: 150 * 0.75 * 1.25 * 80000 * 30 = 337.500.000 ₫
      expect(screen.getByText(/337\.500\.000 ₫/i)).toBeInTheDocument()

      // Test interactive slider change
      const slotsSlider = screen.getByLabelText(/Sức chứa và quy mô bãi container/i)
      fireEvent.change(slotsSlider, { target: { value: '200' } })
      // 200 * 0.75 * 1.25 * 80000 * 30 = 450.000.000 ₫
      expect(screen.getByText(/450\.000\.000 ₫/i)).toBeInTheDocument()

      // 4. 5 Merchant Suite Features
      expect(screen.getByText(/HỆ THỐNG QUẢN TRỊ MERCHANT PORTAL CHUYÊN SÂU/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /5 Công Cụ Quản Trị Trọng Yếu/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Cấu Hình Phân Luồng & Sức Chứa 5 Loại Xe/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Ma Trận Biểu Phí Đa Tầng Linh Hoạt/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Trạm Barie Tự Động & Camera ALPR 360°/i,
        }),
      ).toBeInTheDocument()

      // 5. 4-Step Workflow
      expect(screen.getByText(/QUY TRÌNH TRIỂN KHAI THỰC ĐỊA/i)).toBeInTheDocument()
      expect(screen.getByText(/Đăng Ký Hồ Sơ Mặt Bằng/i)).toBeInTheDocument()
      expect(screen.getByText(/Khảo Sát Thực Địa & Lắp Barie/i)).toBeInTheDocument()

      // 6. Real Testimonials
      expect(screen.getByText(/Ý KIẾN ĐỐI TÁC KHAI THÁC THỰC TẾ/i)).toBeInTheDocument()
      expect(screen.getByText(/Ông Trần Đình Hùng/i)).toBeInTheDocument()
      expect(screen.getByText(/Bà Lê Thị Kim Oanh/i)).toBeInTheDocument()
      expect(screen.getByText(/Ông Nguyễn Văn Phúc/i)).toBeInTheDocument()

      // 7. FAQ Accordion
      expect(screen.getByText(/GIẢI ĐÁP THẮC MẮC ĐỐI TÁC/i)).toBeInTheDocument()
      expect(
        screen.getByText(/SmartTruckHub thu phí dịch vụ vận hành bao nhiêu % trên doanh thu\?/i),
      ).toBeInTheDocument()

      // 8. Onboarding Form & Submission
      expect(
        screen.getByRole('heading', {
          name: /Đăng Ký Khảo Sát & Mở Bãi Hợp Tác/i,
        }),
      ).toBeInTheDocument()

      const nameInput = screen.getByPlaceholderText(/Nguyễn Văn A/i)
      const phoneInput = screen.getByPlaceholderText(/0912 345 678/i)
      const locationInput = screen.getByPlaceholderText(/Cạnh KCN Sóng Thần/i)

      fireEvent.change(nameInput, { target: { value: 'Lê Hoàng Nam' } })
      fireEvent.change(phoneInput, { target: { value: '0988776655' } })
      fireEvent.change(locationInput, { target: { value: 'ICD Mỹ Thủy, TP Thủ Đức' } })

      const submitButton = screen.getByRole('button', {
        name: /XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ/i,
      })
      fireEvent.click(submitButton)

      expect(screen.getByText(/Đăng Ký Thành Công!/i)).toBeInTheDocument()
      expect(screen.getByText(/0988776655/i)).toBeInTheDocument()
    })
  })
})
