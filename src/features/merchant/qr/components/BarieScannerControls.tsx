import { SwitchCamera, Zap, ZapOff, X, CheckSquare, Square } from 'lucide-react'
import type { CameraFacingMode } from '../types/qrScannerTypes'

export interface BarieScannerControlsProps {
  facingMode: CameraFacingMode
  onFacingModeToggle: () => void
  isTorchOn?: boolean
  hasTorchSupport?: boolean
  onTorchToggle?: () => void
  autoSubmit: boolean
  onAutoSubmitToggle: () => void
  onCloseCamera: () => void
  disabled?: boolean
}

export function BarieScannerControls({
  facingMode,
  onFacingModeToggle,
  isTorchOn = false,
  hasTorchSupport = false,
  onTorchToggle,
  autoSubmit,
  onAutoSubmitToggle,
  onCloseCamera,
  disabled = false,
}: BarieScannerControlsProps) {
  return (
    <div
      data-testid="barie-scanner-controls"
      className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/95 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white shadow-md"
    >
      {/* Left controls: Camera switch & Torch */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onFacingModeToggle}
          disabled={disabled}
          aria-label="Đổi camera trước/sau"
          title={`Đang dùng camera: ${facingMode === 'environment' ? 'Sau' : 'Trước'}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <SwitchCamera className="h-4 w-4 text-emerald-400" />
          <span>{facingMode === 'environment' ? 'Camera Sau' : 'Camera Trước'}</span>
        </button>

        {hasTorchSupport && onTorchToggle && (
          <button
            type="button"
            onClick={onTorchToggle}
            disabled={disabled}
            aria-label="Bật/Tắt đèn flash"
            title={isTorchOn ? 'Tắt đèn Flash trợ sáng' : 'Bật đèn Flash trợ sáng'}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
              isTorchOn
                ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {isTorchOn ? (
              <>
                <ZapOff className="h-4 w-4" />
                <span>Tắt Đèn</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-amber-300" />
                <span>Bật Đèn</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Right controls: Auto submit & Close */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAutoSubmitToggle}
          aria-label="Tự động xác nhận sau khi quét"
          aria-pressed={autoSubmit}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
        >
          {autoSubmit ? (
            <CheckSquare className="h-4 w-4 text-emerald-400" />
          ) : (
            <Square className="h-4 w-4 text-slate-500" />
          )}
          <span className="hidden sm:inline">Quét phát ăn ngay</span>
        </button>

        <button
          type="button"
          onClick={onCloseCamera}
          aria-label="Đóng camera"
          className="inline-flex items-center gap-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span>Đóng</span>
        </button>
      </div>
    </div>
  )
}
