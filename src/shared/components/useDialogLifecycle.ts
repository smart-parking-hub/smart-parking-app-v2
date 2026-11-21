import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'

/** Shared native-dialog lifecycle: top-layer focus, scroll locking and return focus. */
export function useDialogLifecycle(
  dialogRef: RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
  onAfterClose?: () => void,
  returnFocusRef?: RefObject<HTMLElement | null>,
) {
  const afterClose = useRef(onAfterClose)
  useEffect(() => { afterClose.current = onAfterClose }, [onAfterClose])

  useLayoutEffect(() => {
    const element = dialogRef.current
    const previous = returnFocusRef?.current ?? document.activeElement
    const previousOverflow = document.body.style.overflow
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.defaultPrevented || !element) return
      if (!(event.target instanceof Element) || event.target.closest('dialog[open]') !== element) return
      const controls = Array.from(element.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]',
      )).filter(control => !control.matches(':disabled') && control.tabIndex >= 0 && control.getClientRects().length > 0 && getComputedStyle(control).visibility !== 'hidden')
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    if (isOpen && element) {
      if (typeof element.showModal === 'function' && !element.open) {
        try {
          element.showModal()
        } catch {
          element.setAttribute('open', '')
        }
      } else {
        element.setAttribute('open', '')
      }
      document.body.style.overflow = 'hidden'
      element.addEventListener('keydown', keepFocusInside)
      initialFocusRef?.current?.focus()
    }

    return () => {
      if (isOpen) document.body.style.overflow = previousOverflow
      element?.removeEventListener('keydown', keepFocusInside)
      if (element) {
        if (typeof element.close === 'function' && element.open) {
          try {
            element.close()
          } catch {
            element.removeAttribute('open')
          }
        } else {
          element.removeAttribute('open')
        }
      }
      const restoreFocus = () => {
        if (!(previous instanceof HTMLElement) || previous === document.body || !previous.isConnected) return
        const target = previous.matches(':disabled')
          ? previous.closest('form')?.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled), button:not(:disabled)')
          : previous
        const openDialogs = document.querySelectorAll('dialog[open]')
        const activeDialog = openDialogs[openDialogs.length - 1]
        if (target && (!activeDialog || activeDialog.contains(target))) target.focus()
      }
      // Restore after React's commit, then let an explicit callback choose its own target.
      const notifyAfterClose = isOpen ? afterClose.current : undefined
      queueMicrotask(() => {
        restoreFocus()
        notifyAfterClose?.()
      })
    }
  }, [dialogRef, isOpen, initialFocusRef, returnFocusRef])
}
