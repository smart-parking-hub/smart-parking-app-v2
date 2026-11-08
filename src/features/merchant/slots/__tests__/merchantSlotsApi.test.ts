import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/client'
import { fetchMerchantLotSimpleInfo, fetchMerchantLotSlots, updateMerchantLotSlotsBulk } from '../api/merchantSlotsApi'
vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn(), put: vi.fn() } }))
describe('merchant slots API uses only server data', () => {
  beforeEach(() => vi.resetAllMocks())
  it('does not append missing vehicle categories or sample specifications', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [{ id: 9, vehicleType: 'LIGHT_TRUCK', totalCapacity: 12, availableCapacity: 7 }] } })
    const result = await fetchMerchantLotSlots(35)
    expect(result).toEqual([{ id: 9, vehicleType: 'LIGHT_TRUCK', typeNameVi: 'Xe tải nhẹ', totalCapacity: 12, availableCapacity: 7, occupiedCapacity: 5 }])
  })
  it('preserves an empty response', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } })
    expect(await fetchMerchantLotSlots(35)).toEqual([])
  })
  it('propagates read errors instead of fabricating lot information or slots', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Offline'))
    await expect(fetchMerchantLotSimpleInfo(35)).rejects.toThrow('Offline')
    await expect(fetchMerchantLotSlots(35)).rejects.toThrow('Offline')
  })
  it('propagates save errors instead of simulating a successful save', async () => {
    vi.mocked(apiClient.put).mockRejectedValue(new Error('Forbidden'))
    await expect(updateMerchantLotSlotsBulk(35, { slots: [] })).rejects.toThrow('Forbidden')
  })
})
