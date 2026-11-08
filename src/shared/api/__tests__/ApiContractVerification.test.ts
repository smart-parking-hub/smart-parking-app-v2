import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '../client'
import { adaptSpringPage, toSpringPageParams, createIdempotencyHeader } from '../adapters'
import { getData, sendData } from '../resources'
import { sendSmsRecoveryOtpApi, verifySmsRecoveryOtpApi } from '@/features/auth/api/forgotPassword'
import { generateAiParkingLotContent, deleteMerchantParkingLotImage, setCoverMerchantParkingLotImage } from '@/features/merchant/parking-lots/api/merchantParkingLotApi'
import { fetchUnreadCountApi, markAsReadApi, markAllAsReadApi } from '@/features/notifications/api/notificationApi'
import { createPayOsDepositLink } from '@/features/parking-detail/api/parkingDetailApi'

describe('Controlled API Contract Verification & Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GAP C-2: Spring Data JPA Page Normalization & Adapters', () => {
    it('adapts 0-indexed Spring Page (number: 0) to 1-indexed ClientPage (currentPage: 1)', () => {
      const springPage = {
        content: [{ id: 1, name: 'Bãi Đỗ Tân Cảng' }],
        totalPages: 5,
        totalElements: 48,
        size: 10,
        number: 0,
        first: true,
        last: false,
      }

      const adapted = adaptSpringPage(springPage)
      expect(adapted.currentPage).toBe(1)
      expect(adapted.totalPages).toBe(5)
      expect(adapted.totalElements).toBe(48)
      expect(adapted.pageSize).toBe(10)
      expect(adapted.number).toBe(0)
      expect(adapted.content).toHaveLength(1)
    })

    it('generates correct 0-indexed Spring page query params from 1-indexed UI page', () => {
      const params = toSpringPageParams(3, 20, 'createdAt,desc')
      expect(params.page).toBe(2)
      expect(params.size).toBe(20)
      expect(params.sort).toBe('createdAt,desc')
    })

    it('getData automatically enhances raw Spring Page with currentPage', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        data: {
          code: 200,
          message: 'OK',
          data: {
            content: [{ id: 101 }],
            totalPages: 3,
            totalElements: 25,
            number: 1,
            size: 10,
          },
        },
      } as any)

      const result = await getData<any>('/api/v1/merchant/parking-lots', { page: 1 })
      expect(result.number).toBe(1)
      expect(result.currentPage).toBe(2)
    })
  })

  describe('GAP C-1: Auth Password Recovery Contract Verification', () => {
    it('sendSmsRecoveryOtpApi sends email OTP to /api/v1/auth/forgot-password/otp', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        data: { code: 200, message: 'OTP sent' },
      } as any)

      const message = await sendSmsRecoveryOtpApi('driver@smartparking.vn')
      expect(postSpy).toHaveBeenCalledWith('/api/v1/auth/forgot-password/otp', {
        email: 'driver@smartparking.vn',
      })
      expect(message).toContain('Mã OTP')
    })

    it('verifySmsRecoveryOtpApi sends reset request to /api/v1/auth/forgot-password/reset', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        data: { code: 200, message: 'Password reset' },
      } as any)

      await verifySmsRecoveryOtpApi('driver@smartparking.vn', '123456', 'NewPassword@2026')
      expect(postSpy).toHaveBeenCalledWith('/api/v1/auth/forgot-password/reset', {
        email: 'driver@smartparking.vn',
        otpCode: '123456',
        newPassword: 'NewPassword@2026',
      })
    })
  })

  describe('GAP B-1: AI Assistant Description Generation Contract Verification', () => {
    it('calls /api/v1/ai/generate-description with valid payload and maps segments', async () => {
      vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        data: {
          code: 200,
          data: {
            marketingDescription: 'Depot hiện đại container Cát Lái',
            operatingRegulations: 'Nội quy PCCC cấp 1 nghiêm ngặt',
            wayfindingGuide: 'Di chuyển theo trục Nguyễn Thị Định',
          },
        },
      } as any)

      const segments = await generateAiParkingLotContent({
        name: 'Depot Cát Lái 2',
        address: 'Nguyễn Thị Định, Thủ Đức',
      })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/v1/ai/generate-description',
        expect.objectContaining({
          lotName: 'Depot Cát Lái 2',
          address: 'Nguyễn Thị Định, Thủ Đức',
        })
      )
      expect(segments.logisticsCapacity).toBe('Depot hiện đại container Cát Lái')
      expect(segments.safetyRegulations).toBe('Nội quy PCCC cấp 1 nghiêm ngặt')
      expect(segments.circulationGuide).toBe('Di chuyển theo trục Nguyễn Thị Định')
    })
  })

  describe('GAP B-2: ALPR Gate Check-In & Check-Out Settlement', () => {
    it('calls POST /api/v1/merchant/check-out with bookingCode and parkingLotId', async () => {
      const reqSpy = vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
        data: {
          code: 200,
          message: 'Check-out thành công!',
          data: {
            bookingCode: 'BK-2026-9081',
            totalAmount: 120000,
            advanceDeposit: 50000,
            amountDue: 70000,
            parkingMinutes: 270,
            bookingStatus: 'COMPLETED',
          },
        },
      } as any)

      const settlement = await sendData('post', '/api/v1/merchant/check-out', {
        bookingCode: 'BK-2026-9081',
        parkingLotId: 12,
      })

      expect(reqSpy).toHaveBeenCalledWith({
        method: 'post',
        url: '/api/v1/merchant/check-out',
        data: {
          bookingCode: 'BK-2026-9081',
          parkingLotId: 12,
        },
      })
      expect(settlement).toEqual(
        expect.objectContaining({
          bookingCode: 'BK-2026-9081',
          amountDue: 70000,
        })
      )
    })
  })

  describe('GAP B-3: Notification System Authorization & Endpoints', () => {
    it('fetchUnreadCountApi calls /api/v1/notifications/unread-count via apiClient', async () => {
      vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
        data: { code: 200, data: 7 },
      } as any)

      const count = await fetchUnreadCountApi()
      expect(apiClient.get).toHaveBeenCalledWith('/api/v1/notifications/unread-count')
      expect(count).toBe(7)
    })

    it('markAsReadApi sends PUT to /api/v1/notifications/:id/read', async () => {
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: { code: 200, message: 'Read' },
      } as any)

      await markAsReadApi(42)
      expect(putSpy).toHaveBeenCalledWith('/api/v1/notifications/42/read')
    })

    it('markAllAsReadApi sends PUT to /api/v1/notifications/read-all', async () => {
      const putSpy = vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
        data: { code: 200, message: 'All read' },
      } as any)

      await markAllAsReadApi()
      expect(putSpy).toHaveBeenCalledWith('/api/v1/notifications/read-all')
    })
  })

  describe('GAP B-4: Merchant Parking Lot Photo Management Contracts', () => {
    it('deleteMerchantParkingLotImage calls DELETE /api/v1/merchant/parking-lots/:id/images/:imgId', async () => {
      const delSpy = vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({
        data: { code: 200, message: 'Deleted' },
      } as any)

      await deleteMerchantParkingLotImage(10, 501)
      expect(delSpy).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/10/images/501')
    })

    it('setCoverMerchantParkingLotImage calls PATCH /api/v1/merchant/parking-lots/:id/images/:imgId/cover', async () => {
      const patchSpy = vi.spyOn(apiClient, 'patch').mockResolvedValueOnce({
        data: { code: 200, message: 'Cover updated' },
      } as any)

      await setCoverMerchantParkingLotImage(10, 501)
      expect(patchSpy).toHaveBeenCalledWith('/api/v1/merchant/parking-lots/10/images/501/cover')
    })
  })

  describe('GAP B-5: Admin Parking Lot Change Request', () => {
    it('calls PUT /api/v1/admin/parking-lots/:id/request-changes with reason justification', async () => {
      const reqSpy = vi.spyOn(apiClient, 'request').mockResolvedValueOnce({
        data: { code: 200, message: 'Yêu cầu sửa đổi thành công', data: null },
      } as any)

      await sendData('put', '/api/v1/admin/parking-lots/45/request-changes', {
        reason: 'Bổ sung giấy chứng nhận kiểm định trạm cân 100 tấn.',
      })

      expect(reqSpy).toHaveBeenCalledWith({
        method: 'put',
        url: '/api/v1/admin/parking-lots/45/request-changes',
        data: {
          reason: 'Bổ sung giấy chứng nhận kiểm định trạm cân 100 tấn.',
        },
      })
    })
  })

  describe('GAP C-3 & Payment Service Contract Alignment', () => {
    it('createPayOsDepositLink targets backend POST /api/v1/payments with DEPOSIT type', async () => {
      const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
        data: {
          code: 200,
          data: 'https://pay.payos.vn/web/checkout-real-token',
        },
      } as any)

      const result = await createPayOsDepositLink('9081', 100000)
      expect(postSpy).toHaveBeenCalledWith('/api/v1/payments', {
        bookingId: 9081,
        paymentType: 'DEPOSIT',
      })
      expect(result.checkoutUrl).toBe('https://pay.payos.vn/web/checkout-real-token')
    })
  })

  describe('GAP H-1 / PROPOSED-API-06: PayOS Idempotency Header Guard', () => {
    it('creates a unique Idempotency-Key header when none is provided', () => {
      const headers = createIdempotencyHeader()
      expect(headers['Idempotency-Key']).toBeDefined()
      expect(typeof headers['Idempotency-Key']).toBe('string')
      expect(headers['Idempotency-Key'].length).toBeGreaterThan(5)
    })

    it('preserves an explicit Idempotency-Key if supplied', () => {
      const headers = createIdempotencyHeader('CUSTOM-IDEMPOTENCY-UUID-1234')
      expect(headers['Idempotency-Key']).toBe('CUSTOM-IDEMPOTENCY-UUID-1234')
    })
  })
})
