import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import {
  DriverSolutionsPage,
  OwnerSolutionsPage,
  PricingPage,
  ApiDocsPage,
  AboutUsPage,
} from '@/features/landing'
import { App } from './App'

describe('SmartTruckHub - 6 Distinct Landing Screens', () => {
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
        <MemoryRouter initialEntries={['/driver-solutions']}>
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
        <MemoryRouter initialEntries={['/owner-solutions']}>
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

  describe('Trang Bảng Giá (Pricing Page - SCR-001D)', () => {
    it('renders pricing hero, 3 pricing cards with interactive billing switch, comparison table, FAQ and CTA banner', () => {
      render(
        <MemoryRouter initialEntries={['/pricing']}>
          <PricingPage />
        </MemoryRouter>,
      )

      // 1. Pricing Hero
      expect(
        screen.getByText(/BIỂU PHÍ NIÊM YẾT VẬN HÀNH · MINH BẠCH 100%/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Định Phí Rõ Ràng\. Tối Ưu Chi Phí Đỗ Cho/i,
        }),
      ).toBeInTheDocument()

      // 2. 3 Tier Cards
      expect(
        screen.getByRole('heading', { name: /Tài xế & Chủ xe/i }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^0 đ$/)).toBeInTheDocument()

      expect(
        screen.getByRole('heading', { name: /Đội xe & Doanh nghiệp 3PL/i }),
      ).toBeInTheDocument()
      // Default: turn payment -> 990.000 đ
      expect(screen.getByText(/990\.000 đ/i)).toBeInTheDocument()

      expect(
        screen.getByRole('heading', { name: /Chủ bãi & Depot/i }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^5%$/)).toBeInTheDocument()

      // 3. Interactive Billing Switch
      const monthlyButton = screen.getByRole('button', {
        name: /Hợp đồng tháng/i,
      })
      fireEvent.click(monthlyButton)
      expect(screen.getByText(/841\.500 đ/i)).toBeInTheDocument()

      const turnButton = screen.getByRole('button', {
        name: /Thanh toán theo lượt/i,
      })
      fireEvent.click(turnButton)
      expect(screen.getByText(/990\.000 đ/i)).toBeInTheDocument()

      // 4. Feature Comparison Table
      expect(screen.getByText(/ĐỐI CHIẾU NĂNG LỰC HỆ THỐNG/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Bảng So Sánh Tính Năng Chi Tiết/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Ví công nợ tập trung \(Fleet Corporate Wallet\)/i)).toBeInTheDocument()

      // 5. Pricing FAQ
      expect(screen.getByText(/HỖ TRỢ & GIẢI ĐÁP/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Câu Hỏi Thường Gặp Về Biểu Phí/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Tài xế sử dụng app SmartTruckHub có bị thu bất kỳ loại phí nào không\?/i),
      ).toBeInTheDocument()

      // 6. Bottom CTA
      expect(
        screen.getByRole('heading', {
          name: /Sẵn Sàng Tối Ưu Chi Phí Dừng Đỗ & Quản Lý Đội Xe\?/i,
        }),
      ).toBeInTheDocument()
    })
  })

  describe('Trang Kết Nối API & Webhooks (API & Developer Docs - SCR-001E)', () => {
    it('renders API hero, interactive terminal with tabs switching & copy payload, 4 bento integration modules, 3 onboarding steps and CTA banner', () => {
      // Mock navigator.clipboard
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      })

      render(
        <MemoryRouter initialEntries={['/api-docs']}>
          <ApiDocsPage />
        </MemoryRouter>,
      )

      // 1. API Hero
      expect(
        screen.getByText(/HẠ TẦNG KẾT NỐI MỞ · RESTFUL API & WEBHOOKS V3/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Tích Hợp API Điều Phối Bãi Đỗ Vào Hệ Thống/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/99.98% SLA Uptime/i)).toBeInTheDocument()
      expect(screen.getByText(/38ms Network Latency/i)).toBeInTheDocument()
      expect(screen.getByText(/OAuth2 \/ Bearer JWT/i)).toBeInTheDocument()

      // 2. Interactive Terminal & Tab Switching
      expect(screen.getByText(/SPECS & RUNTIME RUNBOOK/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Kiến Trúc API Điểm Chốt Thực Nghiệm/i,
        }),
      ).toBeInTheDocument()

      // Default Tab 1: POST /api/v1/bookings
      expect(screen.getByText(/Giữ chỗ thành công trong 10 phút/i)).toBeInTheDocument()
      expect(screen.getByText(/BK-2026-8941/i)).toBeInTheDocument()

      // Switch to Tab 2: GET /api/v1/parking-lots/search
      const tab2Button = screen.getByRole('tab', {
        name: /GET \/api\/v1\/parking-lots\/search/i,
      })
      fireEvent.click(tab2Button)
      expect(screen.getByText(/"totalMatches"/i)).toBeInTheDocument()
      expect(screen.getByText(/"Bãi Xe Logistics Cát Lái 02"/i)).toBeInTheDocument()

      // Switch to Tab 3: POST /api/v1/merchant/check-in
      const tab3Button = screen.getByRole('tab', {
        name: /POST \/api\/v1\/merchant\/check-in/i,
      })
      fireEvent.click(tab3Button)
      expect(screen.getByText(/"GATE-CATLAI-IN-01"/i)).toBeInTheDocument()
      expect(screen.getByText(/"OPEN_BARRIER"/i)).toBeInTheDocument()

      // Switch to Tab 4: HOOK booking.checked_in
      const tab4Button = screen.getByRole('tab', {
        name: /HOOK booking\.checked_in/i,
      })
      fireEvent.click(tab4Button)
      expect(screen.getByText(/"booking\.checked_in"/i)).toBeInTheDocument()
      expect(screen.getByText(/"ACTIVE_PARKED"/i)).toBeInTheDocument()

      // Test Copy Payload button
      const copyButton = screen.getByRole('button', {
        name: /Sao chép payload API/i,
      })
      fireEvent.click(copyButton)
      expect(writeTextMock).toHaveBeenCalled()
      expect(screen.getByText(/Đã sao chép/i)).toBeInTheDocument()

      // 3. 4 Enterprise Integration Modules (Bento)
      expect(screen.getByText(/GIẢI PHÁP CHUYÊN NGÀNH LOGISTICS 4.0/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /4 Năng Lực Tích Hợp Hệ Thống Trọng Yếu/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Tự động hóa điều phối chuyến \(Auto-Dispatch Integration\)/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Cổng Webhook sự kiện thời gian thực/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Ví số doanh nghiệp tập trung \(Corporate Fleet Wallet API\)/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Đồng bộ hóa đơn điện tử VAT \(Automated e-Invoice Sync\)/i,
        }),
      ).toBeInTheDocument()

      // 4. 3 Onboarding Steps
      expect(screen.getByText(/ONBOARDING QUY TRÌNH KỸ THUẬT/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Quy Trình 3 Bước Tích Hợp Vào Sản Phẩm/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Nhận Sandbox Key/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Thử Nghiệm Luồng Nghiệp Vụ/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Ký Kết SLA & Ra Mắt/i }),
      ).toBeInTheDocument()

      // 5. Bottom CTA Banner
      expect(screen.getByText(/CHUYÊN BIỆT CHO ĐỘI NGŨ ENGINEERING & 3PL/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Sẵn Sàng Nâng Tầm Năng Lực Vận Tải Cùng SmartTruck API\?/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/YÊU CẦU CẤP MÔI TRƯỜNG SANDBOX/i)).toBeInTheDocument()
      expect(screen.getByText(/TẢI BỘ SDK PYTHON & NODEJS \/ JAVA/i)).toBeInTheDocument()
    })
  })

  describe('Trang Về Chúng Tôi (About Us Page - SCR-001F)', () => {
    it('renders about hero with 4 metrics, narrative with quote, 4 core principles, roadmap timeline, leadership team and action banner', () => {
      render(
        <MemoryRouter initialEntries={['/about']}>
          <AboutUsPage />
        </MemoryRouter>,
      )

      // 1. Hero
      expect(
        screen.getByText(/SỨ MỆNH SỐ HÓA HẠ TẦNG LOGISTICS · KHỞI TẠO NĂM 2024/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Chúng Tôi Xây Dựng Hạ Tầng Điểm Đỗ Cho Mọi Bánh Xe Container Lăn Bánh\./i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^320\+$/)).toBeInTheDocument()
      expect(screen.getByText(/^45,000\+$/)).toBeInTheDocument()
      expect(screen.getByText(/^18%$/)).toBeInTheDocument()
      expect(screen.getByText(/^0 vụ$/)).toBeInTheDocument()

      // 2. Narrative Section
      expect(
        screen.getByText(/BỐI CẢNH THỰC ĐỊA & KHỞI NGUYÊN/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Nghịch Lý Bến Bãi Tại Các Cụm Cảng Huyết Mạch Việt Nam/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^3-4 Giờ$/)).toBeInTheDocument()
      expect(screen.getByText(/^0\.2 Giây$/)).toBeInTheDocument()
      expect(screen.getByText(/^100%$/)).toBeInTheDocument()
      expect(
        screen.getByText(/Công nghệ logistics không nằm ở những khẩu hiệu xa vời/i),
      ).toBeInTheDocument()

      // 3. Core Principles
      expect(screen.getByText(/QUY CHUẨN VẬN HÀNH/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /4 Trụ Cột Giá Trị Cốt Lõi/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Minh Bạch \(Radical Transparency\)/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /An Toàn \(Zero-Compromise Security\)/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Tốc Độ \(Sub-Second Latency\)/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Cộng Đồng \(Driver-First Empathy\)/i,
        }),
      ).toBeInTheDocument()

      // 4. Roadmap Milestones
      expect(screen.getByText(/HÀNH TRÌNH PHÁT TRIỂN/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Cột Mốc Kiến Tạo Hạ Tầng Số/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^2024$/)).toBeInTheDocument()
      expect(screen.getByText(/^2025$/)).toBeInTheDocument()
      expect(screen.getByText(/^2026$/)).toBeInTheDocument()
      expect(screen.getByText(/^2027$/)).toBeInTheDocument()
      expect(screen.getByText(/GIAI ĐOẠN HIỆN TẠI/i)).toBeInTheDocument()

      // 5. Leadership & Advisory
      expect(screen.getByText(/ĐỘI NGŨ CHUYÊN GIA/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Ban Lãnh Đạo & Cố Vấn Logistics/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Nguyễn Hoàng Nam/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Trần Bảo Long/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /Đặng Quốc Hưng/i }),
      ).toBeInTheDocument()

      // 6. Action Banner
      expect(screen.getByText(/HỢP TÁC CHIẾN LƯỢC/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Đồng Hành Cùng Chúng Tôi Kiến Tạo Tương Lai Vận Tải Việt Nam/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/LIÊN HỆ ĐỐI TÁC CHIẾN LƯỢC/i)).toBeInTheDocument()
    })
  })
})
