import { useState, type FormEvent } from 'react'
import { MessageSquare, X, CheckCircle2, AlertCircle, RefreshCw, KeyRound, PhoneCall } from 'lucide-react'
import { sendSmsRecoveryOtpApi, verifySmsRecoveryOtpApi } from '../api/changePasswordApi'

interface SmsRecoveryModalProps {
  isOpen: boolean
  onClose: () => void
  userPhone?: string
}

export function SmsRecoveryModal({
  isOpen,
  onClose,
  userPhone = '0909 128 374',
}: SmsRecoveryModalProps) {
  const [step, setStep] = useState<'SEND_OTP' | 'VERIFY_OTP'>('SEND_OTP')
  const [phone, setPhone] = useState(userPhone)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)
    try {
      const msg = await sendSmsRecoveryOtpApi(phone)
      setInfoMessage(msg)
      setStep('VERIFY_OTP')
    } catch {
      setErrorMessage('Không thể gửi mã SMS. Vui lòng kiểm tra lại số điện thoại.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (otp.length < 4) {
      setErrorMessage('Vui lòng nhập đầy đủ mã OTP.')
      return
    }

    if (newPassword.length < 8) {
      setErrorMessage('Mật khẩu mới tối thiểu 8 ký tự.')
      return
    }

    setLoading(true)
    try {
      await verifySmsRecoveryOtpApi(phone, otp, newPassword)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    } catch {
      setErrorMessage('Mã OTP không chính xác hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base">
                Khôi Phục Mật Khẩu Qua SMS OTP
              </h3>
              <p className="text-xs text-slate-500 font-mono">XÁC THỰC 2 LỚP TÀI XẾ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-4 text-xs">
          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đặt lại mật khẩu thành công!</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 bg-slate-100 border border-slate-200 text-slate-800 rounded-xl font-medium">
              <span>{infoMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'SEND_OTP' ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sms-phone" className="font-bold text-slate-700 font-mono uppercase">
                  Số điện thoại đăng ký tài khoản
                </label>
                <div className="relative">
                  <input
                    id="sms-phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900 w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <span className="text-[11px] text-slate-500">
                  Hệ thống sẽ gửi mã xác thực 6 số qua tin nhắn SMS tới số này.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Gửi Mã Xác Thực OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sms-otp" className="font-bold text-slate-700 font-mono uppercase">
                  Mã OTP (6 chữ số)
                </label>
                <input
                  id="sms-otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="VD: 884920"
                  className="h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-bold text-center tracking-widest text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sms-new-pass" className="font-bold text-slate-700 font-mono uppercase">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    id="sms-new-pass"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('SEND_OTP')}
                  className="w-1/3 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Gửi Lại OTP
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Xác Nhận Đặt Lại'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
