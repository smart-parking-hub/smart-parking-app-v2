import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PaymentReturnPage } from '../pages/PaymentReturnPage'
import * as paymentReturnApi from '../api/paymentReturnApi'

function renderPage(initialEntries = ['/payment/success?orderCode=994120&status=PAID'], mode: 'success' | 'cancel' = 'success') {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PaymentReturnPage mode={mode} />
    </MemoryRouter>
  )
}

describe('SCR-023: PaymentReturnPage (Xác Nhận & Đồng Bộ Kết Quả Thanh Toán PayOS)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders full success verification hub with telemetry strip, hero, manifest, and QR pass', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Giao Dịch Thanh Toán Thành Công!')).toBeInTheDocument()
    })

    // Telemetry strip
    expect(screen.getByText('ĐỒNG BỘ CỔNG THANH TOÁN QUỐC GIA PAYOS')).toBeInTheDocument()
    expect(screen.getByText('0.18s')).toBeInTheDocument()
    expect(screen.getByText('PAID_VERIFIED')).toBeInTheDocument()

    // Hero details
    expect(screen.getByText(/XÁC THỰC MẬT MÃ SHA-256 THÀNH CÔNG/i)).toBeInTheDocument()
    expect(screen.getByText('TXN-PAYOS-994120')).toBeInTheDocument()
    expect(screen.getByText('VIETQR 247')).toBeInTheDocument()
    expect(screen.getByText('MBBANK (ICB/9704)')).toBeInTheDocument()
    expect(screen.getByText('100.000 ₫')).toBeInTheDocument()

    // QR card
    expect(screen.getByText('MÃ QR MỞ BARIE TỰ ĐỘNG')).toBeInTheDocument()
    expect(screen.getByText(/Quét tại đầu đọc trụ làn 02/i)).toBeInTheDocument()
    expect(screen.getByText('51D-89412-C114')).toBeInTheDocument()
  })

  it('renders spot logistics manifest with Berth C-114, reefer 3-phase, vehicle plates, and guaranteed deposit', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('BK-2026-9081')).toBeInTheDocument()
    })

    expect(screen.getByText('BERTH GUARANTEED')).toBeInTheDocument()
    expect(screen.getByText('Bãi Tân Cảng Cát Lái - Gate 2')).toBeInTheDocument()
    expect(screen.getByText(/Đường Nguyễn Thị Định, P. Cát Lái/i)).toBeInTheDocument()
    expect(screen.getByText('Berth C-114')).toBeInTheDocument()
    expect(screen.getByText('Trạm Sạc Reefer 380V / 3 Pha')).toBeInTheDocument()
    expect(screen.getByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText(/Rơ-moóc: 51R-024.89/i)).toBeInTheDocument()
    expect(screen.getByText('14:15 Hôm nay (18/02/2026)')).toBeInTheDocument()
    expect(screen.getByText('100.000 ₫ (ĐÃ THU)')).toBeInTheDocument()
  })

  it('renders 3-step gate arrival SOP protocol with correct guidelines', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('QUY TRÌNH 3 BƯỚC CHECK-IN TẠI CỔNG BARIE TÂN CẢNG')).toBeInTheDocument()
    })

    // Step 1
    expect(screen.getByText('BƯỚC 01')).toBeInTheDocument()
    expect(screen.getByText('Tiến vào Làn Barie Số 02')).toBeInTheDocument()
    expect(screen.getByText(/Chạy xe vào đúng Làn chuyên dụng Container/i)).toBeInTheDocument()

    // Step 2
    expect(screen.getByText('BƯỚC 02')).toBeInTheDocument()
    expect(screen.getByText('Nhận diện AI ALPR hoặc Quét QR')).toBeInTheDocument()
    expect(screen.getByText(/Camera AI tự động đọc biển số 51D-894.12/i)).toBeInTheDocument()

    // Step 3
    expect(screen.getByText('BƯỚC 03')).toBeInTheDocument()
    expect(screen.getByText('Barie Tự Nâng & Đến Berth C-114')).toBeInTheDocument()
    expect(screen.getByText(/Cần chắn mở tự động/i)).toBeInTheDocument()
  })

  it('simulates offline QR ticket download and provides visual feedback', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('TẢI VÉ QR VỀ MÁY (PNG OFFLINE)')).toBeInTheDocument()
    })

    const downloadBtn = screen.getByText('TẢI VÉ QR VỀ MÁY (PNG OFFLINE)')
    fireEvent.click(downloadBtn)

    expect(screen.getByText('ĐÃ TẢI XUỐNG VÉ OFFLINE (PNG)')).toBeInTheDocument()
  })

  it('simulates PDF receipt generation and download', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('BIÊN LAI ĐIỆN TỬ (PDF)')).toBeInTheDocument()
    })

    const pdfBtn = screen.getByText('BIÊN LAI ĐIỆN TỬ (PDF)')
    fireEvent.click(pdfBtn)

    expect(screen.getByText('ĐANG KẾT XUẤT PDF...')).toBeInTheDocument()
  })

  it('renders cancelled payment state when mode is cancel or URL has cancel=true', async () => {
    renderPage(['/payment/cancel?cancel=true&status=CANCELLED'], 'cancel')

    await waitFor(() => {
      expect(screen.getByText('Đã Hủy Giao Dịch Thanh Toán')).toBeInTheDocument()
    })

    expect(screen.getByText(/Bạn đã hủy thanh toán trên cổng PayOS/i)).toBeInTheDocument()
    expect(screen.getByText('VỀ ĐẶT CHỖ CỦA TÔI')).toBeInTheDocument()
  })

  it('renders cancelled state when URL has status=CANCELLED even in success mode', async () => {
    renderPage(['/payment/success?status=CANCELLED'], 'success')

    await waitFor(() => {
      expect(screen.getByText('Đã Hủy Giao Dịch Thanh Toán')).toBeInTheDocument()
    })
  })

  it('renders pending state and allows driver to confirm demo deposit to unlock QR pass', async () => {
    vi.spyOn(paymentReturnApi, 'syncPayOSPaymentApi').mockResolvedValueOnce({
      ...paymentReturnApi.fallbackReturnManifest,
      status: 'PENDING',
    })

    renderPage(['/payment/success?bookingId=102&orderCode=888999'])

    await waitFor(() => {
      expect(screen.getByText('Chưa Ghi Nhận Xong Giao Dịch')).toBeInTheDocument()
    })

    expect(
      screen.getByText(/Cổng PayOS chưa hoàn tất thanh toán/i)
    ).toBeInTheDocument()

    const demoBtn = screen.getByText('Xác nhận thanh toán demo (Kích hoạt QR ngay)')
    expect(demoBtn).toBeInTheDocument()

    fireEvent.click(demoBtn)

    await waitFor(() => {
      expect(screen.getByText('Giao Dịch Thanh Toán Thành Công!')).toBeInTheDocument()
    })
  })

  it('handles sync error and retries sync on user click', async () => {
    const syncSpy = vi.spyOn(paymentReturnApi, 'syncPayOSPaymentApi')
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ...paymentReturnApi.fallbackReturnManifest,
        status: 'PAID_VERIFIED',
      })

    renderPage(['/payment/success?orderCode=999'])

    await waitFor(() => {
      expect(screen.getByText('Không Đồng Bộ Được Với PayOS')).toBeInTheDocument()
    })

    const retryBtn = screen.getByText('Thử đồng bộ lại')
    fireEvent.click(retryBtn)

    await waitFor(() => {
      expect(syncSpy).toHaveBeenCalledTimes(2)
      expect(screen.getByText('Giao Dịch Thanh Toán Thành Công!')).toBeInTheDocument()
    })
  })

  it('renders hotline support strip with 1900 6868', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Cần hỗ trợ Barie khẩn cấp tại cổng?')).toBeInTheDocument()
    })

    expect(screen.getByText('1900 6868 (Phím 1)')).toBeInTheDocument()
  })
})
