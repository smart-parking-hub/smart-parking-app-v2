import { GitFork, BellRing, Wallet, Receipt } from 'lucide-react'

export function ApiSolutionsBentoSection() {
  return (
    <section className="w-full bg-brand-surface py-20 px-6 lg:px-12 flex justify-center text-brand-navy-light">
      <div className="max-w-[1240px] w-full flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-api-muted pb-8">
          <div>
            <span className="font-mono text-xs text-brand-orange-ink font-semibold tracking-wider uppercase block mb-2">
              GIẢI PHÁP CHUYÊN NGÀNH LOGISTICS 4.0
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl text-brand-navy-light">
              4 Năng Lực Tích Hợp Hệ Thống Trọng Yếu
            </h2>
          </div>
          <p className="text-sm sm:text-base text-api-body max-w-lg leading-relaxed">
            Thiết kế riêng cho các đơn vị 3PL, chủ xe container đường dài và trung tâm Logistics giải quyết bài toán ách tắc trước cổng cảng biển và depot ICD.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Auto-Dispatch (Col 7) */}
          <div className="md:col-span-7 bg-white p-8 rounded border border-api-muted flex flex-col justify-between hover:border-api-border transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 rounded bg-brand-surface border border-api-muted flex items-center justify-center text-brand-orange-ink mb-6">
                <GitFork className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase text-api-body tracking-wider font-semibold">
                  MODULE 01
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-navy-light font-mono text-[11px] font-semibold">
                  TMS DISPATCH
                </span>
              </div>
              <h3 className="font-sora font-semibold text-lg sm:text-xl text-brand-navy-light mb-3">
                Tự động hóa điều phối chuyến (Auto-Dispatch Integration)
              </h3>
              <p className="text-sm text-api-body mb-6 leading-relaxed">
                Đồng bộ kế hoạch giao nhận container với slot bãi chờ gần cảng Cát Lái, Đình Vũ, Cái Mép. Hệ thống tự động so khớp tọa độ xe với slot trống, dự tính thời gian chờ hạ vỏ và phân luồng thông minh.
              </p>
            </div>
            <div className="pt-4 border-t border-brand-surface flex items-center justify-between font-mono text-xs text-brand-navy-light">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                Đồng bộ: GPS Telematics &amp; Gate RFID
              </span>
              <span className="text-brand-orange-ink font-semibold">SLOT CAPACITY LIVE</span>
            </div>
          </div>

          {/* Card 2: Webhooks (Col 5) */}
          <div className="md:col-span-5 bg-white p-8 rounded border border-api-muted flex flex-col justify-between hover:border-api-border transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 rounded bg-brand-surface border border-api-muted flex items-center justify-center text-brand-orange-ink mb-6">
                <BellRing className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase text-api-body tracking-wider font-semibold">
                  MODULE 02
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-navy-light font-mono text-[11px] font-semibold">
                  ASYNC EVENTS
                </span>
              </div>
              <h3 className="font-sora font-semibold text-lg sm:text-xl text-brand-navy-light mb-3">
                Cổng Webhook sự kiện thời gian thực
              </h3>
              <p className="text-sm text-api-body mb-6 leading-relaxed">
                Nhận thông báo tức thì khi xe qua barie vào bãi, xe xuất bãi hoặc phát sinh phí quá giờ. Hỗ trợ retry 5 lần theo hàm số mũ với xác thực HMAC-SHA256 bảo đảm an toàn.
              </p>
            </div>
            <div className="pt-4 border-t border-brand-surface flex items-center justify-between font-mono text-xs text-brand-navy-light">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                Delivery: &lt;100ms Push Event
              </span>
              <span className="text-brand-orange-ink font-semibold">HMAC SECURED</span>
            </div>
          </div>

          {/* Card 3: Corporate Fleet Wallet API (Col 5) */}
          <div className="md:col-span-5 bg-white p-8 rounded border border-api-muted flex flex-col justify-between hover:border-api-border transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 rounded bg-brand-surface border border-api-muted flex items-center justify-center text-brand-orange-ink mb-6">
                <Wallet className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase text-api-body tracking-wider font-semibold">
                  MODULE 03
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-navy-light font-mono text-[11px] font-semibold">
                  FINTECH 3PL
                </span>
              </div>
              <h3 className="font-sora font-semibold text-lg sm:text-xl text-brand-navy-light mb-3">
                Ví số doanh nghiệp tập trung (Corporate Fleet Wallet API)
              </h3>
              <p className="text-sm text-api-body mb-6 leading-relaxed">
                Khấu trừ cước đỗ xe tự động từ quỹ công nợ doanh nghiệp, tài xế không cần ứng tiền túi. Phân bổ định mức đỗ xe theo mã chuyến, loại xe đầu kéo và biển kiểm soát rơ-moóc.
              </p>
            </div>
            <div className="pt-4 border-t border-brand-surface flex items-center justify-between font-mono text-xs text-brand-navy-light">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                Giao dịch: 0% Sai sót tiền mặt
              </span>
              <span className="text-brand-orange-ink font-semibold">AUTO-DEBIT</span>
            </div>
          </div>

          {/* Card 4: Automated e-Invoice Sync (Col 7) */}
          <div className="md:col-span-7 bg-white p-8 rounded border border-api-muted flex flex-col justify-between hover:border-api-border transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 rounded bg-brand-surface border border-api-muted flex items-center justify-center text-brand-orange-ink mb-6">
                <Receipt className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase text-api-body tracking-wider font-semibold">
                  MODULE 04
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-surface text-brand-navy-light font-mono text-[11px] font-semibold">
                  COMPLIANCE ERP
                </span>
              </div>
              <h3 className="font-sora font-semibold text-lg sm:text-xl text-brand-navy-light mb-3">
                Đồng bộ hóa đơn điện tử VAT (Automated e-Invoice Sync)
              </h3>
              <p className="text-sm text-api-body mb-6 leading-relaxed">
                Tự động đẩy dữ liệu hóa đơn giá trị gia tăng từng chuyến về phần mềm kế toán MISA, SAP, Fast. Quyết toán chi phí theo kỳ, đối chiếu mã container và mã số thuế trực tiếp theo thông tư 78/BCT.
              </p>
            </div>
            <div className="pt-4 border-t border-brand-surface flex items-center justify-between font-mono text-xs text-brand-navy-light">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-orange" />
                Chuẩn hóa: SAP ERP, MISA AMIS, FAST
              </span>
              <span className="text-brand-orange-ink font-semibold">VAT TT78 COMPLIANT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
