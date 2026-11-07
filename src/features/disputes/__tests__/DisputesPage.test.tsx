import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('DRV-DISP-01 & DRV-DISP-02: DisputesPage (Trung tâm khiếu nại tài xế & đối soát)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dispute list table with right-aligned numeric columns (Hồ sơ, Booking, Tiền bồi thường)', async () => {
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

    // Verify right alignment on numeric table cells
    const disputeCell = screen.getByText('KN-42').closest('td')
    expect(disputeCell).toHaveClass('text-right')

    const bookingCell = screen.getByText('#9081').closest('td')
    expect(bookingCell).toHaveClass('text-right')

    const amountCell = screen.getByText('50.000 ₫').closest('td')
    expect(amountCell).toHaveClass('text-right')
  })

  it('renders dispute detail view when detail={true}', async () => {
    mockGetData.mockResolvedValue({
      id: 42,
      bookingId: 9081,
      merchantId: 10,
      driverId: 5,
      reason: 'Bãi đỗ thu phụ phí sai quy định',
      description: 'Bãi xe thu thêm 50k tiền cẩu reefer ngoài biểu phí hợp đồng.',
      status: 'RESOLVED',
      resolution: 'Đã hoàn trả 50.000đ vào ví tài xế.',
      createdAt: '2026-02-18T10:00:00Z',
      updatedAt: '2026-02-18T12:00:00Z',
    })

    renderDisputes(
      <Routes>
        <Route path="/disputes/:id" element={<DisputesPage role="driver" detail={true} />} />
      </Routes>,
      ['/disputes/42']
    )

    expect(await screen.findByText(/Hồ sơ khiếu nại #42/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Bãi xe thu thêm 50k tiền cẩu reefer ngoài biểu phí hợp đồng.')).toBeInTheDocument()
      expect(screen.getByText('Đã hoàn trả 50.000đ vào ví tài xế.')).toBeInTheDocument()
    })
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
      expect(mockSendData).toHaveBeenCalledWith('post', '/api/v1/disputes', expect.objectContaining({
        bookingId: 9081,
        reason: 'Barie không nhận diện biển số ALPR',
      }))
    })
  })
})
