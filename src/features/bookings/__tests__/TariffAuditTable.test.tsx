import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TariffAuditTable } from '../components/TariffAuditTable'
import { computeOvertimeDetails, parseBookingDateTime, isTimeInSurgeWindow } from '../api/bookingApi'
import type { BookingItemDto } from '../types/bookingTypes'

describe('TariffAuditTable - [SP-CHECKOUT-04] Overtime Penalty Audit', () => {
  const baseBooking: BookingItemDto = {
    id: 101,
    bookingCode: 'BK-TEST-001',
    parkingLotName: 'Bãi Xe Cảng Cát Lái Container',
    parkingLotAddress: 'Cổng B Cát Lái, TP. Thủ Đức',
    vehiclePlate: '51D-894.12',
    vehicleType: 'Container 40FT',
    status: 'COMPLETED',
    statusBadgeLabel: 'HOÀN TẤT',
    createdAtText: '14/02/2026',
    expectedCheckInTime: '10:00 14/02/2026',
    expectedCheckOutTime: '14:00 14/02/2026',
    actualCheckInTime: '10:00 14/02/2026',
    actualCheckOutTime: '14:00 14/02/2026',
    baseRatePerHour: 40000,
    actualDurationHours: 4,
    actualDurationText: 'Đỗ 4 giờ (Đúng giờ)',
    parkingSubtotal: 160000,
    depositPaid: 40000,
    remainingFinalPayment: 120000,
    gateToken: 'STH-101',
  }

  it('renders standard table without overtime row when booking is on-time', () => {
    // Arrange
    const onTimeBooking: BookingItemDto = {
      ...baseBooking,
      isOvertime: false,
      penaltyAmount: 0,
    }

    // Act
    render(<TariffAuditTable booking={onTimeBooking} />)

    // Assert
    expect(screen.getByText('BẢNG ĐỐI SOÁT CƯỚC PHÍ CHI TIẾT')).toBeInTheDocument()
    expect(screen.getByText('Giá cơ bản niêm yết')).toBeInTheDocument()
    expect(screen.getByText('40.000 đ/giờ')).toBeInTheDocument()
    expect(screen.getByText('Thời gian đỗ thực tế')).toBeInTheDocument()
    expect(screen.queryByTestId('overtime-penalty-row')).not.toBeInTheDocument()
    expect(screen.queryByText(/Phụ phí đỗ quá giờ/i)).not.toBeInTheDocument()
  })

  it('renders highlighted overtime penalty row with formula and multiplier when booking is overtime (80 mins = 3 blocks = 90.000 đ)', () => {
    // Arrange: 80 phút = 3 blocks 30p, rate 40k, multiplier 1.5 => 90.000 đ
    const overtimeBooking: BookingItemDto = {
      ...baseBooking,
      expectedCheckOutTime: '14:00 14/02/2026',
      actualCheckOutTime: '15:20 14/02/2026',
      isOvertime: true,
      overtimeMinutes: 80,
      overtimeBlocks: 3,
      overtimeHoursText: '1 giờ 20 phút',
      overtimePenaltyMultiplier: 1.5,
      penaltyAmount: 90000,
      standardParkingFee: 160000,
      parkingSubtotal: 250000,
      depositPaid: 40000,
      remainingFinalPayment: 210000,
    }

    // Act
    render(<TariffAuditTable booking={overtimeBooking} />)

    // Assert
    const penaltyRow = screen.getByTestId('overtime-penalty-row')
    expect(penaltyRow).toBeInTheDocument()

    // Title & Badge
    expect(screen.getByText('Phụ phí đỗ quá giờ quy định')).toBeInTheDocument()
    expect(screen.getByText('HỆ SỐ 1.5×')).toBeInTheDocument()

    // Time checkpoints & Overtime duration
    expect(screen.getAllByText('1 giờ 20 phút').length).toBeGreaterThan(0)
    expect(screen.getByText('14:00 14/02/2026')).toBeInTheDocument()
    expect(screen.getByText('15:20 14/02/2026')).toBeInTheDocument()

    // Formula & Amount (90.000 đ for 3 blocks 30p)
    expect(screen.getAllByText(/\+90\.000 đ/).length).toBe(2)
    expect(
      screen.getByText(/Công thức: Vượt 1 giờ 20 phút: \(3 block thường\) × 40\.000 đ\/h × hệ số phạt 1\.5 ÷ 2 ≈ \+90\.000 đ/)
    ).toBeInTheDocument()

    // Separated Standard Fee Row
    expect(screen.getByText('Tiền đỗ tiêu chuẩn (trong hạn)')).toBeInTheDocument()
    expect(screen.getByText('160.000 đ')).toBeInTheDocument()

    // Total footer with overtime notice
    expect(screen.getByText(/Đã bao gồm phụ phí đỗ quá giờ/)).toBeInTheDocument()
    expect(screen.getByText('210.000 đ')).toBeInTheDocument()
  })

  it('automatically calculates overtime if timestamps are provided without precomputed flags', () => {
    // Arrange: 80 minutes overtime without precomputed penalty flags
    const rawTimesBooking: BookingItemDto = {
      ...baseBooking,
      expectedCheckOutTime: '2026-02-14T14:00:00',
      actualCheckOutTime: '2026-02-14T15:20:00',
      baseRatePerHour: 40000,
      overtimePenaltyMultiplier: 1.5,
      parkingSubtotal: 250000,
      depositPaid: 40000,
      remainingFinalPayment: 210000,
      isOvertime: undefined,
      penaltyAmount: undefined,
    }

    // Act
    render(<TariffAuditTable booking={rawTimesBooking} />)

    // Assert
    const penaltyRow = screen.getByTestId('overtime-penalty-row')
    expect(penaltyRow).toBeInTheDocument()
    expect(screen.getByText('HỆ SỐ 1.5×')).toBeInTheDocument()
    expect(screen.getAllByText(/1 giờ 20 phút/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/\+90\.000 đ/).length).toBe(2)
  })

  describe('Reviewer Feedback Verification: computeOvertimeDetails exact backend parity', () => {
    it('Reviewer Case 1: charges commenced 30m block when exceeding by just 1 second (14:00:00 -> 14:00:01)', () => {
      // Exceeding by 1s counts as 1 commenced half-hour block (ParkingCharge.java: block.isBefore(until))
      const result = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T14:00:01',
        40000,
        1.5
      )
      expect(result.isOvertime).toBe(true)
      expect(result.overtimeBlocks).toBe(1)
      expect(result.overtimeHoursText).toBe('1 giây')
      // 1 block * (40000 * 1.5 * 0.5) = 30000
      expect(result.penaltyAmount).toBe(30000)
    })

    it('Reviewer Case 2: exactly 30 minutes charges 1 block, but 30 minutes 1 second charges 2 blocks', () => {
      // Exactly 30m 00s => 1 block
      const exactly30m = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T14:30:00',
        40000,
        1.5
      )
      expect(exactly30m.overtimeBlocks).toBe(1)
      expect(exactly30m.penaltyAmount).toBe(30000)

      // 30m 01s => exceeds 30m threshold, enters 2nd half-hour block
      const exceeds30m = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T14:30:01',
        40000,
        1.5
      )
      expect(exceeds30m.overtimeBlocks).toBe(2)
      expect(exceeds30m.penaltyAmount).toBe(60000)
    })

    it('Reviewer Case 3: applies peak surgeMultiplier correctly to blocks inside peak hours', () => {
      // Peak window: 16:00 -> 18:00 with surgeMultiplier = 1.5
      // Overtime: 15:30 -> 16:45 (75 mins = 3 blocks: 15:30, 16:00, 16:30)
      // Base: 40000, penaltyMultiplier: 1.0 => base block rate = 20000
      // Block 1 (15:30): outside peak => 20000 * 1.0 = 20000
      // Block 2 (16:00): in peak => 20000 * 1.5 = 30000
      // Block 3 (16:30): in peak => 20000 * 1.5 = 30000
      // Total penalty = 20000 + 30000 + 30000 = 80000
      const result = computeOvertimeDetails(
        '2026-02-14T15:30:00',
        '2026-02-14T16:45:00',
        40000,
        1.0,
        250000,
        1.5,
        '16:00',
        '18:00'
      )
      expect(result.isOvertime).toBe(true)
      expect(result.overtimeBlocks).toBe(3)
      expect(result.penaltyAmount).toBe(80000)
    })

    it('Reviewer Case 4: defaults overtimePenaltyMultiplier to 1.0 when missing (matching CheckInOutServiceImpl.java)', () => {
      // When multiplier is null/undefined, backend uses BigDecimal.ONE (1.0)
      // 60 minutes overtime = 2 blocks
      // Base: 40000, penaltyMultiplier: undefined (defaults to 1.0)
      // Penalty = 2 * (40000 * 1.0 * 0.5) = 40000 (NOT 60000 which was 1.5x)
      const result = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T15:00:00',
        40000,
        undefined
      )
      expect(result.overtimePenaltyMultiplier).toBe(1.0)
      expect(result.overtimeBlocks).toBe(2)
      expect(result.penaltyAmount).toBe(40000)
    })
  })

  describe('computeOvertimeDetails & parseBookingDateTime helpers', () => {
    it('parses both ISO format and VN slashed datetime format', () => {
      const iso = parseBookingDateTime('2026-02-14T14:00:00')
      expect(iso).not.toBeNull()
      expect(iso?.toISOString()).toBe('2026-02-14T07:00:00.000Z')

      const vn = parseBookingDateTime('14/02/2026 - 15:20')
      expect(vn).not.toBeNull()
      expect(vn?.toISOString()).toBe('2026-02-14T08:20:00.000Z')
    })

    it('returns isOvertime = false when check-out is on time or early', () => {
      const result = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T13:45:00',
        40000,
        1.5,
        160000
      )
      expect(result.isOvertime).toBe(false)
      expect(result.penaltyAmount).toBe(0)
      expect(result.overtimeMinutes).toBe(0)
    })

    it('calculates 30-minute block commenced overtime correctly for 80 minutes (3 blocks = 90.000 đ)', () => {
      const result = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T15:20:00',
        40000,
        1.5,
        250000
      )
      expect(result.isOvertime).toBe(true)
      expect(result.overtimeMinutes).toBe(80)
      expect(result.overtimeBlocks).toBe(3)
      expect(result.overtimeHoursText).toBe('1 giờ 20 phút')
      expect(result.penaltyAmount).toBe(90000)
    })

    it('verifies isTimeInSurgeWindow handles daytime and overnight windows correctly', () => {
      const afternoon = new Date('2026-02-14T09:30:00Z')
      const morning = new Date('2026-02-14T02:00:00Z')
      const night = new Date('2026-02-14T16:30:00Z')

      // Daytime window: 16:00 -> 18:00
      expect(isTimeInSurgeWindow(afternoon, '16:00', '18:00')).toBe(true)
      expect(isTimeInSurgeWindow(morning, '16:00', '18:00')).toBe(false)

      // Overnight window: 22:00 -> 06:00
      expect(isTimeInSurgeWindow(night, '22:00', '06:00')).toBe(true)
      expect(isTimeInSurgeWindow(morning, '22:00', '06:00')).toBe(false)
    })
  })

  describe('Reviewer Feedback Verification (Second Pass): F-02 & F-03 Fixes', () => {
    it('F-02: calculates exact penalty and standard parking fee for legacy booking checking in after expected checkout', () => {
      // Arrange:
      // Vé legacy đặt 13:30 - 14:00, thực tế vào 14:15, ra 14:45
      // Giá cơ bản: 40.000 đ/h, hệ số phạt: 1.5, tổng tiền backend chốt: 70.000 đ
      const expectedCheckOut = '2026-02-14T14:00:00'
      const actualCheckOut = '2026-02-14T14:45:00'
      const actualCheckIn = '2026-02-14T14:15:00'
      const baseRate = 40000
      const overtimeMultiplier = 1.5
      const totalAmount = 70000

      // Act:
      const result = computeOvertimeDetails(
        expectedCheckOut,
        actualCheckOut,
        baseRate,
        overtimeMultiplier,
        totalAmount,
        undefined,
        undefined,
        undefined,
        actualCheckIn
      )

      // Assert:
      // Quá hạn tính từ 14:15 đến 14:45 = 30 phút = đúng 1 block 30p
      expect(result.isOvertime).toBe(true)
      expect(result.overtimeBlocks).toBe(1)
      expect(result.overtimeHoursText).toBe('30 phút')
      // Phụ phí phạt: 1 block * (40000 * 1.5 * 0.5) = 30000 đ
      expect(result.penaltyAmount).toBe(30000)
      // Tiền đỗ tiêu chuẩn: 70000 - 30000 = 40000 đ (khớp 100% Backend ParkingCharge)
      expect(result.standardParkingFee).toBe(40000)
    })

    it('F-03 Case A: does not display peak multiplier in formula when overtime is completely outside peak hours', () => {
      // Arrange:
      // Bãi cấu hình cao điểm 16:00 - 18:00 (surgeMultiplier: 1.5)
      // Quá giờ 14:00 - 14:30 (hoàn toàn ngoài khung cao điểm)
      const bookingOutsidePeak: BookingItemDto = {
        ...baseBooking,
        expectedCheckOutTime: '2026-02-14T14:00:00',
        actualCheckOutTime: '2026-02-14T14:30:00',
        baseRatePerHour: 40000,
        overtimePenaltyMultiplier: 1.5,
        parkingSubtotal: 70000,
        surgeMultiplier: 1.5,
        surgeStartTime: '16:00',
        surgeEndTime: '18:00',
      }

      // Act:
      render(<TariffAuditTable booking={bookingOutsidePeak} />)

      // Assert:
      const penaltyRow = screen.getByTestId('overtime-penalty-row')
      expect(penaltyRow).toBeInTheDocument()
      // Không được hiển thị "Cao điểm" trong chuỗi công thức vì không có block nào áp dụng
      expect(penaltyRow.textContent).not.toContain('Cao điểm ×1.5')
    })

    it('F-03 Case B: accurately reflects applied peak surge blocks in formula when crossing peak window boundary', () => {
      // Arrange:
      // Bãi cấu hình cao điểm 16:00 - 18:00 (surgeMultiplier: 1.5)
      // Quá giờ 15:30 - 16:45 (3 blocks: 1 block thường + 2 block cao điểm)
      const bookingCrossingPeak: BookingItemDto = {
        ...baseBooking,
        expectedCheckOutTime: '2026-02-14T15:30:00',
        actualCheckOutTime: '2026-02-14T16:45:00',
        baseRatePerHour: 40000,
        overtimePenaltyMultiplier: 1.0,
        parkingSubtotal: 250000,
        surgeMultiplier: 1.5,
        surgeStartTime: '16:00',
        surgeEndTime: '18:00',
      }

      // Act:
      render(<TariffAuditTable booking={bookingCrossingPeak} />)

      // Assert:
      const penaltyRow = screen.getByTestId('overtime-penalty-row')
      expect(penaltyRow).toBeInTheDocument()
      // Hiển thị rõ số block áp dụng cao điểm
      expect(penaltyRow.textContent).toContain('2 block cao điểm × 1.5')
    })
  })
})
