import {
  vehicleLabels,
  type ApiDateTimeValue,
  type Booking,
  type VehicleType,
} from '@/entities/operations'
import { apiClient } from '@/shared/api/client'
import { getData, type Page } from '@/shared/api/resources'
import {
  DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  type BarrierTimelineEvent,
  type BookingBarrierSummary,
  type MerchantBookingLotOption,
} from '../types/merchantBookingsTypes'

export interface FetchMerchantBookingsParams {
  page: number
  size?: number
  parkingLotId?: number | null
}

export async function fetchMerchantBookingsApi({
  page,
  size = DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE,
  parkingLotId,
}: FetchMerchantBookingsParams): Promise<Page<Booking>> {
  const params: { page: number; size: number; parkingLotId?: number } = {
    page: Math.max(0, page),
    size: Math.max(1, size),
  }
  if (typeof parkingLotId === 'number' && Number.isFinite(parkingLotId) && parkingLotId > 0) {
    params.parkingLotId = parkingLotId
  }

  return getData<Page<Booking>>('/api/v1/merchant/bookings', params)
}

export async function fetchMerchantBookingDetailApi(id: string | number): Promise<Booking> {
  return getData<Booking>(`/api/v1/merchant/bookings/${id}`)
}

export interface MerchantBookingsSummaryData {
  items: Booking[]
  totalElements: number
}

export async function fetchMerchantBookingsSummarySafe(
  parkingLotId: number | null,
  signal?: AbortSignal,
): Promise<MerchantBookingsSummaryData | null> {
  try {
    const params: { page: number; size: number; parkingLotId?: number } = {
      page: 0,
      size: 500,
    }
    if (typeof parkingLotId === 'number' && Number.isFinite(parkingLotId) && parkingLotId > 0) {
      params.parkingLotId = parkingLotId
    }
    const res = await apiClient.get<{
      data?: { content?: unknown; totalElements?: unknown }
    }>('/api/v1/merchant/bookings', { params, signal })

    const payload = res.data?.data
    if (!payload || !Array.isArray(payload.content) || typeof payload.totalElements !== 'number') {
      return null
    }

    const validBookings = payload.content.every(
      (item): item is Booking =>
        Boolean(item) &&
        typeof item === 'object' &&
        typeof (item as Booking).bookingCode === 'string' &&
        typeof (item as Booking).status === 'string',
    )
    if (!validBookings) {
      return null
    }

    return {
      items: payload.content as Booking[],
      totalElements: payload.totalElements,
    }
  } catch {
    return null
  }
}

export async function fetchMerchantLotsFilterSafe(
  signal?: AbortSignal,
): Promise<MerchantBookingLotOption[]> {
  try {
    const res = await apiClient.get<{
      data?: { content?: Array<{ id?: unknown; name?: unknown }> }
    }>('/api/v1/merchant/parking-lots', {
      params: { page: 0, size: 100, sort: 'name,asc' },
      signal,
    })
    const rawContent = res.data?.data?.content
    if (!Array.isArray(rawContent)) return []
    const options: MerchantBookingLotOption[] = []
    for (const item of rawContent) {
      if (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'number' &&
        Number.isFinite(item.id) &&
        typeof item.name === 'string' &&
        item.name.trim()
      ) {
        options.push({ id: item.id, name: item.name.trim() })
      }
    }
    return options
  } catch {
    return []
  }
}

export function resolveBookingPlate(booking: Pick<Booking, 'vehicleLicensePlate' | 'vehiclePlate'>): string {
  return booking.vehicleLicensePlate?.trim() || booking.vehiclePlate?.trim() || '—'
}

export function resolveVehicleTypeLabel(vehicleType?: VehicleType | string | null): string {
  if (!vehicleType) return 'Không xác định'
  if (vehicleType in vehicleLabels) {
    return vehicleLabels[vehicleType as VehicleType]
  }
  return vehicleType
}

export function resolveBookingDriverName(booking: Booking): string | null {
  const candidate = booking.driverName?.trim() || booking.customerName?.trim()
  return candidate || null
}

export function resolveBookingDriverPhone(booking: Booking): string | null {
  const candidate = booking.driverPhone?.trim() || booking.customerPhone?.trim()
  return candidate || null
}

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function parseBookingDateTime(value: ApiDateTimeValue): Date | null {
  if (value === null || value === undefined) return null

  if (Array.isArray(value)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] = value
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
      return null
    }
    const parsed = new Date(year, month - 1, day, hour, minute, second)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

export function formatBookingDateTime(value: ApiDateTimeValue, fallback = '—'): string {
  const parsed = parseBookingDateTime(value)
  if (!parsed) return fallback
  return dateTimeFormatter.format(parsed)
}

export function formatBookingTimeOnly(value: ApiDateTimeValue): string | null {
  if (value === null || value === undefined) return null

  if (Array.isArray(value)) {
    const [hour = 0, minute = 0] = value
    if (typeof hour !== 'number' || typeof minute !== 'number') return null
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`
    }
    const parsed = parseBookingDateTime(trimmed)
    if (parsed) {
      return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
    }
    return trimmed
  }

  return null
}

export function formatBookingMoney(value: unknown, fallback = '—'): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

export function isActionableGateStatus(status?: string | null): boolean {
  return (
    status === 'PENDING_CHECKIN' ||
    status === 'PARKING' ||
    status === 'OVERTIME' ||
    status === 'AWAITING_FINAL_PAYMENT'
  )
}

export function parseValidBookingRouteId(rawId?: string | number | null): number | null {
  if (rawId === null || rawId === undefined) return null
  if (typeof rawId === 'number') {
    return Number.isSafeInteger(rawId) && rawId > 0 ? rawId : null
  }
  const trimmed = rawId.trim()
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

export function computeRemainingBookingAmount(
  booking: Pick<Booking, 'totalAmount' | 'advanceDeposit'>,
): number | null {
  if (
    typeof booking.totalAmount === 'number' &&
    Number.isFinite(booking.totalAmount) &&
    typeof booking.advanceDeposit === 'number' &&
    Number.isFinite(booking.advanceDeposit)
  ) {
    return Math.max(0, booking.totalAmount - booking.advanceDeposit)
  }
  return null
}

export function formatDurationMinutes(totalMinutes: number): string {
  const safeMinutes = Math.max(0, Math.round(totalMinutes))
  if (safeMinutes === 0) return 'Dưới 1 phút'
  const hours = Math.floor(safeMinutes / 60)
  const minutes = safeMinutes % 60
  if (hours === 0) return `${minutes} phút`
  if (minutes === 0) return `${hours} giờ`
  return `${hours} giờ ${minutes} phút`
}

function diffMinutes(from: Date | null, to: Date | null): number | null {
  if (!from || !to) return null
  return Math.round((to.getTime() - from.getTime()) / 60_000)
}

function resolveGateModeSummary(status?: string | null): string {
  switch (status) {
    case 'PENDING_PAYMENT':
      return 'Chờ tài xế hoàn tất thanh toán cọc'
    case 'PENDING_CHECKIN':
      return 'Đã cọc · Sẵn sàng quét QR mở barie vào bãi'
    case 'PARKING':
      return 'Xe đang đỗ trong bãi · Chờ lượt quét QR ra'
    case 'OVERTIME':
      return 'Xe lưu bãi quá giờ dự kiến · Cần quyết toán phụ phí'
    case 'AWAITING_FINAL_PAYMENT':
      return 'Đã quét ra · Chờ xác nhận thu tiền còn lại tại barie'
    case 'COMPLETED':
      return 'Đã quyết toán hoàn tất & giải phóng slot'
    case 'REVIEWED':
      return 'Đã quyết toán & ghi nhận đánh giá từ tài xế'
    case 'CANCELLED':
      return 'Đơn đã hủy · Không phát sinh lượt mở barie hoạt động'
    case 'EXPIRED':
      return 'Đã quá hạn giữ chỗ · Hệ thống tự động đóng đơn'
    default:
      return 'Theo dõi trạng thái vận hành tại trạm barie'
  }
}

export function buildBookingBarrierSummary(booking: Booking): BookingBarrierSummary {
  const events: BarrierTimelineEvent[] = []
  const status = booking.status
  const remainingAmount = computeRemainingBookingAmount(booking)

  const createdDate = parseBookingDateTime(booking.createdAt)
  const expiresDate = parseBookingDateTime(booking.expiresAt)
  const expectedInDate = parseBookingDateTime(booking.expectedCheckInTime)
  const expectedOutDate = parseBookingDateTime(booking.expectedCheckOutTime)
  const checkInDate = parseBookingDateTime(booking.checkInTime)
  const checkOutDate = parseBookingDateTime(booking.checkOutTime)
  const cancelledDate = parseBookingDateTime(booking.cancelledAt)

  const plannedMinutesRaw = diffMinutes(expectedInDate, expectedOutDate)
  const plannedDurationLabel =
    plannedMinutesRaw !== null && plannedMinutesRaw > 0
      ? formatDurationMinutes(plannedMinutesRaw)
      : null

  const actualMinutesRaw = diffMinutes(checkInDate, checkOutDate)
  const parkingDurationLabel =
    actualMinutesRaw !== null && actualMinutesRaw >= 0
      ? formatDurationMinutes(actualMinutesRaw)
      : null

  const checkInDeltaMin = diffMinutes(expectedInDate, checkInDate)
  let checkInVarianceLabel: string | null = null
  if (checkInDeltaMin !== null) {
    if (Math.abs(checkInDeltaMin) <= 5) {
      checkInVarianceLabel = 'Đúng giờ hẹn'
    } else if (checkInDeltaMin < 0) {
      checkInVarianceLabel = `Sớm ${formatDurationMinutes(Math.abs(checkInDeltaMin))}`
    } else {
      checkInVarianceLabel = `Trễ ${formatDurationMinutes(checkInDeltaMin)}`
    }
  }

  const checkOutDeltaMin = diffMinutes(expectedOutDate, checkOutDate)
  let checkOutVarianceLabel: string | null = null
  if (checkOutDeltaMin !== null) {
    if (Math.abs(checkOutDeltaMin) <= 5) {
      checkOutVarianceLabel = 'Rời đúng dự kiến'
    } else if (checkOutDeltaMin < 0) {
      checkOutVarianceLabel = `Rời sớm ${formatDurationMinutes(Math.abs(checkOutDeltaMin))}`
    } else {
      checkOutVarianceLabel = `Quá dự kiến ${formatDurationMinutes(checkOutDeltaMin)}`
    }
  }

  // 1. Khởi tạo đơn đặt chỗ
  events.push({
    id: 'created',
    category: 'BOOKING',
    tone: 'completed',
    title: 'Khởi tạo đơn đặt chỗ',
    timeMetaLabel: createdDate ? 'Thời điểm tạo đơn' : 'Ghi nhận hệ thống',
    timestampLabel: createdDate
      ? formatBookingDateTime(booking.createdAt)
      : 'Chưa ghi nhận mốc giờ',
    description: plannedDurationLabel
      ? `Hệ thống tiếp nhận yêu cầu giữ chỗ với thời lượng dự kiến ${plannedDurationLabel}.`
      : 'Hệ thống tiếp nhận yêu cầu giữ chỗ và khóa tạm thời vị trí đỗ.',
    deltaBadge: null,
  })

  // 2. Xác nhận cọc / Giữ chỗ
  if (status === 'PENDING_PAYMENT') {
    events.push({
      id: 'hold-pending',
      category: 'HOLD',
      tone: 'warning',
      title: 'Chờ thanh toán tiền cọc giữ chỗ',
      timeMetaLabel: expiresDate ? 'Hạn giữ chỗ' : 'Trạng thái cọc',
      timestampLabel: expiresDate
        ? formatBookingDateTime(booking.expiresAt)
        : 'Đang chờ giao dịch',
      description:
        'Tài xế chưa hoàn tất bước thanh toán cọc; vé QR chưa được kích hoạt để mở barie.',
      deltaBadge:
        typeof booking.advanceDeposit === 'number'
          ? {
              label: `Cọc yêu cầu ${formatBookingMoney(booking.advanceDeposit)}`,
              tone: 'warning',
            }
          : null,
    })
  } else if (status === 'EXPIRED' && !checkInDate && !cancelledDate) {
    events.push({
      id: 'hold-expired',
      category: 'HOLD',
      tone: 'danger',
      title: 'Hết hạn giữ chỗ / Thanh toán cọc',
      timeMetaLabel: 'Mốc hết hạn',
      timestampLabel: formatBookingDateTime(booking.expiresAt ?? booking.expectedCheckInTime),
      description:
        'Đơn quá thời hạn giữ chỗ trước khi check-in; hệ thống đã thu hồi slot về bãi.',
      deltaBadge: { label: 'Đã hết hạn', tone: 'danger' },
    })
  } else {
    events.push({
      id: 'hold-confirmed',
      category: 'HOLD',
      tone: 'completed',
      title: 'Xác nhận cọc & kích hoạt vé barie',
      timeMetaLabel: expiresDate ? 'Hiệu lực giữ chỗ' : 'Xác thực cọc',
      timestampLabel: expiresDate
        ? formatBookingDateTime(booking.expiresAt)
        : formatBookingDateTime(booking.createdAt, 'Đã kích hoạt'),
      description:
        'Khoản đặt cọc đã hợp lệ trên hệ thống; mã đặt chỗ đủ điều kiện quét QR tại cổng vào.',
      deltaBadge:
        typeof booking.advanceDeposit === 'number'
          ? {
              label: `Đã cọc ${formatBookingMoney(booking.advanceDeposit)}`,
              tone: 'success',
            }
          : null,
    })
  }

  // 3. Nếu đơn hủy trước khi vào bãi
  const cancelledBeforeCheckIn = (status === 'CANCELLED' || Boolean(cancelledDate)) && !checkInDate
  if (cancelledBeforeCheckIn) {
    const refundSummaryParts: string[] = []
    if (typeof booking.refundAmount === 'number') {
      refundSummaryParts.push(`Hoàn ${formatBookingMoney(booking.refundAmount)}`)
    }
    if (typeof booking.refundPercentage === 'number') {
      refundSummaryParts.push(`tỷ lệ ${booking.refundPercentage}%`)
    }
    events.push({
      id: 'cancelled',
      category: 'CANCELLED',
      tone: 'danger',
      title: 'Đơn đặt chỗ đã hủy trước khi vào bãi',
      timeMetaLabel: 'Thời điểm hủy',
      timestampLabel: formatBookingDateTime(booking.cancelledAt, 'Đã ghi nhận hủy'),
      description:
        refundSummaryParts.length > 0
          ? `Lượt đỗ bị hủy trước thời điểm mở barie (${refundSummaryParts.join(', ')}). Chi tiết lý do và mã đối soát nằm ở mục Hoàn tiền bên dưới.`
          : 'Lượt đỗ đã hủy trước khi quét QR vào bãi; hệ thống đã giải phóng chỗ đỗ.',
      deltaBadge: { label: 'Đã hủy đơn', tone: 'danger' },
    })

    return {
      events,
      parkingDurationLabel,
      plannedDurationLabel,
      checkInVarianceLabel,
      checkOutVarianceLabel,
      gateModeSummary: resolveGateModeSummary(status),
    }
  }

  // 4. Barie vào bãi (Check-in)
  if (checkInDate) {
    const isLate = checkInDeltaMin !== null && checkInDeltaMin > 5
    events.push({
      id: 'gate-check-in',
      category: 'GATE_IN',
      tone: isLate ? 'warning' : 'completed',
      title: 'Barie xác nhận xe vào bãi (Check-in)',
      timeMetaLabel: 'Thực tế qua cổng vào',
      timestampLabel: formatBookingDateTime(booking.checkInTime),
      description: expectedInDate
        ? `Chủ bãi đã xác nhận xe vào qua trạm QR. Giờ đến dự kiến ban đầu là ${formatBookingDateTime(booking.expectedCheckInTime)}.`
        : 'Chủ bãi đã xác nhận phương tiện vào bãi qua trạm kiểm soát QR.',
      deltaBadge: checkInVarianceLabel
        ? {
            label: checkInVarianceLabel,
            tone: isLate ? 'warning' : 'success',
          }
        : null,
    })
  } else if (status === 'PENDING_CHECKIN') {
    events.push({
      id: 'gate-check-in-pending',
      category: 'GATE_IN',
      tone: 'current',
      title: 'Chờ quét QR mở barie vào bãi',
      timeMetaLabel: 'Dự kiến đến bãi',
      timestampLabel: formatBookingDateTime(booking.expectedCheckInTime),
      description:
        'Phương tiện chưa check-in tại cổng. Quét mã QR hoặc nhập mã vé ở trạm kiểm soát khi xe tới bãi.',
      deltaBadge: { label: 'Chờ vào cổng', tone: 'warning' },
    })
  } else if (
    status === 'PARKING' ||
    status === 'OVERTIME' ||
    status === 'AWAITING_FINAL_PAYMENT' ||
    status === 'COMPLETED' ||
    status === 'REVIEWED'
  ) {
    events.push({
      id: 'gate-check-in-unrecorded',
      category: 'GATE_IN',
      tone: 'completed',
      title: 'Phương tiện đã qua cổng vào bãi',
      timeMetaLabel: 'Dự kiến đến',
      timestampLabel: formatBookingDateTime(booking.expectedCheckInTime),
      description:
        'Trạng thái đơn cho thấy đã check-in nhưng dữ liệu API không kèm mốc giờ thực tế.',
      deltaBadge: null,
    })
  }

  // 5. Lưu trú / Giám sát quá giờ
  if (status === 'OVERTIME') {
    events.push({
      id: 'parking-overtime',
      category: 'PARKING',
      tone: 'danger',
      title: 'Cảnh báo phương tiện đỗ quá giờ dự kiến',
      timeMetaLabel: 'Mốc dự kiến rời bãi',
      timestampLabel: formatBookingDateTime(booking.expectedCheckOutTime),
      description:
        'Xe đang lưu bãi vượt quá khung giờ đã đặt; phụ phí quá giờ sẽ được chốt khi quét QR check-out.',
      deltaBadge:
        typeof booking.overtimePenaltyMultiplier === 'number'
          ? { label: `Phạt quá giờ x${booking.overtimePenaltyMultiplier}`, tone: 'danger' }
          : { label: 'Quá giờ', tone: 'danger' },
    })
  } else if (status === 'PARKING') {
    events.push({
      id: 'parking-active',
      category: 'PARKING',
      tone: 'current',
      title: 'Phương tiện đang lưu trú trong bãi',
      timeMetaLabel: 'Dự kiến rời bãi',
      timestampLabel: formatBookingDateTime(booking.expectedCheckOutTime),
      description:
        'Vị trí đỗ đang được sử dụng. Khi xe ra cổng, thao tác XE RA tại trạm QR để tính cước cuối.',
      deltaBadge: { label: 'Đang đỗ', tone: 'neutral' },
    })
  }

  // 6. Barie ra bãi (Check-out)
  if (checkOutDate) {
    const isOvertimeExit = checkOutDeltaMin !== null && checkOutDeltaMin > 5
    events.push({
      id: 'gate-check-out',
      category: 'GATE_OUT',
      tone: isOvertimeExit ? 'warning' : 'completed',
      title: 'Barie xác nhận xe ra bãi (Check-out)',
      timeMetaLabel: 'Thực tế rời cổng',
      timestampLabel: formatBookingDateTime(booking.checkOutTime),
      description: parkingDurationLabel
        ? `Tổng thời gian lưu bãi thực tế là ${parkingDurationLabel} (dự kiến rời lúc ${formatBookingDateTime(booking.expectedCheckOutTime)}).`
        : `Đã xác nhận phương tiện rời cổng (dự kiến rời lúc ${formatBookingDateTime(booking.expectedCheckOutTime)}).`,
      deltaBadge: checkOutVarianceLabel
        ? {
            label: checkOutVarianceLabel,
            tone: isOvertimeExit ? 'warning' : 'success',
          }
        : null,
    })
  } else if (status === 'PARKING' || status === 'OVERTIME') {
    events.push({
      id: 'gate-check-out-upcoming',
      category: 'GATE_OUT',
      tone: 'upcoming',
      title: 'Chờ quét QR đóng lượt & mở barie ra',
      timeMetaLabel: 'Dự kiến rời bãi',
      timestampLabel: formatBookingDateTime(booking.expectedCheckOutTime),
      description:
        'Chưa ghi nhận lượt check-out. Hệ thống sẽ đối chiếu giờ ra và phụ phí ngay khi quét QR ra.',
      deltaBadge: null,
    })
  }

  // 7. Quyết toán cuối / Hủy sau check-in
  if (status === 'AWAITING_FINAL_PAYMENT') {
    events.push({
      id: 'settlement-cash-pending',
      category: 'SETTLEMENT',
      tone: 'warning',
      title: 'Chờ xác nhận thu phần cước còn lại tại barie',
      timeMetaLabel: 'Từ lúc check-out',
      timestampLabel: formatBookingDateTime(booking.checkOutTime, 'Đang chờ thu tiền'),
      description:
        remainingAmount !== null
          ? `Xe đã check-out; cần xác nhận thu đủ ${formatBookingMoney(remainingAmount)} tại trạm QR để hoàn tất và trả slot.`
          : 'Xe đã check-out; cần xác nhận thu phần tiền còn thiếu tại trạm kiểm soát QR.',
      deltaBadge:
        remainingAmount !== null
          ? { label: `Còn thu ${formatBookingMoney(remainingAmount)}`, tone: 'warning' }
          : { label: 'Chờ thu tiền mặt', tone: 'warning' },
    })
  } else if (status === 'COMPLETED' || status === 'REVIEWED') {
    events.push({
      id: 'settlement-completed',
      category: 'SETTLEMENT',
      tone: 'completed',
      title: 'Hoàn tất quyết toán & giải phóng chỗ đỗ',
      timeMetaLabel: checkOutDate ? 'Hoàn tất sau check-out' : 'Trạng thái cuối',
      timestampLabel: formatBookingDateTime(booking.checkOutTime, 'Đã hoàn tất'),
      description:
        status === 'REVIEWED'
          ? 'Doanh thu lượt đỗ đã được chốt, chỗ đỗ trả về bãi và tài xế đã hoàn thành đánh giá.'
          : 'Khoản cước đã được tất toán đầy đủ và vị trí đỗ đã giải phóng cho xe kế tiếp.',
      deltaBadge: {
        label: status === 'REVIEWED' ? 'Đã đánh giá' : 'Đã tất toán',
        tone: 'success',
      },
    })
  } else if (status === 'CANCELLED' || Boolean(cancelledDate)) {
    events.push({
      id: 'cancelled-after-gate',
      category: 'CANCELLED',
      tone: 'danger',
      title: 'Đơn được chuyển trạng thái hủy & đối soát hoàn tiền',
      timeMetaLabel: 'Thời điểm hủy',
      timestampLabel: formatBookingDateTime(booking.cancelledAt, 'Đã hủy'),
      description:
        'Đơn đã kết thúc theo luồng hủy; xem thông tin hoàn tiền chi tiết ở khối Biểu phí & Hoàn tiền.',
      deltaBadge: { label: 'Đã hủy đơn', tone: 'danger' },
    })
  }

  return {
    events,
    parkingDurationLabel,
    plannedDurationLabel,
    checkInVarianceLabel,
    checkOutVarianceLabel,
    gateModeSummary: resolveGateModeSummary(status),
  }
}
