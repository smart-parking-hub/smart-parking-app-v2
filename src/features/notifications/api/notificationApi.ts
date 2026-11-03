import axios from 'axios'
import type {
  NotificationItemDto,
  DriverNotificationStats,
  DriverNotificationChannelsConfig,
} from '../types/notificationTypes'

const API_BASE = '/api/v1/notifications'

export const fallbackChannelsConfig: DriverNotificationChannelsConfig = {
  webPushSound: true,
  smsEmergency: true,
  zaloOaDispatch: false,
}

export const fallbackDriverStats: DriverNotificationStats = {
  totalCount: 24,
  unreadCount: 3,
  urgentCount: 2,
  barieCheckinsToday: 2,
  queueSavedMinutes: 42,
  onTimeRatePercent: 100,
}

export const fallbackNotificationsList: NotificationItemDto[] = [
  {
    id: 1,
    type: 'QUEUE',
    category: 'queue',
    isUrgent: true,
    readAt: null,
    priorityBadgeText: 'ƯU TIÊN CAO NHẤT · HÀNG ĐỢI',
    timeLabel: 'Vừa xong (15:48:12)',
    createdAt: '2026-11-04T15:48:12Z',
    title: '⚡ ĐÃ CÓ CHỖ TRỐNG — ĐẾN LƯỢT BẠN NHẬN SLOT TẠI CÁT LÁI GATE 2!',
    content:
      'Depot Container Cát Lái vừa có 01 xe xuất bãi. Bạn đang đứng đầu hàng đợi. Vui lòng bấm Nhận slot trước 16:30 (còn 11 phút 37 giây) để mở khóa giữ chỗ 10 phút.',
    expiresInSeconds: 697,
    expiresInText: '11:37',
    actionLabel: 'NHẬN SLOT NGAY',
    actionPath: '/queues',
    actionIcon: 'arrow_forward',
    secondaryActionLabel: 'Xem hàng đợi',
    secondaryActionPath: '/queues',
  },
  {
    id: 2,
    type: 'BOOKING',
    category: 'gate',
    isUrgent: false,
    readAt: null,
    priorityBadgeText: 'ALPR GATE CHECK-IN',
    timeLabel: '14:15 Hôm nay',
    createdAt: '2026-11-04T14:15:00Z',
    title: 'BARIE VÀO BÃI ĐÃ MỞ — CHECK-IN THÀNH CÔNG TẠI SÓNG THẦN 2',
    content:
      'Camera ALPR đã nhận diện tổ hợp xe 51D-894.12 / 51R-024.89 lúc 14:15:10. Vị trí đỗ chỉ định: Berth C-12. Đồng hồ tính giờ đỗ đã kích hoạt.',
    actionLabel: 'Mở vé QR Check-out',
    actionPath: '/bookings',
    actionIcon: 'qr_code_2',
    secondaryActionLabel: 'Chỉ đường vị trí đỗ',
    secondaryActionPath: '/parking',
    secondaryActionIcon: 'navigation',
  },
  {
    id: 3,
    type: 'PAYMENT',
    category: 'payment',
    isUrgent: false,
    readAt: null,
    priorityBadgeText: 'HÓA ĐƠN & TÀI CHÍNH',
    timeLabel: '10:30 Hôm nay',
    createdAt: '2026-11-04T10:30:00Z',
    title: 'ĐÃ ĐỒNG BỘ HÓA ĐƠN ĐIỆN TỬ VAT #TXN-2026-9040 VỀ TỔNG CỤC THUẾ',
    content:
      'Hóa đơn điện tử số VN-SGN-HD78-89412 trị giá 360.000 ₫ đã được ký số và gửi tự động về hòm thư ketoan@vtuanlogistics.vn.',
    actionLabel: 'Tải file PDF HĐĐT',
    actionPath: '#download-vat',
    actionIcon: 'download',
    secondaryActionLabel: 'Xem sổ cái cước',
    secondaryActionPath: '/payments',
  },
  {
    id: 4,
    type: 'SYSTEM',
    category: 'route',
    isUrgent: true,
    readAt: '2026-11-04T09:15:00Z',
    priorityBadgeText: 'CẢNH BÁO TUYẾN ĐƯỜNG',
    timeLabel: '09:15 Hôm nay',
    createdAt: '2026-11-04T09:15:00Z',
    title: 'CẢNH BÁO TĨNH KHÔNG: ĐOẠN ĐỖ XUÂN HỢP MẬT ĐỘ LƯU LƯỢNG 85%',
    content:
      'Cầu Bà Cua hướng vào Cát Lái đang ùn ứ xe container cục bộ. Hệ thống khuyến nghị tài xế chuyển hướng qua trục Nguyễn Thị Định cổng Gate 2 để tránh nghẽn.',
    metaInfo: 'TẢI TRỌNG TỐI ĐA: 48 TẤN · TĨNH KHÔNG 4.5M',
    statusBadgeText: 'Đã tiếp nhận',
  },
  {
    id: 5,
    type: 'PAYMENT',
    category: 'payment',
    isUrgent: false,
    readAt: '2026-11-03T17:00:00Z',
    priorityBadgeText: 'HOÀN CỌC TỰ ĐỘNG',
    timeLabel: 'Hôm qua (17/02)',
    createdAt: '2026-11-03T17:00:00Z',
    title: 'HOÀN CỌC THÀNH CÔNG 100.000 ₫ VỀ TÀI KHOẢN GỐC',
    content:
      'Tiền cọc giữ chỗ cho đơn BK-CATLAI-88412 đã được hoàn 100% về tài khoản VietQR do bạn đã check-in đúng hẹn tại trạm cân tự động.',
    metaInfo: 'PAYOS ID: #REF-992140',
    statusBadgeText: 'Hoàn tất',
  },
  {
    id: 6,
    type: 'BOOKING',
    category: 'gate',
    isUrgent: false,
    readAt: '2026-11-03T14:00:00Z',
    priorityBadgeText: 'XÁC NHẬN GIỮ CHỖ',
    timeLabel: '14:00 Hôm qua',
    createdAt: '2026-11-03T14:00:00Z',
    title: 'ĐÃ GIỮ CHỖ THÀNH CÔNG SLOT BERTH C-114 TẠI CÁT LÁI',
    content:
      'Đặt chỗ mã BK-2026-9104 cho xe 51D-894.12 đã được xác nhận. Vui lòng check-in trước 18:00.',
    actionLabel: 'Xem chi tiết vé',
    actionPath: '/bookings',
    actionIcon: 'qr_code_2',
    metaInfo: 'BERTH C-114 · CÁT LÁI GATE 2',
    statusBadgeText: 'Hoàn tất',
  },
  {
    id: 7,
    type: 'QUEUE',
    category: 'queue',
    isUrgent: false,
    readAt: '2026-11-03T11:20:00Z',
    priorityBadgeText: 'HÀNG ĐỢI ẢO',
    timeLabel: '11:20 Hôm qua',
    createdAt: '2026-11-03T11:20:00Z',
    title: 'BẠN ĐÃ THAM GIA HÀNG ĐỢI ẢO TÂN CẢNG THÀNH CÔNG',
    content:
      'Vị trí hiện tại của bạn: #03. Thời gian ước tính có slot: khoảng 35 phút.',
    actionLabel: 'Xem hàng đợi',
    actionPath: '/queues',
    actionIcon: 'arrow_forward',
    metaInfo: 'VỊ TRÍ #03 · HÀNG ĐỢI ẢO',
    statusBadgeText: 'Đã tiếp nhận',
  },
  {
    id: 8,
    type: 'PAYMENT',
    category: 'payment',
    isUrgent: false,
    readAt: '2026-11-02T16:45:00Z',
    priorityBadgeText: 'VIETQR PAYOS',
    timeLabel: '16:45 02/11/2026',
    createdAt: '2026-11-02T16:45:00Z',
    title: 'THANH TOÁN TIỀN CỌC 100.000 ₫ THÀNH CÔNG',
    content:
      'Giao dịch mã PAYOS-TXN-8812 đã được ghi nhận qua cổng Napas247.',
    actionLabel: 'Xem biên lai',
    actionPath: '/payments',
    actionIcon: 'download',
    metaInfo: 'MÃ GD: PAYOS-TXN-8812',
    statusBadgeText: 'Hoàn tất',
  },
  {
    id: 9,
    type: 'SYSTEM',
    category: 'route',
    isUrgent: false,
    readAt: '2026-11-02T08:00:00Z',
    priorityBadgeText: 'THÔNG BÁO VẬN HÀNH',
    timeLabel: '08:00 02/11/2026',
    createdAt: '2026-11-02T08:00:00Z',
    title: 'BẢO TRÌ NÂNG CẤP TRẠM CÂN ALPR CỔNG SÓNG THẦN',
    content:
      'Hệ thống trạm cân số 2 tại Sóng Thần sẽ tạm bảo trì định kỳ từ 23:00 đến 01:00 đêm nay.',
    metaInfo: 'TRẠM CÂN SỐ 2 · BẢO TRÌ ĐỊNH KỲ',
    statusBadgeText: 'Đã tiếp nhận',
  },
  {
    id: 10,
    type: 'BOOKING',
    category: 'gate',
    isUrgent: false,
    readAt: '2026-11-01T15:30:00Z',
    priorityBadgeText: 'HOÀN TẤT CHUYẾN',
    timeLabel: '15:30 01/11/2026',
    createdAt: '2026-11-01T15:30:00Z',
    title: 'CHECK-OUT THÀNH CÔNG KHỎI BÃI XE CÁT LÁI',
    content:
      'Xe 51D-894.12 đã hoàn tất thời gian đỗ 4 giờ 15 phút. Barie mở tự động.',
    actionLabel: 'Xem lịch sử cước',
    actionPath: '/payments',
    actionIcon: 'download',
    metaInfo: 'THỜI GIAN ĐỖ: 4H 15M',
    statusBadgeText: 'Hoàn tất',
  },
]

export async function fetchNotificationsApi(params?: {
  page?: number
  size?: number
}): Promise<{ items: NotificationItemDto[]; total: number; unreadCount: number }> {
  try {
    const res = await axios.get(API_BASE, { params })
    if (res.data?.data?.content) {
      return {
        items: res.data.data.content,
        total: res.data.data.totalElements ?? fallbackNotificationsList.length,
        unreadCount: fallbackDriverStats.unreadCount,
      }
    }
  } catch {
    // fallback gracefully
  }

  const page = params?.page ?? 0
  const size = params?.size ?? 5
  const start = page * size
  const paginated = fallbackNotificationsList.slice(start, start + size)
  const unread = fallbackNotificationsList.filter((item) => item.readAt === null).length

  return {
    items: paginated.length > 0 ? paginated : fallbackNotificationsList.slice(0, 5),
    total: fallbackNotificationsList.length,
    unreadCount: unread,
  }
}

export async function fetchUnreadCountApi(): Promise<number> {
  try {
    const res = await axios.get(`${API_BASE}/unread-count`)
    if (typeof res.data?.data === 'number') {
      return res.data.data
    }
  } catch {
    // fallback
  }
  return fallbackNotificationsList.filter((item) => item.readAt === null).length
}

export async function markAsReadApi(id: number): Promise<void> {
  try {
    await axios.post(`${API_BASE}/${id}/read`)
  } catch {
    // simulated local success
  }
}

export async function markAllAsReadApi(): Promise<void> {
  try {
    await axios.post(`${API_BASE}/read-all`)
  } catch {
    // simulated local success
  }
}

const CHANNELS_STORAGE_KEY = 'smart-truck.driver.notification-channels'

export function fetchStoredChannelsConfig(): DriverNotificationChannelsConfig {
  try {
    const raw = localStorage.getItem(CHANNELS_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as DriverNotificationChannelsConfig
    }
  } catch {
    // ignore
  }
  return fallbackChannelsConfig
}

export function saveStoredChannelsConfig(
  config: DriverNotificationChannelsConfig
): void {
  try {
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(config))
  } catch {
    // ignore
  }
}
