import { apiClient } from '@/shared/api/client'
import type {
  BulkSlotConfigRequest,
  SimpleLotHeaderInfo,
  SlotMatrixItem,
  VehicleType,
} from '../types/merchantSlotsTypes'

export const fallbackLotInfo: SimpleLotHeaderInfo = {
  id: 1,
  code: 'VN-SGN-CLG2-09',
  name: 'Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)',
  address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức, TP. Hồ Chí Minh',
  status: 'APPROVED',
  gateSystem: 'CỔNG TỰ ĐỘNG ALPR 0.2S',
  alprStatusText: 'ALPR GATE 24/7 TRỰC TUYẾN',
  alprLatencyMs: 300,
}

export const fallbackSlotMatrix: SlotMatrixItem[] = [
  {
    id: 1,
    vehicleType: 'CONTAINER',
    typeNameVi: 'Container 40FT / 45FT Reefer & Khô',
    subTitle:
      'Thông số kỹ thuật bến: Chiều dài ô đỗ 16.5m · Tĩnh không 4.8m · Cụm cấp nguồn điện lạnh Reefer 380V/32A độc lập từng vị trí.',
    codeRange: 'Slot #101-#130',
    totalCapacity: 30,
    availableCapacity: 2,
    occupiedCapacity: 28,
    maxAllowed: 100,
    specs: {
      lengthMeters: 16.5,
      powerOutlet: 'Reefer 380V/32A',
      maxTonnageTon: 45,
      notes: 'Trạm cấp nguồn điện Reefer 380V độc lập',
    },
    tagLabel: 'CONTAINER',
    tagTone: 'navy',
  },
  {
    id: 2,
    vehicleType: 'HEAVY_TRUCK',
    typeNameVi: 'Xe Tải Nặng 3-4 Chân & Đầu Kéo Bobtail',
    subTitle:
      'Quy cách kỹ thuật: Chiều dài ô đỗ 12.0m · Bán kính quay đầu tối thiểu 18m · Bề mặt bê tông cường độ cao chịu tải 60 tấn.',
    codeRange: 'Phân khu Bến B',
    totalCapacity: 30,
    availableCapacity: 0,
    occupiedCapacity: 30,
    maxAllowed: 100,
    specs: {
      lengthMeters: 12.0,
      turningRadiusM: 18,
      maxTonnageTon: 60,
      specialLane: 'Hàng đợi ảo: Kích hoạt',
      notes: 'Bề mặt chịu tải trọng 60T',
    },
    tagLabel: 'TRUCK_HEAVY',
    tagTone: 'orange',
    statusNotice: 'FULL 100%',
  },
  {
    id: 3,
    vehicleType: 'LIGHT_TRUCK',
    typeNameVi: 'Xe Tải Trung & Nhẹ (Dưới 15 Tấn)',
    subTitle:
      'Khu vực chuyển tải nhanh gom hàng lẻ: Chiều dài ô đỗ tiêu chuẩn 9.8m · Làn trung chuyển kết nối trực tiếp kho CFS.',
    codeRange: 'Phân khu C3',
    totalCapacity: 20,
    availableCapacity: 6,
    occupiedCapacity: 14,
    maxAllowed: 100,
    specs: {
      lengthMeters: 9.8,
      specialLane: 'Làn gom hàng CFS',
      notes: 'Đỗ tối đa 24h',
    },
    tagLabel: 'TRUCK_LIGHT',
    tagTone: 'blue',
  },
  {
    id: 4,
    vehicleType: 'BUS_COACH',
    typeNameVi: 'Xe Khách & Xe Đưa Đón Chuyên Dụng',
    subTitle:
      'Làn đón trả và đỗ xe khách, xe buýt đưa đón công nhân cảng Tân Cảng · Chiều dài ô đỗ 12.0m tiêu chuẩn.',
    codeRange: 'Làn Luân Chuyển D',
    totalCapacity: 0,
    availableCapacity: 0,
    occupiedCapacity: 0,
    maxAllowed: 50,
    specs: {
      lengthMeters: 12.0,
      specialLane: 'Làn ưu tiên đưa đón',
      notes: 'Mặt bằng dự phòng cao điểm',
    },
    tagLabel: 'BUS_COACH',
    tagTone: 'gray',
    statusNotice: 'Chưa kích hoạt',
  },
  {
    id: 5,
    vehicleType: 'SEDAN_SUV',
    typeNameVi: 'Xe Ô Tô Con & Xe Hỗ Trợ Kỹ Thuật',
    subTitle:
      'Khu vực có mái che gần nhà điều hành bến xe: Phục vụ đoàn kiểm dịch hải quan, xe công vụ Tân Cảng và đối tác kiểm định.',
    codeRange: 'Khu Mái Che Điều Hành',
    totalCapacity: 0,
    availableCapacity: 0,
    occupiedCapacity: 0,
    maxAllowed: 30,
    specs: {
      lengthMeters: 5.5,
      specialLane: 'Khu mái che điều hành',
      notes: 'Cổng Barie chuyên trách',
    },
    tagLabel: 'SEDAN_SUV',
    tagTone: 'gray',
    statusNotice: 'Nội bộ / Hỗ trợ',
  },
]

interface BackendSlotDto {
  id: number
  vehicleType: VehicleType
  totalCapacity: number
  availableCapacity: number
}

interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export async function fetchMerchantLotSimpleInfo(
  parkingLotId: number,
): Promise<SimpleLotHeaderInfo> {
  try {
    const res = await apiClient.get<ApiResponse<SimpleLotHeaderInfo>>(
      `/api/v1/merchant/parking-lots/${parkingLotId}`,
    )
    if (res.data?.data) {
      return {
        ...fallbackLotInfo,
        ...res.data.data,
      }
    }
  } catch {
    // offline or backend fallback
  }

  return {
    ...fallbackLotInfo,
    id: parkingLotId,
  }
}

export async function fetchMerchantLotSlots(
  parkingLotId: number,
): Promise<SlotMatrixItem[]> {
  try {
    const res = await apiClient.get<ApiResponse<BackendSlotDto[]>>(
      `/api/v1/parking-lots/${parkingLotId}/slots`,
    )
    const backendSlots = res.data?.data
    if (Array.isArray(backendSlots) && backendSlots.length > 0) {
      const byType = new Map(backendSlots.map((s) => [s.vehicleType, s]))
      return fallbackSlotMatrix.map((item) => {
        const found = byType.get(item.vehicleType)
        if (found) {
          const occupied = Math.max(0, found.totalCapacity - found.availableCapacity)
          return {
            ...item,
            id: found.id || item.id,
            totalCapacity: found.totalCapacity,
            availableCapacity: found.availableCapacity,
            occupiedCapacity: occupied,
          }
        }
        return item
      })
    }
  } catch {
    // fallback to mock
  }

  return fallbackSlotMatrix
}

export async function updateMerchantLotSlotsBulk(
  parkingLotId: number,
  payload: BulkSlotConfigRequest,
): Promise<SlotMatrixItem[]> {
  try {
    const res = await apiClient.put<ApiResponse<BackendSlotDto[]>>(
      `/api/v1/merchant/parking-lots/${parkingLotId}/slots/bulk`,
      payload,
    )
    const backendSlots = res.data?.data
    if (Array.isArray(backendSlots) && backendSlots.length > 0) {
      const byType = new Map(backendSlots.map((s) => [s.vehicleType, s]))
      return fallbackSlotMatrix.map((item) => {
        const found = byType.get(item.vehicleType)
        if (found) {
          const occupied = Math.max(0, found.totalCapacity - found.availableCapacity)
          return {
            ...item,
            id: found.id || item.id,
            totalCapacity: found.totalCapacity,
            availableCapacity: found.availableCapacity,
            occupiedCapacity: occupied,
          }
        }
        return item
      })
    }
  } catch {
    // If backend offline or mock mode, compute update in-memory
  }

  // Fallback in-memory update
  const payloadMap = new Map(payload.slots.map((s) => [s.vehicleType, s.totalCapacity]))
  return fallbackSlotMatrix.map((item) => {
    if (payloadMap.has(item.vehicleType)) {
      const newTotal = payloadMap.get(item.vehicleType)!
      const occupied = item.occupiedCapacity
      return {
        ...item,
        totalCapacity: newTotal,
        availableCapacity: Math.max(0, newTotal - occupied),
      }
    }
    return item
  })
}
