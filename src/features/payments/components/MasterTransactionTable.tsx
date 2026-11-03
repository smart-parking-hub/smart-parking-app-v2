import { useState } from 'react'
import {
  RefreshCw,
  QrCode,
  Banknote,
  RotateCcw,
  FileText,
  Receipt,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import type { PaymentTransactionItem } from '../types/paymentTypes'

interface MasterTransactionTableProps {
  items: PaymentTransactionItem[]
  selectedId: number | null
  onSelect: (item: PaymentTransactionItem) => void
  onRefresh: () => void
  onDownloadPdf: (item: PaymentTransactionItem) => void
}

export function MasterTransactionTable({
  items,
  selectedId,
  onSelect,
  onRefresh,
  onDownloadPdf,
}: MasterTransactionTableProps) {
  // Client pagination
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(items.length / pageSize) || 1

  const startIndex = (currentPage - 1) * pageSize
  const currentItems = items.slice(startIndex, startIndex + pageSize)

  const formatMoney = (val: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(val)} ₫`
  }

  const renderPaymentMethodIcon = (method: PaymentTransactionItem['paymentMethod']) => {
    switch (method) {
      case 'VIETQR_PAYOS':
        return <QrCode className="w-3.5 h-3.5 text-slate-500" />
      case 'BANK_REFUND':
        return <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
      case 'CASH_AT_GATE':
        return <Banknote className="w-3.5 h-3.5 text-slate-500" />
      default:
        return <QrCode className="w-3.5 h-3.5 text-slate-500" />
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col mb-6">
      {/* Table Header Strip */}
      <div className="p-4 md:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base md:text-lg font-bold font-sora text-slate-900">
            Bảng Kê Chi Tiết Giao Dịch PayOS & Tiền Bãi
          </h2>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
            {items.length} BẢN GHI ĐỐI SOÁT
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Cập nhật lúc: 14:35:10</span>
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Làm mới dữ liệu"
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 font-mono text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">MÃ GIAO DỊCH / BOOKING</th>
              <th className="py-3 px-4 font-semibold">THỜI GIAN & CỔNG</th>
              <th className="py-3 px-4 font-semibold">BÃI ĐỖ & BIỂN SỐ XE</th>
              <th className="py-3 px-4 font-semibold">PHÂN LOẠI CHI PHÍ</th>
              <th className="py-3 px-4 font-semibold text-right">SỐ TIỀN (VNĐ)</th>
              <th className="py-3 px-4 font-semibold text-center">TRẠNG THÁI</th>
              <th className="py-3 px-4 font-semibold text-center">HÓA ĐƠN VAT</th>
              <th className="py-3 px-4 font-semibold text-center">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-slate-700">Không tìm thấy giao dịch nào</p>
                    <p className="text-xs text-slate-400">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc phân loại.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const isSelected = selectedId === item.id
                const isRefund = item.category === 'REFUND'

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-50/60 hover:bg-orange-50/80'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* 1. Transaction & Booking Code */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span
                          className={`font-mono font-bold ${
                            isRefund ? 'text-orange-600' : 'text-slate-900'
                          }`}
                        >
                          {item.transactionCode}
                        </span>
                        <span className="font-mono text-xs text-slate-500">
                          {item.bookingCode}
                        </span>
                      </div>
                    </td>

                    {/* 2. Timestamp & Gateway */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-slate-900">
                          {item.createdAtText}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          {renderPaymentMethodIcon(item.paymentMethod)}
                          <span>{item.paymentMethodLabel}</span>
                        </span>
                      </div>
                    </td>

                    {/* 3. Facility & Plate */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {item.parkingLotName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.2 rounded font-bold text-slate-800">
                            {item.vehiclePlate}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {item.vehicleSpec}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Category Tag */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          isRefund
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.categoryLabel}
                      </span>
                    </td>

                    {/* 5. Amount */}
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`font-mono font-bold text-sm md:text-base ${
                          isRefund ? 'text-orange-600' : 'text-slate-900'
                        }`}
                      >
                        {formatMoney(item.amount)}
                      </span>
                      {item.vatAmount > 0 && (
                        <span className="block text-[11px] text-slate-500 font-mono">
                          VAT (8%): {formatMoney(item.vatAmount)}
                        </span>
                      )}
                      {isRefund && (
                        <span className="block text-[11px] text-slate-500 font-mono">
                          Hoàn 100% cọc giữ chỗ
                        </span>
                      )}
                    </td>

                    {/* 6. Status Tag */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                          isRefund
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-slate-900 text-white'
                        }`}
                      >
                        {item.statusLabel}
                      </span>
                    </td>

                    {/* 7. VAT Invoice Button */}
                    <td className="py-4 px-4 text-center">
                      {item.vatInvoiceType === 'PDF_VAT' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDownloadPdf(item)
                          }}
                          title={`Mã CQT: ${item.taxAuthorityCode ?? 'TT78'}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-mono text-xs font-semibold transition-colors border border-blue-200"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>PDF VAT</span>
                        </button>
                      ) : item.vatInvoiceType === 'RECEIPT' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDownloadPdf(item)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-semibold transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-600" />
                          <span>PHIẾU THU</span>
                        </button>
                      ) : (
                        <span className="font-mono text-xs text-slate-400">N/A (Cấn trừ)</span>
                      )}
                    </td>

                    {/* 8. Action button */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect(item)
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {items.length > 0 && (
        <div className="p-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <span>
            Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, items.length)} trong tổng số {items.length} giao dịch
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
