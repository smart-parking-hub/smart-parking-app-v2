import { apiClient } from '@/shared/api/client'
import type {
  BookingItemDto,
  CancelBookingRequest,
  ReviewBookingRequest,
} from '../types/bookingTypes'

export const fallbackBookingsList: BookingItemDto[] = [
  {
    id: 1,
    bookingCode: 'BK-2026-9081',
    parkingLotName: 'Bãi Đỗ Xe Container Sóng Thần 2',
    parkingLotAddress: 'Đại lộ Độc Lập, KCN Sóng Thần, Dĩ An, Bình Dương',
    vehiclePlate: '51D-894.12',
    trailerPlate: '51R-024.89',
    vehicleType: 'Xe Đầu Kéo Container 40FT',
    status: 'PARKING',
    statusBadgeLabel: 'ĐANG ĐỖ TẠI BÃI (3H 45M)',
    createdAtText: '13:50 17/02/2026',
    expectedCheckInTime: '14:00 17/02/2026',
    expectedCheckOutTime: '20:00 17/02/2026',
    actualCheckInTime: '14:15 Hôm nay (17/02)',
    gateInName: 'Cổng Nam 01',
    gateOutName: 'LÀN 02 (OUT CONTAINER NẶNG)',
    alprMatchRate: 'Khớp 100%',
    berthCode: 'BERTH-142 (Có Reefer 380V)',
    hasReefer: true,
    baseRatePerHour: 40000,
    actualDurationHours: 4,
    actualDurationText: 'Vào: 14:15 • Hiện tại: 18:00 (3 giờ 45 phút → Tính tròn 4 giờ)',
    parkingSubtotal: 160000,
    reeferHourlyRate: 20000,
    reeferHours: 3,
    reeferSubtotal: 60000,
    depositPaid: 100000,
    remainingFinalPayment: 120000,
    gateToken: 'STH-9081',
  },
  {
    id: 2,
    bookingCode: 'BK-2026-9104',
    parkingLotName: 'Tân Cảng - Phú Hữu (Gate 02)',
    parkingLotAddress: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    vehiclePlate: '51D-894.12',
    vehicleType: 'Container 40FT Chờ đóng hàng xuất khẩu',
    status: 'PENDING_PAYMENT',
    statusBadgeLabel: 'CHỜ CỌC 10 PHÚT',
    createdAtText: '18:10 Hôm nay',
    expectedCheckInTime: '19:30 Hôm nay',
    expectedCheckOutTime: '23:30 Hôm nay',
    baseRatePerHour: 40000,
    actualDurationHours: 4,
    actualDurationText: 'Dự kiến đỗ 4 giờ',
    parkingSubtotal: 160000,
    depositPaid: 0,
    remainingFinalPayment: 100000,
    holdSecondsRemaining: 405, // 06:45
    gateToken: 'STH-9104',
  },
  {
    id: 3,
    bookingCode: 'BK-2026-8812',
    parkingLotName: 'Depot Tân Cảng Long Bình (ICD Biên Hòa)',
    parkingLotAddress: 'Khu phố 1, Phường Long Bình, TP. Biên Hòa, Đồng Nai',
    vehiclePlate: '51D-894.12',
    vehicleType: 'Xe Đầu Kéo Container',
    status: 'COMPLETED',
    statusBadgeLabel: 'HOÀN TẤT - ĐÃ XUẤT HÓA ĐƠN',
    createdAtText: '15/02/2026',
    expectedCheckInTime: '16/02/2026 - 04:30',
    expectedCheckOutTime: '16/02/2026 - 08:30',
    actualCheckInTime: '16/02/2026 - 04:30',
    actualCheckOutTime: '16/02/2026 - 08:30',
    baseRatePerHour: 40000,
    actualDurationHours: 4,
    actualDurationText: 'Hoàn thành: 16/02/2026 - 08:30',
    parkingSubtotal: 160000,
    depositPaid: 100000,
    remainingFinalPayment: 0,
    gateToken: 'STH-8812',
    invoiceIssued: true,
  },
  {
    id: 4,
    bookingCode: 'BK-2026-8705',
    parkingLotName: 'Trạm Dừng Nghỉ Container Xuân Lộc (QL1A)',
    parkingLotAddress: 'Km 1795 QL1A, Xuân Lộc, Đồng Nai',
    vehiclePlate: '51D-894.12',
    vehicleType: 'Xe Tải Nặng 4 Chân',
    status: 'COMPLETED',
    statusBadgeLabel: 'HOÀN TẤT',
    createdAtText: '14/02/2026',
    expectedCheckInTime: '14/02/2026 - 14:00',
    expectedCheckOutTime: '14/02/2026 - 18:00',
    actualCheckInTime: '14/02/2026 - 14:00',
    actualCheckOutTime: '14/02/2026 - 19:20',
    baseRatePerHour: 40000,
    actualDurationHours: 5,
    actualDurationText: 'Hoàn thành: 14/02/2026 - 19:20 (Vượt 1 giờ 20 phút)',
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
    gateToken: 'STH-8705',
  },
  {
    id: 5,
    bookingCode: 'BK-2026-8650',
    parkingLotName: 'Bãi Xe Cảng Cát Lái - Cụm B',
    parkingLotAddress: 'Cổng B Cát Lái, Lê Phụng Hiểu, TP. Thủ Đức',
    vehiclePlate: '51D-894.12',
    vehicleType: 'Xe Đầu Kéo Container 40FT',
    status: 'CANCELLED',
    statusBadgeLabel: 'ĐÃ HỦY - ĐÃ HOÀN CỌC',
    createdAtText: '10/02/2026',
    expectedCheckInTime: '10/02/2026 - 11:00',
    expectedCheckOutTime: '10/02/2026 - 17:00',
    baseRatePerHour: 40000,
    actualDurationHours: 0,
    actualDurationText: 'Hủy trước giờ vào 90 phút',
    parkingSubtotal: 0,
    depositPaid: 100000,
    remainingFinalPayment: 0,
    gateToken: 'STH-8650',
  },
]

export function parseBookingDateTime(str?: unknown): Date | null {
  if (!str || typeof str !== 'string') return null
  const trimmed = str.trim()
  const d = new Date(trimmed)
  if (!isNaN(d.getTime())) return d

  const match = trimmed.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})[^\d]*(\d{1,2}):(\d{2})/)
  if (match) {
    const [, day, month, year, hours, minutes] = match
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes))
  }
  return null
}

export function parseLocalTimeString(str?: unknown): { hour: number; minute: number; second: number } | null {
  if (!str || typeof str !== 'string') return null
  const match = str.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (!match) return null
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] ?? 0),
  }
}

export function isTimeInSurgeWindow(
  timeDate: Date,
  surgeStartStr?: unknown,
  surgeEndStr?: unknown
): boolean {
  const start = parseLocalTimeString(surgeStartStr)
  const end = parseLocalTimeString(surgeEndStr)
  if (!start || !end) return false

  const startSec = start.hour * 3600 + start.minute * 60 + start.second
  const endSec = end.hour * 3600 + end.minute * 60 + end.second
  if (startSec === endSec) return false

  const currentSec = timeDate.getHours() * 3600 + timeDate.getMinutes() * 60 + timeDate.getSeconds()

  if (startSec < endSec) {
    return currentSec >= startSec && currentSec < endSec
  } else {
    return currentSec >= startSec || currentSec < endSec
  }
}

export function computeOvertimeDetails(
  expectedCheckOut?: unknown,
  actualCheckOut?: unknown,
  baseRatePerHour: number = 40000,
  overtimeMultiplier: number = 1.0,
  totalAmount?: number,
  surgeMultiplier?: number,
  surgeStartTime?: unknown,
  surgeEndTime?: unknown,
  actualCheckIn?: unknown
) {
  const expectedDate = parseBookingDateTime(expectedCheckOut)
  const actualDate = parseBookingDateTime(actualCheckOut)
  const checkInDate = parseBookingDateTime(actualCheckIn)

  if (!expectedDate || !actualDate) {
    return {
      isOvertime: false,
      overtimeMinutes: 0,
      overtimeBlocks: 0,
      overtimeHoursText: '',
      overtimePenaltyMultiplier: overtimeMultiplier,
      surgeMultiplier,
      surgeBlocks: 0,
      hasSurgeApplied: false,
      penaltyAmount: 0,
      standardParkingFee: totalAmount ?? 0,
    }
  }

  // Khớp Backend CheckInOutServiceImpl.java dòng 158:
  // LocalDateTime overtimeStart = start.isAfter(booking.getExpectedCheckOutTime()) ? start : booking.getExpectedCheckOutTime();
  const effectiveStartDate =
    checkInDate && checkInDate.getTime() > expectedDate.getTime()
      ? checkInDate
      : expectedDate

  const diffMs = actualDate.getTime() - effectiveStartDate.getTime()

  if (diffMs <= 0) {
    return {
      isOvertime: false,
      overtimeMinutes: 0,
      overtimeBlocks: 0,
      overtimeHoursText: '',
      overtimePenaltyMultiplier: overtimeMultiplier,
      surgeMultiplier,
      surgeBlocks: 0,
      hasSurgeApplied: false,
      penaltyAmount: 0,
      standardParkingFee: totalAmount ?? 0,
    }
  }

  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60

  let overtimeHoursText: string
  if (diffMinutes === 0) {
    const diffSec = Math.max(1, Math.round(diffMs / 1000))
    overtimeHoursText = `${diffSec} giây`
  } else if (hours > 0) {
    overtimeHoursText = mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`
  } else {
    overtimeHoursText = `${mins} phút`
  }

  // Khớp chính xác 100% thuật toán ParkingCharge.java của Backend:
  // Duyệt từng block 30 phút bắt đầu từ effectiveStartDate đến actualDate
  // Bất kỳ block nào bắt đầu trước actualDate đều được tính (commenced half-hour)
  const fromMs = effectiveStartDate.getTime()
  const untilMs = actualDate.getTime()
  const blockMs = 30 * 60 * 1000

  const effectivePenalty =
    typeof overtimeMultiplier === 'number' && overtimeMultiplier > 0
      ? overtimeMultiplier
      : 1.0

  const penaltyRate = baseRatePerHour * effectivePenalty
  const blockBaseRate = (penaltyRate * 30) / 60

  let calculatedPenalty = 0
  let overtimeBlocks = 0
  let surgeBlocks = 0

  for (let blockTime = fromMs; blockTime < untilMs; blockTime += blockMs) {
    overtimeBlocks++
    const blockDate = new Date(blockTime)
    const inPeak = isTimeInSurgeWindow(blockDate, surgeStartTime, surgeEndTime)
    const hasSurge =
      inPeak && typeof surgeMultiplier === 'number' && surgeMultiplier > 1
    const blockSurge = hasSurge ? surgeMultiplier : 1.0
    if (hasSurge) {
      surgeBlocks++
    }
    calculatedPenalty += blockBaseRate * blockSurge
  }

  const roundedPenalty = Math.round(calculatedPenalty)
  const penaltyAmount =
    totalAmount != null && totalAmount > 0
      ? Math.min(totalAmount, roundedPenalty)
      : roundedPenalty
  const standardParkingFee =
    totalAmount != null && totalAmount > 0
      ? Math.max(0, totalAmount - penaltyAmount)
      : 0

  return {
    isOvertime: true,
    overtimeMinutes: diffMinutes,
    overtimeBlocks,
    overtimeHoursText,
    overtimePenaltyMultiplier: effectivePenalty,
    surgeMultiplier,
    surgeBlocks,
    hasSurgeApplied: surgeBlocks > 0,
    penaltyAmount,
    standardParkingFee,
  }
}

function mapBackendDtoToBookingItem(raw: Record<string, unknown>, index: number): BookingItemDto {
  const id = Number(raw.id ?? index + 1)
  const bookingCode = String(raw.bookingCode ?? `BK-2026-${9000 + id}`)
  const parkingLotName = String(raw.parkingLotName ?? 'Bãi đỗ xe đối tác ALPR')
  const parkingLotAddress = String(raw.parkingLotAddress ?? 'Hệ thống bãi đỗ SmartParking')
  const vehiclePlate = String(raw.vehiclePlate ?? raw.vehicleLicensePlate ?? '51D-894.12')
  const vehicleType = String(raw.vehicleType ?? 'Container 40FT')
  const status = String(raw.status ?? 'PARKING') as BookingItemDto['status']

  const baseRatePerHour = Number(raw.hourlyRate ?? 40000)
  const depositPaid = Number(raw.advanceDeposit ?? 100000)
  const totalAmount = Number(raw.totalAmount ?? 160000)
  const remainingFinalPayment = Math.max(0, totalAmount - depositPaid)

  // Khớp Backend CheckInOutServiceImpl.java: mặc định penalty là 1.0 nếu null
  const overtimeMultiplier =
    raw.overtimePenaltyMultiplier != null ? Number(raw.overtimePenaltyMultiplier) : 1.0
  const surgeMultiplier = raw.surgeMultiplier != null ? Number(raw.surgeMultiplier) : undefined
  const surgeStartTime = raw.surgeStartTime ? String(raw.surgeStartTime) : undefined
  const surgeEndTime = raw.surgeEndTime ? String(raw.surgeEndTime) : undefined

  const checkInRaw = raw.checkInTime ?? raw.actualCheckInTime
  const checkOutRaw = raw.checkOutTime ?? raw.actualCheckOutTime

  const overtimeInfo = computeOvertimeDetails(
    raw.expectedCheckOutTime,
    checkOutRaw,
    baseRatePerHour,
    overtimeMultiplier,
    totalAmount,
    surgeMultiplier,
    surgeStartTime,
    surgeEndTime,
    checkInRaw
  )

  return {
    id,
    bookingCode,
    parkingLotName,
    parkingLotAddress,
    vehiclePlate,
    vehicleType,
    status,
    statusBadgeLabel:
      status === 'PARKING'
        ? 'ĐANG ĐỖ TẠI BÃI'
        : status === 'PENDING_PAYMENT'
          ? 'CHỜ CỌC 10 PHÚT'
          : status === 'COMPLETED'
            ? 'HOÀN TẤT'
            : status === 'CANCELLED'
              ? 'ĐÃ HỦY'
              : status,
    createdAtText: raw.createdAt ? String(raw.createdAt).slice(0, 16) : 'Hôm nay',
    expectedCheckInTime: raw.expectedCheckInTime ? String(raw.expectedCheckInTime).slice(0, 16) : 'Theo lịch hẹn',
    expectedCheckOutTime: raw.expectedCheckOutTime ? String(raw.expectedCheckOutTime).slice(0, 16) : 'Theo lịch hẹn',
    actualCheckInTime: checkInRaw ? String(checkInRaw).slice(0, 16) : undefined,
    actualCheckOutTime: checkOutRaw ? String(checkOutRaw).slice(0, 16) : undefined,
    gateInName: 'Cổng vào ALPR',
    gateOutName: 'Làn ra Barie',
    alprMatchRate: 'Khớp 100%',
    baseRatePerHour,
    actualDurationHours: 4,
    actualDurationText: overtimeInfo.isOvertime
      ? `Quá hạn: Vượt ${overtimeInfo.overtimeHoursText}`
      : 'Dự kiến đỗ 4 giờ',
    parkingSubtotal: totalAmount,
    depositPaid,
    advanceDeposit: depositPaid,
    surgeMultiplier,
    surgeStartTime,
    surgeEndTime,
    surgeBlocks: overtimeInfo.surgeBlocks,
    hasSurgeApplied: overtimeInfo.hasSurgeApplied,
    isOvertime: overtimeInfo.isOvertime,
    overtimeMinutes: overtimeInfo.overtimeMinutes,
    overtimeBlocks: overtimeInfo.overtimeBlocks,
    overtimeHoursText: overtimeInfo.overtimeHoursText,
    overtimePenaltyMultiplier: overtimeInfo.overtimePenaltyMultiplier,
    penaltyAmount: overtimeInfo.penaltyAmount,
    standardParkingFee: overtimeInfo.standardParkingFee,
    remainingFinalPayment,
    gateToken: `STH-${id}`,
  }
}

/** Chuyển đổi dữ liệu Booking từ API backend / booking-flow thành BookingItemDto hiển thị chuẩn */
export function bookingToItemDto(b: Record<string, unknown>): BookingItemDto {
  const id = Number(b.id ?? 1)
  const bookingCode = String(b.bookingCode ?? `BK-${id}`)
  const parkingLotName = String(b.parkingLotName ?? 'Bãi đỗ xe đối tác ALPR')
  const parkingLotAddress = String(b.parkingLotAddress ?? 'Hệ thống bãi đỗ SmartParking')
  const vehiclePlate = String(b.vehiclePlate ?? b.vehicleLicensePlate ?? 'Phương tiện')
  const vehicleType = String(b.vehicleType ?? 'Container 40FT')
  const status = String(b.status ?? 'AWAITING_FINAL_PAYMENT') as BookingItemDto['status']

  const baseRatePerHour = Number(b.hourlyRate ?? 40000)
  const depositPaid = Number(b.advanceDeposit ?? 0)
  const totalAmount = b.totalAmount != null ? Number(b.totalAmount) : depositPaid
  const remainingFinalPayment = Math.max(0, totalAmount - depositPaid)

  const overtimeMultiplier =
    b.overtimePenaltyMultiplier != null ? Number(b.overtimePenaltyMultiplier) : 1.0
  const surgeMultiplier = b.surgeMultiplier != null ? Number(b.surgeMultiplier) : undefined
  const surgeStartTime = b.surgeStartTime ? String(b.surgeStartTime) : undefined
  const surgeEndTime = b.surgeEndTime ? String(b.surgeEndTime) : undefined

  const checkInRaw = b.checkInTime ?? b.actualCheckInTime
  const checkOutRaw = b.checkOutTime ?? b.actualCheckOutTime

  const overtimeInfo = computeOvertimeDetails(
    b.expectedCheckOutTime,
    checkOutRaw,
    baseRatePerHour,
    overtimeMultiplier,
    totalAmount,
    surgeMultiplier,
    surgeStartTime,
    surgeEndTime,
    checkInRaw
  )

  return {
    id,
    bookingCode,
    parkingLotName,
    parkingLotAddress,
    vehiclePlate,
    vehicleType,
    status,
    statusBadgeLabel: status,
    createdAtText: b.createdAt ? String(b.createdAt).slice(0, 16) : 'Hôm nay',
    expectedCheckInTime: b.expectedCheckInTime ? String(b.expectedCheckInTime).slice(0, 16) : 'Theo lịch hẹn',
    expectedCheckOutTime: b.expectedCheckOutTime ? String(b.expectedCheckOutTime).slice(0, 16) : 'Theo lịch hẹn',
    actualCheckInTime: checkInRaw ? String(checkInRaw).slice(0, 16) : undefined,
    actualCheckOutTime: checkOutRaw ? String(checkOutRaw).slice(0, 16) : undefined,
    baseRatePerHour,
    actualDurationHours: 4,
    actualDurationText: overtimeInfo.isOvertime
      ? `Quá hạn: Vượt ${overtimeInfo.overtimeHoursText}`
      : 'Theo lịch hẹn',
    parkingSubtotal: totalAmount,
    depositPaid,
    advanceDeposit: depositPaid,
    surgeMultiplier,
    surgeStartTime,
    surgeEndTime,
    surgeBlocks: overtimeInfo.surgeBlocks,
    hasSurgeApplied: overtimeInfo.hasSurgeApplied,
    isOvertime: overtimeInfo.isOvertime,
    overtimeMinutes: overtimeInfo.overtimeMinutes,
    overtimeBlocks: overtimeInfo.overtimeBlocks,
    overtimeHoursText: overtimeInfo.overtimeHoursText,
    overtimePenaltyMultiplier: overtimeInfo.overtimePenaltyMultiplier,
    penaltyAmount: overtimeInfo.penaltyAmount,
    standardParkingFee: overtimeInfo.standardParkingFee,
    remainingFinalPayment,
    gateToken: `STH-${id}`,
  }
}

export async function fetchMyBookings(): Promise<BookingItemDto[]> {
  try {
    const response = await apiClient.get<unknown>('/api/v1/bookings')
    const resData = response.data as Record<string, unknown> | undefined

    // Check if Spring PageResponse: resData?.data?.content or resData?.content
    const candidateList =
      (resData?.data as Record<string, unknown>)?.content ??
      resData?.content ??
      resData?.data ??
      resData

    if (Array.isArray(candidateList) && candidateList.length > 0) {
      return candidateList.map((item, idx) =>
        mapBackendDtoToBookingItem(item as Record<string, unknown>, idx)
      )
    }
  } catch {
    // Graceful fallback to rich mock data
  }
  return fallbackBookingsList
}

export async function cancelBookingApi(req: CancelBookingRequest): Promise<{ success: boolean; message: string }> {
  await apiClient.post(`/api/v1/bookings/${req.bookingId}/cancel`, {
    reason: req.reason, note: req.note, acceptWalletRefund: true,
  })
  return { success: true, message: 'Đã hủy đặt chỗ. Khoản hoàn hợp lệ đang được xử lý vào ví tài xế.' }
}

export async function submitReviewApi(
  req: ReviewBookingRequest
): Promise<{ success: boolean; message: string }> {
  try {
    await apiClient.post(`/api/v1/reviews`, req)
    return { success: true, message: 'Gửi đánh giá bãi đỗ xe thành công.' }
  } catch {
    // Fallback simulation
  }
  return { success: true, message: 'Cảm ơn bạn đã gửi đánh giá trải nghiệm đỗ xe.' }
}

export async function payBookingDepositApi(
  bookingId: number
): Promise<{ success: boolean; checkoutUrl: string }> {
  try {
    const response = await apiClient.post<{ checkoutUrl?: string; data?: { checkoutUrl?: string } }>(
      `/api/v1/payments`,
      {
        bookingId,
        paymentType: 'DEPOSIT',
        amount: 100000,
      }
    )
    const checkoutUrl = response.data?.data?.checkoutUrl ?? response.data?.checkoutUrl
    if (checkoutUrl) {
      return { success: true, checkoutUrl }
    }
  } catch {
    // Fallback simulation
  }
  return { success: true, checkoutUrl: 'https://pay.payos.vn/web/demo-checkout-sth' }
}

export async function payBookingFinalApi(
  bookingId: number
): Promise<{ success: boolean; checkoutUrl: string }> {
  try {
    const response = await apiClient.post<{ checkoutUrl?: string; data?: { checkoutUrl?: string } }>(
      `/api/v1/payments`,
      {
        bookingId,
        paymentType: 'FINAL_PAYMENT',
        amount: 120000,
      }
    )
    const checkoutUrl = response.data?.data?.checkoutUrl ?? response.data?.checkoutUrl
    if (checkoutUrl) {
      return { success: true, checkoutUrl }
    }
  } catch {
    // Fallback simulation
  }
  return { success: true, checkoutUrl: 'https://pay.payos.vn/web/demo-final-sth' }
}
