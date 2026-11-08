import { useEffect, useRef, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, AtSign, Info, LoaderCircle, Shield } from 'lucide-react'
import {
  forgotPasswordEmailSchema,
  type ForgotPasswordEmailFields,
} from '../model/forgotPasswordSchema'

export interface ForgotPasswordEmailFormProps {
  initialEmail: string
  isPending: boolean
  onSubmitEmail: (fields: ForgotPasswordEmailFields) => void
  onEmailChange?: (rawEmail: string) => void
}

export function ForgotPasswordEmailForm({
  initialEmail,
  isPending,
  onSubmitEmail,
  onEmailChange,
}: ForgotPasswordEmailFormProps) {
  const submittingLockRef = useRef(false)

  const form = useForm<ForgotPasswordEmailFields>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: initialEmail },
  })

  useEffect(() => {
    form.setValue('email', initialEmail)
  }, [form, initialEmail])

  const emailRegister = form.register('email', {
    onChange: (event: { target: { value: string } }) => {
      onEmailChange?.(event.target.value)
    },
  })

  const emailError = form.formState.errors.email?.message

  const submitWithValidation = form.handleSubmit(
    (fields) => {
      submittingLockRef.current = false
      onSubmitEmail(fields)
    },
    () => {
      submittingLockRef.current = false
    },
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isPending || submittingLockRef.current) {
      return
    }
    submittingLockRef.current = true
    void submitWithValidation(event)
  }

  return (
    <div className="space-y-6" id="form-step-1">
      <div className="p-4 rounded bg-[#eff4ff] flex items-start gap-2.5">
        <Shield
          size={20}
          className="text-[#45464d] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-[#45464d] leading-relaxed">
          Nhập địa chỉ email đã đăng ký với tài khoản của bạn. Cơ chế{' '}
          <span className="font-semibold text-[#0d1c2e]">
            bảo mật chống dò tìm tài khoản
          </span>{' '}
          được áp dụng: hệ thống luôn phản hồi đồng nhất và chỉ gửi mã OTP nếu
          email đã đăng ký.
        </p>
      </div>

      <form
        noValidate
        className="space-y-6"
        onSubmit={handleSubmit}
        aria-busy={isPending}
      >
        <fieldset disabled={isPending} className="space-y-6">
          <div className="space-y-1.5">
            <label
              className="block text-xs font-semibold text-[#0d1c2e] uppercase tracking-wider"
              htmlFor="input-email"
            >
              Email nhận mã xác thực{' '}
              <span className="text-[#ba1a1a]" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#45464d]">
                <AtSign size={18} aria-hidden="true" />
              </div>
              <input
                id="input-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="vidu: tai-khoan@example.com"
                aria-invalid={Boolean(emailError)}
                aria-describedby={
                  emailError ? 'input-email-error' : 'input-email-hint'
                }
                className="w-full h-12 pl-11 pr-4 rounded border border-[#c6c6cd] bg-white text-[#0d1c2e] text-sm focus:outline-none focus:border-[#d95f00] focus:bg-[#eff4ff]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-60 transition-colors"
                {...emailRegister}
              />
            </div>
            {emailError && (
              <p
                id="input-email-error"
                role="alert"
                className="text-xs font-medium text-[#ba1a1a] pt-1"
              >
                {emailError}
              </p>
            )}
            <p
              id="input-email-hint"
              className="font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d] flex items-center gap-1.5 pt-1"
            >
              <Info size={14} className="shrink-0" aria-hidden="true" />
              <span>
                Hỗ trợ địa chỉ email đã liên kết với tài khoản SmartTruck Hub
                (tối đa 100 ký tự).
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span>Đang gửi mã OTP…</span>
              </>
            ) : (
              <>
                <span>Gửi Mã Xác Nhận OTP</span>
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
