import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantParkingLotDetailPage } from '../pages/MerchantParkingLotDetailPage'
import * as api from '../api/merchantParkingLotApi'

function renderPage(lotId = 1) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/merchant/parking-lots/${lotId}`]}>
        <Routes>
          <Route
            path="/merchant/parking-lots/:parkingLotId"
            element={<MerchantParkingLotDetailPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-030: MerchantParkingLotDetailPage (Chi tiết hồ sơ kỹ thuật bãi đỗ xe)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders all key sections when parking lot is APPROVED', async () => {
    renderPage(1)

    // Wait for data load
    await waitFor(() => {
      expect(
        screen.getByText('Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)'),
      ).toBeInTheDocument()
    })

    // 1. Breadcrumb and Approval Tag
    expect(screen.getByText(/VN-SGN-CLG2-09/)).toBeInTheDocument()
    expect(screen.getByText(/ĐÃ PHÊ DUYỆT \(APPROVED\)/)).toBeInTheDocument()

    // 2. Action buttons
    expect(screen.getByRole('button', { name: /Chỉnh Sửa Hồ Sơ/i })).toBeInTheDocument()
    const slotBtn = screen.getByRole('button', { name: /Cấu Hình Sức Chứa Slot/i })
    const priceBtn = screen.getByRole('button', { name: /Biểu Phí Niêm Yết/i })
    expect(slotBtn).not.toBeDisabled()
    expect(priceBtn).not.toBeDisabled()
    expect(screen.getByRole('button', { name: /TRẠM QUÉT QR BARIE/i })).toBeInTheDocument()

    // 3. Bento 4 metrics
    expect(screen.getByText(/Doanh Thu Tháng Này/i)).toBeInTheDocument()
    expect(screen.getByText(/82\.500\.000/)).toBeInTheDocument()
    expect(screen.getByText(/90\.0%/)).toBeInTheDocument()
    expect(screen.getByText(/CẢNH BÁO: BÃI SẮP ĐẦY TẢI VẬT LÝ/)).toBeInTheDocument()
    expect(screen.getByText(/4\.9/)).toBeInTheDocument()
    expect(screen.getByText(/0\.18s \/ xe/)).toBeInTheDocument()

    // 4. Core sections: Gallery, Capacity, Pricing, Live Telemetry
    expect(screen.getByText('Thư Viện Thực Tế Hạ Tầng Bãi Đỗ')).toBeInTheDocument()
    expect(screen.getByText('Phân Bổ Tải Trọng & Sức Chứa Slot')).toBeInTheDocument()
    expect(screen.getByText(/Container 40FT \/ 45FT Reefer/)).toBeInTheDocument()
    expect(screen.getByText('Biểu Phí Niêm Yết Đang Áp Dụng')).toBeInTheDocument()
    expect(screen.getByText('Giờ Cơ Bản')).toBeInTheDocument()
    expect(screen.getByText('Giám Sát Xe Đang Đỗ Thực Tế (Live Telemetry)')).toBeInTheDocument()
    expect(screen.getByText('51D-894.12')).toBeInTheDocument()
    expect(screen.getByText('60C-912.44')).toBeInTheDocument()
    expect(screen.getByText('QUÁ HẠN 15 PHÚT')).toBeInTheDocument()

    // 5. Right column: GPS, Amenities, Contacts
    expect(screen.getByText('Tọa Độ GPS & Luồng Xe')).toBeInTheDocument()
    expect(screen.getByText('Tiện Ích Thực Tế Tại Bến')).toBeInTheDocument()
    expect(screen.getByText('Bảo Vệ Tuần Tra 24/7')).toBeInTheDocument()
    expect(screen.getByText('Kênh Trực Ban Bãi Đỗ')).toBeInTheDocument()
    expect(screen.getByText('Lê Văn Thành')).toBeInTheDocument()
    expect(screen.getByText('1900 6868 (Nhánh 2)')).toBeInTheDocument()
  })

  it('enforces gatekeeper rules when parking lot is PENDING_APPROVAL', async () => {
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockResolvedValueOnce({
      ...api.fallbackMerchantLotDetailData,
      status: 'PENDING_APPROVAL',
    })

    renderPage(3)

    await waitFor(() => {
      expect(screen.getByText(/ĐANG CHỜ DUYỆT \(PENDING\)/)).toBeInTheDocument()
    })

    // Slot & Pricing buttons should be disabled for unapproved yards
    const slotBtn = screen.getByRole('button', { name: /Cấu Hình Sức Chứa Slot/i })
    const priceBtn = screen.getByRole('button', { name: /Biểu Phí Niêm Yết/i })
    expect(slotBtn).toBeDisabled()
    expect(priceBtn).toBeDisabled()

    // Status banner should explain admin review process
    expect(
      screen.getByText(/Hồ sơ bãi đỗ đang trong quá trình thẩm định của Ban Quản Trị Hệ Thống/i),
    ).toBeInTheDocument()
  })

  it('supports lightbox opening and closing on image click', async () => {
    const user = userEvent.setup()
    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText('Trạm Cổng Barie ALPR Thông Minh')).toBeInTheDocument()
    })

    // Click on image container
    const coverTitle = screen.getByText('Trạm Cổng Barie ALPR Thông Minh')
    await user.click(coverTitle)

    // Lightbox should display the image with index indicator
    await waitFor(() => {
      expect(screen.getByText(/1 \/ 4/)).toBeInTheDocument()
    })

    // Close lightbox
    const closeBtn = screen.getByRole('button', { name: 'Đóng xem ảnh' })
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText(/1 \/ 4/)).not.toBeInTheDocument()
    })
  })

  it('handles image upload properly and shows feedback toast', async () => {
    const user = userEvent.setup()
    vi.spyOn(api, 'uploadAdditionalLotImages').mockResolvedValueOnce([
      {
        id: 999,
        url: 'blob:http://localhost/new-image.jpg',
        title: 'new-image.jpg',
        subtitle: '120 KB · Tải lên mới',
        isCover: false,
      },
    ])

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText('Thư Viện Thực Tế Hạ Tầng Bãi Đỗ')).toBeInTheDocument()
    })

    const uploadBtn = screen.getByRole('button', { name: /Tải thêm ảnh mới/i })
    expect(uploadBtn).toBeInTheDocument()

    // Trigger file upload via hidden input
    const file = new File(['dummy content'], 'new-image.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByText(/Đã tải lên thành công 1 ảnh hạ tầng thực tế/i)).toBeInTheDocument()
    })
  })

  it('renders error state and retry button when fetching fails', async () => {
    vi.spyOn(api, 'fetchMerchantParkingLotDetail').mockRejectedValueOnce(
      new Error('Network error'),
    )

    renderPage(999)

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy hồ sơ bãi đỗ xe')).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Thử lại/i })).toBeInTheDocument()
  })
})
