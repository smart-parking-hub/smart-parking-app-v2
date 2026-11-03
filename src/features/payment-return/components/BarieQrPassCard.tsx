import { useState } from 'react'
import { QrCode, Download, CheckCircle2 } from 'lucide-react'
import type { PaymentReturnManifestDto } from '../types/paymentReturnTypes'

interface BarieQrPassCardProps {
  manifest: PaymentReturnManifestDto
  onDownloadQr?: () => void
}

export function BarieQrPassCard({
  manifest,
  onDownloadQr,
}: BarieQrPassCardProps) {
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = () => {
    setDownloaded(true)
    if (onDownloadQr) {
      onDownloadQr()
    }
    setTimeout(() => {
      setDownloaded(false)
    }, 2500)
  }

  return (
    <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-between text-center">
      <div className="w-full flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center gap-2 mb-1.5">
          <QrCode className="w-5 h-5 text-orange-600" />
          <span className="font-mono text-xs sm:text-sm uppercase font-bold text-slate-900 tracking-wider">
            MÃ QR MỞ BARIE TỰ ĐỘNG
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          Quét tại đầu đọc trụ làn 02 hoặc hiển thị cho Camera ALPR
        </p>

        {/* Vector QR Container (180x180 px pure Navy/White with Center Fretrix Orange Stamp) */}
        <div
          data-testid="barie-qr-container"
          className="p-3.5 bg-white rounded-2xl shadow-md border border-slate-200/80 flex items-center justify-center relative hover:scale-[1.02] transition-transform"
        >
          <svg
            className="w-[180px] h-[180px]"
            fill="none"
            height="180"
            viewBox="0 0 180 180"
            width="180"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Barie QR Pass"
          >
            {/* Outer Base */}
            <rect fill="#FFFFFF" height="180" width="180" rx="8" />

            {/* Corner Targets Top-Left */}
            <rect fill="#0F172A" height="40" width="40" x="12" y="12" rx="4" />
            <rect fill="#FFFFFF" height="28" width="28" x="18" y="18" rx="2" />
            <rect fill="#0F172A" height="16" width="16" x="24" y="24" rx="1" />

            {/* Corner Targets Top-Right */}
            <rect fill="#0F172A" height="40" width="40" x="128" y="12" rx="4" />
            <rect fill="#FFFFFF" height="28" width="28" x="134" y="18" rx="2" />
            <rect fill="#0F172A" height="16" width="16" x="140" y="24" rx="1" />

            {/* Corner Targets Bottom-Left */}
            <rect fill="#0F172A" height="40" width="40" x="12" y="128" rx="4" />
            <rect fill="#FFFFFF" height="28" width="28" x="18" y="134" rx="2" />
            <rect fill="#0F172A" height="16" width="16" x="24" y="140" rx="1" />

            {/* Alignment Target Bottom-Right */}
            <rect fill="#0F172A" height="24" width="24" x="128" y="128" rx="2" />
            <rect fill="#FFFFFF" height="12" width="12" x="134" y="134" rx="1" />
            <rect fill="#0F172A" height="4" width="4" x="138" y="138" />

            {/* Grid Data Matrix Blocks */}
            <rect fill="#0F172A" height="8" width="8" x="58" y="14" />
            <rect fill="#0F172A" height="8" width="12" x="74" y="14" />
            <rect fill="#0F172A" height="8" width="8" x="94" y="14" />
            <rect fill="#0F172A" height="8" width="10" x="110" y="14" />
            <rect fill="#0F172A" height="8" width="16" x="58" y="28" />
            <rect fill="#0F172A" height="8" width="8" x="82" y="28" />
            <rect fill="#0F172A" height="8" width="14" x="98" y="28" />
            <rect fill="#0F172A" height="12" width="8" x="14" y="58" />
            <rect fill="#0F172A" height="8" width="12" x="28" y="58" />
            <rect fill="#0F172A" height="8" width="8" x="44" y="58" />
            <rect fill="#0F172A" height="8" width="8" x="58" y="58" />
            <rect fill="#0F172A" height="14" width="14" x="72" y="58" />
            <rect fill="#0F172A" height="8" width="8" x="94" y="58" />
            <rect fill="#0F172A" height="8" width="16" x="110" y="58" />
            <rect fill="#0F172A" height="12" width="8" x="134" y="58" />
            <rect fill="#0F172A" height="8" width="16" x="150" y="58" />
            <rect fill="#0F172A" height="8" width="14" x="14" y="76" />
            <rect fill="#0F172A" height="8" width="16" x="36" y="76" />
            <rect fill="#0F172A" height="16" width="8" x="58" y="76" />
            <rect fill="#0F172A" height="8" width="8" x="72" y="80" />
            <rect fill="#0F172A" height="8" width="16" x="90" y="76" />
            <rect fill="#0F172A" height="16" width="8" x="114" y="76" />
            <rect fill="#0F172A" height="8" width="18" x="130" y="76" />
            <rect fill="#0F172A" height="8" width="10" x="156" y="76" />
            <rect fill="#0F172A" height="14" width="8" x="14" y="98" />
            <rect fill="#0F172A" height="8" width="14" x="30" y="98" />
            <rect fill="#0F172A" height="8" width="14" x="52" y="98" />
            <rect fill="#0F172A" height="8" width="18" x="74" y="98" />
            <rect fill="#0F172A" height="14" width="8" x="100" y="98" />
            <rect fill="#0F172A" height="8" width="16" x="116" y="98" />
            <rect fill="#0F172A" height="14" width="8" x="140" y="98" />
            <rect fill="#0F172A" height="8" width="10" x="156" y="98" />
            <rect fill="#0F172A" height="6" width="12" x="14" y="118" />
            <rect fill="#0F172A" height="6" width="18" x="34" y="118" />
            <rect fill="#0F172A" height="12" width="8" x="60" y="114" />
            <rect fill="#0F172A" height="8" width="16" x="76" y="114" />
            <rect fill="#0F172A" height="6" width="10" x="100" y="118" />
            <rect fill="#0F172A" height="12" width="8" x="120" y="114" />
            <rect fill="#0F172A" height="6" width="14" x="136" y="118" />
            <rect fill="#0F172A" height="12" width="8" x="158" y="114" />
            <rect fill="#0F172A" height="12" width="12" x="58" y="132" />
            <rect fill="#0F172A" height="8" width="8" x="78" y="132" />
            <rect fill="#0F172A" height="8" width="14" x="94" y="132" />
            <rect fill="#0F172A" height="12" width="6" x="116" y="132" />
            <rect fill="#0F172A" height="8" width="8" x="158" y="132" />
            <rect fill="#0F172A" height="16" width="8" x="58" y="150" />
            <rect fill="#0F172A" height="10" width="16" x="74" y="146" />
            <rect fill="#0F172A" height="20" width="8" x="98" y="146" />
            <rect fill="#0F172A" height="14" width="16" x="114" y="152" />
            <rect fill="#0F172A" height="8" width="12" x="138" y="158" />
            <rect fill="#0F172A" height="20" width="8" x="158" y="146" />

            {/* Center Fretrix Emblem Stamp */}
            <rect fill="#F97316" height="28" rx="4" width="28" x="76" y="76" />
            <path
              d="M84 90L88 94L96 84"
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Vehicle Identifier Code */}
        <div className="mt-4 font-mono text-xs text-slate-600">
          MÃ NHẬN DIỆN XE:{' '}
          <strong className="text-slate-900 font-bold">{manifest.gateVehicleId}</strong>
        </div>
      </div>

      {/* Offline Download Safety Button */}
      <div className="w-full mt-6">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm rounded-xl font-bold transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          {downloaded ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>ĐÃ TẢI XUỐNG VÉ OFFLINE (PNG)</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              <span>TẢI VÉ QR VỀ MÁY (PNG OFFLINE)</span>
            </>
          )}
        </button>
        <p className="font-mono text-[11px] text-slate-500 mt-2">
          Lưu ảnh vào thư viện để qua cổng khi mất sóng 4G/LTE
        </p>
      </div>
    </div>
  )
}
