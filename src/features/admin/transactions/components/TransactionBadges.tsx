import { Badge } from '@/shared/components/Workspace'
import type { AdminTransaction } from '../api/adminTransactionsApi'

const typeLabels: Record<AdminTransaction['type'], string> = {
  DEPOSIT: 'Đặt cọc', FINAL_PAYMENT: 'Thanh toán cuối', PENALTY: 'Phí phạt', REFUND: 'Hoàn tiền',
}
const statusLabels: Record<AdminTransaction['status'], string> = {
  REQUIRES_REVIEW: 'Cần đối soát', PENDING: 'Chờ thanh toán', SUCCESS: 'Thành công',
  FAILED: 'Thất bại', REFUNDED: 'Đã hoàn tiền',
}

export function TransactionType({ value }: { value: AdminTransaction['type'] }) {
  return <Badge value={value}>{typeLabels[value] ?? value}</Badge>
}

export function TransactionStatus({ value }: { value: AdminTransaction['status'] }) {
  return <Badge value={value} variant={value === 'REQUIRES_REVIEW' ? 'warning' : undefined}>
    {statusLabels[value] ?? value}
  </Badge>
}
