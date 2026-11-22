import { LandingLayout } from '@/layouts/LandingLayout'
import { LandingMetadata } from '../components/common/LandingMetadata'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <LandingLayout>
      <LandingMetadata />
      <div className="bg-slate-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-4 border border-orange-100">
              <FileText className="w-4 h-4" />
              Văn bản pháp lý nền tảng
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-sora text-slate-900 tracking-tight">
              Điều Khoản Dịch Vụ
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Chào mừng bạn đến với <strong>SmartTruckHub</strong> — Hệ sinh thái điều phối bến bãi và quản lý chỗ đỗ xe tải thông minh toàn quốc. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 pt-6 border-t border-slate-100">
              <span>Hiệu lực từ: <strong>01/01/2026</strong></span>
              <span>•</span>
              <span>Phiên bản: <strong>2.8.4-LEGAL</strong></span>
              <span>•</span>
              <span>Tiêu chuẩn tuân thủ: <strong>ISO/IEC 27001:2022</strong></span>
            </div>
          </div>

          {/* Content sections */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Quy Định Chung &amp; Đối Tượng Áp Dụng</h2>
              </div>
              <p>
                Điều khoản này áp dụng cho mọi cá nhân hoặc tổ chức tham gia vào nền tảng SmartTruckHub, bao gồm:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Tài xế &amp; Đội xe (Drivers / Fleet Operators):</strong> Người dùng sử dụng ứng dụng để tìm kiếm điểm đỗ, đặt chỗ trước, thanh toán phí giữ xe, check-in/out bằng mã QR tự động.</li>
                <li><strong>Chủ bến bãi (Merchants / Lot Owners):</strong> Đơn vị sở hữu hoặc quản lý hạ tầng bãi đỗ xe tải, cung cấp dịch vụ lưu bãi, quản lý ô đỗ và trạm kiểm soát barie.</li>
                <li><strong>Quản trị viên (Administrators):</strong> Đội ngũ vận hành hệ thống, kiểm duyệt bãi đỗ, phê duyệt đối soát tài chính và giải quyết tranh chấp.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Đăng Ký Tài Khoản &amp; Bảo Mật</h2>
              </div>
              <p>
                Người dùng có trách nhiệm cung cấp thông tin chính xác khi đăng ký tài khoản (Số điện thoại, Biển số xe đăng kiểm, Giấy phép kinh doanh bến bãi). Mọi hành vi mạo danh hoặc khai báo sai lệch tải trọng phương tiện sẽ bị xử lý theo quy định bãi đỗ.
              </p>
              <p>
                Bạn có trách nhiệm bảo mật mật khẩu và mã OTP xác thực. Không chia sẻ tài khoản cho người khác để tránh phát sinh trách nhiệm pháp lý khi xe ra/vào bãi.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Quy Trình Đặt Chỗ, Check-in &amp; Check-out</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Thời gian giữ chỗ:</strong> Đơn đặt chỗ thành công có hiệu lực bảo lưu vị trí ô đỗ trong khung giờ đã xác nhận. Nếu quá thời gian gia hạn tối đa quy định mà xe chưa check-in, vị trí có thể được hoàn lại hàng đợi chung.</li>
                <li><strong>Mã vé QR &amp; Camera ALPR:</strong> Khi xe đến cổng bãi, tài xế xuất trình mã QR trên ứng dụng hoặc cho camera ALPR nhận diện tự động biển số xe đã đăng ký để barie mở tự động.</li>
                <li><strong>Quá giờ lưu bãi (Overstay):</strong> Trường hợp xe lưu bãi vượt quá thời gian đã đặt, hệ thống sẽ tính phí phát sinh theo biểu giá lũy tiến quy định tại bảng giá của bãi đỗ.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Phí Dịch Vụ, Thanh Toán &amp; Rút Tiền</h2>
              </div>
              <p>
                Các giao dịch thanh toán trên nền tảng được thực hiện an toàn qua cổng thanh toán liên kết PayOS / Thẻ ngân hàng nội địa / Ví điện tử SmartTruckHub.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Chủ bãi rút tiền:</strong> Doanh thu thu được từ các lượt gửi xe hợp lệ sẽ được chuyển vào ví số dư khả dụng. Chủ bãi có thể đặt lệnh rút tiền về tài khoản ngân hàng chính chủ đã xác minh, thời gian đối soát xử lý trong vòng 24 giờ làm việc.</li>
                <li><strong>Chính sách hoàn tiền:</strong> Nếu tài xế hủy chỗ trước giờ vào bãi theo quy định của bãi đỗ, tiền đặt cọc sẽ được hoàn tự động về ví SmartTruckHub.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Trách Nhiệm Lưu Bãi &amp; Giải Quyết Khiếu Nại</h2>
              </div>
              <p>
                Chủ bến bãi có trách nhiệm đảm bảo an ninh, phòng cháy chữa cháy và trật tự trong khuôn viên bãi đỗ. Tài xế có trách nhiệm tuân thủ hướng dẫn điều phối của nhân viên bến bãi.
              </p>
              <p>
                Mọi khiếu nại về hư hỏng tài sản, chênh lệch tiền cước hoặc lỗi thiết bị quét QR có thể được gửi trực tiếp thông qua mục <strong>Khiếu nại &amp; Hỗ trợ</strong> trên ứng dụng để Quản trị viên phân giải và bồi hoàn minh bạch.
              </p>
            </section>

            {/* Section 6 */}
            <section className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Cần hỗ trợ thêm về pháp lý?</h3>
                <p className="text-xs text-slate-500 mt-1">Đội ngũ pháp chế và vận hành sẵn sàng hỗ trợ bạn 24/7.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/contact" className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover transition-colors">
                  Liên hệ chúng tôi
                </Link>
                <Link to="/privacy" className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors">
                  Chính sách bảo mật
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </LandingLayout>
  )
}

export default TermsPage
