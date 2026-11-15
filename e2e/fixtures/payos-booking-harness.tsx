import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MyBookingsPage } from '../../src/features/bookings/pages/MyBookingsPage'
import { PaymentResultPage } from '../../src/features/booking-flow/PaymentResultPage'
import '../../src/styles/globals.css'

const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}><BrowserRouter><Routes>
    <Route path="/payment/cancel" element={<PaymentResultPage cancelled/>}/>
    <Route path="/payment/return" element={<PaymentResultPage/>}/>
    <Route path="*" element={<MyBookingsPage/>}/>
  </Routes></BrowserRouter></QueryClientProvider>,
)
