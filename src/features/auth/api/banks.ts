import { z } from 'zod'

export const BANKS_URL = 'https://api.vietqr.io/v2/banks'
const bankSchema = z.object({
  name: z.string().trim().min(1),
  shortName: z.string().trim().min(1).max(100),
  code: z.string().min(1),
  bin: z.string().regex(/^\d{6}$/),
  logo: z.string().optional(),
})
const responseSchema = z.object({ code: z.literal('00'), data: z.array(bankSchema) })
export type Bank = z.infer<typeof bankSchema>

/** Public provider request: never use the authenticated app client or send account data. */
export async function fetchBanks(signal?: AbortSignal): Promise<Bank[]> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) abort()
  else signal?.addEventListener('abort', abort, { once: true })
  const timer = setTimeout(abort, 10000)
  try {
    const response = await fetch(BANKS_URL, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' })
    if (!response.ok) throw new Error('Không tải được danh sách ngân hàng. Vui lòng thử lại.')
    const result = responseSchema.safeParse(await response.json())
    if (!result.success) throw new Error('Danh sách ngân hàng chưa hợp lệ. Vui lòng thử lại.')
    if (!result.data.data.length) throw new Error('Danh sách ngân hàng đang trống. Vui lòng thử lại.')
    return [...new Map(result.data.data.map(bank => [bank.shortName, bank])).values()]
      .sort((a, b) => a.shortName.localeCompare(b.shortName, 'vi'))
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Tải danh sách ngân hàng đã bị gián đoạn. Vui lòng thử lại.')
    if (error instanceof TypeError) throw new Error('Không kết nối được danh sách ngân hàng. Vui lòng thử lại.')
    throw error
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}
