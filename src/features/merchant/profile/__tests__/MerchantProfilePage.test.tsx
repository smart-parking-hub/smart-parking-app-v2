import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { MerchantLayout } from '@/layouts/MerchantLayout'
import { MerchantProfilePage } from '../pages/MerchantProfilePage'
import { fallbackMerchantProfile } from '../api/merchantProfileApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}))

function renderMerchantProfilePage(initialEntries = ['/merchant/profile']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/merchant" element={<MerchantLayout />}>
            <Route path="profile" element={<MerchantProfilePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-027: MerchantProfilePage (Hồ Sơ Doanh Nghiệp Chủ Bãi)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        data: fallbackMerchantProfile,
      },
    })
    vi.mocked(apiClient.put).mockResolvedValue({
      data: {
        data: {
          ...fallbackMerchantProfile,
          fullName: 'Lê Văn Thành (Đã Sửa)',
        },
      },
    })
  })

  it('renders merchant layout, header ribbon with #MCH-88219 and ISO 27001 eKYC badge', async () => {
    renderMerchantProfilePage()

    // 1. Sidebar Brand & Navigation
    await waitFor(() => {
      expect(screen.getAllByText(/SMARTTRUCK/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Hồ sơ bến bãi')).toBeInTheDocument()
    })

    // 2. Top Header Ribbon
    await waitFor(() => {
      expect(screen.getByText('Hồ Sơ Doanh Nghiệp Chủ Bãi')).toBeInTheDocument()
      expect(screen.getByText(/MERCHANT_ID: #MCH-88219/i)).toBeInTheDocument()
      expect(screen.getByText(/ĐÃ XÁC THỰC DOANH NGHIỆP E-KYC/i)).toBeInTheDocument()
      expect(screen.getByText(/TIÊU CHUẨN ISO 27001 • CỤC ĐKVN/i)).toBeInTheDocument()
    })
  })

  it('renders left column summary cards: Corporate Identity, Available Revenue Balance, and Tax Policy', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      // Identity Card
      expect(
        screen.getByText('Công ty TNHH Tiếp Vận & Kho Bãi Tân Cảng Sài Gòn'),
      ).toBeInTheDocument()
      expect(screen.getByText('0908 123 456')).toBeInTheDocument()
      expect(screen.getByText('OTP VERIFIED')).toBeInTheDocument()
      expect(screen.getByText('0314892719')).toBeInTheDocument()
      expect(screen.getByText('03 Bãi Depot Cát Lái & Hải Phòng')).toBeInTheDocument()
      expect(screen.getByText(/Hạn kiểm duyệt định kỳ:/i)).toBeInTheDocument()

      // Revenue Balance Card
      expect(screen.getByText(/Ví Doanh Thu Sẵn Sàng Rút/i)).toBeInTheDocument()
      expect(screen.getByText('42.800.000')).toBeInTheDocument()
      expect(screen.getByText(/25.000.000 ₫/i)).toBeInTheDocument()
      expect(screen.getByText(/TẠO YÊU CẦU RÚT TIỀN NGAY/i)).toBeInTheDocument()

      // Tax Policy Card
      expect(screen.getByText(/Chính Sách Cắt Cước & Thuế/i)).toBeInTheDocument()
      expect(screen.getByText(/5.0%/i)).toBeInTheDocument()
    })
  })

  it('renders right column 3 operational blocks: Legal Info, Banking Profile, and Notification Channels', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      // Block 01
      expect(screen.getByText(/Thông Tin Pháp Lý Doanh Nghiệp/i)).toBeInTheDocument()
      expect(screen.getByText(/DỮ LIỆU ĐÃ KHÓA THẨM ĐỊNH/i)).toBeInTheDocument()
      expect(screen.getByText('GPKD_TanCang_2018.pdf')).toBeInTheDocument()
      expect(screen.getByText('ChungNhan_PCCC_CatLai.pdf')).toBeInTheDocument()

      // Block 02
      expect(screen.getByText(/Tài Khoản Ngân Hàng Thụ Hưởng Rút Tiền/i)).toBeInTheDocument()
      expect(screen.getByText(/VIETQR NAPAS247/i)).toBeInTheDocument()
      expect(screen.getByText(/MB Bank/i)).toBeInTheDocument()

      // Block 03
      expect(screen.getByText(/Cấu Hình Kênh Nhận Thông Báo Vận Hành/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Web Push: Âm thanh còi xe tải khi có khách đặt mới/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/SMS Khẩn cấp 24\/7: Cảnh báo bãi đỗ chạm ngưỡng 95%/i),
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Zalo Official Account: Nhận bảng kê đối soát doanh thu mỗi 23h30/i),
      ).toBeInTheDocument()
    })
  })

  it('toggles masking on bank account number between masked and full value', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      expect(screen.getByText(/Tài Khoản Ngân Hàng Thụ Hưởng Rút Tiền/i)).toBeInTheDocument()
    })

    const bankInput = document.getElementById('bank-acc-input') as HTMLInputElement
    const toggleBtn = document.getElementById('btn-toggle-mask')

    expect(bankInput).not.toBeNull()
    expect(toggleBtn).not.toBeNull()

    // 1. Initial State: Masked
    expect(bankInput.value).toBe('0882****9999')
    expect(screen.getByText('Hiển thị đầy đủ')).toBeInTheDocument()

    // 2. Click Reveal
    fireEvent.click(toggleBtn!)
    expect(bankInput.value).toBe('0882199999999')
    expect(screen.getByText('Ẩn số tài khoản')).toBeInTheDocument()

    // 3. Click Mask again
    fireEvent.click(toggleBtn!)
    expect(bankInput.value).toBe('0882****9999')
    expect(screen.getByText('Hiển thị đầy đủ')).toBeInTheDocument()
  })

  it('opens fast withdrawal modal and simulates cashout via Napas247', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      expect(screen.getByText(/TẠO YÊU CẦU RÚT TIỀN NGAY/i)).toBeInTheDocument()
    })

    const openBtn = screen.getByText(/TẠO YÊU CẦU RÚT TIỀN NGAY/i)
    fireEvent.click(openBtn)

    // Modal appears
    await waitFor(() => {
      expect(screen.getByText(/Yêu Cầu Rút Tiền Về MB Bank/i)).toBeInTheDocument()
      expect(screen.getByText(/MB BANK • 0882199999999/i)).toBeInTheDocument()
    })

    // Click ALL button
    const allBtn = screen.getByText('TẤT CẢ')
    fireEvent.click(allBtn)

    // Click Confirm
    const confirmBtn = screen.getByText('Xác Nhận Rút Tiền Ngay')
    fireEvent.click(confirmBtn)

    // Modal closes and Napas toast displays
    await waitFor(() => {
      expect(
        screen.getByText(/Lệnh rút 42.800.000 ₫ đang được Napas247 xử lý tới MB Bank/i),
      ).toBeInTheDocument()
    })
  })

  it('toggles notification switches and triggers settings toast', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      expect(screen.getByText(/Cấu Hình Kênh Nhận Thông Báo Vận Hành/i)).toBeInTheDocument()
    })

    const hornSwitch = document.getElementById('toggle-web-horn') as HTMLInputElement
    expect(hornSwitch).not.toBeNull()
    expect(hornSwitch.checked).toBe(true)

    // Toggle horn switch off
    fireEvent.click(hornSwitch)
    expect(hornSwitch.checked).toBe(false)

    await waitFor(() => {
      expect(
        screen.getByText(/Cấu hình kênh thông báo & hồ sơ doanh nghiệp đã được lưu./i),
      ).toBeInTheDocument()
    })
  })

  it('submits updated profile and shows success feedback toast', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Lê Văn Thành')).toBeInTheDocument()
    })

    const saveBtn = document.getElementById('btn-save-profile')
    expect(saveBtn).not.toBeNull()

    fireEvent.click(saveBtn!)

    await waitFor(() => {
      expect(
        screen.getByText(/Đã lưu cập nhật hồ sơ doanh nghiệp thành công!/i),
      ).toBeInTheDocument()
    })
  })

  it('opens document preview modal on clicking preview button', async () => {
    renderMerchantProfilePage()

    await waitFor(() => {
      expect(screen.getByText('GPKD_TanCang_2018.pdf')).toBeInTheDocument()
    })

    const previewBtn = screen.getByLabelText('Xem tài liệu GPKD_TanCang_2018.pdf')
    fireEvent.click(previewBtn)

    await waitFor(() => {
      expect(screen.getByText(/Xem Trước Tài Liệu Pháp Lý/i)).toBeInTheDocument()
      expect(screen.getByText('Ký số CA Viettel')).toBeInTheDocument()
    })

    const closeBtn = screen.getByLabelText('Đóng xem trước')
    fireEvent.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText(/Xem Trước Tài Liệu Pháp Lý/i)).not.toBeInTheDocument()
    })
  })
})
