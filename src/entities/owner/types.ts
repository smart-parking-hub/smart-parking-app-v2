import { z } from 'zod'

export const ownerLeadSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ và tên chủ bãi / đại diện mặt bằng (tối thiểu 2 ký tự)'),
  phone: z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, 'Số điện thoại không hợp lệ (10 chữ số VN)'),
  location: z.string().min(5, 'Vui lòng nhập vị trí cụ thể của mặt bằng / bãi xe (tối thiểu 5 ký tự)'),
  area: z.string().min(1, 'Vui lòng chọn diện tích ước tính của mặt bằng'),
  status: z.string().min(1, 'Vui lòng chọn hiện trạng mặt bằng bãi xe'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type OwnerLeadFormValues = z.infer<typeof ownerLeadSchema>

export interface OwnerLotPreviewTelemetry {
  id: string
  hubCode: string
  name: string
  location: string
  capacityPercent: number
  alprScanTime: string
  payOsStatus: string
  currentActiveTrucks: number
  totalCapacitySlots: number
  estimatedDailyRevenue: number
  isOnline: boolean
}

