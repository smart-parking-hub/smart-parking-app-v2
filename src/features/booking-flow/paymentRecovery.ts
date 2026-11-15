import type { Booking, PaymentResult } from './api'
import { bookingTimestamp } from './time'

export interface RecoveryView {
  title: string
  description: string
  tone: 'success' | 'neutral' | 'warning'
  action: 'check' | 'pay' | 'ticket' | 'search' | 'support'
}

export function paymentRecovery(booking: Booking, payment: PaymentResult | null, now: number, cancelled: boolean): RecoveryView {
  if (payment?.status === 'REQUIRES_REVIEW') return { title: 'Khoản thanh toán cần kiểm tra', description: 'Vui lòng liên hệ hỗ trợ để đối soát khoản đã chuyển trước khi thanh toán thêm.', tone: 'warning', action: 'support' }
  if (payment?.status === 'REFUNDED') return { title: 'Giao dịch đã được hoàn tiền', description: 'Bạn có thể xem tình trạng vé và lịch sử giao dịch trong tài khoản.', tone: 'neutral', action: 'ticket' }
  if (['COMPLETED', 'REVIEWED'].includes(booking.status)) return { title: 'Đã hoàn tất thanh toán', description: 'Lượt đỗ của bạn đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ.', tone: 'success', action: 'ticket' }
  if (booking.status === 'PENDING_CHECKIN') return { title: 'Đã thanh toán cọc', description: 'Vé đã sẵn sàng. Mở vé QR và xuất trình khi đến bãi trong khung giờ check-in.', tone: 'success', action: 'ticket' }
  if (['PARKING', 'OVERTIME'].includes(booking.status)) return { title: 'Xe đang đỗ tại bãi', description: 'Tiền cọc đã được xác nhận. Phần còn lại sẽ được quyết toán khi xe ra bãi.', tone: 'success', action: 'ticket' }
  if (['EXPIRED', 'CANCELLED'].includes(booking.status)) return { title: booking.status === 'EXPIRED' ? 'Vé đã hết hạn' : 'Vé đã hủy', description: 'Vé này không còn được thanh toán. Nếu đã chuyển khoản, hãy liên hệ hỗ trợ để kiểm tra giao dịch.', tone: 'neutral', action: 'search' }
  const final = booking.status === 'AWAITING_FINAL_PAYMENT'
  if (payment?.status === 'SUCCESS' && (!payment.type || payment.type === (final ? 'FINAL_PAYMENT' : 'DEPOSIT'))) return { title: 'Đã ghi nhận thanh toán', description: 'Hệ thống đang cập nhật vé. Bạn không cần thanh toán thêm cho giao dịch này.', tone: 'success', action: 'check' }
  if (!final && !(bookingTimestamp(booking.expiresAt) > now)) return { title: 'Thời gian giữ chỗ đã hết', description: 'Đang cập nhật tình trạng vé. Bạn có thể tìm bãi để đặt một lượt mới.', tone: 'neutral', action: 'search' }
  const matchingType = !payment?.type || payment.type === (final ? 'FINAL_PAYMENT' : 'DEPOSIT')
  const hasAmount = final ? booking.totalAmount != null && booking.totalAmount > booking.advanceDeposit : booking.advanceDeposit > 0
  if (matchingType && hasAmount && ((payment?.status === 'FAILED' && payment.canRetry) || (payment?.status === 'PENDING' && payment.canResume))) return { title: final ? 'Chưa hoàn tất thanh toán phần còn lại' : 'Thanh toán chưa hoàn tất', description: payment.canRetry ? 'Phiên thanh toán trước đã hủy và chưa ghi nhận tiền. Bạn có thể mở phiên thanh toán mới cho vé này.' : 'Vé vẫn còn hiệu lực. Bạn có thể tiếp tục phiên thanh toán đã được kiểm tra.', tone: 'neutral', action: 'pay' }
  return { title: cancelled ? 'Bạn đã dừng thanh toán' : 'Chưa xác nhận thanh toán', description: 'Rời PayOS không tự hủy vé. Nếu bạn vừa chuyển khoản, hãy chờ một lúc rồi kiểm tra lại trước khi thanh toán tiếp.', tone: 'neutral', action: 'check' }
}
