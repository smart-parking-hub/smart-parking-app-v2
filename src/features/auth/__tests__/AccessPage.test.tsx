import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import { AccessPage } from '../pages/AccessPage'
import * as sessionModule from '../model/session'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

describe('SCR-013: AccessPage UI Polish & Responsive Refinement (SP-S3-UI-20)', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  it('renders 403 Forbidden with exact badge, heading, description, and navigation links', () => {
    render(
      <MemoryRouter>
        <AccessPage notFound={false} />
      </MemoryRouter>,
    )

    // Exact contract badges & headings for existing test suites
    expect(screen.getByText('SMARTTRUCK / 403')).toBeInTheDocument()
    expect(screen.getByText('Từ chối quyền hạn')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bạn chưa có quyền truy cập.')
    expect(screen.getByText('Đăng nhập bằng tài khoản có vai trò phù hợp hoặc liên hệ quản trị viên.')).toBeInTheDocument()

    // Primary CTA: Về trang chủ
    const homeLink = screen.getByRole('link', { name: /Về trang chủ/i })
    expect(homeLink).toHaveAttribute('href', '/')
    expect(homeLink).toHaveClass('bg-[#d95f00]', 'text-white')

    // Secondary CTA: Đăng nhập
    const loginLink = screen.getByRole('link', { name: /Đăng nhập/i })
    expect(loginLink).toHaveAttribute('href', '/login')

    // Branding Logo
    expect(screen.getByAltText('Smart Parking Hub Logo')).toBeInTheDocument()
    expect(screen.getByText('SMARTTRUCK HUB')).toBeInTheDocument()
  })

  it('renders 404 Not Found with exact badge, heading, and description', () => {
    render(
      <MemoryRouter>
        <AccessPage notFound={true} />
      </MemoryRouter>,
    )

    expect(screen.getByText('SMARTTRUCK / 404')).toBeInTheDocument()
    expect(screen.getByText('Trang không tồn tại')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Không tìm thấy trang.')
    expect(screen.getByText(/Liên kết có thể đã thay đổi hoặc không tồn tại/i)).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /Về trang chủ/i })
    expect(homeLink).toHaveAttribute('href', '/')

    const loginLink = screen.getByRole('link', { name: /Đăng nhập/i })
    expect(loginLink).toHaveAttribute('href', '/login')
  })

  it('displays authenticated role info banner and dashboard shortcut when user is logged in on 403', () => {
    vi.spyOn(sessionModule, 'readSession').mockReturnValue({
      role: 'DRIVER',
      expiresAt: Date.now() + 3600000,
    })

    render(
      <MemoryRouter>
        <AccessPage notFound={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Vai trò hiện tại:/i)).toBeInTheDocument()
    expect(screen.getByText('Tài xế')).toBeInTheDocument()

    const dashboardLink = screen.getByRole('link', { name: /Vào Bảng điều khiển/i })
    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  it('supports going back to previous page via "Trang trước" button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AccessPage notFound={false} />
      </MemoryRouter>,
    )

    const backButton = screen.getByRole('button', { name: /Quay lại trang trước/i })
    expect(backButton).toBeInTheDocument()

    await user.click(backButton)
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('complies with accessibility guidelines: semantic landmarks, headings, and high-contrast rings', () => {
    render(
      <MemoryRouter>
        <AccessPage notFound={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /Về trang chủ/i })
    expect(homeLink).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-white')
  })
})
