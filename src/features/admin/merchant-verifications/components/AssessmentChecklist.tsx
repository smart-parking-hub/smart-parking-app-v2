import { CheckCircle2, AlertTriangle, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react'
import type { AssessmentSummary, CheckCode, CheckResult } from '@/features/merchant/profile'

interface AssessmentChecklistProps {
  assessment: AssessmentSummary
  onOpenSource?: () => void
  onRequestLegalNameCorrection?: (declaredName: string, extractedName: string) => void
}

const METHOD_LABELS = {
  PDF_TEXT: 'Đọc chữ từ PDF',
  SCANNED_PDF_OCR: 'OCR bản quét PDF',
  IMAGE_OCR: 'OCR hình ảnh',
}

const CHECK_TITLES: Record<CheckCode, string> = {
  REQUIRED_DOCUMENT: 'Có tệp đăng ký kinh doanh bắt buộc',
  READABILITY: 'Độ rõ nét & khả năng đọc của tài liệu',
  REGISTRATION_NUMBER_MATCH: 'Đối chiếu mã số doanh nghiệp / MST',
  LEGAL_NAME_MATCH: 'Đối chiếu tên pháp lý doanh nghiệp',
}

function renderBadge(result: CheckResult) {
  switch (result) {
    case 'PASS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Đạt (PASS)
        </span>
      )
    case 'WARN':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          Cần kiểm tra (WARN)
        </span>
      )
    case 'NOT_CHECKED':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20">
          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
          Chưa kiểm tra (NOT_CHECKED)
        </span>
      )
  }
}

export function AssessmentChecklist({ assessment, onOpenSource, onRequestLegalNameCorrection }: AssessmentChecklistProps) {
  const isUnavailable = assessment.status === 'UNAVAILABLE'
  const isPending = assessment.status === 'PENDING'
  const source = assessment.source

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">
            Kiểm tra sơ bộ & Đối chiếu OCR tự động
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kết quả trích xuất tự động từ tài liệu đính kèm để hỗ trợ Admin thẩm định.
          </p>
        </div>

        {isPending && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1 rounded-full animate-pulse">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-600" /> Đang chạy thẩm định…
          </span>
        )}
        {isUnavailable && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
            <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> Engine OCR không khả dụng
          </span>
        )}
      </div>

      {isUnavailable && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-3 text-xs text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">
              Cảnh báo: Engine OCR cục bộ không khả dụng hoặc tài liệu dạng ảnh quét không đọc được.
            </p>
            <p className="mt-1">
              Admin được phép kiểm tra đối chiếu trực tiếp bằng mắt thường với tệp gốc đính kèm. Khi phê duyệt, Admin bắt buộc phải nhập ghi chú giải trình kiểm duyệt.
            </p>
          </div>
        </div>
      )}

      {source ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p className="min-w-0 break-words text-slate-700">
            {source.originalName} · {METHOD_LABELS[source.method]} · v{source.submissionVersion}
          </p>
          {onOpenSource && (
            <button type="button" className="rounded text-sm font-semibold text-blue-700 underline" onClick={onOpenSource}>
              Mở tệp đã đối chiếu
            </button>
          )}
        </div>
      ) : !isPending && assessment.status !== 'NOT_STARTED' && (
        <p className="text-sm text-slate-600">Chưa lưu nguồn đối chiếu</p>
      )}

      {/* Checklist Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold">
              <th className="py-2.5 px-3">Tiêu chí kiểm tra</th>
              <th className="py-2.5 px-3">Kết quả</th>
              <th className="py-2.5 px-3">Dữ liệu đã khai</th>
              <th className="py-2.5 px-3">Dữ liệu trích xuất OCR</th>
              <th className="py-2.5 px-3">Chi tiết / Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assessment.checks && assessment.checks.length > 0 ? (
              assessment.checks.map((check, idx) => (
                <tr key={`${check.code}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900">
                    {CHECK_TITLES[check.code] || check.code}
                  </td>
                  <td className="py-3 px-3 shrink-0">
                    {renderBadge(check.result)}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-mono">
                    {check.declaredValue ? check.declaredValue : '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-mono">
                    {check.extractedValue ? check.extractedValue : '—'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs">
                    {check.message || '—'}
                    {check.code === 'LEGAL_NAME_MATCH' && check.result === 'WARN'
                      && check.declaredValue && check.extractedValue && onRequestLegalNameCorrection && (
                      <button
                        type="button"
                        className="mt-2 block rounded text-left font-semibold text-blue-700 underline"
                        onClick={() => {
                          if (check.declaredValue && check.extractedValue) {
                            onRequestLegalNameCorrection(check.declaredValue, check.extractedValue)
                          }
                        }}
                      >
                        Yêu cầu sửa tên pháp lý
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                  Chưa có kết quả kiểm tra sơ bộ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
