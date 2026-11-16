import { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle, SwitchCamera, Zap, ZapOff } from 'lucide-react'
import type { Html5Qrcode as Html5QrcodeType } from 'html5-qrcode'
import {
  parseCameraError,
  isTorchSupported,
  checkCameraSecurityStatus,
} from '../services/mediaDeviceService'
import { notifyScanSuccess } from '../services/audioHapticFeedback'
import { BarieViewfinderOverlay } from './BarieViewfinderOverlay'
import { CameraSecurityNotice } from './CameraSecurityNotice'
import type {
  CameraFacingMode,
  CameraStatus,
  CameraErrorInfo,
} from '../types/qrScannerTypes'

export interface BarieCameraScannerProps {
  onScan: (code: string) => void
  onClose?: () => void
  onError?: (error: CameraErrorInfo) => void
  initialFacingMode?: CameraFacingMode
  onFacingModeChange?: (mode: CameraFacingMode) => void
  autoSubmit?: boolean
  onAutoSubmitChange?: (auto: boolean) => void
  onFocusManualInput?: () => void
}

export function BarieCameraScanner({
  onScan,
  onError,
  initialFacingMode = 'environment',
  onFacingModeChange,
  autoSubmit = true,
  onFocusManualInput,
}: BarieCameraScannerProps) {
  const [facingMode, setFacingMode] =
    useState<CameraFacingMode>(initialFacingMode)
  const [status, setStatus] = useState<CameraStatus>('IDLE')
  const [errorInfo, setErrorInfo] = useState<CameraErrorInfo | null>(null)
  const [isTorchOn, setIsTorchOn] = useState(false)
  const [hasTorchSupport, setHasTorchSupport] = useState(false)
  const [isScanned, setIsScanned] = useState(false)

  const scannerRef = useRef<Html5QrcodeType | null>(null)
  const isStoppingRef = useRef(false)
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const elementIdRef = useRef(`barie-qr-reader-${Math.random().toString(36).substring(2, 9)}`)

  const onScanRef = useRef(onScan)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onScanRef.current = onScan
    onErrorRef.current = onError
  })

  // Check Secure Context upfront
  const securityStatus = checkCameraSecurityStatus()

  // Handle Torch toggle
  const handleTorchToggle = async () => {
    if (!scannerRef.current || !hasTorchSupport) return
    const nextTorch = !isTorchOn
    try {
      await scannerRef.current.applyVideoConstraints({
        // @ts-expect-error - torch is an advanced WebRTC constraint
        advanced: [{ torch: nextTorch }],
      })
      setIsTorchOn(nextTorch)
    } catch {
      setHasTorchSupport(false)
    }
  }

  // Handle Facing Mode toggle
  const handleFacingModeToggle = () => {
    setFacingMode((prev) => {
      const next = prev === 'environment' ? 'user' : 'environment'
      onFacingModeChange?.(next)
      return next
    })
    setIsTorchOn(false)
    setHasTorchSupport(false)
  }

  useEffect(() => {
    if (!securityStatus.isSupported) {
      const err = parseCameraError(new Error('Insecure context on mobile'))
      setErrorInfo(err)
      onErrorRef.current?.(err)
      return
    }

    let isCancelled = false
    isStoppingRef.current = false
    setIsScanned(false)
    setStatus('STARTING')
    setErrorInfo(null)

    const initAndStartScanner = async () => {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        if (isCancelled) return

        const scanner = new Html5Qrcode(elementIdRef.current, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          verbose: false,
        })
        scannerRef.current = scanner

        // Full-frame scanning without qrbox crop ensures instant detection everywhere
        await scanner.start(
          { facingMode },
          {
            fps: 25,
            aspectRatio: 1.777778, // 16:9
            videoConstraints: {
              facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          (decodedText) => {
            if (isCancelled || isStoppingRef.current) return
            const cleanCode = decodedText?.trim()
            if (!cleanCode) return

            isStoppingRef.current = true
            setIsScanned(true)

            // Freeze the camera video frame instantly in place
            try {
              const container = document.getElementById(elementIdRef.current)
              const videoEl = container?.querySelector('video')
              if (videoEl && !videoEl.paused) {
                videoEl.pause()
              }
            } catch {
              // Ignore video pause errors
            }

            // Play crisp feedback sound & haptic vibration
            notifyScanSuccess()

            // Golden 600ms Freeze: Gives operator clear visual feedback before proceeding
            freezeTimerRef.current = setTimeout(() => {
              if (isCancelled) return
              scanner
                .stop()
                .then(() => {
                  scanner.clear()
                })
                .catch(() => {})
                .finally(() => {
                  onScanRef.current(cleanCode)
                })
            }, 600)
          },
          () => {
            // Ignore frame-by-frame non-match errors
          },
        )

        if (isCancelled) {
          if (scanner.isScanning) {
            void scanner.stop().then(() => scanner.clear())
          }
          return
        }

        setStatus('SCANNING')

        // Check torch support on back camera
        try {
          const capabilities = scanner.getRunningTrackCapabilities()
          setHasTorchSupport(isTorchSupported(capabilities))
        } catch {
          setHasTorchSupport(false)
        }
      } catch (err) {
        if (isCancelled) return
        const parsed = parseCameraError(err)
        setErrorInfo(parsed)
        setStatus('ERROR')
        onErrorRef.current?.(parsed)
      }
    }

    void initAndStartScanner()

    return () => {
      isCancelled = true
      isStoppingRef.current = true
      if (freezeTimerRef.current) {
        clearTimeout(freezeTimerRef.current)
      }
      const activeScanner = scannerRef.current
      if (activeScanner) {
        if (activeScanner.isScanning) {
          activeScanner
            .stop()
            .then(() => {
              activeScanner.clear()
            })
            .catch(() => {})
        } else {
          try {
            activeScanner.clear()
          } catch {
            // Ignore clear errors if not mounted
          }
        }
      }
    }
  }, [facingMode, securityStatus.isSupported])

  if (!securityStatus.isSupported) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/95">
        <CameraSecurityNotice onFocusManualInput={onFocusManualInput} />
      </div>
    )
  }

  return (
    <div
      data-testid="barie-camera-scanner-wrapper"
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
    >
      {/* Floating Top-Left Controls: Camera Switch & Flashlight */}
      {status === 'SCANNING' && !isScanned && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={handleFacingModeToggle}
            aria-label="Đổi camera trước/sau"
            title={`Đang dùng: ${facingMode === 'environment' ? 'Camera Sau' : 'Camera Trước'}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md hover:bg-slate-800 active:bg-slate-700 border border-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors cursor-pointer shadow-md"
          >
            <SwitchCamera className="h-3.5 w-3.5 text-emerald-400" />
            <span>{facingMode === 'environment' ? 'Camera Sau' : 'Camera Trước'}</span>
          </button>

          {hasTorchSupport && (
            <button
              type="button"
              onClick={handleTorchToggle}
              aria-label="Bật/Tắt đèn flash"
              title={isTorchOn ? 'Tắt đèn Flash trợ sáng' : 'Bật đèn Flash trợ sáng'}
              className={`inline-flex items-center gap-1.5 rounded-lg backdrop-blur-md border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer shadow-md ${
                isTorchOn
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-200'
              }`}
            >
              {isTorchOn ? (
                <>
                  <ZapOff className="h-3.5 w-3.5" />
                  <span>Tắt Đèn</span>
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 text-amber-300" />
                  <span>Bật Đèn</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Container for html5-qrcode video element with shaded region suppressed */}
      <div
        id={elementIdRef.current}
        className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_#qr-shaded-region]:!hidden"
      />

      {/* Viewfinder Overlay with Neon Emerald Frame & Laser / Success Pulse */}
      {status === 'SCANNING' && (
        <BarieViewfinderOverlay
          statusText={
            autoSubmit
              ? 'Đang dò mã QR (Tự động xác nhận)...'
              : 'Đang dò mã QR...'
          }
          isScanning={!isScanned}
          isSuccess={isScanned}
        />
      )}

      {/* Loading Spinner */}
      {status === 'STARTING' && (
        <div
          data-testid="camera-loading-state"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1120]/90 backdrop-blur-xs gap-3 text-emerald-400"
        >
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xs font-semibold tracking-wide text-slate-300">
            Đang kết nối camera cổng Barie...
          </span>
        </div>
      )}

      {/* Error Alert Overlay */}
      {status === 'ERROR' && errorInfo && (
        <div
          data-testid="camera-error-state"
          role="alert"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center gap-3"
        >
          <div className="rounded-xl bg-rose-500/20 p-2.5 text-rose-400 border border-rose-500/30">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h5 className="text-sm font-bold text-white tracking-tight">
            {errorInfo.title}
          </h5>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            {errorInfo.message}
          </p>
          {errorInfo.canRetry && (
            <button
              type="button"
              onClick={() => {
                setErrorInfo(null)
                setStatus('STARTING')
                setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
              }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              Thử lại với Camera khác
            </button>
          )}
        </div>
      )}
    </div>
  )
}
