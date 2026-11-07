import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantParkingLotsPage } from '../pages/MerchantParkingLotsPage'
import { fetchMerchantParkingLots } from '../api/merchantParkingLotApi'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn() } }))
const lot = { id: 92, name: 'Bãi riêng của merchant', address: 'Địa chỉ bãi riêng', status: 'APPROVED', createdAt: '2026-11-07T09:00:00', ratingAverage: null }
const empty = { content: [], currentPage: 0, totalPages: 0, totalElements: 0 }
function renderPage() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter><MerchantParkingLotsPage /></MemoryRouter>
  </QueryClientProvider>)
}
beforeEach(() => {
  vi.resetAllMocks()
  localStorage.clear()
  vi.mocked(apiClient.get).mockResolvedValue({ data: { data: empty } })
})
describe('Merchant owned lots from authenticated API', () => {
  it('shows a new merchant as empty without demo metrics or demo yards', async () => {
    renderPage()
    expect(await screen.findByText('Bạn chưa đăng ký bãi đỗ xe nào')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xuất CSV trang hiện tại' })).toBeDisabled()
    expect(screen.queryByText(/Cát Lái|Sóng Thần|Phú Hữu|18.450.000/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Đăng ký bãi đỗ mới' })).toHaveAttribute('href', '/merchant/parking-lots/new')
    for (const [url, config] of vi.mocked(apiClient.get).mock.calls) {
      expect(url).toBe('/api/v1/merchant/parking-lots')
      expect((config?.params as { status?: string } | undefined)?.status).not.toBe('ALL')
    }
  })
  it('omits the ALL status and trims keywords while keeping server paging and sort', async () => {
    await fetchMerchantParkingLots({ status: 'ALL', keyword: '  bãi riêng  ', page: 2, size: 10, sort: 'name,asc' })
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/parking-lots', expect.objectContaining({
      params: { keyword: 'bãi riêng', page: 2, size: 10, sort: 'name,asc' },
    }))
  })
  it('shows only returned yards and uses server totals rather than the current page length', async () => {
    vi.mocked(apiClient.get).mockImplementation(async (_url, config) => {
      const params = config?.params as { size?: number; status?: string } | undefined
      return { data: { data: params?.size === 1
        ? { ...empty, totalElements: params.status === 'APPROVED' ? 3 : params.status === 'PENDING_APPROVAL' ? 9 : 12 }
        : { content: [lot], currentPage: 0, totalPages: 2, totalElements: 12 } } }
    })
    renderPage()
    expect(await screen.findByText(lot.name)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cấu hình slot' })).toHaveAttribute('href', '/merchant/parking-lots/92/slots')
    expect(screen.getByRole('link', { name: 'Bảng giá' })).toHaveAttribute('href', '/merchant/parking-lots/92/pricing')
    expect(screen.queryByText(/82.5|200|18.450.000/)).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('9', { selector: 'p' })).toBeInTheDocument())
    expect(screen.getByText('12', { selector: 'p' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Chế độ xem dạng bảng' }))
    expect(screen.getByRole('columnheader', { name: 'Tên cơ sở' })).toBeInTheDocument()
    expect(screen.getByText(lot.name)).toBeInTheDocument()
  })
  it('sends status filters to the backend and distinguishes filtered empty from new-account empty', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findByText('Bạn chưa đăng ký bãi đỗ xe nào')
    await user.selectOptions(screen.getByLabelText('Lọc theo trạng thái', { selector: 'select' }), 'APPROVED')
    expect(await screen.findByText('Không tìm thấy bãi đỗ nào phù hợp bộ lọc')).toBeInTheDocument()
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/parking-lots', expect.objectContaining({ params: expect.objectContaining({ status: 'APPROVED', page: 0, size: 10 }) }))
    await user.click(screen.getByRole('button', { name: 'Xóa Bộ Lọc' }))
    expect(await screen.findByText('Bạn chưa đăng ký bãi đỗ xe nào')).toBeInTheDocument()
  })
  it.each([401, 403, 500])('reports HTTP %s instead of displaying sample yards or an empty account', async status => {
    vi.mocked(apiClient.get).mockRejectedValue({ response: { status } })
    renderPage()
    expect(await screen.findByText('Không thể tải danh sách bãi đỗ. Vui lòng thử lại.')).toBeInTheDocument()
    expect(screen.queryByText('Bạn chưa đăng ký bãi đỗ xe nào')).not.toBeInTheDocument()
    expect(screen.queryByText(/Cát Lái|Sóng Thần|Phú Hữu/)).not.toBeInTheDocument()
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: empty } })
    fireEvent.click(screen.getByRole('button', { name: /^Thử lại$/ }))
    expect(await screen.findByText('Bạn chưa đăng ký bãi đỗ xe nào')).toBeInTheDocument()
  })
  it('rejects a response without the API envelope', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: empty })
    await expect(fetchMerchantParkingLots()).rejects.toThrow()
  })
})
