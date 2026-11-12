import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Booking } from '@/entities/operations'
import {
  fetchMerchantBookingDetailApi,
  fetchMerchantBookingsApi,
  fetchMerchantBookingsSummarySafe,
  fetchMerchantLotsFilterSafe,
} from '../api/merchantBookingsApi'

export const merchantBookingsQueryKeys = {
  all: ['merchant-bookings'] as const,
  list: (params: { page: number; size: number; parkingLotId: number | null }) =>
    ['merchant-bookings', params] as const,
  summary: (parkingLotId: number | null) =>
    ['merchant-bookings-summary', { parkingLotId }] as const,
  detail: (id: string | number) => ['merchant-booking', String(id)] as const,
  lotsFilter: ['merchant-bookings-lots-filter'] as const,
}

export function useMerchantBookingsListQuery(
  page: number,
  size: number,
  parkingLotId: number | null,
) {
  return useQuery({
    queryKey: merchantBookingsQueryKeys.list({ page, size, parkingLotId }),
    queryFn: () => fetchMerchantBookingsApi({ page, size, parkingLotId }),
    placeholderData: keepPreviousData,
    staleTime: 20_000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useMerchantBookingsSummaryQuery(parkingLotId: number | null) {
  return useQuery({
    queryKey: merchantBookingsQueryKeys.summary(parkingLotId),
    queryFn: ({ signal }) => fetchMerchantBookingsSummarySafe(parkingLotId, signal),
    staleTime: 20_000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useMerchantBookingDetailQuery(
  id: string | number | null | undefined,
  initialData?: Booking | null,
) {
  const hasId = id !== null && id !== undefined && String(id).trim() !== ''
  return useQuery({
    queryKey: merchantBookingsQueryKeys.detail(id ?? ''),
    queryFn: async () => {
      const remote = await fetchMerchantBookingDetailApi(id as string | number)
      if (remote === undefined && initialData) {
        return initialData
      }
      return remote
    },
    enabled: hasId,
    initialData: initialData ?? undefined,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useMerchantBookingLotsFilterQuery() {
  return useQuery({
    queryKey: merchantBookingsQueryKeys.lotsFilter,
    queryFn: ({ signal }) => fetchMerchantLotsFilterSafe(signal),
    staleTime: 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
