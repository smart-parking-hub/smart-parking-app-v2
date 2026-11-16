import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CameraSecurityNotice } from '../components/CameraSecurityNotice'

describe('CameraSecurityNotice (SP-S3-INT-04)', () => {
  it('renders W3C Secure Context HTTPS requirement warning for mobile users', () => {
    render(<CameraSecurityNotice currentOrigin="http://192.168.1.15:3000" />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(
      screen.getByText('Yêu cầu kết nối bảo mật HTTPS để mở Camera trên Di động'),
    ).toBeInTheDocument()
    expect(screen.getByText(/W3C Secure Context/i)).toBeInTheDocument()
    expect(screen.getByText(/http:\/\/192\.168\.1\.15:3000/)).toBeInTheDocument()
    expect(screen.getByText(/npm run dev:https/)).toBeInTheDocument()
  })

  it('provides a button to jump directly to manual booking code input', () => {
    const handleFocus = vi.fn()
    render(
      <CameraSecurityNotice
        currentOrigin="http://192.168.1.15:3000"
        onFocusManualInput={handleFocus}
      />,
    )

    const btn = screen.getByRole('button', {
      name: /Nhập mã đặt chỗ thủ công bên dưới/i,
    })
    expect(btn).toBeInTheDocument()
    fireEvent.click(btn)
    expect(handleFocus).toHaveBeenCalledTimes(1)
  })

  it('omits local IP hint when accessed via standard localhost', () => {
    render(<CameraSecurityNotice currentOrigin="http://localhost:3000" />)

    expect(
      screen.queryByText(/Bạn đang truy cập qua IP nội bộ/),
    ).not.toBeInTheDocument()
  })
})
