import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Navigation, FileText, CheckCircle2 } from 'lucide-react'

interface TerminalActionBarProps {
  onDownloadPdf?: () => void
}

export function TerminalActionBar({ onDownloadPdf }: TerminalActionBarProps) {
  const [pdfDownloaded, setPdfDownloaded] = useState(false)

  const handlePdfClick = () => {
    setPdfDownloaded(true)
    if (onDownloadPdf) {
      onDownloadPdf()
    }
    setTimeout(() => {
      setPdfDownloaded(false)
    }, 2000)
  }

  return (
    <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
      {/* Main Primary Orange Button */}
      <Link
        to="/bookings"
        className="flex-1 h-[52px] bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs cursor-pointer px-4"
      >
        <span>XEM CHI TIẾT TẠI ĐẶT CHỖ CỦA TÔI</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </Link>

      {/* Secondary Navigation Button (Google Maps) */}
      <a
        href="https://maps.google.com/?q=Tan+Cang+Cat+Lai+Gate+2+Ho+Chi+Minh"
        target="_blank"
        rel="noopener noreferrer"
        className="h-[52px] px-6 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs sm:text-sm rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
      >
        <Navigation className="w-4 h-4 text-orange-600" />
        <span>DẪN ĐƯỜNG GOOGLE MAPS</span>
      </a>

      {/* Download Receipt PDF Button */}
      <button
        type="button"
        onClick={handlePdfClick}
        className="h-[52px] px-5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-mono text-xs sm:text-sm rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
      >
        {pdfDownloaded ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-orange-600" />
            <span>ĐANG KẾT XUẤT PDF...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-slate-500" />
            <span>BIÊN LAI ĐIỆN TỬ (PDF)</span>
          </>
        )}
      </button>
    </section>
  )
}
