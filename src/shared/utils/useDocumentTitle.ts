import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const crmTitles: Array<{ pattern: RegExp; title: string }> = [
  // Auth
  { pattern: /^\/login/, title: 'Đăng nhập tài khoản' },
  { pattern: /^\/register/, title: 'Đăng ký tài khoản mới' },
  { pattern: /^\/forgot-password/, title: 'Khôi phục mật khẩu' },

  // Driver
  { pattern: /^\/(?:dashboard|driver)?$/, title: 'Tổng quan tài xế' },
  { pattern: /^\/(?:dashboard\/|driver\/)?parking\/[0-9]+/, title: 'Chi tiết bãi đỗ xe' },
  { pattern: /^\/(?:dashboard\/|driver\/)?(?:parking|search)/, title: 'Bản đồ & Tìm bãi đỗ xe' },
  { pattern: /^\/(?:dashboard\/|driver\/)?bookings/, title: 'Lịch sử đặt chỗ & Vé QR' },
  { pattern: /^\/(?:dashboard\/|driver\/)?vehicles/, title: 'Quản lý phương tiện' },
  { pattern: /^\/(?:dashboard\/|driver\/)?wallet/, title: 'Ví điện tử' },
  { pattern: /^\/(?:dashboard\/|driver\/)?payments/, title: 'Lịch sử giao dịch' },
  { pattern: /^\/(?:dashboard\/|driver\/)?profile/, title: 'Hồ sơ cá nhân' },
  { pattern: /^\/(?:dashboard\/|driver\/)?notifications/, title: 'Thông báo tài xế' },
  { pattern: /^\/(?:dashboard\/|driver\/)?disputes/, title: 'Khiếu nại & Hỗ trợ' },

  // Merchant
  { pattern: /^\/merchant\/dashboard/, title: 'Tổng quan vận hành bãi' },
  { pattern: /^\/merchant\/parking-lots\/new/, title: 'Đăng ký bãi đỗ mới' },
  { pattern: /^\/merchant\/parking-lots\/[0-9]+\/slots/, title: 'Cấu hình sơ đồ ô đỗ' },
  { pattern: /^\/merchant\/parking-lots\/[0-9]+/, title: 'Chi tiết bãi đỗ xe' },
  { pattern: /^\/merchant\/parking-lots/, title: 'Bãi đỗ của tôi' },
  { pattern: /^\/merchant\/bookings/, title: 'Quản lý lượt đặt bãi' },
  { pattern: /^\/merchant\/qr-scanner/, title: 'Quét mã QR cổng' },
  { pattern: /^\/merchant\/revenue/, title: 'Báo cáo doanh thu' },
  { pattern: /^\/merchant\/withdrawals/, title: 'Ví & Yêu cầu rút tiền' },
  { pattern: /^\/merchant\/profile/, title: 'Hồ sơ chủ bãi' },
  { pattern: /^\/merchant\/notifications/, title: 'Thông báo chủ bãi' },

  // Admin
  { pattern: /^\/admin\/dashboard/, title: 'Tổng quan quản trị' },
  { pattern: /^\/admin\/parking-lots/, title: 'Quản lý bãi đỗ toàn hệ thống' },
  { pattern: /^\/admin\/merchant-verifications/, title: 'Xét duyệt hồ sơ đối tác' },
  { pattern: /^\/admin\/users/, title: 'Quản trị người dùng' },
  { pattern: /^\/admin\/transactions/, title: 'Đối soát giao dịch' },
  { pattern: /^\/admin\/withdrawals/, title: 'Phê duyệt yêu cầu rút tiền' },
  { pattern: /^\/admin\/disputes/, title: 'Xử lý khiếu nại' },
  { pattern: /^\/admin\/audit-logs/, title: 'Nhật ký kiểm toán hệ thống' },

  // Legal & Errors
  { pattern: /^\/terms/, title: 'Điều khoản dịch vụ' },
  { pattern: /^\/privacy/, title: 'Chính sách bảo mật' },
  { pattern: /^\/403/, title: 'Truy cập bị từ chối' },
]

export function useDocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const matched = crmTitles.find(({ pattern }) => pattern.test(pathname))
    if (matched) {
      document.title = `${matched.title} | SmartTruckHub`
    }
  }, [pathname])
}
