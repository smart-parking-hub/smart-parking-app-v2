import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

export function ApiImage({ path, alt }: { path: string; alt: string }) {
  // Nếu path là external URL (ví dụ Cloudinary CDN https://res.cloudinary.com/...)
  const isExternalUrl = /^https?:\/\//i.test(path)

  const [url, setUrl] = useState(isExternalUrl ? path : '')

  const query = useQuery({
    queryKey: ['api-image', path],
    queryFn: async () =>
      (await apiClient.get<Blob>(path, { responseType: 'blob' })).data,
    enabled: !isExternalUrl && Boolean(path),
    retry: false,
  })

  useEffect(() => {
    if (isExternalUrl) {
      setUrl(path)
      return
    }
    if (!query.data) return
    const objectUrl = URL.createObjectURL(query.data)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [query.data, path, isExternalUrl])

  if (isExternalUrl) {
    return (
      <img
        className="aspect-video w-full rounded-xl object-cover"
        src={path}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    )
  }

  if (!url || query.isError) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-brand-surface text-xs text-brand-muted">
        {query.isError ? 'Không tải được ảnh' : 'Đang tải ảnh…'}
      </div>
    )
  }

  return (
    <img
      className="aspect-video w-full rounded-xl object-cover"
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  )
}
