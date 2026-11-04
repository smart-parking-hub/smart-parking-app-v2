import { apiClient } from '@/shared/api/client'
import type { MerchantDashboardData } from '../types/merchantDashboardTypes'

export const fallbackMerchantDashboardData: MerchantDashboardData = {
  kpis: {
    totalMonthlyRevenueNet: 148500000,
    revenueGrowthPercent: 14.2,
    walletBalance: 42800000,
    platformFeePercent: 5,
    averageOccupancyRate: 82.5,
    occupiedSlots: 165,
    totalSlots: 200,
    breakdown: {
      cont40ftPercent: 92,
      heavyTruckPercent: 78,
      mediumTruckPercent: 65,
    },
    todayCheckinCount: 48,
    todayCheckinBreakdown: '36 Cont (40/45FT) · 12 Xe Tải',
    alprBarrierSpeedSeconds: 0.18,
    pendingWithdrawalAmount: 25000000,
    pendingWithdrawalCount: 1,
  },
  chartData: [
    {
      date: '14/02',
      dayLabel: '14/02',
      mainYardRevenue: 15400000,
      reeferSurcharge: 4200000,
      vehicleVolume: 42,
    },
    {
      date: '15/02',
      dayLabel: '15/02',
      mainYardRevenue: 18200000,
      reeferSurcharge: 5100000,
      vehicleVolume: 51,
    },
    {
      date: '16/02',
      dayLabel: '16/02',
      mainYardRevenue: 12600000,
      reeferSurcharge: 3400000,
      vehicleVolume: 35,
    },
    {
      date: '17/02',
      dayLabel: '17/02',
      mainYardRevenue: 21000000,
      reeferSurcharge: 6200000,
      vehicleVolume: 58,
    },
    {
      date: '18/02',
      dayLabel: '18/02',
      mainYardRevenue: 26400000,
      reeferSurcharge: 7800000,
      vehicleVolume: 72,
      isPeakDay: true,
      peakBadgeText: '26.4M',
    },
    {
      date: '19/02',
      dayLabel: '19/02',
      mainYardRevenue: 19500000,
      reeferSurcharge: 5800000,
      vehicleVolume: 54,
    },
    {
      date: '20/02',
      dayLabel: 'H.Nay',
      mainYardRevenue: 22400000,
      reeferSurcharge: 6800000,
      vehicleVolume: 61,
    },
  ],
  recentCheckins: [
    {
      id: 1,
      licensePlate: '60C-912.44',
      vehicleType: 'Xe Tải 15 Tấn',
      berthSlot: 'Berth B-04',
      yardName: 'ICD Sóng Thần',
      gateIn: 'Gate C2 - Lane 01',
      checkinTimeText: '06:15 (Hết hạn 09:15)',
      depositAmount: 250000,
      statusTag: 'OVERDUE',
      statusLabel: 'QUÁ HẠN +15 PHÚT',
      isWarning: true,
    },
    {
      id: 2,
      licensePlate: '51D-894.12',
      vehicleType: 'Container 40FT Reefer',
      berthSlot: 'Berth C-12',
      yardName: 'Cát Lái Gate 2',
      gateIn: 'Gate 02 - Làn Reefer',
      checkinTimeText: '05:45 (Đỗ 3h 45m)',
      depositAmount: 680000,
      statusTag: 'REEFER_PLUGGED',
      statusLabel: 'CẮM ĐIỆN LẠNH · ĐANG ĐỖ',
    },
    {
      id: 3,
      licensePlate: '72H-019.82',
      vehicleType: 'Đầu Kéo + Rơ-moóc 45FT',
      berthSlot: 'Berth A-08',
      yardName: 'Cát Lái Gate 2',
      gateIn: 'Gate 01 - Barie Auto',
      checkinTimeText: '09:12 (Đỗ 18m)',
      depositAmount: 450000,
      statusTag: 'PARKING_VALID',
      statusLabel: 'ĐANG ĐỖ HỢP LỆ',
    },
    {
      id: 4,
      licensePlate: '29C-553.19',
      vehicleType: 'Xe Tải 8 Tấn Thùng',
      berthSlot: 'Berth T-14',
      yardName: 'ICD Sóng Thần',
      gateIn: 'Gate A - Lane 02',
      checkinTimeText: '08:40 (Đỗ 50m)',
      depositAmount: 180000,
      statusTag: 'UNLOADING',
      statusLabel: 'ĐANG XUỐNG HÀNG',
    },
    {
      id: 5,
      licensePlate: '15C-408.77',
      vehicleType: 'Đầu Kéo Bobtail (Không Moóc)',
      berthSlot: 'Berth B-02',
      yardName: 'Cát Lái Gate 2',
      gateIn: 'Gate 01 - Barie Auto',
      checkinTimeText: '07:55 (Đỗ 1h 35m)',
      depositAmount: 200000,
      statusTag: 'PARKING_VALID',
      statusLabel: 'ĐANG ĐỖ HỢP LỆ',
    },
  ],
  liveYards: [
    {
      id: 1,
      name: 'Cát Lái Gate 2',
      address: 'Đường Lê Phụng Hiểu, TP. Thủ Đức',
      status: 'APPROVED',
      capacityPercent: 90,
      capacityStatusText: '90% SẮP ĐẦY',
      occupiedSlots: 72,
      totalSlots: 80,
      remainingSlotNote: 'Còn 08 Slot Cont 40FT',
      todayRevenueText: 'Doanh thu hôm nay: 18.2M',
    },
    {
      id: 2,
      name: 'ICD Sóng Thần 2',
      address: 'KCN Sóng Thần 2, Dĩ An, Bình Dương',
      status: 'APPROVED',
      capacityPercent: 81,
      capacityStatusText: '81% BÌNH THƯỜNG',
      occupiedSlots: 65,
      totalSlots: 80,
      remainingSlotNote: 'Còn 15 Slot xe tải/cont',
      todayRevenueText: 'Doanh thu hôm nay: 12.8M',
    },
    {
      id: 3,
      name: 'Depot Tân Cảng Phú Hữu',
      address: 'Cảng Phú Hữu, TP. Thủ Đức',
      status: 'PENDING_APPROVAL',
      capacityPercent: 0,
      capacityStatusText: '0/40 SLOT',
      occupiedSlots: 0,
      totalSlots: 40,
      remainingSlotNote: '0/40 Slot hoạt động',
      pendingAuditNote: 'Đang thẩm định hồ sơ PCCC & giấy phép trạm cân',
    },
  ],
  alprFeeds: [
    {
      id: 'cam-01',
      cameraName: 'CAM-01 LÀN VÀO',
      direction: 'IN',
      detectedPlate: 'ALPR: 51D-894.12',
      confidencePercent: 99.4,
      barrierStatus: 'MỞ',
      isLive: true,
    },
    {
      id: 'cam-02',
      cameraName: 'CAM-02 LÀN RA',
      direction: 'OUT',
      detectedPlate: 'ALPR: TRỐNG',
      barrierStatus: 'ĐÓNG',
      isLive: true,
    },
  ],
}

export async function fetchMerchantDashboardData(): Promise<MerchantDashboardData> {
  try {
    const [revRes, bookRes] = await Promise.allSettled([
      apiClient.get('/api/v1/merchant/revenue', { params: { granularity: 'DAY' } }),
      apiClient.get('/api/v1/merchant/bookings', { params: { page: 0, size: 5 } }),
    ])

    const data = { ...fallbackMerchantDashboardData }

    if (revRes.status === 'fulfilled' && revRes.value?.data) {
      const revData = revRes.value.data
      if (revData.totalRevenue != null) {
        data.kpis.totalMonthlyRevenueNet = revData.totalRevenue
      }
      if (revData.walletBalance != null) {
        data.kpis.walletBalance = revData.walletBalance
      }
    }

    if (bookRes.status === 'fulfilled' && bookRes.value?.data?.content) {
      const content = bookRes.value.data.content
      if (Array.isArray(content) && content.length > 0) {
        data.recentCheckins = content.map((item: { id?: number | string; vehicleLicensePlate?: string; vehicleType?: string; slotId?: number | string; parkingLotName?: string; startTime?: string; depositAmount?: number; status?: string }, idx: number) => ({
          id: item.id || idx + 1,
          licensePlate: item.vehicleLicensePlate || '51D-894.12',
          vehicleType: item.vehicleType || 'Xe Container 40FT',
          berthSlot: `Slot #${item.slotId || idx + 1}`,
          yardName: item.parkingLotName || 'Bãi Cát Lái Gate 2',
          gateIn: 'Gate 01 - Barie Auto',
          checkinTimeText: item.startTime ? new Date(item.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '08:00',
          depositAmount: item.depositAmount || 200000,
          statusTag: item.status === 'OVERTIME' ? 'OVERDUE' : 'PARKING_VALID',
          statusLabel: item.status === 'OVERTIME' ? 'QUÁ HẠN' : 'ĐANG ĐỖ HỢP LỆ',
          isWarning: item.status === 'OVERTIME',
        }))
      }
    }

    return data
  } catch {
    return fallbackMerchantDashboardData
  }
}
