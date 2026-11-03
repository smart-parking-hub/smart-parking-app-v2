import { Receipt, Building2, Mail, ShieldCheck } from 'lucide-react'
import type { EnterpriseInvoiceConfig } from '../types/profileTypes'

interface EnterpriseInvoiceSectionProps {
  invoiceConfig: EnterpriseInvoiceConfig
  companyName: string
  onCompanyNameChange: (val: string) => void
  taxCode: string
  onTaxCodeChange: (val: string) => void
  accountingEmail: string
  onAccountingEmailChange: (val: string) => void
}

export function EnterpriseInvoiceSection({
  invoiceConfig,
  companyName,
  onCompanyNameChange,
  taxCode,
  onTaxCodeChange,
  accountingEmail,
  onAccountingEmailChange,
}: EnterpriseInvoiceSectionProps) {
  return (
    <section className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="font-sora font-bold text-slate-900 text-base md:text-lg">
            3. Cấu hình xuất hóa đơn VAT điện tử về doanh nghiệp
          </h3>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-bold w-max">
          TỰ ĐỘNG GỬI SAU MỖI LƯỢT RỜI BÃI
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="inv-company" className="text-xs font-bold font-mono text-slate-700 uppercase">
            Tên đầy đủ của Doanh nghiệp vận tải
          </label>
          <div className="relative">
            <input
              id="inv-company"
              type="text"
              value={companyName}
              onChange={(e) => onCompanyNameChange(e.target.value)}
              className="h-11 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-xs md:text-sm w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            <Building2 className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* 2 Cols: Tax Code + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inv-taxcode" className="text-xs font-bold font-mono text-slate-700 uppercase">
              Mã số thuế doanh nghiệp (MST)
            </label>
            <div className="relative">
              <input
                id="inv-taxcode"
                type="text"
                value={taxCode}
                onChange={(e) => onTaxCodeChange(e.target.value)}
                className="h-11 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="inv-email" className="text-xs font-bold font-mono text-slate-700 uppercase">
              Email bộ phận kế toán nhận e-Invoice
            </label>
            <div className="relative">
              <input
                id="inv-email"
                type="email"
                value={accountingEmail}
                onChange={(e) => onAccountingEmailChange(e.target.value)}
                className="h-11 pl-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 text-xs md:text-sm w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* Delivery Specs Bar */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs text-slate-600">
          <span>
            Mẫu hóa đơn: <strong className="text-slate-900">{invoiceConfig.invoiceTemplate}</strong>
          </span>
          <span>
            Định dạng truyền nhận: <strong className="text-slate-900">{invoiceConfig.digitalSignature}</strong>
          </span>
        </div>
      </div>
    </section>
  )
}
