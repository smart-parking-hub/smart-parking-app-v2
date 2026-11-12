import { z } from 'zod'

export const adminUsersFilterSchema = z.object({
  keyword: z.string().default(''),
  role: z
    .enum([
      'ALL',
      'ROLE_DRIVER',
      'ROLE_MERCHANT',
      'ROLE_ADMIN',
      'DRIVER',
      'MERCHANT',
      'ADMIN',
    ])
    .default('ALL'),
  status: z
    .enum(['ALL', 'ACTIVE', 'BANNED', 'LOCKED', 'INACTIVE'])
    .default('ALL'),
})

export type AdminUserFilterValues = z.infer<typeof adminUsersFilterSchema>

export const banReasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Lý do giải trình phải có ít nhất 5 ký tự')
    .max(500, 'Lý do giải trình không được vượt quá 500 ký tự'),
})

export type BanReasonFormValues = z.infer<typeof banReasonSchema>

