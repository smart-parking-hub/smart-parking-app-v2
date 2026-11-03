import { apiClient } from '@/shared/api/client'
import type {
  MerchantLotsMetrics,
  MerchantParkingLotCardData,
  MerchantParkingLotListParams,
  MerchantParkingLotPageResponse,
} from '../types/merchantParkingLotTypes'

export const fallbackMerchantLotsMetrics: MerchantLotsMetrics = {
  totalFacilities: 3,
  activeFacilities: 2,
  underReviewFacilities: 1,
  totalCapacity: 200,
  usedSlots: 165,
  availableSlots: 35,
  occupancyRate: 82.5,
  todayRevenue: 18450000,
  revenueGrowthPercent: 14.2,
  todayGatePasses: 48,
}

export const fallbackMerchantParkingLots: MerchantParkingLotCardData[] = [
  {
    id: 1,
    code: 'VN-SGN-CLG2-09',
    name: 'Bãi Đỗ Xe & Trạm Container Tân Cảng - Cát Lái (Cụm Gate 2)',
    address: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức, TP. Hồ Chí Minh (Cách cổng cảng Cát Lái 1.2 km)',
    status: 'APPROVED',
    gateSystem: 'CỔNG TỰ ĐỘNG ALPR 0.2S',
    ratingAverage: 4.9,
    reviewCount: 284,
    monthlyRevenue: 82500000,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    yardTag: 'Bãi Hỗn Hợp Container & Reefer',
    totalCapacity: 80,
    usedSlots: 72,
    occupancyRate: 90,
    alertStatus: 'NEAR_FULL',
    supportedFleets: [
      'Container 40FT / 45FT Reefer & Khô',
      'Xe tải nặng 3-4 chân (Tải trọng trục > 15T)',
      'Xe tải trung thùng kín & mui bạt (8T - 15T)',
    ],
    amenities: [
      { iconName: 'Zap', label: 'Trạm Sạc Lạnh 380V' },
      { iconName: 'Scale', label: 'Trạm Cân Điện Tử 100T' },
      { iconName: 'Camera', label: 'ALPR Camera 0.2s' },
      { iconName: 'Shield', label: 'Bảo Vệ Tuần Tra 24/7' },
      { iconName: 'Droplets', label: 'Bơm Nước Rửa Xe Áp Lực' },
    ],
    sections: [
      { sectionName: 'KHU A', usedSlots: 28, totalSlots: 30 },
      { sectionName: 'KHU B', usedSlots: 30, totalSlots: 30 },
      { sectionName: 'KHU REEFER C', usedSlots: 14, totalSlots: 20 },
    ],
    systemIntegrationNote: 'ĐÃ ĐỒNG BỘ CẢNG BIỂN TÂN CẢNG',
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    id: 2,
    code: 'VN-BDG-ST2-18',
    name: 'Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2',
    address: 'ĐT743A, KCN Sóng Thần 2, P. Dĩ An, TP. Dĩ An, Tỉnh Bình Dương',
    status: 'APPROVED',
    gateSystem: 'CAMERA AN NINH 360° AI',
    ratingAverage: 4.8,
    reviewCount: 192,
    monthlyRevenue: 54200000,
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    yardTag: 'Depot Tiếp Vận Khô ICD',
    totalCapacity: 80,
    usedSlots: 65,
    occupancyRate: 81.25,
    alertStatus: 'NORMAL',
    supportedFleets: [
      'Container 40FT / 45FT Dry Cargo',
      'Đầu kéo Container không moóc (Bobtail)',
      'Xe tải nặng > 10 tấn trung chuyển kho',
    ],
    amenities: [
      { iconName: 'Layers', label: 'Mặt Bê Tông Chịu Tải 60T' },
      { iconName: 'Video', label: 'Camera AI 360° Giám Sát' },
      { iconName: 'ShowerHead', label: 'Khu Vực Tắm Giặt Tài Xế' },
      { iconName: 'Utensils', label: 'Điểm Cơm Xe Phục Vụ 24/7' },
      { iconName: 'Fuel', label: 'Trạm Dầu Diesel Liền Kề' },
    ],
    sections: [
      { sectionName: 'LÔ D1', usedSlots: 35, totalSlots: 40 },
      { sectionName: 'LÔ D2', usedSlots: 30, totalSlots: 40 },
    ],
    systemIntegrationNote: 'KẾT NỐI HỆ THỐNG WMS SÓNG THẦN',
    createdAt: '2026-01-22T14:15:00Z',
  },
  {
    id: 3,
    code: 'VN-SGN-TPH2-03',
    name: 'Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)',
    address: 'Đường Gò Cát, P. Phú Hữu, TP. Thủ Đức, TP. Hồ Chí Minh',
    status: 'PENDING_APPROVAL',
    gateSystem: 'HỒ SƠ NỘP: 17/02/2026',
    ratingAverage: null,
    reviewCount: 0,
    monthlyRevenue: 0,
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    yardTag: 'Quy Hoạch: 40 Slot Container',
    totalCapacity: 40,
    usedSlots: 0,
    occupancyRate: 0,
    alertStatus: 'UNDER_REVIEW',
    supportedFleets: [
      'Chuyên dụng xe đầu kéo 40FT / 45FT High Cube',
      'Lối quay đầu bán kính lớn cho sơ-mi rơ-moóc',
    ],
    amenities: [
      { iconName: 'FileCheck', label: 'Hồ Sơ Đất Đai Đã Xác Thực' },
      { iconName: 'Flame', label: 'PCCC Nghiệm Thu Bước 1' },
      { iconName: 'Router', label: 'Trạm Cân 120T Đang Lắp Đặt' },
    ],
    submissionDate: '17/02/2026',
    complianceNotice:
      'Hồ sơ đã được tiếp nhận ngày 17/02/2026. Chuyên viên Quản Trị Hệ Thống (Operations Admin) đang thẩm định thực địa giấy phép PCCC kho bãi, hợp đồng thuê đất công nghiệp và toạ độ ranh giới định vị GPS ALPR.',
    verificationMilestones: [
      { step: 1, title: '1. Pháp Lý Doanh Nghiệp', status: 'COMPLETED' },
      { step: 2, title: '2. Giấy Phép PCCC Bãi', status: 'IN_PROGRESS' },
      { step: 3, title: '3. Thử Nghiệm Barie ALPR', status: 'PENDING' },
    ],
    createdAt: '2026-02-17T09:00:00Z',
  },
]

export async function fetchMerchantLotsMetrics(): Promise<MerchantLotsMetrics> {
  try {
    const res = await apiClient.get<{ data: MerchantLotsMetrics }>('/api/v1/merchant/parking-lots/metrics')
    if (res.data?.data) {
      return res.data.data
    }
  } catch {
    // Fallback to offline precision metrics
  }
  return fallbackMerchantLotsMetrics
}

export async function fetchMerchantParkingLots(
  params: MerchantParkingLotListParams = {},
): Promise<MerchantParkingLotPageResponse> {
  try {
    const res = await apiClient.get<{ data: MerchantParkingLotPageResponse }>(
      '/api/v1/merchant/parking-lots',
      { params },
    )
    if (res.data?.data?.content) {
      return res.data.data
    }
  } catch {
    // Use fallback mock data with client filtering
  }

  let filtered = [...fallbackMerchantParkingLots]

  if (params.status && params.status !== 'ALL') {
    filtered = filtered.filter((lot) => lot.status === params.status)
  }

  if (params.keyword && params.keyword.trim()) {
    const q = params.keyword.toLowerCase().trim()
    filtered = filtered.filter(
      (lot) =>
        lot.name.toLowerCase().includes(q) ||
        lot.code.toLowerCase().includes(q) ||
        lot.address.toLowerCase().includes(q),
    )
  }

  if (params.sort) {
    if (params.sort === 'capacity,desc') {
      filtered.sort((a, b) => b.totalCapacity - a.totalCapacity)
    } else if (params.sort === 'rating,desc') {
      filtered.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0))
    } else if (params.sort === 'revenue,desc') {
      filtered.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    } else if (params.sort === 'name,asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    } else if (params.sort === 'name,desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name, 'vi'))
    } else {
      // default: createdAt,desc
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  const page = params.page || 0
  const size = params.size || 10
  const startIndex = page * size
  const paginated = filtered.slice(startIndex, startIndex + size)

  return {
    content: paginated,
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(filtered.length / size)),
    totalElements: filtered.length,
  }
}
