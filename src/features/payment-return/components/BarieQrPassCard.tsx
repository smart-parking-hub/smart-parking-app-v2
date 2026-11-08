import { useState } from 'react'
import { QrCode, Download, CheckCircle2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
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
    const svg = document.getElementById('barie-qr-svg') as SVGSVGElement | null
    if (svg) {
      try {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        canvas.width = 300
        canvas.height = 300
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 10, 10, 280, 280)
            const pngUrl = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = `QR-Barie-${manifest.bookingCode}.png`
            a.click()
          }
          img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
        }
      } catch {
        // Fallback for non-browser environment
      }
    }
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

        {/* Real Dynamic QR Container */}
        <div
          data-testid="barie-qr-container"
          className="p-3.5 bg-white rounded-2xl shadow-md border border-slate-200/80 flex items-center justify-center relative hover:scale-[1.02] transition-transform"
        >
          <QRCodeSVG
            id="barie-qr-svg"
            value={manifest.bookingCode}
            size={180}
            level="M"
            marginSize={2}
            role="img"
            aria-label={`Barie QR Pass ${manifest.bookingCode}`}
          />
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
