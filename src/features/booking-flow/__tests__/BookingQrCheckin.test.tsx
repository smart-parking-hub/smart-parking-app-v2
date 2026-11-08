import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { BookingStatusPanel } from '../BookingStatusPanel'
import type { Booking } from '../api'

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

function renderPanel(booking: Booking) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookingStatusPanel bookingId={booking.id} booking={booking} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('BookingStatusPanel - QR Check-in Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dynamic QR check-in card and SVG when status is PENDING_CHECKIN', () => {
    // Arrange & Act
    renderPanel(samplePendingCheckinBooking)

    // Assert
    expect(screen.getByText(/Vé QR Check-in Mở Barie Tự Động/i)).toBeInTheDocument()
    expect(screen.getByText(/ĐÃ XÁC NHẬN CỌC · SẴN SÀNG CHECK-IN/i)).toBeInTheDocument()
    expect(screen.getByTestId('checkin-qr-container')).toBeInTheDocument()
    expect(screen.getByLabelText(/Mã QR Check-in BK-CHECKIN-101/i)).toBeInTheDocument()
    expect(screen.getByText(/MÃ: BK-CHECKIN-101/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tải ảnh vé QR \(PNG Offline\)/i })).toBeInTheDocument()
  })

  it('does not render QR check-in card when status is PENDING_PAYMENT', () => {
    // Arrange & Act
    renderPanel(samplePendingPaymentBooking)

    // Assert
    expect(screen.queryByText(/Vé QR Check-in Mở Barie Tự Động/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('checkin-qr-container')).not.toBeInTheDocument()
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
