import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { BookingStatusPanel } from '../BookingStatusPanel'
import type { Booking } from '../api'
import { apiClient } from '@/shared/api/client'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn() } }))

const samplePendingCheckinBooking: Booking = {
  id: 101,
  bookingCode: 'BK-CHECKIN-101',
  parkingLotId: 5,
  parkingLotName: 'Bãi Tân Cảng Cát Lái Gate 2',
  merchantId: 2,
  vehicleId: 10,
  vehiclePlate: '51C-99999',
  status: 'PENDING_CHECKIN',
  advanceDeposit: 50000,
  totalAmount: 150000,
  hourlyRate: 30000,
  overtimePenaltyMultiplier: 2,
  surgeMultiplier: 1.2,
  expectedCheckInTime: new Date(Date.now() + 1800000).toISOString(),
  expectedCheckOutTime: new Date(Date.now() + 7200000).toISOString(),
  expiresAt: new Date(Date.now() + 3600000).toISOString(),
}

const samplePendingPaymentBooking: Booking = {
  ...samplePendingCheckinBooking,
  id: 102,
  bookingCode: 'BK-PAYMENT-102',
  status: 'PENDING_PAYMENT',
}

function renderPanel(booking: Booking, compact = false) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookingStatusPanel bookingId={booking.id} booking={booking} compact={compact} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('BookingStatusPanel - QR Check-in Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation(async url => ({ data: { data:
      String(url).endsWith('/payments/wallet') ? null : { availableAmount: 0, heldAmount: 0, currency: 'VND', enabled: true },
    } }))
  })

  it('renders dynamic QR check-in card and SVG when status is PENDING_CHECKIN', () => {
    // Arrange & Act
    renderPanel(samplePendingCheckinBooking)

    // Assert
    expect(screen.getByRole('heading', { name: 'Vé check-in của bạn' })).toBeInTheDocument()
    expect(screen.getByText('Đã xác nhận cọc')).toBeInTheDocument()
    expect(screen.getByTestId('checkin-qr-container')).toBeInTheDocument()
    expect(screen.getByLabelText(/Mã QR Check-in BK-CHECKIN-101/i)).toBeInTheDocument()
    expect(screen.getAllByText('BK-CHECKIN-101').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Tải ảnh vé QR (PNG)' })).toBeInTheDocument()
  })

  it.each([
    { policy: 1, early: 0, displayed: '19:00' },
    { policy: 2, early: 15, displayed: '18:45' },
  ])('shows the arrival window saved on a policy $policy ticket', ({ policy, early, displayed }) => {
    renderPanel({
      ...samplePendingCheckinBooking,
      expectedCheckInTime: '2026-11-18T19:00:00',
      expectedCheckOutTime: '2026-11-18T21:00:00',
      expiresAt: '2026-11-18T19:30:00',
      schedulePolicyVersion: policy,
      checkInEarlyMinutes: early,
    }, true)
    expect(screen.getByText('Từ').nextElementSibling).toHaveTextContent(displayed)
    const earlyArrival = screen.queryByText(/Có thể vào sớm tối đa 15 phút nếu chỗ đã sẵn sàng/)
    if (early) expect(earlyArrival).toBeInTheDocument()
    else expect(earlyArrival).not.toBeInTheDocument()
  })

  it('does not render QR check-in card when status is PENDING_PAYMENT', () => {
    // Arrange & Act
    renderPanel(samplePendingPaymentBooking)

    // Assert
    expect(screen.queryByRole('heading', { name: 'Vé check-in của bạn' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
    expect(document.body.innerHTML).not.toContain(samplePendingPaymentBooking.bookingCode)
  })

  it('keeps the compact success ticket complete without repeating booking details or copy actions', () => {
    renderPanel({ ...samplePendingCheckinBooking, bookingCode: 'BK33DA71C2A0C74D79A6C8FBD486F0F67A' }, true)
    expect(screen.getAllByText('BK33DA71C2A0C74D79A6C8FBD486F0F67A')).toHaveLength(1)
    expect(screen.getAllByText('51C-99999')).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Sao chép mã check-in' })).toHaveLength(1)
    expect(screen.getByText('Đã thanh toán cọc')).toBeInTheDocument()
    expect(screen.getByText('Khung giờ check-in hợp lệ')).toBeInTheDocument()
    expect(screen.getByText('Chi tiết giá & phụ phí')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hủy booking' })).toBeInTheDocument()
  })

  it('shows a useful error when clipboard access fails', async () => {
    const user = userEvent.setup()
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true })
    renderPanel(samplePendingCheckinBooking, true)
    await user.click(screen.getByRole('button', { name: 'Sao chép mã check-in' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể sao chép')
  })

  it('copies bookingCode to clipboard when copy button is clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    })

    renderPanel(samplePendingCheckinBooking)

    // Act
    const copyBtns = screen.getAllByRole('button', { name: /Sao chép mã check-in/i })
    await user.click(copyBtns[0])

    // Assert
    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('BK-CHECKIN-101')
    })
  })
})
