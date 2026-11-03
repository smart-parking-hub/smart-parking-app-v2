import { Truck } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="w-full bg-brand-navy text-slate-400 py-16 border-t border-slate-800" id="lien-he">
      <div className="max-w-310 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white">
                <Truck className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-sora font-bold text-lg text-white">
                SMART<span className="text-brand-orange">TRUCK</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Hạ tầng số hóa mạng lưới bãi đỗ xe tải, xe container và trạm dừng nghỉ thông minh kết nối cụm cảng biển, cửa khẩu và cao tốc Việt Nam.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              <span>Hệ thống trực tuyến 99.98%</span>
            </div>
          </div>

          {/* Col 2: For Drivers */}
          <div>
            <h4 className="font-sora font-bold text-sm text-white uppercase tracking-wider mb-4">Dành Cho Tài Xế</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a className="hover:text-white transition-colors" href="#tim-bai">Tra cứu bãi đỗ theo lộ trình</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#quy-trinh">Hướng dẫn quét mã QR Barie</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#hang-doi">Đăng ký hàng đợi ảo giờ cao điểm</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#bang-gia">Biểu phí niêm yết theo bãi</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#chinh-sach-hoan-coc">Chính sách hoàn cọc linh hoạt</a>
              </li>
            </ul>
          </div>

          {/* Col 3: For Lot Owners */}
          <div>
            <h4 className="font-sora font-bold text-sm text-white uppercase tracking-wider mb-4">Dành Cho Chủ Bãi</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a className="hover:text-white transition-colors" href="#giai-phap-chu-bai">Đăng ký bãi đỗ đối tác</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#tich-hop-barie">Giải pháp Barie &amp; Camera ALPR</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#payos-reconcile">Cổng thanh toán &amp; Đối soát PayOS</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#quan-ly-doanh-thu">Báo cáo doanh thu thời gian thực</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#api">Tài liệu kết nối API Swagger</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div>
            <h4 className="font-sora font-bold text-sm text-white uppercase tracking-wider mb-4">Pháp Lý &amp; Hỗ Trợ</h4>
            <ul className="space-y-2.5 text-xs mb-5">
              <li>
                <a className="hover:text-white transition-colors" href="#dieu-khoan">Điều khoản dịch vụ</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#bao-mat">Chính sách bảo mật thông tin</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#bao-hiem">Bảo hiểm trách nhiệm lưu bãi</a>
              </li>
            </ul>
            <div className="text-xs space-y-1 text-slate-400">
              <div>Hotline: <strong className="text-white font-semibold">1900 6868</strong></div>
              <div>Email: <strong className="text-white font-semibold">hotro@smarttruckhub.vn</strong></div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SmartTruckHub Vietnam. Bản quyền thuộc về Công ty Cổ phần Công nghệ SmartTruckHub.</p>
          <div className="flex items-center gap-6">
            <span>Tiêu chuẩn bảo mật ISO 27001</span>
            <span>Đối tác thanh toán PayOS</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
