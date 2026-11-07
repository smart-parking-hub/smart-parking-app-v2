import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PricingPage } from '../pages/PricingPage'
import { PricingComparisonTableSection } from '../components/pricing/PricingComparisonTableSection'
import { CareersApplyModal } from '../components/careers/CareersApplyModal'
import { CareersFastApplySection } from '../components/careers/CareersFastApplySection'

afterEach(cleanup)

describe('GROUP 14: Public Marketing & Developer Documentation Tests', () => {
  describe('AC1: Pricing Matrix Mobile Responsiveness (/pricing)', () => {
    it('renders both mobile cards and desktop comparison containers', () => {
      render(
        <MemoryRouter>
          <PricingComparisonTableSection />
        </MemoryRouter>
      )

      // Mobile cards view (visible on < md)
      const mobileContainer = screen.getByTestId('pricing-comparison-mobile')
      expect(mobileContainer).toBeInTheDocument()
      expect(mobileContainer).toHaveClass('md:hidden')

      // Desktop table view (hidden on < md, visible on >= md)
      const desktopContainer = screen.getByTestId('pricing-comparison-desktop')
      expect(desktopContainer).toBeInTheDocument()
      expect(desktopContainer).toHaveClass('hidden md:block')

      // Check key operational features are listed
      expect(
        screen.getAllByText('Quản lý & Đặt chỗ trước theo tọa độ GPS').length
      ).toBeGreaterThanOrEqual(1)
      expect(
        screen.getAllByText('Tự động mở Barie ALPR (Nhận diện biển số 0.2s)').length
      ).toBeGreaterThanOrEqual(1)
    })

    it('renders PricingPage cleanly with interactive billing toggle and 3 tier cards', () => {
      render(
        <MemoryRouter initialEntries={['/pricing']}>
          <PricingPage />
        </MemoryRouter>
      )

      // Heading and badges
      expect(
        screen.getByRole('heading', { level: 1, name: /Định Phí Rõ Ràng/i })
      ).toBeInTheDocument()

      // Toggle billing between turn and month
      const turnButton = screen.getByRole('button', { name: /Thanh toán theo lượt/i })
      const monthButton = screen.getByRole('button', { name: /Hợp đồng tháng/i })
      expect(turnButton).toBeInTheDocument()
      expect(monthButton).toBeInTheDocument()

      // Switch to month
      fireEvent.click(monthButton)
      expect(screen.getByText('841.500 đ')).toBeInTheDocument()

      // Switch back to turn
      fireEvent.click(turnButton)
      expect(screen.getByText('990.000 đ')).toBeInTheDocument()
    })
  })

  describe('AC2: Careers Recruitment Form & Direct Mailto Pathway (/careers)', () => {
    it('renders CareersApplyModal with direct email instructions and mailto link', () => {
      const handleClose = () => {}
      render(
        <CareersApplyModal
          isOpen={true}
          jobTitle="Senior Go Backend Engineer"
          onClose={handleClose}
        />
      )

      // Instructions text
      expect(
        screen.getByText(/Hướng dẫn gửi CV trực tiếp qua email tuyển dụng/i)
      ).toBeInTheDocument()

      // Target email link
      const emailLinks = screen.getAllByRole('link', { name: /careers@smartparkinghub.vn/i })
      expect(emailLinks.length).toBeGreaterThanOrEqual(1)
      expect(emailLinks[0]).toHaveAttribute('href', 'mailto:careers@smartparkinghub.vn')

      // Mailto button with encoded subject
      const mailtoBtn = screen.getByRole('link', {
        name: /Mở Email Gửi CV Trực Tiếp/i,
      })
      expect(mailtoBtn).toBeInTheDocument()
      const mailtoHref = mailtoBtn.getAttribute('href') || ''
      expect(mailtoHref).toContain('mailto:careers@smartparkinghub.vn')
      expect(mailtoHref).toContain(encodeURIComponent('Senior Go Backend Engineer'))
    })

    it('CareersFastApplySection provides both instant application form and mailto action', () => {
      render(
        <MemoryRouter>
          <CareersFastApplySection />
        </MemoryRouter>
      )

      // Official email heading
      expect(
        screen.getByRole('link', { name: /careers@smartparkinghub.vn/i })
      ).toBeInTheDocument()

      // Mailto action button
      const mailtoBtn = screen.getByRole('link', {
        name: /MỞ EMAIL GỬI CV TRỰC TIẾP/i,
      })
      expect(mailtoBtn).toBeInTheDocument()
      expect(mailtoBtn.getAttribute('href')).toContain('mailto:careers@smartparkinghub.vn')

      // Submit online form
      const nameInput = screen.getByLabelText(/Họ và tên của bạn/i)
      const emailInput = screen.getByLabelText(/Email liên hệ/i)
      const cvInput = screen.getByLabelText(/Link LinkedIn hoặc Link CV/i)
      const submitBtn = screen.getByRole('button', { name: /GỬI HỒ SƠ ỨNG TUYỂN/i })

      fireEvent.change(nameInput, { target: { value: 'Lê Văn Cường' } })
      fireEvent.change(emailInput, { target: { value: 'cuong.le@example.com' } })
      fireEvent.change(cvInput, { target: { value: 'https://linkedin.com/in/cuongle' } })
      fireEvent.click(submitBtn)

      expect(
        screen.getByText(/Đã tiếp nhận hồ sơ! HR sẽ liên hệ qua email trong 24h./i)
      ).toBeInTheDocument()
    })
  })

  describe('AC3: Brand Orange Consistency (#d95f00)', () => {
    it('applies brand orange #d95f00 on primary call-to-actions', () => {
      render(
        <MemoryRouter initialEntries={['/pricing']}>
          <PricingPage />
        </MemoryRouter>
      )

      // Enterprise B2B CTA button has brand orange
      const b2bCta = screen.getByRole('link', { name: /ĐĂNG KÝ GÓI ĐỘI XE B2B/i })
      expect(b2bCta).toBeInTheDocument()
      expect(b2bCta.className).toContain('bg-[#d95f00]')
    })
  })
})
