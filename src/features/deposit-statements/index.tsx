import { useState } from 'react'
import { WalletRefundRequests } from './WalletRefundRequests'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { getData } from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import { Panel, DataTable, money, secondary } from '@/shared/components/Workspace'

const amount = z.coerce.number().finite()
const statement = z.object({ paymentId: z.number(), bookingId: z.number(), refundId: z.number().nullable(), paymentStatus: z.string(), gateway: z.string(), depositCollected: amount, refundAmount: amount,
  refundCompleted: amount, refundOutstanding: amount, refundStatus: z.string(), refundChannel: z.string().nullable(), escrowRemaining: amount,
  depositPlatformFee: amount, depositMerchantNet: amount, reconciled: z.boolean() })
const pageSchema = z.object({ content: z.array(statement), currentPage: z.number(), totalPages: z.number(), totalElements: z.number() })

export function DepositStatements({ scope }: { scope: 'merchant' | 'admin' }) {
  const [open, setOpen] = useState(false)
  return <section aria-label="Bảng kê cọc"><button className={secondary} aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? 'Đóng đối soát tiền cọc' : 'Xem đối soát tiền cọc'}</button>{open && <><DepositStatementTable scope={scope} />{scope === 'admin' && <WalletRefundRequests />}</>}</section>
}

function DepositStatementTable({ scope }: { scope: 'merchant' | 'admin' }) {
  const [page, setPage] = useState(0)
  const query = useQuery({ queryKey: ['deposit-statements', scope, page], retry: false,
    queryFn: async () => pageSchema.parse(await getData<unknown>(scope === 'merchant' ? '/api/v1/merchant/revenue/deposits' : '/api/v1/admin/deposits', { page, size: 20 })) })
  return <Panel title="Đối soát tiền cọc"><p className="mb-4 text-sm text-brand-muted">Số liệu lấy từ bút toán đã ghi nhận. Thực nhận là công nợ chủ bãi được ghi có, chưa phải tiền đã chuyển ngân hàng.</p>
    <button className={`${secondary} mb-4`} disabled={query.isFetching} onClick={() => void query.refetch()}>Làm mới đối soát</button>
    <QueryState query={query}>{data => <DataTable rows={data.content.map(row => ({ ...row, id: row.paymentId }))} page={page} totalPages={data.totalPages} totalItems={data.totalElements} onPage={setPage} emptyText="Chưa có giao dịch cọc."
      columns={[
        { label: 'Giao dịch / Booking', render: row => `#${row.paymentId} / #${row.bookingId}` },
        { label: 'Nguồn / Thanh toán', render: row => `${row.gateway === 'WALLET' ? 'Ví tài xế' : row.gateway} · ${row.paymentStatus}` },
        { label: 'Cọc đã thu', align: 'right', render: row => money(row.depositCollected) },
        { label: 'Phải hoàn', align: 'right', render: row => money(row.refundAmount) },
        { label: 'Đã hoàn', align: 'right', render: row => money(row.refundCompleted) },
        { label: 'Còn phải hoàn', align: 'right', render: row => money(row.refundOutstanding) },
        { label: 'Còn giữ', align: 'right', render: row => money(row.escrowRemaining) },
        { label: 'Phí sàn ròng', align: 'right', render: row => money(row.depositPlatformFee) },
        { label: 'Chủ bãi ròng', align: 'right', render: row => money(row.depositMerchantNet) },
        { label: 'Kênh hoàn / Trạng thái', render: row => `${row.refundChannel === 'WALLET' ? 'Ví tài xế' : row.refundChannel === 'BANK_MANUAL' ? 'Ngân hàng thủ công' : '—'} · ${row.refundStatus}` },
        { label: 'Đối soát', render: row => row.reconciled ? 'Khớp' : 'Cần kiểm tra' },

      ]} />}</QueryState>
  </Panel>
}
