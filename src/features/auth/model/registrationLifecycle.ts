import type { AuthFields } from './authFields'

export type RegistrationRole = 'DRIVER' | 'MERCHANT'

export const ROLE_LABELS: Record<RegistrationRole, string> = {
  DRIVER: 'Tài xế',
  MERCHANT: 'Chủ bãi',
}

export const LEGACY_REGISTER_DRAFT_KEY = 'sp_register_draft'

export function isRegistrationRole(value: unknown): value is RegistrationRole {
  return value === 'DRIVER' || value === 'MERCHANT'
}

export function getRegistrationDefaults(role: RegistrationRole = 'DRIVER'): AuthFields {
  return {
    phone: '',
    password: '',
    confirmPassword: '',
    email: '',
    fullName: '',
    bankName: '',
    bankAccountNum: '',
    citizenId: '',
    otpCode: '',
    newPassword: '',
    role,
  }
}

export interface ProtectedDataCheckOptions {
  sent?: boolean
  isVerified?: boolean
  hasParamOtp?: boolean
  hasLinkOtp?: boolean
}

export function hasProtectedRegistrationData(
  values: Partial<AuthFields>,
  options?: ProtectedDataCheckOptions,
): boolean {
  if (options?.sent || options?.isVerified || options?.hasParamOtp || options?.hasLinkOtp) {
    return true
  }

  const fieldsToCheck: (keyof AuthFields)[] = [
    'fullName',
    'phone',
    'citizenId',
    'bankName',
    'bankAccountNum',
    'email',
    'otpCode',
    'password',
    'confirmPassword',
  ]

  for (const field of fieldsToCheck) {
    const val = values[field]
    if (typeof val === 'string' && val.length > 0) {
      return true
    }
  }

  return false
}

export function cleanLegacyRegisterDraftStorage(): void {
  try {
    sessionStorage.removeItem(LEGACY_REGISTER_DRAFT_KEY)
  } catch {
    // ignore storage access errors (e.g. blocked storage in sandboxed iframe or disabled cookies)
  }
}
