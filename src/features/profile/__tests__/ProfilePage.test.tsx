import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProfilePage } from '../pages/ProfilePage'
import * as profileApi from '../api/profileApi'

function renderProfilePage() {
  return render(
    <BrowserRouter>
      <ProfilePage />
    </BrowserRouter>
  )
}

describe('SCR-021 ProfilePage (Hồ Sơ Bác Tài & Thông Tin Trực Ban)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders command header, breadcrumb, and live station status badge', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Hồ Sơ Bác Tài & Thông Tin Trực Ban')).toBeInTheDocument()
    })

    expect(screen.getByText(/TÀI KHOẢN VẬN HÀNH DRIVER OPS/i)).toBeInTheDocument()
    expect(screen.getByText(/ĐỊNH DANH ĐIỆN TỬ EKYC/i)).toBeInTheDocument()
    expect(screen.getByText(/CẢNG CÁT LÁI \(SP-PSA\)/i)).toBeInTheDocument()
  })

  it('renders driver identity card, rating, and 4 Bento KPI metrics', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Trần Quốc Tuấn')).toBeInTheDocument()
    })

    expect(screen.getByText('DRV-VTP-88412')).toBeInTheDocument()
    expect(screen.getByText('TRỰC BAN SẴN SÀNG')).toBeInTheDocument()
    expect(screen.getByText('4.95/5.0')).toBeInTheDocument()
    expect(screen.getByText('HẠNG FC CHUYÊN NGHIỆP')).toBeInTheDocument()

    // 4 Bento KPIs
    expect(screen.getByText('48')).toBeInTheDocument()
    expect(screen.getByText('Chuyến Hoàn Thành')).toBeInTheDocument()
    expect(screen.getByText('Vi Phạm Quá Giờ')).toBeInTheDocument()
    expect(screen.getByText('Check-in Đúng Hạn')).toBeInTheDocument()
    expect(screen.getByText('Sự Cố Khiếu Nại')).toBeInTheDocument()
  })

  it('renders sidebar navigation links and modal triggers', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Thông tin cá nhân & Giấy phép')).toBeInTheDocument()
    })

    expect(screen.getByText('Đội xe của tôi')).toBeInTheDocument()
    expect(screen.getByText('3 XE')).toBeInTheDocument()
    expect(screen.getByText('Lịch sử cước & Hóa đơn VAT')).toBeInTheDocument()
    expect(screen.getByText('18 HÓA ĐƠN')).toBeInTheDocument()
    expect(screen.getByText('Đổi mật khẩu bảo mật')).toBeInTheDocument()
    expect(screen.getByText('Thiết lập thông báo hệ thống')).toBeInTheDocument()
  })

  it('toggles CCCD masking between masked and full unmasked format', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('079088******')).toBeInTheDocument()
    })

    const toggleBtn = screen.getByRole('button', { name: /Hiện/i })
    expect(toggleBtn).toBeInTheDocument()

    // Click "Hiện" -> reveals unmasked number
    fireEvent.click(toggleBtn)
    expect(screen.getByText('079088019482')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ẩn/i })).toBeInTheDocument()

    // Click "Ẩn" -> masks again
    fireEvent.click(screen.getByRole('button', { name: /Ẩn/i }))
    expect(screen.getByText('079088******')).toBeInTheDocument()
  })

  it('edits address and saves profile with success toast notification', async () => {
    const updateSpy = vi.spyOn(profileApi, 'updateMyProfile').mockResolvedValue({
      ...profileApi.fallbackDriverProfile,
      address: 'Số 99 Đường Mai Chí Thọ, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh',
    })

    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByDisplayValue(/Phường Linh Trung/i)).toBeInTheDocument()
    })

    const addressInput = screen.getByDisplayValue(/Phường Linh Trung/i)
    fireEvent.change(addressInput, {
      target: { value: 'Số 99 Đường Mai Chí Thọ, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh' },
    })

    const saveBtn = screen.getByRole('button', { name: /LƯU THAY ĐỔI HỒ SƠ/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalled()
      expect(screen.getByText('Cập nhật hồ sơ thành công!')).toBeInTheDocument()
    })
  })

  it('resets modified form values back to profile defaults when clicking reset', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Trần Quốc Tuấn')).toBeInTheDocument()
    })

    const nameInput = screen.getByDisplayValue('Trần Quốc Tuấn')
    fireEvent.change(nameInput, { target: { value: 'Nguyễn Văn Test' } })
    expect(screen.getByDisplayValue('Nguyễn Văn Test')).toBeInTheDocument()

    const resetBtn = screen.getByRole('button', { name: /Khôi phục dữ liệu gốc/i })
    fireEvent.click(resetBtn)

    expect(screen.getByDisplayValue('Trần Quốc Tuấn')).toBeInTheDocument()
  })

  it('opens and submits ChangePasswordModal from sidebar nav', async () => {
    const passwordSpy = vi.spyOn(profileApi, 'changeMyPasswordApi').mockResolvedValue()

    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Đổi mật khẩu bảo mật')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Đổi mật khẩu bảo mật'))

    expect(screen.getByText('Đổi Mật Khẩu Bảo Mật')).toBeInTheDocument()
    expect(screen.getByText('BẢO VỆ TÀI KHOẢN VẬN HÀNH')).toBeInTheDocument()

    // Fill fields
    const currentInput = screen.getByLabelText(/Mật khẩu hiện tại/i)
    const newInput = screen.getByLabelText(/^Mật khẩu mới/i)
    const confirmInput = screen.getByLabelText(/Xác nhận mật khẩu mới/i)

    fireEvent.change(currentInput, { target: { value: 'CurrentPass123' } })
    fireEvent.change(newInput, { target: { value: 'NewSecret456' } })
    fireEvent.change(confirmInput, { target: { value: 'NewSecret456' } })

    const submitBtn = screen.getByRole('button', { name: /Cập Nhật Mật Khẩu/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(passwordSpy).toHaveBeenCalledWith('CurrentPass123', 'NewSecret456')
      expect(screen.getByText('Đổi mật khẩu thành công!')).toBeInTheDocument()
    })
  })

  it('opens NotificationSettingsModal from sidebar and toggles preferences', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Thiết lập thông báo hệ thống')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Thiết lập thông báo hệ thống'))

    expect(screen.getByText('Thiết Lập Thông Báo Hệ Thống')).toBeInTheDocument()
    expect(screen.getByText('Tin nhắn SMS thông báo slot bãi')).toBeInTheDocument()
    expect(screen.getByText('Thông báo đẩy ứng dụng di động')).toBeInTheDocument()

    const saveSettingsBtn = screen.getByRole('button', { name: /Lưu Thiết Lập/i })
    fireEvent.click(saveSettingsBtn)

    await waitFor(() => {
      expect(screen.getByText('Đã lưu cài đặt thông báo!')).toBeInTheDocument()
    })
  })

  it('opens AvatarUploadModal by clicking avatar edit button', async () => {
    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByTitle('Đổi ảnh đại diện')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTitle('Đổi ảnh đại diện'))

    expect(screen.getByText('Ảnh Định Danh eKYC')).toBeInTheDocument()
    expect(screen.getByText('Tải ảnh chụp chân dung mới')).toBeInTheDocument()

    const applyBtn = screen.getByRole('button', { name: /Cập Nhật Ảnh/i })
    fireEvent.click(applyBtn)

    await waitFor(() => {
      expect(screen.getByText('Cập nhật ảnh đại diện thành công!')).toBeInTheDocument()
    })
  })

  it('handles API error gracefully and loads fallback profile', async () => {
    vi.spyOn(profileApi, 'fetchMyProfile').mockRejectedValue(new Error('Network error'))

    renderProfilePage()

    await waitFor(() => {
      expect(screen.getByText('Trần Quốc Tuấn')).toBeInTheDocument()
    })

    expect(screen.getByText('Giấy phép lái xe Hạng FC')).toBeInTheDocument()
  })
})
