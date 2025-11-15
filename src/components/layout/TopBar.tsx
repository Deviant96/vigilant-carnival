'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onToggleSidebar?: () => void
  title?: string
  actions?: ReactNode
}

export function TopBar({ onToggleSidebar, title = 'Overview', actions }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(
            'inline-flex h-10 w-10 items-center justify-center rounded-lg border text-slate-600 transition-colors lg:hidden',
            'hover:bg-slate-100'
          )}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Capture · Analyze · Advise</p>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  )
}
