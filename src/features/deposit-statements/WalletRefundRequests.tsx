import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { getData, sendData, errorMessage } from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import { DataTable, Panel, Notice, money, secondary } from '@/shared/components/Workspace'

const refund = z.object({ id: z.number(), bookingId: z.number(), paymentId: z.number().nullable(), refundAmount: z.coerce.number().finite(),
  refundChannel: z.string(), status: z.string(), verificationNote: z.string().nullish(), transactionReference: z.string().nullish() })
const schema = z.object({ content: z.array(refund), currentPage: z.number(), totalPages: z.number(), totalElements: z.number() })

export function WalletRefundRequests() {
  const [page, setPage] = useState(0)
  const cache = useQueryClient()
  const query = useQuery({ queryKey: ['admin-refund-requests', page], retry: false,
    queryFn: async () => schema.parse(await getData<unknown>('/api/v1/admin/refunds', { page, size: 20, sort: 'id,desc' })) })
  const retry = useMutation({ mutationFn: (id: number) => sendData('post', `/api/v1/admin/refunds/${id}/retry-wallet`),
    onSuccess: async () => { await cache.invalidateQueries({ queryKey: ['admin-refund-requests'] }); await cache.invalidateQueries({ queryKey: ['deposit-statements'] }) } })
  return <Panel title="Yêu cầu hoàn tiền và đối soát"><p className="mb-4 text-sm text-brand-muted">Bao gồm yêu cầu chưa xác minh được giao dịch cọc gốc. Chỉ thử lại hoàn ví sau khi đủ điều kiện; yêu cầu ngân hàng giữ quy trình thủ công hiện có.</p>
    {retry.isError && <Notice error>{errorMessage(retry.error)}</Notice>}
    {retry.isSuccess && <Notice>Đã xử lý yêu cầu hoàn ví và cập nhật bảng kê.</Notice>}
    <QueryState query={query}>{data => <DataTable rows={data.content} page={page} totalPages={data.totalPages} totalItems={data.totalElements} onPage={setPage} emptyText="Chưa có yêu cầu hoàn tiền."
      columns={[
        { label: 'Yêu cầu / Booking', render: row => `#${row.id} / #${row.bookingId}` },
        { label: 'Giao dịch cọc', render: row => row.paymentId == null ? 'Chưa xác minh' : `#${row.paymentId}` },
        { label: 'Số tiền', align: 'right', render: row => money(row.refundAmount) },
        { label: 'Kênh', render: row => row.refundChannel === 'WALLET' ? 'Ví tài xế' : 'Ngân hàng thủ công' },
        { label: 'Trạng thái', render: row => row.status },
        { label: 'Ghi chú / Mã hoàn', render: row => row.verificationNote || row.transactionReference || '—' },
        { label: 'Xử lý', render: row => row.refundChannel === 'WALLET' && row.status === 'REQUIRES_RECONCILIATION' && row.paymentId != null
          ? <button className={secondary} disabled={retry.isPending} onClick={() => retry.mutate(row.id)}>Thử lại hoàn ví</button> : '—' },
      ]} />}</QueryState>
  </Panel>
}
