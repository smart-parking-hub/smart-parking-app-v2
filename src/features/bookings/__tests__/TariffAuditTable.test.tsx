import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TariffAuditTable } from '../components/TariffAuditTable'
import { computeOvertimeDetails, parseBookingDateTime } from '../api/bookingApi'
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

  it('renders highlighted overtime penalty row with formula and multiplier when booking is overtime', () => {
    // Arrange
    const overtimeBooking: BookingItemDto = {
      ...baseBooking,
      expectedCheckOutTime: '14:00 14/02/2026',
      actualCheckOutTime: '15:20 14/02/2026',
      isOvertime: true,
      overtimeMinutes: 80,
      overtimeHoursText: '1 giờ 20 phút',
      overtimePenaltyMultiplier: 1.5,
      penaltyAmount: 80000,
      standardParkingFee: 160000,
      parkingSubtotal: 240000,
      depositPaid: 40000,
      remainingFinalPayment: 200000,
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

    // Formula & Amount
    expect(screen.getAllByText(/\+80\.000 đ/).length).toBe(2)
    expect(
      screen.getByText(/Công thức: Vượt 1 giờ 20 phút \(Hệ số phạt 1\.5× giá cơ bản 40\.000 đ\/h\) = \+80\.000 đ/)
    ).toBeInTheDocument()

    // Separated Standard Fee Row
    expect(screen.getByText('Tiền đỗ tiêu chuẩn (trong hạn)')).toBeInTheDocument()
    expect(screen.getByText('160.000 đ')).toBeInTheDocument()

    // Total footer with overtime notice
    expect(screen.getByText(/Đã bao gồm phụ phí đỗ quá giờ/)).toBeInTheDocument()
    expect(screen.getByText('200.000 đ')).toBeInTheDocument()
  })

  it('automatically calculates overtime if timestamps are provided without precomputed flags', () => {
    // Arrange
    const rawTimesBooking: BookingItemDto = {
      ...baseBooking,
      expectedCheckOutTime: '2026-02-14T14:00:00',
      actualCheckOutTime: '2026-02-14T15:20:00',
      baseRatePerHour: 40000,
      parkingSubtotal: 240000,
      depositPaid: 40000,
      remainingFinalPayment: 200000,
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

  describe('computeOvertimeDetails & parseBookingDateTime helpers', () => {
    it('parses both ISO format and VN slashed datetime format', () => {
      const iso = parseBookingDateTime('2026-02-14T14:00:00')
      expect(iso).not.toBeNull()
      expect(iso?.getFullYear()).toBe(2026)

      const vn = parseBookingDateTime('14/02/2026 - 15:20')
      expect(vn).not.toBeNull()
      expect(vn?.getFullYear()).toBe(2026)
      expect(vn?.getHours()).toBe(15)
      expect(vn?.getMinutes()).toBe(20)
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

    it('calculates 30-minute block commenced overtime correctly for 80 minutes', () => {
      // 80 minutes = 3 half-hour blocks (30m, 30m, 20m -> 3 blocks)
      // Rate = 40,000 * 1.5 = 60,000/h. Each 30m block = 30,000.
      // 3 blocks * 30,000 = 90,000 -> capped at totalAmount or formula
      const result = computeOvertimeDetails(
        '2026-02-14T14:00:00',
        '2026-02-14T15:20:00',
        40000,
        1.5,
        250000
      )
      expect(result.isOvertime).toBe(true)
      expect(result.overtimeMinutes).toBe(80)
      expect(result.overtimeHoursText).toBe('1 giờ 20 phút')
      expect(result.penaltyAmount).toBe(90000)
    })
  })
})
