import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BarieCameraScanner } from '../components/BarieCameraScanner'

// Mock html5-qrcode
const mockStart = vi.fn()
const mockStop = vi.fn().mockResolvedValue(undefined)
const mockClear = vi.fn()
const mockApplyVideoConstraints = vi.fn().mockResolvedValue(undefined)
const mockGetRunningTrackCapabilities = vi.fn().mockReturnValue({ torch: true })

vi.mock('html5-qrcode', () => {
  return {
    Html5QrcodeSupportedFormats: {
      QR_CODE: 0,
    },
    Html5Qrcode: class MockHtml5Qrcode {
      isScanning = true
      start = mockStart
      stop = mockStop
      clear = mockClear
      applyVideoConstraints = mockApplyVideoConstraints
      getRunningTrackCapabilities = mockGetRunningTrackCapabilities
    },
  }
})

describe('BarieCameraScanner (SP-S3-INT-04)', () => {
  const originalIsSecureContext = window.isSecureContext
  const originalMediaDevices = navigator.mediaDevices

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn() },
      configurable: true,
      writable: true,
    })
    mockStart.mockResolvedValue(null)
  })

  afterEach(() => {
    Object.defineProperty(window, 'isSecureContext', {
      value: originalIsSecureContext,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true,
      writable: true,
    })
  })

  it('initializes Html5Qrcode and transitions to SCANNING status with viewfinder overlay', async () => {
    render(
      <BarieCameraScanner
        onScan={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    // Should show starting loader first
    expect(screen.getByTestId('camera-loading-state')).toBeInTheDocument()

    // Once start resolves, should show scanning viewfinder
    await waitFor(() => {
      expect(mockStart).toHaveBeenCalledWith(
        expect.objectContaining({ facingMode: 'environment' }),
        expect.objectContaining({ fps: 25 }),
        expect.any(Function),
        expect.any(Function),
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/Đang dò mã QR/)).toBeInTheDocument()
    })
  })

  it('triggers onScan callback when barcode is successfully decoded', async () => {
    let successCallback: ((text: string) => void) | undefined
    mockStart.mockImplementation((_cam, _cfg, onSuccess) => {
      successCallback = onSuccess
      return Promise.resolve(null)
    })

    const handleScan = vi.fn()
    render(
      <BarieCameraScanner
        onScan={handleScan}
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(successCallback).toBeDefined()
    })

    // Simulate successful QR code detection
    act(() => {
      successCallback!('BK-2026-X09')
    })

    await waitFor(
      () => {
        expect(mockStop).toHaveBeenCalled()
        expect(handleScan).toHaveBeenCalledWith('BK-2026-X09')
      },
      { timeout: 2000 },
    )
  })

  it('allows toggling between front and back camera', async () => {
    render(
      <BarieCameraScanner
        onScan={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalled()
    })

    const switchBtn = screen.getByRole('button', { name: 'Đổi camera trước/sau' })
    expect(switchBtn).toHaveTextContent('Camera Sau')

    // Click to switch to user camera
    fireEvent.click(switchBtn)

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalledWith(
        expect.objectContaining({ facingMode: 'user' }),
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })
  })

  it('handles camera permission denial and invokes onError', async () => {
    const permError = new Error('Permission denied')
    permError.name = 'NotAllowedError'
    mockStart.mockRejectedValueOnce(permError)

    const handleError = vi.fn()
    render(
      <BarieCameraScanner
        onScan={vi.fn()}
        onClose={vi.fn()}
        onError={handleError}
      />,
    )

    await waitFor(() => {
      expect(screen.getByTestId('camera-error-state')).toBeInTheDocument()
      expect(screen.getByText('Quyền truy cập Camera bị từ chối')).toBeInTheDocument()
      expect(handleError).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'PERMISSION_DENIED' }),
      )
    })
  })

  it('renders CameraSecurityNotice when window.isSecureContext is false', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    })

    render(
      <BarieCameraScanner
        onScan={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByTestId('camera-security-notice')).toBeInTheDocument()
    expect(mockStart).not.toHaveBeenCalled()
  })

  it('cleans up Html5Qrcode instance on unmount to prevent memory leaks', async () => {
    const { unmount } = render(
      <BarieCameraScanner
        onScan={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    await waitFor(() => {
      expect(mockStart).toHaveBeenCalled()
    })

    unmount()

    expect(mockStop).toHaveBeenCalled()
  })
})
