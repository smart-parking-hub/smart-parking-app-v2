import type {
  CameraErrorInfo,
  CameraSecurityStatus,
} from '../types/qrScannerTypes'

/**
 * Checks whether the current runtime environment is a Secure Context
 * (HTTPS or localhost) and supports WebRTC MediaDevices camera access.
 */
export function checkCameraSecurityStatus(): CameraSecurityStatus {
  // SSR or non-browser guard
  if (typeof window === 'undefined') {
    return {
      isSecureContext: false,
      hasMediaDevices: false,
      isSupported: false,
      reason: 'UNSUPPORTED_BROWSER',
    }
  }

  // W3C Secure Context check (required by Chrome, Safari, Firefox for Camera WebRTC)
  // window.isSecureContext is true for https:// and http://localhost / http://127.0.0.1
  const isSecure = Boolean(window.isSecureContext)

  // MediaDevices API check
  const hasMedia =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

  if (!isSecure) {
    return {
      isSecureContext: false,
      hasMediaDevices: hasMedia,
      isSupported: false,
      reason: 'INSECURE_CONTEXT',
    }
  }

  if (!hasMedia) {
    return {
      isSecureContext: true,
      hasMediaDevices: false,
      isSupported: false,
      reason: 'NO_MEDIA_DEVICES',
    }
  }

  return {
    isSecureContext: true,
    hasMediaDevices: true,
    isSupported: true,
    reason: 'OK',
  }
}

/**
 * Translates unknown camera errors into user-actionable CameraErrorInfo
 */
export function parseCameraError(error: unknown): CameraErrorInfo {
  const errName =
    error && typeof error === 'object' && 'name' in error
      ? String((error as { name: unknown }).name)
      : ''
  const errMsg =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error ?? '')

  if (
    errName === 'NotAllowedError' ||
    errName === 'PermissionDeniedError' ||
    errMsg.includes('Permission denied')
  ) {
    return {
      type: 'PERMISSION_DENIED',
      title: 'Quyền truy cập Camera bị từ chối',
      message:
        'Trình duyệt chưa được cấp quyền sử dụng Camera. Vui lòng mở cài đặt trang web và chọn "Cho phép" để tiếp tục.',
      canRetry: true,
    }
  }

  if (
    errName === 'NotFoundError' ||
    errName === 'DevicesNotFoundError' ||
    errMsg.includes('Requested device not found')
  ) {
    return {
      type: 'NOT_FOUND',
      title: 'Không tìm thấy thiết bị Camera',
      message:
        'Hệ thống không phát hiện camera nào trên thiết bị này. Vui lòng dùng ô nhập mã đặt chỗ bên dưới.',
      canRetry: false,
    }
  }

  if (
    errName === 'SecurityError' ||
    errMsg.includes('secure origin') ||
    errMsg.includes('HTTPS')
  ) {
    return {
      type: 'INSECURE_CONTEXT',
      title: 'Yêu cầu kết nối HTTPS bảo mật',
      message:
        'Theo tiêu chuẩn bảo mật W3C, trình duyệt di động chỉ cấp quyền Camera qua kết nối HTTPS hoặc localhost.',
      canRetry: false,
    }
  }

  if (
    errName === 'NotReadableError' ||
    errName === 'TrackStartError' ||
    errMsg.includes('Could not start video source')
  ) {
    return {
      type: 'STREAM_ERROR',
      title: 'Camera đang bị chiếm dụng',
      message:
        'Camera đang được sử dụng bởi một ứng dụng khác hoặc bị khóa bởi hệ điều hành. Vui lòng đóng ứng dụng khác và thử lại.',
      canRetry: true,
    }
  }

  if (errName === 'OverconstrainedError') {
    return {
      type: 'OVERCONSTRAINED',
      title: 'Ống kính camera không tương thích',
      message:
        'Ống kính yêu cầu không khả dụng trên thiết bị. Hệ thống sẽ thử chuyển đổi sang ống kính mặc định.',
      canRetry: true,
    }
  }

  return {
    type: 'UNKNOWN',
    title: 'Không thể khởi động Camera',
    message:
      errMsg ||
      'Đã xảy ra sự cố không xác định khi kết nối với phần cứng camera.',
    canRetry: true,
  }
}

/**
 * Checks if the running video track capabilities support flashlight/torch.
 */
export function isTorchSupported(
  capabilities?: MediaTrackCapabilities | Record<string, unknown>,
): boolean {
  if (!capabilities) return false
  return 'torch' in capabilities && Boolean(capabilities.torch)
}
