import { useSyncExternalStore } from 'react'
import type {
  BookingCreationResult,
  BookingFlowStep,
  PaymentMethodType,
} from '../types/parkingDetailTypes'

export interface ParkingDetailState {
  facilityId: number
  selectedPlate: string
  vehicleDescription: string
  vehicleType: string
  durationHours: number
  hourlyRate: number
  depositPercentage: number
  arrivalTime: string
  paymentMethod: PaymentMethodType
  isBookingModalOpen: boolean
  modalStep: BookingFlowStep
  holdSecondsLeft: number
  isHoldRunning: boolean
  bookingResult: BookingCreationResult | null
}

const initialState: ParkingDetailState = {
  facilityId: 1,
  selectedPlate: '51D-894.12',
  vehicleDescription: 'Container 40FT · Mooc 51R-028.94',
  vehicleType: 'Container 40FT / 45FT',
  durationHours: 6,
  hourlyRate: 40000,
  depositPercentage: 20,
  arrivalTime: '16:30 (Hôm nay)',
  paymentMethod: 'PAYOS_VIETQR',
  isBookingModalOpen: false,
  modalStep: 'CONFIGURATION',
  holdSecondsLeft: 600, // 10 minutes TTL
  isHoldRunning: false,
  bookingResult: null,
}

let state: ParkingDetailState = { ...initialState }
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const parkingDetailStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  setFacilityId: (facilityId: number) => {
    state = { ...state, facilityId }
    emitChange()
  },
  setVehicle: (plate: string, desc: string, type = 'Container 40FT / 45FT') => {
    state = {
      ...state,
      selectedPlate: plate,
      vehicleDescription: desc,
      vehicleType: type,
    }
    emitChange()
  },
  setDuration: (hours: number) => {
    state = { ...state, durationHours: Math.max(1, Math.min(72, hours)) }
    emitChange()
  },
  setArrivalTime: (time: string) => {
    state = { ...state, arrivalTime: time }
    emitChange()
  },
  setPaymentMethod: (method: PaymentMethodType) => {
    state = { ...state, paymentMethod: method }
    emitChange()
  },
  setHourlyRate: (rate: number) => {
    state = { ...state, hourlyRate: rate }
    emitChange()
  },
  openModal: (step: BookingFlowStep = 'CONFIGURATION') => {
    state = {
      ...state,
      isBookingModalOpen: true,
      modalStep: step,
      isHoldRunning: true,
    }
    emitChange()
  },
  closeModal: () => {
    state = {
      ...state,
      isBookingModalOpen: false,
      modalStep: 'CONFIGURATION',
      isHoldRunning: false,
    }
    emitChange()
  },
  setModalStep: (step: BookingFlowStep) => {
    state = { ...state, modalStep: step }
    emitChange()
  },
  tickHoldTimer: () => {
    if (state.holdSecondsLeft > 0) {
      state = { ...state, holdSecondsLeft: state.holdSecondsLeft - 1 }
      emitChange()
    }
  },
  resetHoldTimer: () => {
    state = { ...state, holdSecondsLeft: 600, isHoldRunning: true }
    emitChange()
  },
  setBookingResult: (result: BookingCreationResult | null) => {
    state = { ...state, bookingResult: result }
    emitChange()
  },
  reset: () => {
    state = { ...initialState }
    emitChange()
  },
}

export function useParkingDetailStore<T>(selector: (state: ParkingDetailState) => T): T {
  return useSyncExternalStore(
    parkingDetailStore.subscribe,
    () => selector(parkingDetailStore.getState()),
    () => selector(initialState),
  )
}
