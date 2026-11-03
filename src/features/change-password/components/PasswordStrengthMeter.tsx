import { CheckCircle2, Circle } from 'lucide-react'
import type { PasswordCriteriaStatus } from '../types/changePasswordTypes'

interface PasswordStrengthMeterProps {
  status: PasswordCriteriaStatus
}

export function PasswordStrengthMeter({ status }: PasswordStrengthMeterProps) {
  const { hasLen, hasUpper, hasNum, hasSpecial, score, label } = status

  // Bar styles depending on score
  const getBarColor = (barIndex: number) => {
    if (score === 0) return 'bg-slate-200'
    if (barIndex > score) return 'bg-slate-200'

    if (score === 1) return 'bg-orange-600'
    if (score === 2) return 'bg-orange-600'
    if (score === 3) {
      return barIndex <= 2 ? 'bg-orange-600' : 'bg-slate-900'
    }
    // score 4
    return 'bg-slate-900'
  }

  const getLabelColor = () => {
    if (score === 0) return 'text-slate-400'
    if (score <= 2) return 'text-orange-600'
    return 'text-slate-900'
  }

  return (
    <div className="pt-1 space-y-3">
      {/* 4-bar indicator & Score label */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-slate-500 uppercase tracking-wider">
            Độ mạnh mật khẩu:
          </span>
          <span className={`font-bold ${getLabelColor()}`}>
            {label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 h-2 w-full">
          <div className={`h-full rounded-full transition-colors ${getBarColor(1)}`} />
          <div className={`h-full rounded-full transition-colors ${getBarColor(2)}`} />
          <div className={`h-full rounded-full transition-colors ${getBarColor(3)}`} />
          <div className={`h-full rounded-full transition-colors ${getBarColor(4)}`} />
        </div>
      </div>

      {/* 4 Criteria Checklist (2x2 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {/* 1. Min 8 chars */}
        <div
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
            hasLen
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-500'
          }`}
        >
          {hasLen ? (
            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
          )}
          <span>Tối thiểu 8 ký tự</span>
        </div>

        {/* 2. Uppercase */}
        <div
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
            hasUpper
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-500'
          }`}
        >
          {hasUpper ? (
            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
          )}
          <span>Có chữ cái in hoa (A-Z)</span>
        </div>

        {/* 3. Number */}
        <div
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
            hasNum
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-500'
          }`}
        >
          {hasNum ? (
            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
          )}
          <span>Có ít nhất 1 chữ số (0-9)</span>
        </div>

        {/* 4. Special Char */}
        <div
          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
            hasSpecial
              ? 'bg-slate-100 border-slate-300 text-slate-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-500'
          }`}
        >
          {hasSpecial ? (
            <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
          )}
          <span>Có ký tự đặc biệt (@, #, $,...)</span>
        </div>
      </div>
    </div>
  )
}
