import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  KeyRound,
  LockOpen,
  LogIn,
  RefreshCw,
  Truck,
} from 'lucide-react'
import { AuthLayout } from '@/layouts/AuthLayout'
import { errorMessage } from '@/shared/api/resources'
import { Toast } from '@/shared/components/Toast'
import {
  resetPasswordWithOtp,
  sendForgotPasswordOtp,
} from '../api/forgotPassword'
import {
  normalizeRecoveryEmail,
  type ForgotPasswordEmailFields,
  type ForgotPasswordResetFields,
} from '../model/forgotPasswordSchema'
import { ForgotPasswordEmailForm } from '../components/ForgotPasswordEmailForm'
import { ForgotPasswordResetForm } from '../components/ForgotPasswordResetForm'
import '../styles/recoveryFonts.css'

type RecoveryStep = 'email' | 'reset' | 'success'

interface ActiveOtpChallenge {
  email: string
  expiresAtMs: number
  resendAvailableAtMs: number
  expiresInSeconds: number
  resendAfterSeconds: number
}

interface RecoveryErrorBanner {
  title: string
  message: string
  status?: number
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>('email')
  const [emailDraft, setEmailDraft] = useState('')
  const [challenge, setChallenge] = useState<ActiveOtpChallenge | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [errorBanner, setErrorBanner] = useState<RecoveryErrorBanner | null>(
    null,
  )
  const [resendNotice, setResendNotice] = useState<string | null>(null)
  const [resendSignal, setResendSignal] = useState(0)
  const [resetFormKey, setResetFormKey] = useState(0)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const queryClient = useQueryClient()
  const requestSeqRef = useRef(0)
  const activeEmailRef = useRef('')
  const actionLockRef = useRef(false)
  const challengesByEmailRef = useRef<Record<string, ActiveOtpChallenge>>({})
  const pendingResetPayloadRef = useRef<{
    otpCode: string
    newPassword: string
  } | null>(null)

  const clearSettledRecoveryMutations = useCallback(() => {
    const cache = queryClient.getMutationCache()
    for (const mutation of [...cache.getAll()]) {
      const key = mutation.options.mutationKey
      const isRecoveryMutation =
        Array.isArray(key) && key[0] === 'forgot-password'
      if (isRecoveryMutation && mutation.state.status !== 'pending') {
        cache.remove(mutation)
      }
    }
  }, [queryClient])

  useEffect(() => {
    return () => {
      pendingResetPayloadRef.current = null
      challengesByEmailRef.current = {}
      clearSettledRecoveryMutations()
    }
  }, [clearSettledRecoveryMutations])

  const ttlRemainingSeconds = challenge
    ? Math.max(0, Math.ceil((challenge.expiresAtMs - nowMs) / 1000))
    : 0
  const resendRemainingSeconds = challenge
    ? Math.max(0, Math.ceil((challenge.resendAvailableAtMs - nowMs) / 1000))
    : 0

  useEffect(() => {
    if (step !== 'reset' || !challenge) return

    const syncClock = () => {
      setNowMs(Date.now())
    }

    const hasActiveDeadline =
      Date.now() < challenge.expiresAtMs ||
      Date.now() < challenge.resendAvailableAtMs

    if (!hasActiveDeadline) {
      return
    }

    const intervalId = window.setInterval(() => {
      const current = Date.now()
      setNowMs(current)
      if (
        current >= challenge.expiresAtMs &&
        current >= challenge.resendAvailableAtMs
      ) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncClock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [step, challenge])

  const sendOtpMutation = useMutation({
    mutationKey: ['forgot-password', 'send-otp'],
    retry: false,
    gcTime: 0,
    mutationFn: async ({
      email,
    }: {
      email: string
      seq: number
      isResend: boolean
    }) => {
      return sendForgotPasswordOtp(email)
    },
    onSuccess: (result, variables) => {
      if (
        variables.seq !== requestSeqRef.current ||
        normalizeRecoveryEmail(variables.email) !== activeEmailRef.current
      ) {
        return
      }

      const issuedAt = Date.now()
      const nextChallenge: ActiveOtpChallenge = {
        email: result.email,
        expiresAtMs: issuedAt + result.expiresInSeconds * 1000,
        resendAvailableAtMs: issuedAt + result.resendAfterSeconds * 1000,
        expiresInSeconds: result.expiresInSeconds,
        resendAfterSeconds: result.resendAfterSeconds,
      }
      challengesByEmailRef.current[result.email] = nextChallenge
      setNowMs(issuedAt)
      setChallenge(nextChallenge)
      setErrorBanner(null)

      if (variables.isResend) {
        setResendSignal((prev) => prev + 1)
        setResendNotice(
          'Nếu email đã đăng ký, mã OTP mới đã được gửi. Vui lòng kiểm tra hộp thư.',
        )
      } else {
        setResendSignal(0)
        setResendNotice(null)
        setResetFormKey((prev) => prev + 1)
        setStep('reset')
      }
    },
    onError: (error, variables) => {
      if (variables.seq !== requestSeqRef.current) {
        return
      }

      const status =
        isAxiosError(error) && error.response?.status
          ? error.response.status
          : undefined

      setResendNotice(null)
      setErrorBanner({
        title: variables.isResend
          ? 'Không thể gửi lại mã xác thực'
          : 'Không thể gửi mã xác thực',
        message: errorMessage(error),
        status,
      })
    },
    onSettled: (_data, _error, variables) => {
      if (variables.seq === requestSeqRef.current) {
        actionLockRef.current = false
      }
      queueMicrotask(() => {
        sendOtpMutation.reset()
        clearSettledRecoveryMutations()
      })
    },
  })

  const resetPasswordMutation = useMutation({
    mutationKey: ['forgot-password', 'reset-password'],
    retry: false,
    gcTime: 0,
    mutationFn: async ({
      email,
    }: {
      email: string
      seq: number
    }) => {
      const payload = pendingResetPayloadRef.current
      pendingResetPayloadRef.current = null
      if (!payload) {
        throw new Error('Không tìm thấy dữ liệu xác thực.')
      }
      await resetPasswordWithOtp({
        email,
        otpCode: payload.otpCode,
        newPassword: payload.newPassword,
      })
    },
    onSuccess: (_data, variables) => {
      if (
        variables.seq !== requestSeqRef.current ||
        !challenge ||
        normalizeRecoveryEmail(variables.email) !== challenge.email
      ) {
        return
      }

      delete challengesByEmailRef.current[challenge.email]
      setChallenge(null)
      setErrorBanner(null)
      setResendNotice(null)
      setResetFormKey((prev) => prev + 1)
      setStep('success')
      setShowSuccessToast(true)
    },
    onError: (error, variables) => {
      if (variables.seq !== requestSeqRef.current) {
        return
      }

      const status =
        isAxiosError(error) && error.response?.status
          ? error.response.status
          : undefined

      setResendNotice(null)
      setErrorBanner({
        title: 'Không thể đặt lại mật khẩu',
        message: errorMessage(error),
        status,
      })
    },
    onSettled: (_data, _error, variables) => {
      if (variables.seq === requestSeqRef.current) {
        actionLockRef.current = false
      }
      queueMicrotask(() => {
        resetPasswordMutation.reset()
        clearSettledRecoveryMutations()
      })
    },
  })

  const isSendingInitialOtp =
    sendOtpMutation.isPending && !sendOtpMutation.variables?.isResend
  const isResendingOtp =
    sendOtpMutation.isPending && Boolean(sendOtpMutation.variables?.isResend)
  const isResettingPassword = resetPasswordMutation.isPending
  const isStep2Busy = isResendingOtp || isResettingPassword

  const handleEmailSubmit = useCallback(
    (fields: ForgotPasswordEmailFields) => {
      if (actionLockRef.current || sendOtpMutation.isPending) return
      const normalized = normalizeRecoveryEmail(fields.email)
      const now = Date.now()
      const existingChallenge = challengesByEmailRef.current[normalized]

      setEmailDraft(normalized)
      setShowSuccessToast(false)
      setErrorBanner(null)
      setResendNotice(null)

      if (existingChallenge && now < existingChallenge.resendAvailableAtMs) {
        requestSeqRef.current += 1
        actionLockRef.current = false
        pendingResetPayloadRef.current = null
        activeEmailRef.current = normalized
        setNowMs(now)
        setChallenge(existingChallenge)
        setResendSignal(0)
        setResetFormKey((prev) => prev + 1)
        setStep('reset')
        return
      }

      actionLockRef.current = true
      const nextSeq = requestSeqRef.current + 1
      requestSeqRef.current = nextSeq
      activeEmailRef.current = normalized
      sendOtpMutation.mutate({
        email: normalized,
        seq: nextSeq,
        isResend: false,
      })
    },
    [sendOtpMutation],
  )

  const handleEmailInputChange = useCallback(
    (rawValue: string) => {
      const normalized = normalizeRecoveryEmail(rawValue)
      setEmailDraft(rawValue)
      if (activeEmailRef.current && normalized !== activeEmailRef.current) {
        requestSeqRef.current += 1
        actionLockRef.current = false
        pendingResetPayloadRef.current = null
        activeEmailRef.current = normalized
        setChallenge(null)
      }
      if (errorBanner) {
        setErrorBanner(null)
      }
    },
    [errorBanner],
  )

  const handleReturnToEmailStep = useCallback(() => {
    if (isStep2Busy) return
    requestSeqRef.current += 1
    actionLockRef.current = false
    pendingResetPayloadRef.current = null
    activeEmailRef.current = ''
    setChallenge(null)
    setErrorBanner(null)
    setResendNotice(null)
    setShowSuccessToast(false)
    setResetFormKey((prev) => prev + 1)
    setStep('email')
    resetPasswordMutation.reset()
    sendOtpMutation.reset()
    clearSettledRecoveryMutations()
  }, [
    clearSettledRecoveryMutations,
    isStep2Busy,
    resetPasswordMutation,
    sendOtpMutation,
  ])

  const handleResendOtp = useCallback(() => {
    if (!challenge || actionLockRef.current || isStep2Busy || resendRemainingSeconds > 0) return
    actionLockRef.current = true
    pendingResetPayloadRef.current = null
    resetPasswordMutation.reset()
    clearSettledRecoveryMutations()
    const nextSeq = requestSeqRef.current + 1
    requestSeqRef.current = nextSeq
    activeEmailRef.current = challenge.email
    setErrorBanner(null)
    setResendNotice(null)
    sendOtpMutation.mutate({
      email: challenge.email,
      seq: nextSeq,
      isResend: true,
    })
  }, [
    challenge,
    clearSettledRecoveryMutations,
    isStep2Busy,
    resendRemainingSeconds,
    resetPasswordMutation,
    sendOtpMutation,
  ])

  const handleResetSubmit = useCallback(
    (fields: ForgotPasswordResetFields) => {
      if (!challenge || actionLockRef.current || isStep2Busy) return
      actionLockRef.current = true
      pendingResetPayloadRef.current = {
        otpCode: fields.otpCode,
        newPassword: fields.newPassword,
      }
      const nextSeq = requestSeqRef.current + 1
      requestSeqRef.current = nextSeq
      setErrorBanner(null)
      setResendNotice(null)
      resetPasswordMutation.mutate({
        email: challenge.email,
        seq: nextSeq,
      })
    },
    [challenge, isStep2Busy, resetPasswordMutation],
  )

  const isExpiredStep2 =
    step === 'reset' && Boolean(challenge) && ttlRemainingSeconds === 0
  const hasStep2ErrorState =
    step === 'reset' && (Boolean(errorBanner) || isExpiredStep2)

  const activeErrorBanner: RecoveryErrorBanner | null =
    errorBanner ??
    (isExpiredStep2
      ? {
          title: 'Mã xác thực đã hết hạn',
          message:
            'Phiên xác thực OTP đã hết thời gian hiệu lực. Vui lòng tạo yêu cầu gửi lại mã OTP mới hoặc nhập địa chỉ email khác.',
        }
      : null)

  const progressWidth = step === 'email' ? 'w-1/2' : 'w-full'

  return (
    <AuthLayout variant="recovery">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            variant="success"
            title="Đặt lại mật khẩu thành công"
            message="Bạn có thể đăng nhập bằng mật khẩu mới."
            onClose={() => setShowSuccessToast(false)}
          />
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden relative">
        <div className="h-1.5 w-full bg-[#e6eeff]">
          <div
            className={`h-full bg-[#d95f00] transition-all duration-500 ${progressWidth}`}
            id="top-progress-bar"
          />
        </div>

        <div className="p-6 md:p-9">
          <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-[#e6eeff]">
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded p-0.5 transition-colors"
            >
              <div className="w-10 h-10 rounded bg-[#131b2e] flex items-center justify-center text-white shrink-0">
                <Truck size={22} aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-sora text-xl font-semibold text-[#0d1c2e] uppercase tracking-tight">
                    SmartTruck
                  </span>
                  <span className="bg-[#e6eeff] text-[#45464d] text-[10px] font-inter tracking-[0.06em] px-1.5 py-0.5 rounded font-semibold uppercase">
                    Hub
                  </span>
                </div>
                <p className="font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d]">
                  HỆ THỐNG BÃI ĐỖ &amp; ĐIỀU PHỐI XE TẢI
                </p>
              </div>
            </Link>

            <div className="hidden sm:flex flex-col items-end font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d]">
              <span className="flex items-center gap-1.5 font-medium text-[#0d1c2e]">
                <span
                  className="w-2 h-2 rounded-full bg-[#d95f00]"
                  aria-hidden="true"
                />
                KHÔI PHỤC TÀI KHOẢN
              </span>
              <span className="text-[11px] opacity-80">
                XÁC THỰC QUA EMAIL OTP
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e6eeff] text-[#45464d] font-inter text-xs leading-4 font-medium tracking-[0.06em] mb-2">
              <KeyRound size={14} aria-hidden="true" />
              <span>MÃ MÀN HÌNH: SCR-012</span>
            </div>
            <h1 className="font-sora text-3xl md:text-4xl font-bold text-[#0d1c2e] tracking-tight mb-2">
              Khôi Phục Mật Khẩu
            </h1>
            <p className="text-sm text-[#45464d] leading-relaxed">
              Quy trình tự phục vụ 2 bước bằng mã OTP xác thực qua email để đặt
              lại mật khẩu đăng nhập tài khoản SmartTruck Hub.
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-2 mb-8 bg-[#eff4ff] p-1.5 rounded-lg"
            role="list"
            aria-label="Các bước khôi phục mật khẩu"
          >
            <div
              role="listitem"
              aria-current={step === 'email' ? 'step' : undefined}
              className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded transition-all duration-300 ${
                step === 'email'
                  ? 'bg-white shadow-xs'
                  : 'bg-[#eff4ff] opacity-90'
              }`}
              id="stepper-step-1"
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold shrink-0 ${
                  step === 'email'
                    ? 'bg-[#d95f00] text-white'
                    : 'bg-[#e6eeff] text-[#0d1c2e]'
                }`}
                id="step-1-badge"
              >
                {step === 'email' ? (
                  '1'
                ) : (
                  <Check size={16} aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-inter text-[10px] font-medium text-[#45464d] uppercase tracking-wider">
                  BƯỚC 1
                </p>
                <p
                  className={`text-xs text-[#0d1c2e] truncate ${
                    step === 'email' ? 'font-semibold' : 'font-medium'
                  }`}
                  id="step-1-text"
                >
                  Xác Nhận Email
                </p>
              </div>
            </div>

            <div
              role="listitem"
              aria-current={step === 'reset' ? 'step' : undefined}
              className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded transition-all duration-300 ${
                step === 'reset'
                  ? 'bg-white shadow-xs'
                  : step === 'success'
                    ? 'bg-[#eff4ff] opacity-90'
                    : 'text-[#45464d] opacity-75'
              }`}
              id="stepper-step-2"
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold shrink-0 ${
                  hasStep2ErrorState
                    ? 'bg-[#ba1a1a] text-white'
                    : step === 'reset'
                      ? 'bg-[#d95f00] text-white'
                      : step === 'success'
                        ? 'bg-[#e6eeff] text-[#0d1c2e]'
                        : 'bg-[#e6eeff] text-[#45464d]'
                }`}
                id="step-2-badge"
              >
                {step === 'success' ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  '2'
                )}
              </div>
              <div className="min-w-0">
                <p className="font-inter text-[10px] font-medium text-[#45464d] uppercase tracking-wider">
                  BƯỚC 2
                </p>
                <p
                  className={`text-xs truncate ${
                    hasStep2ErrorState
                      ? 'text-[#ba1a1a] font-semibold'
                      : step === 'reset'
                        ? 'text-[#0d1c2e] font-semibold'
                        : step === 'success'
                          ? 'text-[#0d1c2e] font-medium'
                          : 'text-[#45464d]'
                  }`}
                  id="step-2-text"
                >
                  OTP &amp; Đặt Mật Khẩu
                </p>
              </div>
            </div>
          </div>

          {activeErrorBanner && step !== 'success' && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-lg bg-[#e6eeff] text-[#0d1c2e] border-l-4 border-[#ba1a1a]"
              id="error-notification"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  size={20}
                  className="text-[#ba1a1a] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold text-[#ba1a1a]"
                    id="error-title"
                  >
                    {activeErrorBanner.title}
                  </p>
                  <p
                    className="text-sm text-[#45464d] mt-1 leading-relaxed"
                    id="error-desc"
                  >
                    {activeErrorBanner.status
                      ? `Mã lỗi ${activeErrorBanner.status}: `
                      : ''}
                    {activeErrorBanner.message}
                  </p>

                  {step === 'email' && emailDraft.trim().length > 0 && (
                    <div className="mt-2.5 flex items-center gap-4">
                      <button
                        type="button"
                        disabled={isSendingInitialOtp}
                        onClick={() =>
                          handleEmailSubmit({
                            email: normalizeRecoveryEmail(emailDraft),
                          })
                        }
                        className="font-inter text-xs leading-4 tracking-[0.06em] text-[#d95f00] hover:underline font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <RefreshCw size={14} aria-hidden="true" />
                        <span>Thử gửi lại</span>
                      </button>
                    </div>
                  )}

                  {step === 'reset' && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        disabled={isStep2Busy || resendRemainingSeconds > 0}
                        onClick={handleResendOtp}
                        className="font-inter text-xs leading-4 tracking-[0.06em] text-[#d95f00] hover:underline font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
                      >
                        <RefreshCw size={14} aria-hidden="true" />
                        <span>
                          {isResendingOtp
                            ? 'Đang gửi lại mã…'
                            : resendRemainingSeconds > 0
                              ? `Gửi lại mã ngay (${resendRemainingSeconds}s)`
                              : 'Gửi lại mã ngay'}
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={isStep2Busy}
                        onClick={handleReturnToEmailStep}
                        className="font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d] hover:text-[#0d1c2e] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm disabled:opacity-50 cursor-pointer"
                      >
                        Nhập email khác
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'email' && (
            <ForgotPasswordEmailForm
              initialEmail={emailDraft}
              isPending={isSendingInitialOtp}
              onSubmitEmail={handleEmailSubmit}
              onEmailChange={handleEmailInputChange}
            />
          )}

          {step === 'reset' && challenge && (
            <ForgotPasswordResetForm
              key={resetFormKey}
              email={challenge.email}
              ttlRemainingSeconds={ttlRemainingSeconds}
              resendRemainingSeconds={resendRemainingSeconds}
              isResetPending={isResettingPassword}
              isResendPending={isResendingOtp}
              resendNotice={resendNotice}
              resendSignal={resendSignal}
              onSubmitReset={handleResetSubmit}
              onResendOtp={handleResendOtp}
              onChangeEmail={handleReturnToEmailStep}
            />
          )}

          {step === 'success' && (
            <section
              role="status"
              aria-live="polite"
              className="py-8 text-center space-y-4"
              id="state-success"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[#e6eeff] flex items-center justify-center text-[#d95f00]">
                <LockOpen size={34} aria-hidden="true" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="font-sora text-2xl md:text-3xl font-semibold text-[#0d1c2e]">
                  Khôi Phục Thành Công!
                </h2>
                <p className="text-sm text-[#45464d] leading-relaxed">
                  Mật khẩu mới của bạn đã được cập nhật thành công trên hệ thống
                  SmartTruck Hub. Bạn có thể sử dụng mật khẩu mới để đăng nhập
                  ngay bây giờ.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-9 h-12 rounded bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>Đăng Nhập Ngay</span>
                </Link>
              </div>
            </section>
          )}

          <div className="mt-8 pt-4 border-t border-[#e6eeff] flex flex-col sm:flex-row items-center justify-between gap-2 text-[#45464d]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d1c2e] hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Quay lại trang Đăng Nhập</span>
            </Link>
            <Link
              to="/register"
              className="font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d] hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
            >
              Chưa có tài khoản? Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 px-2 font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d]">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-[#d95f00]"
            aria-hidden="true"
          />
          <span>QUY TRÌNH ĐẶT LẠI MẬT KHẨU BẢO MẬT 2 BƯỚC</span>
        </div>
        <span>SMARTTRUCK HUB · SCR-012</span>
      </div>
    </AuthLayout>
  )
}

