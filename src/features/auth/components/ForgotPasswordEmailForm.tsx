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
    <div className="space-y-5" id="form-step-1">
      <div className="p-3.5 rounded-xl bg-black/5 border border-black/10 flex items-start gap-2.5">
        <Shield
          size={18}
          className="text-[#d95f00] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-xs text-black font-normal leading-relaxed">
          Nhập địa chỉ email đã đăng ký. Hệ thống sẽ gửi mã OTP gồm 6 chữ số nếu email tồn tại trên hệ thống.
        </p>
      </div>

      <form
        noValidate
        className="space-y-5"
        onSubmit={handleSubmit}
        aria-busy={isPending}
      >
        <fieldset disabled={isPending} className="space-y-5">
          <div className="space-y-1.5">
            <label
              className="block text-sm sm:text-base font-semibold text-black"
              htmlFor="input-email"
            >
              Email nhận mã xác thực
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign size={18} aria-hidden="true" />
              </div>
              <input
                id="input-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Ví dụ: taixe.nguyen@gmail.com"
                aria-invalid={Boolean(emailError)}
                aria-describedby={
                  emailError ? 'input-email-error' : 'input-email-hint'
                }
                className="w-full min-h-12 sm:min-h-14 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-black font-normal placeholder:font-normal placeholder:text-slate-400 hover:border-slate-400 focus:outline-none focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-60 transition-colors"
                {...emailRegister}
              />
            </div>
            {emailError && (
              <p
                id="input-email-error"
                role="alert"
                className="text-xs font-normal text-red-700 pt-1"
              >
                {emailError}
              </p>
            )}
            <p
              id="input-email-hint"
              className="font-inter text-xs text-black font-normal flex items-center gap-1.5 pt-1"
            >
              <Info size={14} className="shrink-0 text-slate-400" aria-hidden="true" />
              <span>
                Hỗ trợ địa chỉ email đã liên kết với tài khoản SmartTruck Hub (tối đa 100 ký tự).
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full min-h-12 sm:min-h-14 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white text-base font-bold flex items-center justify-center gap-2 shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
