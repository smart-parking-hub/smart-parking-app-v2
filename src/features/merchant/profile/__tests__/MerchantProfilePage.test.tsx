import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantProfilePage } from '../pages/MerchantProfilePage'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), put: vi.fn(), post: vi.fn() } }))
const profile = { merchantId: 7, userId: 12, fullName: 'Nguyễn Minh', phone: '0901234567', email: 'minh@example.com', address: '', emergencyContact: '', businessLicense: 'GP-123', bankName: 'Ngân hàng thử nghiệm', bankAccountNum: '1234567890', maskedBankAccount: '******7890', walletBalance: 0, verificationLabel: 'Đã xác thực' }
function mount() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })}><MemoryRouter><MerchantProfilePage /></MemoryRouter></QueryClientProvider>)
}
afterEach(cleanup)
beforeEach(() => { vi.clearAllMocks(); localStorage.clear(); vi.mocked(apiClient.get).mockResolvedValue({ data: { data: profile } }) })
describe('Merchant profile backed by the real API contract', () => {
  it('shows only supported fields and hides speculative blocks', async () => {
    mount()
    expect(await screen.findByLabelText('Họ và tên')).toHaveValue('Nguyễn Minh')
    expect(screen.getByRole('navigation', { name: 'Các phần hồ sơ' })).toBeInTheDocument()
    for (const text of [/ISO 27001/, /Napas247/i, /OTP VERIFIED/, /Chính Sách Cắt Cước/, /Zalo Official/, /ChungNhan_PCCC/]) expect(screen.queryByText(text)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lưu thay đổi' })).toBeDisabled()
  })
  it('shows loading, then empty for a null profile', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: null } })
    mount()
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải')
    expect(await screen.findByText('Chưa có hồ sơ chủ bãi.')).toBeInTheDocument()
  })
  it('never falls back to cached demo data on API failure and retries', async () => {
    localStorage.setItem('smarttruck_merchant_profile_v2', JSON.stringify({ fullName: 'Demo cũ' }))
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Mất kết nối')).mockResolvedValueOnce({ data: { data: profile } })
    mount()
    await userEvent.click(await screen.findByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByLabelText('Họ và tên')).toHaveValue('Nguyễn Minh')
    expect(screen.queryByText('Demo cũ')).not.toBeInTheDocument()
  })
  it('validates email before sending and resets unsaved edits', async () => {
    const user = userEvent.setup(); mount()
    const email = await screen.findByLabelText('Email')
    await user.clear(email); await user.type(email, 'wrong')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByText('Email không hợp lệ.')).toBeInTheDocument()
    expect(apiClient.put).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Hủy thay đổi' }))
    expect(email).toHaveValue('minh@example.com')
  })
  it('saves through PUT and reports failure without claiming success', async () => {
    const user = userEvent.setup(); vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('Không lưu được')).mockResolvedValueOnce({ data: { data: { ...profile, fullName: 'Tên mới' } } })
    mount(); const name = await screen.findByLabelText('Họ và tên')
    await user.clear(name); await user.type(name, 'Tên mới')
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Không lưu được')
    expect(screen.queryByText('Đã lưu thông tin liên hệ.')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))
    expect(await screen.findByText('Đã lưu thông tin liên hệ.')).toBeInTheDocument()
    expect(apiClient.put).toHaveBeenLastCalledWith('/api/v1/merchant/profile', { fullName: 'Tên mới', email: profile.email, address: '', emergencyContact: '' })
  })
  it('masks and reveals bank account details', async () => {
    const user = userEvent.setup(); mount()
    expect(await screen.findByText('******7890')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hiển thị số tài khoản' }))
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ẩn số tài khoản' }))
    expect(screen.queryByText('1234567890')).not.toBeInTheDocument()
  })
  it('rejects oversized files and uploads a valid document to the supported endpoint', async () => {
    const user = userEvent.setup(); vi.mocked(apiClient.post).mockResolvedValue({ data: { data: profile } })
    mount(); const input = await screen.findByLabelText('Tệp đính kèm')
    const large = new File(['x'], 'large.pdf', { type: 'application/pdf' }); Object.defineProperty(large, 'size', { value: 6 * 1024 * 1024 })
    await user.upload(input, large)
    expect(screen.getByRole('alert')).toHaveTextContent('5 MB')
    expect(apiClient.post).not.toHaveBeenCalled()
    await user.upload(input, new File(['document'], 'license.pdf', { type: 'application/pdf' }))
    await user.click(screen.getByRole('button', { name: 'Gửi giấy tờ' }))
    expect(await screen.findByText('Đã gửi giấy tờ thành công.')).toBeInTheDocument()
    expect(apiClient.post).toHaveBeenCalledWith('/api/v1/merchant/profile/documents', expect.any(FormData), { headers: { 'Content-Type': 'multipart/form-data' } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Gửi giấy tờ' })).toBeDisabled())
  })
})
