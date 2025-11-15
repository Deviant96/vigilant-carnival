import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
