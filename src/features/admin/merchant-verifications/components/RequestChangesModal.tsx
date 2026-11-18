import { useState } from 'react'
import { Dialog } from '@/shared/components/Dialog'
import { Button } from '@/shared/components/Button'
import { Send } from 'lucide-react'
import type { DocumentType, VerificationDocument } from '@/features/merchant/profile'
import type { RequestChangesPayload } from '../types/adminMerchantVerificationTypes'

interface RequestChangesModalProps {
  isOpen: boolean
  onClose: () => void
  submissionVersion: number
  isPending: boolean
  document?: Pick<VerificationDocument, 'type' | 'originalName'>
  nameMismatch?: { declaredName: string; extractedName: string }
  error?: string
  onConfirm: (payload: RequestChangesPayload) => void
}

const AVAILABLE_KEYS: Array<{ key: 'BUSINESS_INFO' | DocumentType; label: string }> = [
  { key: 'BUSINESS_INFO', label: 'Thông tin doanh nghiệp (Mã số thuế / Tên pháp lý)' },
  { key: 'BUSINESS_REGISTRATION', label: 'Giấy chứng nhận đăng ký doanh nghiệp / kinh doanh' },
  { key: 'AUTHORIZATION_LETTER', label: 'Giấy ủy quyền người đại diện' },
  { key: 'SUPPORTING_DOCUMENT', label: 'Tài liệu / Giấy tờ bổ sung khác' },
]

export function RequestChangesModal({
  isOpen,
  onClose,
  submissionVersion,
  isPending,
  document,
  nameMismatch,
  error,
  onConfirm,
}: RequestChangesModalProps) {
  const initialKey = nameMismatch ? 'BUSINESS_INFO' : document?.type ?? 'BUSINESS_REGISTRATION'
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({
    [initialKey]: true,
  })
  const [reasons, setReasons] = useState<Record<string, string>>({
    [initialKey]: nameMismatch
      ? 'Tên đã khai “' + nameMismatch.declaredName + '” khác với tên đọc được “' + nameMismatch.extractedName
        + '”. Vui lòng kiểm tra giấy đăng ký kinh doanh và nhập lại tên pháp lý.'
      : document
        ? 'Tệp “' + document.originalName + '” không đúng yêu cầu. Vui lòng tải lại bộ tệp đúng loại cho mục này.'
        : '',
  })
  const [validationError, setValidationError] = useState('')

  const handleToggleKey = (key: string) => {
    setSelectedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setValidationError('')
  }

  const handleReasonChange = (key: string, value: string) => {
    setReasons((prev) => ({
      ...prev,
      [key]: value,
    }))
    setValidationError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isPending) return
    const activeKeys = Object.entries(selectedKeys)
      .filter(([_, checked]) => checked)
      .map(([k]) => k)

    if (activeKeys.length === 0) {
      setValidationError('Vui lòng chọn ít nhất 1 mục cần yêu cầu bổ sung/chỉnh sửa.')
      return
    }

    const items: Array<{ key: string; reason: string }> = []
    for (const key of activeKeys) {
      const reason = (reasons[key] || '').trim()
      if (!reason) {
        setValidationError(`Vui lòng nhập lý do cụ thể cho mục: ${key}`)
        return
      }
      items.push({ key, reason })
    }

    setValidationError('')
    onConfirm({
      submissionVersion,
      ...(nameMismatch && selectedKeys.BUSINESS_INFO ? { resetLegalName: true } : {}),
      items,
    })
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={nameMismatch ? 'Yêu cầu sửa tên pháp lý' : 'Yêu cầu bổ sung / chỉnh sửa hồ sơ'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-600">
          Chọn đủ các mục chủ bãi cần sửa ở phiên bản <strong>#{submissionVersion}</strong>. Chủ bãi chỉ sửa được các mục đã chọn. Các nhóm tệp còn lại được giữ nguyên khi nộp phiên bản tiếp theo.
        </p>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-700">Chọn các mục cần yêu cầu sửa đổi:</p>

          {AVAILABLE_KEYS.map((item) => {
            const isChecked = Boolean(selectedKeys[item.key])
            return (
              <div
                key={item.key}
                className={`rounded-xl border p-3.5 transition-colors ${
                  isChecked ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleKey(item.key)}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>{item.label}</span>
                </label>

                {isChecked && (
                  <div className="mt-2.5 pl-6">
                    <label
                      htmlFor={`reason-${item.key}`}
                      className="block text-[11px] font-semibold text-slate-600 mb-1"
                    >
                      Lý do yêu cầu bổ sung/sửa đổi <span className="text-rose-600">*</span>:
                    </label>
                    <textarea
                      id={`reason-${item.key}`}
                      rows={3}
                      maxLength={1000}
                      value={reasons[item.key] || ''}
                      placeholder="Mô tả rõ lý do cần bổ sung (ví dụ: ảnh mờ góc, thiếu con dấu, sai mã số thuế)…"
                      onChange={(e) => handleReasonChange(item.key, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none resize-none"
                    />
                  </div>
                )}
              </div>
            )
          })}
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
            leftIcon={<Send className="h-4 w-4" />}
            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white"
          >
            Gửi yêu cầu bổ sung
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
