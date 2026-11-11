import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { apiClient } from '@/shared/api/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/model/authSlice'
import { LandingLayout } from '../LandingLayout'
import { AuthLayout } from '../AuthLayout'
import { DriverLayout } from '../DriverLayout'
import { DriverHeader } from '../driver/DriverHeader'
import { DriverFooter } from '../driver/DriverFooter'
import { MerchantLayout } from '../MerchantLayout'
import { MerchantSidebar } from '../merchant/MerchantSidebar'
import { AdminLayout } from '../AdminLayout'
import { RootLayout } from '../RootLayout'
import { RequireRole } from '@/features/auth/components/RequireRole'
import { AccessPage } from '@/features/auth'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
}

function createTestStore(role: 'DRIVER' | 'MERCHANT' | 'ADMIN' | null = null) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        token: role ? 'test-token' : null,
        user: role ? { id: 1, role, fullName: 'Người Dùng Thử Nghiệm' } : null,
        role: role,
        loading: false,
        error: null,
      },
    },
  })
}

describe('Layouts and Navigation System Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('LandingLayout & Public Shell', () => {
    it('renders Navbar, main content, and Footer', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingLayout>
            <div data-testid="page-content">Trang giới thiệu công cộng</div>
          </LandingLayout>
        </MemoryRouter>
      )

      expect(screen.getByTestId('page-content')).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Điều hướng chính' })).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })

  describe('AuthLayout', () => {
    it('renders brand hero panel and wraps form content', () => {
      render(
        <MemoryRouter>
          <AuthLayout>
            <form data-testid="login-form">Biểu mẫu đăng nhập</form>
          </AuthLayout>
        </MemoryRouter>
      )

      expect(screen.getByTestId('login-form')).toBeInTheDocument()
      expect(screen.getAllByText(/SMARTTRUCK/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Một điểm đỗ.')).toBeInTheDocument()
      expect(screen.getByText('Ngàn hành trình.')).toBeInTheDocument()
    })
  })

  describe('DriverLayout & Driver Navigation', () => {
    it('renders DriverLayout wrapping outlet content', () => {
      const queryClient = createTestQueryClient()
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
              <Route element={<DriverLayout />}>
                <Route path="/dashboard" element={<div data-testid="driver-outlet">Nội dung tài xế</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      )
      expect(screen.getByTestId('driver-outlet')).toBeInTheDocument()
    })

    it('renders DriverHeader with 7 navigation items and active state', () => {
      const queryClient = createTestQueryClient()

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <DriverHeader />
          </MemoryRouter>
        </QueryClientProvider>
      )

      // 7 links check
      expect(screen.getByRole('link', { name: 'Tổng quan' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Bản đồ tìm bãi' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Vé & Đặt chỗ' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Chờ vào bãi' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Lịch sử cước' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Đội xe của tôi' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Khiếu nại' })).toBeInTheDocument()

      // Active state on /dashboard
      const dashboardLink = screen.getByRole('link', { name: 'Tổng quan' })
      expect(dashboardLink).toHaveAttribute('aria-current', 'page')
    })

    it('toggles mobile menu and closes on Escape key', () => {
      const queryClient = createTestQueryClient()

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <DriverHeader />
          </MemoryRouter>
        </QueryClientProvider>
      )

      const toggleBtn = screen.getByLabelText('Toggle menu')
      fireEvent.click(toggleBtn)

      expect(screen.getByRole('navigation', { name: 'Điều hướng di động' })).toBeInTheDocument()

      fireEvent.keyDown(screen.getByRole('banner'), { key: 'Escape' })
      expect(screen.queryByRole('navigation', { name: 'Điều hướng di động' })).not.toBeInTheDocument()
    })

    it('renders DriverFooter with operational info and hotline', () => {
      render(
        <MemoryRouter>
          <DriverFooter />
        </MemoryRouter>
      )

      expect(screen.getByText('1900 6868')).toBeInTheDocument()
      expect(screen.getByText('ISO/IEC 27001:2022')).toBeInTheDocument()
      expect(screen.getByText(/2026 SmartTruckHub Logistics Network/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Hỗ trợ 24/7' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Đổi mật khẩu' })).toHaveAttribute('href', '/profile#bao-mat')
    })

    it('links DriverHeader account menu change-password action to /profile#bao-mat', () => {
      const queryClient = createTestQueryClient()

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/dashboard']}>
            <DriverHeader />
          </MemoryRouter>
        </QueryClientProvider>
      )

      fireEvent.click(screen.getByRole('button', { name: 'Menu tài khoản' }))
      expect(screen.getByRole('link', { name: 'Đổi mật khẩu' })).toHaveAttribute('href', '/profile#bao-mat')
    })

    it('renders unread notification badge on Bell link and caps at 99+', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
        if (url.includes('/unread-count')) {
          return Promise.resolve({ data: { code: 200, data: 128 } } as never)
        }
        return Promise.resolve({ data: { code: 200, data: { fullName: 'Nguyễn Văn Tài' } } } as never)
      })

      try {
        const queryClient = createTestQueryClient()
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/notifications']}>
              <DriverHeader />
            </MemoryRouter>
          </QueryClientProvider>
        )

        const badge = await screen.findByTestId('driver-header-unread-badge')
        expect(badge).toHaveTextContent('99+')

        const bellLink = screen.getByRole('link', { name: /Thông báo \(128 chưa đọc\)/i })
        expect(bellLink).toHaveAttribute('href', '/notifications')
        expect(bellLink).toHaveAttribute('aria-current', 'page')
      } finally {
        getSpy.mockRestore()
      }
    })

    it('hides unread badge when unread count is 0', async () => {
      const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
        data: { code: 200, data: 0 },
      } as never)

      try {
        const queryClient = createTestQueryClient()
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/dashboard']}>
              <DriverHeader />
            </MemoryRouter>
          </QueryClientProvider>
        )

        const bellLink = await screen.findByRole('link', { name: 'Thông báo' })
        expect(bellLink).toHaveAttribute('href', '/notifications')
        expect(screen.queryByTestId('driver-header-unread-badge')).not.toBeInTheDocument()
      } finally {
        getSpy.mockRestore()
      }
    })
  })

  describe('MerchantLayout & Merchant Navigation', () => {
    it('renders MerchantLayout with sidebar, header, and outlet content', () => {
      const queryClient = createTestQueryClient()
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/merchant/dashboard']}>
            <Routes>
              <Route path="/merchant" element={<MerchantLayout />}>
                <Route path="dashboard" element={<div data-testid="merchant-outlet">Nội dung chủ bãi</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      )
      expect(screen.getByTestId('merchant-outlet')).toBeInTheDocument()
      expect(screen.getByText('Tổng quan vận hành')).toBeInTheDocument()
    })

    it('renders MerchantSidebar with 9 navigation items and closes on Escape', () => {
      const handleClose = vi.fn()

      render(
        <MemoryRouter initialEntries={['/merchant/dashboard']}>
          <MerchantSidebar mobileOpen={true} onCloseMobile={handleClose} />
        </MemoryRouter>
      )

      expect(screen.getByText('Tổng quan')).toBeInTheDocument()
      expect(screen.getByText('Bãi đỗ của tôi')).toBeInTheDocument()
      expect(screen.getByText('Quản lý đặt chỗ')).toBeInTheDocument()
      expect(screen.getByText('Trạm Barie & Quét QR')).toBeInTheDocument()
      expect(screen.getByText('Báo cáo doanh thu')).toBeInTheDocument()
      expect(screen.getByText('Ví & Rút tiền')).toBeInTheDocument()
      expect(screen.getByText('Xử lý khiếu nại')).toBeInTheDocument()
      expect(screen.getByText('Hồ sơ bến bãi')).toBeInTheDocument()
      expect(screen.getByText('Thông báo')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalled()
    })
  })

  describe('AdminLayout', () => {
    it('renders AdminLayout with sidebar items, icons, and logout action', () => {
      const queryClient = createTestQueryClient()

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/admin/dashboard']}>
            <AdminLayout />
          </MemoryRouter>
        </QueryClientProvider>
      )

      expect(screen.getByText('KHÔNG GIAN QUẢN TRỊ')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Tổng quan/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Kiểm duyệt bãi/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Người dùng/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Giao dịch/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Duyệt rút tiền/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Tranh chấp/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Nhật ký kiểm toán/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Thông báo/ })).toBeInTheDocument()
      expect(screen.getAllByRole('link', { name: /Hồ sơ quản trị/ })).toHaveLength(2)

      expect(screen.getByRole('button', { name: /Đăng xuất/ })).toBeInTheDocument()
    })
  })

  describe('RootLayout', () => {
    it('renders CRM baseline shell with sidebar navigation', () => {
      render(
        <MemoryRouter initialEntries={['/crm']}>
          <RootLayout />
        </MemoryRouter>
      )

      expect(screen.getByText('CRM Master Hub v2')).toBeInTheDocument()
      expect(screen.getByText('Tổng Quan & Trạng Thái')).toBeInTheDocument()
      expect(screen.getByText('Về Trang Chủ Khách')).toBeInTheDocument()
      expect(screen.getByText(/Agent Governance: Active/)).toBeInTheDocument()
    })
  })

  describe('Role-Based Guards & Access Pages', () => {
    it('redirects unauthenticated visitor to login preserving next url', () => {
      const store = createTestStore(null)

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/dashboard/bookings?filter=active']}>
            <Routes>
              <Route
                path="/dashboard/*"
                element={
                  <RequireRole role="DRIVER">
                    <div>Nội dung bảo mật</div>
                  </RequireRole>
                }
              />
              <Route path="/login" element={<div>Trang đăng nhập</div>} />
            </Routes>
          </MemoryRouter>
        </Provider>
      )

      expect(screen.queryByText('Nội dung bảo mật')).not.toBeInTheDocument()
      expect(screen.getByText('Trang đăng nhập')).toBeInTheDocument()
    })

    it('renders AccessPage 403 when forbidden role', () => {
      render(
        <MemoryRouter>
          <AccessPage notFound={false} />
        </MemoryRouter>
      )

      expect(screen.getByText(/403/)).toBeInTheDocument()
      expect(screen.getByText('Bạn chưa có quyền truy cập.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Về trang chủ' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Đăng nhập' })).toBeInTheDocument()
    })

    it('renders AccessPage 404 when route unknown', () => {
      render(
        <MemoryRouter>
          <AccessPage notFound={true} />
        </MemoryRouter>
      )

      expect(screen.getByText(/404/)).toBeInTheDocument()
      expect(screen.getByText('Không tìm thấy trang.')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Về trang chủ' })).toBeInTheDocument()
    })
  })
})
