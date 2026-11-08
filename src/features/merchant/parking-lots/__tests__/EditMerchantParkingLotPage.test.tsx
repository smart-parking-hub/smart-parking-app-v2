import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EditMerchantParkingLotPage } from '../pages/EditMerchantParkingLotPage'
import { apiClient } from '@/shared/api/client'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), put: vi.fn(), post: vi.fn() } }))
vi.mock('../components/CreateParkingLotMapPicker', () => ({ CreateParkingLotMapPicker: () => <div>Bản đồ</div> }))
vi.mock('@/shared/components/ApiImage', () => ({ ApiImage: ({ path, alt }: { path: string; alt: string }) => <img src={path} alt={alt} /> }))
const lot = { id: 35, name: 'Bến Cảng Quận 1', address: '65 Nguyễn Chí, Quận 1', latitude: 21.0278, longitude: 105.8342, status: 'CHANGES_REQUESTED', reviewReason: 'Cập nhật địa chỉ cổng vào.', images: [{ id: 91, originalFileName: 'cong-bai-35.jpg', contentUrl: '/api/v1/parking-lots/35/images/91/content', cover: true }] }
function renderPage(id = '35') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } } })
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[`/merchant/parking-lots/${id}/edit`]}><Routes>
    <Route path="/merchant/parking-lots/:parkingLotId/edit" element={<EditMerchantParkingLotPage />} />
    <Route path="/merchant/parking-lots/:parkingLotId" element={<p>Chi tiết bãi thật</p>} />
  </Routes></MemoryRouter></QueryClientProvider>)
}
beforeEach(() => { vi.resetAllMocks(); localStorage.clear(); vi.mocked(apiClient.get).mockResolvedValue({ data: { data: lot } }) })
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('SCR-031 uses the selected lot and real API outcomes', () => {
  it('loads actual fields, review reason and image without prototype data', async () => {
    renderPage()
    expect(await screen.findByLabelText('Tên bãi đỗ')).toHaveValue(lot.name)
    expect(screen.getByLabelText('Địa chỉ')).toHaveValue(lot.address)
    expect(screen.getByLabelText('Vĩ độ')).toHaveValue(lot.latitude)
    expect(screen.getByLabelText('Kinh độ')).toHaveValue(lot.longitude)
    expect(screen.getByText(lot.reviewReason)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'cong-bai-35.jpg' })).toHaveAttribute('src', lot.images[0].contentUrl)
    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/35', expect.objectContaining({ signal: expect.any(AbortSignal) }))
    for (const text of [/Nguyễn Hoàng Nam/, /Rev 2.1/, /RTK/, /MOD-04/, /OTP Verified/, /Gò Cát/, /Lịch Sử Thẩm Định/]) expect(screen.queryByText(text)).not.toBeInTheDocument()
  })
  it('does not invent missing coordinates, images or feedback', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { ...lot, latitude: null, longitude: null, images: [], reviewReason: null } } })
    renderPage()
    expect(await screen.findByLabelText('Vĩ độ')).toHaveValue(null)
    expect(screen.getByLabelText('Kinh độ')).toHaveValue(null)
    expect(screen.getByText('Bãi chưa có ảnh.')).toBeInTheDocument()
    expect(screen.queryByText('Phản hồi từ quản trị viên')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(apiClient.put).not.toHaveBeenCalled()
  })
  it.each(['APPROVED', 'PENDING_APPROVAL', 'SUSPENDED'])('redirects %s to detail without edit controls', async status => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { ...lot, status } } })
    renderPage()
    expect(await screen.findByText('Chi tiết bãi thật')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Gửi lại hồ sơ' })).not.toBeInTheDocument()
  })
  it('does not fetch lot 1 when the route ID is invalid', async () => {
    renderPage('abc')
    expect(screen.getByRole('alert')).toHaveTextContent('Mã bãi đỗ không hợp lệ')
    expect(apiClient.get).not.toHaveBeenCalled()
  })
  it('rejects a response for another lot', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: { ...lot, id: 36 } } })
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('không khớp')
    expect(screen.queryByLabelText('Tên bãi đỗ')).not.toBeInTheDocument()
  })
  it('shows load failure and retries instead of displaying a fallback yard', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Không có quyền truy cập'))
    renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent('Không có quyền truy cập')
    expect(screen.queryByLabelText('Tên bãi đỗ')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Thử lại' }))
    expect(await screen.findByLabelText('Tên bãi đỗ')).toHaveValue(lot.name)
  })
  it('ignores legacy drafts and drafts belonging to another yard', async () => {
    localStorage.setItem('merchant_lot_edit_draft_35', JSON.stringify({ lotId: 35, name: 'Nội dung mẫu cũ', latitude: 10.785514 }))
    const view = renderPage()
    expect(await screen.findByLabelText('Tên bãi đỗ')).toHaveValue(lot.name)
    view.unmount()
    localStorage.setItem('merchant_lot_edit_draft_35', JSON.stringify({ version: 2, lotId: 36, values: { ...lot, name: 'Bãi khác' } }))
    renderPage()
    expect(await screen.findByLabelText('Tên bãi đỗ')).toHaveValue(lot.name)
    expect(screen.queryByRole('button', { name: 'Khôi phục bản nháp' })).not.toBeInTheDocument()
  })
  it('restores a matching draft only after explicit selection', async () => {
    localStorage.setItem('merchant_lot_edit_draft_35', JSON.stringify({ version: 2, lotId: 35, values: { ...lot, name: 'Tên trong bản nháp', latitude: 0, longitude: 0 } }))
    renderPage()
    expect(await screen.findByLabelText('Tên bãi đỗ')).toHaveValue(lot.name)
    await userEvent.click(screen.getByRole('button', { name: 'Khôi phục bản nháp' }))
    expect(screen.getByLabelText('Tên bãi đỗ')).toHaveValue('Tên trong bản nháp')
    expect(screen.getByLabelText('Vĩ độ')).toHaveValue(0)
    expect(screen.getByLabelText('Kinh độ')).toHaveValue(0)
  })
  it('preserves saved coordinates when device geolocation fails', async () => {
    const getCurrentPosition = vi.fn((_success, failure) => failure())
    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } })
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Lấy vị trí thiết bị' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Tọa độ bãi được giữ nguyên')
    expect(screen.getByLabelText('Vĩ độ')).toHaveValue(lot.latitude)
    expect(screen.getByLabelText('Kinh độ')).toHaveValue(lot.longitude)
  })
  it('restores coordinates from this lot instead of a fixed port location', async () => {
    renderPage()
    const latitude = await screen.findByLabelText('Vĩ độ')
    fireEvent.change(latitude, { target: { value: '0' } })
    await userEvent.click(screen.getByRole('button', { name: 'Khôi phục tọa độ đã lưu' }))
    expect(latitude).toHaveValue(lot.latitude)
  })
  it('sends only the real DTO, reports failures and retries successfully', async () => {
    vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('Máy chủ từ chối cập nhật')).mockResolvedValueOnce({ data: { data: { ...lot, status: 'PENDING_APPROVAL', reviewReason: null } } })
    renderPage()
    await userEvent.click(await screen.findByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Máy chủ từ chối cập nhật')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(apiClient.put).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/35', { name: lot.name, address: lot.address, latitude: lot.latitude, longitude: lot.longitude })
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(await screen.findByRole('dialog', { name: 'Đã lưu hồ sơ bãi' })).toHaveTextContent('Chờ duyệt')
  })
  it('does not resubmit the lot when supplementary image upload fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Tải ảnh thất bại'))
    renderPage()
    await userEvent.upload(await screen.findByLabelText('Thêm ảnh bổ sung'), new File(['image'], 'anh-moi.png', { type: 'image/png' }))
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Tải ảnh thất bại')
    expect(apiClient.put).not.toHaveBeenCalled()
  })
  it('keeps uploaded photos and does not upload them twice if the lot update needs retry', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: [{ id: 92, originalFileName: 'anh-moi.png', contentUrl: '/api/v1/parking-lots/35/images/92/content', cover: false }] } })
    vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('Chưa lưu được hồ sơ')).mockResolvedValueOnce({ data: { data: { ...lot, status: 'PENDING_APPROVAL' } } })
    renderPage()
    await userEvent.upload(await screen.findByLabelText('Thêm ảnh bổ sung'), new File(['image'], 'anh-moi.png', { type: 'image/png' }))
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Chưa lưu được hồ sơ')
    expect(screen.getByRole('img', { name: 'anh-moi.png' })).toHaveAttribute('src', '/api/v1/parking-lots/35/images/92/content')
    await userEvent.click(screen.getByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(apiClient.post).toHaveBeenCalledTimes(1)
    expect(apiClient.put).toHaveBeenCalledTimes(2)
  })
  it('blocks duplicate confirmation while the server is saving', async () => {
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    vi.mocked(apiClient.put).mockImplementation(async () => {
      await gate
      return { data: { data: { ...lot, status: 'PENDING_APPROVAL' } } }
    })
    renderPage()
    await userEvent.dblClick(await screen.findByRole('button', { name: 'Gửi lại hồ sơ' }))
    expect(screen.getByRole('button', { name: 'Đang gửi hồ sơ…' })).toBeDisabled()
    expect(apiClient.put).toHaveBeenCalledTimes(1)
    await act(async () => { release() })
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})
