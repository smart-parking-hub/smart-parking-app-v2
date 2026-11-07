import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from '../pages/LandingPage'
import { DriverSolutionsPage } from '../pages/DriverSolutionsPage'
import { OwnerSolutionsPage } from '../pages/OwnerSolutionsPage'
import { PricingPage } from '../pages/PricingPage'
import { ApiDocsPage } from '../pages/ApiDocsPage'
import { AboutUsPage } from '../pages/AboutUsPage'
import { CareersPage } from '../pages/CareersPage'
import { InsightsPage } from '../pages/InsightsPage'
import { ContactPage } from '../pages/ContactPage'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

function renderWithProviders(ui: React.ReactElement, route = '/') {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(cleanup)

describe('BATCH-14H: Public Marketing Website & Developer Documentation (SCR-001 to SCR-009)', () => {
  /* =======================================================================
   * SCR-001: LandingPage (/)
   * ======================================================================= */
  describe('SCR-001: Landing Page (/)', () => {
    it('renders homepage with navbar, hero, bento sections, testimonials, and footer', () => {
      renderWithProviders(<LandingPage />, '/')

      // Brand Logo / Header
      expect(screen.getByRole('banner')).toBeInTheDocument()

      // Hero heading
      expect(
        screen.getByRole('heading', { level: 1, name: /Mạng Lưới Bãi Đỗ Xe Tải/i }),
      ).toBeInTheDocument()

      // Metrics & Services
      expect(screen.getByText(/Lượt Xe Lưu Bãi/i)).toBeInTheDocument()
      expect(screen.getByText(/Dịch Vụ Lưu Bãi Chuyên Dụng/i)).toBeInTheDocument()

      // Footer
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-002: DriverSolutionsPage (/solutions/drivers)
   * ======================================================================= */
  describe('SCR-002: Driver Solutions (/solutions/drivers)', () => {
    it('renders driver logistics workflow, amenity preview, and opens driver lead modal', () => {
      renderWithProviders(<DriverSolutionsPage />, '/solutions/drivers')

      // Hero
      expect(
        screen.getByRole('heading', { level: 1, name: /Lộ Trình Chủ Động/i }),
      ).toBeInTheDocument()

      // Pain points section
      expect(
        screen.getByText(/Được Thiết Kế Bởi Những Người Thấu Hiểu Bác Tài/i),
      ).toBeInTheDocument()

      // Open Lead Modal CTA
      const ctaButton = screen.getByRole('button', { name: /TẢI ỨNG DỤNG BÁC TÀI/i })
      expect(ctaButton).toBeInTheDocument()
      fireEvent.click(ctaButton)

      // Modal appears
      expect(
        screen.getByText(/Khóa Chỗ Đỗ Nhanh/i),
      ).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-003: OwnerSolutionsPage (/solutions/owners)
   * ======================================================================= */
  describe('SCR-003: Owner Solutions (/solutions/owners)', () => {
    it('renders merchant features, ROI calculator, and opens owner lead modal', () => {
      renderWithProviders(<OwnerSolutionsPage />, '/solutions/owners')

      // Hero
      expect(
        screen.getByRole('heading', { level: 1, name: /Chuyển Đổi Số Bến Bãi/i }),
      ).toBeInTheDocument()

      // ROI Estimator
      expect(
        screen.getByText(/Ước Tính Doanh Thu Khai Thác Bãi/i),
      ).toBeInTheDocument()

      // Merchant features
      expect(
        screen.getByText(/5 Công Cụ Quản Trị Trọng Yếu/i),
      ).toBeInTheDocument()

      // Open Lead Modal
      const leadButton = screen.getByRole('button', { name: /ĐĂNG KÝ HỢP TÁC BÃI ĐỖ/i })
      expect(leadButton).toBeInTheDocument()
      fireEvent.click(leadButton)

      expect(
        screen.getByText(/Đăng Ký Khảo Sát & Tư Vấn Mặt Bằng Miễn Phí/i),
      ).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-004: PricingPage (/pricing)
   * ======================================================================= */
  describe('SCR-004: Pricing & Plans (/pricing)', () => {
    it('renders pricing plans, interactive billing toggle, and feature comparison', () => {
      renderWithProviders(<PricingPage />, '/pricing')

      expect(
        screen.getByRole('heading', { level: 1, name: /Định Phí Rõ Ràng/i }),
      ).toBeInTheDocument()

      // 3 Tiers
      expect(screen.getByText(/Tài xế & Chủ xe/i)).toBeInTheDocument()
      expect(screen.getByText(/Đội xe & Doanh nghiệp 3PL/i)).toBeInTheDocument()
      expect(screen.getAllByText(/Chủ bãi & Depot/i).length).toBeGreaterThanOrEqual(1)

      // Feature Comparison section
      expect(screen.getByTestId('pricing-comparison-desktop')).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-005: ApiDocsPage (/api-docs)
   * ======================================================================= */
  describe('SCR-005: Developer API Documentation (/api-docs)', () => {
    it('renders OpenAPI documentation, interactive terminal, and integration guide', () => {
      renderWithProviders(<ApiDocsPage />, '/api-docs')

      expect(
        screen.getByRole('heading', { level: 1, name: /Tích Hợp API Điều Phối Bãi Đỗ/i }),
      ).toBeInTheDocument()

      // OpenAPI terminal tabs and code
      expect(screen.getAllByText(/\/api\/v1\/bookings/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText(/Kiến Trúc API Điểm Chốt Thực Nghiệm/i)).toBeInTheDocument()
      expect(screen.getByText(/Copy Payload/i)).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-006: AboutUsPage (/about)
   * ======================================================================= */
  describe('SCR-006: About Us & Mission (/about)', () => {
    it('renders company narrative story, core principles, roadmap, and leadership team', () => {
      renderWithProviders(<AboutUsPage />, '/about')

      expect(
        screen.getByRole('heading', { level: 1, name: /Chúng Tôi Xây Dựng Hạ Tầng Điểm Đỗ/i }),
      ).toBeInTheDocument()

      // Principles and Roadmap
      expect(screen.getByText(/4 Trụ Cột Giá Trị Cốt Lõi/i)).toBeInTheDocument()
      expect(screen.getByText(/Cột Mốc Kiến Tạo Hạ Tầng/i)).toBeInTheDocument()
      expect(screen.getByText(/Ban Lãnh Đạo & Cố Vấn Logistics/i)).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-007: CareersPage (/careers)
   * ======================================================================= */
  describe('SCR-007: Careers & Recruitment (/careers)', () => {
    it('renders culture, job positions list, and opens fast apply form', () => {
      renderWithProviders(<CareersPage />, '/careers')

      expect(
        screen.getByRole('heading', { level: 1, name: /Gia Nhập Đội Ngũ/i }),
      ).toBeInTheDocument()

      // Open positions
      expect(screen.getByText(/Các Vị Trí Trọng Yếu Đang Tuyển Dụng/i)).toBeInTheDocument()
      expect(screen.getByText(/Senior Backend Java Engineer/i)).toBeInTheDocument()

      // Click apply on position opens modal
      const applyButtons = screen.getAllByRole('button', { name: /ỨNG TUYỂN NGAY/i })
      expect(applyButtons.length).toBeGreaterThanOrEqual(1)
      fireEvent.click(applyButtons[0])

      expect(
        screen.getByText(/Hướng dẫn gửi CV trực tiếp qua email tuyển dụng/i),
      ).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-008: InsightsPage (/insights)
   * ======================================================================= */
  describe('SCR-008: Industry Insights & Blog (/insights)', () => {
    it('renders breadcrumbs, category filter pills, article grid, and newsletter subscription', () => {
      renderWithProviders(<InsightsPage />, '/insights')

      // Breadcrumb navigation
      expect(screen.getByRole('navigation', { name: 'Đường dẫn trang' })).toBeInTheDocument()

      // Heading
      expect(
        screen.getByRole('heading', { level: 1, name: /Phân Tích Bến Bãi/i }),
      ).toBeInTheDocument()

      // Filter tabs
      expect(screen.getByRole('tab', { name: 'Tất Cả' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Dành Cho Tài Xế' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'Chủ Bãi & Bến Bãi' })).toBeInTheDocument()

      // Newsletter
      expect(screen.getByText(/Nhận Báo Cáo Tải Trọng/i)).toBeInTheDocument()
    })
  })

  /* =======================================================================
   * SCR-009: ContactPage (/contact)
   * ======================================================================= */
  describe('SCR-009: Contact & Support 24/7 (/contact)', () => {
    it('renders support channels, consultation contact form, station locations, and SLA metrics', () => {
      renderWithProviders(<ContactPage />, '/contact')

      expect(
        screen.getByRole('heading', { level: 1, name: /Liên Hệ Với Đội Ngũ/i }),
      ).toBeInTheDocument()

      // Contact form inputs by label
      expect(screen.getByLabelText(/Họ và tên người liên hệ/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Số điện thoại di động/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Địa chỉ Email công việc/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Nội dung yêu cầu chi tiết/i)).toBeInTheDocument()

      // Stations & SLA
      expect(screen.getAllByText(/Trung Tâm Điều Phối/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText(/Cam Kết Phản Hồi Báo Giá/i)).toBeInTheDocument()
    })
  })
})
