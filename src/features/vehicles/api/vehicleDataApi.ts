import { z } from 'zod'
import { apiClient } from '@/shared/api/client'
import { getData, sendData } from '@/shared/api/resources'

export const vehicleTypes = {
  SEDAN_SUV: 'Ô tô con / SUV', BUS_COACH: 'Xe khách', LIGHT_TRUCK: 'Xe tải nhẹ',
  HEAVY_TRUCK: 'Xe tải nặng', CONTAINER: 'Xe container',
} as const
const vehicleType = z.enum(['SEDAN_SUV', 'BUS_COACH', 'LIGHT_TRUCK', 'HEAVY_TRUCK', 'CONTAINER'], { errorMap: () => ({ message: 'Chọn loại xe.' }) })
export const vehicleInputSchema = z.object({
  licensePlate: z.string().trim().transform(value => value.toUpperCase().replace(/\s+/g, ''))
    .pipe(z.string().min(1, 'Nhập biển số xe.').max(20, 'Biển số tối đa 20 ký tự.')
      .regex(/^[A-Z0-9.-]+$/, 'Chỉ nhập chữ không dấu, số, dấu chấm hoặc gạch ngang.')
      .refine(value => /\d/.test(value), 'Biển số cần có chữ số.')),
  vehicleType,
  weightTon: z.coerce.number().finite().positive('Trọng tải phải lớn hơn 0.')
    .max(999.99, 'Trọng tải tối đa 999,99 tấn.')
    .refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001, 'Nhập tối đa 2 chữ số thập phân.'),
  brandModel: z.string().trim().max(100, 'Nhãn hiệu tối đa 100 ký tự.'),
})
const vehicleSchema = z.object({
  id: z.number().int().positive(), licensePlate: z.string(), vehicleType,
  weightTon: z.coerce.number().finite().positive(), brandModel: z.string().nullish(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})
const pageSchema = z.object({
  content: z.array(vehicleSchema), currentPage: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(), totalElements: z.number().int().nonnegative(),
})
export type VehicleRecord = z.infer<typeof vehicleSchema>
export type VehicleInput = z.infer<typeof vehicleInputSchema>
export async function fetchVehiclePage(page: number) {
  return pageSchema.parse(await getData<unknown>('/api/v1/vehicles', { page, size: 20, sort: 'id,desc' }))
}
export async function saveVehicle(input: VehicleInput, id?: number) {
  const data = vehicleInputSchema.parse(input)
  return vehicleSchema.parse(await sendData<unknown>(id == null ? 'post' : 'put', id == null ? '/api/v1/vehicles' : `/api/v1/vehicles/${id}`, data))
}
export async function deactivateVehicle(id: number) {
  await apiClient.delete(`/api/v1/vehicles/${id}`)
}
