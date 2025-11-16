'use client'

import { ReactNode } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onToggleSidebar?: () => void
  title?: string
  actions?: ReactNode
}

export function TopBar({ onToggleSidebar, title = 'Overview', actions }: TopBarProps) {
  const { data: session } = useSession()

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
      <div className="flex items-center gap-3">
        {actions}
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{session.user.name || 'User'}</p>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
