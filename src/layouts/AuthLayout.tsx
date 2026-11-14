import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { checkServerConnectivity } from '@/shared/api/health'

export interface AuthLayoutProps {
  children: ReactNode
  variant?: 'default' | 'recovery'
}

const RECOVERY_TYPOGRAPHY_SCOPE: CSSProperties = {
  '--font-inter': "'Inter', 'Source Sans 3', sans-serif",
  '--font-sora': "'Sora', 'Inter', 'Be Vietnam Pro', sans-serif",
} as CSSProperties

export function AuthLayout({ children }: AuthLayoutProps) {
  const [isConnected, setIsConnected] = useState<boolean>(
    import.meta.env.MODE === 'test' ? true : false,
  )
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return

    let active = true
    let timer: ReturnType<typeof setTimeout>

    const verify = async () => {
      const ok = await checkServerConnectivity()
      if (!active) return
      if (ok) {
        setIsConnected(true)
        setIsRetrying(false)
      } else {
        setIsConnected(false)
        timer = setTimeout(verify, 2500)
      }
    }

    void verify()

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [])

  const handleManualRetry = async () => {
    setIsRetrying(true)
    const ok = await checkServerConnectivity()
    setIsRetrying(false)
    if (ok) {
      setIsConnected(true)
    }
  }
  return (
    <div
      style={RECOVERY_TYPOGRAPHY_SCOPE}
      className="relative min-h-screen w-full bg-[#060D1A] font-inter flex flex-col justify-between selection:bg-[#d95f00]/30 selection:text-white overflow-x-hidden"
    >
      <ScrollToTop />

      {/* 1. Ảnh bãi đỗ xe chụp thực tế trải rộng toàn màn hình (full-bleed), tĩnh 100% */}
      <img
        src="/images/auth-parking-lot-bg.jpg"
        alt="SmartTruck Hub Commercial Logistics Parking Depot"
        className="fixed inset-0 h-full w-full object-cover object-[30%_center] sm:object-center scale-100"
      />

      {/* Lớp phủ gradient mờ điện ảnh để card modal và thông điệp nổi bật rõ nét */}
      <div className="fixed inset-0 bg-gradient-to-l from-slate-950/45 via-slate-950/20 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none" />

      {/* Thông điệp slogan thương hiệu ở góc trên bên TRÁI trên nền ảnh */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-12 hidden md:block max-w-[380px] text-left pointer-events-none z-10">
        <span className="font-sora text-xs uppercase tracking-widest text-[#d95f00] font-bold block mb-1">
          SMARTTRUCK HUB
        </span>
        <p className="font-sora text-base sm:text-lg font-bold leading-relaxed text-white drop-shadow-md">
          Một điểm đỗ. <span className="text-[#d95f00]">Ngàn hành trình.</span>
        </p>
        <p className="mt-1 text-xs sm:text-sm text-white/90 leading-relaxed drop-shadow-sm font-normal">
          Bãi đỗ xe thông minh &amp; Điều phối vận tải toàn diện.
        </p>
      </div>

      {/* Badge bảo mật góc dưới bên TRÁI */}
      <div className="fixed bottom-6 left-6 sm:bottom-10 sm:left-12 hidden md:flex items-center gap-2 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-normal text-white shadow-lg pointer-events-none z-10">
        <ShieldCheck className="w-4 h-4 text-[#d95f00] shrink-0" />
        <span>An tâm trên từng chặng đường</span>
      </div>

      {/* 2. PHẦN MODE (MODAL FORM): NẰM LỆCH PHẢI XÍCH VÀO GIỮA, RỘNG RÃI, NỀN KÍNH TRONG SUỐT TĨNH KHÔNG ĐỔI MÀU KHI HOVER */}
      <main className="relative z-20 w-full flex-1 flex items-center justify-end overflow-hidden py-2 sm:py-4">
        <section className="relative z-20 w-full max-w-[520px] sm:max-w-[550px] lg:max-w-[560px] my-auto mx-auto sm:mx-0 sm:mr-10 md:mr-14 lg:mr-20 xl:mr-28 2xl:mr-36 p-3 sm:p-0">
          <div className="w-full max-h-[96vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white/60 backdrop-blur-2xl rounded-[28px] sm:rounded-[34px] p-5 sm:p-7 lg:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/70 ring-1 ring-white/40 text-black">
            {isConnected ? (
              children
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center select-none"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-[#d95f00]/20 border-t-[#d95f00] animate-spin" />
                  <ShieldCheck className="w-7 h-7 text-[#d95f00] absolute inset-0 m-auto" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 font-sora">
                  Đang kết nối đến máy chủ…
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
                  Hệ thống đang kiểm tra và thiết lập đường truyền tới máy chủ SmartTruck Hub. Giao diện sẽ tự động mở khi kết nối sẵn sàng.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs text-[#d95f00] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
                    Đang tự động kết nối lại…
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleManualRetry()}
                    disabled={isRetrying}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} className={isRetrying ? 'animate-spin' : ''} />
                    <span>Thử lại ngay</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
