import { type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { QueryProvider } from './QueryProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryProvider>{children}</QueryProvider>
    </Provider>
  )
}
