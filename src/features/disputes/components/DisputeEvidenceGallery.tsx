import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Eye, FileImage, Loader2, Paperclip, RotateCw } from 'lucide-react'
import { apiClient } from '@/shared/api/client'
import { Dialog } from '@/shared/components/Dialog'
import { extractEvidenceImageApiPath } from '../api/driverDisputesApi'

export interface DisputeEvidenceGalleryProps {
  evidenceUrls?: string[]
  localAttachmentRefs?: string[]
}

function useProtectedEvidenceObjectUrl(apiPath: string | null) {
  const [objectUrl, setObjectUrl] = useState<string>('')

  const query = useQuery({
    queryKey: ['dispute-evidence-image', apiPath],
    queryFn: async () => {
      const response = await apiClient.get<Blob>(apiPath!, { responseType: 'blob' })
      return response.data
    },
    enabled: Boolean(apiPath),
    staleTime: 5 * 60_000,
    retry: 1,
  })

  useEffect(() => {
    if (!query.data || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      setObjectUrl('')
      return undefined
    }
    const created = URL.createObjectURL(query.data)
    setObjectUrl(created)
    return () => {
      try {
        URL.revokeObjectURL(created)
      } catch {
        // Ignore cleanup issues in test environments
      }
    }
  }, [query.data])

  return {
    objectUrl,
    isPending: Boolean(apiPath) && (query.isPending || (!objectUrl && !query.isError)),
    isError: Boolean(apiPath) && query.isError,
    refetch: query.refetch,
  }
}

function EvidenceThumbnailTile({
  url,
  index,
  onZoom,
}: {
  url: string
  index: number
  onZoom: (targetUrl: string) => void
}) {
  const apiPath = extractEvidenceImageApiPath(url)
  const protectedImage = useProtectedEvidenceObjectUrl(apiPath)
  const [externalError, setExternalError] = useState(false)

  const resolvedSrc = apiPath ? protectedImage.objectUrl : url
  const showLoading = Boolean(apiPath) && protectedImage.isPending
  const showError = apiPath ? protectedImage.isError : externalError

  if (showLoading) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-brand-primary" aria-hidden="true" />
        <span>Đang tải ảnh…</span>
      </div>
    )
  }

  if (showError || !resolvedSrc) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-600">
        <AlertCircle className="h-4 w-4 text-rose-500" aria-hidden="true" />
        <span>Không tải được ảnh {index + 1}</span>
        {apiPath && (
          <button
            type="button"
            onClick={() => void protectedImage.refetch()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCw className="h-3 w-3" aria-hidden="true" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onZoom(url)}
      className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <img
        src={resolvedSrc}
        alt={`Bằng chứng khiếu nại ${index + 1}`}
        onError={() => {
          if (!apiPath) setExternalError(true)
        }}
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-white">
        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        Phóng to
      </span>
    </button>
  )
}

function EvidenceLightboxImage({ url }: { url: string }) {
  const apiPath = extractEvidenceImageApiPath(url)
  const protectedImage = useProtectedEvidenceObjectUrl(apiPath)
  const resolvedSrc = apiPath ? protectedImage.objectUrl : url

  if (apiPath && protectedImage.isPending) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
        <span>Đang tải ảnh…</span>
      </div>
    )
  }

  if ((apiPath && protectedImage.isError) || !resolvedSrc) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-rose-300">
        Không thể hiển thị ảnh bằng chứng này.
      </div>
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt="Ảnh bằng chứng phóng to"
      className="max-h-[70vh] rounded-lg object-contain"
    />
  )
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
            <EvidenceThumbnailTile
              key={`${url}-${idx}`}
              url={url}
              index={idx}
              onZoom={setZoomedUrl}
            />
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
            <EvidenceLightboxImage url={zoomedUrl} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
