import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Bot, X, Send, MapPin, Sparkles } from 'lucide-react'
import { sendData, errorMessage } from '@/shared/api/resources'
import { button, control, Notice } from '@/shared/components/Workspace'

interface Reply {
  reply: string
  source: string
  suggestedLots: {
    lotId: number
    lotName: string
    address: string
    availableSlots: number
    pricePerHour: number
  }[]
}

interface ChatMessage {
  id: string
  kind: 'user' | 'assistant'
  text: string
  source?: string
  lots?: Reply['suggestedLots']
}

export function AiCopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const location = useLocation()

  // 1. Tự động bóc tách ID bãi xe từ URL path nếu có (vd: /parking/1, /dashboard/parking/1, /merchant/parking-lots/1)
  const lotIdMatch = location.pathname.match(/\/(?:parking|merchant\/parking-lots)\/(\d+)/i)
  const currentUrlLotId = lotIdMatch ? Number(lotIdMatch[1]) : undefined

  const [activeLotId, setActiveLotId] = useState<number | undefined>(currentUrlLotId)

  // Tự động cập nhật ngữ cảnh khi URL thay đổi
  useEffect(() => {
    setActiveLotId(currentUrlLotId)
  }, [currentUrlLotId])

  const form = useForm<{ message: string }>()
  const end = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement | null>(null)

  // 2. Mutation gửi câu hỏi kèm parkingLotId nếu có để kích hoạt Dynamic Lot Context RAG
  const mutation = useMutation({
    mutationFn: (payload: { message: string; parkingLotId?: number }) =>
      sendData<Reply>('post', '/api/v1/ai/chat', payload),
    onSuccess: (data) =>
      setMessages((previous) => [
        ...previous,
        {
          id: `asst-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          kind: 'assistant',
          text: data.reply,
          source: data.source,
          lots: data.suggestedLots,
        },
      ]),
  })

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [messages, open])

  useEffect(() => {
    if (open) input.current?.focus()
  }, [open])

  const registration = form.register('message', {
    required: true,
    maxLength: 2000,
    validate: (value) => !!value.trim(),
  })

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  const handleSendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || mutation.isPending) return

    setMessages((previous) => [
      ...previous,
      {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind: 'user',
        text: trimmed,
      },
    ])
    mutation.mutate({
      message: trimmed,
      parkingLotId: activeLotId,
    })
    form.reset()
  }

  // 3. Quick prompts thích ứng theo ngữ cảnh bãi xe hiện tại
  const lotQuickPrompts = [
    'Biểu phí bãi này tính thế nào?',
    'Phí phạt quá giờ là bao nhiêu?',
    'Quy định giữ chỗ tối đa 10 phút?',
  ]

  const generalQuickPrompts = [
    'Tìm bãi đỗ xe gần tôi còn chỗ',
    'Chính sách hủy chỗ & hoàn tiền?',
    'Hỗ trợ đỗ xe container ra sao?',
  ]

  const quickPrompts = activeLotId ? lotQuickPrompts : generalQuickPrompts

  return (
    <div className="fixed bottom-6 right-4 z-40 font-inter sm:right-6">
      {open && (
        <section
          role="region"
          aria-label="Trợ lý AI Copilot"
          onKeyDown={(event) => {
            if (event.key === 'Escape') close()
          }}
          className="mb-3 flex h-[min(580px,78dvh)] w-[min(410px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between bg-brand-navy p-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#341100] text-[#d95f00]">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="font-sora text-sm font-semibold leading-tight">
                  SmartParking AI Copilot
                </h2>
                <p className="text-[11px] text-slate-300">
                  Trợ lý điều hướng &amp; tư vấn bến bãi
                </p>
              </div>
            </div>
            <button
              onClick={close}
              aria-label="Đóng trợ lý"
              className="rounded-lg p-1 text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </header>

          {/* Context Banner: Hiển thị khi đang xem bãi xe cụ thể */}
          {activeLotId && (
            <div className="flex items-center justify-between bg-blue-50/90 px-3.5 py-2 text-xs text-blue-800 border-b border-blue-200/80">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <MapPin size={13} className="shrink-0 text-blue-600" />
                <span className="truncate">Hỗ trợ riêng cho Bãi xe #{activeLotId}</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveLotId(undefined)}
                className="ml-2 rounded px-1.5 py-0.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                title="Quay về hỏi đáp chính sách chung"
              >
                Hỏi chung ✕
              </button>
            </div>
          )}

          {/* Message List */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-3.5"
          >
            {!messages.length && (
              <div className="rounded-xl bg-brand-surface p-3.5 text-xs leading-relaxed text-brand-muted space-y-1.5 border border-slate-100">
                <p className="font-medium text-brand-navy">
                  Chào bạn! Tôi là SmartParking AI Copilot.
                </p>
                <p>
                  Tôi có thể hỗ trợ bạn tìm kiếm bãi xe còn chỗ trống thời gian thực,
                  tra cứu biểu phí từng bãi, hoặc giải đáp các quy định giữ chỗ và hoàn tiền.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-xl p-3 text-xs leading-relaxed ${
                  message.kind === 'user'
                    ? 'ml-8 bg-brand-navy text-white'
                    : 'mr-3 bg-brand-surface text-brand-navy border border-slate-100'
                }`}
              >
                {/* Source Badge */}
                {message.source && message.kind === 'assistant' && (
                  <div className="mb-1.5 flex items-center gap-1.5">
                    {message.source === 'DYNAMIC_LOT_RAG' && (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">
                        <MapPin size={10} /> Bãi xe #{activeLotId || ''}
                      </span>
                    )}
                    {message.source === 'POLICY_FAQ' && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        📋 Chính sách &amp; Quy định
                      </span>
                    )}
                    {message.source === 'REALTIME_SLOTS' && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        ⚡ Slot thời gian thực
                      </span>
                    )}
                    {message.source === 'GENERAL' && (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                        🤖 AI Copilot
                      </span>
                    )}
                  </div>
                )}

                <p className="whitespace-pre-wrap">{message.text}</p>

                {/* Suggested Lots Cards */}
                {message.lots && message.lots.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    {message.lots.map((lot) => (
                      <Link
                        key={lot.lotId}
                        className="block rounded-xl border border-brand-border bg-white p-2.5 text-brand-navy hover:border-[#d95f00]/40 transition-colors shadow-2xs"
                        to={`/parking/${lot.lotId}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-xs font-semibold truncate">
                            {lot.lotName}
                          </strong>
                          {lot.pricePerHour ? (
                            <span className="text-[11px] font-bold text-emerald-700 shrink-0">
                              {lot.pricePerHour.toLocaleString('vi-VN')} đ/h
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] text-brand-muted line-clamp-1">
                          {lot.address}
                        </p>
                        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px]">
                          <span className="font-semibold text-emerald-700">
                            Còn {lot.availableSlots} chỗ trống
                          </span>
                          <span className="font-semibold text-[#d95f00] hover:underline">
                            Đặt chỗ ngay →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {mutation.isPending && (
              <div className="flex items-center gap-2 rounded-xl bg-brand-surface p-2.5 text-xs text-brand-muted mr-8">
                <Sparkles size={14} className="animate-spin text-[#d95f00]" />
                <span>AI Copilot đang phân tích &amp; phản hồi…</span>
              </div>
            )}

            {mutation.isError && (
              <Notice error>{errorMessage(mutation.error)}</Notice>
            )}
            <div ref={end} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-slate-50/70 p-2.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={mutation.isPending}
                onClick={() => handleSendMessage(prompt)}
                className="rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-[#d95f00]/40 hover:bg-orange-50/40 hover:text-brand-navy transition-all cursor-pointer disabled:opacity-50 text-left"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            className="flex gap-2 border-t border-brand-border p-3 bg-white"
            onSubmit={form.handleSubmit((data) => {
              handleSendMessage(data.message)
            })}
          >
            <input
              {...registration}
              ref={(element) => {
                registration.ref(element)
                input.current = element
              }}
              aria-label="Câu hỏi cho trợ lý"
              className={control}
              placeholder={
                activeLotId
                  ? `Hỏi về Bãi xe #${activeLotId} (giá, slot, quy định)...`
                  : 'Hỏi bãi xe, slot trống, phí quá giờ...'
              }
            />
            <button
              type="submit"
              aria-label="Gửi câu hỏi"
              className={button}
              disabled={mutation.isPending}
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      {/* Floating Trigger Button */}
      <button
        ref={trigger}
        aria-expanded={open}
        aria-label="Mở trợ lý AI"
        className={`${button} float-right !rounded-full shadow-lg cursor-pointer flex items-center gap-2 px-4 py-2.5`}
        onClick={() => setOpen(!open)}
      >
        <Bot size={20} />
        <span className="font-semibold text-xs">Copilot</span>
        {activeLotId && (
          <span className="flex h-2 w-2 rounded-full bg-blue-300 animate-pulse" />
        )}
      </button>
    </div>
  )
}
