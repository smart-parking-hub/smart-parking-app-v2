import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChangePasswordModal } from '../components/ChangePasswordModal'

describe('ChangePasswordModal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ChangePasswordModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )
    expect(screen.queryByText('Đổi Mật Khẩu Bảo Mật')).not.toBeInTheDocument()
  })

  it('renders and validates input fields then calls onSave', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined)
    const handleClose = vi.fn()

    render(
      <ChangePasswordModal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
      />
    )

    expect(screen.getByText('Đổi Mật Khẩu Bảo Mật')).toBeInTheDocument()
    expect(screen.getByText('BẢO VỆ TÀI KHOẢN VẬN HÀNH')).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /Cập Nhật Mật Khẩu/i })
    
    // Attempt submit with empty current password
    fireEvent.click(submitBtn)
    expect(screen.getByText('Vui lòng nhập mật khẩu hiện tại.')).toBeInTheDocument()

    // Fill current password but short new password
    const currentInput = screen.getByLabelText(/Mật khẩu hiện tại/i)
    fireEvent.change(currentInput, { target: { value: 'Current123' } })
    const newInput = screen.getByLabelText(/^Mật khẩu mới/i)
    fireEvent.change(newInput, { target: { value: '123' } })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Mật khẩu mới phải có ít nhất 6 ký tự.')).toBeInTheDocument()

    // Fill new password but mismatched confirmation
    fireEvent.change(newInput, { target: { value: 'NewSecret123' } })
    const confirmInput = screen.getByLabelText(/Xác nhận mật khẩu mới/i)
    fireEvent.change(confirmInput, { target: { value: 'Different456' } })
    fireEvent.click(submitBtn)
    expect(screen.getByText('Mật khẩu xác nhận không khớp.')).toBeInTheDocument()

    // Match confirmation
    fireEvent.change(confirmInput, { target: { value: 'NewSecret123' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith('Current123', 'NewSecret123')
      expect(screen.getByText('Đổi mật khẩu thành công!')).toBeInTheDocument()
    })
  })
})
