import { useNavigate } from 'react-router-dom'
import { Video, QrCode, PhoneCall } from 'lucide-react'
import type { AlprCameraFeed } from '../types/merchantDashboardTypes'

interface AlprGateControllerCardProps {
  feeds: AlprCameraFeed[]
}

export function AlprGateControllerCard({ feeds }: AlprGateControllerCardProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#d95f00] uppercase tracking-wider font-bold">
            ĐIỀU HÀNH THIẾT BỊ CỔNG
          </span>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
            Trạm Barie &amp; Camera ALPR
          </h2>
        </div>
        <Video className="w-5 h-5 text-[#d95f00]" />
      </div>

      {/* Video Stream Live Previews (Simulated Optical ALPR Feed) */}
      <div className="grid grid-cols-2 gap-3">
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="relative bg-[#0d1c2e] rounded-xl aspect-video overflow-hidden flex flex-col justify-between p-2.5 shadow-inner border border-slate-700/50"
          >
            {/* Top camera tag & status */}
            <div className="flex justify-between items-center z-10">
              <span className="font-mono text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider border border-white/10">
                {feed.cameraName}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-ping" />
            </div>

            {/* Bottom detected plate */}
            <div className="z-10 flex flex-col leading-tight">
              <span className="font-mono text-xs text-white font-bold tracking-wide">
                {feed.detectedPlate}
              </span>
              <span className="font-mono text-[10px] text-[#bec6e0]">
                {feed.confidencePercent != null
                  ? `Độ tin cậy: ${feed.confidencePercent}%`
                  : `Barie: ${feed.barrierStatus}`}
              </span>
            </div>

            {/* Simulated scan line overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-black/60 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Direct Operation Button */}
      <button
        type="button"
        onClick={() => navigate('/merchant/qr-scanner')}
        className="w-full h-12 bg-[#0d1c2e] hover:bg-black text-white transition-all text-xs lg:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer tracking-wider"
      >
        <QrCode className="w-5 h-5 text-[#d95f00]" />
        <span>MỞ TRẠM QUÉT QR BARIE CHECK-IN / CHECK-OUT</span>
      </button>

      {/* Technical Support Footer */}
      <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between font-mono text-xs text-[#45464d] border border-blue-50">
        <div className="flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-[#455f87] shrink-0" />
          <span>Hỗ trợ kỹ thuật barie:</span>
        </div>
        <a href="tel:19006868" className="text-[#0d1c2e] font-bold hover:underline">
          1900 6868 (Nhánh 2)
        </a>
      </div>
    </div>
  )
}
