import {
  Receipt,
  Download,
  Send,
  Building2,
  FileCheck2,
  FileText,
} from 'lucide-react'
import type { PaymentTransactionItem } from '../types/paymentTypes'

interface ReceiptInspectorPanelProps {
  item: PaymentTransactionItem
  onDownloadPdf: (item: PaymentTransactionItem) => void
  onOpenSendEmail: (item: PaymentTransactionItem) => void
}

export function ReceiptInspectorPanel({
  item,
  onDownloadPdf,
  onOpenSendEmail,
}: ReceiptInspectorPanelProps) {
  const formatMoney = (val: number) => {
    return `${new Intl.NumberFormat('vi-VN').format(val)} ₫`
  }

  const isRefund = item.category === 'REFUND'

  return (
    <div
      data-testid="receipt-inspector-panel"
      className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6"
    >
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
              BIÊN LAI ĐIỆN TỬ CHÍNH THỨC
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-sora text-slate-900 mt-1">
            Chi Tiết Thanh Toán #{item.transactionCode}
          </h3>

          <span className="font-mono text-xs text-slate-500 mt-0.5">
            Thời gian ghi nhận: {item.createdAtText} ICT
          </span>
        </div>

        <span className="self-start px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider">
          HỢP LỆ THEO TT78
        </span>
      </div>

      {/* Facility & Metadata Box */}
      <div className="bg-slate-50 rounded-xl p-4 md:p-5 flex flex-col gap-3 text-xs md:text-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            Đơn vị thụ hưởng:
          </span>
          <span className="font-semibold text-slate-900 text-left sm:text-right">
            {item.beneficiaryName ?? 'Công ty Cổ phần Vận tải & Bến bãi Tân Cảng'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Mã số thuế bên bán (Bãi):</span>
          <span className="font-mono font-bold text-slate-900">
            {item.beneficiaryTaxId ?? '0300481084'}
          </span>
        </div>

        {item.assignedBerth && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Vị trí đỗ chỉ định:</span>
            <span className="font-mono font-bold text-orange-600">
              {item.assignedBerth}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Biển kiểm soát đầu kéo:</span>
          <span className="font-mono font-bold text-slate-900">
            {item.vehiclePlate} {item.trailerPlate ? `(Moóc ${item.trailerPlate})` : ''}
          </span>
        </div>

        {item.vatLookupCode && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Mã tra cứu hóa đơn điện tử:
            </span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
              {item.vatLookupCode}
            </span>
          </div>
        )}
      </div>

      {/* Cost Breakdown Table inside Receipt */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between py-1 text-slate-400 font-mono text-xs uppercase border-b border-slate-100">
          <span>KHOẢN MỤC DỊCH VỤ</span>
          <span>THÀNH TIỀN</span>
        </div>

        {item.breakdownItems && item.breakdownItems.length > 0 ? (
          item.breakdownItems.map((b) => (
            <div key={b.id} className="flex items-center justify-between py-2 text-xs md:text-sm">
              <span className="text-slate-800">{b.name}</span>
              <span className="font-mono font-bold text-slate-900">{formatMoney(b.amount)}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-between py-2 text-xs md:text-sm">
            <span className="text-slate-800">
              {item.categoryLabel} ({item.parkingLotName})
            </span>
            <span className="font-mono font-bold text-slate-900">{formatMoney(item.amount)}</span>
          </div>
        )}

        {/* Total block */}
        <div className="flex items-center justify-between p-4 md:p-5 bg-slate-100/90 border border-slate-200 rounded-xl mt-3">
          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase text-slate-500 font-bold">
              {isRefund ? 'TỔNG TIỀN HOÀN TRẢ' : 'TỔNG CỘNG THANH TOÁN (ĐÃ VAT)'}
            </span>
            <span className="text-xs text-slate-600 mt-0.5">
              {item.paymentMethodLabel} xác nhận thành công
            </span>
          </div>

          <div
            className={`text-2xl md:text-3xl font-bold font-sora ${
              isRefund ? 'text-orange-600' : 'text-slate-900'
            }`}
          >
            {formatMoney(item.amount)}
          </div>
        </div>
      </div>

      {/* Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onDownloadPdf(item)}
          className="w-full sm:flex-1 h-12 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs md:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>TẢI BIÊN LAI PDF GỐC</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenSendEmail(item)}
          className="w-full sm:flex-1 h-12 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs md:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-orange-400" />
          <span>GỬI QUA EMAIL KẾ TOÁN</span>
        </button>
      </div>

      {/* Tax note */}
      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <span>Hóa đơn điện tử có giá trị pháp lý theo Nghị định 123/2020/NĐ-CP và Thông tư 78/2021/TT-BTC.</span>
      </div>
    </div>
  )
}
