import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getData, sendData } from '@/shared/api/resources'
import { DisputesPage } from '../index'

vi.mock('@/shared/api/resources', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/api/resources')>()),
  getData: vi.fn(),
  sendData: vi.fn(),
}))

const mockGetData = vi.mocked(getData)
const mockSendData = vi.mocked(sendData)

function renderDisputes(ui: React.ReactElement, initialEntries = ['/disputes']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

const originalMatchMedia = window.matchMedia

describe('DRV-DISP-01 & DRV-DISP-02: DisputesPage (Trung tâm khiếu nại tài xế & đối soát)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = originalMatchMedia
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    window.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders dispute list table with left-aligned Hồ sơ/Booking columns and right-aligned Tiền bồi thường', async () => {
    mockGetData.mockResolvedValue({
      content: [
        {
          id: 42,
          bookingId: 9081,
          merchantId: 10,
          driverId: 5,
          reason: 'Bãi đỗ thu phụ phí sai quy định',
          description: 'Bãi xe thu thêm 50k tiền cẩu reefer ngoài biểu phí hợp đồng.',
          status: 'OPEN',
          resolution: '',
          amount: 50000,
          createdAt: '2026-02-18T10:00:00Z',
          updatedAt: '2026-02-18T10:00:00Z',
        },
      ],
      totalPages: 1,
      totalElements: 1,
    })

    renderDisputes(<DisputesPage role="driver" />)

    expect(await screen.findByText('KN-42')).toBeInTheDocument()
    expect(screen.getByText('#9081')).toBeInTheDocument()
    expect(screen.getByText('Bãi đỗ thu phụ phí sai quy định')).toBeInTheDocument()
    expect(screen.getByText('50.000 ₫')).toBeInTheDocument()

    // Hồ sơ and Booking stay left-aligned; only numeric currency Tiền bồi thường is right-aligned
    const disputeCell = screen.getByText('KN-42').closest('td')
    expect(disputeCell).not.toHaveClass('text-right')

    const bookingCell = screen.getByText('#9081').closest('td')
    expect(bookingCell).not.toHaveClass('text-right')

    const amountCell = screen.getByText('50.000 ₫').closest('td')
    expect(amountCell).toHaveClass('text-right')
  })

  it('renders uniform white KPI cards, light segmented status tabs, and omits parking lot name / resolution from list rows', async () => {
    mockGetData.mockImplementation(async (url) => {
      if (String(url).includes('/bookings')) {
        return {
          content: [
            {
              id: 9081,
              bookingCode: 'BK-CATLAI-9081',
              parkingLotName: 'Depot Cát Lái Khu A',
              status: 'COMPLETED',
            },
          ],
          totalPages: 1,
          totalElements: 1,
        }
      }
      return {
        content: [
          {
            id: 42,
            bookingId: 9081,
            merchantId: 10,
            driverId: 5,
            reason: 'Thu thêm tiền mặt tại cổng',
            description: '',
            status: 'PENDING',
            resolution: '',
            createdAt: '2026-02-18T10:00:00Z',
            updatedAt: '2026-02-18T10:00:00Z',
          },
          {
            id: 43,
            bookingId: 9082,
            merchantId: 10,
            driverId: 5,
            reason: 'Tính sai giờ check-out',
            description: '',
            status: 'RESOLVED',
            resolution: 'REFUNDED chênh lệch 40.000đ',
            createdAt: '2026-02-19T10:00:00Z',
            updatedAt: '2026-02-19T12:00:00Z',
          },
        ],
        totalPages: 1,
        totalElements: 2,
      }
    })

    renderDisputes(<DisputesPage role="driver" />)

    expect(await screen.findByText('KN-42')).toBeInTheDocument()
    expect(screen.getByText('KN-43')).toBeInTheDocument()
    expect(await screen.findByText('BK-CATLAI-9081')).toBeInTheDocument()

    // Parking lot name and resolution outcome only belong in detail view, not in the list table
    expect(screen.queryByText('Depot Cát Lái Khu A')).not.toBeInTheDocument()
    expect(screen.queryByText(/Kết quả:/)).not.toBeInTheDocument()

    // Uniform white-bg dark-text KPI cards
    const kpiSection = screen.getByLabelText('Thống kê hồ sơ khiếu nại')
    expect(kpiSection.querySelectorAll('.bg-white')).toHaveLength(4)

    // Switch to RESOLVED tab
    fireEvent.click(screen.getByRole('tab', { name: /Đã giải quyết/i }))
    expect(screen.queryByText('KN-42')).not.toBeInTheDocument()
    expect(screen.getByText('KN-43')).toBeInTheDocument()

    // Switch to REJECTED tab -> filtered empty state
    fireEvent.click(screen.getByRole('tab', { name: /Từ chối/i }))
    expect(screen.getByText(/Không có khiếu nại ở trạng thái này/i)).toBeInTheDocument()
  })

  it('renders mobile dispute cards when viewport matches max-width 767px', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('767px'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    mockGetData.mockResolvedValue({
      content: [
        {
          id: 51,
          bookingId: 9100,
          merchantId: 10,
          driverId: 5,
          reason: 'Bãi đóng cửa khi xe đã cọc',
          description: '',
          status: 'PENDING',
          resolution: '',
          createdAt: '2026-02-18T10:00:00Z',
          updatedAt: '2026-02-18T10:00:00Z',
        },
      ],
      totalPages: 1,
      totalElements: 1,
    })

    renderDisputes(<DisputesPage role="driver" />)

    expect(await screen.findByText('KN-51')).toBeInTheDocument()
    expect(screen.getByText('Bãi đóng cửa khi xe đã cọc')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Chi tiết/i })).toHaveAttribute('href', '/disputes/51')
  })

  it('renders dispute detail view with Admin stepper, compensation record, payment refund match, and linked booking', async () => {
    mockGetData.mockImplementation(async (url) => {
      const target = String(url)
      if (target.includes('/api/v1/disputes/42')) {
        return {
          id: 42,
          bookingId: 9081,
          merchantId: 10,
          driverId: 5,
          reason: 'Bãi đỗ thu phụ phí sai quy định',
          description:
            'Bãi xe thu thêm 50k tiền cẩu reefer ngoài biểu phí hợp đồng.\n\n[Chứng từ đính kèm trên thiết bị: bien-lai-cong.png (120 KB)]',
          status: 'RESOLVED',
          resolution: 'Đã hoàn trả 50.000đ vào ví tài xế.',
          createdAt: '2026-02-18T10:00:00Z',
          updatedAt: '2026-02-18T12:00:00Z',
        }
      }
      if (target.includes('/api/v1/bookings/9081')) {
        return {
          id: 9081,
          bookingCode: 'BK-2026-9081',
          parkingLotName: 'Depot Cát Lái Gate 2',
          parkingLotAddress: 'Quận 2, TP.HCM',
          vehiclePlate: '51C-999.88',
          status: 'COMPLETED',
          advanceDeposit: 100000,
          totalAmount: 250000,
          expectedCheckInTime: '2026-02-18T08:00:00Z',
        }
      }
      if (target.includes('/api/v1/payments')) {
        return {
          content: [
            {
              id: 301,
              bookingId: 9081,
              gateway: 'PAYOS',
              transactionCode: 'PAY-REF-9081',
              amount: 100000,
              type: 'DEPOSIT',
              status: 'REFUNDED',
            },
          ],
          totalElements: 1,
          totalPages: 1,
        }
      }
      return {}
    })

    renderDisputes(
      <Routes>
        <Route path="/disputes/:id" element={<DisputesPage role="driver" detail={true} />} />
      </Routes>,
      ['/disputes/42'],
    )

    expect(await screen.findByText(/Hồ sơ khiếu nại #42/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.getByText('Bãi xe thu thêm 50k tiền cẩu reefer ngoài biểu phí hợp đồng.'),
      ).toBeInTheDocument()
      expect(screen.getByText('Đã hoàn trả 50.000đ vào ví tài xế.')).toBeInTheDocument()
    })

    // Stepper & Compensation dossier
    expect(screen.getByText('Tiến độ giải quyết của Quản trị viên')).toBeInTheDocument()
    expect(screen.getByText('Mã biên bản: BB-KN-42')).toBeInTheDocument()
    expect(await screen.findByText('PAY-REF-9081')).toBeInTheDocument()
    expect(screen.getByText('bien-lai-cong.png (120 KB)')).toBeInTheDocument()

    // Linked booking sidebar
    expect(await screen.findByText('Depot Cát Lái Gate 2')).toBeInTheDocument()
    expect(screen.getByText('51C-999.88')).toBeInTheDocument()

    // Back link renders clean single label without literal arrow character duplication
    const backLink = screen.getByRole('link', { name: 'Danh sách' })
    expect(backLink).toHaveAttribute('href', '/disputes')
    expect(screen.queryByText(/←\s*Danh sách/)).not.toBeInTheDocument()
  })

  it('interactively opens create dispute modal and submits valid form', async () => {
    mockGetData.mockResolvedValue({
      content: [],
      totalPages: 1,
      totalElements: 0,
    })
    mockSendData.mockResolvedValue({ id: 99 })

    renderDisputes(<DisputesPage role="driver" />)

    const createBtn = await screen.findByRole('button', { name: '+ Gửi khiếu nại' })
    fireEvent.click(createBtn)

    expect(screen.getByRole('heading', { name: 'Gửi phản ánh về lượt đỗ' })).toBeInTheDocument()

    const bookingInput = screen.getByLabelText(/ID Booking/i)
    const reasonInput = screen.getByLabelText(/Lý do/i)

    fireEvent.change(bookingInput, { target: { value: '9081' } })
    fireEvent.change(reasonInput, { target: { value: 'Barie không nhận diện biển số ALPR' } })

    const submitBtn = screen.getByRole('button', { name: 'Gửi khiếu nại' })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockSendData).toHaveBeenCalledWith(
        'post',
        '/api/v1/disputes',
        expect.objectContaining({
          bookingId: 9081,
          reason: 'Barie không nhận diện biển số ALPR',
        }),
      )
    })
  })
})
