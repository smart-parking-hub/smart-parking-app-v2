import { Link } from 'react-router-dom'
import { Map, Warehouse, ReceiptText, AlertTriangle, ArrowUpRight } from 'lucide-react'

const shortcuts = [
  {
    id: 'parking',
    title: 'Tìm Bãi Đỗ & Bảng Giá',
    desc: 'Tra cứu theo bán kính, tĩnh không, trạm sạc',
    to: '/parking',
    icon: Map,
  },
  {
    id: 'vehicles',
    title: 'Quản Lý Phương Tiện',
    desc: 'Cập nhật đầu kéo, rơ-moóc & số đăng kiểm',
    to: '/vehicles',
    icon: Warehouse,
  },
  {
    id: 'payments',
    title: 'Hóa Đơn Điện Tử VAT',
    desc: 'Xuất hóa đơn công ty vận tải, đối soát cước',
    to: '/payments',
    icon: ReceiptText,
  },
  {
    id: 'notifications',
    title: 'Cảnh Báo Tĩnh Không & Cân',
    desc: 'Thông tin cầu vượt, trạm cân tải trọng 24/7',
    to: '/notifications',
    icon: AlertTriangle,
  },
]

export function DriverShortcuts() {
  return (
    <section className="w-full mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-sora text-base sm:text-lg text-slate-900 font-bold">
            Nghiệp Vụ Tài Xế Nhanh
          </h3>
          <p className="text-xs text-slate-500">
            Thao tác tra cứu và điều phối xe chỉ với 1 chạm
          </p>
        </div>
        <span className="text-xs text-slate-500 font-normal">
          Lối tắt điều hướng
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {shortcuts.map(({ id, title, desc, to, icon: Icon }) => (
          <Link
            key={id}
            to={to}
            className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between h-32 sm:h-36"
          >
            <div className="flex items-center justify-between">
              <Icon className="w-5 h-5 text-slate-500 group-hover:text-[#d95f00] transition-colors" />
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </div>
            <div>
              <span className="font-sora text-xs sm:text-sm font-semibold text-slate-900 block group-hover:text-[#d95f00] transition-colors leading-snug mb-0.5">
                {title}
              </span>
              <p className="text-xs text-slate-500 line-clamp-1">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
