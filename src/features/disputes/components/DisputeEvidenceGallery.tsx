import { useState } from 'react'
import { Eye, FileImage, Paperclip } from 'lucide-react'
import { Dialog } from '@/shared/components/Dialog'

export interface DisputeEvidenceGalleryProps {
  evidenceUrls?: string[]
  localAttachmentRefs?: string[]
}

export function DisputeEvidenceGallery({
  evidenceUrls = [],
  localAttachmentRefs = [],
}: DisputeEvidenceGalleryProps) {
  const [zoomedUrl, setZoomedUrl] = useState<string | null>(null)
  const hasAnyEvidence = evidenceUrls.length > 0 || localAttachmentRefs.length > 0

  if (!hasAnyEvidence) {
    return null
  }

  return (
    <div className="space-y-3 border-t border-slate-100 pt-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Paperclip className="h-4 w-4 text-brand-primary" aria-hidden="true" />
        <span>Hình ảnh &amp; chứng từ đính kèm ({evidenceUrls.length + localAttachmentRefs.length})</span>
      </h3>

      {evidenceUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {evidenceUrls.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setZoomedUrl(url)}
              className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <img
                src={url}
                alt={`Bằng chứng khiếu nại ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white">
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                Phóng to
              </span>
            </button>
          ))}
        </div>
      )}

      {localAttachmentRefs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {localAttachmentRefs.map((refName, idx) => (
            <span
              key={`${refName}-${idx}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800"
            >
              <FileImage className="h-4 w-4 text-brand-primary shrink-0" aria-hidden="true" />
              <span>{refName}</span>
            </span>
          ))}
        </div>
      )}

      {zoomedUrl && (
        <Dialog
          isOpen={Boolean(zoomedUrl)}
          onClose={() => setZoomedUrl(null)}
          title="Xem ảnh bằng chứng"
          maxWidth="lg"
        >
          <div className="flex justify-center rounded-xl bg-slate-950 p-3">
            <img
              src={zoomedUrl}
              alt="Ảnh bằng chứng phóng to"
              className="max-h-[70vh] rounded-lg object-contain"
            />
          </div>
        </Dialog>
      )}
    </div>
  )
}

