import { apiClient } from './client'

/**
 * Kiểm tra khả năng kết nối tới Backend (Local hoặc VPS).
 * Trả về true nếu server phản hồi (kể cả HTTP status 404/405/200/403 - chứng minh server đang online).
 * Trả về false nếu Network Error, Connection Refused, Timeout hoặc bị chặn.
 */
export async function checkServerConnectivity(): Promise<boolean> {
  if (import.meta.env.MODE === 'test') {
    return true
  }
  try {
    const res = await apiClient.get('/api/v1/auth/ping', { timeout: 3500 })
    return res.status >= 200 && res.status < 500
  } catch (error: unknown) {
    const axiosErr = error as { response?: { status?: number } }
    // Nếu server có phản hồi bất kỳ HTTP code nào (200, 401, 403, 404, 405...), chứng tỏ server đang chạy!
    if (axiosErr?.response && typeof axiosErr.response.status === 'number' && axiosErr.response.status > 0) {
      return true
    }
    // Lỗi không có response: Network Error, ERR_CONNECTION_REFUSED, Timeout, Mixed Content
    return false
  }
}
