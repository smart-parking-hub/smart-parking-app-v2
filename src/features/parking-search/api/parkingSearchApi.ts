import { apiClient } from '@/shared/api/client'
import type {
  ParkingLotItem,
  SearchFilterState,
  VehicleOption,
} from '../types/parkingSearchTypes'

export const fallbackVehicleOptions: VehicleOption[] = [
  {
    id: 'cont40',
    label: 'Đầu kéo 51D-894.12 (Container 40FT)',
    type: 'CONTAINER',
  },
  {
    id: 'cont45',
    label: 'Đầu kéo 50H-312.89 (Container 45FT Reefer)',
    type: 'CONTAINER',
  },
  {
    id: 'heavy15t',
    label: 'Hino 500 15T - 60C-982.11 (Xe tải nặng)',
    type: 'HEAVY_TRUCK',
  },
]

export const fallbackParkingLots: ParkingLotItem[] = [
  {
    id: 1,
    name: 'Trạm Dừng & Bãi Container Tân Cảng - Phú Hữu',
    address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    distanceKm: 2.4,
    etaMinutes: 6,
    availableSlots: 12,
    totalSlots: 80,
    slotTypeLabel: 'Còn 12 / 80 Slot Container 40FT trống',
    maxVehicleLength: 'Tối đa 45FT Reefer',
    hourlyRate: 40000,
    depositAmount: 100000,
    isBestMatch: true,
    amenities: [
      'Camera AI 360°',
      'Barie tự động',
      'Sạc Reefer 3-Phase',
      'Tắm giặt tài xế',
    ],
    latitude: 10.7681,
    longitude: 106.7942,
    ratingAverage: 4.8,
  },
  {
    id: 2,
    name: 'Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2',
    address: 'ĐT743A, KCN Sóng Thần 2, Dĩ An',
    distanceKm: 6.8,
    etaMinutes: 14,
    availableSlots: 5,
    totalSlots: 50,
    slotTypeLabel: 'Còn 05 Slot Container trống',
    maxVehicleLength: 'Nền bê tông tải nặng 60T',
    hourlyRate: 35000,
    depositAmount: 100000,
    amenities: ['Bảo vệ 24/7 có trạm cân', 'Camera AI', 'Căn tin'],
    latitude: 10.8924,
    longitude: 106.7725,
    ratingAverage: 4.6,
  },
  {
    id: 3,
    name: 'Depot Container Cát Lái Gate 2',
    address: 'Đường Lê Phụng Hiểu, P. Cát Lái, TP. Thủ Đức',
    distanceKm: 1.8,
    etaMinutes: 4,
    availableSlots: 0,
    totalSlots: 120,
    slotTypeLabel: 'HẾT CHỖ TRỐNG VẬT LÝ (0/120)',
    isFull: true,
    queueActive: true,
    queueWaitingCount: 3,
    queueEtaMinutes: 18,
    hourlyRate: 45000,
    depositAmount: 100000,
    amenities: ['Hàng đợi ảo ALPR', 'Bảo vệ 24/7'],
    latitude: 10.7715,
    longitude: 106.7865,
    ratingAverage: 4.5,
  },
  {
    id: 4,
    name: 'Bãi Trung Chuyển Cao Tốc Long Thành - Dầu Giây',
    address: 'Nút giao Vành đai 2, TP. Thủ Đức, TP.HCM',
    distanceKm: 11.2,
    etaMinutes: 20,
    availableSlots: 18,
    totalSlots: 100,
    slotTypeLabel: 'Còn 18 chỗ Container',
    hourlyRate: 30000,
    depositAmount: 80000,
    amenities: ['Trạm sạc điện', 'Tắm giặt tài xế', 'Cửa hàng tiện lợi'],
    latitude: 10.8123,
    longitude: 106.8456,
    ratingAverage: 4.7,
  },
]

export async function fetchParkingLots(filters: SearchFilterState): Promise<ParkingLotItem[]> {
  try {
    const response = await apiClient.get('/v1/parking-lots/search', {
      params: {
        vehicleType: filters.vehicleType,
        radiusKm: filters.radiusKm,
        keyword: filters.keyword || undefined,
        sortBy: filters.sortBy,
        showFullLots: filters.includeFull,
      },
    })

    const rawData = response.data?.content || response.data?.data?.content || []
    if (Array.isArray(rawData) && rawData.length > 0) {
      return rawData.map((item: ParkingLotItem) => ({
        id: item.id,
        name: item.name,
        address: item.address,
        distanceKm: item.distanceKm || 2.5,
        etaMinutes: item.etaMinutes || 8,
        availableSlots: item.availableSlots || 10,
        totalSlots: item.totalSlots || 50,
        slotTypeLabel: item.slotTypeLabel || `Còn ${item.availableSlots || 10} chỗ`,
        hourlyRate: item.hourlyRate || 40000,
        depositAmount: item.depositAmount || 100000,
        isBestMatch: item.isBestMatch,
        maxVehicleLength: item.maxVehicleLength,
        isFull: item.isFull,
        queueActive: item.queueActive,
        queueWaitingCount: item.queueWaitingCount,
        queueEtaMinutes: item.queueEtaMinutes,
        amenities: item.amenities || ['Camera AI', 'Bảo vệ 24/7'],
        latitude: item.latitude || 10.7681,
        longitude: item.longitude || 106.7942,
        ratingAverage: item.ratingAverage || 4.7,
      }))
    }
    return filterMockData(filters)
  } catch {
    return filterMockData(filters)
  }
}

function filterMockData(filters: SearchFilterState): ParkingLotItem[] {
  return fallbackParkingLots.filter((lot) => {
    if (!filters.includeFull && lot.isFull) {
      return false
    }
    if (filters.radiusKm && lot.distanceKm > filters.radiusKm) {
      return false
    }
    if (filters.keyword.trim()) {
      const q = filters.keyword.toLowerCase()
      const match =
        lot.name.toLowerCase().includes(q) || lot.address.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
}
