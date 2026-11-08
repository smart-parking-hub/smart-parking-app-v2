import { z } from 'zod'

export function normalizeRecoveryEmail(value: string): string {
  return value.trim().toLowerCase()
}

export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .transform(normalizeRecoveryEmail)
    .pipe(
      z
        .string()
        .min(1, 'Vui lòng nhập địa chỉ email.')
        .max(100, 'Email không được vượt quá 100 ký tự.')
        .email('Địa chỉ email không đúng định dạng.'),
    ),
})

export type ForgotPasswordEmailFields = z.infer<typeof forgotPasswordEmailSchema>

export const forgotPasswordResetSchema = z
  .object({
    otpCode: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập mã OTP 6 chữ số.')
      .regex(/^[0-9]{6}$/, 'Mã OTP phải gồm đúng 6 chữ số.'),
    newPassword: z
      .string()
      .min(6, 'Mật khẩu mới phải có từ 6 đến 50 ký tự.')
      .max(50, 'Mật khẩu mới phải có từ 6 đến 50 ký tự.')
      .refine(
        (value) => value.trim().length > 0,
        'Mật khẩu mới không được chỉ gồm khoảng trắng.',
      ),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng nhập xác nhận mật khẩu mới.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Xác nhận mật khẩu mới không trùng khớp.',
  })

export type ForgotPasswordResetFields = z.infer<typeof forgotPasswordResetSchema>

