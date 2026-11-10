import type { Dispute } from '@/entities/operations'
import { getData, sendData, type Page } from '@/shared/api/resources'
import type { DisputeBookingSummary } from '@/features/bookings'

export interface DisputePaymentRecord {
  id: number
  bookingId: number
  gateway: string
  transactionCode?: string | null
  orderCode?: number | null
  amount: number
  type: string
  status: string
  createdAt?: string | null
}

export interface ParsedDisputeDescription {
  body: string
  localAttachmentRefs: string[]
}

const ATTACHMENT_MARKER = '[Chứng từ đính kèm trên thiết bị:'

export function parseDisputeDescription(rawDescription: string | null | undefined): ParsedDisputeDescription {
  if (!rawDescription) {
    return { body: '', localAttachmentRefs: [] }
  }

  const markerIndex = rawDescription.indexOf(ATTACHMENT_MARKER)
  if (markerIndex === -1) {
    return { body: rawDescription.trim(), localAttachmentRefs: [] }
  }

  const body = rawDescription.slice(0, markerIndex).trim()
  const attachmentSection = rawDescription.slice(markerIndex)
  const closingIndex = attachmentSection.indexOf(']')
  const inside = closingIndex !== -1 ? attachmentSection.slice(ATTACHMENT_MARKER.length, closingIndex) : attachmentSection.slice(ATTACHMENT_MARKER.length)

  const refs = inside
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)

  return { body, localAttachmentRefs: refs }
}

export function normalizeDisputeStatus(status: string | undefined): 'PENDING' | 'RESOLVED' | 'REJECTED' {
  const upper = (status ?? 'PENDING').toUpperCase()
  if (upper === 'RESOLVED') return 'RESOLVED'
  if (upper === 'REJECTED') return 'REJECTED'
  return 'PENDING'
}

export function disputeTimeLabel(value: string | null | undefined): string {
  if (!value) return '—'
  const iso = /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+07:00`
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
}

export function disputeMoney(amount: unknown): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '—'
  return `${new Intl.NumberFormat('vi-VN').format(amount)} ₫`
}

export async function fetchDriverDisputesPage(page: number, size = 20): Promise<Page<Dispute>> {
  return getData<Page<Dispute>>('/api/v1/disputes/me', { page, size })
}

export async function fetchDriverDisputeById(id: string | number): Promise<Dispute> {
  return getData<Dispute>(`/api/v1/disputes/${id}`)
}

export async function submitDriverDispute(payload: {
  bookingId: number
  merchantId?: number | null
  reason: string
  description: string
}): Promise<Dispute> {
  return sendData<Dispute>('post', '/api/v1/disputes', payload)
}

/**
 * Defensive enrichment query: fetches driver's recent bookings so the dispute list
 * can show bookingCode / parkingLotName instead of only raw #bookingId.
 * Never throws so tests mocking only disputes still pass cleanly.
 */
export async function fetchDriverBookingsMapSafe(): Promise<Record<number, DisputeBookingSummary>> {
  try {
    const raw = await getData<unknown>('/api/v1/bookings', { size: 100 })
    if (raw && typeof raw === 'object' && 'content' in raw && Array.isArray((raw as { content?: unknown }).content)) {
      const map: Record<number, DisputeBookingSummary> = {}
      for (const item of (raw as { content: unknown[] }).content) {
        if (
          item &&
          typeof item === 'object' &&
          'id' in item &&
          'bookingCode' in item &&
          typeof (item as { id?: unknown }).id === 'number' &&
          typeof (item as { bookingCode?: unknown }).bookingCode === 'string'
        ) {
          const booking = item as DisputeBookingSummary
          map[booking.id] = booking
        }
      }
      return map
    }
  } catch {
    // Graceful degradation: list still renders raw #bookingId
  }
  return {}
}

export async function fetchBookingSummarySafe(bookingId: number): Promise<DisputeBookingSummary | null> {
  try {
    const raw = await getData<unknown>(`/api/v1/bookings/${bookingId}`)
    if (
      raw &&
      typeof raw === 'object' &&
      'bookingCode' in raw &&
      'status' in raw &&
      typeof (raw as { id?: unknown }).id === 'number'
    ) {
      return raw as DisputeBookingSummary
    }
  } catch {
    // Graceful degradation: sidebar falls back to #bookingId / #driverId / #merchantId
  }
  return null
}

export async function fetchPaymentsForBookingSafe(bookingId: number): Promise<DisputePaymentRecord[]> {
  try {
    const raw = await getData<unknown>('/api/v1/payments', { page: 0, size: 50, sort: 'id,desc' })
    if (raw && typeof raw === 'object' && 'content' in raw && Array.isArray((raw as { content?: unknown }).content)) {
      return (raw as { content: unknown[] }).content
        .filter(
          (item): item is DisputePaymentRecord =>
            item !== null &&
            typeof item === 'object' &&
            'bookingId' in item &&
            (item as { bookingId?: unknown }).bookingId === bookingId &&
            'status' in item &&
            'amount' in item,
        )
        .map((item) => ({
          ...item,
          amount: Number(item.amount) || 0,
        }))
    }
  } catch {
    // Graceful degradation
  }
  return []
}
