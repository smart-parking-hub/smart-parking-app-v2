import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, Truck, Clock, Eye, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import type { QueueHistoryItem, QueueStatus } from '../types/queueTypes'
import { QueueHistoryDetailModal } from './QueueHistoryDetailModal'

interface QueueHistoryTableProps {
  items: QueueHistoryItem[]
}

export function QueueHistoryTable({ items }: QueueHistoryTableProps) {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | QueueStatus>('ALL')
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<QueueHistoryItem | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.queueCode.toLowerCase().includes(keyword.toLowerCase()) ||
        item.parkingLotName.toLowerCase().includes(keyword.toLowerCase()) ||
        item.vehiclePlate.toLowerCase().includes(keyword.toLowerCase())

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter

      return matchKeyword && matchStatus
    })
  }, [items, keyword, statusFilter])

  const renderStatusBadge = (status: QueueStatus) => {
    switch (status) {
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Đã nhận slot</span>
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
            <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Đã hủy</span>
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Hết hạn</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 whitespace-nowrap">
            {status}
          </span>
        )
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Header & Search Filter */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold font-sora text-slate-900 tracking-tight">
              Lịch Sử Giữ Chỗ
            </h3>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Tổng cộng {items.length} lượt đã hoàn tất hoặc kết thúc
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status filters with rich hover & active states */}
            <div className="flex items-center bg-slate-100/90 border border-slate-200/70 rounded-xl p-1 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 active:scale-95'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CONVERTED')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  statusFilter === 'CONVERTED'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95'
                }`}
              >
                Đã nhận slot
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CANCELLED')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  statusFilter === 'CANCELLED'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 active:scale-95'
                }`}
              >
                Đã hủy
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('EXPIRED')}
                className={`px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  statusFilter === 'EXPIRED'
                    ? 'bg-white text-rose-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-800 active:scale-95'
                }`}
              >
                Hết hạn
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo mã, bãi xe, biển số..."
                className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[860px]">
            <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-5 md:px-6">Mã Giữ Chỗ</th>
                <th className="py-3.5 px-5">Bãi Đỗ Xe</th>
                <th className="py-3.5 px-5">Phương Tiện</th>
                <th className="py-3.5 px-5">Thời Gian Chờ</th>
                <th className="py-3.5 px-5">Trạng Thái</th>
                <th className="py-3.5 px-5 md:px-6 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-5 text-center">
                    <EmptyState
                      variant="dashed"
                      title="Không tìm thấy lượt giữ chỗ nào"
                      description="Thử điều chỉnh bộ lọc tìm kiếm hoặc quay lại sau."
                      action={
                        <Link
                          to="/parking"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm font-semibold transition-colors"
                        >
                          Tìm bãi xe khác
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Mã Giữ Chỗ (Chỉ hiển thị thông tin cơ bản, xem chi tiết trong modal) */}
                    <td className="py-4 px-5 md:px-6">
                      <span className="font-mono font-bold text-slate-900 text-sm md:text-base block whitespace-nowrap">
                        {item.queueCode}
                      </span>
                    </td>

                    {/* Bãi Đỗ Xe */}
                    <td className="py-4 px-5 max-w-sm">
                      <span className="font-semibold text-slate-900 text-sm md:text-base block line-clamp-1">
                        {item.parkingLotName}
                      </span>
                    </td>

                    {/* Phương Tiện */}
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-slate-900 text-sm md:text-base px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 inline-flex items-center gap-1.5 whitespace-nowrap shadow-2xs">
                        <Truck className="w-4 h-4 text-slate-500 shrink-0" />
                        {item.vehiclePlate}
                      </span>
                    </td>

                    {/* Thời Gian Chờ */}
                    <td className="py-4 px-5">
                      <span className="flex items-center gap-1.5 text-slate-700 font-medium text-sm whitespace-nowrap">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {item.waitTimeText}
                      </span>
                    </td>

                    {/* Trạng Thái */}
                    <td className="py-4 px-5">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Thao Tác (Xem chi tiết & link vé QR) */}
                    <td className="py-4 px-5 md:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedItemForDetail(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Chi tiết</span>
                        </button>

                        {item.status === 'CONVERTED' && (
                          <Link
                            to="/bookings"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 transition-colors"
                          >
                            <span>Xem vé QR</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <QueueHistoryDetailModal
        item={selectedItemForDetail}
        isOpen={!!selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
      />
    </>
  )
}
