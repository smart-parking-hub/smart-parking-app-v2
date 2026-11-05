import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { ProfilePage } from '../pages/ProfilePage'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), put: vi.fn(), post: vi.fn() } }))
const profile = { fullName: 'Nguyễn Minh', phone: '0901234567', email: 'minh@example.com', address: 'Hà Nội', emergencyContact: '0907654321' }
function mount() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}><MemoryRouter><ProfilePage /></MemoryRouter></QueryClientProvider>)
}
afterEach(cleanup)
beforeEach(() => { vi.clearAllMocks(); vi.mocked(apiClient.get).mockResolvedValue({ data: { data: profile } }) })
describe('Driver profile with verified user API fields', () => {
  it('shows API-backed fields, readonly login phone and useful navigation only', async () => {
    mount()
    expect(await screen.findByLabelText('Họ và tên')).toHaveValue(profile.fullName)
    expect(screen.getByLabelText('Số điện thoại đăng nhập')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Số điện thoại liên hệ khẩn cấp')).toHaveValue(profile.emergencyContact)
    for (const text of [/eKYC/i, /HẠNG FC/, /CẢNG CÁT LÁI/, /48 chuyến/i, /Cấu hình xuất hóa đơn/, /Trần Quốc Tuấn/, /3 XE/]) expect(screen.queryByText(text)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Đội xe của tôi/ })).toHaveAttribute('href', '/vehicles')
    expect(screen.getByRole('link', { name: /Lịch sử thanh toán/ })).toHaveAttribute('href', '/payments')
  })
  it('shows loading and an empty profile without demo fallback', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } }); mount()
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải')
    expect(await screen.findByText('Chưa có thông tin hồ sơ.')).toBeInTheDocument()
  })
  it('shows retry on fetch failure and recovers from server data', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Mất kết nối')).mockResolvedValueOnce({ data: { data: profile } })
    mount(); await userEvent.click(await screen.findByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByLabelText('Họ và tên')).toHaveValue(profile.fullName)
  })
  it('validates email and cancels unsaved edits', async () => {
    const user = userEvent.setup(); mount(); const email = await screen.findByLabelText('Email')
    await user.clear(email); await user.type(email, 'invalid')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByText('Email không hợp lệ.')).toBeInTheDocument()
    expect(apiClient.put).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Hủy thay đổi' }))
    expect(email).toHaveValue(profile.email)
  })
  it('saves supported fields and never reports success on PUT failure', async () => {
    const user = userEvent.setup(); vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('Không lưu được')).mockResolvedValueOnce({ data: { data: { ...profile, fullName: 'Tên mới' } } })
    mount(); const input = await screen.findByLabelText('Họ và tên'); await user.clear(input); await user.type(input, 'Tên mới')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Không lưu được')
    expect(screen.queryByText('Đã lưu thông tin hồ sơ.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByText('Đã lưu thông tin hồ sơ.')).toBeInTheDocument()
    expect(apiClient.put).toHaveBeenLastCalledWith('/api/v1/users/me', { ...profile, fullName: 'Tên mới' })
  })
  it('validates password length and confirmation before sending', async () => {
    const user = userEvent.setup(); mount(); await screen.findByLabelText('Mật khẩu hiện tại')
    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'current-demo')
    await user.type(screen.getByLabelText('Mật khẩu mới', { exact: true }), 'short')
    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }))
    expect(await screen.findByText('Mật khẩu mới phải từ 6 đến 50 ký tự.')).toBeInTheDocument()
    const next = screen.getByLabelText('Mật khẩu mới', { exact: true }); await user.clear(next); await user.type(next, 'new-demo-123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu mới'), 'different')
    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }))
    expect(await screen.findByText('Mật khẩu xác nhận không khớp.')).toBeInTheDocument()
    expect(apiClient.post).not.toHaveBeenCalled()
  })
  it('submits password through POST, preserves errors and clears fields on success', async () => {
    const user = userEvent.setup(); vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Mật khẩu hiện tại không đúng')).mockResolvedValueOnce({ data: { data: null } })
    mount(); await screen.findByLabelText('Mật khẩu hiện tại')
    await user.type(screen.getByLabelText('Mật khẩu hiện tại'), 'current-demo')
    await user.type(screen.getByLabelText('Mật khẩu mới', { exact: true }), 'new-demo-123')
    await user.type(screen.getByLabelText('Xác nhận mật khẩu mới'), 'new-demo-123')
    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Mật khẩu hiện tại không đúng')
    expect(screen.queryByText('Đã đổi mật khẩu thành công.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cập nhật mật khẩu' }))
    expect(await screen.findByText('Đã đổi mật khẩu thành công.')).toBeInTheDocument()
    expect(apiClient.post).toHaveBeenLastCalledWith('/api/v1/users/me/password', { currentPassword: 'current-demo', newPassword: 'new-demo-123' })
    await waitFor(() => expect(screen.getByLabelText('Mật khẩu hiện tại')).toHaveValue(''))
  })
})
