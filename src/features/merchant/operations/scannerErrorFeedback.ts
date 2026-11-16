import { isAxiosError } from 'axios'
import { errorMessage } from '@/shared/api/resources'

export function scannerErrorFeedback(error: unknown, mode: 'check-in' | 'check-out') {
  const message = errorMessage(error)
  const code = isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined
  if (message === 'Mã đặt chỗ này thuộc về bãi đỗ xe khác!') {
    return {
      title: 'Mã QR không hợp lệ tại bãi đang chọn',
      message: 'Mã vé này thuộc bãi đỗ khác. Vui lòng chọn đúng bãi kiểm soát hoặc quét lại mã QR.',
    }
  }
  if (code === 'BOOK_001' || message === 'Booking không tồn tại!' || message === 'Không tìm thấy lượt đặt chỗ') {
    return {
      title: 'Mã QR không hợp lệ',
      message: 'Không tìm thấy vé tương ứng với mã này. Vui lòng kiểm tra mã vé hoặc quét lại.',
    }
  }
  return { title: mode === 'check-in' ? 'Chưa thể cho xe vào bãi' : 'Chưa thể cho xe ra bãi', message }
}
