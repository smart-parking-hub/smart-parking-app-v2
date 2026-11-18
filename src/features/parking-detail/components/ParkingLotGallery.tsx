import { useState } from 'react'
import { Images } from 'lucide-react'
import type { ParkingLotImage } from '@/entities/operations'
import { ApiImage } from '@/shared/components/ApiImage'
import { Panel } from '@/shared/components/Workspace'

export function ParkingLotGallery({ images, lotName }: { images: ParkingLotImage[]; lotName: string }) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const ordered = [...images].sort((a, b) => Number(Boolean(b.cover)) - Number(Boolean(a.cover)))
  const selected = ordered.find(image => image.id === selectedId) ?? ordered[0]
  if (!selected) return null

  return <Panel>
    <section aria-label="Hình ảnh bãi đỗ" className="min-w-0 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-sora text-lg font-semibold"><Images size={20} aria-hidden="true"/>Hình ảnh bãi đỗ</h2>
        <span className="shrink-0 rounded-full bg-brand-surface px-3 py-1 text-xs font-medium text-brand-muted">{ordered.length} ảnh</span>
      </header>
      <figure className="space-y-2">
        <div className="h-56 overflow-hidden rounded-xl border border-brand-border bg-brand-surface sm:h-72 [&>img]:h-full [&>img]:rounded-none [&>div]:h-full">
          <ApiImage key={selected.id} path={selected.contentUrl} alt={`Ảnh bãi đỗ ${lotName} – ${selected.originalFileName || `Ảnh ${ordered.indexOf(selected) + 1}`}`}/>
        </div>
        <figcaption className="text-xs text-brand-muted">Ảnh {ordered.indexOf(selected) + 1}/{ordered.length}{selected.cover ? ' · Ảnh đại diện' : ''}</figcaption>
      </figure>
      {ordered.length > 1 && <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Chọn ảnh bãi đỗ">
        {ordered.map((image, index) => <button key={image.id} type="button" onClick={() => setSelectedId(image.id)}
          aria-label={`Xem ảnh ${index + 1} của ${lotName}`} aria-pressed={image.id === selected.id}
          className={`w-20 shrink-0 overflow-hidden rounded-xl border-2 p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:w-24 ${image.id === selected.id ? 'border-brand-primary' : 'border-transparent hover:border-brand-border'}`}>
          <ApiImage path={image.contentUrl} alt=""/>
        </button>)}
      </div>}
    </section>
  </Panel>
}
