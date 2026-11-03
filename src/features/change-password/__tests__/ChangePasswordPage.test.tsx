import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChangePasswordPage } from '../pages/ChangePasswordPage'
import * as changePasswordApi from '../api/changePasswordApi'

function renderPage() {
  return render(
    <BrowserRouter>
      <ChangePasswordPage />
    </BrowserRouter>
  )
}

describe('SCR-022 ChangePasswordPage (Đổi mật khẩu bảo mật tài xế)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders command header, Fretrix badge, breadcrumb, and 95-day warning badge', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Đổi Mật Khẩu Đăng Nhập')).toBeInTheDocument()
    })

    expect(screen.getByText(/BẢO MẬT TÀI KHOẢN VẬN HÀNH/i)).toBeInTheDocument()
    expect(screen.getByText(/XÁC THỰC HAI LỚP 2FA/i)).toBeInTheDocument()
    expect(screen.getByText(/MÃ BẢO VỆ DRIVER-ID #8839/i)).toBeInTheDocument()
    expect(screen.getByText('FRETRIX PROTOCOL V4.2')).toBeInTheDocument()
    expect(screen.getByText(/YÊU CẦU ĐỔI ĐỊNH KỲ \(95 NGÀY\)/i)).toBeInTheDocument()
    expect(screen.getByText('TIÊU CHUẨN LOẠI 1 (COMMERCIAL TRUCK)')).toBeInTheDocument()
  })

  it('renders synchronized account operations sidebar, 3 Fretrix rules, 2 active devices, and hotline', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('CẤU HÌNH TÀI KHOẢN VẬN HÀNH')).toBeInTheDocument()
    })

    // Navigation links & active state
    expect(screen.getByText('Thông tin cá nhân & Giấy phép')).toBeInTheDocument()
    expect(screen.getByText('Đội xe của tôi')).toBeInTheDocument()
    expect(screen.getByText('3 XE')).toBeInTheDocument()
    expect(screen.getByText('Lịch sử cước & Hóa đơn VAT')).toBeInTheDocument()
    expect(screen.getByText('18 HÓA ĐƠN')).toBeInTheDocument()
    expect(screen.getByText('Đổi mật khẩu bảo mật')).toBeInTheDocument()
    expect(screen.getByText('Thiết lập thông báo hệ thống')).toBeInTheDocument()

    // Verify links to related portals
    const profileLink = screen.getByText('Thông tin cá nhân & Giấy phép').closest('a')
    expect(profileLink).toHaveAttribute('href', '/profile')
    const vehiclesLink = screen.getByText('Đội xe của tôi').closest('a')
    expect(vehiclesLink).toHaveAttribute('href', '/vehicles')
    const paymentsLink = screen.getByText('Lịch sử cước & Hóa đơn VAT').closest('a')
    expect(paymentsLink).toHaveAttribute('href', '/payments')

    // 3 Fretrix rules
    expect(screen.getByText('Quy chuẩn Fretrix')).toBeInTheDocument()
    expect(screen.getByText(/Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa/i)).toBeInTheDocument()
    expect(screen.getByText(/Không sử dụng lại 3 mật khẩu/i)).toBeInTheDocument()
    expect(screen.getByText(/Tự động đăng xuất trên các thiết bị khác/i)).toBeInTheDocument()

    // 2 active devices
    expect(screen.getByText('Samsung Galaxy S23 Ultra')).toBeInTheDocument()
    expect(screen.getByText(/Tablet Cabin Xe #51D-892.44/i)).toBeInTheDocument()

    // Hotline
    expect(screen.getByText('1900 6868')).toBeInTheDocument()
  })

  it('opens NotificationSettingsModal when clicking Thiết lập thông báo hệ thống', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Thiết lập thông báo hệ thống')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Thiết lập thông báo hệ thống'))

    expect(screen.getByText('Thiết Lập Thông Báo Hệ Thống')).toBeInTheDocument()
    expect(screen.getByText('KÊNH TRỰC BAN & ĐIỀU PHỐI BÃI')).toBeInTheDocument()
  })

  it('toggles password visibility on all 3 input fields', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')).toBeInTheDocument()
    })

    const currInput = screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng') as HTMLInputElement
    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn') as HTMLInputElement
    const confInput = screen.getByPlaceholderText('Nhập lại chính xác mật khẩu mới') as HTMLInputElement

    expect(currInput.type).toBe('password')
    expect(newInput.type).toBe('password')
    expect(confInput.type).toBe('password')

    // Click toggle buttons
    const toggleCurr = screen.getByLabelText('Ẩn hiện mật khẩu hiện tại')
    const toggleNew = screen.getByLabelText('Ẩn hiện mật khẩu mới')
    const toggleConf = screen.getByLabelText('Ẩn hiện mật khẩu xác nhận')

    fireEvent.click(toggleCurr)
    expect(currInput.type).toBe('text')

    fireEvent.click(toggleNew)
    expect(newInput.type).toBe('text')

    fireEvent.click(toggleConf)
    expect(confInput.type).toBe('text')

    // Toggle back
    fireEvent.click(toggleCurr)
    expect(currInput.type).toBe('password')
  })

  it('dynamically calculates password strength and updates 4 criteria items', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')).toBeInTheDocument()
    })

    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')

    // Initial: 'Chưa nhập'
    expect(screen.getByText('Chưa nhập')).toBeInTheDocument()

    // Step 1: Weak (only length)
    fireEvent.change(newInput, { target: { value: 'abcdefgh' } })
    expect(screen.getByText('Yếu')).toBeInTheDocument()

    // Step 2: Medium (length + uppercase)
    fireEvent.change(newInput, { target: { value: 'Abcdefgh' } })
    expect(screen.getByText('Trung bình')).toBeInTheDocument()

    // Step 3: Fair (length + uppercase + number)
    fireEvent.change(newInput, { target: { value: 'Abcdefg1' } })
    expect(screen.getByText('Khá')).toBeInTheDocument()

    // Step 4: Strong (length + uppercase + number + special)
    fireEvent.change(newInput, { target: { value: 'Fretrix@2026' } })
    expect(screen.getByText('Mạnh (Chuẩn Fretrix)')).toBeInTheDocument()
  })

  it('provides realtime match feedback between new password and confirmation', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')).toBeInTheDocument()
    })

    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')
    const confInput = screen.getByPlaceholderText('Nhập lại chính xác mật khẩu mới')

    fireEvent.change(newInput, { target: { value: 'Fretrix@2026' } })
    fireEvent.change(confInput, { target: { value: 'WrongPass' } })

    expect(screen.getByText('Mật khẩu xác nhận chưa trùng khớp')).toBeInTheDocument()

    fireEvent.change(confInput, { target: { value: 'Fretrix@2026' } })
    expect(screen.getByText('Khớp 100% với mật khẩu mới đã nhập')).toBeInTheDocument()
  })

  it('validates required fields before submitting form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /CẬP NHẬT MẬT KHẨU MỚI/i })).toBeInTheDocument()
    })

    const submitBtn = screen.getByRole('button', { name: /CẬP NHẬT MẬT KHẨU MỚI/i })
    const currInput = screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')
    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')
    const confInput = screen.getByPlaceholderText('Nhập lại chính xác mật khẩu mới')

    // Submit with empty current pass
    fireEvent.click(submitBtn)
    expect(screen.getByText('Vui lòng nhập mật khẩu hiện tại.')).toBeInTheDocument()

    // Fill current pass but weak new pass
    fireEvent.change(currInput, { target: { value: 'OldPass123' } })
    fireEvent.change(newInput, { target: { value: 'weak' } })
    fireEvent.click(submitBtn)
    expect(
      screen.getByText(/Mật khẩu mới chưa đạt chuẩn bảo mật Fretrix/i)
    ).toBeInTheDocument()

    // Fill strong new pass but mismatched confirm
    fireEvent.change(newInput, { target: { value: 'Fretrix@2026' } })
    fireEvent.change(confInput, { target: { value: 'Mismatch@2026' } })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Mật khẩu xác nhận không trùng khớp.')).toBeInTheDocument()
  })

  it('submits valid password change, calls API, displays success banner and resets form', async () => {
    const changeSpy = vi.spyOn(changePasswordApi, 'changePasswordApi').mockResolvedValue()

    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')).toBeInTheDocument()
    })

    const currInput = screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')
    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')
    const confInput = screen.getByPlaceholderText('Nhập lại chính xác mật khẩu mới')
    const submitBtn = screen.getByRole('button', { name: /CẬP NHẬT MẬT KHẨU MỚI/i })

    fireEvent.change(currInput, { target: { value: 'Driver@123' } })
    fireEvent.change(newInput, { target: { value: 'SecureTruck#2026' } })
    fireEvent.change(confInput, { target: { value: 'SecureTruck#2026' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(changeSpy).toHaveBeenCalledWith({
        currentPassword: 'Driver@123',
        newPassword: 'SecureTruck#2026',
        logoutOthers: true,
      })
      expect(screen.getByText('Mật khẩu đã cập nhật thành công')).toBeInTheDocument()
    })

    // Verify fields reset
    expect((currInput as HTMLInputElement).value).toBe('')
    expect((newInput as HTMLInputElement).value).toBe('')
    expect((confInput as HTMLInputElement).value).toBe('')
  })

  it('displays backend error message when current password is wrong', async () => {
    vi.spyOn(changePasswordApi, 'changePasswordApi').mockRejectedValue(
      new Error('Mật khẩu hiện tại không chính xác!')
    )

    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')).toBeInTheDocument()
    })

    const currInput = screen.getByPlaceholderText('Nhập mật khẩu đang sử dụng')
    const newInput = screen.getByPlaceholderText('Nhập mật khẩu mới an toàn')
    const confInput = screen.getByPlaceholderText('Nhập lại chính xác mật khẩu mới')
    const submitBtn = screen.getByRole('button', { name: /CẬP NHẬT MẬT KHẨU MỚI/i })

    fireEvent.change(currInput, { target: { value: 'WrongPassword' } })
    fireEvent.change(newInput, { target: { value: 'SecureTruck#2026' } })
    fireEvent.change(confInput, { target: { value: 'SecureTruck#2026' } })

    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText('Mật khẩu hiện tại không chính xác!')).toBeInTheDocument()
    })
  })

  it('opens SMS recovery modal when clicking "Quên mật khẩu hiện tại?" or "Khôi phục qua SMS OTP"', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Khôi phục qua SMS OTP')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Khôi phục qua SMS OTP'))

    expect(screen.getByText('Khôi Phục Mật Khẩu Qua SMS OTP')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0909 128 374')).toBeInTheDocument()

    // Send OTP
    const sendOtpBtn = screen.getByRole('button', { name: /Gửi Mã Xác Thực OTP/i })
    fireEvent.click(sendOtpBtn)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('VD: 884920')).toBeInTheDocument()
    })
  })

  it('renders TerminalQrSyncBanner with auto-sync indicator', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Đồng bộ mã QR Cổng Barie Tự Động')).toBeInTheDocument()
    })

    expect(screen.getByText('AUTO-SYNC ON')).toBeInTheDocument()
    expect(
      screen.getByText(/mã Barie QR Pass lưu trữ ngoại tuyến trên thiết bị sẽ được ký số mã hóa lại/i)
    ).toBeInTheDocument()
  })
})
