import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Brain,
  Truck,
  Flame,
  CornerDownRight,
  CheckCircle2,
  Tag,
  ChevronDown,
  ChevronUp,
  Building2,
  ShoppingBag,
  RotateCcw,
  Copy,
  Check,
  Edit3,
} from 'lucide-react'
import type { AiContentSegments, ParkingLotArchetype } from '../types/merchantParkingLotTypes'

interface ArchetypeConfig {
  id: ParkingLotArchetype
  label: string
  sublabel: string
  icon: typeof Building2
  presetTags: string[]
}

const ARCHETYPES: ArchetypeConfig[] = [
  {
    id: 'URBAN',
    label: 'Đô thị & Tòa nhà',
    sublabel: 'Ô tô con, xe máy, gửi theo giờ/tháng',
    icon: Building2,
    presetTags: [
      'Bảo vệ 24/7',
      'Mái che toàn bãi',
      'Trạm sạc xe điện',
      'Camera ALPR',
      'Giữ xe qua đêm',
      'Rửa xe tiện ích',
    ],
  },
  {
    id: 'MALL',
    label: 'TTTM & Dịch vụ',
    sublabel: 'Lưu lượng cao, mua sắm, ẩm thực',
    icon: ShoppingBag,
    presetTags: [
      'Miễn phí 30p đầu',
      'Thanh toán QR không tiền mặt',
      'Camera ALPR nhận diện nhanh',
      'Thang máy kết nối TTTM',
      'Hầm xe rộng rãi',
      'Chỉ dẫn lối đỗ trống',
    ],
  },
  {
    id: 'LOGISTICS',
    label: 'Depot & Tiếp vận',
    sublabel: 'Xe tải nặng, container, cẩu giàn',
    icon: Truck,
    presetTags: [
      'Mặt bằng chịu lực 60T',
      'Điện lạnh Reefer 380V',
      'Camera ALPR',
      'Bảo vệ 24/7',
      'PCCC trụ D65 áp lực cao',
      'Gần cảng & cao tốc',
    ],
  },
]

interface CreateParkingLotAiWidgetProps {
  currentAiContent: AiContentSegments
  onGenerateNewAiContent: (customHighlights?: string, archetype?: ParkingLotArchetype) => Promise<void>
  onApplyAiContent: (content: AiContentSegments) => void
  onContentChange?: (content: AiContentSegments) => void
  isApplied: boolean
  initialHighlights?: string
  onHighlightsChange?: (highlights: string) => void
  initialArchetype?: ParkingLotArchetype
  onArchetypeChange?: (archetype: ParkingLotArchetype) => void
  collapsible?: boolean
  defaultExpanded?: boolean
}

export function CreateParkingLotAiWidget({
  currentAiContent,
  onGenerateNewAiContent,
  onApplyAiContent,
  onContentChange,
  isApplied,
  initialHighlights = '',
  onHighlightsChange,
  initialArchetype = 'URBAN',
  onArchetypeChange,
  collapsible = true,
  defaultExpanded = true,
}: CreateParkingLotAiWidgetProps) {
  const [archetype, setArchetype] = useState<ParkingLotArchetype>(initialArchetype)
  const [highlights, setHighlights] = useState(initialHighlights)
  const [editableContent, setEditableContent] = useState<AiContentSegments>(currentAiContent)
  const [generating, setGenerating] = useState(false)
  const [justApplied, setJustApplied] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setHighlights(initialHighlights)
  }, [initialHighlights])

  useEffect(() => {
    setEditableContent(currentAiContent)
  }, [currentAiContent])

  useEffect(() => {
    setArchetype(initialArchetype)
  }, [initialArchetype])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const currentConfig = ARCHETYPES.find((a) => a.id === archetype) || ARCHETYPES[0]

  const handleSelectArchetype = (newArch: ParkingLotArchetype) => {
    setArchetype(newArch)
    onArchetypeChange?.(newArch)
  }

  const handleHighlightsChange = (newVal: string) => {
    if (newVal.length <= 500) {
      setHighlights(newVal)
      onHighlightsChange?.(newVal)
    }
  }

  const handleToggleTag = (tag: string) => {
    const parts = highlights
      .split(/[,;\n]+/)
      .map((p) => p.trim())
      .filter(Boolean)
    const exists = parts.some((p) => p.toLowerCase() === tag.toLowerCase())
    let next: string
    if (exists) {
      next = parts.filter((p) => p.toLowerCase() !== tag.toLowerCase()).join(', ')
    } else {
      next = parts.length > 0 ? `${parts.join(', ')}, ${tag}` : tag
    }
    if (next.length <= 500) {
      setHighlights(next)
      onHighlightsChange?.(next)
    }
  }

  const isTagActive = (tag: string) => {
    return highlights
      .toLowerCase()
      .split(/[,;\n]+/)
      .map((p) => p.trim())
      .includes(tag.toLowerCase())
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await onGenerateNewAiContent(highlights, archetype)
    } finally {
      setGenerating(false)
    }
  }

  const handleApply = () => {
    onApplyAiContent(editableContent)
    setJustApplied(true)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setJustApplied(false)
    }, 2500)
  }

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      copyTimerRef.current = setTimeout(() => {
        setCopiedKey(null)
      }, 2000)
    }
  }

  const handleSegmentChange = (key: keyof AiContentSegments, value: string) => {
    setEditableContent((prev) => {
      const next = { ...prev, [key]: value }
      onContentChange?.(next)
      return next
    })
  }

  const handleResetSegment = (key: keyof AiContentSegments) => {
    setEditableContent((prev) => {
      const next = {
        ...prev,
        [key]: currentAiContent[key],
      }
      onContentChange?.(next)
      return next
    })
  }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-4 transition-all">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${
          expanded ? 'pb-3 border-b border-slate-100' : ''
        } ${collapsible ? 'cursor-pointer select-none' : ''}`}
        onClick={collapsible ? () => setExpanded((prev) => !prev) : undefined}
        role={collapsible ? 'button' : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? expanded : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setExpanded((prev) => !prev)
                }
              }
            : undefined
        }
      >
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
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-[#341100] text-[#d95f00] font-mono text-[10px] font-bold border border-[#d95f00]/30">
            AI READY
          </span>
          {collapsible && (
            <span
              className="text-slate-400 hover:text-slate-600 p-1 flex items-center"
              aria-label={expanded ? 'Thu gọn trợ lý AI' : 'Mở rộng trợ lý AI'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <>
          <p className="text-xs text-slate-600 leading-relaxed">
            Chọn loại hình bãi đỗ thực tế và bổ sung tiện ích để AI tổng hợp bản mô tả vận hành chuẩn mực nhất. Bạn có thể tự do chỉnh sửa nội dung bên dưới trước khi áp dụng.
          </p>

          {/* Archetype Selector */}
          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-[11px] font-semibold text-slate-700">
              1. Chọn mô hình bãi đỗ thực tế
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {ARCHETYPES.map((arch) => {
                const Icon = arch.icon
                const active = archetype === arch.id
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => handleSelectArchetype(arch.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#341100]/10 border-[#d95f00] ring-1 ring-[#d95f00]'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        active ? 'bg-[#d95f00] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <strong className={`block text-xs font-semibold ${active ? 'text-[#d95f00]' : 'text-slate-800'}`}>
                        {arch.label}
                      </strong>
                      <span className="text-[10px] text-slate-500 line-clamp-1 block">
                        {arch.sublabel}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Highlights & Suggestion Tags Section */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="custom-highlights-input"
                className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-[#d95f00]" />
                2. Tiện ích gợi ý &amp; Điểm nhấn riêng
              </label>
              <span className="text-[10px] font-mono text-slate-600">
                {highlights.length}/500 ký tự
              </span>
            </div>

            {/* Preset Tags based on Archetype */}
            <div className="flex flex-wrap gap-1.5">
              {currentConfig.presetTags.map((tag) => {
                const active = isTagActive(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                      active
                        ? 'bg-[#341100] text-[#d95f00] border-[#d95f00]/40 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </button>
                )
              })}
            </div>

            {/* Highlights Textarea */}
            <textarea
              id="custom-highlights-input"
              value={highlights}
              onChange={(e) => handleHighlightsChange(e.target.value)}
              placeholder="Nhập thêm điểm nhấn đặc thù (vd: Gần trạm metro số 1, hầm B1 thông thoáng, cà phê chờ miễn phí...)"
              rows={2}
              maxLength={500}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#d95f00] focus:ring-1 focus:ring-[#d95f00] bg-slate-50/50 resize-none transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Button Generate */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-2.5 px-4 rounded-xl bg-[#eff4ff] hover:bg-[#d5e3fc] text-[#0d1c2e] transition-colors text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 shadow-2xs"
          >
            <Brain className={`w-4 h-4 text-[#d95f00] ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'ĐANG PHÂN TÍCH & TỐI ƯU MÔ TẢ...' : 'Sinh Lại Nội Dung Bằng AI'}</span>
          </button>

          {/* Inline Editable Segments List */}
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-[#d95f00]" />
                3. Xem trước &amp; Tự do chỉnh sửa nội dung
              </span>
              <span className="text-[10px] text-slate-500 italic">
                Bạn có thể gõ sửa trực tiếp vào từng ô
              </span>
            </div>

            {/* Segment 1: Logistics / Space Capacity */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  1. Khả Năng Tiếp Vận &amp; Hạ Tầng
                </span>
                <div className="flex items-center gap-1.5">
                  {editableContent.logisticsCapacity !== currentAiContent.logisticsCapacity && (
                    <button
                      type="button"
                      onClick={() => handleResetSegment('logisticsCapacity')}
                      title="Khôi phục gợi ý gốc của AI"
                      className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Gốc
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(editableContent.logisticsCapacity, 'capacity')}
                    title="Sao chép nội dung"
                    className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200"
                  >
                    {copiedKey === 'capacity' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <textarea
                aria-label="Khả Năng Tiếp Vận"
                value={editableContent.logisticsCapacity}
                onChange={(e) => handleSegmentChange('logisticsCapacity', e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#d95f00] bg-white text-[#0d1c2e] leading-relaxed resize-y font-sans placeholder:text-slate-400"
                placeholder="Nhập mô tả năng lực tiếp vận và không gian bãi..."
              />
            </div>

            {/* Segment 2: Safety & Fire Prevention */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  2. Nội Quy PCCC &amp; An Toàn
                </span>
                <div className="flex items-center gap-1.5">
                  {editableContent.safetyRegulations !== currentAiContent.safetyRegulations && (
                    <button
                      type="button"
                      onClick={() => handleResetSegment('safetyRegulations')}
                      title="Khôi phục gợi ý gốc của AI"
                      className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Gốc
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(editableContent.safetyRegulations, 'regulations')}
                    title="Sao chép nội dung"
                    className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200"
                  >
                    {copiedKey === 'regulations' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <textarea
                aria-label="Nội Quy PCCC & An Toàn"
                value={editableContent.safetyRegulations}
                onChange={(e) => handleSegmentChange('safetyRegulations', e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#d95f00] bg-white text-[#0d1c2e] leading-relaxed resize-y font-sans placeholder:text-slate-400"
                placeholder="Nhập quy định an toàn PCCC và lưu ý đỗ xe..."
              />
            </div>

            {/* Segment 3: Circulation Guide */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#d95f00] font-bold uppercase flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  3. Phân Luồng Xe Tiếp Cận Cổng
                </span>
                <div className="flex items-center gap-1.5">
                  {editableContent.circulationGuide !== currentAiContent.circulationGuide && (
                    <button
                      type="button"
                      onClick={() => handleResetSegment('circulationGuide')}
                      title="Khôi phục gợi ý gốc của AI"
                      className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Gốc
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopy(editableContent.circulationGuide, 'wayfinding')}
                    title="Sao chép nội dung"
                    className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-200"
                  >
                    {copiedKey === 'wayfinding' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <textarea
                aria-label="Phân Luồng Xe Tiếp Cận Cổng"
                value={editableContent.circulationGuide}
                onChange={(e) => handleSegmentChange('circulationGuide', e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#d95f00] bg-white text-[#0d1c2e] leading-relaxed resize-y font-sans placeholder:text-slate-400"
                placeholder="Nhập hướng dẫn luồng xe tiếp cận cổng..."
              />
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
                <span>{isApplied ? 'Nội Dung Đã Được Áp Dụng (Bấm Để Cập Nhật Lại)' : 'Áp Dụng Nội Dung AI Vào Hồ Sơ'}</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  )
}
