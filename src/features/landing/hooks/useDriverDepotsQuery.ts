import { useQuery } from '@tanstack/react-query'
import type { ParkingLotTelemetry } from '@/entities/parking-lot/types'

export const DEFAULT_DEPOT_TELEMETRY: ParkingLotTelemetry = {
  id: 'cat-lai-02',
  name: 'Bãi Depot ICD Cát Lái - Gate 2',
  address: 'Đường Vành Đai 2, Phường Cát Lái, TP. Thủ Đức',
  distanceToPort: 'Cách Cổng Cảng Cát Lái 1.8km',
  availableSpots: 8,
  totalSpots: 45,
  spotType: 'container 40ft',
  pricePerHour: 15000,
  priceBlockHours: 4,
  priceBlockAmount: 50000,
  currency: 'đ',
  alprResponseTime: '0.2s',
  weighStationCapacity: '120T (24/7)',
  operatingHours: '24/7',
  verified: true,
  lastUpdatedMinutesAgo: 3,
  facilities: [
    {
      title: 'Trạm cân 120T',
      subtitle: 'Kiểm định đo lường QCVN',
      amenityId: 'scale',
    },
    {
      title: '12 Trụ Cắm Reefer 380V',
      subtitle: 'Dành riêng container lạnh',
      amenityId: 'reefer',
    },
    {
      title: 'Khu Nhà Tắm Nóng Lạnh',
      subtitle: 'Dọn dẹp liên tục mỗi giờ',
      amenityId: 'shower',
    },
    {
      title: 'Bảo Vệ Vũ Trang 24/7',
      subtitle: 'Kiểm soát vé vào - ra nghiêm ngặt',
      amenityId: 'security',
    },
    {
      title: 'Đội Cứu Hộ Lốp Cơ Động',
      subtitle: 'Vá ép, thay lốp lưu động 24h',
      amenityId: 'rescue',
    },
    {
      title: 'Quán Cơm Bác Tài',
      subtitle: 'Bình dân, sạch sẽ, phục vụ thâu đêm',
      amenityId: 'food',
    },
  ],
}

/**
 * Fetches driver depot telemetry with client-side caching via TanStack Query.
 * Marketing / Static page contract: no direct external backend API call is required.
 */
export function useDriverDepotsQuery(options?: {
  simulateLoading?: boolean
  simulateEmpty?: boolean
  simulateError?: boolean
}) {
  return useQuery({
    queryKey: ['driver-solutions-depots', options?.simulateEmpty, options?.simulateError],
    queryFn: async (): Promise<ParkingLotTelemetry[]> => {
      // Simulate fast cache hit or minimal latency
      if (options?.simulateLoading) {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }
      if (options?.simulateError) {
        throw new Error('Mã lỗi ERR_DEPOT_SYNC: Không thể đồng bộ telemetry bãi đỗ.')
      }
      if (options?.simulateEmpty) {
        return []
      }
      return [DEFAULT_DEPOT_TELEMETRY]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,
  })
}

