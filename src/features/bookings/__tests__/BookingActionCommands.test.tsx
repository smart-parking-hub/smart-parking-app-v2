import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BookingActionCommands } from '../components/BookingActionCommands'
import type { BookingItemDto } from '../types/bookingTypes'

const createMockBooking = (overrides?: Partial<BookingItemDto>): BookingItemDto => ({
  id: 101,
  bookingCode: 'BK-2026-TEST',
  parkingLotName: 'Bãi Đậu Xe Container Tân Cảng',
  parkingLotAddress: 'Cát Lái, TP. Thủ Đức',
  vehiclePlate: '51C-888.99',
  vehicleType: 'Container 40FT',
  status: 'PARKING',
  statusBadgeLabel: 'ĐANG ĐỖ TẠI BÃI',
  createdAtText: '2026-11-18 10:00',
  expectedCheckInTime: '2026-11-18 11:00',
  expectedCheckOutTime: '2026-11-18 15:00',
  baseRatePerHour: 40000,
  actualDurationHours: 4,
  actualDurationText: 'Dự kiến đỗ 4 giờ',
  parkingSubtotal: 160000,
  depositPaid: 100000,
  advanceDeposit: 100000,
  remainingFinalPayment: 60000,
  gateToken: 'TOKEN-TEST-101',
  ...overrides,
})

describe('BookingActionCommands Component', () => {
  it('AC-1: hides final payment button and displays waiting notice when vehicle is PARKING', () => {
    // Arrange
    const booking = createMockBooking({ status: 'PARKING' })
    const onPayFinal = vi.fn()
    const onPayDeposit = vi.fn()
    const onCancelBooking = vi.fn()
    const onOpenReview = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={onPayFinal}
          onPayDeposit={onPayDeposit}
          onCancelBooking={onCancelBooking}
          onOpenReview={onOpenReview}
        />
      </MemoryRouter>
    )

    // Assert: Notice must be visible
    const noticeElement = screen.getByTestId('parking-status-notice')
    expect(noticeElement).toBeInTheDocument()
    expect(noticeElement).toHaveTextContent(
      'Xe đang đỗ tại bãi. Cước phí sẽ được chốt khi Barie quét xe tại cổng ra.'
    )

    // Assert: Final payment button must NOT be rendered
    const finalPaymentBtn = screen.queryByRole('button', {
      name: /THANH TOÁN KHOẢN CUỐI QUA PAYOS VIETQR/i,
    })
    expect(finalPaymentBtn).not.toBeInTheDocument()
  })

  it('AC-1: hides final payment button and displays waiting notice when vehicle is OVERTIME', () => {
    // Arrange
    const booking = createMockBooking({ status: 'OVERTIME' })
    const onPayFinal = vi.fn()
    const onPayDeposit = vi.fn()
    const onCancelBooking = vi.fn()
    const onOpenReview = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={onPayFinal}
          onPayDeposit={onPayDeposit}
          onCancelBooking={onCancelBooking}
          onOpenReview={onOpenReview}
        />
      </MemoryRouter>
    )

    // Assert: Notice must be visible
    expect(screen.getByTestId('parking-status-notice')).toBeInTheDocument()

    // Assert: Final payment button must NOT be rendered
    expect(
      screen.queryByRole('button', {
        name: /THANH TOÁN KHOẢN CUỐI QUA PAYOS VIETQR/i,
      })
    ).not.toBeInTheDocument()
  })

  it('AC-2: displays final payment button and invokes callback when status is AWAITING_FINAL_PAYMENT', async () => {
    // Arrange
    const user = userEvent.setup()
    const booking = createMockBooking({ status: 'AWAITING_FINAL_PAYMENT' })
    const onPayFinal = vi.fn()
    const onPayDeposit = vi.fn()
    const onCancelBooking = vi.fn()
    const onOpenReview = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={onPayFinal}
          onPayDeposit={onPayDeposit}
          onCancelBooking={onCancelBooking}
          onOpenReview={onOpenReview}
        />
      </MemoryRouter>
    )

    // Assert: Waiting notice must NOT be rendered
    expect(screen.queryByTestId('parking-status-notice')).not.toBeInTheDocument()

    // Assert: Final payment button is visible and clickable
    const finalPaymentBtn = screen.getByRole('button', {
      name: /THANH TOÁN KHOẢN CUỐI QUA PAYOS VIETQR ➔/i,
    })
    expect(finalPaymentBtn).toBeInTheDocument()

    await user.click(finalPaymentBtn)
    expect(onPayFinal).toHaveBeenCalledTimes(1)
  })

  it('AC-3: dynamically formats advance deposit amount for container vehicle (200.000 Đ)', async () => {
    // Arrange
    const user = userEvent.setup()
    const booking = createMockBooking({
      status: 'PENDING_PAYMENT',
      advanceDeposit: 200000,
      depositPaid: 200000,
    })
    const onPayFinal = vi.fn()
    const onPayDeposit = vi.fn()
    const onCancelBooking = vi.fn()
    const onOpenReview = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={onPayFinal}
          onPayDeposit={onPayDeposit}
          onCancelBooking={onCancelBooking}
          onOpenReview={onOpenReview}
        />
      </MemoryRouter>
    )

    // Assert: Button must show exact dynamic amount 200.000 Đ
    const depositBtn = screen.getByRole('button', {
      name: /THANH TOÁN TIỀN CỌC 200\.000 Đ QUA PAYOS VIETQR ➔/i,
    })
    expect(depositBtn).toBeInTheDocument()

    await user.click(depositBtn)
    expect(onPayDeposit).toHaveBeenCalledTimes(1)
  })

  it('AC-3: dynamically formats advance deposit for standard vehicle (10.000 Đ)', () => {
    // Arrange
    const booking = createMockBooking({
      status: 'PENDING_PAYMENT',
      advanceDeposit: 10000,
      depositPaid: 10000,
    })

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={vi.fn()}
          onPayDeposit={vi.fn()}
          onCancelBooking={vi.fn()}
          onOpenReview={vi.fn()}
        />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByRole('button', {
        name: /THANH TOÁN TIỀN CỌC 10\.000 Đ QUA PAYOS VIETQR ➔/i,
      })
    ).toBeInTheDocument()
  })

  it('renders review button when status is COMPLETED and invokes onOpenReview', async () => {
    // Arrange
    const user = userEvent.setup()
    const booking = createMockBooking({ status: 'COMPLETED' })
    const onOpenReview = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={vi.fn()}
          onPayDeposit={vi.fn()}
          onCancelBooking={vi.fn()}
          onOpenReview={onOpenReview}
        />
      </MemoryRouter>
    )

    // Assert
    const reviewBtn = screen.getByRole('button', {
      name: /ĐÁNH GIÁ TRẢI NGHIỆM BÃI ĐỖ XE/i,
    })
    expect(reviewBtn).toBeInTheDocument()

    await user.click(reviewBtn)
    expect(onOpenReview).toHaveBeenCalledTimes(1)
  })

  it('handles quick secondary actions: cash at gate and map directions', async () => {
    // Arrange
    const user = userEvent.setup()
    const booking = createMockBooking({ status: 'PARKING' })
    const onPayCashAtGate = vi.fn()
    const onOpenMapDirections = vi.fn()

    // Act
    render(
      <MemoryRouter>
        <BookingActionCommands
          booking={booking}
          onPayFinal={vi.fn()}
          onPayDeposit={vi.fn()}
          onCancelBooking={vi.fn()}
          onOpenReview={vi.fn()}
          onPayCashAtGate={onPayCashAtGate}
          onOpenMapDirections={onOpenMapDirections}
        />
      </MemoryRouter>
    )

    // Assert
    const cashBtn = screen.getByRole('button', { name: /Tiền mặt tại cổng/i })
    const mapBtn = screen.getByRole('button', { name: /Chỉ đường Maps/i })

    await user.click(cashBtn)
    expect(onPayCashAtGate).toHaveBeenCalledTimes(1)

    await user.click(mapBtn)
    expect(onOpenMapDirections).toHaveBeenCalledTimes(1)
  })
})
