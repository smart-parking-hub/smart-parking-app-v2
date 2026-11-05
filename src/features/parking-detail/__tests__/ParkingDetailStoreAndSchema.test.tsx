import { describe, it, expect, beforeEach } from 'vitest'
import { reservationFormSchema } from '../schemas/reservationSchema'
import { parkingDetailStore } from '../store/parkingDetailStore'

describe('SCR-016: Zod Schema and Zustand/Store Verification', () => {
  beforeEach(() => {
    parkingDetailStore.reset()
  })

  describe('reservationFormSchema', () => {
    it('accepts valid driver reservation form data', () => {
      const validData = {
        vehiclePlate: '51D-894.12',
        vehicleType: 'Container 40FT / 45FT',
        durationHours: 6,
        arrivalTime: '16:30 (Hôm nay)',
        paymentMethod: 'PAYOS_VIETQR' as const,
        agreeTerms: true,
      }

      const result = reservationFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid license plate formats', () => {
      const invalidData = {
        vehiclePlate: 'XYZ',
        vehicleType: 'Container 40FT / 45FT',
        durationHours: 6,
        arrivalTime: '16:30',
        paymentMethod: 'PAYOS_VIETQR' as const,
        agreeTerms: true,
      }

      const result = reservationFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Biển số xe')
      }
    })

    it('rejects when agreeTerms is false', () => {
      const invalidData = {
        vehiclePlate: '51D-894.12',
        vehicleType: 'Container 40FT / 45FT',
        durationHours: 6,
        arrivalTime: '16:30',
        paymentMethod: 'PAYOS_VIETQR' as const,
        agreeTerms: false,
      }

      const result = reservationFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('đồng ý với cam kết')
      }
    })

    it('rejects duration outside bounds (0 or > 72 hours)', () => {
      const invalidData = {
        vehiclePlate: '51D-894.12',
        vehicleType: 'Container 40FT / 45FT',
        durationHours: 0,
        arrivalTime: '16:30',
        paymentMethod: 'PAYOS_VIETQR' as const,
        agreeTerms: true,
      }

      const result = reservationFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('parkingDetailStore', () => {
    it('initializes with default values and TTL 600s', () => {
      const state = parkingDetailStore.getState()
      expect(state.selectedPlate).toBe('51D-894.12')
      expect(state.durationHours).toBe(6)
      expect(state.holdSecondsLeft).toBe(600)
      expect(state.paymentMethod).toBe('PAYOS_VIETQR')
      expect(state.isBookingModalOpen).toBe(false)
    })

    it('updates duration and clamps bounds', () => {
      parkingDetailStore.setDuration(12)
      expect(parkingDetailStore.getState().durationHours).toBe(12)

      parkingDetailStore.setDuration(100) // clamp to 72
      expect(parkingDetailStore.getState().durationHours).toBe(72)
    })

    it('manages modal open/close and step transitions', () => {
      parkingDetailStore.openModal('CONFIGURATION')
      expect(parkingDetailStore.getState().isBookingModalOpen).toBe(true)
      expect(parkingDetailStore.getState().modalStep).toBe('CONFIGURATION')

      parkingDetailStore.setModalStep('PAYOS_CHECKOUT')
      expect(parkingDetailStore.getState().modalStep).toBe('PAYOS_CHECKOUT')

      parkingDetailStore.closeModal()
      expect(parkingDetailStore.getState().isBookingModalOpen).toBe(false)
    })

    it('ticks down hold TTL countdown timer', () => {
      parkingDetailStore.resetHoldTimer()
      expect(parkingDetailStore.getState().holdSecondsLeft).toBe(600)

      parkingDetailStore.tickHoldTimer()
      expect(parkingDetailStore.getState().holdSecondsLeft).toBe(599)
    })
  })
})
