import { LandingLayout } from '@/layouts/LandingLayout'
import { LandingMetadata } from '../components/common/LandingMetadata'
import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <LandingLayout>
      <LandingMetadata />
      <div className="bg-slate-50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-100">
              <Shield className="w-4 h-4 text-emerald-600" />
              Bảo mật dữ liệu cá nhân &amp; Hệ thống
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-sora text-slate-900 tracking-tight">
              Chính Sách Bảo Mật
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>SmartTruckHub</strong> cam kết tôn trọng và bảo vệ tuyệt đối quyền riêng tư cùng thông tin dữ liệu của người dùng, đối tác vận tải và chủ bãi xe. Chính sách này công bố minh bạch phạm vi thu thập, mục đích sử dụng và các biện pháp bảo vệ dữ liệu theo tiêu chuẩn quốc tế.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500 pt-6 border-t border-slate-100">
              <span>Hiệu lực từ: <strong>01/01/2026</strong></span>
              <span>•</span>
              <span>Tuân thủ: <strong>Nghị định 13/2023/NĐ-CP</strong></span>
              <span>•</span>
              <span>Chứng nhận bảo mật: <strong>ISO/IEC 27001:2022</strong></span>
            </div>
          </div>

          {/* Content sections */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Thông Tin Chúng Tôi Thu Thập</h2>
              </div>
              <p>
                Để phục vụ việc định vị bãi xe gần nhất, đặt chỗ và mở barie tự động, SmartTruckHub thu thập các nhóm thông tin sau:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li><strong>Thông tin tài khoản:</strong> Họ và tên, số điện thoại, địa chỉ email, mật khẩu đã mã hóa một chiều (bcrypt).</li>
                <li><strong>Dữ liệu phương tiện &amp; Vận tải:</strong> Biển số xe đăng kiểm, loại phương tiện (xe tải nhẹ, xe tải nặng, container), tải trọng định mức.</li>
                <li><strong>Dữ liệu định vị (GPS):</strong> Tọa độ vị trí hiện tại khi bạn bật quyền cho phép tìm bãi đỗ xung quanh lộ trình di chuyển.</li>
                <li><strong>Dữ liệu hình ảnh nhận diện ALPR:</strong> Hình ảnh biển số xe chụp tại trạm barie vào/ra để phục vụ đối soát an ninh lưu bãi.</li>
                <li><strong>Thông tin thanh toán:</strong> Lịch sử giao dịch nạp tiền, rút tiền, mã đơn PayOS (hệ thống không lưu trữ trực tiếp số thẻ tín dụng hoặc mã CVV của bạn).</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Mục Đích Sử Dụng Dữ Liệu</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Cung cấp tính năng tìm kiếm bãi đỗ xe tải theo bán kính thực tế và dẫn đường qua bản đồ vệ tinh MapLibre/OSRM.</li>
                <li>Tạo vé điện tử QR và kích hoạt mở barie tự động khi xe tới cổng bãi.</li>
                <li>Đối soát doanh thu, xuất hóa đơn điện tử và gửi thông báo trạng thái đặt chỗ theo thời gian thực.</li>
                <li>Phát hiện, ngăn chặn các hành vi gian lận cước hoặc tranh chấp tài sản bến bãi.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Biện Pháp An Ninh &amp; Bảo Mật</h2>
              </div>
              <p>
                Toàn bộ dữ liệu truyền tải giữa thiết bị người dùng và máy chủ Gateway được mã hóa bằng chuẩn <strong>TLS 1.3 / SSL 256-bit</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Hạ tầng cơ sở dữ liệu được phân vùng riêng biệt, kiểm soát truy cập phân quyền nghiêm ngặt theo tiêu chuẩn <strong>ISO/IEC 27001:2022</strong>.</li>
                <li>Mã định danh phiên làm việc (JWT) được lưu trữ an toàn, tự động hết hạn và có cơ chế xác nhận mật khẩu cho các thao tác tài chính quan trọng.</li>
                <li>Chúng tôi cam kết <strong>không bao giờ bán, cho thuê hay thương mại hóa</strong> thông tin cá nhân của người dùng cho bất kỳ bên thứ ba nào.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Quyền Của Bạn Đối Với Dữ Liệu</h2>
              </div>
              <p>
                Căn cứ theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, bạn có toàn quyền:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Xem, trích xuất và cập nhật thông tin cá nhân trong mục <strong>Hồ sơ tài xế / Hồ sơ chủ bãi</strong> bất kỳ lúc nào.</li>
                <li>Yêu cầu xóa thông tin phương tiện hoặc chấm dứt sử dụng tài khoản khi đã tất toán toàn bộ công nợ lưu bãi.</li>
                <li>Khiếu nại về việc xử lý dữ liệu thông qua kênh hỗ trợ chính thức của SmartTruckHub.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Đơn vị phụ trách Bảo vệ dữ liệu (DPO)</h3>
                <p className="text-xs text-slate-500 mt-1">Email: dpo@smarttruckhub.vn • Hotline hỗ trợ 24/7: 1900 6868</p>
              </div>
              <div className="flex gap-3">
                <Link to="/contact" className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primary-hover transition-colors">
                  Gửi yêu cầu hỗ trợ
                </Link>
                <Link to="/terms" className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors">
                  Điều khoản dịch vụ
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </LandingLayout>
  )
}

export default PrivacyPage
