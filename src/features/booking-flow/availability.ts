import { z } from 'zod'
import { getData } from '@/shared/api/resources'
import type { Vehicle } from './api'

const availabilitySchema = z.object({
  timezone: z.literal('Asia/Ho_Chi_Minh'), blockMinutes: z.literal(30), bufferMinutes: z.literal(30),
  allocationMode: z.enum(['PHYSICAL', 'GROUP']), updatedAt: z.string(),
  remainingCapacity: z.number().int().nonnegative(),
  slots: z.array(z.object({ id: z.string(), code: z.string() })),
  blocks: z.array(z.object({ start: z.string(), end: z.string(), remainingCapacity: z.number().int().nonnegative(),
    status: z.enum(['AVAILABLE', 'FULL', 'BUFFER', 'PAST']) })),
})
export type ScheduleAvailability = z.infer<typeof availabilitySchema>
type AvailabilityInput = { lotId: number; vehicleType: Vehicle['vehicleType']; start: string; end: string }
export async function fetchAvailability(input: AvailabilityInput, signal?: AbortSignal) {
  return availabilitySchema.parse(await getData<unknown>(`/api/v1/parking-lots/${input.lotId}/availability`, {
    vehicleType: input.vehicleType, start: `${input.start}:00`, end: `${input.end}:00`,
  }, { signal }))
}
export async function fetchTimeline(lotId: number, vehicleType: Vehicle['vehicleType'], date: string, physicalSlotId?: string, signal?: AbortSignal) {
  return availabilitySchema.parse(await getData<unknown>(`/api/v1/parking-lots/${lotId}/timeline`, {
    vehicleType, date, physicalSlotId: physicalSlotId || undefined,
  }, { signal }))
}
