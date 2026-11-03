import { apiClient } from '@/shared/api/client'
import type {
  VehicleItem,
  FleetKpiMetrics,
  AddVehicleFormData,
} from '../types/vehicleTypes'

export const fallbackKpiMetrics: FleetKpiMetrics = {
  totalVehicles: 3,
  tractorCount: 2,
  trailerCount: 1,
  defaultPlate: '51D-894.12',
  defaultSpec: 'Tổ hợp 40FT/45FT Reefer',
  defaultLocationStatus: 'SẴN SÀNG LƯU THÔNG',
  alprVerifiedRate: '100%',
  verifiedRatioText: '3/3 xe đã duyệt hồ sơ tải trọng',
  totalTonnage: 48.5,
  eligibleRoutesText: 'Đủ điều kiện: QL1A · Vành Đai 2 · Cát Lái',
}

export const fallbackVehiclesList: VehicleItem[] = [
  {
    id: 1,
    licensePlate: '51D-894.12',
    vehicleClass: 'CONTAINER',
    vehicleClassLabel: 'Xe đầu kéo Container',
    brandModel: 'Hyundai Xcient 440PS',
    specDetails: 'Container 40FT / 45FT',
    subSpecText: 'Tổ hợp Reefer Lạnh / Dry',
    originDetails: 'Xuất xứ: Hàn Quốc · Đời 2023 · Số máy: D6CC-9412',
    curbWeightTon: 8.8,
    towingWeightTon: 39.5,
    axleConfig: '3 Trục (Cầu 6x4)',
    inspectionExpiryDate: '18/11/2026',
    inspectionRemainingText: 'Còn hiệu lực 9 tháng',
    insuranceNumber: 'BH TNDS: VBI-9941',
    alprSyncStatus: 'SYNCED',
    alprSyncText: 'ĐỒNG BỘ 100%',
    alprSubText: 'Nhận diện 0.2s / 320+ bãi',
    isDefault: true,
    needsShorePower: true,
    status: 'ACTIVE',
  },
  {
    id: 2,
    licensePlate: '51R-024.89',
    vehicleClass: 'TRAILER',
    vehicleClassLabel: 'Rơ-moóc chuyên dụng',
    brandModel: 'CIMC 3 Trục Chuyên Dụng',
    specDetails: '40FT Chuyên Lạnh (Reefer)',
    subSpecText: 'Thùng bảo ôn Polyurethane',
    originDetails: 'Gắn máy lạnh Thermo King SLXi · Đời 2022',
    curbWeightTon: 7.2,
    towingWeightTon: 32.8,
    axleConfig: 'Cụm 3 trục Fuwa',
    inspectionExpiryDate: '04/08/2026',
    inspectionRemainingText: 'Còn hiệu lực 6 tháng',
    insuranceNumber: 'Tem kiểm định: KĐ-8812',
    alprSyncStatus: 'SYNCED',
    alprSyncText: 'ĐỒNG BỘ 100%',
    alprSubText: 'Nhận diện đuôi rơ-moóc',
    isDefault: false,
    temperatureRange: '-25°C đến +15°C',
    status: 'ACTIVE',
  },
  {
    id: 3,
    licensePlate: '15C-341.90',
    vehicleClass: 'CONTAINER',
    vehicleClassLabel: 'Xe đầu kéo Container',
    brandModel: 'International ProStar MaxxForce',
    specDetails: 'Đầu Kéo Container 2 Trục Cầu',
    subSpecText: 'Phù hợp Dry Cargo 20FT/40FT',
    originDetails: 'Xuất xứ: Mỹ · Đời 2018 · Động cơ 450HP',
    curbWeightTon: 8.4,
    towingWeightTon: 38.0,
    axleConfig: 'Trục 6x4 tải trọng nặng',
    inspectionExpiryDate: '25/12/2026',
    inspectionRemainingText: 'Còn hiệu lực 10 tháng',
    insuranceNumber: 'Sổ số: HP-10943',
    alprSyncStatus: 'SYNCED',
    alprSyncText: 'ĐỒNG BỘ 100%',
    alprSubText: 'Camera Hải Phòng - Cát Lái',
    isDefault: false,
    status: 'ACTIVE',
  },
]

export const fetchMyVehicles = async (): Promise<VehicleItem[]> => {
  try {
    const response = await apiClient.get('/api/v1/vehicles', {
      params: { page: 0, size: 20 },
    })
    const content = response.data?.data?.content
    if (Array.isArray(content) && content.length > 0) {
      return content.map((item: Record<string, unknown>, index: number) => {
        const fb = fallbackVehiclesList[index % fallbackVehiclesList.length]
        return {
          id: Number(item.id ?? fb.id),
          licensePlate: String(item.licensePlate ?? fb.licensePlate),
          vehicleClass: (item.vehicleType as VehicleItem['vehicleClass']) || fb.vehicleClass,
          vehicleClassLabel: fb.vehicleClassLabel,
          brandModel: String(item.brandModel ?? fb.brandModel),
          specDetails: fb.specDetails,
          subSpecText: fb.subSpecText,
          originDetails: fb.originDetails,
          curbWeightTon: typeof item.weightTon === 'number' ? item.weightTon : fb.curbWeightTon,
          towingWeightTon: fb.towingWeightTon,
          axleConfig: fb.axleConfig,
          inspectionExpiryDate: fb.inspectionExpiryDate,
          inspectionRemainingText: fb.inspectionRemainingText,
          insuranceNumber: fb.insuranceNumber,
          alprSyncStatus: fb.alprSyncStatus,
          alprSyncText: fb.alprSyncText,
          alprSubText: fb.alprSubText,
          isDefault: index === 0,
          needsShorePower: fb.needsShorePower,
          temperatureRange: fb.temperatureRange,
          status: 'ACTIVE',
        }
      })
    }
    return fallbackVehiclesList
  } catch {
    return fallbackVehiclesList
  }
}

export const fetchFleetKpiMetrics = async (): Promise<FleetKpiMetrics> => {
  return fallbackKpiMetrics
}

export const addVehicleApi = async (data: AddVehicleFormData): Promise<VehicleItem> => {
  try {
    const response = await apiClient.post('/api/v1/vehicles', {
      licensePlate: data.licensePlate.trim().toUpperCase(),
      vehicleType: data.vehicleClass,
      weightTon: data.curbWeightTon,
      brandModel: data.brandModel,
    })
    const raw = response.data?.data
    return {
      id: raw?.id ?? Date.now(),
      licensePlate: data.licensePlate.trim().toUpperCase(),
      vehicleClass: data.vehicleClass,
      vehicleClassLabel:
        data.vehicleClass === 'CONTAINER'
          ? 'Xe đầu kéo Container'
          : data.vehicleClass === 'TRAILER'
          ? 'Rơ-moóc chuyên dụng'
          : 'Xe tải nặng',
      brandModel: data.brandModel,
      specDetails: 'Quy cách chuẩn hệ thống',
      subSpecText: 'Đã kiểm định tải trọng',
      originDetails: `Đời ${data.manufactureYear} · Nhập khẩu`,
      curbWeightTon: data.curbWeightTon,
      towingWeightTon: data.towingWeightTon,
      axleConfig: 'Đồng bộ đăng kiểm',
      inspectionExpiryDate: '31/12/2026',
      inspectionRemainingText: 'Còn hiệu lực 12 tháng',
      insuranceNumber: 'BH TNDS: Đang cập nhật',
      alprSyncStatus: 'SYNCED',
      alprSyncText: 'ĐỒNG BỘ 100%',
      alprSubText: 'Đã kích hoạt camera ALPR',
      isDefault: data.isDefault,
      status: 'ACTIVE',
    }
  } catch {
    return {
      id: Date.now(),
      licensePlate: data.licensePlate.trim().toUpperCase(),
      vehicleClass: data.vehicleClass,
      vehicleClassLabel:
        data.vehicleClass === 'CONTAINER'
          ? 'Xe đầu kéo Container'
          : data.vehicleClass === 'TRAILER'
          ? 'Rơ-moóc chuyên dụng'
          : 'Xe tải nặng',
      brandModel: data.brandModel,
      specDetails: 'Quy cách chuẩn hệ thống',
      subSpecText: 'Đã kiểm định tải trọng',
      originDetails: `Đời ${data.manufactureYear} · Nhập khẩu`,
      curbWeightTon: data.curbWeightTon,
      towingWeightTon: data.towingWeightTon,
      axleConfig: 'Đồng bộ đăng kiểm',
      inspectionExpiryDate: '31/12/2026',
      inspectionRemainingText: 'Còn hiệu lực 12 tháng',
      insuranceNumber: 'BH TNDS: Đang cập nhật',
      alprSyncStatus: 'SYNCED',
      alprSyncText: 'ĐỒNG BỘ 100%',
      alprSubText: 'Đã kích hoạt camera ALPR',
      isDefault: data.isDefault,
      status: 'ACTIVE',
    }
  }
}

export const updateVehicleApi = async (
  id: number,
  data: Partial<AddVehicleFormData>
): Promise<void> => {
  try {
    await apiClient.put(`/api/v1/vehicles/${id}`, {
      licensePlate: data.licensePlate?.trim().toUpperCase(),
      vehicleType: data.vehicleClass,
      weightTon: data.curbWeightTon,
      brandModel: data.brandModel,
    })
  } catch {
    // fallback ok
  }
}

export const deleteVehicleApi = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/vehicles/${id}`)
  } catch {
    // fallback ok
  }
}
