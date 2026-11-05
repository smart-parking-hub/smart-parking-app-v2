import { z } from 'zod'
import { apiClient } from '@/shared/api/client'
import type { UpdateMerchantProfileRequest } from '../types/merchantProfileTypes'

// Only fields returned by MerchantProfileController; absent fields stay empty.
const text = z.string().nullish().transform(value => value ?? null)
const profileSchema = z.object({
  merchantId: z.number(), userId: z.number(),
  fullName: text, phone: text, email: text, citizenId: text,
  maskedCitizenId: text, businessLicense: text, bankName: text,
  bankAccountNum: text, maskedBankAccount: text,
  walletBalance: z.union([z.number(), z.string()]).nullish().transform(value => value ?? null),
  accountStatus: text, verificationStatus: text, verificationLabel: text,
  address: text, emergencyContact: text,
})
const parseProfile = (data: unknown) => profileSchema.nullable().parse(data)

export async function fetchMerchantProfile() {
  const response = await apiClient.get<{ data: unknown }>('/api/v1/merchant/profile')
  return parseProfile(response.data.data)
}
export async function updateMerchantProfileApi(payload: UpdateMerchantProfileRequest) {
  const response = await apiClient.put<{ data: unknown }>('/api/v1/merchant/profile', payload)
  return profileSchema.parse(response.data.data)
}
export async function uploadMerchantDocumentApi(file: File | null, businessLicense: string) {
  const body = new FormData()
  if (file) body.append('file', file)
  if (businessLicense.trim()) body.append('businessLicense', businessLicense.trim())
  const response = await apiClient.post<{ data: unknown }>('/api/v1/merchant/profile/documents', body, { headers: { 'Content-Type': 'multipart/form-data' } })
  return profileSchema.parse(response.data.data)
}
