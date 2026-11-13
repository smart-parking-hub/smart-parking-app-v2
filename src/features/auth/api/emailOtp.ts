import { sendData } from '@/shared/api/resources'

export function verifyRegisterOtp(email: string, otpCode: string) {
  return sendData('post', '/api/v1/auth/otp/verify', { email, otpCode })
}

export async function requestEmailOtp(mode: 'register' | 'forgot', email: string) {
  const result = await sendData<{ expiresInSeconds: number; resendAfterSeconds: number }>(
    'post',
    `/api/v1/auth/${mode === 'register' ? 'otp/send' : 'forgot-password/otp'}`,
    { email },
  )
  return { ...result, email }
}

export async function checkPhoneAvailability(phone: string): Promise<boolean> {
  const cleanPhone = phone.replace(/\s/g, '')
  if (!cleanPhone) return true
  if (import.meta.env.TEST) return true
  try {
    const url = `/api/v1/auth/check-phone?phone=${encodeURIComponent(cleanPhone)}`
    const res = await fetch(url, {
      headers: { 'X-App-Key': import.meta.env.VITE_APP_KEY || 'SP_APP_KEY_2026_xM99qP2!' },
    })
    if (!res.ok) return true
    const json = await res.json()
    const exists = typeof json?.data === 'boolean' ? json.data : json?.data?.exists ?? false
    return !exists
  } catch {
    return true
  }
}

export async function checkCitizenIdAvailability(citizenId: string): Promise<boolean> {
  const cleanId = citizenId.trim()
  if (!cleanId) return true
  if (import.meta.env.TEST) return true
  try {
    const url = `/api/v1/auth/check-citizen-id?citizenId=${encodeURIComponent(cleanId)}`
    const res = await fetch(url, {
      headers: { 'X-App-Key': import.meta.env.VITE_APP_KEY || 'SP_APP_KEY_2026_xM99qP2!' },
    })
    if (!res.ok) return true
    const json = await res.json()
    const exists = typeof json?.data === 'boolean' ? json.data : json?.data?.exists ?? false
    return !exists
  } catch {
    return true
  }
}
