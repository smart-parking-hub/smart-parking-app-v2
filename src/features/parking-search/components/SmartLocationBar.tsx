import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Navigation, Search, X } from 'lucide-react'
import {
  searchLocations,
  type Coordinates,
  type Place,
} from '../api/mapProvider'
interface Props {
  value: string
  onChange: (value: string) => void
  onLocateMe: (position: Coordinates) => void
  onSelectPlace: (place: Place) => void
  totalResults: number
  radiusKm: number
  includeFull: boolean
  onToggleIncludeFull: (value: boolean) => void
}
export function SmartLocationBar({
  value,
  onChange,
  onLocateMe,
  onSelectPlace,
  totalResults,
  radiusKm,
  includeFull,
  onToggleIncludeFull,
}: Props) {
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [search, setSearch] = useState('')
  const [showResults, setShowResults] = useState(false)
  const places = useQuery({
    queryKey: ['osm-places', search],
    queryFn: ({ signal }) => searchLocations(search, signal),
    enabled: search.trim().length >= 3,
    staleTime: 300000,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const locate = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Trình duyệt chưa hỗ trợ định vị. Hãy tìm địa điểm bằng địa chỉ.',
      )
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        setSearch('')
        setShowResults(false)
        onLocateMe({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => {
        setLocating(false)
        setLocationError(
          'Chưa lấy được vị trí. Cho phép quyền định vị hoặc tìm bằng địa chỉ.',
        )
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }
  return (
    <div className="relative mb-7 space-y-4">
      <form
        className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-border bg-white p-3 shadow-sm sm:p-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (value.trim().length >= 3) {
            setSearch(value.trim())
            setShowResults(true)
          }
        }}
      >
        <div className="flex min-w-0 flex-1 basis-64 items-center gap-3 rounded-xl bg-brand-surface px-4 py-3.5">
          <MapPin className="shrink-0 text-brand-orange" size={21} />
          <input
            aria-label="Địa chỉ tìm kiếm"
            placeholder="Nhập địa chỉ cảng, KCN hoặc bến bãi..."
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setShowResults(false)
            }}
            className="w-full min-w-0 bg-transparent text-base text-brand-navy outline-none placeholder:text-brand-muted"
          />
          {value && (
            <button
              aria-label="Xóa tìm kiếm"
              type="button"
              onClick={() => {
                onChange('')
                setShowResults(false)
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          disabled={places.isFetching || value.trim().length < 3}
          className="flex min-h-12 items-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Search size={17} />
          {places.isFetching ? 'Đang tìm…' : 'Tìm địa điểm'}
        </button>
        <button
          type="button"
          disabled={locating}
          onClick={locate}
          className="flex min-h-12 items-center gap-2 rounded-xl border border-brand-border px-5 text-sm font-semibold text-brand-navy disabled:opacity-50"
        >
          <Navigation size={17} className="text-brand-orange" />
          {locating ? 'Đang định vị…' : 'Vị trí của tôi'}
        </button>
      </form>
      {showResults && !places.isFetching && (
        <div
          className="rounded-2xl border border-brand-border bg-white p-2 shadow-sm"
          aria-label="Kết quả tìm địa điểm"
        >
          {places.isError ? (
            <p role="alert" className="p-4 text-sm text-red-700">
              Không tải được địa điểm. Vui lòng thử lại.
            </p>
          ) : !places.data?.length ? (
            <p className="p-4 text-sm text-brand-muted">
              Không tìm thấy địa điểm. Hãy thử địa chỉ cụ thể hơn.
            </p>
          ) : (
            places.data.map((place) => (
              <button
                type="button"
                className="flex w-full items-start gap-3 rounded-xl p-4 text-left text-sm leading-6 text-brand-navy hover:bg-brand-surface"
                key={place.id}
                onClick={() => {
                  onSelectPlace(place)
                  setShowResults(false)
                }}
              >
                <MapPin size={18} className="mt-1 shrink-0 text-brand-orange" />
                {place.label}
              </button>
            ))
          )}
        </div>
      )}
      {locationError && (
        <p role="alert" className="text-sm text-red-700">
          {locationError}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1 text-base text-brand-muted">
        <p>
          Tìm thấy{' '}
          <strong className="font-semibold text-brand-navy">
            {totalResults} bãi xe
          </strong>{' '}
          trong{' '}
          <span className="font-semibold text-brand-navy">{radiusKm} km</span>
        </p>
        <label className="flex items-center gap-3 text-sm font-semibold text-brand-navy">
          <input
            type="checkbox"
            checked={includeFull}
            onChange={(event) => onToggleIncludeFull(event.target.checked)}
            className="h-5 w-5 accent-brand-orange"
          />
          Hiện bãi đã đầy
        </label>
      </div>
    </div>
  )
}
