import { Search, Calendar, ChevronDown } from 'lucide-react'
import type { PaymentCategoryFilter, PaymentStatusFilter } from '../types/paymentTypes'

interface TransactionFilterToolbarProps {
  search: string
  onSearchChange: (val: string) => void
  categoryFilter: PaymentCategoryFilter
  onCategoryFilterChange: (val: PaymentCategoryFilter) => void
  statusFilter: PaymentStatusFilter
  onStatusFilterChange: (val: PaymentStatusFilter) => void
  counts: {
    all: number
    deposit: number
    finalPayment: number
    refund: number
    penalty: number
    paid: number
    refunded: number
  }
}

export function TransactionFilterToolbar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: TransactionFilterToolbarProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4 mb-6">
      {/* Top Row: Search & Period Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search input */}
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            id="transaction-search-input"
            name="transactionSearch"
            aria-label="Tra cứu mã giao dịch, mã booking, tên bãi đỗ hoặc biển số xe"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tra cứu: Mã giao dịch PayOS, Mã Booking (BKG-..), Tên bãi đỗ xe hoặc Biển số xe..."
            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs md:text-sm rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        </div>

        {/* Period selector badge */}
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl self-start lg:self-auto border border-slate-200/80">
          <Calendar className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            KỲ ĐỐI SOÁT:
          </span>
          <span className="font-mono text-xs font-bold text-slate-900">
            Tháng 02/2026 (01/02 - 28/02)
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
        </div>
      </div>

      {/* Bottom Row: Segmented Tag Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400 mr-1 uppercase">
            PHÂN LOẠI:
          </span>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('DEPOSIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'DEPOSIT'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tiền cọc giữ slot ({counts.deposit})
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('FINAL_PAYMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'FINAL_PAYMENT'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Quyết toán khoản cuối ({counts.finalPayment})
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('REFUND')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'REFUND'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Hoàn cọc ({counts.refund})
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange('PENALTY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'PENALTY'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Phí quá giờ ({counts.penalty})
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-400 mr-1 uppercase">
            TRẠNG THÁI:
          </span>

          <button
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === 'SUCCESS' ? 'ALL' : 'SUCCESS')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
              statusFilter === 'SUCCESS'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ĐÃ THANH TOÁN ({counts.paid})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange(statusFilter === 'REFUNDED' ? 'ALL' : 'REFUNDED')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
              statusFilter === 'REFUNDED'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ĐÃ HOÀN ({counts.refunded})
          </button>
        </div>
      </div>
    </div>
  )
}
