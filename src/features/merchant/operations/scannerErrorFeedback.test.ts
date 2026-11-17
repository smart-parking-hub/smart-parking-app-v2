import { describe, expect, it } from 'vitest'
import { scannerErrorFeedback } from './scannerErrorFeedback'

describe('scanner error feedback', () => {
  it('explains that a code is invalid for the selected lot, rather than globally invalid', () => {
    const feedback = scannerErrorFeedback(new Error('Mã đặt chỗ này thuộc về bãi đỗ xe khác!'), 'check-out')
    expect(feedback.title).toBe('Mã QR không hợp lệ tại bãi đang chọn')
    expect(feedback.message).toContain('chọn đúng bãi kiểm soát')
  })
  it.each(['Booking không tồn tại!', 'Không tìm thấy lượt đặt chỗ'])('explains an unknown booking (%s)', message => {
    expect(scannerErrorFeedback(new Error(message), 'check-in').title).toBe('Mã QR không hợp lệ')
  })
  it('uses the backend booking-not-found code even when its message changes', () => {
    const error = { isAxiosError: true, response: { data: { code: 'BOOK_001', message: 'Ticket not found' } } }
    expect(scannerErrorFeedback(error, 'check-out').title).toBe('Mã QR không hợp lệ')
  })
  it.each(['Chưa đến giờ check-in (chỉ được vào bãi trước tối đa 30 phút)!', 'Không kết nối được máy chủ. Vui lòng thử lại.', 'Booking không ở trạng thái đang đỗ!'])('keeps other rejection reasons accurate (%s)', message => {
    expect(scannerErrorFeedback(new Error(message), 'check-out')).toEqual({ title: 'Chưa thể cho xe ra bãi', message })
  })
})
