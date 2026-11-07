import { useState, useEffect } from 'react'
import { X, Building2, Save, Loader2 } from 'lucide-react'
import type { CompanyInvoiceConfig } from '../types/paymentTypes'

interface CompanyInvoiceConfigModalProps {
  isOpen: boolean
  onClose: () => void
  initialConfig: CompanyInvoiceConfig
  onSave: (config: CompanyInvoiceConfig) => Promise<void> | void
}

export function CompanyInvoiceConfigModal({
  isOpen,
  onClose,
  initialConfig,
  onSave,
}: CompanyInvoiceConfigModalProps) {
  const [form, setForm] = useState<CompanyInvoiceConfig>(initialConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavedNotice, setIsSavedNotice] = useState(false)

  // Re-sync form when initialConfig changes
  useEffect(() => {
    setForm(initialConfig)
  }, [initialConfig])

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isSaving, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSaving) return

    setIsSaving(true)
    try {
      await onSave(form)
      setIsSavedNotice(true)
      setTimeout(() => {
        setIsSavedNotice(false)
        onClose()
      }, 800)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-config-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 id="company-config-modal-title" className="text-lg font-bold font-sora text-slate-900">
              Cấu Hình Hóa Đơn Doanh Nghiệp
            </h3>
            <p className="text-xs text-slate-500">
              Đồng bộ tự động hóa đơn điện tử VAT Thông tư 78 về kế toán
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company-name-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Tên Doanh Nghiệp / Công Ty Vận Tải
            </label>
            <input
              id="company-name-input"
              name="companyName"
              type="text"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full h-11 px-3.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company-tax-id-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Mã Số Thuế (MST)
              </label>
              <input
                id="company-tax-id-input"
                name="taxId"
                type="text"
                required
                value={form.taxId}
                onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                className="w-full h-11 px-3.5 text-xs md:text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="company-accounting-email-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Nhận Hóa Đơn Kế Toán
              </label>
              <input
                id="company-accounting-email-input"
                name="accountingEmail"
                type="email"
                required
                value={form.accountingEmail}
                onChange={(e) => setForm({ ...form, accountingEmail: e.target.value })}
                className="w-full h-11 px-3.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company-address-input" className="block text-xs font-semibold text-slate-700 mb-1">
              Địa Chỉ Trụ Sở Công Ty (Ghi trên HĐĐT)
            </label>
            <input
              id="company-address-input"
              name="companyAddress"
              type="text"
              required
              value={form.companyAddress}
              onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
              className="w-full h-11 px-3.5 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label htmlFor="company-integration-software-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Phần Mềm Kế Toán Kết Nối
              </label>
              <select
                id="company-integration-software-select"
                name="integrationSoftware"
                value={form.integrationSoftware}
                onChange={(e) => setForm({ ...form, integrationSoftware: e.target.value })}
                className="w-full h-11 px-3 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="MISA AMIS & FAST">MISA AMIS & FAST</option>
                <option value="MISA AMIS">MISA AMIS</option>
                <option value="FAST Accounting">FAST Accounting</option>
                <option value="BRAVO ERP">BRAVO ERP</option>
                <option value="Khác">Khác / Định dạng chuẩn TT78</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label htmlFor="company-auto-send-xml-checkbox" className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                <input
                  id="company-auto-send-xml-checkbox"
                  name="autoSendXml"
                  type="checkbox"
                  checked={form.autoSendXml}
                  onChange={(e) => setForm({ ...form, autoSendXml: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                />
                <span>Tự động đính kèm file XML gốc</span>
              </label>
            </div>
          </div>

          {isSavedNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200">
              Đã lưu cấu hình doanh nghiệp thành công!
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              aria-busy={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
