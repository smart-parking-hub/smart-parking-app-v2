import { sendData } from '@/shared/api/resources'

export async function requestEmailOtp(mode: 'register' | 'forgot', email: string) {
  const result = await sendData<{ expiresInSeconds: number; resendAfterSeconds: number }>(
    'post',
    `/api/v1/auth/${mode === 'register' ? 'otp/send' : 'forgot-password/otp'}`,
    { email },
  )
  return { ...result, email }
}
