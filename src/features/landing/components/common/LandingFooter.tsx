import { Truck } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#060D1A] text-slate-300 py-16" id="lien-he">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Status */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-[#060D1A]">
                <Truck className="h-5 w-5 text-[#060D1A]" aria-hidden="true" />
              </div>
              <span className="font-sora font-bold text-lg text-white">
                SMART<span className="text-brand-orange">TRUCK</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Hạ tầng số hóa mạng lưới bãi đỗ xe tải, xe container và trạm dừng nghỉ thông minh kết nối cụm cảng biển, cửa khẩu và cao tốc Việt Nam.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
              <span>Hệ thống trực tuyến 99.98%</span>
            </div>
          </div>

          {/* Col 2: For Drivers */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Dành Cho Tài Xế</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#tim-bai">
                  Tra cứu bãi đỗ theo lộ trình
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#quy-trinh">
                  Hướng dẫn quét mã QR Barie
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#tim-bai">
                  Đăng ký hàng đợi ảo giờ cao điểm
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#bang-gia">
                  Biểu phí niêm yết theo bãi
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#bang-gia">
                  Chính sách hoàn cọc linh hoạt
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: For Lot Owners */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Dành Cho Chủ Bãi</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#giai-phap-chu-bai">
                  Đăng ký bãi đỗ đối tác
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#giai-phap-chu-bai">
                  Giải pháp Barie &amp; Camera ALPR
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#giai-phap-chu-bai">
                  Cổng thanh toán &amp; Đối soát PayOS
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#giai-phap-chu-bai">
                  Báo cáo doanh thu thời gian thực
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="/api-docs">
                  Tài liệu kết nối API Swagger
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Pháp Lý &amp; Hỗ Trợ</h2>
            <ul className="space-y-3 text-sm mb-5">
              <li>
                <a className="hover:text-brand-orange transition-colors" href="/contact">
                  Trung tâm điều phối &amp; Hỗ trợ 24/7
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="/insights">
                  Bản tin &amp; Báo cáo logistics
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="/careers">
                  Cơ hội nghề nghiệp &amp; Tuyển dụng
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="/about">
                  Điều khoản dịch vụ &amp; Bảo mật
                </a>
              </li>
              <li>
                <a className="hover:text-brand-orange transition-colors" href="#giai-phap-chu-bai">
                  Bảo hiểm trách nhiệm lưu bãi
                </a>
              </li>
            </ul>
            <div className="text-sm space-y-1.5 text-slate-300">
              <div>
                Hotline: <strong className="text-white font-semibold">1900 6868</strong>
              </div>
              <div>
                Email: <strong className="text-white font-semibold">hotro@smarttruckhub.vn</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
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
