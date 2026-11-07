import { forwardRef, useImperativeHandle, useRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { control } from './Workspace'

interface AutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  id: string
  options: readonly string[]
  value: string
  onValueChange: (value: string) => void
  leadingIcon?: ReactNode
  renderOption?: (option: string) => ReactNode
  optionSearchText?: (option: string) => string
  suggestionHint?: string
  emptyMessage?: string
}

/** Editable suggestions: selection is optional and arbitrary text remains valid. */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  { id, options, value, onValueChange, disabled, className = '', leadingIcon, renderOption, optionSearchText, suggestionHint = 'Gợi ý · Có thể nhập tên khác', emptyMessage = 'Không có gợi ý phù hợp. Bạn có thể dùng tên vừa nhập.', ...inputProps }, ref,
) {
  const input = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => input.current!)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const normalize = (text: string) => text.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
  const matches = options.filter(option => normalize(optionSearchText?.(option) ?? option).includes(normalize(value.trim())))
  const expanded = open && !disabled
  const listId = `${id}-suggestions`
  const choose = (option: string) => {
    onValueChange(option)
    input.current?.focus()
    setActive(-1)
    setOpen(false)
  }

  return <div className="relative" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActive(-1) }
  }}>
    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-brand-muted">
      {leadingIcon ?? <Search size={17} />}
    </span>
    <input {...inputProps} id={id} ref={input} role="combobox" aria-autocomplete="list"
      aria-expanded={expanded} aria-controls={listId}
      aria-activedescendant={expanded && active >= 0 && active < matches.length ? `${listId}-${active}` : undefined}
      autoComplete="off" disabled={disabled} value={value} className={`${control} pl-10 pr-11 ${className}`}
      onFocus={event => { setOpen(true); inputProps.onFocus?.(event) }}
      onChange={event => { onValueChange(event.target.value); setOpen(true); setActive(-1) }}
      onKeyDown={event => {
        if (event.nativeEvent.isComposing) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          setOpen(true)
          const next = !expanded || active < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1)
            : (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length
          setActive(matches.length ? next : -1)
          document.getElementById(`${listId}-${next}`)?.scrollIntoView?.({ block: 'nearest' })
        } else if (event.key === 'Enter' && expanded && matches[active]) {
          event.preventDefault(); choose(matches[active])
        } else if (event.key === 'Escape' && expanded) {
          event.preventDefault(); event.stopPropagation(); setOpen(false); setActive(-1)
        } else if (event.key === 'Tab') { setOpen(false); setActive(-1) }
        inputProps.onKeyDown?.(event)
      }} />
    <button type="button" tabIndex={-1} disabled={disabled} aria-label="Hiện gợi ý" aria-controls={listId} aria-expanded={expanded}
      className="absolute right-1 top-1 flex h-10 w-9 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-surface disabled:opacity-50"
      onMouseDown={event => event.preventDefault()}
      onClick={() => { const next = !expanded; input.current?.focus(); setOpen(next); setActive(-1) }}>
      <ChevronDown size={17} aria-hidden="true" className={expanded ? 'rotate-180' : ''} />
    </button>
    {expanded && <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-brand-border bg-white text-brand-navy shadow-lg">
      <p className="border-b border-brand-border px-4 py-2 text-xs font-semibold text-brand-muted">{suggestionHint}</p>
      <ul id={listId} role="listbox" aria-label="Danh sách gợi ý" className="max-h-52 overflow-y-auto overscroll-contain p-1.5">
        {matches.map((option, index) => <li key={option} role="presentation">
          <button id={`${listId}-${index}`} type="button" role="option" tabIndex={-1} aria-selected={active === index}
            className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm ${active === index ? 'bg-brand-orange/10 font-semibold text-brand-orange-ink' : 'text-brand-navy hover:bg-brand-surface'}`}
            onMouseDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={() => choose(option)}>
            {renderOption?.(option) ?? option}{value === option && <Check size={16} aria-hidden="true" className="text-brand-orange-ink" />}
          </button>
        </li>)}
      </ul>
      {!matches.length && <p role="status" className="px-4 pb-4 text-sm text-brand-muted">{emptyMessage}</p>}
    </div>}
  </div>
})
