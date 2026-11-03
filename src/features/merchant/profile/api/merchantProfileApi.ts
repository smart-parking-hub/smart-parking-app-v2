import { apiClient } from '@/shared/api/client'
import type {
  MerchantProfile,
  UpdateMerchantProfileRequest,
  FastWithdrawalRequest,
  FastWithdrawalResponse,
  MerchantNotificationSettings,
  StoredDocument,
} from '../types/merchantProfileTypes'

const LOCAL_STORAGE_PROFILE_KEY = 'smarttruck_merchant_profile_v2'
const LOCAL_STORAGE_NOTIFS_KEY = 'smarttruck_merchant_notifications_v2'

export const fallbackMerchantProfile: MerchantProfile = {
  merchantId: 88219,
  userId: 1042,
  merchantCode: '#MCH-88219',
  fullName: 'Lê Văn Thành',
  phone: '0908 123 456',
  email: 'lethanh.tancang@saigonlogistics.vn',
  companyName: 'Công ty TNHH Tiếp Vận & Kho Bãi Tân Cảng Sài Gòn',
  citizenId: '079088019482',
  maskedCitizenId: '079******482',
  businessLicense: '0314892719',
  businessLicenseDate: '14/05/2018',
  businessLicenseIssuer: 'Sở KH&ĐT TP.HCM',
  managedYardsCount: 3,
  managedYardsDesc: '03 Bãi Depot Cát Lái & Hải Phòng',
  auditDeadline: '31/12/2026',
  auditDaysRemaining: 624,
  bankName: 'Ngân hàng TMCP Quân Đội (MB Bank)',
  bankShortName: 'MB',
  bankBranch: 'Chi nhánh Đông Sài Gòn (Thủ Đức)',
  bankAccountNum: '0882199999999',
  maskedBankAccount: '0882****9999',
  bankAccountHolder: 'CONG TY TNHH TIEP VAN VA KHO BAI TAN CANG',
  walletBalance: 42800000,
  pendingBalance: 25000000,
  platformFeeRate: 5.0,
  vatInvoiceDesc:
    'Tự động phát hành qua email kế toán vào ngày 02 hàng tháng (Mẫu số 01GTKT0/001 theo chuẩn Tổng cục Thuế).',
  verificationStatus: 'VERIFIED',
  verificationLabel: 'ĐÃ XÁC THỰC DOANH NGHIỆP E-KYC',
  standardsLabel: 'TIÊU CHUẨN ISO 27001 • CỤC ĐKVN',
  address: 'Số 1295 Đường Nguyễn Thị Định, Phường Cát Lái, TP. Thủ Đức, TP. Hồ Chí Minh',
  emergencyContact: '0908 123 456',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ0BcNcPy_sfndWB-X8Kp2H0ucRHItNjNQw4Y5TqimC7rtj_a70XKcskKUCRxAQVkWZwxBaTQNDxrL1VdL3x8ql76HUvhEuDvNzokfg8sDNCcdUy21P7jlfNQJ5faK6aqsyEWb0XGKm0TnBZnsbVPWlxctmorMDp24PYZhA7XbiGI4QBIh6JhxGOcG-B2EsVnOemRV-FJ3jhYILwa9kVnwkPl6-hAT67uq0z3NPN9R',
  documents: [
    {
      id: 'doc-01',
      name: 'GPKD_TanCang_2018.pdf',
      type: 'gpkd',
      size: '2.4 MB',
      authority: 'Ký số CA Viettel',
      uploadedAt: '14/05/2018',
    },
    {
      id: 'doc-02',
      name: 'ChungNhan_PCCC_CatLai.pdf',
      type: 'pccc',
      size: '4.1 MB',
      authority: 'PC07 TP.HCM Cấp',
      uploadedAt: '20/09/2021',
    },
  ],
  notificationSettings: {
    webPushHorn: true,
    smsCriticalAlert: true,
    zaloOaStatement: false,
  },
  lastUpdated: '12/03/2025 bởi Admin (Lê Văn Thành)',
}

export const fetchMerchantProfile = async (): Promise<MerchantProfile> => {
  // Check local saved preferences first for seamless continuity
  let cachedOverrides: Partial<MerchantProfile> = {}
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY)
    if (raw) {
      cachedOverrides = JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[MerchantProfile] Failed to read localStorage cache', err)
  }

  let savedNotifs: MerchantNotificationSettings | null = null
  try {
    const rawNotifs = localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY)
    if (rawNotifs) {
      savedNotifs = JSON.parse(rawNotifs)
    }
  } catch (err) {
    console.warn('[MerchantProfile] Failed to read notif cache', err)
  }

  try {
    const res = await apiClient.get('/api/v1/merchant/profile')
    const serverData = res.data?.data

    if (serverData && typeof serverData === 'object') {
      const merged: MerchantProfile = {
        ...fallbackMerchantProfile,
        ...serverData,
        ...cachedOverrides,
        merchantId: serverData.merchantId ?? fallbackMerchantProfile.merchantId,
        userId: serverData.userId ?? fallbackMerchantProfile.userId,
        fullName: serverData.fullName || fallbackMerchantProfile.fullName,
        email: serverData.email || fallbackMerchantProfile.email,
        phone: serverData.phone || fallbackMerchantProfile.phone,
        citizenId: serverData.citizenId || fallbackMerchantProfile.citizenId,
        maskedCitizenId:
          serverData.maskedCitizenId ||
          (serverData.citizenId
            ? `${serverData.citizenId.slice(0, 3)}******${serverData.citizenId.slice(-3)}`
            : fallbackMerchantProfile.maskedCitizenId),
        businessLicense: serverData.businessLicense || fallbackMerchantProfile.businessLicense,
        bankName: serverData.bankName || fallbackMerchantProfile.bankName,
        bankAccountNum: serverData.bankAccountNum || fallbackMerchantProfile.bankAccountNum,
        maskedBankAccount:
          serverData.maskedBankAccount ||
          (serverData.bankAccountNum
            ? `${serverData.bankAccountNum.slice(0, 4)}****${serverData.bankAccountNum.slice(-4)}`
            : fallbackMerchantProfile.maskedBankAccount),
        walletBalance:
          serverData.walletBalance != null
            ? Number(serverData.walletBalance)
            : fallbackMerchantProfile.walletBalance,
        address: serverData.address || fallbackMerchantProfile.address,
        emergencyContact: serverData.emergencyContact || fallbackMerchantProfile.emergencyContact,
        notificationSettings: savedNotifs || fallbackMerchantProfile.notificationSettings,
      }
      return merged
    }
  } catch (err) {
    console.warn('[MerchantProfile] API fetch failed, utilizing enriched fallback profile', err)
  }

  return {
    ...fallbackMerchantProfile,
    ...cachedOverrides,
    notificationSettings: savedNotifs || fallbackMerchantProfile.notificationSettings,
  }
}

export const updateMerchantProfileApi = async (
  payload: UpdateMerchantProfileRequest,
): Promise<MerchantProfile> => {
  try {
    const res = await apiClient.put('/api/v1/merchant/profile', payload)
    const serverData = res.data?.data
    if (serverData) {
      // save to local storage as well
      const current = await fetchMerchantProfile()
      const updated: MerchantProfile = {
        ...current,
        ...serverData,
        lastUpdated: `Vừa cập nhật (${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})`,
      }
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated))
      return updated
    }
  } catch (err) {
    console.warn('[MerchantProfile] Server update request fallback to local persistent sync', err)
  }

  // Local fallback
  const current = await fetchMerchantProfile()
  const updated: MerchantProfile = {
    ...current,
    fullName: payload.fullName || current.fullName,
    email: payload.email || current.email,
    citizenId: payload.citizenId || current.citizenId,
    maskedCitizenId: payload.citizenId
      ? `${payload.citizenId.slice(0, 3)}******${payload.citizenId.slice(-3)}`
      : current.maskedCitizenId,
    businessLicense: payload.businessLicense || current.businessLicense,
    bankName: payload.bankName || current.bankName,
    bankAccountNum: payload.bankAccountNum || current.bankAccountNum,
    maskedBankAccount: payload.bankAccountNum
      ? `${payload.bankAccountNum.slice(0, 4)}****${payload.bankAccountNum.slice(-4)}`
      : current.maskedBankAccount,
    address: payload.address || current.address,
    emergencyContact: payload.emergencyContact || current.emergencyContact,
    lastUpdated: `Vừa xong · ${new Date().toLocaleDateString('vi-VN')}`,
  }
  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated))
  return updated
}

export const uploadMerchantDocumentApi = async (params: {
  businessLicense?: string
  file?: File | null
}): Promise<{ updatedProfile: MerchantProfile; newDocument?: StoredDocument }> => {
  const formData = new FormData()
  if (params.businessLicense) {
    formData.append('businessLicense', params.businessLicense)
  }
  if (params.file) {
    formData.append('file', params.file)
  }

  let serverData: Partial<MerchantProfile> | null = null
  try {
    const res = await apiClient.post('/api/v1/merchant/profile/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    serverData = res.data?.data
  } catch (err) {
    console.warn('[MerchantProfile] Upload documents fallback to local catalog simulation', err)
  }

  const current = await fetchMerchantProfile()
  let newDoc: StoredDocument | undefined

  if (params.file) {
    const fileSizeMb = (params.file.size / (1024 * 1024)).toFixed(1)
    newDoc = {
      id: `doc-${Date.now()}`,
      name: params.file.name,
      type: params.file.name.toLowerCase().includes('pccc') ? 'pccc' : 'gpkd',
      size: `${fileSizeMb} MB`,
      authority: 'Cổng tiếp nhận trực tuyến',
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
    }
  }

  const updatedDocs = newDoc ? [newDoc, ...current.documents] : current.documents
  const updatedProfile: MerchantProfile = {
    ...current,
    ...(serverData || {}),
    businessLicense: params.businessLicense || current.businessLicense,
    documents: updatedDocs,
    lastUpdated: `Vừa tải lên hồ sơ · ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
  }

  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProfile))
  return { updatedProfile, newDocument: newDoc }
}

export const saveNotificationSettings = (
  settings: MerchantNotificationSettings,
): MerchantNotificationSettings => {
  localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify(settings))
  return settings
}

export const requestFastWithdrawalApi = async (
  request: FastWithdrawalRequest,
): Promise<FastWithdrawalResponse> => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    transactionId: `TXN-NP247-${Date.now().toString().slice(-6)}`,
    amount: request.amount,
    fee: 0,
    bankName: request.bankName,
    bankAccountNum: request.bankAccountNum,
    status: 'SUCCESS',
    estimatedTime: '5-15 phút (24/7)',
    createdAt: new Date().toISOString(),
  }
}
