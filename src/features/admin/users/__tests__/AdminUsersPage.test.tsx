import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AdminUsersPage } from '../pages/AdminUsersPage'
import { getData, sendData } from '@/shared/api/resources'
import { getAdminUsersStoreSnapshot } from '../store/adminUsersStore'
import type { AdminUser } from '../types/adminUsersTypes'

vi.mock('@/shared/api/resources', async () => {
  const actual = await vi.importActual('@/shared/api/resources')
  return {
    ...actual,
    getData: vi.fn(),
    sendData: vi.fn(),
  }
})

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

const mockUsers: AdminUser[] = [
  {
    id: 101,
    phone: '0988111222',
    email: 'driver.nam@example.com',
    fullName: 'Nguyễn Văn Nam',
    role: 'ROLE_DRIVER',
    status: 'ACTIVE',
    warningCount: 0,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 102,
    phone: '0912333444',
    email: 'merchant.le@example.com',
    fullName: 'Lê Văn Trọng',
    role: 'ROLE_MERCHANT',
    status: 'BANNED',
    warningCount: 2,
    createdAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 103,
    phone: '0909555666',
    email: 'admin.super@example.com',
    fullName: 'Quản Trị Viên VIP',
    role: 'ROLE_ADMIN',
    status: 'ACTIVE',
    warningCount: 0,
    createdAt: '2026-01-01T00:00:00Z',
  },
]

describe('AdminUsersPage (SCR-045 - SP-S3-GOV-04)', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    vi.clearAllMocks()
    getAdminUsersStoreSnapshot().resetStore()
    queryClient = createTestQueryClient()
    vi.mocked(getData).mockResolvedValue({
      content: mockUsers,
      totalPages: 1,
      totalElements: 3,
    })
  })

  it('renders page header, toolbar with filters, and 6-column user table with actions', async () => {
    // Act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    // Wait for content to load
    expect(await screen.findByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()

    // Assert Header & Eyebrow
    expect(screen.getByText('Quản lý người dùng')).toBeInTheDocument()
    expect(screen.getByText('TÀI KHOẢN & PHÂN QUYỀN')).toBeInTheDocument()

    // Assert Toolbar elements
    expect(
      screen.getByRole('search', { name: 'Bộ lọc danh bạ tài khoản' }),
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Tìm theo họ tên, SĐT hoặc #ID...'),
    ).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Lọc theo vai trò' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' })).toBeInTheDocument()

    // Assert Table cells
    expect(screen.getByRole('cell', { name: '0988111222' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'driver.nam@example.com' })).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: '0912333444' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'merchant.le@example.com' })).toBeInTheDocument()

    // Assert Action links
    const manageLinks = screen.getAllByRole('link', { name: 'Quản trị' })
    expect(manageLinks).toHaveLength(3)
    expect(manageLinks[0]).toHaveAttribute('href', '/admin/users/101')
    expect(manageLinks[1]).toHaveAttribute('href', '/admin/users/102')

    // Counter badge shows 3 / 3 accounts
    expect(screen.getByTestId('admin-users-counter')).toHaveTextContent('3 / 3 tài khoản')
  })

  it('filters users dynamically when searching by keyword', async () => {
    // Arrange
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()

    // Act - Type in search input
    const searchInput = screen.getByPlaceholderText('Tìm theo họ tên, SĐT hoặc #ID...')
    await user.type(searchInput, 'Trọng')

    // Assert - Only user #102 is visible
    expect(screen.queryByText('#101 · Nguyễn Văn Nam')).not.toBeInTheDocument()
    expect(screen.getByText('#102 · Lê Văn Trọng')).toBeInTheDocument()
    expect(screen.getByTestId('admin-users-counter')).toHaveTextContent('1 / 3 tài khoản')

    // Clear search
    const clearBtn = screen.getByRole('button', { name: 'Xóa từ khóa tìm kiếm' })
    await user.click(clearBtn)
    expect(screen.getByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()
    expect(screen.getByTestId('admin-users-counter')).toHaveTextContent('3 / 3 tài khoản')
  })

  it('filters users by Role and Status dropdowns, and resets with reset button', async () => {
    // Arrange
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()

    // Act - Filter by Role: MERCHANT
    const roleSelect = screen.getByRole('combobox', { name: 'Lọc theo vai trò' })
    await user.selectOptions(roleSelect, 'ROLE_MERCHANT')

    // Assert
    expect(screen.queryByText('#101 · Nguyễn Văn Nam')).not.toBeInTheDocument()
    expect(screen.getByText('#102 · Lê Văn Trọng')).toBeInTheDocument()
    expect(screen.getByTestId('admin-users-counter')).toHaveTextContent('1 / 3 tài khoản')

    // Act - Click "Đặt lại" button
    const resetBtn = screen.getByRole('button', { name: /Đặt lại/i })
    await user.click(resetBtn)

    // Assert - All 3 users returned
    expect(screen.getByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()
    expect(screen.getByText('#102 · Lê Văn Trọng')).toBeInTheDocument()
    expect(screen.getByTestId('admin-users-counter')).toHaveTextContent('3 / 3 tài khoản')
  })

  it('displays empty state when keyword yields no matches and allows resetting filters', async () => {
    // Arrange
    const user = userEvent.setup()

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()

    // Act - Type non-existent user
    const searchInput = screen.getByPlaceholderText('Tìm theo họ tên, SĐT hoặc #ID...')
    await user.type(searchInput, 'non_existent_user_999')

    // Assert Empty State
    expect(await screen.findByText('Không tìm thấy tài khoản phù hợp')).toBeInTheDocument()
    expect(
      screen.getByText(/Không có người dùng nào khớp với bộ lọc hiện tại/i),
    ).toBeInTheDocument()

    // Click "Đặt lại bộ lọc" in empty state
    const resetFilterBtn = screen.getByRole('button', { name: 'Đặt lại bộ lọc' })
    await user.click(resetFilterBtn)

    expect(screen.getByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()
  })

  it('enforces Admin Self/Peer Protection: disables Ban button for ROLE_ADMIN user', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#103 · Quản Trị Viên VIP')).toBeInTheDocument()

    // The quick action button for user 103 (Admin) must be disabled
    const adminActionBtn = screen.getByTitle('Không thể khóa tài khoản Quản trị viên')
    expect(adminActionBtn).toBeInTheDocument()
    expect(adminActionBtn).toBeDisabled()
  })

  it('opens Ban modal, enforces Zod audit reason validation, and executes ban mutation', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.mocked(sendData).mockResolvedValue(undefined)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#101 · Nguyễn Văn Nam')).toBeInTheDocument()

    // Act - Click "Khóa" on active driver #101
    const banButtons = screen.getAllByRole('button', { name: /Khóa/i })
    await user.click(banButtons[0])

    // Assert - Modal opens
    expect(screen.getByText('Xác nhận khóa tài khoản')).toBeInTheDocument()
    expect(
      screen.getByText(/Nhập lý do để lưu vết kiểm toán và hỗ trợ đối soát/i),
    ).toBeInTheDocument()

    // Try submitting with empty or short reason (< 5 characters)
    const reasonInput = screen.getByLabelText(/Lý do giải trình/i)
    await user.type(reasonInput, 'abc')
    const confirmBtn = screen.getByRole('button', { name: 'Khóa tài khoản' })
    await user.click(confirmBtn)

    // Assert - Validation error
    expect(
      await screen.findByText('Lý do giải trình phải có ít nhất 5 ký tự'),
    ).toBeInTheDocument()
    expect(sendData).not.toHaveBeenCalled()

    // Enter valid reason >= 5 characters
    await user.clear(reasonInput)
    await user.type(reasonInput, 'Tài khoản vi phạm hủy cuốc liên tục nhiều lần')
    await user.click(confirmBtn)

    // Assert - sendData called with PUT /api/v1/admin/users/101/ban
    await waitFor(() => {
      expect(sendData).toHaveBeenCalledWith(
        'put',
        '/api/v1/admin/users/101/ban',
        { reason: 'Tài khoản vi phạm hủy cuốc liên tục nhiều lần' },
      )
    })

    // Assert Toast feedback
    expect(await screen.findByText('Đã khóa tài khoản #101 thành công!')).toBeInTheDocument()
  })

  it('opens Unban modal for BANNED user and executes unban mutation', async () => {
    // Arrange
    const user = userEvent.setup()
    vi.mocked(sendData).mockResolvedValue(undefined)

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AdminUsersPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('#102 · Lê Văn Trọng')).toBeInTheDocument()

    // Act - Click "Mở khóa" on user #102
    const unbanBtn = screen.getByRole('button', { name: /Mở khóa/i })
    await user.click(unbanBtn)

    // Assert - Modal opens with Unban title
    expect(screen.getByText('Xác nhận mở khóa tài khoản')).toBeInTheDocument()

    const reasonInput = screen.getByLabelText(/Lý do giải trình/i)
    await user.type(reasonInput, 'Đã giải quyết xong khiếu nại của đối tác')
    const confirmBtn = screen.getByRole('button', { name: 'Mở khóa tài khoản' })
    await user.click(confirmBtn)

    // Assert - sendData called with PUT /api/v1/admin/users/102/unban
    await waitFor(() => {
      expect(sendData).toHaveBeenCalledWith(
        'put',
        '/api/v1/admin/users/102/unban',
        { reason: 'Đã giải quyết xong khiếu nại của đối tác' },
      )
    })

    expect(await screen.findByText('Đã mở khóa tài khoản #102 thành công!')).toBeInTheDocument()
  })
})
