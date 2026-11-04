import { isAxiosError } from 'axios'
import { apiClient } from './client'
export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
}
export async function getData<T>(url: string, params?: object): Promise<T> {
  const result = await apiClient.get<{ data: T }>(url, { params })
  return result.data.data
}
export async function sendData<T = void>(
  method: 'post' | 'put',
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
