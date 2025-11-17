'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactNode, useState } from 'react'
import { ToastProvider, ToastViewport } from '@/components/ui/ToastProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [client] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
