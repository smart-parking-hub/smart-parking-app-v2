import { getData, type Page } from '@/shared/api/resources'

/** Mirrors payment-service AdminTransactionResponse, not the accounting journal. */
export interface AdminTransaction {
  id: number
  transactionCode: string
  bookingId: number
  bookingCode: string
  payerUserId: number | null
  payerPhone: string | null
  merchantId: number | null
  merchantName: string | null
  gateway: 'PAYOS' | 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'DEMO'
  amount: number
  type: 'DEPOSIT' | 'FINAL_PAYMENT' | 'PENALTY' | 'REFUND'
  status: 'REQUIRES_REVIEW' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
  createdAt: string
  updatedAt: string | null
}

export const transactionSortOptions = [
  { value: 'createdAt,desc', label: 'Mới nhất trước' },
  { value: 'createdAt,asc', label: 'Cũ nhất trước' },
  { value: 'amount,desc', label: 'Số tiền giảm dần' },
  { value: 'amount,asc', label: 'Số tiền tăng dần' },
] as const
export type TransactionSort = typeof transactionSortOptions[number]['value']

const path = '/api/v1/admin/transactions'
export const transactionKeys = {
  list: (page: number, sort: TransactionSort) => ['admin-transactions', 'list', page, sort] as const,
  detail: (id: number) => ['admin-transactions', 'detail', id] as const,
}

export function getAdminTransactions(page: number, sort: TransactionSort, signal: AbortSignal) {
  // Repeat sort for a deterministic tie-breaker supported by Spring Pageable.
  const params = new URLSearchParams({ page: String(page), size: '20' })
  params.append('sort', sort)
  params.append('sort', 'id,desc')
  return getData<Page<AdminTransaction>>(path, params, { signal })
}

export function getAdminTransaction(id: number, signal: AbortSignal) {
  return getData<AdminTransaction>(`${path}/${id}`, undefined, { signal })
}
