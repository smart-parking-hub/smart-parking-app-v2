export type GoogleShareEmbedValidationResult =
  | { valid: true; url: string }
  | { valid: false; reason: string }

const ALLOWED_EMBED_HOSTS = new Set(['www.google.com', 'maps.google.com'])

function extractRawSrcFromInput(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^<iframe\b/i.test(trimmed)) {
    const match = trimmed.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)')/i)
    const extracted = match?.[1] ?? match?.[2] ?? ''
    return extracted.trim() || null
  }

  return trimmed
}

/**
 * Validates a Google Maps consumer "Share -> Embed a map" URL (or extracts src from its iframe HTML).
 *
 * Strictly enforces:
 * - HTTPS scheme without credentials
 * - Exact hostname allowlist (www.google.com, maps.google.com)
 * - Consumer Share embed path (/maps/embed) with non-empty `pb` parameter
 *
 * Explicitly rejects:
 * - Maps Embed API v1 (/maps/embed/v1/*) or URLs containing API keys
 * - Short links (maps.app.goo.gl, goo.gl)
 * - Unofficial /maps?q=...&output=embed URLs
 * - Spoofed hosts or non-HTTPS schemes
 */
export function extractAndValidateGoogleShareEmbedUrl(
  rawInput: string | null | undefined,
): GoogleShareEmbedValidationResult {
  if (!rawInput || !rawInput.trim()) {
    return { valid: false, reason: 'Chưa có đường dẫn nhúng Google Maps.' }
  }

  const candidate = extractRawSrcFromInput(rawInput)
  if (!candidate) {
    return {
      valid: false,
      reason: 'Không tìm thấy thuộc tính src hợp lệ trong mã nhúng iframe.',
    }
  }

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { valid: false, reason: 'Đường dẫn nhúng Google Maps không hợp lệ.' }
  }

  if (parsed.protocol !== 'https:') {
    return {
      valid: false,
      reason: 'Đường dẫn nhúng phải sử dụng giao thức HTTPS.',
    }
  }

  if (parsed.username || parsed.password) {
    return {
      valid: false,
      reason: 'Đường dẫn nhúng không được chứa thông tin xác thực.',
    }
  }

  const hostname = parsed.hostname.toLowerCase()
  if (!ALLOWED_EMBED_HOSTS.has(hostname)) {
    return {
      valid: false,
      reason:
        'Chỉ chấp nhận liên kết nhúng trực tiếp từ www.google.com hoặc maps.google.com (không hỗ trợ link rút gọn hoặc tên miền khác).',
    }
  }

  const normalizedPath = parsed.pathname.replace(/\/+$/, '')
  if (normalizedPath.startsWith('/maps/embed/v1')) {
    return {
      valid: false,
      reason:
        'Không hỗ trợ Maps Embed API v1 (yêu cầu API key/Billing). Hãy dùng Chia sẻ → Nhúng bản đồ trên Google Maps.',
    }
  }

  if (parsed.searchParams.has('key')) {
    return {
      valid: false,
      reason: 'Không chấp nhận đường dẫn nhúng có chứa API key.',
    }
  }

  if (normalizedPath !== '/maps/embed') {
    return {
      valid: false,
      reason:
        'Đường dẫn không phải liên kết Chia sẻ → Nhúng bản đồ (/maps/embed) của Google Maps.',
    }
  }

  const pb = parsed.searchParams.get('pb')?.trim() ?? ''
  if (!pb || pb.length < 10) {
    return {
      valid: false,
      reason:
        'Thiếu tham số bản đồ (pb) hợp lệ từ chức năng Chia sẻ → Nhúng bản đồ của Google Maps.',
    }
  }

  return { valid: true, url: parsed.toString() }
}
