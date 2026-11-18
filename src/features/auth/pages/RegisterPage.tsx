import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, type FieldErrors } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, Store, Truck } from 'lucide-react'
import type { AuthFields } from '../model/authFields'
import {
  cleanLegacyRegisterDraftStorage,
  getRegistrationDefaults,
  hasProtectedRegistrationData,
  isRegistrationRole,
  ROLE_LABELS,
  type RegistrationRole,
} from '../model/registrationLifecycle'
import { BankField } from '../components/BankField'
import {
  requestEmailOtp,
  verifyRegisterOtp,
} from '../api/emailOtp'
import { errorMessage, sendData } from '@/shared/api/resources'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Dialog } from '@/shared/components/Dialog'
import { Select, type SelectOption } from '@/shared/components/Select'
import { control, Notice } from '@/shared/components/Workspace'

const ROLE_OPTIONS: SelectOption[] = [
  {
    value: 'DRIVER',
    label: 'Tài xế',
    description: 'Tìm kiếm và đặt bến bãi đỗ xe',
    icon: <Truck size={18} className="text-[#d95f00] shrink-0" />,
  },
  {
    value: 'MERCHANT',
    label: 'Chủ bãi',
    description: 'Quản lý bãi đỗ và điều phối doanh thu',
    icon: <Store size={18} className="text-[#d95f00] shrink-0" />,
  },
]

const MAGIC_LINK_PARAMS = ['email', 'otpCode', 'otp', 'autoVerify']

export function RegisterPage({ mode = 'register' }: { mode?: 'login' | 'register' | 'forgot' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [magicLinkNotice, setMagicLinkNotice] = useState<string | null>(null)

  const form = useForm<AuthFields>({
    defaultValues: getRegistrationDefaults('DRIVER'),
    mode: mode === 'register' ? 'onTouched' : 'onSubmit',
  })
  const { reset: resetForm, clearErrors, setValue } = form
  const emailValue = (form.watch('email') ?? '').trim().toLowerCase()
  const currentOtpCode = (form.watch('otpCode') ?? '').trim()
  const selectedRole = form.watch('role')
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  type RegisterStepKey = 'info' | 'bank' | 'email' | 'password'
  const [registerStepKey, setRegisterStepKey] = useState<RegisterStepKey>('info')
  const [fieldToFocus, setFieldToFocus] = useState<keyof AuthFields | null>(null)
  const [isOtpFocused, setIsOtpFocused] = useState(false)
  useEffect(() => {
    if (fieldToFocus) {
      form.setFocus(fieldToFocus)
      setFieldToFocus(null)
    }
  }, [fieldToFocus, registerStepKey, form])

  // Role change confirmation & session tracking
  const [pendingRole, setPendingRole] = useState<RegistrationRole | null>(null)
  const [isConfirmRoleDialogOpen, setIsConfirmRoleDialogOpen] = useState(false)
  const [roleChangeAnnouncement, setRoleChangeAnnouncement] = useState<string | null>(null)
  const shouldFocusFullNameAfterCloseRef = useRef(false)
  const pendingFocusRafRef = useRef<number>(0)
  const cancelRoleBtnRef = useRef<HTMLButtonElement>(null)

  // Lifecycle generations & request IDs
  const sessionGenerationRef = useRef(1)
  const navigationIntakeIdRef = useRef(0)
  const activeSendRequestIdRef = useRef(0)
  const activeVerifyRequestIdRef = useRef(0)
  const activeSubmitRequestIdRef = useRef(0)

  // Intake tracking
  const consumedThisUrlRef = useRef(false)
  const pendingIntakeRef = useRef<{
    email: string
    otpCode: string
    isAutoVerify: boolean
  } | null>(null)

  // Proofs & Sources (memory only)
  const sentOtpProofRef = useRef<{
    generation: number
    requestId: number
    email: string
  } | null>(null)

  const linkOtpSourceRef = useRef<{
    generation: number
    intakeId: number
    email: string
    otpCode: string
  } | null>(null)

  const verifiedProofRef = useRef<{
    generation: number
    email: string
    otpCode: string
  } | null>(null)

  // Clean legacy registration draft if present in sessionStorage
  useEffect(() => {
    if (mode !== 'register') return
    cleanLegacyRegisterDraftStorage()
  }, [mode])

  useEffect(() => {
    return () => {
      if (pendingFocusRafRef.current) {
        cancelAnimationFrame(pendingFocusRafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!countdown) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])



  const registerSteps =
    selectedRole === 'MERCHANT'
      ? [
          { key: 'info' as const, label: 'Cá nhân', stepNumber: 1 },
          { key: 'bank' as const, label: 'Ngân hàng', stepNumber: 2 },
          { key: 'email' as const, label: 'Xác thực', stepNumber: 3 },
          { key: 'password' as const, label: 'Mật khẩu', stepNumber: 4 },
        ]
      : [
          { key: 'info' as const, label: 'Cá nhân', stepNumber: 1 },
          { key: 'email' as const, label: 'Xác thực', stepNumber: 2 },
          { key: 'password' as const, label: 'Mật khẩu', stepNumber: 3 },
        ]

  const currentStepNumber =
    registerSteps.find((s) => s.key === registerStepKey)?.stepNumber ?? 1
  const totalSteps = registerSteps.length
  const progressPercent = Math.round((currentStepNumber / totalSteps) * 100)

  const title =
    mode === 'login'
      ? 'Chào mừng trở lại.'
      : mode === 'register'
        ? 'Bắt đầu hành trình mới.'
        : 'Khôi phục quyền truy cập.'

  const otp = useMutation<
    { expiresInSeconds: number; resendAfterSeconds: number; email: string },
    Error,
    { generation: number; requestId: number; email: string }
  >({
    mutationFn: async ({ email }) => {
      if (mode === 'register' && email && email.length > 100) {
        throw new Error('Email không được vượt quá 100 ký tự.')
      }
      const valid = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      if (!valid) {
        throw new Error('Nhập email hợp lệ để nhận mã.')
      }
      return requestEmailOtp(
        mode === 'register' ? 'register' : 'forgot',
        email.toLowerCase(),
      )
    },
    onMutate: () => {
      setSent(false)
      sentOtpProofRef.current = null
      linkOtpSourceRef.current = null
      verifiedProofRef.current = null
      form.setValue('otpCode', '')
      form.clearErrors(['email', 'otpCode'])
    },
    onSuccess: (data, variables) => {
      if (
        variables.generation !== sessionGenerationRef.current ||
        variables.requestId !== activeSendRequestIdRef.current ||
        variables.email !== (form.getValues('email') ?? '').trim().toLowerCase()
      ) {
        return
      }
      setSent(true)
      sentOtpProofRef.current = {
        generation: variables.generation,
        requestId: variables.requestId,
        email: variables.email,
      }
      setCountdown(Math.max(1, data.resendAfterSeconds || data.expiresInSeconds || 60))
    },
    onError: (_error, variables) => {
      if (
        variables.generation !== sessionGenerationRef.current ||
        variables.requestId !== activeSendRequestIdRef.current ||
        variables.email !== (form.getValues('email') ?? '').trim().toLowerCase()
      ) {
        return
      }
    },
  })

  const isSentValid =
    sent &&
    Boolean(
      sentOtpProofRef.current &&
        sentOtpProofRef.current.generation === sessionGenerationRef.current &&
        sentOtpProofRef.current.email === emailValue,
    )

  const isLinkEligible = Boolean(
    linkOtpSourceRef.current &&
      linkOtpSourceRef.current.generation === sessionGenerationRef.current &&
      linkOtpSourceRef.current.email === emailValue &&
      linkOtpSourceRef.current.otpCode === currentOtpCode,
  )

  const isOtpEligible = isSentValid || isLinkEligible

  const isOtpVerified = Boolean(
    verifiedProofRef.current &&
      verifiedProofRef.current.generation === sessionGenerationRef.current &&
      verifiedProofRef.current.email === emailValue &&
      verifiedProofRef.current.otpCode === currentOtpCode,
  )

  const verifyOtp = useMutation<
    { email: string; otpCode: string },
    Error,
    {
      generation: number
      requestId: number
      intakeId?: number
      email: string
      otpCode: string
      isAutoVerify?: boolean
    }
  >({
    mutationFn: async (variables) => {
      await verifyRegisterOtp(variables.email, variables.otpCode)
      return { email: variables.email, otpCode: variables.otpCode }
    },
    onSuccess: (_data, variables) => {
      if (
        variables.generation !== sessionGenerationRef.current ||
        variables.requestId !== activeVerifyRequestIdRef.current ||
        (variables.intakeId && variables.intakeId !== navigationIntakeIdRef.current) ||
        variables.email !== (form.getValues('email') ?? '').trim().toLowerCase() ||
        variables.otpCode !== (form.getValues('otpCode') ?? '').trim()
      ) {
        return
      }
      verifiedProofRef.current = {
        generation: variables.generation,
        email: variables.email,
        otpCode: variables.otpCode,
      }
      if (variables.isAutoVerify) {
        const values = form.getValues()
        const hasFullName = Boolean(values.fullName && values.fullName.trim().length >= 2)
        const hasPhone = Boolean(values.phone && /^(0|\+84)[35789][0-9]{8}$/.test(values.phone.replace(/\s/g, '')))
        const isMerchant = values.role === 'MERCHANT'
        const hasBank = isMerchant ? Boolean(values.bankName && values.bankAccountNum && /^\d{6,25}$/.test(values.bankAccountNum)) : true
        const hasCitizen = isMerchant ? Boolean(values.citizenId && /^(?:[0-9]{9}|[0-9]{12})$/.test(values.citizenId.trim())) : true

        if (hasFullName && hasPhone && hasCitizen && hasBank) {
          setRegisterStepKey('password')
          setMagicLinkNotice(
            'Email đã được xác thực thành công qua liên kết! Vui lòng thiết lập mật khẩu.',
          )
        } else {
          if (!hasFullName || !hasPhone || (isMerchant && !hasCitizen)) {
            setRegisterStepKey('info')
          } else if (isMerchant && !hasBank) {
            setRegisterStepKey('bank')
          }
          setMagicLinkNotice(
            'Email đã được xác thực qua liên kết. Vui lòng hoàn tất thông tin đăng ký.',
          )
        }
      } else {
        setRegisterStepKey('password')
      }
    },
    onError: (error, variables) => {
      if (
        variables.generation !== sessionGenerationRef.current ||
        variables.requestId !== activeVerifyRequestIdRef.current ||
        (variables.intakeId && variables.intakeId !== navigationIntakeIdRef.current) ||
        variables.email !== (form.getValues('email') ?? '').trim().toLowerCase() ||
        variables.otpCode !== (form.getValues('otpCode') ?? '').trim()
      ) {
        return
      }
      if (variables.isAutoVerify) {
        setRegisterStepKey('info')
      } else {
        form.setError('otpCode', { message: errorMessage(error) }, { shouldFocus: true })
      }
    },
  })

  const submit = useMutation<
    void,
    Error,
    { generation: number; requestId: number; data: AuthFields }
  >({
    mutationFn: async ({ data }) => {
      if (mode === 'register') {
        if (data.confirmPassword && data.confirmPassword !== data.password) {
          throw new Error('Mật khẩu xác nhận không trùng khớp.')
        }
        await sendData('post', '/api/v1/auth/register', {
          phone: data.phone,
          password: data.password,
          email: data.email.trim().toLowerCase(),
          role: data.role,
          fullName: data.fullName.trim(),
          citizenId: data.citizenId?.trim() ?? '',
          otpCode: data.otpCode,
          ...(data.role === 'MERCHANT' && data.bankName
            ? {
                bankName: data.bankName,
                bankAccountNum: data.bankAccountNum,
              }
            : {}),
        })
      } else {
        await sendData('post', '/api/v1/auth/forgot-password/reset', {
          email: data.email.trim().toLowerCase(),
          otpCode: data.otpCode,
          newPassword: data.newPassword,
        })
      }
    },
    onError: (error, variables) => {
      if (
        variables.generation !== sessionGenerationRef.current ||
        variables.requestId !== activeSubmitRequestIdRef.current
      ) {
        return
      }
      const msg = errorMessage(error)
      if (/số điện thoại|phone/i.test(msg)) {
        setRegisterStepKey('info')
        form.setError('phone', { message: msg })
        setFieldToFocus('phone')
        return
      }
      if (/cccd|cmnd|citizen/i.test(msg)) {
        setRegisterStepKey('info')
        form.setError('citizenId', { message: msg })
        setFieldToFocus('citizenId')
        return
      }
      if (/email/i.test(msg)) {
        setRegisterStepKey('email')
        form.setError('email', { message: msg })
        setFieldToFocus('email')
        return
      }
      // Registration rechecks expiry and consumes the code atomically with account creation.
      if (mode === 'register' && /otp/i.test(msg)) {
        setRegisterStepKey('email')
        setFieldToFocus('otpCode')
      }
    },
  })

  const { reset: resetOtp } = otp
  const { mutate: verifyCode, reset: resetVerifyOtp } = verifyOtp
  const { reset: resetSubmit } = submit

  const handleFullReset = useCallback(
    (targetRole: RegistrationRole) => {
      sessionGenerationRef.current += 1
      activeSendRequestIdRef.current += 1
      activeVerifyRequestIdRef.current += 1
      activeSubmitRequestIdRef.current += 1

      sentOtpProofRef.current = null
      linkOtpSourceRef.current = null
      verifiedProofRef.current = null
      pendingIntakeRef.current = null

      if (pendingFocusRafRef.current) {
        cancelAnimationFrame(pendingFocusRafRef.current)
        pendingFocusRafRef.current = 0
      }
      shouldFocusFullNameAfterCloseRef.current = false

      resetForm(getRegistrationDefaults(targetRole))
      clearErrors()

      setRegisterStepKey('info')
      setSent(false)
      setCountdown(0)
      setMagicLinkNotice(null)
      setShowPassword({})
      setIsOtpFocused(false)
      setFieldToFocus(null)

      setIsConfirmRoleDialogOpen(false)
      setPendingRole(null)
      setRoleChangeAnnouncement(null)

      resetOtp()
      resetVerifyOtp()
      resetSubmit()
    },
    [resetForm, clearErrors, resetOtp, resetVerifyOtp, resetSubmit],
  )

  useEffect(() => {
    if (mode !== 'register') return
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        handleFullReset('DRIVER')
      }
    }
    const handlePopState = () => {
      handleFullReset('DRIVER')
    }
    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [mode, handleFullReset])

  const handleRoleChange = (val: string) => {
    if (submit.isPending || verifyOtp.isPending) return
    if (!isRegistrationRole(val)) return

    const currentRole = form.getValues('role')
    if (val === currentRole) return

    const hasData = hasProtectedRegistrationData(form.getValues(), {
      sent: isSentValid,
      isVerified: isOtpVerified,
      hasParamOtp: Boolean(searchParams.get('otpCode') || searchParams.get('otp')),
      hasLinkOtp: Boolean(linkOtpSourceRef.current),
    })

    if (!hasData) {
      handleFullReset(val)
      return
    }

    setPendingRole(val)
    setIsConfirmRoleDialogOpen(true)
  }

  const handleCancelRoleChange = () => {
    setIsConfirmRoleDialogOpen(false)
    setPendingRole(null)
    pendingFocusRafRef.current = requestAnimationFrame(() => {
      const trigger = document.getElementById('auth-role-trigger')
      trigger?.focus()
    })
  }

  const handleConfirmRoleChange = () => {
    if (!pendingRole) return
    const targetRole = pendingRole
    handleFullReset(targetRole)
    setRoleChangeAnnouncement(`Đã chuyển sang ${ROLE_LABELS[targetRole]}. Vui lòng nhập thông tin đăng ký mới.`)
    shouldFocusFullNameAfterCloseRef.current = true
    setIsConfirmRoleDialogOpen(false)
    setPendingRole(null)
  }

  const handleDialogAfterClose = () => {
    if (shouldFocusFullNameAfterCloseRef.current) {
      shouldFocusFullNameAfterCloseRef.current = false
      pendingFocusRafRef.current = requestAnimationFrame(() => {
        form.setFocus('fullName')
      })
    }
  }

  const applyLinkIntake = useCallback(
    (normalizedEmail: string, trimmedOtp: string, isAutoVerify: boolean) => {
      const currentIntakeId = ++navigationIntakeIdRef.current
      activeSendRequestIdRef.current += 1
      activeVerifyRequestIdRef.current += 1

      setSent(false)
      setCountdown(0)
      sentOtpProofRef.current = null
      verifiedProofRef.current = null
      setMagicLinkNotice(null)
      resetOtp()
      resetVerifyOtp()
      resetSubmit()

      setValue('password', '')
      setValue('confirmPassword', '')
      clearErrors(['password', 'confirmPassword', 'email', 'otpCode'])

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      const isValidOtp = /^\d{6}$/.test(trimmedOtp)

      if (isValidEmail) {
        setValue('email', normalizedEmail)
      }
      if (isValidOtp) {
        setValue('otpCode', trimmedOtp)
      }

      if (isValidEmail && isValidOtp) {
        linkOtpSourceRef.current = {
          email: normalizedEmail,
          otpCode: trimmedOtp,
          generation: sessionGenerationRef.current,
          intakeId: currentIntakeId,
        }
      } else {
        linkOtpSourceRef.current = null
      }

      if (isAutoVerify && isValidEmail && isValidOtp) {
        const reqId = ++activeVerifyRequestIdRef.current
        verifyCode({
          generation: sessionGenerationRef.current,
          requestId: reqId,
          intakeId: currentIntakeId,
          email: normalizedEmail,
          otpCode: trimmedOtp,
          isAutoVerify: true,
        })
      } else {
        setRegisterStepKey('info')
      }
    },
    [clearErrors, setValue, resetOtp, resetVerifyOtp, resetSubmit, verifyCode],
  )

  // Support Magic Link URL pre-filling and auto-verification (navigation-based intake)
  useEffect(() => {
    if (mode !== 'register') return

    const rawEmail = searchParams.get('email')
    const rawOtp = searchParams.get('otpCode') || searchParams.get('otp')
    const isAutoVerify = searchParams.get('autoVerify') === 'true'

    const hasLinkParams = MAGIC_LINK_PARAMS.some((param) => searchParams.has(param))
    if (!hasLinkParams) {
      consumedThisUrlRef.current = false
      return
    }

    if (consumedThisUrlRef.current) return
    consumedThisUrlRef.current = true

    // Remove email, otpCode, otp, autoVerify from URL search params without reload, preserving non-sensitive query params and hash
    const cleanParams = new URLSearchParams(searchParams)
    for (const param of MAGIC_LINK_PARAMS) cleanParams.delete(param)
    const cleanSearch = cleanParams.toString()
    navigate(
      {
        pathname: location.pathname,
        search: cleanSearch ? `?${cleanSearch}` : '',
        hash: location.hash,
      },
      { replace: true },
    )

    const normalizedEmail = (rawEmail ?? '').trim().toLowerCase()
    const trimmedOtp = (rawOtp ?? '').trim()

    if (!normalizedEmail && !trimmedOtp) return

    if (submit.isPending) {
      pendingIntakeRef.current = {
        email: normalizedEmail,
        otpCode: trimmedOtp,
        isAutoVerify,
      }
      return
    }

    applyLinkIntake(normalizedEmail, trimmedOtp, isAutoVerify)
  }, [mode, searchParams, navigate, location.pathname, location.hash, submit.isPending, applyLinkIntake])

  useEffect(() => {
    if (submit.isPending) return
    if (submit.isSuccess) {
      pendingIntakeRef.current = null
      return
    }
    if (submit.isError && pendingIntakeRef.current) {
      const intake = pendingIntakeRef.current
      pendingIntakeRef.current = null
      applyLinkIntake(intake.email, intake.otpCode, intake.isAutoVerify)
    }
  }, [submit.isPending, submit.isSuccess, submit.isError, applyLinkIntake])

  // Clear registration draft on successful account registration
  useEffect(() => {
    if (submit.isSuccess) {
      cleanLegacyRegisterDraftStorage()
    }
  }, [submit.isSuccess])

  const handleSendOtp = () => {
    if (otp.isPending || verifyOtp.isPending || countdown > 0) return
    activeVerifyRequestIdRef.current += 1
    verifyOtp.reset()
    setMagicLinkNotice(null)
    const email = (form.getValues('email') ?? '').trim().toLowerCase()
    const reqId = ++activeSendRequestIdRef.current
    otp.mutate({
      generation: sessionGenerationRef.current,
      requestId: reqId,
      email,
    })
  }

  const advanceRegisterStep = async () => {
    if (verifyOtp.isPending || submit.isPending) return
    if (registerStepKey === 'info') {
      const valid = await form.trigger(['fullName', 'phone', 'citizenId'], { shouldFocus: true })
      if (!valid) return

      setRegisterStepKey(selectedRole === 'MERCHANT' ? 'bank' : 'email')
    } else if (registerStepKey === 'bank') {
      const valid = await form.trigger(['bankName', 'bankAccountNum'], { shouldFocus: true })
      if (valid) setRegisterStepKey('email')
    } else if (registerStepKey === 'email') {
      if (!isOtpEligible && !isOtpVerified) {
        form.setError('email', { message: 'Vui lòng gửi mã OTP thành công đến email này trước khi tiếp tục.' })
        return
      }
      if (otp.isPending) return

      const valid = await form.trigger(['email', 'otpCode'], { shouldFocus: true })
      if (!valid) return

      if (isOtpVerified) {
        setRegisterStepKey('password')
        return
      }

      submit.reset()
      const reqId = ++activeVerifyRequestIdRef.current
      verifyOtp.mutate({
        generation: sessionGenerationRef.current,
        requestId: reqId,
        email: emailValue,
        otpCode: currentOtpCode,
        isAutoVerify: false,
      })
    }
  }

  const showInvalidRegistrationStep = (errors: FieldErrors<AuthFields>) => {
    if (mode !== 'register') return
    const fields: (keyof AuthFields)[] = [
      'fullName', 'phone', 'citizenId', 'bankName', 'bankAccountNum',
      'email', 'otpCode', 'password', 'confirmPassword',
    ]
    const field = fields.find(name => errors[name])
    if (!field) return
    setRegisterStepKey(
      ['fullName', 'phone', 'citizenId'].includes(field) ? 'info'
        : ['bankName', 'bankAccountNum'].includes(field) ? 'bank'
          : ['email', 'otpCode'].includes(field) ? 'email' : 'password',
    )
    setFieldToFocus(field)
  }

  const input = (
    name: keyof AuthFields,
    label: string,
    type = 'text',
    options: Parameters<typeof form.register>[1] = {},
    placeholder?: string,
    hint?: string,
  ) => {
    const isPassword = type === 'password'
    return (
      <div className="space-y-1.5">
        <label htmlFor={`auth-${name}`} className="block text-sm sm:text-base font-semibold text-black">
          {label}
        </label>
        <div className="relative">
          <input
            id={`auth-${name}`}
            className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-black font-normal placeholder:font-normal placeholder:text-slate-400 hover:border-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 rounded-xl px-4 py-3 shadow-2xs transition-colors`}
            disabled={submit.isPending}
            aria-required={Boolean(options.required ?? (name !== 'citizenId' && name !== 'confirmPassword'))}
            aria-invalid={Boolean(form.formState.errors[name])}
            aria-describedby={[hint ? `auth-${name}-hint` : '', form.formState.errors[name] ? `auth-${name}-error` : ''].filter(Boolean).join(' ') || undefined}
            inputMode={name === 'citizenId' || name === 'bankAccountNum' ? 'numeric' : type === 'tel' ? 'tel' : undefined}
            type={isPassword && showPassword[name] ? 'text' : type}
            placeholder={placeholder}
            autoComplete={
              name === 'password' || name === 'confirmPassword'
                ? mode === 'login'
                  ? 'current-password'
                  : 'new-password'
                : name === 'newPassword'
                  ? 'new-password'
                  : name === 'otpCode'
                    ? 'one-time-code'
                    : name === 'phone'
                      ? 'tel'
                      : name === 'email'
                        ? 'email'
                        : name === 'fullName' ? 'name' : 'off'
            }
            {...form.register(name, {
              required: name !== 'citizenId' && name !== 'confirmPassword',
              ...options,
              ...(name === 'phone' ? { setValueAs: (value: string) => {
                const compact = (value ?? '').replace(/\s/g, '')
                return mode === 'register' && compact.startsWith('+84') ? `0${compact.slice(3)}` : compact
              } } : {}),
              ...(['fullName', 'citizenId', 'bankAccountNum'].includes(name) ? { setValueAs: (value: string) => (value ?? '').trim() } : {}),
            })}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg transition-colors cursor-pointer"
              onClick={() => setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))}
              aria-label={showPassword[name] ? (name === 'confirmPassword' ? 'Ẩn xác nhận mật khẩu' : 'Ẩn mật khẩu') : (name === 'confirmPassword' ? 'Hiện xác nhận mật khẩu' : 'Hiện mật khẩu')}
            >
              {showPassword[name] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {hint && <p id={`auth-${name}-hint`} className="text-xs leading-5 text-slate-600">{hint}</p>}
        {form.formState.errors[name] && (
          <span id={`auth-${name}-error`} role="alert" className="block text-xs text-red-700 font-normal">
            {form.formState.errors[name]?.message || 'Thông tin chưa hợp lệ.'}
          </span>
        )}
      </div>
    )
  }

  return (
    <AuthLayout>
      <div>
        {mode === 'register' && (
          <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                submit.isSuccess ? 'bg-gradient-to-r from-[#d95f00] to-emerald-500' : 'bg-[#d95f00]'
              }`}
              style={{ width: `${submit.isSuccess ? 100 : progressPercent}%` }}
              role="progressbar"
              aria-valuenow={submit.isSuccess ? 100 : progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Tiến trình đăng ký bước ${submit.isSuccess ? totalSteps : currentStepNumber} trên ${totalSteps}`}
            />
          </div>
        )}

        <div className="mb-3.5 sm:mb-4 flex flex-col items-center text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-sora text-lg sm:text-xl font-bold text-black mb-2 sm:mb-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xl p-1 transition-all hover:scale-105 group"
          >
            <img
              src="/image-smart-parking-hub.png"
              alt="Smart Parking Hub Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shrink-0 shadow-sm ring-1 ring-white/60 group-hover:shadow-md transition-all"
            />
            <span className="tracking-tight text-black font-bold text-lg sm:text-xl group-hover:text-[#d95f00] transition-colors">
              SMARTTRUCK HUB
            </span>
          </Link>
          {!submit.isSuccess && (
            <>
              <h1 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-black drop-shadow-xs">
                {title}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-black/75 font-normal">
                {mode === 'login'
                  ? 'Đăng nhập để tiếp tục công việc của bạn.'
                  : 'Thông tin được xác thực bởi hệ thống SmartTruck Hub.'}
              </p>
            </>
          )}
        </div>

        {submit.isSuccess && mode !== 'login' ? (
          <AuthSuccess
            mode={mode}
            registeredPhone={form.getValues('phone')}
            registeredEmail={form.getValues('email')}
            registeredFullName={form.getValues('fullName')}
            role={form.getValues('role')}
          />
        ) : (
          <form
            noValidate
            className="space-y-3.5 [&_input:not([role='combobox'])]:min-h-11 [&_input:not([role='combobox'])]:sm:min-h-12 [&_input:not([role='combobox'])]:text-sm [&_input:not([role='combobox'])]:sm:text-base [&_input:not([role='combobox'])]:rounded-xl [&_input:not([role='combobox'])]:px-3.5 [&_select]:min-h-11 [&_select]:sm:min-h-12 [&_select]:text-sm [&_select]:sm:text-base [&_select]:rounded-xl [&_select]:px-3.5 [&_label]:gap-1"
            onChange={() => { if (submit.isError) submit.reset() }}
            onSubmit={async (event) => {
              if (submit.isPending || verifyOtp.isPending) {
                event.preventDefault()
                return
              }
              if (mode === 'register' && registerStepKey !== 'password') {
                event.preventDefault()
                void advanceRegisterStep()
                return
              }
              if (mode === 'register' && (!isOtpVerified || otp.isPending)) {
                event.preventDefault()
                setRegisterStepKey('email')
                form.setError('email', {
                  message: 'Vui lòng gửi mã OTP thành công đến email này trước khi tiếp tục.',
                })
                return
              }
              void form.handleSubmit(
                (data) => {
                  const reqId = ++activeSubmitRequestIdRef.current
                  submit.mutate({
                    generation: sessionGenerationRef.current,
                    requestId: reqId,
                    data,
                  })
                },
                showInvalidRegistrationStep,
              )(event)
            }}
          >
            {verifyOtp.isError &&
              verifyOtp.variables?.isAutoVerify &&
              verifyOtp.variables.generation === sessionGenerationRef.current &&
              verifyOtp.variables.requestId === activeVerifyRequestIdRef.current &&
              verifyOtp.variables.intakeId === navigationIntakeIdRef.current &&
              verifyOtp.variables.email === emailValue &&
              verifyOtp.variables.otpCode === currentOtpCode && (
                <Notice error>{errorMessage(verifyOtp.error)}</Notice>
              )}
            {magicLinkNotice && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm mb-3">
                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{magicLinkNotice}</span>
              </div>
            )}
            {mode === 'register' && (
              <div
                className={`grid ${
                  selectedRole === 'MERCHANT' ? 'grid-cols-4' : 'grid-cols-3'
                } gap-1 p-1 bg-black/5 rounded-2xl border border-black/10 mb-4 transition-all duration-300 select-none`}
                role="list"
                aria-label="Các bước đăng ký tài khoản"
              >
                {registerSteps.map((s) => {
                  const isActive = registerStepKey === s.key
                  const isCompleted = s.stepNumber < currentStepNumber
                  return (
                    <div
                      key={s.key}
                      role="listitem"
                      aria-current={isActive ? 'step' : undefined}
                      className={`py-2 px-1 sm:px-2 text-[11px] sm:text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-black shadow-xs font-semibold scale-[1.02]'
                          : isCompleted
                            ? 'text-black/80 font-medium'
                            : 'text-black/60 font-normal'
                      }`}
                    >
                      <span
                        className={`flex size-4.5 sm:size-5 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#d95f00] text-white shadow-xs'
                            : isCompleted
                              ? 'bg-black/10 text-black font-semibold'
                              : 'bg-black/10 text-black'
                        }`}
                      >
                        {s.stepNumber}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* STEP 1: Vai trò & Thông tin cơ bản */}
            <div
              hidden={mode === 'register' && registerStepKey !== 'info'}
              className={
                mode === 'register' && registerStepKey !== 'info'
                  ? 'sr-only'
                  : 'space-y-4'
              }
            >
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label
                    id="auth-role-label"
                    htmlFor="auth-role"
                    className="block text-sm sm:text-base font-semibold text-black"
                  >
                    Bạn tham gia với vai trò
                  </label>
                  <Select
                    id="auth-role"
                    triggerAriaHidden={true}
                    value={form.watch('role')}
                    onChange={handleRoleChange}
                    disabled={submit.isPending || verifyOtp.isPending}
                    options={ROLE_OPTIONS}
                    variant="default"
                    size="lg"
                    triggerClassName="min-h-11 sm:min-h-12 text-sm sm:text-base bg-white border border-slate-300 text-black rounded-xl px-3.5 py-2.5 shadow-2xs hover:border-[#d95f00] hover:bg-orange-50/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 transition-all cursor-pointer font-normal"
                    dropdownClassName="border border-slate-200 shadow-xl rounded-xl z-50 bg-white"
                  />
                  <p id="auth-role-hint" className="text-xs text-slate-500 font-normal leading-relaxed mt-1">
                    Đổi vai trò sẽ xóa thông tin đã nhập. Tải lại trang sẽ bắt đầu đăng ký mới.
                  </p>
                </div>
              )}

              {mode === 'register' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  {input(
                    'fullName',
                    'Họ và tên',
                    'text',
                    {
                      required: 'Vui lòng nhập họ và tên.',
                      maxLength: { value: 100, message: 'Họ và tên không được vượt quá 100 ký tự.' },
                      validate: (val) =>
                        Boolean(val && val.trim().length >= 2) ||
                        'Họ và tên phải có ít nhất 2 ký tự.',
                    },
                    'Ví dụ: Nguyễn Văn Hùng',
                    'Bắt buộc · Từ 2 đến 100 ký tự.',
                  )}
                  {input(
                    'phone',
                    'Số điện thoại',
                    'tel',
                    {
                      required: 'Vui lòng nhập số điện thoại.',
                      pattern: {
                        value: /^(0|\+84)[35789][0-9]{8}$/,
                        message: 'Số điện thoại Việt Nam chưa hợp lệ (10 số, ví dụ: 0918239485).',
                      },
                    },
                    'Ví dụ: 0918239485',
                    'Bắt buộc · Số di động Việt Nam 10 số, chấp nhận đầu +84.',
                  )}
                </div>
              ) : mode !== 'forgot' ? (
                input(
                  'phone',
                  'Số điện thoại',
                  'tel',
                  {
                    required: 'Vui lòng nhập số điện thoại.',
                    pattern: {
                      value: /^(0|\+84)[35789][0-9]{8}$/,
                      message: 'Số điện thoại Việt Nam chưa hợp lệ (10 số, ví dụ: 0918239485).',
                    },
                  },
                  'Ví dụ: 0918239485',
                )
              ) : null}

              {mode === 'register' &&
                input(
                  'citizenId',
                  'CCCD / CMND',
                  'text',
                  {
                    required: selectedRole === 'MERCHANT' ? 'CCCD / CMND là bắt buộc đối với Chủ bãi xe.' : false,
                    pattern: {
                      value: selectedRole === 'MERCHANT' ? /^(?:[0-9]{9}|[0-9]{12})$/ : /^$|^(?:[0-9]{9}|[0-9]{12})$/,
                      message: 'CCCD / CMND phải gồm 9 hoặc 12 chữ số.',
                    },
                  },
                  'Ví dụ: 079123456789 (9 hoặc 12 số)',
                  selectedRole === 'MERCHANT' ? 'Bắt buộc với chủ bãi · Nhập đúng 9 hoặc 12 chữ số.' : 'Không bắt buộc với tài xế · Nếu nhập, phải gồm 9 hoặc 12 chữ số.',
                )}

              {mode === 'register' && (
                <button
                  type="button"
                  onClick={() => void advanceRegisterStep()}
                  className="inline-flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                  <span>
                    {selectedRole === 'MERCHANT'
                      ? 'Tiếp tục: Kết nối ngân hàng'
                      : 'Tiếp tục: Xác thực Email'}
                  </span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            {/* STEP 2: Kết nối tài khoản ngân hàng (Dành riêng cho Chủ bãi) */}
            {mode === 'register' && selectedRole === 'MERCHANT' && (
              <div
                hidden={registerStepKey !== 'bank'}
                className={
                  registerStepKey !== 'bank'
                    ? 'sr-only'
                    : 'space-y-4'
                }
              >
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/70 flex items-start gap-2.5 text-xs text-black">
                  <Store size={18} className="text-[#d95f00] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-black">Tài khoản nhận doanh thu cho Chủ bãi</p>
                    <p className="text-black/70 mt-0.5 font-normal">
                      Doanh thu đặt bãi đỗ sẽ được hệ thống SmartTruck Hub quyết toán về tài khoản này.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <BankField control={form.control} disabled={submit.isPending} />
                  {input(
                    'bankAccountNum',
                    'Số tài khoản ngân hàng',
                    'text',
                    {
                      required: 'Vui lòng nhập số tài khoản ngân hàng.',
                      pattern: { value: /^\d{6,25}$/, message: 'Số tài khoản ngân hàng phải gồm từ 6 đến 25 chữ số.' },
                    },
                    'Ví dụ: 19036789123456',
                  )}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRegisterStepKey('info')}
                    className="inline-flex min-h-12 sm:min-h-14 px-4 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm sm:text-base font-semibold text-black hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer shrink-0"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => void advanceRegisterStep()}
                    className="inline-flex min-h-12 sm:min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Tiếp tục: Xác thực Email</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 (hoặc 2 cho Tài xế): Xác thực Email & OTP */}
            <div
              hidden={mode === 'register' && registerStepKey !== 'email'}
              className={
                mode === 'register' && registerStepKey !== 'email'
                  ? 'sr-only'
                  : 'space-y-4'
              }
            >
              {mode !== 'login' && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="block text-sm sm:text-base font-semibold text-black">
                    Email nhận mã xác thực
                  </label>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="relative flex-1">
                      <input
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="Ví dụ: taixe.nguyen@gmail.com"
                        disabled={submit.isPending || otp.isPending || verifyOtp.isPending}
                        aria-invalid={Boolean(form.formState.errors.email)}
                        aria-describedby={form.formState.errors.email ? 'auth-email-error' : undefined}
                        className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-black font-normal placeholder:font-normal placeholder:text-slate-400 hover:border-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 rounded-xl px-4 py-3 shadow-2xs transition-colors w-full`}
                        {...form.register('email', {
                          required: 'Nhập email nhận mã xác thực.',
                          maxLength: mode === 'register' ? { value: 100, message: 'Email không được vượt quá 100 ký tự.' } : undefined,
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Nhập email hợp lệ để nhận mã.' },
                          onChange: () => {
                            activeVerifyRequestIdRef.current += 1
                            setMagicLinkNotice(null)
                            setSent(false)
                            setCountdown(0)
                            sentOtpProofRef.current = null
                            linkOtpSourceRef.current = null
                            verifiedProofRef.current = null
                            otp.reset()
                            verifyOtp.reset()
                            form.setValue('otpCode', '')
                            form.clearErrors(['email', 'otpCode'])
                          },
                        })}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label={
                        otp.isPending
                          ? 'Đang gửi…'
                          : countdown
                            ? `Gửi lại sau ${countdown}s`
                            : 'Gửi mã qua email'
                      }
                      disabled={otp.isPending || verifyOtp.isPending || countdown > 0}
                      onClick={handleSendOtp}
                      className="shrink-0 min-h-12 sm:min-h-14 px-3.5 sm:px-4 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-black hover:bg-orange-50 hover:border-[#d95f00] hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-50 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {otp.isPending ? (
                        <>
                          <LoaderCircle
                            className="animate-spin text-[#d95f00] shrink-0"
                            size={18}
                            aria-hidden="true"
                          />
                          <span className="text-[#d95f00] font-semibold">
                            Đang gửi mã…
                          </span>
                        </>
                      ) : countdown ? (
                        <span className="text-black/70 font-semibold">{countdown}s</span>
                      ) : (
                        <>
                          <span>Gửi mã OTP</span>
                          <ArrowRight size={14} className="text-[#d95f00]" />
                        </>
                      )}
                    </button>
                  </div>
                  {form.formState.errors.email && (
                    <span id="auth-email-error" role="alert" className="text-xs text-red-700 font-normal">
                      {form.formState.errors.email.message || 'Thông tin chưa hợp lệ.'}
                    </span>
                  )}
                </div>
              )}

              {(isOtpVerified || isSentValid || isLinkEligible) && (
                <div className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-surface p-3 sm:p-3.5 text-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d95f00] text-white">
                    <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-sora text-xs sm:text-sm font-semibold leading-5 text-black">
                      {mode === 'forgot'
                        ? 'Kiểm tra hộp thư của bạn'
                        : isOtpVerified
                          ? 'Email đã được xác thực thành công'
                          : isLinkEligible
                            ? 'Mã xác thực nhận từ liên kết'
                            : 'Mã xác thực đã được gửi'}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-black/70">
                      {mode === 'forgot' ? (
                        'Nếu email đã đăng ký, bạn sẽ nhận được mã. '
                      ) : isOtpVerified ? (
                        <>
                          Đã xác thực email{' '}
                          <strong className="break-all font-semibold text-black">
                            {emailValue}
                          </strong>
                          . Bạn có thể tiếp tục thiết lập mật khẩu.
                        </>
                      ) : isLinkEligible ? (
                        <>
                          Email{' '}
                          <strong className="break-all font-semibold text-black">
                            {emailValue}
                          </strong>{' '}
                          đã nhận mã từ liên kết. Chọn Tiếp tục để xác thực.
                        </>
                      ) : (
                        <>
                          Gửi đến{' '}
                          <strong className="break-all font-semibold text-black">
                            {emailValue}
                          </strong>
                          .{' '}
                        </>
                      )}
                      {!isOtpVerified && !isLinkEligible && 'Mã gồm 6 số, có hiệu lực 5 phút.'}
                    </p>
                  </div>
                </div>
              )}

              {mode !== 'login' && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-otpCode" className="block text-sm sm:text-base font-semibold text-black">
                    Mã xác thực email (6 số)
                  </label>
                  <div className="relative max-w-[360px] mx-auto py-1">
                    <input
                      id="auth-otpCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      disabled={verifyOtp.isPending || submit.isPending}
                      placeholder="123456"
                      aria-invalid={Boolean(form.formState.errors.otpCode)}
                      aria-describedby={form.formState.errors.otpCode ? 'auth-otpCode-error' : undefined}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer caret-transparent"
                      {...form.register('otpCode', {
                        onChange: () => {
                          activeVerifyRequestIdRef.current += 1
                          verifiedProofRef.current = null
                          linkOtpSourceRef.current = null
                          setMagicLinkNotice(null)
                          verifyOtp.reset()
                          form.clearErrors('otpCode')
                        },
                        required: 'Nhập mã OTP được gửi qua email.',
                        pattern: { value: /^\d{6}$/, message: 'Mã OTP phải gồm 6 chữ số.' },
                      })}
                      onFocus={() => setIsOtpFocused(true)}
                      onBlur={() => setIsOtpFocused(false)}
                    />
                    <div className="grid grid-cols-6 gap-2 sm:gap-2.5 pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const val = form.watch('otpCode') || ''
                        const char = val[index] || ''
                        const activeIdx = Math.min(val.length, 5)
                        const isActive = isOtpFocused && index === activeIdx
                        return (
                          <div
                            key={index}
                            className={`h-11 sm:h-13 rounded-xl border flex items-center justify-center text-lg sm:text-xl font-bold transition-all shadow-2xs ${
                              isActive
                                ? 'border-[#d95f00] ring-2 ring-[#d95f00]/30 bg-orange-50/70 text-[#d95f00] scale-105'
                                : char
                                  ? 'border-slate-400 bg-white text-black'
                                  : 'border-slate-300 bg-white/90 text-slate-300 font-normal'
                            }`}
                          >
                            {char}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {form.formState.errors.otpCode && (
                    <p id="auth-otpCode-error" role="alert" className="text-xs text-red-700 font-normal text-center">
                      {form.formState.errors.otpCode.message || 'Mã OTP phải gồm 6 chữ số.'}
                    </p>
                  )}
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={verifyOtp.isPending}
                    onClick={() =>
                      setRegisterStepKey(selectedRole === 'MERCHANT' ? 'bank' : 'info')
                    }
                    className="inline-flex min-h-12 sm:min-h-14 px-4 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm sm:text-base font-semibold text-black hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer shrink-0"
                  >
                    Quay lại
                  </button>
                  <button
                    type="button"
                    disabled={otp.isPending || verifyOtp.isPending}
                    onClick={() => void advanceRegisterStep()}
                    className="inline-flex min-h-12 sm:min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>{verifyOtp.isPending ? 'Đang xác thực OTP…' : 'Tiếp tục: Thiết lập mật khẩu'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
              {otp.isError &&
                otp.variables?.generation === sessionGenerationRef.current &&
                otp.variables?.requestId === activeSendRequestIdRef.current && (
                  <Notice error>{errorMessage(otp.error)}</Notice>
                )}
            </div>

            {/* STEP 4 (hoặc 3 cho Tài xế): Thiết lập mật khẩu & Submit */}
            <div
              hidden={mode === 'register' && registerStepKey !== 'password'}
              className={
                mode === 'register' && registerStepKey !== 'password'
                  ? 'sr-only'
                  : 'space-y-4'
              }
            >
              {mode !== 'forgot' &&
                input(
                  'password',
                  'Mật khẩu',
                  'password',
                  {
                    required: 'Nhập mật khẩu.',
                    minLength: { value: 6, message: 'Mật khẩu phải có từ 6 đến 50 ký tự.' },
                    maxLength: { value: 50, message: 'Mật khẩu phải có từ 6 đến 50 ký tự.' },
                    validate: (value) => Boolean(value?.trim()) || 'Mật khẩu không được chỉ chứa khoảng trắng.',
                  },
                  'Mật khẩu từ 6 đến 50 ký tự',
                )}

              {mode === 'register' &&
                input(
                  'confirmPassword',
                  'Xác nhận mật khẩu',
                  'password',
                  {
                    required: 'Nhập lại mật khẩu để xác nhận.',
                    validate: (val) =>
                      val === form.watch('password') ||
                      'Mật khẩu xác nhận không khớp.',
                  },
                  'Nhập lại mật khẩu để xác nhận',
                )}

              {mode === 'forgot' &&
                input(
                  'newPassword',
                  'Mật khẩu mới',
                  'password',
                  { minLength: 6 },
                  'Mật khẩu mới từ 6 đến 50 ký tự',
                )}

              {/* Password rules hint box */}
              {mode === 'register' && (
                <div className="p-3 rounded-xl bg-black/5 text-black font-inter text-xs leading-4 font-normal tracking-[0.06em] space-y-1">
                  <p className="font-semibold text-black flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-[#d95f00] shrink-0" />
                    <span>Quy định mật khẩu trên hệ thống:</span>
                  </p>
                  <div className="flex items-center justify-between gap-1 pt-1 text-[10.5px] sm:text-[11px] text-black/75">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                      <span>Từ 6 đến 50 ký tự</span>
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                      <span>Không chỉ khoảng trắng</span>
                    </span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] shrink-0" />
                      <span>Mật khẩu trùng khớp</span>
                    </span>
                  </div>
                </div>
              )}

              {mode === 'register' ? (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRegisterStepKey('email')}
                    className="inline-flex min-h-12 sm:min-h-14 px-4 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm sm:text-base font-semibold text-black hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer shrink-0"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={submit.isPending}
                    className="inline-flex min-h-12 sm:min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                  >
                    {submit.isPending ? (
                      <>
                        <LoaderCircle
                          className="animate-spin text-white"
                          size={18}
                          aria-hidden="true"
                        />
                        <span>Đang xử lý…</span>
                      </>
                    ) : (
                      <>
                        <span>Tạo tài khoản</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submit.isPending}
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {submit.isPending ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
                      Đang xử lý…
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? 'Đăng nhập' : 'Đặt lại mật khẩu'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
            {submit.isError &&
              submit.variables?.generation === sessionGenerationRef.current &&
              submit.variables?.requestId === activeSubmitRequestIdRef.current && (
                <Notice error>{errorMessage(submit.error)}</Notice>
              )}

            {mode === 'register' && isConfirmRoleDialogOpen && (
              <Dialog
                isOpen={isConfirmRoleDialogOpen}
                onClose={handleCancelRoleChange}
                onAfterClose={handleDialogAfterClose}
                initialFocusRef={cancelRoleBtnRef}
                title={`Đổi sang vai trò ${pendingRole ? ROLE_LABELS[pendingRole] : ''}?`}
                description="Thông tin đã nhập cho vai trò hiện tại sẽ bị xóa, bao gồm thông tin cá nhân, ngân hàng và xác thực email. Bạn cần nhập lại từ đầu."
                maxWidth="sm"
              >
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
                  <button
                    ref={cancelRoleBtnRef}
                    type="button"
                    onClick={handleCancelRoleChange}
                    className="min-h-11 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Giữ vai trò hiện tại
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmRoleChange}
                    className="min-h-11 px-4 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] active:bg-[#9e4300] text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    Đổi vai trò và nhập lại
                  </button>
                </div>
              </Dialog>
            )}

            {roleChangeAnnouncement && (
              <div role="status" aria-live="polite" className="sr-only">
                {roleChangeAnnouncement}
              </div>
            )}
          </form>
        )}

        {(!submit.isSuccess || mode === 'login') && (
          <nav
            aria-label="Tài khoản"
            className="mt-4 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm text-black font-normal"
          >
            {mode !== 'login' && (
              <div>
                <span>Đã có tài khoản? </span>
                <Link
                  to="/login"
                  className="font-bold text-[#d95f00] hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
            {mode !== 'register' && (
              <div>
                <span>Chưa có tài khoản? </span>
                <Link
                  to="/register"
                  className="font-bold text-[#d95f00] hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}
            {mode !== 'forgot' && (
              <Link
                to="/forgot-password"
                className="font-semibold text-[#d95f00] hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
              >
                Quên mật khẩu?
              </Link>
            )}
          </nav>
        )}
      </div>
    </AuthLayout>
  )
}

export function AuthSuccess({
  mode = 'register',
  registeredPhone,
  registeredEmail,
  registeredFullName,
  role = 'DRIVER',
  autoRedirect = true,
}: {
  mode?: 'register' | 'forgot'
  registeredPhone?: string
  registeredEmail?: string
  registeredFullName?: string
  role?: 'DRIVER' | 'MERCHANT' | string
  autoRedirect?: boolean
}) {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(4)

  useEffect(() => {
    if (registeredPhone) {
      try {
        localStorage.setItem('remembered_phone', registeredPhone.replace(/\s/g, ''))
      } catch {
        // ignore
      }
    }
  }, [registeredPhone])

  useEffect(() => {
    if (!autoRedirect) return
    if (countdown <= 0) {
      navigate('/login', { replace: true })
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, autoRedirect, navigate])

  return (
    <section
      role="status"
      className="text-center pt-1 pb-1 animate-in fade-in zoom-in-95 duration-300"
    >
      <div className="mx-auto mb-3.5 flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 shadow-2xs">
        <Check size={28} strokeWidth={2.5} />
      </div>
      <p className="mb-2 text-xs font-bold tracking-[.18em] text-[#d95f00] uppercase">
        {mode === 'register'
          ? 'TÀI KHOẢN ĐÃ SẴN SÀNG'
          : 'BẢO MẬT ĐÃ ĐƯỢC CẬP NHẬT'}
      </p>
      <h2 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-black mb-2">
        {mode === 'register' ? 'Đăng ký thành công!' : 'Đã đặt lại mật khẩu.'}
      </h2>
      <p className="mb-4 max-w-md mx-auto text-xs sm:text-sm leading-relaxed text-black/75 font-normal">
        {mode === 'register'
          ? `Chào mừng ${registeredFullName ? registeredFullName + ' ' : ''}đến với SmartTruck Hub. Đăng nhập để tìm điểm đỗ và bắt đầu hành trình của mình.`
          : 'Bạn có thể đăng nhập bằng mật khẩu mới để tiếp tục sử dụng tài khoản.'}
      </p>

      {mode === 'register' && (registeredPhone || registeredEmail) && (
        <div className="mb-4 rounded-xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-3 sm:p-3.5 text-left shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-black/60 font-medium">Vai trò tài khoản:</span>
            <span className="font-bold text-black flex items-center gap-1.5">
              {role === 'MERCHANT' ? <Store size={14} className="text-[#d95f00]" /> : <Truck size={14} className="text-[#d95f00]" />}
              {role === 'MERCHANT' ? 'Chủ bãi đỗ xe' : 'Tài xế'}
            </span>
          </div>
          {registeredPhone && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-black/60 font-medium">Số điện thoại đăng nhập:</span>
              <span className="font-bold text-black">{registeredPhone}</span>
            </div>
          )}
          {registeredEmail && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-black/60 font-medium">Email xác thực:</span>
              <span className="font-semibold text-black break-all">{registeredEmail}</span>
            </div>
          )}
        </div>
      )}

      {autoRedirect && (
        <div className="mb-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm text-black/70">
          <LoaderCircle size={15} className="animate-spin text-[#d95f00]" />
          <span>
            Tự động chuyển hướng về trang đăng nhập sau{' '}
            <strong className="text-[#d95f00] font-bold">{countdown}s</strong>...
          </span>
        </div>
      )}

      <Link
        className="inline-flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-all shadow-md cursor-pointer"
        to="/login"
      >
        <span>Đến trang đăng nhập</span>
        <ArrowRight size={18} />
      </Link>
    </section>
  )
}
