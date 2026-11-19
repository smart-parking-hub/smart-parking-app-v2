import { describe, it, expect } from 'vitest'
import {
  formatNotificationTime,
  mapNotificationDto,
  normalizeNotificationType,
  parseNotificationDate,
  resolveNotificationAction,
} from '../lib/notificationMapper'

describe('entities/notification mapper & deep-link resolver', () => {
  it('normalizes known Backend NotificationTypeEnum values and falls back to SYSTEM', () => {
    expect(normalizeNotificationType('BOOKING')).toBe('BOOKING')
    expect(normalizeNotificationType('queue')).toBe('QUEUE')
    expect(normalizeNotificationType('PAYMENT')).toBe('PAYMENT')
    expect(normalizeNotificationType('SYSTEM')).toBe('SYSTEM')
    expect(normalizeNotificationType('UNKNOWN_TYPE')).toBe('SYSTEM')
    expect(normalizeNotificationType(null)).toBe('SYSTEM')
  })

  it('parses both ISO strings and Jackson LocalDateTime arrays cleanly', () => {
    const isoDate = parseNotificationDate('2026-11-04T15:48:12Z')
    expect(isoDate).toBeInstanceOf(Date)

    const arrayDate = parseNotificationDate([2026, 11, 4, 14, 15, 30])
    expect(arrayDate).toBeInstanceOf(Date)
    expect(arrayDate?.getFullYear()).toBe(2026)
    expect(arrayDate?.getMonth()).toBe(10)
    expect(arrayDate?.getDate()).toBe(4)

    expect(formatNotificationTime([2026, 11, 4, 14, 15, 0])).toContain('04/11/2026')
    expect(formatNotificationTime(null)).toBe('—')
  })

  it('resolves outbound deep links only when explicit targetType & positive targetId justify navigation', () => {
    expect(resolveNotificationAction('QUEUE', 701, 'QUEUE')).toEqual(
      expect.objectContaining({
        label: 'Đến hàng đợi',
        path: '/queues',
        state: { targetQueueId: 701 },
      }),
    )

    expect(resolveNotificationAction('BOOKING', 8821, 'BOOKING')).toEqual(
      expect.objectContaining({
        label: 'Xem đặt chỗ',
        path: '/bookings',
        state: { highlightBookingId: 8821 },
      }),
    )

    expect(resolveNotificationAction('BOOKING', 23, 'PAYMENT')).toEqual(
      expect.objectContaining({
        label: 'Xem lịch sử thanh toán',
        path: '/payments',
      }),
    )

    expect(resolveNotificationAction('WALLET', 12, 'PAYMENT')).toEqual(
      expect.objectContaining({
        label: 'Xem lịch sử thanh toán',
        path: '/payments',
      }),
    )

    expect(resolveNotificationAction('PARKING_LOT', 15, 'SYSTEM')).toEqual(
      expect.objectContaining({
        label: 'Xem bãi đỗ',
        path: '/parking/15',
      }),
    )

    expect(resolveNotificationAction('DISPUTE', 55, 'SYSTEM')).toEqual(
      expect.objectContaining({
        label: 'Xem khiếu nại',
        path: '/disputes/55',
      }),
    )

    // System / Promo / Missing target should NOT synthesize fake "Xem đặt chỗ" links
    expect(resolveNotificationAction('BOOKING', 27, 'SYSTEM')).toBeNull()
    expect(resolveNotificationAction(null, null, 'BOOKING')).toBeNull()
    expect(resolveNotificationAction('BOOKING', null, 'BOOKING')).toBeNull()
    expect(resolveNotificationAction('USER_WARNING', 10, 'SYSTEM')).toBeNull()
  })

  it('resolves role-specific deep links when user is MERCHANT', () => {
    expect(resolveNotificationAction('BOOKING', 8821, 'BOOKING', 'MERCHANT')).toEqual(
      expect.objectContaining({
        label: 'Xem chi tiết đơn đặt',
        path: '/merchant/bookings/8821',
        state: { highlightBookingId: 8821 },
      }),
    )

    expect(resolveNotificationAction('BOOKING', 23, 'PAYMENT', 'MERCHANT')).toEqual(
      expect.objectContaining({
        label: 'Xem lịch sử thanh toán',
        path: '/merchant/revenue',
      }),
    )

    expect(resolveNotificationAction('PARKING_LOT', 15, 'SYSTEM', 'MERCHANT')).toEqual(
      expect.objectContaining({
        label: 'Xem bãi đỗ',
        path: '/merchant/parking-lots/15',
      }),
    )

    expect(resolveNotificationAction('DISPUTE', 55, 'SYSTEM', 'MERCHANT')).toEqual(
      expect.objectContaining({
        label: 'Xem khiếu nại',
        path: '/merchant/disputes/55',
      }),
    )
  })

  it('maps BackendNotificationDto into NotificationViewModel preserving read status and action', () => {
    const viewModel = mapNotificationDto({
      id: 42,
      userId: 5,
      title: '  Slot trống tại Depot Cát Lái  ',
      content: '  Mời xe vào cổng Gate 2  ',
      channel: 'PUSH',
      type: 'QUEUE',
      targetType: 'QUEUE',
      targetId: 909,
      readAt: null,
      createdAt: [2026, 11, 4, 16, 0, 0],
    })

    expect(viewModel.title).toBe('Slot trống tại Depot Cát Lái')
    expect(viewModel.content).toBe('Mời xe vào cổng Gate 2')
    expect(viewModel.isUnread).toBe(true)
    expect(viewModel.type).toBe('QUEUE')
    expect(viewModel.typeLabel).toBe('Hàng đợi ảo')
    expect(viewModel.action?.path).toBe('/queues')
    expect(viewModel.action?.state).toEqual({ targetQueueId: 909 })
  })

  it('can be safely used inside Array.prototype.map with unary wrapper without index overriding role', () => {
    const list = [
      {
        id: 1,
        title: 'Đơn giữ chỗ mới',
        content: 'Bãi xe vừa có đơn giữ chỗ mới #8821',
        type: 'BOOKING',
        targetType: 'BOOKING',
        targetId: 8821,
        createdAt: '2026-04-06T08:30:00Z',
      },
    ]
    const mapped = list.map((dto) => mapNotificationDto(dto, 'MERCHANT'))
    expect(mapped[0].action?.path).toBe('/merchant/bookings/8821')

    const defaultMapped = list.map((dto) => mapNotificationDto(dto))
    expect(defaultMapped[0].action?.path).toBe('/bookings')
  })

  it('falls back to default role when role is empty or whitespace string', () => {
    const actionEmptyRole = resolveNotificationAction('BOOKING', 8821, 'BOOKING', '   ')
    expect(actionEmptyRole?.path).toBe('/bookings')
  })
})
