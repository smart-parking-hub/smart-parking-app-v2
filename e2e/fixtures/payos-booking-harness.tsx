import React from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MyBookingsPage } from '../../src/features/bookings/pages/MyBookingsPage'
import '../../src/styles/globals.css'

const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}><MemoryRouter initialEntries={['/bookings']}>
    <MyBookingsPage />
  </MemoryRouter></QueryClientProvider>,
)
