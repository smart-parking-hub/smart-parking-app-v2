import { CheckCircle2, AlertTriangle, HelpCircle, AlertCircle } from 'lucide-react'
import type { AssessmentSummary, CheckResult } from '../types/merchantVerificationTypes'

interface VerificationAssessmentSummaryProps {
  assessment: AssessmentSummary
}

function resultIcon(result: CheckResult) {
  switch (result) {
    case 'PASS':
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" aria-label="Đạt" />
    case 'WARN':
      return <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" aria-label="Cảnh báo" />
    case 'NOT_CHECKED':
    default:
      return <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" aria-label="Chưa kiểm tra" />
  }
}

function resultLabel(result: CheckResult) {
  switch (result) {
    case 'PASS':
      return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Khớp / Đạt</span>
    case 'WARN':
      return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Cần lưu ý</span>
    case 'NOT_CHECKED':
    default:
      return <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Chưa kiểm tra</span>
  }
}

export function VerificationAssessmentSummary({ assessment }: VerificationAssessmentSummaryProps) {
  if (assessment.status === 'NOT_STARTED') {
    return null
  }

  return (
    <div className="rounded-xl border border-brand-border bg-brand-surface/40 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-2">
        <h4 className="text-sm font-semibold text-brand-navy">Kết quả kiểm tra sơ bộ tự động</h4>
        {assessment.status === 'PENDING' && (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded animate-pulse">
            Đang xử lý kiểm tra…
          </span>
        )}
        {assessment.status === 'COMPLETED' && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Đã hoàn thành kiểm tra
          </span>
        )}
        {assessment.status === 'UNAVAILABLE' && (
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Kiểm tra tự động không khả dụng
          </span>
        )}
      </div>

      {assessment.status === 'UNAVAILABLE' && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50/80 p-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
          <p>
            Hệ thống trích xuất OCR tự động tạm thời không khả dụng. Quản trị viên sẽ kiểm tra trực tiếp tài liệu gốc của bạn.
          </p>
        </div>
      )}

      {assessment.checks && assessment.checks.length > 0 && (
        <ul className="divide-y divide-brand-border/60 text-sm">
          {assessment.checks.map((check, idx) => (
            <li key={`${check.code}-${idx}`} className="py-2.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                {resultIcon(check.result)}
                <div className="min-w-0">
                  <p className="font-medium text-brand-navy text-xs sm:text-sm">
                    {check.message || check.code}
                  </p>
                  {(check.declaredValue || check.extractedValue) && (
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted">
                      {check.declaredValue && (
                        <span>Đã khai: <strong className="text-brand-navy font-mono">{check.declaredValue}</strong></span>
                      )}
                      {check.extractedValue && (
                        <span>Trích xuất: <strong className="text-brand-navy font-mono">{check.extractedValue}</strong></span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                {resultLabel(check.result)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
