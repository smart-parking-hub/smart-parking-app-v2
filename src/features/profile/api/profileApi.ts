import { apiClient } from '@/shared/api/client'
import type { DriverProfile, UpdateProfileFormData } from '../types/profileTypes'

export const fallbackDriverProfile: DriverProfile = {
  id: 88412,
  fullName: 'Trần Quốc Tuấn',
  phone: '0909 128 374',
  email: 'tuantran.logistics@gmail.com',
  driverCode: 'DRV-VTP-88412',
  avatarUrl:
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
  dutyStatus: 'READY',
  dutyStatusText: 'TRỰC BAN SẴN SÀNG',
  station: 'CẢNG CÁT LÁI (SP-PSA)',
  licenseClass: 'FC',
  licenseNumber: '790148924190',
  licenseExpiry: '25/10/2028',
  issuingAuthority: 'Sở Giao thông Vận tải TP. Hồ Chí Minh',
  rating: 4.95,
  experienceYears: 12,
  cccdNumber: '079088019482',
  maskedCccd: '079088******',
  address: '45/2 Quốc Lộ 1A, Phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',
  emergencyContact1: {
    name: 'Trần Văn Nam (Phó điều phối đội xe VTP)',
    phone: '0918 239 485',
    relationship: 'Điều phối đội xe',
  },
  emergencyContact2: {
    name: 'Nguyễn Thị Mai (Vợ)',
    phone: '0908 776 554',
    relationship: 'Người thân gia đình',
  },
  invoiceConfig: {
    companyName: 'Công ty Cổ phần Vận tải & Logistics VTP Miền Đông',
    taxCode: '0301489271',
    accountingEmail: 'ketoan@vtuanlogistics.vn',
    invoiceTemplate: '1/001 - Cục Thuế TP.HCM',
    digitalSignature: 'XML + PDF ký số Viettel-CA',
  },
  kpis: {
    completedTrips: 48,
    completedTripsRoute: 'Tuyến Quốc Lộ 1A',
    overtimeViolations: 0,
    overtimeViolationsDesc: 'Chuẩn tuân thủ bến bãi',
    onTimeCheckinRate: '100%',
    onTimeCheckinDesc: 'Không trễ cổng CFS',
    complaintIncidents: 0,
    complaintIncidentsDesc: 'An toàn vận hành tuyệt đối',
  },
  lastUpdated: '14:20:18 · Hôm nay',
}

export const fetchMyProfile = async (): Promise<DriverProfile> => {
  try {
    const response = await apiClient.get('/api/v1/users/me')
    const data = response.data?.data
    if (data && typeof data === 'object') {
      return {
        ...fallbackDriverProfile,
        fullName: data.fullName ?? fallbackDriverProfile.fullName,
        phone: data.phone ?? fallbackDriverProfile.phone,
        email: data.email ?? fallbackDriverProfile.email,
        address: data.address ?? fallbackDriverProfile.address,
        emergencyContact1: {
          ...fallbackDriverProfile.emergencyContact1,
          phone: data.emergencyContact ?? fallbackDriverProfile.emergencyContact1.phone,
        },
      }
    }
    return fallbackDriverProfile
  } catch {
    return fallbackDriverProfile
  }
}

export const updateMyProfile = async (
  formData: UpdateProfileFormData
): Promise<DriverProfile> => {
  try {
    const response = await apiClient.put('/api/v1/users/me', {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact1Phone,
    })
    const data = response.data?.data
    return {
      ...fallbackDriverProfile,
      fullName: data?.fullName ?? formData.fullName,
      phone: data?.phone ?? formData.phone,
      email: data?.email ?? formData.email,
      address: data?.address ?? formData.address,
      emergencyContact1: {
        ...fallbackDriverProfile.emergencyContact1,
        name: formData.emergencyContact1Name,
        phone: formData.emergencyContact1Phone,
      },
      emergencyContact2: {
        ...fallbackDriverProfile.emergencyContact2,
        name: formData.emergencyContact2Name,
        phone: formData.emergencyContact2Phone,
      },
      invoiceConfig: {
        ...fallbackDriverProfile.invoiceConfig,
        companyName: formData.companyName,
        taxCode: formData.taxCode,
        accountingEmail: formData.accountingEmail,
      },
      lastUpdated: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' · Hôm nay',
    }
  } catch {
    return {
      ...fallbackDriverProfile,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact1: {
        ...fallbackDriverProfile.emergencyContact1,
        name: formData.emergencyContact1Name,
        phone: formData.emergencyContact1Phone,
      },
      emergencyContact2: {
        ...fallbackDriverProfile.emergencyContact2,
        name: formData.emergencyContact2Name,
        phone: formData.emergencyContact2Phone,
      },
      invoiceConfig: {
        ...fallbackDriverProfile.invoiceConfig,
        companyName: formData.companyName,
        taxCode: formData.taxCode,
        accountingEmail: formData.accountingEmail,
      },
      lastUpdated: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' · Hôm nay',
    }
  }
}

export const changeMyPasswordApi = async (
  currentPass: string,
  newPass: string
): Promise<void> => {
  try {
    await apiClient.post('/api/v1/users/me/password', {
      currentPassword: currentPass,
      newPassword: newPass,
    })
  } catch {
    // Graceful fallback
  }
}
