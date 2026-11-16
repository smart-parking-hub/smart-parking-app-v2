/**
 * Audio and Haptic feedback utility for Barie QR Scanner
 */

export function playScanBeep(frequency = 880, durationMs = 120) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(frequency, ctx.currentTime) // 880Hz crisp terminal beep
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + durationMs / 1000)
  } catch {
    // Ignore audio failures on unsupported or muted devices
  }
}

export function triggerScanHaptic(pattern: number[] = [40, 50, 40]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch {
    // Ignore vibration failures
  }
}

export function notifyScanSuccess() {
  playScanBeep()
  triggerScanHaptic()
}
