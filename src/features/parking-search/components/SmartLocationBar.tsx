import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2, MapPin, Navigation, Search, Warehouse, X } from 'lucide-react'
import {
  autocompleteLocations,
  type Coordinates,
  type Place,
} from '../api/mapProvider'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface Props {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  onLocateMe: (position: Coordinates) => void
  onSelectPlace: (place: Place) => void
  parkingLots?: ParkingLotItem[]
  onSelectLot?: (lot: ParkingLotItem) => void
  totalResults?: number
  radiusKm?: number
  includeFull?: boolean
  onToggleIncludeFull?: (value: boolean) => void
  showStatsBar?: boolean
}

function normalizeVietnamese(text: string): string {
  return text
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
}

export function SmartLocationBar({
  value,
  onChange,
  onClear,
  onLocateMe,
  onSelectPlace,
  parkingLots = [],
  onSelectLot,
  totalResults = 0,
  radiusKm = 15,
  includeFull = true,
  onToggleIncludeFull,
  showStatsBar = false,
}: Props) {
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const trimmedValue = value.trim()

  useEffect(() => {
    if (trimmedValue.length < 2) {
      setDebouncedQuery('')
      return
    }
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedValue)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [trimmedValue])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const places = useQuery({
    queryKey: ['osm-places-autocomplete', debouncedQuery],
    queryFn: ({ signal }) => autocompleteLocations(debouncedQuery, signal),
    enabled: showResults && debouncedQuery.length >= 2,
    staleTime: 300000,
    retry: false,
    refetchOnWindowFocus: false,
  })

  const matchingLots = useMemo(() => {
    if (trimmedValue.length < 2 || parkingLots.length === 0) return []
    const needle = normalizeVietnamese(trimmedValue)
    return parkingLots
      .filter((lot) => {
        const haystack = `${normalizeVietnamese(lot.name)} ${normalizeVietnamese(lot.address)}`
        return haystack.includes(needle)
      })
      .slice(0, 4)
  }, [parkingLots, trimmedValue])

  const remotePlaces = useMemo(() => places.data ?? [], [places.data])

  const selectableItems = useMemo(
    () => [
      ...matchingLots.map((lot) => ({ kind: 'lot' as const, lot })),
      ...remotePlaces.map((place) => ({ kind: 'place' as const, place })),
    ],
    [matchingLots, remotePlaces],
  )

  const isDebouncing =
    showResults && trimmedValue.length >= 2 && trimmedValue !== debouncedQuery
  const isSearchingRemote =
    showResults && trimmedValue.length >= 2 && (isDebouncing || places.isFetching)

  const handleChooseLot = (lot: ParkingLotItem) => {
    onChange(lot.name)
    onSelectLot?.(lot)
    setShowResults(false)
    setActiveIndex(-1)
  }

  const handleChoosePlace = (place: Place) => {
    onSelectPlace(place)
    setShowResults(false)
    setActiveIndex(-1)
  }

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
        setDebouncedQuery('')
        setShowResults(false)
        setActiveIndex(-1)
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

  const dropdownVisible = showResults && trimmedValue.length >= 2

  return (
    <div ref={wrapperRef} className="relative w-full space-y-2">
      <div className="relative">
        <form
          className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 rounded-2xl border border-brand-border/90 bg-white/95 backdrop-blur-md p-1.5 shadow-lg"
          onSubmit={(event) => {
            event.preventDefault()
            if (trimmedValue.length >= 2) {
              setShowResults(true)
              if (debouncedQuery === trimmedValue) {
                void places.refetch()
              } else {
                setDebouncedQuery(trimmedValue)
              }
            }
          }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-100/90 px-3 py-2">
            <MapPin className="shrink-0 text-brand-orange" size={16} />
            <input
              ref={inputRef}
              role="combobox"
              aria-label="Địa chỉ tìm kiếm"
              aria-autocomplete="list"
              aria-expanded={dropdownVisible}
              aria-controls={dropdownVisible ? listboxId : undefined}
              aria-activedescendant={
                dropdownVisible && activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              autoComplete="off"
              placeholder="Nhập địa chỉ cảng, KCN hoặc bến bãi..."
              value={value}
              onFocus={() => {
                if (trimmedValue.length >= 2) {
                  setShowResults(true)
                }
              }}
              onChange={(event) => {
                const nextValue = event.target.value
                if (nextValue === '' && onClear) {
                  onClear()
                } else {
                  onChange(nextValue)
                }
                setActiveIndex(-1)
                setShowResults(nextValue.trim().length >= 2)
              }}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing) return
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  if (trimmedValue.length < 2) return
                  event.preventDefault()
                  setShowResults(true)
                  if (selectableItems.length > 0) {
                    setActiveIndex((prev) => {
                      if (prev < 0) {
                        return event.key === 'ArrowDown'
                          ? 0
                          : selectableItems.length - 1
                      }
                      return (
                        (prev +
                          (event.key === 'ArrowDown' ? 1 : -1) +
                          selectableItems.length) %
                        selectableItems.length
                      )
                    })
                  }
                } else if (
                  event.key === 'Enter' &&
                  dropdownVisible &&
                  activeIndex >= 0 &&
                  selectableItems[activeIndex]
                ) {
                  event.preventDefault()
                  const picked = selectableItems[activeIndex]
                  if (picked.kind === 'lot') {
                    handleChooseLot(picked.lot)
                  } else {
                    handleChoosePlace(picked.place)
                  }
                } else if (event.key === 'Escape' && dropdownVisible) {
                  event.preventDefault()
                  setShowResults(false)
                  setActiveIndex(-1)
                }
              }}
              className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-brand-navy outline-none placeholder:text-brand-muted"
            />
            {isSearchingRemote && (
              <Loader2
                size={14}
                aria-hidden="true"
                className="shrink-0 animate-spin text-brand-orange"
              />
            )}
            {value && (
              <button
                aria-label="Xóa tìm kiếm"
                type="button"
                onClick={() => {
                  if (onClear) {
                    onClear()
                  } else {
                    onChange('')
                  }
                  setDebouncedQuery('')
                  setShowResults(false)
                  setActiveIndex(-1)
                  setLocationError('')
                  inputRef.current?.focus()
                }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0">
            <button
              disabled={places.isFetching || trimmedValue.length < 2}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-brand-navy px-3 text-xs font-semibold text-white whitespace-nowrap hover:bg-brand-navy-light transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Search size={14} />
              {places.isFetching ? 'Đang tìm…' : 'Tìm địa điểm'}
            </button>
            <button
              type="button"
              disabled={locating}
              onClick={locate}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-brand-border bg-white px-3 text-xs font-semibold text-brand-navy whitespace-nowrap hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Navigation size={14} className="text-brand-orange" />
              {locating ? 'Định vị…' : 'Vị trí của tôi'}
            </button>
          </div>
        </form>

        {dropdownVisible && (
          <div
            id={listboxId}
            role="listbox"
            aria-label="Kết quả tìm địa điểm"
            className="absolute inset-x-0 top-full z-40 mt-1.5 rounded-2xl border border-brand-border bg-white/98 backdrop-blur-md p-1.5 shadow-2xl max-h-80 overflow-y-auto custom-scrollbar"
          >
            {matchingLots.length > 0 && (
              <div className="mb-1">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                  Bãi đỗ phù hợp trên hệ thống
                </p>
                {matchingLots.map((lot, idx) => {
                  const isActive = activeIndex === idx
                  return (
                    <button
                      id={`${listboxId}-option-${idx}`}
                      key={`lot-${lot.id}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleChooseLot(lot)}
                      className={`flex w-full items-start justify-between gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isActive ? 'bg-orange-50' : 'hover:bg-brand-surface'
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <Warehouse
                          size={15}
                          className="mt-0.5 shrink-0 text-brand-orange"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-navy truncate">
                            {lot.name}
                          </p>
                          <p className="text-[11px] text-brand-muted truncate">
                            {lot.address}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                          lot.isFull || lot.availableSlots === 0
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {lot.isFull || lot.availableSlots === 0
                          ? 'Hết chỗ'
                          : `Còn ${lot.availableSlots} chỗ`}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {remotePlaces.length > 0 && (
              <div>
                {matchingLots.length > 0 && (
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted border-t border-slate-100 mt-1 pt-1.5">
                    Địa điểm &amp; khu vực bản đồ
                  </p>
                )}
                {remotePlaces.map((place, rIdx) => {
                  const combinedIdx = matchingLots.length + rIdx
                  const isActive = activeIndex === combinedIdx
                  return (
                    <button
                      id={`${listboxId}-option-${combinedIdx}`}
                      key={place.id}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActiveIndex(combinedIdx)}
                      onClick={() => handleChoosePlace(place)}
                      className={`flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs leading-5 text-brand-navy transition-colors cursor-pointer ${
                        isActive ? 'bg-orange-50' : 'hover:bg-brand-surface'
                      }`}
                    >
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-brand-orange"
                      />
                      <span className="line-clamp-2">{place.label}</span>
                    </button>
                  )
                })}
              </div>
            )}

            {isSearchingRemote && (
              <div
                role="status"
                className="flex items-center gap-2 px-3 py-2 text-xs text-brand-muted"
              >
                <Loader2 size={13} className="animate-spin text-brand-orange" />
                <span>
                  {matchingLots.length > 0
                    ? 'Đang tìm thêm địa điểm trên bản đồ…'
                    : 'Đang tìm địa điểm gợi ý…'}
                </span>
              </div>
            )}

            {!isSearchingRemote &&
              matchingLots.length === 0 &&
              remotePlaces.length === 0 &&
              (places.isError ? (
                <p role="alert" className="p-3 text-xs text-red-700">
                  Không tải được gợi ý từ bản đồ. Hãy thử địa chỉ khác hoặc chọn bãi trong danh sách.
                </p>
              ) : (
                <p className="p-3 text-xs text-brand-muted">
                  Không tìm thấy địa điểm phù hợp. Hãy thử tên đường, cảng hoặc KCN cụ thể hơn.
                </p>
              ))}
          </div>
        )}
      </div>

      {locationError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-white/95 px-3 py-2 text-xs text-red-700 shadow-md"
        >
          {locationError}
        </p>
      )}
      {showStatsBar && onToggleIncludeFull && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-1 text-sm text-brand-muted">
          <p>
            Tìm thấy{' '}
            <strong className="font-semibold text-brand-navy">
              {totalResults} bãi xe
            </strong>{' '}
            trong{' '}
            <span className="font-semibold text-brand-navy">{radiusKm} km</span>
          </p>
          <label className="flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <input
              type="checkbox"
              checked={includeFull}
              onChange={(event) => onToggleIncludeFull(event.target.checked)}
              className="h-4 w-4 accent-brand-orange"
            />
            Hiện bãi đã đầy
          </label>
        </div>
      )}
    </div>
  )
}
