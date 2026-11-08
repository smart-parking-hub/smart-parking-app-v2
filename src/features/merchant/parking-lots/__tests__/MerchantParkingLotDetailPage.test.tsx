import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantParkingLotDetailPage } from '../pages/MerchantParkingLotDetailPage'
import { apiClient } from '@/shared/api/client'
import * as api from '../api/merchantParkingLotApi'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), post: vi.fn() } }))
vi.mock('../components/detail/MerchantLotLocationMap', () => ({ MerchantLotLocationMap: ({ latitude, longitude }: { latitude: number; longitude: number }) => <div aria-label="Bản đồ vị trí bãi đỗ">{latitude}, {longitude}</div> }))
const lot = {
  id: 35, name: 'Bến Cảng Quận 1', address: '65 Nguyễn Chí, Quận 1', status: 'APPROVED',
  latitude: 10.7721328, longitude: 106.6948199, ratingAverage: null,
  images: [{ id: 91, contentUrl: '/yard.jpg', originalFileName: 'Cổng bãi.jpg', cover: true }],
  slots: [{ id: 1, vehicleType: 'CONTAINER', totalCapacity: 20, availableCapacity: 8 }, { id: 2, vehicleType: 'LIGHT_TRUCK', totalCapacity: 10, availableCapacity: 4 }],
  pricingRules: [{ id: 1, vehicleType: 'CONTAINER', basePricePerHour: 35000 }, { id: 2, vehicleType: 'LIGHT_TRUCK', basePricePerHour: 10000 }],
}
function renderPage() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter initialEntries={['/merchant/parking-lots/35']}><Routes><Route path="/merchant/parking-lots/:parkingLotId" element={<MerchantParkingLotDetailPage />} /></Routes></MemoryRouter></QueryClientProvider>)
}
beforeEach(() => { vi.clearAllMocks(); vi.mocked(apiClient.get).mockResolvedValue({ data: { data: lot } }) })
describe('SCR-030 real-data lot profile', () => {
  it('renders actual identity, capacity, Vietnamese categories, prices and location', async () => {
    renderPage()
    expect(await screen.findByRole('heading', { level: 1, name: lot.name })).toBeInTheDocument()
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/35')
    expect(screen.getByText('Đã duyệt')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Đầu kéo / Container' })).toHaveLength(2)
    expect(screen.getByRole('progressbar', { name: 'Tỷ lệ sử dụng Đầu kéo / Container' })).toHaveAttribute('aria-valuenow', '60')
    expect(screen.getByText(/35\.000/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mở trên Google Maps' })).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=10.7721328,106.6948199')
    expect(screen.getByRole('link', { name: 'Cấu hình chỗ đỗ' })).toHaveAttribute('href', '/merchant/parking-lots/35/slots')
    expect(screen.getByRole('link', { name: 'Quét QR' })).toHaveAttribute('href', '/merchant/qr-scanner?lot=35')
    expect(screen.queryByText(/CONTAINER:|ALPR|Cát Lái|Doanh Thu/)).not.toBeInTheDocument()
  })
  it('preserves status-based edit/configuration actions and review feedback', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { ...lot, status: 'CHANGES_REQUESTED', reviewReason: 'Bổ sung ảnh lối vào.' } } })
    renderPage()
    expect(await screen.findByText('Yêu cầu bổ sung')).toBeInTheDocument()
    expect(screen.getByText('Bổ sung ảnh lối vào.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Hồ sơ' })).toHaveAttribute('href', '/merchant/parking-lots/35/edit')
    expect(screen.queryByRole('link', { name: 'Cấu hình chỗ đỗ' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Điều chỉnh bảng giá' })).not.toBeInTheDocument()
  })
  it('handles absent capacity, prices and coordinates without sample values', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { ...lot, slots: null, pricingRules: null, images: null, latitude: null, longitude: null } } })
    renderPage()
    expect(await screen.findByText('Chưa cấu hình chỗ đỗ.')).toBeInTheDocument()
    expect(screen.getByText('Chưa cấu hình bảng giá.')).toBeInTheDocument()
    expect(screen.getByText('Chưa có tọa độ.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Thêm sức chứa' })).toHaveAttribute('href', '/merchant/parking-lots/35/slots')
    expect(screen.queryByLabelText('Bản đồ vị trí bãi đỗ')).not.toBeInTheDocument()
  })
  it('opens uploaded lot photos and closes them with Escape', async () => {
    renderPage()
    fireEvent.click(await screen.findByAltText('Cổng bãi.jpg'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe('')
  })
  it('preserves upload and refresh, and surfaces upload errors', async () => {
    const upload = vi.spyOn(api, 'uploadAdditionalLotImages').mockResolvedValue([])
    const user = userEvent.setup()
    renderPage()
    await screen.findByRole('heading', { name: lot.name })
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['photo'], 'yard.jpg', { type: 'image/jpeg' })
    await user.upload(input, file)
    expect(upload).toHaveBeenCalledWith(35, [file])
    await waitFor(() => expect(apiClient.get).toHaveBeenCalledTimes(2))
    upload.mockRejectedValueOnce(new Error('Upload failure'))
    await user.upload(input, file)
    expect(await screen.findByRole('alert')).toHaveTextContent('Tải ảnh thất bại')
  })
  it('shows load errors and allows retry', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Offline'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không tải được hồ sơ')
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByRole('heading', { name: lot.name })).toBeInTheDocument()
  })
})
