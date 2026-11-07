import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingFooter } from '../components/common/LandingFooter'

afterEach(cleanup)

describe('LandingFooter Component (ISSUE-NAV-02)', () => {
  it('renders all internal links as React Router Link destinations', () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>
    )

    // Logo brand link
    const logoLink = screen.getByRole('link', { name: /SmartTruckHub Trang chủ/i })
    expect(logoLink).toHaveAttribute('href', '/')

    // Driver column links
    expect(screen.getByRole('link', { name: /Tra cứu bãi đỗ theo lộ trình/i })).toHaveAttribute('href', '/parking')
    expect(screen.getByRole('link', { name: /Hướng dẫn quét mã QR Barie/i })).toHaveAttribute('href', '/driver-solutions')
    expect(screen.getByRole('link', { name: /Biểu phí niêm yết theo bãi/i })).toHaveAttribute('href', '/pricing')

    // Lot owner column links
    expect(screen.getByRole('link', { name: /Đăng ký bãi đỗ đối tác/i })).toHaveAttribute('href', '/owner-solutions')
    expect(screen.getByRole('link', { name: /Tài liệu kết nối API Swagger/i })).toHaveAttribute('href', '/api-docs')

    // Legal & Support column links
    expect(screen.getByRole('link', { name: /Trung tâm điều phối & Hỗ trợ 24\/7/i })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /Bản tin & Báo cáo logistics/i })).toHaveAttribute('href', '/company/blog')
    expect(screen.getByRole('link', { name: /Cơ hội nghề nghiệp & Tuyển dụng/i })).toHaveAttribute('href', '/careers')
    expect(screen.getByRole('link', { name: /Điều khoản dịch vụ & Bảo mật/i })).toHaveAttribute('href', '/about')

    // Protocols
    expect(screen.getByRole('link', { name: '1900 6868' })).toHaveAttribute('href', 'tel:19006868')
    expect(screen.getByRole('link', { name: 'hotro@smarttruckhub.vn' })).toHaveAttribute('href', 'mailto:hotro@smarttruckhub.vn')
  })
})
