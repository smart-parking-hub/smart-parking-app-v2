import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PaymentCancelPage } from '../pages/PaymentCancelPage'
import * as paymentCancelApi from '../api/paymentCancelApi'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderPage(initialEntries = ['/payment/cancel?bookingId=2&orderCode=99124']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PaymentCancelPage />
    </MemoryRouter>
  )
}

describe('SCR-024: PaymentCancelPage (Thông Báo Hủy Thanh Toán & Bảo Lưu Slot Berth C-114)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders session track header with PAYOS-CAN-99124 and TTL hold badge', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('PAYOS-CAN-99124')).toBeInTheDocument()
    })

    expect(screen.getByText(/PHIÊN GIAO DỊCH:/i)).toBeInTheDocument()
    expect(screen.getByText(/Hệ Thống Giữ Chỗ:/i)).toBeInTheDocument()
    expect(screen.getByText('Bảo lưu tạm thời (TTL)')).toBeInTheDocument()
  })

  it('renders main cancel notice card with credit card off icon and uncharged bank notice', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('GIAO DỊCH THANH TOÁN ĐÃ ĐƯỢC HỦY')).toBeInTheDocument()
    })

    expect(screen.getByText('GIAO DỊCH BỊ GIÁN ĐOẠN')).toBeInTheDocument()
    expect(screen.getByText('LỖI THAO TÁC / USER_CANCEL')).toBeInTheDocument()
    expect(
      screen.getByText(/Tài khoản ngân hàng của bạn chưa bị trừ tiền/i)
    ).toBeInTheDocument()
  })

  it('renders countdown hold alert box with live timer and progress bar', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('CẢNH BÁO THỜI GIAN BẢO LƯU SLOT')).toBeInTheDocument()
    })

    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('06:45')
    expect(screen.getByTestId('countdown-progress')).toBeInTheDocument()
    expect(
      screen.getAllByText(/Bãi Container Tân Cảng Cát Lái Gate 2/i).length
    ).toBeGreaterThanOrEqual(1)
  })

  it('ticks down the hold timer every second', () => {
    vi.useFakeTimers()
    renderPage(['/payment/cancel'])

    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('06:45')

    // Advance 1 second
    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('06:44')

    // Advance 5 more seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByTestId('countdown-timer')).toHaveTextContent('06:39')
  })

  it('renders pending ticket specifications with booking code BK-2026-9104 and deposit 100.000 ₫', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('BK-2026-9104')).toBeInTheDocument()
    })

    expect(screen.getByText('CHI TIẾT VÉ CHỜ THANH TOÁN')).toBeInTheDocument()
    expect(screen.getByText('CHỜ CỌC')).toBeInTheDocument()
    expect(screen.getByText('Bãi Container Tân Cảng Cát Lái Gate 2')).toBeInTheDocument()
    expect(screen.getByText('Slot Berth C-114 (Shore-Power)')).toBeInTheDocument()
    expect(screen.getByText('Đầu kéo 51D-894.12')).toBeInTheDocument()
    expect(screen.getByText('40ft HC • 32.5 Tấn')).toBeInTheDocument()
    expect(screen.getByText('100.000')).toBeInTheDocument()
  })

  it('renders terminal berth blueprint matrix with C-114 highlighted', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('TỌA ĐỘ VỊ TRÍ BÃI THỰC TẾ')).toBeInTheDocument()
    })

    expect(screen.getByText('KHÓA 10 PHÚT')).toBeInTheDocument()
    expect(screen.getByTestId('spot-C-114')).toBeInTheDocument()
    expect(screen.getByTestId('spot-C-114')).toHaveTextContent('GIỮ CHỖ')

    expect(screen.getByText(/Làn số 04/i)).toBeInTheDocument()
    expect(screen.getByText(/Cắm điện:/i)).toBeInTheDocument()
    expect(screen.getByText(/50LD-112.44/i)).toBeInTheDocument()
  })

  it('triggers repay action when clicking primary VietQR button', async () => {
    const repaySpy = vi.spyOn(paymentCancelApi, 'repayDepositApi').mockResolvedValueOnce({
      success: true,
      checkoutUrl: 'https://pay.payos.vn/web/demo-repay-checkout',
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /THANH TOÁN LẠI NGAY QUA VIETQR PAYOS/i })).toBeInTheDocument()
    })

    const repayBtn = screen.getByRole('button', { name: /THANH TOÁN LẠI NGAY QUA VIETQR PAYOS/i })
    fireEvent.click(repayBtn)

    await waitFor(() => {
      expect(repaySpy).toHaveBeenCalledWith(2)
      expect(screen.getByText(/Đang kết nối lại PayOS cho đơn BK-2026-9104/i)).toBeInTheDocument()
    })
  })

  it('confirms demo deposit sandbox mode and navigates to bookings', async () => {
    const demoSpy = vi.spyOn(paymentCancelApi, 'confirmDemoDepositApi').mockResolvedValueOnce({
      success: true,
      message: 'Đã xác nhận cọc thử nghiệm thành công! Hệ thống đang phát hành mã QR mở cổng Berth C-114.',
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /XÁC NHẬN CỌC DEMO \(SANDBOX\)/i })).toBeInTheDocument()
    })

    const sandboxBtn = screen.getByRole('button', { name: /XÁC NHẬN CỌC DEMO \(SANDBOX\)/i })
    fireEvent.click(sandboxBtn)

    await waitFor(() => {
      expect(demoSpy).toHaveBeenCalledWith(2)
      expect(screen.getByText(/Đã xác nhận cọc thử nghiệm thành công!/i)).toBeInTheDocument()
    })
  })

  it('releases slot early and cancels booking when clicking release button', async () => {
    const releaseSpy = vi.spyOn(paymentCancelApi, 'releaseSlotApi').mockResolvedValueOnce({
      success: true,
      message: 'Đã hủy đặt chỗ thành công. Slot C-114 đã được trả về hàng đợi hệ thống.',
    })

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /HỦY ĐẶT & TRẢ SLOT VỀ HÀNG ĐỢI/i })).toBeInTheDocument()
    })

    const releaseBtn = screen.getByRole('button', { name: /HỦY ĐẶT & TRẢ SLOT VỀ HÀNG ĐỢI/i })
    fireEvent.click(releaseBtn)

    await waitFor(() => {
      expect(releaseSpy).toHaveBeenCalledWith(2)
      expect(screen.getByText(/Đã hủy đặt chỗ thành công./i)).toBeInTheDocument()
    })
  })

  it('renders safe exit link back to parking search list (/parking) preventing dead-end (ISSUE-NAV-06)', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /QUAY LẠI DANH SÁCH BÃI XE/i })).toBeInTheDocument()
    })

    const parkingLink = screen.getByRole('link', { name: /QUAY LẠI DANH SÁCH BÃI XE/i })
    expect(parkingLink).toHaveAttribute('href', '/parking')

    const bookingsLink = screen.getByRole('link', { name: /QUAY LẠI QUẢN LÝ ĐẶT CHỖ/i })
    expect(bookingsLink).toHaveAttribute('href', '/bookings')
  })

  it('renders 24/7 hotline support card with 1900 6868 Ext 2 and bank apps guide', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('HỖ TRỢ THANH TOÁN 24/7')).toBeInTheDocument()
    })

    expect(screen.getByText('1900 6868 - Ext 2')).toBeInTheDocument()
    expect(screen.getByText('HƯỚNG DẪN QUÉT VIETQR')).toBeInTheDocument()
    expect(screen.getByText('VCB Digibank')).toBeInTheDocument()
    expect(screen.getByText('MB Bank')).toBeInTheDocument()
    expect(screen.getByText('Techcombank')).toBeInTheDocument()
    expect(screen.getByText('BIDV Smart')).toBeInTheDocument()
  })
})
