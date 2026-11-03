import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, Calendar, Truck, Clock } from 'lucide-react'
import type { QueueHistoryItem, QueueStatus } from '../types/queueTypes'

interface QueueHistoryTableProps {
  items: QueueHistoryItem[]
}

export function QueueHistoryTable({ items }: QueueHistoryTableProps) {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | QueueStatus>('ALL')

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

  const renderStatusBadge = (status: QueueStatus, text: string) => {
    switch (status) {
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {text || 'Đã nhận slot'}
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {text || 'Đã hủy'}
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            {text || 'Hết hạn'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {text || status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header & Search Filter */}
      <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-sora text-slate-900">
            Lịch Sử Lượt Xếp Hàng Ảo
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng {items.length} lượt đã hoàn tất hoặc kết thúc
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filters */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('CONVERTED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'CONVERTED'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Đã nhận slot
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'CANCELLED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Đã hủy
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('EXPIRED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'EXPIRED'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Hết hạn
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo mã, bãi xe, biển số..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead className="bg-slate-50/80 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4 md:px-6">Mã Hàng Đợi</th>
              <th className="py-3 px-4">Bãi Đỗ Xe & Địa Chỉ</th>
              <th className="py-3 px-4">Phương Tiện</th>
              <th className="py-3 px-4 text-center">Vị Trí Ban Đầu</th>
              <th className="py-3 px-4">Thời Gian Chờ</th>
              <th className="py-3 px-4">Trạng Thái Kết Quả</th>
              <th className="py-3 px-4 md:px-6 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-700">Không tìm thấy lượt xếp hàng nào</p>
                    <p className="text-xs text-slate-400">
                      Thử điều chỉnh bộ lọc tìm kiếm hoặc quay lại sau.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 md:px-6">
                    <span className="font-mono font-bold text-slate-900 block">
                      {item.queueCode}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {item.registeredAtText}
                    </span>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <span className="font-semibold text-slate-900 block line-clamp-1">
                      {item.parkingLotName}
                    </span>
                    <span className="text-xs text-slate-500 block line-clamp-1">
                      {item.parkingLotAddress}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      {item.vehiclePlate}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {item.vehicleSpec}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700 text-xs">
                      #{item.initialPosition}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-slate-700 font-medium text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.waitTimeText}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {renderStatusBadge(item.status, item.statusText)}
                  </td>

                  <td className="py-4 px-4 md:px-6 text-right">
                    {item.status === 'CONVERTED' ? (
                      <Link
                        to="/bookings"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                      >
                        <span>Xem vé QR</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
