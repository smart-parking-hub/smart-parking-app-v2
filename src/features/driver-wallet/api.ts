import { z } from 'zod'
import { getData, sendData } from '@/shared/api/resources'

const amount = z.coerce.number().finite()
const balanceSchema = z.object({ availableAmount: amount.nonnegative(), heldAmount: amount.nonnegative(), currency: z.literal('VND'), enabled: z.boolean() })
const entrySchema = z.object({ id: z.number(), bookingId: z.number().nullable(), paymentId: z.number().nullable(), entryType: z.string(), amount, heldDelta: amount, createdAt: z.string() })
const pageSchema = z.object({ content: z.array(entrySchema), currentPage: z.number(), totalPages: z.number(), totalElements: z.number() })
const paymentSchema = z.object({ id: z.number(), status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'REQUIRES_REVIEW']) })
export const walletKeys = { all: ['driver-wallet'] as const, balance: ['driver-wallet', 'balance'] as const, entries: (page: number) => ['driver-wallet', 'entries', page] as const }
export const getWallet = async () => balanceSchema.parse(await getData<unknown>('/api/v1/driver/wallet'))
export const getWalletEntries = async (page: number) => pageSchema.parse(await getData<unknown>('/api/v1/driver/wallet/transactions', { page, size: 20 }))
export const payWalletDeposit = async (bookingId: number) => paymentSchema.parse(await sendData<unknown>('post', '/api/v1/payments/wallet', { bookingId }))
export const getWalletPayment = async (id: number) => paymentSchema.parse(await getData<unknown>(`/api/v1/payments/${id}`))
export const walletEntryLabels: Record<string, string> = { REFUND: 'Hoàn cọc vào ví', HOLD: 'Giữ tiền chờ xác nhận cọc', PAYMENT: 'Đã dùng tiền giữ để trả cọc', RELEASE: 'Trả lại tiền giữ vào ví' }
export const refundStatusLabels: Record<string, string> = { NONE: 'Không phát sinh hoàn', REQUESTED: 'Chờ xử lý hoàn', PROCESSING: 'Đang xác minh', COMPLETED: 'Đã hoàn', FAILED: 'Chưa hoàn thành', REQUIRES_RECONCILIATION: 'Cần đối soát' }
