import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Bot, X, Send } from 'lucide-react'
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
export function AiCopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<
    {
      id: number
      kind: 'user' | 'assistant'
      text: string
      lots?: Reply['suggestedLots']
    }[]
  >([])
  const form = useForm<{ message: string }>()
  const end = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const mutation = useMutation({
    mutationFn: (message: string) =>
      sendData<Reply>('post', '/api/v1/ai/chat', { message }),
    onSuccess: (data) =>
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          kind: 'assistant',
          text: data.reply,
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
  return (
    <div className="fixed bottom-6 right-4 z-40 font-inter sm:right-6">
      {open && (
        <section
          role="region"
          aria-label="Trợ lý AI Copilot"
          onKeyDown={(event) => {
            if (event.key === 'Escape') close()
          }}
          className="mb-3 flex h-[min(560px,75dvh)] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-brand-navy p-4 text-white">
            <div className="flex items-center gap-3">
              <Bot className="text-brand-orange" />
              <div>
                <h2 className="font-sora font-semibold">Trợ lý hành trình</h2>
                <p className="text-xs text-slate-300">SmartTruck AI Copilot</p>
              </div>
            </div>
            <button onClick={close} aria-label="Đóng trợ lý">
              <X size={20} />
            </button>
          </header>
          <div
            role="log"
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {!messages.length && (
              <p className="rounded-xl bg-brand-surface p-4 text-sm leading-6 text-brand-muted">
                Chào bác tài! Bạn cần tìm bãi phù hợp, hỏi về đặt chỗ hay chính
                sách thanh toán?
              </p>
            )}
            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-xl p-3 text-sm leading-6 ${message.kind === 'user' ? 'ml-8 bg-brand-navy text-white' : 'mr-3 bg-brand-surface text-brand-navy'}`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                {message.lots?.map((lot) => (
                  <Link
                    key={lot.lotId}
                    className="mt-3 block rounded-lg border border-brand-border bg-white p-3 text-brand-navy"
                    to={`/parking/${lot.lotId}`}
                  >
                    <strong>{lot.lotName}</strong>
                    <p className="text-xs text-brand-muted">{lot.address}</p>
                    <span className="text-xs">
                      {lot.availableSlots} chỗ trống · Xem bãi →
                    </span>
                  </Link>
                ))}
              </article>
            ))}
            {mutation.isPending && (
              <p className="text-sm text-brand-muted">Trợ lý đang phản hồi…</p>
            )}
            {mutation.isError && (
              <Notice error>{errorMessage(mutation.error)}</Notice>
            )}
            <div ref={end} />
          </div>
          <form
            className="flex gap-2 border-t border-brand-border p-3"
            onSubmit={form.handleSubmit((data) => {
              if (mutation.isPending) return
              setMessages((previous) => [
                ...previous,
                { id: Date.now(), kind: 'user', text: data.message },
              ])
              mutation.mutate(data.message)
              form.reset()
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
              placeholder="Hỏi trợ lý…"
            />
            <button
              aria-label="Gửi câu hỏi"
              className={button}
              disabled={mutation.isPending}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}
      <button
        ref={trigger}
        aria-expanded={open}
        aria-label="Mở trợ lý AI"
        className={`${button} float-right !rounded-full shadow-lg`}
        onClick={() => setOpen(!open)}
      >
        <Bot size={22} />
        Copilot
      </button>
    </div>
  )
}
