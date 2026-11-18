import { useState } from 'react'
import { Dialog } from '@/shared/components/Dialog'
import { Button } from '@/shared/components/Button'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { AssessmentSummary } from '@/features/merchant/profile'

interface ApproveVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  submissionVersion: number
  assessment: AssessmentSummary
  isPending: boolean
  error?: string
  onConfirm: (payload: { submissionVersion: number; documentsReviewed: true; note?: string }) => void
}

export function ApproveVerificationModal({
  isOpen,
  onClose,
  submissionVersion,
  assessment,
  isPending,
  error,
  onConfirm,
}: ApproveVerificationModalProps) {
  const [documentsReviewed, setDocumentsReviewed] = useState(false)
  const [note, setNote] = useState('')
  const [validationError, setValidationError] = useState('')

  const hasWarnings = assessment.checks?.some((c) => c.result === 'WARN')
  const isUnavailable = assessment.status === 'UNAVAILABLE'
  const isNoteRequired = hasWarnings || isUnavailable

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending) return
    if (!documentsReviewed) {
      setValidationError('Bạn phải đánh dấu xác nhận đã xem xét tài liệu đính kèm.')
      return
    }
    if (isNoteRequired && !note.trim()) {
      setValidationError(
        'Khi kết quả kiểm tra sơ bộ có cảnh báo hoặc không khả dụng, bạn bắt buộc phải nhập ghi chú giải trình.',
      )
      return
    }
    setValidationError('')
    onConfirm({
      submissionVersion,
      documentsReviewed: true,
      note: note.trim() || undefined,
    })
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Phê duyệt hồ sơ doanh nghiệp chủ bãi"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-600">
          Xác nhận phê duyệt hồ sơ cho phiên bản nộp <strong>#{submissionVersion}</strong>. Sau khi phê duyệt, tài khoản chủ bãi sẽ chính thức chuyển sang trạng thái <strong>Đã xác thực (VERIFIED)</strong>.
        </p>

        {isNoteRequired && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                Lưu ý: Hồ sơ có cảnh báo kiểm tra sơ bộ hoặc OCR không khả dụng.
              </p>
              <p className="mt-0.5">
                Vui lòng nhập ghi chú giải trình kiểm duyệt chi tiết trước khi phê duyệt.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="confirm-documents-reviewed"
              checked={documentsReviewed}
              onChange={(e) => {
                setDocumentsReviewed(e.target.checked)
                setValidationError('')
              }}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-medium text-slate-800">
              Tôi xác nhận đã xem xét trực tiếp đầy đủ các tệp tài liệu gốc đính kèm của hồ sơ này.
            </span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="approve-note" className="block text-xs font-semibold text-slate-700">
            Ghi chú giải trình kiểm duyệt {isNoteRequired ? <span className="text-rose-600">*</span> : '(tùy chọn)'}:
          </label>
          <textarea
            id="approve-note"
            rows={3}
            value={note}
            placeholder={
              isNoteRequired
                ? 'Nhập giải trình kiểm tra thủ công đối chiếu tài liệu gốc…'
                : 'Nhập ghi chú phê duyệt (nếu có)…'
            }
            onChange={(e) => {
              setNote(e.target.value)
              setValidationError('')
            }}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none resize-none"
          />
        </div>

        {(validationError || error) && (
          <p role="alert" className="text-xs text-rose-600 font-medium">
            {validationError || error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            disabled={!documentsReviewed || (isNoteRequired && !note.trim())}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white"
          >
            Phê duyệt hồ sơ
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
