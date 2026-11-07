import { useState, useRef, useEffect } from 'react'
import { Sparkles, Brain, Check, Truck, Flame, CornerDownRight, CheckCircle2 } from 'lucide-react'
import type { AiContentSegments } from '../types/merchantParkingLotTypes'

interface CreateParkingLotAiWidgetProps {
  currentAiContent: AiContentSegments
  onGenerateNewAiContent: () => Promise<void>
  onApplyAiContent: (content: AiContentSegments) => void
  isApplied: boolean
}

export function CreateParkingLotAiWidget({
  currentAiContent,
  onGenerateNewAiContent,
  onApplyAiContent,
  isApplied,
}: CreateParkingLotAiWidgetProps) {
  const [generating, setGenerating] = useState(false)
  const [justApplied, setJustApplied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await onGenerateNewAiContent()
    } finally {
      setGenerating(false)
    }
  }

  const handleApply = () => {
    onApplyAiContent(currentAiContent)
    setJustApplied(true)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setJustApplied(false)
    }, 2500)
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#341100] text-[#d95f00] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sora text-sm sm:text-base text-[#0d1c2e] font-bold">
              Trợ Lý AI Hỗ Trợ Khai Báo
            </h3>
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">
              ENGINE: FRETRIX-DISPATCH-V3
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-[#341100] text-[#d95f00] font-mono text-[10px] font-bold border border-[#d95f00]/30">
          AI READY
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Tự động tổng hợp bản mô tả vận hành bãi đỗ chuyên nghiệp dựa trên tọa độ mặt bằng, hạ tầng tiếp vận và tiêu chuẩn tiếp nhận đầu kéo container.
      </p>

      {/* Button Generate */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc] text-[#0d1c2e] transition-colors text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 shadow-2xs"
      >
        <Brain className={`w-4 h-4 text-[#d95f00] ${generating ? 'animate-spin' : ''}`} />
        <span>{generating ? 'ĐANG TỐI ƯU HÓA MÔ TẢ LOGISTICS...' : 'Sinh Lại Nội Dung Bằng AI'}</span>
      </button>

      {/* Generated Segments List */}
      <div className="flex flex-col gap-3 mt-1">
        {/* Segment 1: Logistics Capacity */}
        <div className="p-3 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              1. Khả Năng Tiếp Vận
            </span>
            <Check className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-xs text-[#0d1c2e] leading-relaxed">
            "{currentAiContent.logisticsCapacity}"
          </p>
        </div>

        {/* Segment 2: Safety & Fire Prevention */}
        <div className="p-3 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              2. Nội Quy PCCC &amp; An Toàn
            </span>
            <Check className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-xs text-[#0d1c2e] leading-relaxed">
            "{currentAiContent.safetyRegulations}"
          </p>
        </div>

        {/* Segment 3: Circulation Guide */}
        <div className="p-3 rounded-xl bg-[#eff4ff] border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5" />
              3. Phân Luồng Xe Tiếp Cận Cổng
            </span>
            <Check className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-xs text-[#0d1c2e] leading-relaxed">
            "{currentAiContent.circulationGuide}"
          </p>
        </div>
      </div>

      {/* Button Apply */}
      <button
        type="button"
        onClick={handleApply}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
          isApplied || justApplied
            ? 'bg-[#0d1c2e] text-[#ffb690] border border-[#d95f00]'
            : 'bg-[#d95f00] hover:bg-[#b84e00] text-white'
        }`}
      >
        {justApplied ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#ffb690]" />
            <span>Đã Áp Dụng Vào Hồ Sơ Bãi Đỗ!</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{isApplied ? 'Nội Dung Đã Được Áp Dụng' : 'Áp Dụng Nội Dung AI Vào Hồ Sơ'}</span>
          </>
        )}
      </button>
    </div>
  )
}
