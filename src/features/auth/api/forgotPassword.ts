import { sendData } from '@/shared/api/resources'
import { requestEmailOtp } from './emailOtp'
import { normalizeRecoveryEmail } from '../model/forgotPasswordSchema'

export interface ForgotPasswordOtpChallengeResult {
  email: string
  expiresInSeconds: number
  resendAfterSeconds: number
}

export interface ForgotPasswordResetRequestPayload {
  email: string
  otpCode: string
  newPassword: string
}

const DEFAULT_EXPIRES_IN_SECONDS = 300
const DEFAULT_RESEND_AFTER_SECONDS = 60

function sanitizeSeconds(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return Math.floor(value)
  }
  return fallback
}

export async function sendForgotPasswordOtp(
  email: string,
): Promise<ForgotPasswordOtpChallengeResult> {
  const normalizedEmail = normalizeRecoveryEmail(email)
  const result = await requestEmailOtp('forgot', normalizedEmail)
  return {
    email: normalizedEmail,
    expiresInSeconds: sanitizeSeconds(
      result?.expiresInSeconds,
      DEFAULT_EXPIRES_IN_SECONDS,
    ),
    resendAfterSeconds: sanitizeSeconds(
      result?.resendAfterSeconds,
      DEFAULT_RESEND_AFTER_SECONDS,
    ),
  }
}

function scrubSensitiveAxiosError(error: unknown): unknown {
  if (error && typeof error === 'object') {
    const candidate = error as {
      config?: { data?: unknown }
      response?: { config?: { data?: unknown } }
    }
    if (candidate.config && 'data' in candidate.config) {
      delete candidate.config.data
    }
    if (candidate.response?.config && 'data' in candidate.response.config) {
      delete candidate.response.config.data
    }
  }
  return error
}

export async function resetPasswordWithOtp(
  payload: ForgotPasswordResetRequestPayload,
): Promise<void> {
  try {
    await sendData<void>('post', '/api/v1/auth/forgot-password/reset', {
      email: normalizeRecoveryEmail(payload.email),
      otpCode: payload.otpCode.trim(),
      newPassword: payload.newPassword,
    })
  } catch (error) {
    throw scrubSensitiveAxiosError(error)
  }
}

