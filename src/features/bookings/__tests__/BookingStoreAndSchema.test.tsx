import { describe, it, expect, beforeEach } from 'vitest'
import {
  cancelBookingSchema,
  reviewBookingSchema,
  bookingFilterSchema,
} from '../schemas/bookingSchemas'
import { getBookingStoreSnapshot } from '../store/bookingStore'

describe('SCR-017: Booking Schemas & Zustand Store Unit Tests', () => {
  beforeEach(() => {
    getBookingStoreSnapshot().resetStore()
  })

  describe('cancelBookingSchema', () => {
    it('validates a correct cancel request', () => {
      const validData = {
        reason: 'Thay đổi lịch trình bốc dỡ hàng tại cảng',
        contactPhone: '0912345678',
        preferredResolution: 'REFUND_WALLET' as const,
        bankAccount: '1903000000000',
        note: 'Ghi chú thêm',
      }
      const result = cancelBookingSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects an empty cancel reason', () => {
      const invalidData = {
        reason: '',
      }
      const result = cancelBookingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/lý do hủy/i)
      }
    })

    it('rejects invalid phone number', () => {
      const invalidData = {
        reason: 'Xe hỏng hóc',
        contactPhone: '12345',
      }
      const result = cancelBookingSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toMatch(/số điện thoại/i)
      }
    })
  })

  describe('reviewBookingSchema', () => {
    it('validates a correct review request with 5 stars', () => {
      const validReview = {
        bookingId: 10,
        rating: 5,
        comment: 'Bãi đỗ rất rộng, camera ALPR nhận diện nhanh 0.2s',
      }
      const result = reviewBookingSchema.safeParse(validReview)
      expect(result.success).toBe(true)
    })

    it('rejects ratings outside 1-5 range', () => {
      const zeroStar = { bookingId: 1, rating: 0 }
      const sixStar = { bookingId: 1, rating: 6 }

      expect(reviewBookingSchema.safeParse(zeroStar).success).toBe(false)
      expect(reviewBookingSchema.safeParse(sixStar).success).toBe(false)
    })

    it('rejects missing or non-positive bookingId', () => {
      const invalid = { bookingId: -5, rating: 4 }
      expect(reviewBookingSchema.safeParse(invalid).success).toBe(false)
    })
  })

  describe('bookingFilterSchema', () => {
    it('accepts valid tab and query', () => {
      const filter = {
        activeTab: 'ACTIVE' as const,
        searchKeyword: 'Container Cát Lái',
      }
      expect(bookingFilterSchema.safeParse(filter).success).toBe(true)
    })

    it('rejects invalid activeTab', () => {
      const invalid = {
        activeTab: 'INVALID_TAB',
        searchKeyword: '',
      }
      expect(bookingFilterSchema.safeParse(invalid).success).toBe(false)
    })
  })

  describe('Zustand BookingStore actions', () => {
    it('initializes with default values and allows tab switching', () => {
      const store = getBookingStoreSnapshot()
      expect(store.activeTab).toBe('ALL')
      expect(store.searchKeyword).toBe('')
      expect(store.selectedBookingId).toBe(1)

      store.setActiveTab('PENDING_PAYMENT')
      expect(getBookingStoreSnapshot().activeTab).toBe('PENDING_PAYMENT')

      store.setSearchKeyword('BK-2026')
      expect(getBookingStoreSnapshot().searchKeyword).toBe('BK-2026')

      store.setSelectedBookingId(99)
      expect(getBookingStoreSnapshot().selectedBookingId).toBe(99)
    })

    it('toggles cancel, review and PayOS modals correctly', () => {
      const store = getBookingStoreSnapshot()

      store.openCancelModal()
      expect(getBookingStoreSnapshot().isCancelModalOpen).toBe(true)
      store.closeCancelModal()
      expect(getBookingStoreSnapshot().isCancelModalOpen).toBe(false)

      store.openReviewModal()
      expect(getBookingStoreSnapshot().isReviewModalOpen).toBe(true)
      store.closeReviewModal()
      expect(getBookingStoreSnapshot().isReviewModalOpen).toBe(false)

      store.openPayOsModal('DEPOSIT')
      expect(getBookingStoreSnapshot().isPayOsModalOpen).toBe(true)
      expect(getBookingStoreSnapshot().payOsType).toBe('DEPOSIT')
      store.closePayOsModal()
      expect(getBookingStoreSnapshot().isPayOsModalOpen).toBe(false)
    })

    it('manages toast messages and types', () => {
      const store = getBookingStoreSnapshot()

      store.showToast('Giao dịch thành công', 'success')
      expect(getBookingStoreSnapshot().toastMessage).toBe('Giao dịch thành công')
      expect(getBookingStoreSnapshot().toastType).toBe('success')

      store.clearToast()
      expect(getBookingStoreSnapshot().toastMessage).toBe(null)
    })

    it('resets store back to initial values', () => {
      const store = getBookingStoreSnapshot()
      store.setActiveTab('COMPLETED')
      store.setSearchKeyword('Test')
      store.openCancelModal()

      store.resetStore()
      expect(getBookingStoreSnapshot().activeTab).toBe('ALL')
      expect(getBookingStoreSnapshot().searchKeyword).toBe('')
      expect(getBookingStoreSnapshot().isCancelModalOpen).toBe(false)
    })
  })
})

