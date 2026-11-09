export interface AuthFields {
  phone: string
  password: string
  confirmPassword?: string
  email: string
  fullName: string
  bankName: string
  bankAccountNum: string
  citizenId: string
  otpCode: string
  newPassword: string
  role: 'DRIVER' | 'MERCHANT'
}
