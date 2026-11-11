import { Pagination } from '@/shared/components/Pagination'

interface NotificationsPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  embedded?: boolean
}

export function NotificationsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  embedded = false,
}: NotificationsPaginationProps) {
  if (totalItems === 0 && totalPages <= 1) {
    return null
  }

  const content = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      zeroIndexed={false}
      onPageChange={onPageChange}
      className={embedded ? 'px-5 py-4 bg-slate-50/50 text-sm' : 'border-t-0 px-5 py-4 text-sm'}
    />
  )

  if (embedded) {
    return content
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
      {content}
    </div>
  )
}
