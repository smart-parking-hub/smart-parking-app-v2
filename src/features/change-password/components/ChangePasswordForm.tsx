import { useState, useMemo, type FormEvent } from 'react'
import {
  Lock,
  LockOpen,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  MessageSquare,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Info,
} from 'lucide-react'
import { PasswordStrengthMeter } from './PasswordStrengthMeter'
import type {
  PasswordCriteriaStatus,
  ChangePasswordRequestPayload,
} from '../types/changePasswordTypes'

interface ChangePasswordFormProps {
  onSubmit: (payload: ChangePasswordRequestPayload) => Promise<void>
  onOpenForgotModal: () => void
  isSubmitting?: boolean
}

export function ChangePasswordForm({
  onSubmit,
  onOpenForgotModal,
  isSubmitting = false,
}: ChangePasswordFormProps) {
  // Input fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [logoutOthers, setLogoutOthers] = useState(true)

  // Visibility toggles
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // State
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState(false)

  // Password strength calculation
  const strengthStatus = useMemo<PasswordCriteriaStatus>(() => {
    const val = newPassword
    const hasLen = val.length >= 8
    const hasUpper = /[A-Z]/.test(val)
    const hasNum = /[0-9]/.test(val)
    const hasSpecial = /[^A-Za-z0-9]/.test(val)

    let score = 0
    if (hasLen) score++
    if (hasUpper) score++
    if (hasNum) score++
    if (hasSpecial) score++

    let label: PasswordCriteriaStatus['label'] = 'Chưa nhập'
    if (!val) {
      label = 'Chưa nhập'
    } else if (score === 1) {
      label = 'Yếu'
    } else if (score === 2) {
      label = 'Trung bình'
    } else if (score === 3) {
      label = 'Khá'
    } else if (score === 4) {
      label = 'Mạnh (Chuẩn Fretrix)'
    }

    return {
      hasLen,
      hasUpper,
      hasNum,
      hasSpecial,
      score,
      label,
    }
  }, [newPassword])

  // Realtime Match Feedback
  const matchFeedback = useMemo(() => {
    if (!confirmPassword) return null
    if (confirmPassword === newPassword) {
      return {
        matched: true,
        text: 'Khớp 100% với mật khẩu mới đã nhập',
      }
    }
    return {
      matched: false,
      text: 'Mật khẩu xác nhận chưa trùng khớp',
    }
  }, [newPassword, confirmPassword])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setErrorMessage(null)

    if (!currentPassword.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại.')
      return
    }

    if (strengthStatus.score < 4) {
      setErrorMessage('Mật khẩu mới chưa đạt chuẩn bảo mật Fretrix (cần thỏa mãn cả 4 tiêu chuẩn).')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.')
      return
    }

    try {
      await onSubmit({
        currentPassword,
        newPassword,
        logoutOthers,
      })

      setSuccessNotice(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Mật khẩu hiện tại không chính xác hoặc hệ thống bận. Vui lòng thử lại.'
      )
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col gap-6">
      {/* Form Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h2 className="font-sora font-bold text-slate-900 text-lg md:text-xl">
            Khởi tạo mật khẩu vận hành mới
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          Vui lòng nhập mật khẩu hiện tại để xác minh chủ tài khoản trước khi thiết lập mật khẩu truy cập mới.
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs md:text-sm font-medium flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success notification banner */}
      {successNotice && (
        <div className="p-4.5 rounded-xl bg-slate-900 text-white flex items-center justify-between border-l-4 border-orange-600 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
            <div>
              <p className="font-bold text-sm text-white">Mật khẩu đã cập nhật thành công</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Đã gửi mã xác nhận giao thức Fretrix về số điện thoại +84 909 *** 374.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Trường 1: Mật khẩu hiện tại */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="curr-pwd"
              className="text-xs md:text-sm font-bold font-mono text-slate-700 uppercase"
            >
              Mật khẩu hiện tại <span className="text-orange-600">*</span>
            </label>
            <button
              type="button"
              onClick={onOpenForgotModal}
              className="text-xs font-medium text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
            >
              Quên mật khẩu hiện tại?
            </button>
          </div>

          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="curr-pwd"
              name="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              placeholder="Nhập mật khẩu đang sử dụng"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              aria-label="Ẩn hiện mật khẩu hiện tại"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-slate-100" />

        {/* Trường 2: Mật khẩu mới */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="new-pwd"
            className="text-xs md:text-sm font-bold font-mono text-slate-700 uppercase"
          >
            Mật khẩu mới <span className="text-orange-600">*</span>
          </label>

          <div className="relative flex items-center">
            <LockOpen className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="new-pwd"
              name="newPassword"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              placeholder="Nhập mật khẩu mới an toàn"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              aria-label="Ẩn hiện mật khẩu mới"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          <PasswordStrengthMeter status={strengthStatus} />
        </div>

        {/* Trường 3: Xác nhận mật khẩu mới */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm-pwd"
            className="text-xs md:text-sm font-bold font-mono text-slate-700 uppercase"
          >
            Xác nhận mật khẩu mới <span className="text-orange-600">*</span>
          </label>

          <div className="relative flex items-center">
            <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              id="confirm-pwd"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errorMessage) setErrorMessage(null)
              }}
              placeholder="Nhập lại chính xác mật khẩu mới"
              className="w-full h-12 pl-10 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="button"
              aria-label="Ẩn hiện mật khẩu xác nhận"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Match Feedback Badge */}
          {matchFeedback && (
            <div
              className={`flex items-center gap-1.5 pt-1 text-xs font-medium ${
                matchFeedback.matched ? 'text-slate-900' : 'text-orange-600'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{matchFeedback.text}</span>
            </div>
          )}
        </div>

        {/* Option Checkbox: Log out from other devices */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3 mt-1">
          <input
            id="logout-others"
            type="checkbox"
            checked={logoutOthers}
            onChange={(e) => setLogoutOthers(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
          />
          <label htmlFor="logout-others" className="cursor-pointer select-none">
            <span className="text-xs md:text-sm font-bold text-slate-900 block">
              Đăng xuất khỏi tất cả các thiết bị khác sau khi hoàn tất
            </span>
            <span className="text-xs text-slate-500 block mt-0.5 leading-relaxed">
              Được khuyến nghị cao nhằm chấm dứt ngay phiên làm việc trên các máy tính bảng cabin cũ hoặc thiết bị di động đã thất lạc.
            </span>
          </label>
        </div>

        {/* Action Buttons Area */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full sm:w-auto min-h-[44px] h-12 px-7 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-orange-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>Đang cập nhật...</span>
              </>
            ) : (
              <>
                <span>CẬP NHẬT MẬT KHẨU MỚI</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenForgotModal}
            className="min-h-[44px] px-2 text-xs md:text-sm font-semibold text-slate-600 hover:text-orange-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Khôi phục qua SMS OTP</span>
          </button>
        </div>
      </form>
    </div>
  )
}
