import { sendData } from '@/shared/api/resources'

export function verifyRegisterOtp(email: string, otpCode: string) {
  return sendData('post', '/api/v1/auth/otp/verify', { email, otpCode })
}

export async function requestEmailOtp(
  mode: 'register' | 'forgot',
  email: string,
  phone?: string,
) {
  const payload = mode === 'register' ? { email, phone } : { email }
  const result = await sendData<{ expiresInSeconds: number; resendAfterSeconds: number }>(
    'post',
    `/api/v1/auth/${mode === 'register' ? 'otp/send' : 'forgot-password/otp'}`,
    payload,
    { timeout: 12000 },
  )
  return { ...result, email }
}
