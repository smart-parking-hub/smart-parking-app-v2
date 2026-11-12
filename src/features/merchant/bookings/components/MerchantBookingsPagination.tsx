import { Pagination } from '@/shared/components/Pagination'

interface MerchantBookingsPaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  embedded?: boolean
}

export function MerchantBookingsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  embedded = false,
}: MerchantBookingsPaginationProps) {
  if (totalItems === 0 && totalPages <= 1) {
    return null
  }

  const content = (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      zeroIndexed={true}
      onPageChange={onPageChange}
      className={embedded ? 'px-4 py-2.5 bg-slate-50/50 text-xs sm:text-sm' : 'border-t-0 px-4 py-2.5 text-xs sm:text-sm'}
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

