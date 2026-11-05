import { z } from 'zod'

export const reservationFormSchema = z.object({
  vehiclePlate: z
    .string()
    .min(5, 'Biển số xe phải có ít nhất 5 ký tự')
    .max(15, 'Biển số xe không được vượt quá 15 ký tự')
    .regex(/^[0-9]{2}[A-Z0-9-.\s]{3,10}$/i, 'Định dạng biển số xe không hợp lệ (VD: 51D-894.12)'),
  vehicleType: z.string().min(1, 'Vui lòng chọn phân loại phương tiện'),
  durationHours: z
    .number({ invalid_type_error: 'Thời gian đỗ phải là số giờ' })
    .min(1, 'Thời gian đỗ tối thiểu là 1 giờ')
    .max(72, 'Thời gian đỗ tối đa là 72 giờ'),
  arrivalTime: z.string().min(1, 'Vui lòng nhập giờ vào dự kiến'),
  paymentMethod: z.enum(['PAYOS_VIETQR', 'WALLET', 'ENTERPRISE'], {
    required_error: 'Vui lòng chọn phương thức thanh toán',
  }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'Bạn cần đồng ý với cam kết điều phối và quy định bến bãi',
  }),
})

export type ReservationFormData = z.infer<typeof reservationFormSchema>
