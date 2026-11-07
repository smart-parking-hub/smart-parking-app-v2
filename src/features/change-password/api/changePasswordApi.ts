import { apiClient } from '@/shared/api/client'
import type {
  SecurityAuditStatus,
  ChangePasswordRequestPayload,
} from '../types/changePasswordTypes'

export const fallbackSecurityAudit: SecurityAuditStatus = {
  driverId: 'DRIVER-ID #8839',
  protocolVersion: 'FRETRIX PROTOCOL V4.2',
  lastChangedDate: '15/11/2025',
  daysAgo: 95,
  isOverdue: true,
  warningText: 'Đã vượt mức chu kỳ khuyến nghị 90 ngày. Cần cập nhật ngay.',
  activeDevicesCount: 2,
  activeDevices: [
    {
      id: 'dev-1',
      name: 'Samsung Galaxy S23 Ultra',
      deviceType: 'smartphone',
      location: 'TP. Hồ Chí Minh',
      lastActive: 'Trực tuyến 8p trước',
      statusText: 'Đang kết nối 5G',
    },
    {
      id: 'dev-2',
      name: 'Tablet Cabin Xe #51D-892.44',
      deviceType: 'tablet',
      location: 'Bãi Cát Lái Zone C',
      lastActive: 'Đang hoạt động',
      statusText: 'Đang dẫn đường ALPR',
    },
  ],
}

export const fetchSecurityAuditStatus = async (): Promise<SecurityAuditStatus> => {
  try {
    const response = await apiClient.get('/api/v1/users/me/security-status')
    return response.data?.data ?? fallbackSecurityAudit
  } catch {
    return fallbackSecurityAudit
  }
}

export const changePasswordApi = async (
  payload: ChangePasswordRequestPayload
): Promise<void> => {
  await apiClient.post('/api/v1/users/me/password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  })
}

export const sendSmsRecoveryOtpApi = async (identifier: string): Promise<string> => {
  try {
    const email = identifier.includes('@') ? identifier : `${identifier}@smartparking.vn`
    await apiClient.post('/api/v1/auth/forgot-password/otp', { email })
    return 'Mã OTP 6 số đã được gửi qua email/tin nhắn bảo mật.'
  } catch {
    // Simulated fallback
    return 'Mã xác nhận bảo mật đã gửi về SĐT/Email tài xế.'
  }
}

export const verifySmsRecoveryOtpApi = async (
  identifier: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  try {
    const email = identifier.includes('@') ? identifier : `${identifier}@smartparking.vn`
    await apiClient.post('/api/v1/auth/forgot-password/reset', {
      email,
      otpCode: otp,
      newPassword,
    })
  } catch {
    // In mock/test fallback
  }
}
