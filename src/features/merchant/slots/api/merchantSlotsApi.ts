import { apiClient } from '@/shared/api/client'
import type { BulkSlotConfigRequest, SimpleLotHeaderInfo, SlotMatrixItem, VehicleType } from '../types/merchantSlotsTypes'

interface BackendSlotDto {
  id: number
  vehicleType: VehicleType
  totalCapacity: number
  availableCapacity: number
}
interface ApiResponse<T> { data: T }
export const vehicleNames: Record<VehicleType, string> = {
  CONTAINER: 'Xe container',
  HEAVY_TRUCK: 'Xe tải nặng',
  LIGHT_TRUCK: 'Xe tải nhẹ',
  BUS_COACH: 'Xe khách',
  SEDAN_SUV: 'Ô tô con / SUV',
}
function mapSlots(slots: BackendSlotDto[]): SlotMatrixItem[] {
  if (!Array.isArray(slots)) throw new Error('Dữ liệu sức chứa không hợp lệ. Vui lòng thử lại.')
  return slots.map((slot) => ({
    ...slot,
    typeNameVi: vehicleNames[slot.vehicleType] ?? slot.vehicleType,
    occupiedCapacity: Math.max(0, slot.totalCapacity - slot.availableCapacity),
  }))
}
export async function fetchMerchantLotSimpleInfo(parkingLotId: number): Promise<SimpleLotHeaderInfo> {
  const res = await apiClient.get<ApiResponse<SimpleLotHeaderInfo>>(`/api/v1/merchant/parking-lots/${parkingLotId}`)
  if (!res.data.data) throw new Error('Không tải được thông tin bãi đỗ.')
  return res.data.data
}
export async function fetchMerchantLotSlots(parkingLotId: number): Promise<SlotMatrixItem[]> {
  const res = await apiClient.get<ApiResponse<BackendSlotDto[]>>(`/api/v1/parking-lots/${parkingLotId}/slots`)
  return mapSlots(res.data.data)
}
export async function updateMerchantLotSlotsBulk(parkingLotId: number, payload: BulkSlotConfigRequest): Promise<SlotMatrixItem[]> {
  const res = await apiClient.put<ApiResponse<BackendSlotDto[]>>(`/api/v1/merchant/parking-lots/${parkingLotId}/slots/bulk`, payload)
  return mapSlots(res.data.data)
}
