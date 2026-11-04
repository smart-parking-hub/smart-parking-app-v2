import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
export function ApiImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState('')
  const query = useQuery({
    queryKey: ['api-image', path],
    queryFn: async () =>
      (await apiClient.get<Blob>(path, { responseType: 'blob' })).data,
    retry: false,
  })
  useEffect(() => {
    if (!query.data) return
    const objectUrl = URL.createObjectURL(query.data)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [query.data])
  if (!url || query.isError)
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-brand-surface text-xs text-brand-muted">
        {query.isError ? 'Không tải được ảnh' : 'Đang tải ảnh…'}
      </div>
    )
  return (
    <img
      className="aspect-video w-full rounded-xl object-cover"
      src={url}
      alt={alt}
    />
  )
}
