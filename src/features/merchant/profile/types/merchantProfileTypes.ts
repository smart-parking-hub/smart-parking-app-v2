export type MerchantVerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'INACTIVE' | 'BANNED'

export interface StoredDocument {
  id: string
  name: string
  type: 'gpkd' | 'pccc' | 'other'
  size: string
  authority: string
  uploadedAt: string
  url?: string
}

export interface MerchantNotificationSettings {
  webPushHorn: boolean
  smsCriticalAlert: boolean
  zaloOaStatement: boolean
}

export interface MerchantProfile {
  merchantId: number
  userId: number
  merchantCode: string
  fullName: string
  phone: string
  email: string
  companyName: string
  citizenId: string
  maskedCitizenId: string
  businessLicense: string
  businessLicenseDate: string
  businessLicenseIssuer: string
  managedYardsCount: number
  managedYardsDesc: string
  auditDeadline: string
  auditDaysRemaining: number
  bankName: string
  bankShortName: string
  bankBranch: string
  bankAccountNum: string
  maskedBankAccount: string
  bankAccountHolder: string
  walletBalance: number
  pendingBalance: number
  platformFeeRate: number
  vatInvoiceDesc: string
  verificationStatus: MerchantVerificationStatus
  verificationLabel: string
  standardsLabel: string
  address: string
  emergencyContact: string
  avatarUrl: string
  documents: StoredDocument[]
  notificationSettings: MerchantNotificationSettings
  lastUpdated: string
}

export interface UpdateMerchantProfileRequest {
  fullName?: string
  email?: string
  citizenId?: string
  businessLicense?: string
  bankName?: string
  bankAccountNum?: string
  address?: string
  emergencyContact?: string
}

export interface FastWithdrawalRequest {
  amount: number
  bankName: string
  bankAccountNum: string
  accountHolder: string
}

export interface FastWithdrawalResponse {
  transactionId: string
  amount: number
  fee: number
  bankName: string
  bankAccountNum: string
  status: 'PENDING' | 'SUCCESS'
  estimatedTime: string
  createdAt: string
}
