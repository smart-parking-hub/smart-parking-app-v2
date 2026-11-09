import { Link } from 'react-router-dom'

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#060D1A] text-slate-300 py-16" id="lien-he">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Status */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group" aria-label="SmartTruckHub Trang chủ">
              <img
                src="/image-smart-parking-hub.png"
                alt="Smart Parking Hub Logo"
                className="w-8 h-8 rounded-lg object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-sora font-bold text-lg text-white">
                SMART<span className="text-brand-orange">TRUCK</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Hạ tầng số hóa mạng lưới bãi đỗ xe tải, xe container và trạm dừng nghỉ thông minh kết nối cụm cảng biển, cửa khẩu và cao tốc Việt Nam.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" aria-hidden="true"></span>
              <span>Hệ thống trực tuyến 99.98%</span>
            </div>
          </div>

          {/* Col 2: For Drivers */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Dành Cho Tài Xế</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/parking">
                  Tra cứu bãi đỗ theo lộ trình
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/driver-solutions">
                  Hướng dẫn quét mã QR Barie
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/driver-solutions">
                  Đăng ký hàng đợi ảo giờ cao điểm
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/pricing">
                  Biểu phí niêm yết theo bãi
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/pricing">
                  Chính sách hoàn cọc linh hoạt
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Lot Owners */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Dành Cho Chủ Bãi</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/owner-solutions">
                  Đăng ký bãi đỗ đối tác
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/owner-solutions">
                  Giải pháp Barie &amp; Camera ALPR
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/owner-solutions">
                  Cổng thanh toán &amp; Đối soát PayOS
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/owner-solutions">
                  Báo cáo doanh thu thời gian thực
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/api-docs">
                  Tài liệu kết nối API Swagger
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Support */}
          <div>
            <h2 className="font-sora font-bold text-base text-white mb-4">Pháp Lý &amp; Hỗ Trợ</h2>
            <ul className="space-y-3 text-sm mb-5">
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/contact">
                  Trung tâm điều phối &amp; Hỗ trợ 24/7
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/company/blog">
                  Bản tin &amp; Báo cáo logistics
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/careers">
                  Cơ hội nghề nghiệp &amp; Tuyển dụng
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/about">
                  Điều khoản dịch vụ &amp; Bảo mật
                </Link>
              </li>
              <li>
                <Link className="hover:text-brand-orange transition-colors" to="/owner-solutions">
                  Bảo hiểm trách nhiệm lưu bãi
                </Link>
              </li>
            </ul>
            <div className="text-sm space-y-1.5 text-slate-300">
              <div>
                Hotline: <a href="tel:19006868" className="text-white font-semibold hover:text-brand-orange transition-colors">1900 6868</a>
              </div>
              <div>
                Email: <a href="mailto:hotro@smarttruckhub.vn" className="text-white font-semibold hover:text-brand-orange transition-colors">hotro@smarttruckhub.vn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400 border-t border-slate-800/80">
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
