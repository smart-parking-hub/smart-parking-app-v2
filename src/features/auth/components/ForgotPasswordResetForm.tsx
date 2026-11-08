import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  MailCheck,
  RefreshCw,
  Timer,
} from 'lucide-react'
import {
  forgotPasswordResetSchema,
  type ForgotPasswordResetFields,
} from '../model/forgotPasswordSchema'

export interface ForgotPasswordResetFormProps {
  email: string
  ttlRemainingSeconds: number
  resendRemainingSeconds: number
  isResetPending: boolean
  isResendPending: boolean
  resendNotice: string | null
  resendSignal: number
  onSubmitReset: (fields: ForgotPasswordResetFields) => void
  onResendOtp: () => void
  onChangeEmail: () => void
}

export function formatOtpCountdown(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds))
  const min = Math.floor(clamped / 60)
  const sec = clamped % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export function ForgotPasswordResetForm({
  email,
  ttlRemainingSeconds,
  resendRemainingSeconds,
  isResetPending,
  isResendPending,
  resendNotice,
  resendSignal,
  onSubmitReset,
  onResendOtp,
  onChangeEmail,
}: ForgotPasswordResetFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const submittingLockRef = useRef(false)

  const form = useForm<ForgotPasswordResetFields>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      otpCode: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (resendSignal > 0) {
      form.setValue('otpCode', '')
      form.clearErrors('otpCode')
    }
  }, [form, resendSignal])

  const isBusy = isResetPending || isResendPending
  const isResendDisabled = isBusy || resendRemainingSeconds > 0
  const errors = form.formState.errors

  const submitWithValidation = form.handleSubmit(
    (fields) => {
      submittingLockRef.current = false
      onSubmitReset(fields)
    },
    () => {
      submittingLockRef.current = false
    },
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isBusy || submittingLockRef.current) {
      return
    }
    submittingLockRef.current = true
    void submitWithValidation(event)
  }

  return (
    <div className="space-y-6" id="form-step-2">
      <div className="p-4 rounded-2xl bg-black/5 border border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-2.5 min-w-0">
          <MailCheck
            size={20}
            className="text-[#d95f00] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-black">
              Nếu email đã đăng ký, mã OTP 6 chữ số đã được gửi tới:
            </p>
            <p
              className="font-inter text-xs leading-4 tracking-[0.06em] text-black font-semibold break-all mt-0.5"
              id="display-user-email"
            >
              {email}
            </p>
            <button
              type="button"
              disabled={isBusy}
              onClick={onChangeEmail}
              className="mt-1.5 font-inter text-xs leading-4 font-normal tracking-[0.06em] text-black hover:text-[#d95f00] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm disabled:opacity-50 cursor-pointer"
            >
              Nhập email khác
            </button>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-black/10 self-start sm:self-center shadow-xs shrink-0"
          aria-label="Thời gian hiệu lực mã OTP"
        >
          <Timer
            size={18}
            className="text-[#d95f00]"
            aria-hidden="true"
          />
          <span
            className="font-inter text-xs leading-4 tracking-[0.04em] font-bold text-black tabular-nums"
            id="countdown-timer"
            data-testid="otp-ttl-timer"
          >
            {formatOtpCountdown(ttlRemainingSeconds)}
          </span>
          <span className="font-inter text-[11px] font-normal tracking-[0.06em] text-black/70">
            {ttlRemainingSeconds > 0 ? 'CÒN LẠI' : 'HẾT HẠN'}
          </span>
        </div>
      </div>

      {resendNotice && (
        <div
          role="status"
          aria-live="polite"
          className="px-3.5 py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-normal text-black"
        >
          {resendNotice}
        </div>
      )}

      <form
        noValidate
        className="space-y-6"
        onSubmit={handleSubmit}
        aria-busy={isBusy}
      >
        <fieldset disabled={isBusy} className="space-y-6">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label
                className="block text-xs font-semibold text-black uppercase tracking-wider"
                htmlFor="input-otp"
              >
                Mã OTP xác thực (6 chữ số){' '}
                <span className="text-[#d95f00]" aria-hidden="true">
                  *
                </span>
              </label>
              <span className="font-inter text-xs leading-4 font-normal tracking-[0.06em] text-black/70">
                Tối đa 5 lần thử
              </span>
            </div>
            <div className="relative">
              <input
                id="input-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="• • • • • •"
                aria-invalid={Boolean(errors.otpCode)}
                aria-describedby={
                  errors.otpCode ? 'input-otp-error' : 'input-otp-hint'
                }
                className="w-full h-14 text-center tracking-[0.5em] font-sora text-xl font-normal rounded-xl border border-black/15 bg-white text-black placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-60 transition-colors"
                {...form.register('otpCode')}
              />
            </div>
            {errors.otpCode && (
              <p
                id="input-otp-error"
                role="alert"
                className="text-xs font-medium text-red-600 pt-1"
              >
                {errors.otpCode.message}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span
                id="input-otp-hint"
                className="font-inter text-xs leading-4 font-normal tracking-[0.06em] text-black/70"
              >
                Không nhận được mã? Kiểm tra hộp thư Spam
              </span>
              <button
                type="button"
                disabled={isResendDisabled}
                onClick={onResendOtp}
                className="font-inter text-xs leading-4 tracking-[0.06em] text-[#d95f00] hover:underline font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
              >
                {isResendPending ? (
                  <>
                    <span className="relative flex items-center justify-center">
                      <span className="absolute -inset-1 rounded-full bg-[#d95f00]/30 animate-ping" />
                      <LoaderCircle
                        size={14}
                        className="animate-spin text-[#d95f00]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="animate-pulse">Đang gửi lại mã…</span>
                  </>
                ) : resendRemainingSeconds > 0 ? (
                  <>
                    <RefreshCw size={14} aria-hidden="true" />
                    <span>Gửi lại sau {resendRemainingSeconds}s</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} aria-hidden="true" />
                    <span>Gửi lại mã OTP mới</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold text-black uppercase tracking-wider"
                htmlFor="new-password"
              >
                Mật khẩu mới{' '}
                <span className="text-[#d95f00]" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Từ 6 đến 50 ký tự"
                  aria-invalid={Boolean(errors.newPassword)}
                  aria-describedby={
                    errors.newPassword
                      ? 'new-password-error'
                      : 'password-rules-hint'
                  }
                  className="w-full h-12 px-3.5 pr-11 rounded-xl border border-black/15 bg-white text-black font-normal placeholder:font-normal placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-60 transition-colors"
                  {...form.register('newPassword')}
                />
                <button
                  type="button"
                  aria-label={
                    showNewPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'
                  }
                  aria-controls="new-password"
                  aria-pressed={showNewPassword}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-1 px-2.5 flex items-center text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p
                  id="new-password-error"
                  role="alert"
                  className="text-xs font-medium text-red-600 pt-1"
                >
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-xs font-semibold text-black uppercase tracking-wider"
                htmlFor="confirm-password"
              >
                Xác nhận mật khẩu{' '}
                <span className="text-[#d95f00]" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword
                      ? 'confirm-password-error'
                      : 'password-rules-hint'
                  }
                  className="w-full h-12 px-3.5 pr-11 rounded-xl border border-black/15 bg-white text-black font-normal placeholder:font-normal placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-60 transition-colors"
                  {...form.register('confirmPassword')}
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? 'Ẩn xác nhận mật khẩu'
                      : 'Hiện xác nhận mật khẩu'
                  }
                  aria-controls="confirm-password"
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-1 px-2.5 flex items-center text-black/60 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  role="alert"
                  className="text-xs font-medium text-red-600 pt-1"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div
            id="password-rules-hint"
            className="p-3 rounded-xl bg-black/5 text-black font-inter text-xs leading-4 font-normal tracking-[0.06em] space-y-1"
          >
            <p className="font-semibold text-black flex items-center gap-1.5">
              <BadgeCheck
                size={15}
                className="text-[#d95f00] shrink-0"
                aria-hidden="true"
              />
              <span>Quy định mật khẩu mới trên hệ thống:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                <span>Từ 6 đến 50 ký tự</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                <span>Không chỉ gồm khoảng trắng</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                <span>Xác nhận mật khẩu trùng khớp</span>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full h-12 py-3 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white font-sora text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isResetPending ? (
              <>
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Đang đặt lại mật khẩu…</span>
              </>
            ) : (
              <>
                <span>Đặt Lại Mật Khẩu</span>
                <CheckCircle2 size={20} aria-hidden="true" />
              </>
            )}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
