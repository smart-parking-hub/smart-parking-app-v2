import type { ToastVariant } from '@/shared/components/Toast'

export const DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE = 5

export const BOOKING_STATUS_VALUES = [
  'PENDING_PAYMENT',
  'PENDING_CHECKIN',
  'PARKING',
  'OVERTIME',
  'AWAITING_FINAL_PAYMENT',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'REVIEWED',
] as const

export type BookingStatusValue = (typeof BOOKING_STATUS_VALUES)[number]

export type MerchantBookingStatusFilter = 'ALL' | BookingStatusValue

export interface MerchantBookingLotOption {
  id: number
  name: string
}

export type MerchantBookingEmptyVariant = 'no-bookings' | 'filtered'

export interface MerchantBookingToastState {
  id: number
  title: string
  message?: string
  variant: ToastVariant
}

export const BOOKING_STATUS_LABELS: Record<BookingStatusValue, string> = {
  PENDING_PAYMENT: 'Chờ thanh toán',
  PENDING_CHECKIN: 'Chờ vào bãi',
  PARKING: 'Đang đỗ xe',
  OVERTIME: 'Quá giờ',
  AWAITING_FINAL_PAYMENT: 'Chờ thanh toán cuối',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
  EXPIRED: 'Hết hạn',
  REVIEWED: 'Đã đánh giá',
}

export const PRIMARY_STATUS_TABS: ReadonlyArray<{
  id: Extract<MerchantBookingStatusFilter, 'ALL' | 'PENDING_CHECKIN' | 'PARKING' | 'COMPLETED'>
  label: string
}> = [
  { id: 'ALL', label: 'Tất cả trạng thái' },
  { id: 'PENDING_CHECKIN', label: 'Chờ vào bãi' },
  { id: 'PARKING', label: 'Đang đỗ xe' },
  { id: 'COMPLETED', label: 'Đã hoàn tất' },
]

export interface MerchantBookingStatusCounts {
  ALL: number
  PENDING_CHECKIN: number
  PARKING: number
  COMPLETED: number
}

export const ALL_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: MerchantBookingStatusFilter
  label: string
  shortLabel: string
  badge?: string
}> = [
  { value: 'ALL', label: 'Tất cả (9 trạng thái)', shortLabel: 'Tất cả (9 trạng thái)' },
  {
    value: 'PENDING_CHECKIN',
    label: 'Chờ vào bãi (PENDING_CHECKIN)',
    shortLabel: 'Chờ vào bãi',
    badge: 'PENDING_CHECKIN',
  },
  {
    value: 'PARKING',
    label: 'Đang đỗ (PARKING)',
    shortLabel: 'Đang đỗ',
    badge: 'PARKING',
  },
  {
    value: 'OVERTIME',
    label: 'Quá giờ (OVERTIME)',
    shortLabel: 'Quá giờ',
    badge: 'OVERTIME',
  },
  {
    value: 'AWAITING_FINAL_PAYMENT',
    label: 'Chờ thanh toán cuối (AWAITING_FINAL_PAYMENT)',
    shortLabel: 'Chờ thanh toán cuối',
    badge: 'AWAITING_FINAL_PAYMENT',
  },
  {
    value: 'PENDING_PAYMENT',
    label: 'Chờ thanh toán (PENDING_PAYMENT)',
    shortLabel: 'Chờ thanh toán',
    badge: 'PENDING_PAYMENT',
  },
  {
    value: 'COMPLETED',
    label: 'Hoàn tất (COMPLETED)',
    shortLabel: 'Hoàn tất',
    badge: 'COMPLETED',
  },
  {
    value: 'REVIEWED',
    label: 'Đã đánh giá (REVIEWED)',
    shortLabel: 'Đã đánh giá',
    badge: 'REVIEWED',
  },
  {
    value: 'CANCELLED',
    label: 'Đã hủy (CANCELLED)',
    shortLabel: 'Đã hủy',
    badge: 'CANCELLED',
  },
  {
    value: 'EXPIRED',
    label: 'Hết hạn (EXPIRED)',
    shortLabel: 'Hết hạn',
    badge: 'EXPIRED',
  },
]
