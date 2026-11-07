import { isAxiosError } from 'axios'
import { apiClient } from './client'

export { adaptSpringPage, toSpringPageParams, type SpringPage, type ClientPage } from './adapters'

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
  number?: number
  size?: number
}

export async function getData<T>(url: string, params?: object): Promise<T> {
  const result = await apiClient.get<{ data: T }>(url, { params })
  const raw = result.data.data
  if (
    raw &&
    typeof raw === 'object' &&
    'content' in raw &&
    Array.isArray((raw as Record<string, unknown>).content)
  ) {
    const pageObj = raw as Record<string, unknown>
    if (pageObj.currentPage === undefined && typeof pageObj.number === 'number') {
      pageObj.currentPage = pageObj.number + 1
    }
  }
  return raw
}

export async function sendData<T = void>(
  method: 'post' | 'put' | 'delete' | 'patch',
  url: string,
  body?: unknown,
): Promise<T> {
  const result = await apiClient.request<{ data: T }>({
    method,
    url,
    data: body,
  })
  return result.data.data
}

export function errorMessage(error: unknown): string {
  if (isAxiosError(error))
    return typeof error.response?.data?.message === 'string'
      ? error.response.data.message
      : 'Không kết nối được máy chủ. Vui lòng thử lại.'
  return error instanceof Error ? error.message : 'Thao tác chưa hoàn tất.'
}
