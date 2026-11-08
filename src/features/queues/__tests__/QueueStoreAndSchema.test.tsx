import { describe, it, expect, beforeEach } from 'vitest'
import {
  leaveQueueSchema,
  queueFilterSchema,
  leaveQueueReasonOptions,
} from '../schemas/queueSchemas'
import {
  getQueueStoreSnapshot,
} from '../store/queueStore'

describe('SCR-018: Queue Store and Schemas Unit Tests', () => {
  beforeEach(() => {
    getQueueStoreSnapshot().resetStore()
  })

  describe('leaveQueueSchema', () => {
    it('validates a standard reason successfully', () => {
      const validData = {
        reason: 'CHANGED_PLAN',
        confirmCheckbox: true,
      }
      const result = leaveQueueSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('requires confirmCheckbox to be true', () => {
      const invalidData = {
        reason: 'CHANGED_PLAN',
        confirmCheckbox: false,
      }
      const result = leaveQueueSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Vui lòng xác nhận')
      }
    })

    it('requires customReason when reason is OTHER', () => {
      const invalidData = {
        reason: 'OTHER',
        customReason: '',
        confirmCheckbox: true,
      }
      const result = leaveQueueSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('tối thiểu 5 ký tự')
      }
    })

    it('validates valid phone number if provided', () => {
      const validData = {
        reason: 'WAIT_TOO_LONG',
        contactPhone: '0912345678',
        confirmCheckbox: true,
      }
      const result = leaveQueueSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid phone number format', () => {
      const invalidData = {
        reason: 'WAIT_TOO_LONG',
        contactPhone: '123456',
        confirmCheckbox: true,
      }
      const result = leaveQueueSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('has all 5 defined reason options', () => {
      expect(leaveQueueReasonOptions.length).toBe(5)
      expect(leaveQueueReasonOptions.map((o) => o.value)).toEqual([
        'CHANGED_PLAN',
        'WAIT_TOO_LONG',
        'FOUND_ALTERNATIVE',
        'EMERGENCY',
        'OTHER',
      ])
    })
  })

  describe('queueFilterSchema', () => {
    it('provides sensible defaults', () => {
      const result = queueFilterSchema.parse({})
      expect(result.activeTab).toBe('ACTIVE')
      expect(result.searchKeyword).toBe('')
      expect(result.statusFilter).toBe('ALL')
    })

    it('validates history tab and filters', () => {
      const result = queueFilterSchema.parse({
        activeTab: 'HISTORY',
        searchKeyword: 'Cát Lái',
        statusFilter: 'CONVERTED',
      })
      expect(result.activeTab).toBe('HISTORY')
      expect(result.searchKeyword).toBe('Cát Lái')
      expect(result.statusFilter).toBe('CONVERTED')
    })
  })

  describe('queueStore actions', () => {
    it('updates activeTab and filters', () => {
      const store = getQueueStoreSnapshot()
      expect(store.activeTab).toBe('ACTIVE')

      store.setActiveTab('HISTORY')
      expect(getQueueStoreSnapshot().activeTab).toBe('HISTORY')

      store.setSearchKeyword('Test Keyword')
      expect(getQueueStoreSnapshot().searchKeyword).toBe('Test Keyword')

      store.setStatusFilter('NOTIFIED')
      expect(getQueueStoreSnapshot().statusFilter).toBe('NOTIFIED')
    })

    it('manages modal open and close states', () => {
      const store = getQueueStoreSnapshot()

      store.openLeaveModal()
      expect(getQueueStoreSnapshot().isLeaveModalOpen).toBe(true)

      store.closeLeaveModal()
      expect(getQueueStoreSnapshot().isLeaveModalOpen).toBe(false)

      store.openAcceptSuccessModal()
      expect(getQueueStoreSnapshot().isAcceptSuccessOpen).toBe(true)

      store.closeAcceptSuccessModal()
      expect(getQueueStoreSnapshot().isAcceptSuccessOpen).toBe(false)
    })

    it('manages toast messages', () => {
      const store = getQueueStoreSnapshot()

      store.showToast('Thao tác thành công', 'success')
      expect(getQueueStoreSnapshot().toastMessage).toBe('Thao tác thành công')
      expect(getQueueStoreSnapshot().toastType).toBe('success')

      store.clearToast()
      expect(getQueueStoreSnapshot().toastMessage).toBeNull()
    })

    it('resets store back to initial state', () => {
      const store = getQueueStoreSnapshot()
      store.setActiveTab('HISTORY')
      store.openLeaveModal()
      store.showToast('Msg', 'error')

      store.resetStore()
      const snapshot = getQueueStoreSnapshot()
      expect(snapshot.activeTab).toBe('ACTIVE')
      expect(snapshot.isLeaveModalOpen).toBe(false)
      expect(snapshot.toastMessage).toBeNull()
    })
  })
})
