import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createMerchantParkingLot, uploadMerchantParkingLotImages } from '../api/merchantParkingLotApi'
import { CreateMerchantParkingLotPage } from '../pages/CreateMerchantParkingLotPage'

vi.mock('../api/merchantParkingLotApi', () => ({ createMerchantParkingLot: vi.fn(), uploadMerchantParkingLotImages: vi.fn() }))
vi.mock('../components/CreateParkingLotMapPicker', () => ({ CreateParkingLotMapPicker: () => <div aria-label="Bản đồ chọn vị trí bãi đỗ" /> }))

const draftKey = 'merchant_lot_registration_draft'
const draft = { name: 'Bãi đỗ Tân Cảng', address: '12 Gò Cát, Phú Hữu', latitude: 10.762622, longitude: 106.660172 }
function renderPage() {
  return render(<MemoryRouter initialEntries={['/merchant/parking-lots/new']}><Routes>
    <Route path="/merchant/parking-lots/new" element={<CreateMerchantParkingLotPage />} />
    <Route path="/merchant/parking-lots" element={<div>Danh sách bãi đỗ</div>} />
  </Routes></MemoryRouter>)
}
async function goToConfirmation(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }))
  await user.click(await screen.findByRole('button', { name: 'Tiếp tục: Kiểm tra hồ sơ' }))
  await screen.findByRole('heading', { name: 'Kiểm tra thông tin đăng ký' })
}

describe('SCR-029: đăng ký bãi đỗ', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.scrollTo = vi.fn()
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:parking-photo'), revokeObjectURL: vi.fn() }))
    vi.mocked(createMerchantParkingLot).mockResolvedValue({ id: 101, name: draft.name, status: 'PENDING_APPROVAL' })
    vi.mocked(uploadMerchantParkingLotImages).mockResolvedValue([])
  })

  it('starts with empty required fields, useful guidance and locked future steps', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Đăng ký bãi đỗ mới' })).toBeInTheDocument()
    expect(screen.getByLabelText(/^Tên bãi đỗ/)).toHaveValue('')
    expect(screen.getByLabelText(/^Địa chỉ bãi đỗ/)).toHaveValue('')
    expect(screen.getByRole('button', { name: /Vị trí trên bản đồ/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Kiểm tra & gửi duyệt/ })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Hồ sơ cần chuẩn bị' })).toBeInTheDocument()
  })

  it('blocks an empty form, explains errors and focuses the first invalid input', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }))
    expect(await screen.findByText('Tên bãi đỗ không được để trống')).toBeInTheDocument()
    expect(screen.getByLabelText(/^Tên bãi đỗ/)).toHaveFocus()
    expect(screen.getByLabelText(/^Tên bãi đỗ/)).toHaveAttribute('aria-invalid', 'true')
    expect(createMerchantParkingLot).not.toHaveBeenCalled()
  })

  it('preserves typed data when returning via the completed step', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.type(screen.getByLabelText(/^Tên bãi đỗ/), draft.name)
    await user.type(screen.getByLabelText(/^Địa chỉ bãi đỗ/), draft.address)
    await user.click(screen.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }))
    expect(await screen.findByRole('heading', { name: 'Vị trí bãi đỗ' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Thông tin bãi đỗ.*Đã hoàn thành/ }))
    expect(screen.getByLabelText(/^Tên bãi đỗ/)).toHaveValue(draft.name)
    expect(screen.getByLabelText(/^Địa chỉ bãi đỗ/)).toHaveValue(draft.address)
  })

  it('requires valid coordinates before showing the confirmation', async () => {
    localStorage.setItem(draftKey, JSON.stringify({ name: draft.name, address: draft.address }))
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Tiếp tục: Vị trí bãi đỗ' }))
    await user.type(await screen.findByLabelText(/^Vĩ độ/), '91')
    await user.type(screen.getByLabelText(/^Kinh độ/), '181')
    await user.click(screen.getByRole('button', { name: 'Tiếp tục: Kiểm tra hồ sơ' }))
    expect(await screen.findByText('Vĩ độ phải từ -90 đến 90')).toBeInTheDocument()
    expect(screen.getByText('Kinh độ phải từ -180 đến 180')).toBeInTheDocument()
    expect(createMerchantParkingLot).not.toHaveBeenCalled()
  })

  it('restores, edits and saves a draft with explicit image persistence guidance', async () => {
    localStorage.setItem(draftKey, JSON.stringify(draft))
    const user = userEvent.setup()
    renderPage()
    expect(screen.getByLabelText(/^Tên bãi đỗ/)).toHaveValue(draft.name)
    await user.type(screen.getByLabelText(/^Tên bãi đỗ/), ' 2')
    await user.click(screen.getByRole('button', { name: 'Lưu bản nháp' }))
    expect(JSON.parse(localStorage.getItem(draftKey)!)).toMatchObject({ ...draft, name: `${draft.name} 2` })
    expect(screen.getByText('Đã lưu nháp')).toBeInTheDocument()
    expect(screen.getByText(/Ảnh cần được chọn lại/)).toBeInTheDocument()
  })

  it('validates image types and size, previews images and supports removal', async () => {
    const user = userEvent.setup({ applyAccept: false })
    renderPage()
    const input = screen.getByLabelText('Chọn ảnh bãi đỗ')
    await user.upload(input, new File(['text'], 'note.txt', { type: 'text/plain' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('không hợp lệ')
    await user.upload(input, new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' }))
    expect(screen.getByRole('alert')).toHaveTextContent('vượt quá 5 MB')
    await user.upload(input, new File(['image'], 'yard.jpg', { type: 'image/jpeg' }))
    expect(screen.getByRole('img', { name: 'yard.jpg' })).toBeInTheDocument()
    expect(screen.getByText('1/5 ảnh')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Xóa ảnh yard.jpg' }))
    expect(screen.getByText('0/5 ảnh')).toBeInTheDocument()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:parking-photo')
  })

  it('enforces the five-image limit', async () => {
    const user = userEvent.setup()
    renderPage()
    vi.mocked(URL.createObjectURL).mockImplementation((blob) => `blob:${(blob as File).name}`)
    await user.upload(screen.getByLabelText('Chọn ảnh bãi đỗ'), Array.from({ length: 6 }, (_, i) => new File(['image'], `${i}.jpg`, { type: 'image/jpeg' })))
    expect(screen.getByText('5/5 ảnh')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(5)
    expect(screen.getByRole('alert')).toHaveTextContent('tối đa 5 ảnh')
  })

  it('shows zero coordinates correctly and submits the verified payload', async () => {
    localStorage.setItem(draftKey, JSON.stringify({ ...draft, latitude: 0, longitude: 0 }))
    const user = userEvent.setup()
    renderPage()
    await goToConfirmation(user)
    expect(screen.getByText('Vĩ độ: 0.0000000')).toBeInTheDocument()
    expect(screen.getByText('Kinh độ: 0.0000000')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Gửi hồ sơ đăng ký' }))
    await waitFor(() => expect(createMerchantParkingLot).toHaveBeenCalledWith({ ...draft, latitude: 0, longitude: 0 }))
    expect(localStorage.getItem(draftKey)).toBeNull()
  })

  it('locks submission and step navigation during the request', async () => {
    localStorage.setItem(draftKey, JSON.stringify(draft))
    const user = userEvent.setup()
    let finish!: (value: { id: number; name: string; status: string }) => void
    vi.mocked(createMerchantParkingLot).mockReturnValueOnce(new Promise((resolve) => { finish = resolve }))
    renderPage()
    await goToConfirmation(user)
    await user.click(screen.getByRole('button', { name: 'Gửi hồ sơ đăng ký' }))
    expect(screen.getByRole('button', { name: 'Đang gửi hồ sơ…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Thông tin bãi đỗ.*Đã hoàn thành/ })).toBeDisabled()
    expect(createMerchantParkingLot).toHaveBeenCalledTimes(1)
    finish({ id: 101, name: draft.name, status: 'PENDING_APPROVAL' })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Đã tạo thành công'))
  })

  it('allows retrying image upload without creating another lot', async () => {
    localStorage.setItem(draftKey, JSON.stringify(draft))
    vi.mocked(uploadMerchantParkingLotImages).mockRejectedValueOnce(new Error('Mất kết nối'))
    const user = userEvent.setup()
    renderPage()
    const image = new File(['image'], 'yard.jpg', { type: 'image/jpeg' })
    await user.upload(screen.getByLabelText('Chọn ảnh bãi đỗ'), image)
    await goToConfirmation(user)
    await user.click(screen.getByRole('button', { name: 'Gửi hồ sơ đăng ký' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Ảnh chưa tải lên thành công')
    await user.click(screen.getByRole('button', { name: 'Thử tải lại ảnh' }))
    await waitFor(() => expect(uploadMerchantParkingLotImages).toHaveBeenCalledTimes(2))
    expect(createMerchantParkingLot).toHaveBeenCalledTimes(1)
    expect(uploadMerchantParkingLotImages).toHaveBeenLastCalledWith(101, [image])
  })
})
