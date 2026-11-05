export interface MerchantProfile {
  merchantId: number
  userId: number
  fullName: string | null
  phone: string | null
  email: string | null
  citizenId: string | null
  maskedCitizenId: string | null
  businessLicense: string | null
  bankName: string | null
  bankAccountNum: string | null
  maskedBankAccount: string | null
  walletBalance: number | string | null
  accountStatus: string | null
  verificationStatus: string | null
  verificationLabel: string | null
  address: string | null
  emergencyContact: string | null
}

export interface UpdateMerchantProfileRequest {
  fullName: string
  email: string
  address: string
  emergencyContact: string
}
