import { useQuery } from '@tanstack/react-query'
import type { OwnerLotPreviewTelemetry } from '@/entities/owner/types'

export const DEFAULT_OWNER_LOTS_TELEMETRY: OwnerLotPreviewTelemetry[] = [
  {
    id: 'owner-lot-cat-lai-04',
    hubCode: 'CAT-LAI-HUB-04',
    name: 'Bãi Container ICD Cát Lái - Gate 4',
    location: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    capacityPercent: 88,
    alprScanTime: '0.18s',
    payOsStatus: 'Tự động 100%',
    currentActiveTrucks: 132,
    totalCapacitySlots: 150,
    estimatedDailyRevenue: 13200000,
    isOnline: true,
  },
  {
    id: 'owner-lot-dinh-vu-01',
    hubCode: 'DINH-VU-HP-01',
    name: 'Trạm Đỗ & Depot Container Đình Vũ',
    location: 'Bán đảo Đình Vũ, Đông Hải 2, Hải An, Hải Phòng',
    capacityPercent: 92,
    alprScanTime: '0.19s',
    payOsStatus: 'Tự động 100%',
    currentActiveTrucks: 165,
    totalCapacitySlots: 180,
    estimatedDailyRevenue: 16800000,
    isOnline: true,
  },
  {
    id: 'owner-lot-song-than-02',
    hubCode: 'SONG-THAN-BD-02',
    name: 'Bãi Xe & Trạm Tiếp Vận Sóng Thần',
    location: 'Đại lộ Độc Lập, KCN Sóng Thần 1, Dĩ An, Bình Dương',
    capacityPercent: 78,
    alprScanTime: '0.21s',
    payOsStatus: 'Tự động 100%',
    currentActiveTrucks: 172,
    totalCapacitySlots: 220,
    estimatedDailyRevenue: 15500000,
    isOnline: true,
  },
]

export interface UseOwnerLotsTelemetryOptions {
  simulateLoading?: boolean
  simulateEmpty?: boolean
  simulateError?: boolean
}

/**
 * Hook truy vấn telemetry giám sát bãi mẫu của chủ bãi (SCR-003).
 * Tuân thủ hợp đồng API: Không phụ thuộc API Backend (Static / Marketing Presentation),
 * Tích hợp TanStack Query v5 + Client-side In-memory Caching theo chuẩn ADR-0001.
 */
export function useOwnerLotsTelemetryQuery(options?: UseOwnerLotsTelemetryOptions) {
  return useQuery({
    queryKey: ['owner-solutions-lots-telemetry', options?.simulateEmpty, options?.simulateError],
    queryFn: async (): Promise<OwnerLotPreviewTelemetry[]> => {
      if (options?.simulateLoading) {
        await new Promise((resolve) => setTimeout(resolve, 800))
      }
      if (options?.simulateError) {
        throw new Error('Mã lỗi ERR_OWNER_LOTS_TELEMETRY: Không thể nạp danh mục giám sát bãi thực địa.')
      }
      if (options?.simulateEmpty) {
        return []
      }
      return DEFAULT_OWNER_LOTS_TELEMETRY
    },
    staleTime: 5 * 60 * 1000, // 5 phút cache
    gcTime: 10 * 60 * 1000,
  })
}

