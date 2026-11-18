import { apiClient } from '@/shared/api/client'
import type {
  ParkingLotItem,
  SearchFilterState,
  VehicleClassification,
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

type SearchLotDto = Partial<ParkingLotItem> & {
  id: number
  name: string
  address: string
  availableCapacity?: number
  basePricePerHour?: number
  averageRating?: number
}

function mapSearchLotDto(item: SearchLotDto): ParkingLotItem {
  const availableSlots = item.availableCapacity ?? item.availableSlots ?? 0
  return {
    id: item.id,
    name: item.name,
    address: item.address,
    distanceKm: item.distanceKm ?? 0,
    etaMinutes: item.etaMinutes ?? 0,
    availableSlots,
    totalSlots: item.totalSlots ?? 0,
    slotTypeLabel: item.slotTypeLabel ?? `Còn ${availableSlots} chỗ`,
    hourlyRate: item.basePricePerHour ?? item.hourlyRate ?? 0,
    depositAmount: item.depositAmount ?? 0,
    isBestMatch: item.isBestMatch,
    maxVehicleLength: item.maxVehicleLength,
    isFull: availableSlots === 0,
    queueActive: item.queueActive,
    queueWaitingCount: item.queueWaitingCount,
    queueEtaMinutes: item.queueEtaMinutes,
    amenities: item.amenities ?? [],
    latitude: item.latitude != null ? Number(item.latitude) : NaN,
    longitude: item.longitude != null ? Number(item.longitude) : NaN,
    ratingAverage: item.averageRating ?? item.ratingAverage ?? 0,
  }
}

export function normalizeParkingSearchText(text: string): string {
  return text
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchesParkingLotKeyword(
  lot: Pick<ParkingLotItem, 'name' | 'address'>,
  keyword: string,
): boolean {
  const normalizedQuery = normalizeParkingSearchText(keyword)
  if (!normalizedQuery) return true

  const haystack = normalizeParkingSearchText(`${lot.name} ${lot.address}`)
  const tokens = normalizedQuery.split(' ').filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

export function rankParkingLotSuggestions(
  lots: ParkingLotItem[],
  keyword: string,
  limit = 8,
): ParkingLotItem[] {
  const normalizedQuery = normalizeParkingSearchText(keyword)
  if (!normalizedQuery) return []

  return lots
    .filter((lot) => matchesParkingLotKeyword(lot, normalizedQuery))
    .sort((a, b) => {
      const aName = normalizeParkingSearchText(a.name)
      const bName = normalizeParkingSearchText(b.name)
      const aStarts = aName.startsWith(normalizedQuery) ? 0 : 1
      const bStarts = bName.startsWith(normalizedQuery) ? 0 : 1
      if (aStarts !== bStarts) return aStarts - bStarts

      const aInName = aName.includes(normalizedQuery) ? 0 : 1
      const bInName = bName.includes(normalizedQuery) ? 0 : 1
      if (aInName !== bInName) return aInName - bInName

      if (a.isFull !== b.isFull) return a.isFull ? 1 : -1
      return b.availableSlots - a.availableSlots
    })
    .slice(0, limit)
}

/**
 * Fetches live APPROVED (active) parking lots directly from backend database
 * for real-time parking lot autocomplete without geo-radius clipping or mock data.
 */
export async function fetchActiveParkingLotsForSearch(params: {
  vehicleType?: VehicleClassification
  includeFull?: boolean
  signal?: AbortSignal
}): Promise<ParkingLotItem[]> {
  const response = await apiClient.get<{
    data?: { content: SearchLotDto[] }
    content?: SearchLotDto[]
  }>('/api/v1/parking-lots/search', {
    signal: params.signal,
    params: {
      vehicleType: params.vehicleType,
      includeFull: params.includeFull ?? true,
      size: 100,
      sort: 'id,asc',
    },
  })
  const rawData = response.data.data?.content ?? response.data.content ?? []
  return rawData.map(mapSearchLotDto)
}

export async function fetchParkingLots(
  filters: SearchFilterState,
): Promise<ParkingLotItem[]> {
  const response = await apiClient.get<{
    data?: { content: SearchLotDto[] }
    content?: SearchLotDto[]
  }>('/api/v1/parking-lots/search', {
    params: {
      vehicleType: filters.vehicleType,
      radiusKm: filters.radiusKm,
      latitude: filters.latitude,
      longitude: filters.longitude,
      includeFull: filters.includeFull,
      size: 100,
      sort: filters.sortBy === 'rating' ? 'ratingAverage,desc' : 'id,asc',
    },
  })
  const rawData = response.data.data?.content ?? response.data.content ?? []
  const mapped = rawData.map(mapSearchLotDto)
  return mapped
    .filter((lot) => filters.includeFull || !lot.isFull)
    .sort((a, b) =>
      filters.sortBy === 'price'
        ? a.hourlyRate - b.hourlyRate
        : filters.sortBy === 'rating'
          ? b.ratingAverage - a.ratingAverage
          : a.distanceKm - b.distanceKm,
    )
}
