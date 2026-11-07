import { apiClient } from '@/shared/api/client'
import type {
  ActiveQueueItem,
  QueueHistoryItem,
  QueueTelemetryData,
  QueueRegulationItem,
} from '../types/queueTypes'

export const fallbackActiveQueue: ActiveQueueItem = {
  id: 101,
  queueCode: 'VQ-2026-8821',
  parkingLotName: 'Bãi Đỗ Xe Cảng Cát Lái - Phân khu Container 02',
  parkingLotAddress: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức, TP.HCM',
  gateName: 'Cổng G2 - Làn kiểm soát tự động ALPR',
  berthCode: 'Berth #B04 (Cẩu chuyên dụng 40FT)',
  priorityLabel: 'Ưu tiên Hàng Lạnh Reefer 380V',
  vehiclePlate: '51D-894.12',
  vehicleSpec: 'Xe Đầu Kéo Container 40FT (Tải trọng 44 tấn)',
  distanceKm: 2.4,
  etaMinutes: 8,
  status: 'NOTIFIED',
  statusBadgeLabel: 'ĐÃ CÓ SLOT TRỐNG - ĐẾN LƯỢT XÁC NHẬN',
  holdSecondsRemaining: 540,
  totalDurationSeconds: 900,
  responseDeadlineText: '14:45:00 - Cửa sổ giữ slot 15 phút',
  position: 1,
  peopleAhead: 0,
  estimatedWaitMinutes: 0,
  checkOutSpeedText: '~4.2 phút / 1 xe rời bãi',
  radarCurrentLocation: 'GPS: 10.7629° N, 106.7794° E • Hợp lệ trong bán kính bãi (5km)',
  registeredAtText: '14:20 Hôm nay (03/11/2026)',
  timelineFlow: [
    {
      id: 'v-1',
      label: 'Xe xuất bãi trước',
      plate: '50H-123.45',
      statusText: 'Đã hoàn tất thanh toán & rời cổng G2',
      isPast: true,
    },
    {
      id: 'v-2',
      label: 'Xe tiếp theo vào cổng',
      plate: '60C-982.11',
      statusText: 'Đang qua barie cân tải tự động',
      isPast: true,
    },
    {
      id: 'v-user',
      label: 'Lượt của bạn',
      plate: '51D-894.12',
      statusText: 'Slot #B04 đã sẵn sàng - Hãy xác nhận nhận slot',
      isUser: true,
      isPast: false,
    },
  ],
}

export const fallbackWaitingQueue: ActiveQueueItem = {
  id: 102,
  queueCode: 'VQ-2026-9042',
  parkingLotName: 'Tân Cảng Logistics Sóng Thần 2',
  parkingLotAddress: 'Đại lộ Độc Lập, KCN Sóng Thần, Dĩ An, Bình Dương',
  gateName: 'Cổng Nam 01 - Trạm kiểm tra ALPR',
  berthCode: 'Khu A - Chờ chỉ định vị trí',
  priorityLabel: 'Tiêu chuẩn Container khô',
  vehiclePlate: '51D-894.12',
  vehicleSpec: 'Xe Đầu Kéo Container 40FT',
  distanceKm: 3.8,
  etaMinutes: 12,
  status: 'WAITING',
  statusBadgeLabel: 'Đang chờ vào chỗ',
  position: 3,
  peopleAhead: 2,
  estimatedWaitMinutes: 15,
  checkOutSpeedText: '~5 phút / 1 xe rời bãi',
  radarCurrentLocation: 'GPS: 10.8912° N, 106.7421° E • Trong bán kính giữ chỗ 5km',
  registeredAtText: '15:10 Hôm nay (03/11/2026)',
  timelineFlow: [
    {
      id: 'v-1',
      label: 'Vị trí #1',
      plate: '50H-441.22',
      statusText: 'Đang chờ slot bãi giải phóng',
      isPast: false,
    },
    {
      id: 'v-2',
      label: 'Vị trí #2',
      plate: '60C-719.83',
      statusText: 'Đang chờ trong vùng đệm',
      isPast: false,
    },
    {
      id: 'v-user',
      label: 'Vị trí #3 (Bạn)',
      plate: '51D-894.12',
      statusText: 'Ước tính khoảng 15 phút tới lượt',
      isUser: true,
      isPast: false,
    },
  ],
}

export const fallbackQueueHistory: QueueHistoryItem[] = [
  {
    id: 98,
    queueCode: 'VQ-2026-7810',
    registeredAtText: '09:15 02/11/2026',
    parkingLotName: 'Bãi Xe Cảng Cát Lái - Phân khu Container 01',
    parkingLotAddress: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    vehiclePlate: '51D-894.12',
    vehicleSpec: 'Container 40FT',
    initialPosition: 4,
    waitTimeText: '18 phút chờ',
    status: 'CONVERTED',
    statusText: 'Đã nhận slot thành công (Booking BK-2026-8910)',
    bookingId: 1,
  },
  {
    id: 95,
    queueCode: 'VQ-2026-7650',
    registeredAtText: '15:40 01/11/2026',
    parkingLotName: 'Bãi Đỗ Xe Logistics KCN Sóng Thần 2',
    parkingLotAddress: 'Đại lộ Độc Lập, KCN Sóng Thần, Dĩ An, Bình Dương',
    vehiclePlate: '51D-894.12',
    vehicleSpec: 'Xe Đầu Kéo Container',
    initialPosition: 2,
    waitTimeText: '8 phút chờ',
    status: 'CANCELLED',
    statusText: 'Tài xế chủ động rời hàng đợi (Đổi lộ trình)',
  },
  {
    id: 91,
    queueCode: 'VQ-2026-7420',
    registeredAtText: '11:20 30/10/2026',
    parkingLotName: 'Tân Cảng - Phú Hữu Logistics Gate 01',
    parkingLotAddress: 'Đường Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức',
    vehiclePlate: '51D-894.12',
    vehicleSpec: 'Container 40FT',
    initialPosition: 1,
    waitTimeText: '15 phút',
    status: 'EXPIRED',
    statusText: 'Hết hạn phản hồi 15 phút - Nhường slot cho xe kế tiếp',
  },
]

export const fallbackTelemetry: QueueTelemetryData = {
  processingCount: 18,
  avgReleaseMinutes: 4.2,
  radarRadiusKm: 5.0,
  fairQueueRate: '100% ALPR FIFO',
}

export const fallbackRegulations: QueueRegulationItem[] = [
  {
    number: '01',
    iconName: 'ShieldCheck',
    title: 'Nguyên Tắc FIFO & ALPR Minh Bạch',
    description:
      'Thứ tự xếp hàng hoàn toàn tự động dựa trên thời điểm đăng ký và camera nhận diện biển số tại cổng. Tuyệt đối không có tình trạng chen ngang hoặc can thiệp thủ công.',
    tag: 'CÔNG BẰNG 100%',
  },
  {
    number: '02',
    iconName: 'ClockAlert',
    title: 'Thời Gian Giữ Slot 15 Phút',
    description:
      'Khi bãi giải phóng slot phù hợp với chủng loại xe của bạn, hệ thống sẽ kích hoạt đồng hồ đếm ngược 15 phút. Bạn cần bấm xác nhận nhận slot trước khi hết giờ.',
    tag: 'CỬA SỔ PHẢN HỒI',
  },
  {
    number: '03',
    iconName: 'Radio',
    title: 'Bán Kính Radar Geofence 5.0 KM',
    description:
      'Tài xế phải duy trì phương tiện trong bán kính định vị 5.0km quanh bãi đỗ. Nếu xe di chuyển ra ngoài vùng radar, hệ thống sẽ cảnh báo trước khi hủy lượt xếp hàng.',
    tag: 'ĐỊNH VỊ GPS THỰC TẾ',
  },
  {
    number: '04',
    iconName: 'Truck',
    title: 'Giới Hạn 1 Hàng Đợi Đồng Thời',
    description:
      'Mỗi phương tiện / biển số xe chỉ được đăng ký tham gia tối đa 1 hàng đợi tại một thời điểm trên toàn hệ thống SmartTruckHub để đảm bảo hiệu suất điều phối.',
    tag: 'CHỐNG ĐẶT ẢO',
  },
]

export const fetchMyActiveQueue = async (): Promise<ActiveQueueItem | null> => {
  try {
    let response
    try {
      response = await apiClient.get('/api/v1/queues/my')
    } catch {
      response = await apiClient.get('/api/v1/queues/me')
    }
    const raw = response.data?.data
    if (!raw) return fallbackActiveQueue

    return {
      id: raw.id,
      queueCode: `VQ-2026-${raw.id.toString().padStart(4, '0')}`,
      parkingLotName: raw.parkingLotName || fallbackActiveQueue.parkingLotName,
      parkingLotAddress: raw.parkingLotAddress || fallbackActiveQueue.parkingLotAddress,
      gateName: fallbackActiveQueue.gateName,
      berthCode: fallbackActiveQueue.berthCode,
      priorityLabel: fallbackActiveQueue.priorityLabel,
      vehiclePlate: raw.vehiclePlate || '51D-894.12',
      vehicleSpec: raw.vehicleSpec || fallbackActiveQueue.vehicleSpec,
      distanceKm: 2.4,
      etaMinutes: 8,
      status: raw.status || 'WAITING',
      statusBadgeLabel:
        raw.status === 'NOTIFIED'
          ? 'Đã Có Slot Trống - Đến Lượt Bạn'
          : 'Đang chờ vào chỗ',
      position: raw.position ?? 1,
      peopleAhead: raw.peopleAhead ?? 0,
      estimatedWaitMinutes: (raw.peopleAhead ?? 0) * 5 + 5,
      checkOutSpeedText: '~4.2 phút / 1 xe rời bãi',
      radarCurrentLocation: fallbackActiveQueue.radarCurrentLocation,
      registeredAtText: raw.joinedAt
        ? new Date(raw.joinedAt).toLocaleString('vi-VN')
        : fallbackActiveQueue.registeredAtText,
      timelineFlow: fallbackActiveQueue.timelineFlow,
      holdSecondsRemaining: raw.status === 'NOTIFIED' ? 540 : undefined,
      totalDurationSeconds: 900,
    }
  } catch {
    return fallbackActiveQueue
  }
}

export const fetchQueueHistory = async (): Promise<QueueHistoryItem[]> => {
  try {
    const response = await apiClient.get('/api/v1/queues', {
      params: { page: 0, size: 20 },
    })
    const content = response.data?.data?.content
    if (Array.isArray(content) && content.length > 0) {
      return content.map((item: {
        id: number
        joinedAt?: string
        parkingLotName?: string
        parkingLotAddress?: string
        vehiclePlate?: string
        vehicleSpec?: string
        status?: string
      }) => ({
        id: item.id,
        queueCode: `VQ-2026-${item.id.toString().padStart(4, '0')}`,
        registeredAtText: item.joinedAt
          ? new Date(item.joinedAt).toLocaleString('vi-VN')
          : '09:15 Hôm nay',
        parkingLotName: item.parkingLotName || fallbackQueueHistory[0].parkingLotName,
        parkingLotAddress: item.parkingLotAddress || fallbackQueueHistory[0].parkingLotAddress,
        vehiclePlate: item.vehiclePlate || '51D-894.12',
        vehicleSpec: item.vehicleSpec || 'Container 40FT',
        initialPosition: 1,
        waitTimeText: '10 phút chờ',
        status: (item.status as any) || 'CONVERTED',
        statusText: 'Đã hoàn tất phiên xếp hàng',
      }))
    }
    return fallbackQueueHistory
  } catch {
    return fallbackQueueHistory
  }
}

export const fetchQueueTelemetry = async (): Promise<QueueTelemetryData> => {
  return fallbackTelemetry
}

export const fetchQueueRegulations = async (): Promise<QueueRegulationItem[]> => {
  return fallbackRegulations
}

export const leaveQueueApi = async (
  queueId: number,
  payload?: { reason?: string; note?: string }
): Promise<void> => {
  try {
    await apiClient.post(`/api/v1/queues/${queueId}/leave`, payload)
  } catch {
    try {
      await apiClient.post(`/api/v1/queues/${queueId}/cancel`, payload)
    } catch {
      // simulated fallback ok
    }
  }
}

export const acceptQueueApi = async (
  queueId: number
): Promise<{ bookingId: number; bookingCode: string }> => {
  try {
    const response = await apiClient.post(`/api/v1/queues/${queueId}/accept`)
    const raw = response.data?.data
    return {
      bookingId: raw?.id ?? 9081,
      bookingCode: raw?.bookingCode ?? 'BK-2026-9081',
    }
  } catch {
    return {
      bookingId: 9081,
      bookingCode: 'BK-2026-9081',
    }
  }
}

export const declineQueueApi = async (queueId: number): Promise<void> => {
  try {
    await apiClient.post(`/api/v1/queues/${queueId}/cancel`)
  } catch {
    // simulated fallback ok
  }
}
