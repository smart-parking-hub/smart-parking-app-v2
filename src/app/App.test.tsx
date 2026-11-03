import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { App } from './App'

describe('SmartTruckHub Landing Page Screen', () => {
  it('renders landing page hero and branding successfully', () => {
    render(<App />)

    // Verify brand logo text
    expect(screen.getAllByText(/SMART/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/TRUCK/i).length).toBeGreaterThan(0)

    // Verify hero headline
    expect(
      screen.getByRole('heading', { name: /Sự Kết Tinh Giữa Công Nghệ Và Bãi Đỗ Xe Tải/i }),
    ).toBeInTheDocument()

    // Verify key sections
    expect(screen.getByText(/HẠ TẦNG LOGISTICS SỐ HÓA · 320\+ CỤM BÃI/i)).toBeInTheDocument()
    expect(screen.getByText(/DANH MỤC DỊCH VỤ CHUYÊN DỤNG/i)).toBeInTheDocument()
    expect(screen.getByText(/BIỂU PHÍ NIÊM YẾT MINH BẠCH/i)).toBeInTheDocument()
    expect(screen.getByText(/QUY TRÌNH 4 BƯỚC ĐƠN GIẢN/i)).toBeInTheDocument()
  })
})
