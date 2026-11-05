import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AdminProfilePage } from './AdminProfilePage'
import { getData } from '@/shared/api/resources'
vi.mock('@/shared/api/resources', () => ({ getData: vi.fn(), sendData: vi.fn(), errorMessage: () => 'Lỗi tải hồ sơ' }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
function mount() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><AdminProfilePage /></MemoryRouter></QueryClientProvider>)
}
it('renders loading while fetching', () => {
  vi.mocked(getData).mockReturnValue(new Promise(() => {}))
  mount()
  expect(screen.getByRole('status')).toHaveTextContent('Đang tải')
})
it('handles missing profile', async () => {
  vi.mocked(getData).mockResolvedValue(null)
  mount()
  expect(await screen.findByText('Chưa có thông tin hồ sơ quản trị viên.')).toBeInTheDocument()
})
it('offers retry on failure', async () => {
  vi.mocked(getData).mockRejectedValue(new Error('failure'))
  mount()
  expect(await screen.findByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
})
it('loads the verified endpoint and provides a dashboard exit', async () => {
  vi.mocked(getData).mockResolvedValue({ fullName: 'Admin', phone: '0900000000', email: '', address: '', emergencyContact: '' })
  mount()
  expect(await screen.findByDisplayValue('Admin')).toBeInTheDocument()
  expect(getData).toHaveBeenCalledWith('/api/v1/users/me')
  expect(screen.getByRole('link', { name: 'Về Tổng quan' })).toHaveAttribute('href', '/admin/dashboard')
})
