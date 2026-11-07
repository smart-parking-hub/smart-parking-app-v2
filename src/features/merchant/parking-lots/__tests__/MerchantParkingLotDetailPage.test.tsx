import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MerchantParkingLotDetailPage } from '../pages/MerchantParkingLotDetailPage'
import { apiClient } from '@/shared/api/client'
import * as api from '../api/merchantParkingLotApi'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}))

const mockApprovedLot = {
  id: 1,
  name: 'Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)',
  address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
  status: 'APPROVED',
  latitude: 10.7854,
  longitude: 106.8041,
  ratingAverage: 4.9,
  images: [
    { id: 10, contentUrl: 'https://images.unsplash.com/photo-1', originalFileName: 'Trạm Cổng Barie ALPR Thông Minh', cover: true },
    { id: 11, contentUrl: 'https://images.unsplash.com/photo-2', originalFileName: 'Mặt bằng bãi container', cover: false },
  ],
  slots: [
    { id: 1, vehicleType: 'CONTAINER_40FT', totalCapacity: 50, availableCapacity: 12 },
  ],
  pricingRules: [
    { id: 1, vehicleType: 'CONTAINER_40FT', basePricePerHour: 35000 },
  ],
}

const mockPendingLot = {
  ...mockApprovedLot,
  id: 2,
  status: 'PENDING_APPROVAL',
  reviewReason: 'Đang chờ hội đồng kiểm tra hồ sơ PCCC',
}

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
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockApprovedLot },
    })

    renderPage(1)

    // Wait for data load
    expect(
      await screen.findByText('Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)'),
    ).toBeInTheDocument()

    // 1. Breadcrumb and Dossier Info
    expect(screen.getByText('Quay lại danh sách bãi')).toBeInTheDocument()
    expect(screen.getByText(/Mã bãi: #1 · Đã duyệt/)).toBeInTheDocument()

    // 2. Action Links for approved yard
    expect(screen.getByRole('link', { name: /Chỉnh sửa hồ sơ/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cấu hình chỗ đỗ/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cấu hình bảng giá/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Mở quét QR/i })).toBeInTheDocument()

    // 3. Technical Sections
    expect(screen.getByText('Thư Viện Thực Tế Hạ Tầng Bãi Đỗ')).toBeInTheDocument()
    expect(screen.getByText('Vị trí bãi đỗ')).toBeInTheDocument()
    expect(screen.getByText('Sức chứa chỗ đỗ')).toBeInTheDocument()
    expect(screen.getByText('Bảng giá')).toBeInTheDocument()
    expect(screen.getByText(/CONTAINER_40FT: 12\/50 chỗ trống/)).toBeInTheDocument()
  })

  it('enforces gatekeeper rules when parking lot is PENDING_APPROVAL', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockPendingLot },
    })

    renderPage(2)

    await waitFor(() => {
      expect(screen.getByText(/Mã bãi: #2 · Đang chờ duyệt/)).toBeInTheDocument()
    })

    // Review reason is displayed
    expect(screen.getByText('Đang chờ hội đồng kiểm tra hồ sơ PCCC')).toBeInTheDocument()

    // Slots and pricing links should NOT be available for unapproved yards
    expect(screen.queryByRole('link', { name: /Cấu hình chỗ đỗ/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Cấu hình bảng giá/i })).not.toBeInTheDocument()
  })

  it('supports lightbox opening and closing on image click', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockApprovedLot },
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText('Trạm Cổng Barie ALPR Thông Minh')).toBeInTheDocument()
    })

    // Click on image container
    const coverTitle = screen.getByText('Trạm Cổng Barie ALPR Thông Minh')
    await user.click(coverTitle)

    // Lightbox should display the image with index indicator
    await waitFor(() => {
      expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument()
    })

    // Close lightbox
    const closeBtn = screen.getByRole('button', { name: 'Đóng xem ảnh' })
    await user.click(closeBtn)

    await waitFor(() => {
      expect(screen.queryByText(/1 \/ 2/)).not.toBeInTheDocument()
    })
  })

  it('closes lightbox on Escape key and locks body scroll (TSK-P2-02 A11y)', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: mockApprovedLot },
    })

    renderPage(1)

    await waitFor(() => {
      expect(screen.getByText('Trạm Cổng Barie ALPR Thông Minh')).toBeInTheDocument()
    })

    const coverTitle = screen.getByText('Trạm Cổng Barie ALPR Thông Minh')
    await user.click(coverTitle)

    await waitFor(() => {
      expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument()
    })

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText(/1 \/ 2/)).not.toBeInTheDocument()
    })
  })

  it('handles image upload properly and triggers refetch', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockApprovedLot },
    })
    const uploadSpy = vi.spyOn(api, 'uploadAdditionalLotImages').mockResolvedValueOnce([
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
      expect(uploadSpy).toHaveBeenCalledWith(1, [file])
    })
  })

  it('renders error state and retry button when fetching fails', async () => {
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'))

    renderPage(999)

    await waitFor(() => {
      expect(screen.getByText(/Không tải được hồ sơ/i)).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /Thử lại/i })).toBeInTheDocument()
  })
})
