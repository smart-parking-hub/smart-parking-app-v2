import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import {
  DriverSolutionsPage,
  OwnerSolutionsPage,
  PricingPage,
  ApiDocsPage,
  AboutUsPage,
  CareersPage,
  InsightsPage,
  ContactPage,
} from '@/features/landing'
import { App } from './App'

describe('SmartTruckHub - 9 Distinct Landing Screens', () => {
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

  describe('Trang Tuyển Dụng Nhân Tài (Careers & Recruitment Page - SCR-001G)', () => {
    it('renders hero with perks, culture bento cards, filterable job list with apply modal, recruitment process and fast apply form', () => {
      render(
        <MemoryRouter initialEntries={['/careers']}>
          <CareersPage />
        </MemoryRouter>,
      )

      // 1. Careers Hero Section
      expect(
        screen.getByText(/TUYỂN DỤNG NHÂN TÀI · CÙNG ĐỊNH HÌNH LOGISTICS SỐ/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Gia Nhập Đội Ngũ Kiến Tạo Hạ Tầng Logistics Thông Minh\./i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/^Top 10%$/)).toBeInTheDocument()
      expect(screen.getByText(/^100% Apple \/ Dell$/)).toBeInTheDocument()
      expect(screen.getByText(/^Bảo Hiểm PVI$/)).toBeInTheDocument()
      expect(screen.getByText(/^Môi Trường Hybrid$/)).toBeInTheDocument()

      // 2. Culture Bento Section
      expect(screen.getByText(/ĐẶC QUYỀN & MÔI TRƯỜNG/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Văn Hóa Làm Việc Thực Chiến Tại SmartTruckHub/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/01 \/ THỰC ĐỊA LỚN/i)).toBeInTheDocument()
      expect(screen.getByText(/Giải Quyết Bài Toán Thực Địa Khó/i)).toBeInTheDocument()
      expect(screen.getByText(/02 \/ TỰ CHỦ HOÀN TOÀN/i)).toBeInTheDocument()
      expect(screen.getByText(/Quyền Tự Chủ Tuyệt Đối \(Ownership\)/i)).toBeInTheDocument()
      expect(screen.getByText(/03 \/ ĐÃI NGỘ XỨNG ĐÁNG/i)).toBeInTheDocument()
      expect(screen.getByText(/Lộ Trình Thăng Tiến & Cổ Phần ESOP/i)).toBeInTheDocument()
      expect(screen.getByText(/04 \/ TOÀN DIỆN/i)).toBeInTheDocument()
      expect(screen.getByText(/Chăm Sóc Sức Khỏe & Năng Lượng/i)).toBeInTheDocument()

      // 3. Open Positions & Department Filter
      expect(screen.getByText(/CƠ HỘI NGHỀ NGHIỆP MỞ/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Các Vị Trí Trọng Yếu Đang Tuyển Dụng/i,
        }),
      ).toBeInTheDocument()

      // Verify all 4 jobs present initially
      expect(
        screen.getByText(/Senior Backend Java Engineer \(Spring Boot \/ Microservices\)/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Senior Frontend Engineer \(React \/ TypeScript \/ Tailwind\)/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Chuyên Viên Phát Triển Thị Trường B2B \(Fleet Sales Lead\)/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Kỹ Sư Triển Khai IoT & Camera Barie ALPR/i),
      ).toBeInTheDocument()

      // Filter by Engineering (2)
      const engineeringTab = screen.getByRole('button', {
        name: /Kỹ Thuật & Hệ Thống \(2\)/i,
      })
      fireEvent.click(engineeringTab)
      expect(
        screen.getByText(/Senior Backend Java Engineer \(Spring Boot \/ Microservices\)/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Senior Frontend Engineer \(React \/ TypeScript \/ Tailwind\)/i),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/Chuyên Viên Phát Triển Thị Trường B2B/i),
      ).not.toBeInTheDocument()

      // Filter by Sales (1)
      const salesTab = screen.getByRole('button', {
        name: /Kinh Doanh B2B \(1\)/i,
      })
      fireEvent.click(salesTab)
      expect(
        screen.getByText(/Chuyên Viên Phát Triển Thị Trường B2B \(Fleet Sales Lead\)/i),
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/Senior Backend Java Engineer/i),
      ).not.toBeInTheDocument()

      // Filter by Operations (1)
      const opsTab = screen.getByRole('button', {
        name: /Vận Hành Thực Địa \(1\)/i,
      })
      fireEvent.click(opsTab)
      expect(
        screen.getByText(/Kỹ Sư Triển Khai IoT & Camera Barie ALPR/i),
      ).toBeInTheDocument()

      // Return to All (4)
      const allTab = screen.getByRole('button', {
        name: /Tất Cả \(4\)/i,
      })
      fireEvent.click(allTab)
      expect(
        screen.getByText(/Senior Backend Java Engineer \(Spring Boot \/ Microservices\)/i),
      ).toBeInTheDocument()

      // 4. Interactive Apply Modal
      const applyButtons = screen.getAllByRole('button', {
        name: /ỨNG TUYỂN NGAY/i,
      })
      expect(applyButtons.length).toBe(4)

      // Click first apply button (Backend Engineer)
      fireEvent.click(applyButtons[0])

      // Modal should appear
      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
      expect(within(modal).getByText(/ĐƠN ỨNG TUYỂN/i)).toBeInTheDocument()
      expect(
        within(modal).getByRole('heading', {
          name: /Senior Backend Java Engineer \(Spring Boot \/ Microservices\)/i,
        }),
      ).toBeInTheDocument()

      // Fill modal form
      const modalNameInput = screen.getByPlaceholderText(/Trần Minh Tuấn/i)
      const modalPhoneInput = screen.getByPlaceholderText(/0912 345 678/i)
      const modalEmailInput = screen.getByPlaceholderText(/tuan\.tran@gmail\.com/i)
      const modalCvInput = screen.getByPlaceholderText(/https:\/\/drive\.google\.com\/\.\.\./i)

      fireEvent.change(modalNameInput, { target: { value: 'Trần Văn Sang' } })
      fireEvent.change(modalPhoneInput, { target: { value: '0901234567' } })
      fireEvent.change(modalEmailInput, { target: { value: 'sang.tran@example.com' } })
      fireEvent.change(modalCvInput, { target: { value: 'https://github.com/sangtran' } })

      const modalSubmit = screen.getByRole('button', {
        name: /XÁC NHẬN NỘP HỒ SƠ/i,
      })
      fireEvent.click(modalSubmit)

      expect(screen.getByText(/Ứng Tuyển Thành Công!/i)).toBeInTheDocument()

      // 5. 4-step Recruitment Process
      expect(screen.getByText(/MINH BẠCH & TỐC ĐỘ/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Quy Trình Tuyển Dụng 4 Bước Đơn Giản/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Nộp Hồ Sơ & Sàng Lọc/i)).toBeInTheDocument()
      expect(screen.getByText(/Thời gian: 24 Giờ/i)).toBeInTheDocument()
      expect(screen.getByText(/Phỏng Vấn Trực Tiếp/i)).toBeInTheDocument()
      expect(screen.getByText(/Thời gian: 60 - 90 Phút/i)).toBeInTheDocument()
      expect(screen.getByText(/Thử Nghiệm Thực Tế/i)).toBeInTheDocument()
      expect(screen.getByText(/Thời gian: 2 - 3 Ngày/i)).toBeInTheDocument()
      expect(screen.getByText(/Offer & Onboarding/i)).toBeInTheDocument()
      expect(screen.getByText(/Thời gian: Trong 48 Giờ/i)).toBeInTheDocument()

      // 6. Fast Apply Section
      expect(
        screen.getByRole('heading', {
          name: /Không Thấy Vị Trí Phù Hợp Nhưng Vẫn Muốn Đồng Hành\?/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/hr@smarttruck\.vn/i)).toBeInTheDocument()

      const fastNameInput = screen.getByPlaceholderText(/Nguyễn Văn A/i)
      const fastEmailInput = screen.getByPlaceholderText(/your\.name@domain\.com/i)
      const fastCvInput = screen.getByPlaceholderText(/https:\/\/linkedin\.com\/in\/\.\.\./i)

      fireEvent.change(fastNameInput, { target: { value: 'Nguyễn Thanh Tùng' } })
      fireEvent.change(fastEmailInput, { target: { value: 'tung.nguyen@example.com' } })
      fireEvent.change(fastCvInput, { target: { value: 'https://linkedin.com/in/tungnguyen' } })

      const fastSubmit = screen.getByRole('button', {
        name: /GỬI HỒ SƠ ỨNG TUYỂN/i,
      })
      fireEvent.click(fastSubmit)

      expect(
        screen.getByText(/Đã tiếp nhận hồ sơ! HR sẽ liên hệ qua email trong 24h\./i),
      ).toBeInTheDocument()
    })
  })

  describe('Trang Tin Tức & Báo Cáo Chuyên Ngành (Logistics Insights - SCR-008)', () => {
    it('renders hero with category tabs, search input, featured spotlight report, filtered articles grid, newsletter subscription and bottom CTA', () => {
      render(
        <MemoryRouter initialEntries={['/insights']}>
          <InsightsPage />
        </MemoryRouter>,
      )

      // 1. Insights Hero Section
      expect(
        screen.getByText(/BẢN TIN CHUYÊN NGÀNH · TRÍ TUỆ LOGISTICS 4\.0/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Phân Tích Bến Bãi, Dữ Liệu Tải Trọng & Dòng Chảy Vận Tải\./i,
        }),
      ).toBeInTheDocument()

      // 2. Featured Article Spotlight
      expect(screen.getByText(/BÁO CÁO THỰC THẦU · THÁNG 10\/2026/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Chi Phí Ẩn Của Việc Đậu Xe Ven Quốc Lộ: Phân Tích Thiệt Hại 180 Triệu\/Năm/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/3\.8 L\/giờ/i)).toBeInTheDocument()
      expect(screen.getByText(/180 tr\/năm/i)).toBeInTheDocument()
      expect(screen.getByText(/^4\.2x$/i)).toBeInTheDocument()
      expect(screen.getByText(/Bãi Đình Vũ, Hải Phòng · Báo Cáo Khảo Sát/i)).toBeInTheDocument()

      // 3. Category Tabs & Interactive Filtering
      expect(screen.getByText(/CHUYÊN ĐỀ PHÂN TÍCH & HƯỚNG DẪN THỰC THI/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Bài Viết & Cẩm Nang Mới Nhất/i,
        }),
      ).toBeInTheDocument()

      // Verify all 6 articles rendered initially
      expect(
        screen.getByRole('heading', {
          name: /Kinh Nghiệm Tăng 32% Doanh Thu Khai Thác Bãi Xe Nhờ Ứng Dụng Barie ALPR/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Hướng Dẫn Quy Trình Xuất Hóa Đơn Điện Tử Tự Động Theo Thông Tư 78/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Cẩm Nang Bác Tài: Bản Đồ Cầu Yếu, Giới Hạn Tĩnh Không/i,
        }),
      ).toBeInTheDocument()

      // Filter by "Dành Cho Tài Xế"
      const driverTab = screen.getByRole('tab', { name: /Dành Cho Tài Xế/i })
      fireEvent.click(driverTab)
      expect(
        screen.getByRole('heading', {
          name: /Cẩm Nang Bác Tài: Bản Đồ Cầu Yếu, Giới Hạn Tĩnh Không/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', {
          name: /Kinh Nghiệm Tăng 32% Doanh Thu Khai Thác Bãi Xe/i,
        }),
      ).not.toBeInTheDocument()

      // Filter by "Công Nghệ & API"
      const techTab = screen.getByRole('tab', { name: /Công Nghệ & API/i })
      fireEvent.click(techTab)
      expect(
        screen.getByRole('heading', {
          name: /Tích Hợp API Điều Phối SmartTruck Vào Phần Mềm SAP\/MISA/i,
        }),
      ).toBeInTheDocument()

      // Reset to "Tất Cả"
      const allTab = screen.getByRole('tab', { name: /Tất Cả/i })
      fireEvent.click(allTab)
      expect(
        screen.getByRole('heading', {
          name: /Kinh Nghiệm Tăng 32% Doanh Thu Khai Thác Bãi Xe/i,
        }),
      ).toBeInTheDocument()

      // 4. Live Search Filter
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm bài viết, mã bến, chỉ số\.\.\./i)
      fireEvent.change(searchInput, { target: { value: 'SAP/MISA' } })
      expect(
        screen.getByRole('heading', {
          name: /Tích Hợp API Điều Phối SmartTruck Vào Phần Mềm SAP\/MISA/i,
        }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', {
          name: /Cẩm Nang Bác Tài/i,
        }),
      ).not.toBeInTheDocument()

      // Clear Search
      fireEvent.change(searchInput, { target: { value: '' } })
      expect(
        screen.getByRole('heading', {
          name: /Kinh Nghiệm Tăng 32% Doanh Thu Khai Thác Bãi Xe/i,
        }),
      ).toBeInTheDocument()

      // 5. Weekly Newsletter Subscription Form
      expect(
        screen.getByRole('heading', {
          name: /Nhận Báo Cáo Tải Trọng & Xu Hướng Giá Cước Sáng Thứ Hai Hàng Tuần/i,
        }),
      ).toBeInTheDocument()
      const emailInput = screen.getByPlaceholderText(/Nhập email doanh nghiệp của bạn\.\.\./i)
      fireEvent.change(emailInput, { target: { value: 'logistics.manager@tan-cang.vn' } })
      const subscribeButton = screen.getByRole('button', { name: /ĐĂNG KÝ BẢN TIN/i })
      fireEvent.click(subscribeButton)
      expect(
        screen.getByText(/Cảm ơn bạn đã đăng ký nhận bản tin thị trường Fretrix!/i),
      ).toBeInTheDocument()

      // 6. Bottom CTA Banner
      expect(
        screen.getByRole('heading', {
          name: /Sẵn Sàng Tối Ưu Hóa Chi Phí Lưu Bãi Cho Đội Xe Của Bạn\?/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Tìm Bãi Đỗ Ngay/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Dành Cho Chủ Bãi/i })).toBeInTheDocument()
    })
  })

  describe('Trang Liên Hệ & Điều Phối 24/7 (Contact & Support - SCR-009)', () => {
    it('renders hero with key metas, 2-column dispatch form with submission feedback, hotline channels, 6 permanent stations, 3 industrial SLAs and bottom CTA', () => {
      render(
        <MemoryRouter initialEntries={['/contact']}>
          <ContactPage />
        </MemoryRouter>,
      )

      // 1. Contact Hero Section
      expect(
        screen.getByText(/KẾT NỐI TRỰC TIẾP · HỖ TRỢ 24\/7 TOÀN QUỐC/i),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Liên Hệ Với Đội Ngũ Chuyên Gia Vận Hành SmartTruck\./i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Đối soát PayOS & Bảo mật ISO 27001/i)).toBeInTheDocument()
      expect(screen.getByText(/Cứu hộ barie tự động dưới 3 phút/i)).toBeInTheDocument()
      expect(screen.getByText(/Kết nối IoT trạm dừng 63 tỉnh thành/i)).toBeInTheDocument()

      // 2. 2-Column Dispatch Channels & Enterprise Inquiry Form
      expect(screen.getByText(/TƯ VẤN DOANH NGHIỆP & KỸ THUẬT/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Gửi Yêu Cầu Khảo Sát \/ Tích Hợp/i,
        }),
      ).toBeInTheDocument()

      // Form fill & submission
      const nameInput = screen.getByPlaceholderText(/Ví dụ: Trần Quốc Tuấn/i)
      const phoneInput = screen.getByPlaceholderText(/09xx xxx xxx \(10 số\)/i)
      const emailInput = screen.getByPlaceholderText(/tuan\.tran@logistics\.vn/i)
      const detailsInput = screen.getByPlaceholderText(/Mô tả cụ thể: Diện tích mặt bằng bãi/i)
      const categorySelect = screen.getByRole('combobox')

      fireEvent.change(nameInput, { target: { value: 'Nguyễn Văn Hùng' } })
      fireEvent.change(phoneInput, { target: { value: '0912345678' } })
      fireEvent.change(emailInput, { target: { value: 'hung.nguyen@vantaihungthinh.vn' } })
      fireEvent.change(categorySelect, { target: { value: 'lot-owner' } })
      fireEvent.change(detailsInput, { target: { value: 'Cần khảo sát lắp đặt 2 làn Barie ALPR tại ICD Cát Lái.' } })

      const submitButton = screen.getByRole('button', {
        name: /GỬI YÊU CẦU CHO CHÚNG TÔI/i,
      })
      fireEvent.submit(submitButton.closest('form')!)

      expect(
        screen.getByText(/Yêu cầu đã được tiếp nhận thành công!/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Kỹ sư trực ban SmartTruckHub sẽ liên hệ với bạn trong vòng 30 phút/i),
      ).toBeInTheDocument()

      // Right Column 24/7 Channels
      expect(screen.getByText(/TRẠM ĐIỀU PHỐI KHẨN CẤP/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Kênh Trực Ban 24\/7/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getAllByText(/1900 6868/i).length).toBeGreaterThan(0)
      expect(screen.getByText(/api-support@smarttruckhub\.vn/i)).toBeInTheDocument()
      expect(screen.getByText(/dispatch@smartparkinghub\.vn/i)).toBeInTheDocument()
      expect(screen.getByText(/Trụ sở chính TP\.HCM:/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm đại diện Hải Phòng:/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm đại diện Đà Nẵng:/i)).toBeInTheDocument()

      // 3. 6 Permanent Dispatch Stations
      expect(screen.getByText(/TỌA ĐỘ VẬN HÀNH THỰC ĐỊA/i)).toBeInTheDocument()
      expect(
        screen.getByRole('heading', {
          name: /Trung Tâm Điều Phối & 6 Cụm Cứu Hộ Bãi Đỗ Thường Trực/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByText(/Trạm Cứu Hộ Bãi Cảng Cát Lái/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm Cứu Hộ Cụm Cảng Cái Mép - Thị Vải/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm Điều Phối Ga ICD Sóng Thần/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm Cứu Hộ KCN Cụm Cảng Đình Vũ/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm Tiếp Ứng KCN Tiên Sơn & Quế Võ/i)).toBeInTheDocument()
      expect(screen.getByText(/Trạm Trung Chuyển Cao Tốc Bến Lức - Long Thành/i)).toBeInTheDocument()

      // 4. SLA Metrics
      expect(screen.getByText(/Cam Kết Phản Hồi Báo Giá/i)).toBeInTheDocument()
      expect(screen.getByText(/Xử Lý Lỗi Barie Từ Xa/i)).toBeInTheDocument()
      expect(screen.getByText(/Uptime Hệ Thống Điều Phối/i)).toBeInTheDocument()

      // 5. Final CTA Banner
      expect(
        screen.getByRole('heading', {
          name: /Sẵn Sàng Tối Ưu Hóa Mặt Bằng Hoặc Kết Nối Đội Xe Toàn Diện\?/i,
        }),
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /ĐĂNG KÝ KHẢO SÁT NGAY/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /GỌI HOTLINE 1900 6868/i })).toBeInTheDocument()
    })
  })
})
