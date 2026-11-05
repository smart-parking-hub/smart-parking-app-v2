import { Link } from 'react-router-dom'
import { Map, Warehouse, ReceiptText, AlertTriangle } from 'lucide-react'

const shortcuts = [
  {
    step: '01',
    title: 'Tìm Bãi Đỗ & Bảng Giá',
    desc: 'Tra cứu theo bán kính, tĩnh không, trạm sạc',
    to: '/parking',
    icon: Map,
  },
  {
    step: '02',
    title: 'Quản Lý Phương Tiện',
    desc: 'Cập nhật đầu kéo, rơ-moóc & số đăng kiểm',
    to: '/vehicles',
    icon: Warehouse,
  },
  {
    step: '03',
    title: 'Hóa Đơn Điện Tử VAT',
    desc: 'Xuất hóa đơn công ty vận tải, đối soát cước',
    to: '/payments',
    icon: ReceiptText,
  },
  {
    step: '04',
    title: 'Cảnh Báo Tĩnh Không & Cân',
    desc: 'Thông tin cầu vượt, trạm cân tải trọng 24/7',
    to: '/notifications',
    icon: AlertTriangle,
  },
]

export function DriverShortcuts() {
  return (
    <section className="w-full mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-sora text-lg lg:text-xl text-[#0d1c2e] font-bold">
            Nghiệp Vụ Tài Xế Nhanh
          </h3>
          <p className="text-xs lg:text-sm text-[#45464d]">
            Thao tác tra cứu và điều phối xe chỉ với 1 chạm
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
          LỐI TẮT NHANH
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shortcuts.map(({ step, title, desc, to, icon: Icon }) => (
          <Link
            key={step}
            to={to}
            className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:bg-[#eff4ff] hover:border-blue-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between h-40"
          >
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-[#e6eeff] flex items-center justify-center text-[#0d1c2e] group-hover:bg-[#d95f00] group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </span>
              <span className="font-mono text-xs text-slate-400 font-bold px-2 py-0.5 rounded bg-slate-100">
                {step}
              </span>
            </div>
            <div>
              <span className="font-sora text-sm sm:text-base font-bold text-[#0d1c2e] block group-hover:text-[#d95f00] transition-colors leading-tight mb-1">
                {title}
              </span>
              <p className="text-xs text-slate-600 line-clamp-1 font-medium">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
