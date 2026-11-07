import '@testing-library/jest-dom/vitest'

// Polyfill localStorage for Node 22+ experimental localStorage
const createStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

const storageMock = createStorageMock()
Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true,
})
Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true,
})

// Polyfill window.scrollTo and scrollIntoView in jsdom (default jsdom throws "Not implemented")
if (typeof window !== 'undefined') {
  window.scrollTo = () => {}
  if (window.HTMLElement) {
    window.HTMLElement.prototype.scrollIntoView = () => {}
  }
}
