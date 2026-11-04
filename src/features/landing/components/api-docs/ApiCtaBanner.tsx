import { ArrowRight, Code2 } from 'lucide-react'

export function ApiCtaBanner() {
  return (
    <section id="sandbox-register" className="w-full bg-brand-navy py-20 px-6 lg:px-12 flex justify-center text-white">
      <div className="max-w-[1240px] w-full bg-brand-navy-light border border-api-border rounded p-8 lg:p-14 flex flex-col 2xl:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="font-mono text-xs text-brand-orange font-semibold tracking-wider uppercase block mb-3">
            CHUYÊN BIỆT CHO ĐỘI NGŨ ENGINEERING &amp; 3PL
          </span>
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-white mb-4 leading-tight">
            Sẵn Sàng Nâng Tầm Năng Lực Vận Tải Cùng SmartTruck API?
          </h2>
          <p className="text-base text-api-muted leading-relaxed font-normal">
            Đội ngũ kỹ sư giải pháp luôn đồng hành hỗ trợ tích hợp 24/7 trực tiếp qua kênh Slack / Telegram chuyên biệt.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full 2xl:w-auto">
          <a
            className="inline-flex items-center justify-center gap-2 min-h-[52px] py-3 px-5 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-semibold text-sm sm:text-base rounded transition-colors text-center shadow-sm"
            href="#request-sandbox"
          >
            YÊU CẦU CẤP MÔI TRƯỜNG SANDBOX
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 min-h-[52px] py-3 px-5 bg-api-panel hover:bg-api-border text-white border border-api-border font-semibold text-sm sm:text-base rounded transition-colors text-center"
            href="#download-sdk"
          >
            <Code2 className="w-4 h-4 text-brand-orange" aria-hidden="true" />
            TẢI BỘ SDK PYTHON &amp; NODEJS / JAVA
          </a>
        </div>
      </div>
    </section>
  )
}
