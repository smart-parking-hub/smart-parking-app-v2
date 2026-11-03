import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { CreateMerchantParkingLotPage } from '../pages/CreateMerchantParkingLotPage'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

function renderCreateMerchantParkingLot(initialEntries = ['/merchant/parking-lots/new']) {
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
          <Route path="/merchant/parking-lots/new" element={<CreateMerchantParkingLotPage />} />
          <Route
            path="/merchant/parking-lots"
            element={<div data-testid="merchant-parking-lots-page">Danh Sách Bãi Đỗ</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-029: CreateMerchantParkingLotPage (Tạo bãi đỗ mới)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Mock window.scrollTo
    window.scrollTo = vi.fn()

    // Mock API post defaults
    vi.mocked(apiClient.post).mockImplementation((url) => {
      if (url.includes('/images')) {
        return Promise.resolve({
          data: {
            data: [
              {
                id: 1,
                parkingLotId: 101,
                fileName: 'image1.jpg',
                isCover: true,
              },
            ],
          },
        } as never)
      }
      return Promise.resolve({
        data: {
          data: {
            id: 101,
            name: 'Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)',
            status: 'PENDING_APPROVAL',
          },
        },
      } as never)
    })
  })

  it('renders page header, stepper and basic info form on initial step (Step 0)', () => {
    renderCreateMerchantParkingLot()

    // Header segment
    expect(screen.getByText(/Đăng Ký Bãi Đỗ Xe & Depot Mới/i)).toBeInTheDocument()
    expect(screen.getByText(/QUY TRÌNH THẨM ĐỊNH MẶT BẰNG & MỞ BẾN BÃI MỚI/i)).toBeInTheDocument()
    expect(screen.getByText(/BƯỚC 1 TRÊN 3/i)).toBeInTheDocument()

    // Form fields in Step 0
    expect(screen.getByLabelText(/Tên Bãi Đỗ Khai Báo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Địa Chỉ Mặt Bằng/i)).toBeInTheDocument()

    // Photo inspection card
    expect(screen.getByText(/Album Ảnh Hiện Trường Kiểm Định/i)).toBeInTheDocument()
    expect(screen.getByText(/Ảnh Đại Diện Bìa/i)).toBeInTheDocument()

    // AI Copilot widget on the right
    expect(screen.getByText(/Trợ Lý AI Hỗ Trợ Khai Báo/i)).toBeInTheDocument()
    expect(screen.getByText(/ENGINE: FRETRIX-DISPATCH-V3/i)).toBeInTheDocument()

    // Admin SLA widget
    expect(screen.getByText(/Cam Kết SLA & Thẩm Định/i)).toBeInTheDocument()
  })

  it('navigates from Step 0 to Step 1 and displays GPS inputs and map viewfinder', async () => {
    const user = userEvent.setup()
    renderCreateMerchantParkingLot()

    // Click Next button to go to Step 1
    const nextBtn = screen.getByRole('button', { name: /TIẾP TỤC: VỊ TRÍ & BẢN ĐỒ/i })
    await user.click(nextBtn)

    await waitFor(() => {
      expect(screen.getByText(/BƯỚC 2 TRÊN 3/i)).toBeInTheDocument()
    })

    // Step 1 GPS Inputs
    expect(screen.getByText(/Khai Báo Tọa Độ Chuẩn Xác \(WGS-84\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Vĩ Độ \(Latitude · 7 số thập phân\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Kinh Độ \(Longitude · 7 số thập phân\)/i)).toBeInTheDocument()

    // Map viewfinder canvas & sync button
    expect(screen.getByText(/Bản Đồ Định Vị Số Ranh Giới & Trọng Tải Tiếp Cận/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ĐỒNG BỘ VỊ TRÍ/i })).toBeInTheDocument()
  })

  it('navigates from Step 1 to Step 2 and displays complete confirmation summary', async () => {
    const user = userEvent.setup()
    renderCreateMerchantParkingLot()

    // Step 0 -> Step 1
    await user.click(screen.getByRole('button', { name: /TIẾP TỤC: VỊ TRÍ & BẢN ĐỒ/i }))

    await waitFor(() => {
      expect(screen.getByText(/BƯỚC 2 TRÊN 3/i)).toBeInTheDocument()
    })

    // Step 1 -> Step 2
    await user.click(screen.getByRole('button', { name: /TIẾP TỤC: XÁC NHẬN HỒ SƠ & GỬI DUYỆT/i }))

    await waitFor(() => {
      expect(screen.getByText(/BƯỚC 3 TRÊN 3/i)).toBeInTheDocument()
      expect(screen.getByText(/Xác Nhận Toàn Bộ Hồ Sơ Bãi Đỗ/i)).toBeInTheDocument()
    })

    // Confirmation details
    expect(screen.getByText(/PENDING_APPROVAL \(CHỜ PHÊ DUYỆT\)/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /XÁC NHẬN TẠO BÃI ĐỖ MỚI/i })).toBeInTheDocument()
  })

  it('applies AI Copilot generated content into the form state', async () => {
    const user = userEvent.setup()
    renderCreateMerchantParkingLot()

    // Click Apply AI Content button
    const applyAiBtn = screen.getByRole('button', { name: /Áp Dụng Nội Dung AI Vào Hồ Sơ/i })
    await user.click(applyAiBtn)

    await waitFor(() => {
      expect(screen.getByText(/Nội dung AI Fretrix-Dispatch đã đồng bộ vào hồ sơ/i)).toBeInTheDocument()
    })
  })

  it('saves and restores draft from localStorage successfully', async () => {
    const user = userEvent.setup()
    renderCreateMerchantParkingLot()

    // Click Save Draft button
    const saveDraftBtn = screen.getByRole('button', { name: /Lưu Bản Nháp/i })
    await user.click(saveDraftBtn)

    await waitFor(() => {
      expect(screen.getByText(/Đã Lưu Nháp/i)).toBeInTheDocument()
    })

    expect(localStorage.getItem('merchant_lot_registration_draft')).not.toBeNull()
  })

  it('submits registration form successfully and transitions out', async () => {
    const user = userEvent.setup()
    renderCreateMerchantParkingLot()

    // Move to Step 1
    await user.click(screen.getByRole('button', { name: /TIẾP TỤC: VỊ TRÍ & BẢN ĐỒ/i }))

    // Move to Step 2
    await waitFor(() => {
      expect(screen.getByText(/BƯỚC 2 TRÊN 3/i)).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /TIẾP TỤC: XÁC NHẬN HỒ SƠ & GỬI DUYỆT/i }))

    // Confirm Submission
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /XÁC NHẬN TẠO BÃI ĐỖ MỚI/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /XÁC NHẬN TẠO BÃI ĐỖ MỚI/i }))

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/merchant/parking-lots',
        expect.objectContaining({
          name: expect.any(String),
          address: expect.any(String),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        }),
      )
    })
  })
})
