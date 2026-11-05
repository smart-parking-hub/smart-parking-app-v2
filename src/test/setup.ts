import '@testing-library/jest-dom/vitest'

 feat/a11y-wcag21-forms_Khangvo
if (typeof window !== 'undefined' && !window.localStorage) {
  const store: Record<string, string> = {}
  const localStorageMock = {
    getItem: (key: string) => store[key] || null,

// Polyfill localStorage for Node 22+ experimental localStorage
const createStorageMock = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
 main
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
 feat/a11y-wcag21-forms_Khangvo
      for (const key in store) {
        delete store[key]
      }
    },
    key: (i: number) => Object.keys(store)[i] || null,

      store = {}
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
 main
    get length() {
      return Object.keys(store).length
    },
  }
 feat/a11y-wcag21-forms_Khangvo
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
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
 main
