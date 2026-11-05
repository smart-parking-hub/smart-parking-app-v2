import type { ReactNode } from 'react'

export function ProfileSection({ id, title, description, children }: {
  id: string; title: string; description: string; children: ReactNode
}) {
  return <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 rounded-2xl border border-brand-border bg-white p-5 sm:p-8">
    <header className="mb-7 border-b border-brand-border pb-5">
      <h2 id={`${id}-title`} className="font-sora text-lg font-semibold tracking-tight text-brand-navy">{title}</h2>
      <p className="mt-2 text-base leading-relaxed text-brand-muted">{description}</p>
    </header>
    {children}
  </section>
}

export const profileInput = 'w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-base leading-6 text-brand-navy outline-none transition-colors focus:border-brand-orange-ink focus:ring-2 focus:ring-brand-orange/20 disabled:bg-brand-surface disabled:text-brand-muted'
export const profileButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-navy-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:opacity-50'

export function ProfileField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return <div className="min-w-0 space-y-2">
    <label htmlFor={id} className="block text-base font-semibold text-brand-navy">{label}</label>
    {children}
    {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
  </div>
}
