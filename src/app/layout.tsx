import type { Metadata } from 'next'
import './globals.css'
import { ShellLayout } from '@/components/layout/ShellLayout'
import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Spending Tracker',
  description: 'Personal finance tracker with Capture → Analyze → Advise architecture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 font-sans text-slate-900">
        <AppProviders>
          <ShellLayout>{children}</ShellLayout>
        </AppProviders>
      </body>
    </html>
  )
}
