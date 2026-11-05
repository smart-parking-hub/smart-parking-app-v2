import { z } from 'zod'

export type VehicleClassification =
  | 'CONTAINER'
  | 'HEAVY_TRUCK'
  | 'BUS_COACH'
  | 'LIGHT_TRUCK'
  | 'SEDAN_SUV'

export interface VehicleOption {
  id: string
  label: string
  type: VehicleClassification
}

export interface ParkingLotItem {
  id: number
  name: string
  address: string
  distanceKm: number
  etaMinutes: number
  availableSlots: number
  totalSlots: number
  slotTypeLabel: string
  maxVehicleLength?: string
  hourlyRate: number
  depositAmount: number
  isBestMatch?: boolean
  amenities: string[]
  latitude: number
  longitude: number
  ratingAverage: number
  isFull?: boolean
  queueActive?: boolean
  queueWaitingCount?: number
  queueEtaMinutes?: number
  specialNote?: string
}

export const searchFilterSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  selectedVehicleId: z.string().min(1, 'Vui lòng chọn phương tiện'),
  vehicleType: z.enum([
    'CONTAINER',
    'HEAVY_TRUCK',
    'BUS_COACH',
    'LIGHT_TRUCK',
    'SEDAN_SUV',
  ]),
  radiusKm: z.number().min(1, 'Bán kính tối thiểu 1km').max(50, 'Bán kính tối đa 50km'),
  sortBy: z.enum(['distance', 'price', 'rating']),
  includeFull: z.boolean(),
  keyword: z.string().max(100, 'Từ khóa quá dài'),
})

export type SearchFilterState = z.infer<typeof searchFilterSchema>

export const quickBookingPayloadSchema = z.object({
  parkingLotId: z.number(),
  parkingLotTitle: z.string(),
  pricePerHour: z.number().nonnegative(),
  availableSlotsText: z.string(),
  vehicleLicensePlate: z.string().min(4, 'Biển số xe không hợp lệ'),
  trailerLicensePlate: z.string().optional(),
  driverName: z.string().min(2, 'Tên tài xế không hợp lệ'),
  driverPhone: z.string().optional(),
  etaText: z.string(),
  depositAmount: z.number().nonnegative(),
  holdDurationMinutes: z.number().default(10),
})

export type QuickBookingPayload = z.infer<typeof quickBookingPayloadSchema>
