import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getData, sendData } from '@/shared/api/resources'
import { apiClient } from '@/shared/api/client'
import { disputeTimeLabel, disputeTimeParts } from '../api/driverDisputesApi'
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

  it('renders dispute list table with Chờ xử lý badge for OPEN, 2-line HH:mm/date time, and omits Tiền bồi thường column', async () => {
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

    // Status OPEN displays "Chờ xử lý" rather than "Đang mở"
    expect(screen.queryByText(/Đang mở/i)).not.toBeInTheDocument()
    expect(screen.getAllByText('Chờ xử lý').length).toBeGreaterThanOrEqual(3)

    // Compensation column and amount are omitted from the list table
    expect(screen.queryByRole('columnheader', { name: /Tiền bồi thường/i })).not.toBeInTheDocument()
    expect(screen.queryByText('50.000 ₫')).not.toBeInTheDocument()

    // Time shows HH:mm on line 1 and dd/MM/yyyy on line 2, without seconds
    const timeEl = screen.getByText('17:00')
    const dateEl = screen.getByText('18/02/2026')
    expect(timeEl).toBeInTheDocument()
    expect(dateEl).toBeInTheDocument()
    expect(timeEl).not.toBe(dateEl)
    expect(screen.queryByText(/17:00:00/)).not.toBeInTheDocument()

    // Hồ sơ and Booking stay left-aligned
    const disputeCell = screen.getByText('KN-42').closest('td')
    expect(disputeCell).not.toHaveClass('text-right')

    const bookingCell = screen.getByText('#9081').closest('td')
    expect(bookingCell).not.toHaveClass('text-right')
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
          amount: 50000,
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
    expect(screen.queryByText(/Bồi thường:/)).not.toBeInTheDocument()
    expect(screen.getByText('17:00')).toBeInTheDocument()
    expect(screen.getByText('18/02/2026')).toBeInTheDocument()
    expect(screen.queryByText(/17:00:00/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Chi tiết/i })).toHaveAttribute('href', '/disputes/51')
  })

  it('renders dispute detail view with Admin stepper, compensation record, payment refund match, and linked booking', async () => {
    mockGetData.mockImplementation(async (url) => {
      const target = String(url)
      if (target.includes('/api/v1/disputes/me/42')) {
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
          compensationAmount: 50000,
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
    expect(screen.getByText('50.000 ₫')).toBeInTheDocument()
    expect(await screen.findByText('PAY-REF-9081')).toBeInTheDocument()
    expect(screen.getByText('bien-lai-cong.png (120 KB)')).toBeInTheDocument()

    // Timestamps render HH:mm and dd/MM/yyyy without seconds
    expect(screen.getAllByText('17:00').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('19:00').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('18/02/2026').length).toBeGreaterThanOrEqual(2)
    expect(screen.queryByText(/17:00:00|19:00:00|15:00:00/)).not.toBeInTheDocument()

    // Linked booking sidebar
    expect(await screen.findByText('Depot Cát Lái Gate 2')).toBeInTheDocument()
    expect(screen.getByText('51C-999.88')).toBeInTheDocument()
    expect(screen.getByText('15:00')).toBeInTheDocument()

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

  it('loads authenticated evidence images via blob XHR, opens lightbox modal, and renders timeline', async () => {
    const internalEvidenceUrl =
      'http://localhost:8088/api/v1/disputes/evidence/11111111-1111-1111-1111-111111111111.png'
    const blobSpy = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: new Blob(['fake-png'], { type: 'image/png' }),
    } as never)

    mockGetData.mockImplementation(async (url) => {
      if (String(url).includes('/api/v1/disputes/me/77')) {
        return {
          id: 77,
          bookingId: 9099,
          merchantId: 10,
          parkingLotId: 2,
          driverId: 5,
          reason: 'Thu thêm tiền ngoài cổng',
          description: 'Ảnh biên lai đã upload',
          evidenceUrls: [internalEvidenceUrl],
          status: 'IN_REVIEW',
          resolution: '',
          timeline: [
            {
              id: 1,
              eventType: 'MERCHANT_RESPONSE',
              actorRole: 'MERCHANT',
              message: 'Chủ bãi đang kiểm tra camera làn vào',
              resultingStatus: 'IN_REVIEW',
              createdAt: '2026-11-11T10:15:00Z',
            },
          ],
          createdAt: '2026-11-11T10:00:00Z',
          updatedAt: '2026-11-11T10:15:00Z',
        }
      }
      return {}
    })

    renderDisputes(
      <Routes>
        <Route path="/disputes/:id" element={<DisputesPage role="driver" detail={true} />} />
      </Routes>,
      ['/disputes/77'],
    )

    expect(await screen.findByText(/Hồ sơ khiếu nại #77/i)).toBeInTheDocument()
    expect(
      await screen.findByText('Chủ bãi đang kiểm tra camera làn vào'),
    ).toBeInTheDocument()

    const thumb = await screen.findByAltText('Bằng chứng khiếu nại 1')
    expect(thumb).toHaveAttribute('src', 'blob:mock-url')
    expect(blobSpy).toHaveBeenCalledWith(
      '/api/v1/disputes/evidence/11111111-1111-1111-1111-111111111111.png',
      { responseType: 'blob' },
    )

    fireEvent.click(thumb.closest('button')!)
    expect(await screen.findByText('Xem ảnh bằng chứng')).toBeInTheDocument()
    expect(screen.getByAltText('Ảnh bằng chứng phóng to')).toHaveAttribute('src', 'blob:mock-url')
  })

  it('keeps existing dispute list visible with inline retry banner if background refresh fails', async () => {
    let calls = 0
    mockGetData.mockImplementation(async (url) => {
      if (String(url).includes('/api/v1/disputes/me')) {
        calls += 1
        if (calls === 1) {
          return {
            content: [
              {
                id: 88,
                bookingId: 9123,
                merchantId: 10,
                driverId: 5,
                reason: 'Hồ sơ đã lưu sẵn',
                description: '',
                status: 'OPEN',
                resolution: '',
                createdAt: '2026-11-11T10:00:00Z',
                updatedAt: '2026-11-11T10:00:00Z',
              },
            ],
            totalPages: 1,
            totalElements: 1,
          }
        }
        throw new Error('Lỗi máy chủ nội bộ. Vui lòng thử lại sau.')
      }
      return { content: [] }
    })

    renderDisputes(<DisputesPage role="driver" />)

    expect(await screen.findByText('KN-88')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Làm mới/i }))

    expect(
      await screen.findByText(/Không thể làm mới danh sách khiếu nại/i),
    ).toBeInTheDocument()
    expect(screen.getByText('KN-88')).toBeInTheDocument()
  })

  it('formats disputeTimeParts and disputeTimeLabel with HH:mm and dd/MM/yyyy without seconds', () => {
    expect(disputeTimeParts('2026-11-11T17:34:25')).toEqual({
      time: '17:34',
      date: '11/11/2026',
    })
    expect(disputeTimeParts('2026-11-11T17:00:59Z')).toEqual({
      time: '00:00',
      date: '12/11/2026',
    })
    expect(disputeTimeLabel('2026-11-11T17:34:25')).toBe('17:34 11/11/2026')
    expect(disputeTimeParts(null)).toBeNull()
    expect(disputeTimeLabel(undefined)).toBe('—')
  })
})
