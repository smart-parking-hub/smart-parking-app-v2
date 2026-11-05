import { z } from 'zod'
import { apiClient } from '@/shared/api/client'
import type { DriverProfile, UpdateProfileFormData } from '../types/profileTypes'

const text = z.string().nullish().transform(value => value ?? null)
const schema = z.object({ fullName: text, phone: text, email: text, address: text, emergencyContact: text })
function parseProfile(data: unknown): DriverProfile {
  const result = schema.safeParse(data)
  if (!result.success) throw new Error('Dữ liệu hồ sơ không hợp lệ. Vui lòng tải lại.')
  return result.data
}
export async function fetchMyProfile(): Promise<DriverProfile | null> {
  const response = await apiClient.get<{ data: unknown }>('/api/v1/users/me')
  return response.data.data === null ? null : parseProfile(response.data.data)
}
export async function updateMyProfile(values: UpdateProfileFormData, phone: string | null): Promise<DriverProfile> {
  const response = await apiClient.put<{ data: unknown }>('/api/v1/users/me', { ...values, phone })
  return parseProfile(response.data.data)
}
export async function changeMyPasswordApi(currentPassword: string, newPassword: string): Promise<void> {
  await apiClient.post('/api/v1/users/me/password', { currentPassword, newPassword })
}
