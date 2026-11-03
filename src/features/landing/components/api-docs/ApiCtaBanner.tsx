import { ArrowRight, Code2 } from 'lucide-react'

export function ApiCtaBanner() {
  return (
    <section className="w-full bg-[#060D1A] py-20 px-6 lg:px-12 flex justify-center text-white">
      <div className="max-w-[1240px] w-full bg-[#0F172A] border border-[#1E3A5F] rounded p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="max-w-2xl text-center lg:text-left">
          <span className="font-mono text-xs text-[#F97316] font-semibold tracking-wider uppercase block mb-3">
            CHUYÊN BIỆT CHO ĐỘI NGŨ ENGINEERING &amp; 3PL
          </span>
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-white mb-4 leading-tight">
            Sẵn Sàng Nâng Tầm Năng Lực Vận Tải Cùng SmartTruck API?
          </h2>
          <p className="text-base text-[#D7DFE9] leading-relaxed font-normal">
            Đội ngũ kỹ sư giải pháp luôn đồng hành hỗ trợ tích hợp 24/7 trực tiếp qua kênh Slack / Telegram chuyên biệt.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full sm:w-auto">
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base rounded transition-colors text-center shadow-sm"
            href="#request-sandbox"
          >
            YÊU CẦU CẤP MÔI TRƯỜNG SANDBOX
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#1E293B] hover:bg-[#1E3A5F] text-white border border-[#1E3A5F] font-semibold text-sm sm:text-base rounded transition-colors text-center"
            href="#download-sdk"
          >
            <Code2 className="w-4 h-4 text-[#F97316]" aria-hidden="true" />
            TẢI BỘ SDK PYTHON &amp; NODEJS / JAVA
          </a>
        </div>
      </div>
    </section>
  )
}
