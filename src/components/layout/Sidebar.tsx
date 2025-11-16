'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  description: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', description: 'Capture + Analyze overview' },
  { label: 'Transactions', href: '/transactions', description: 'Search, edit, import & export' },
  { label: 'Forecast', href: '/forecast', description: 'Monthly outlook & recurring dues' },
  { label: 'Insights', href: '/insights', description: 'Auto-generated patterns & advice' },
  { label: 'Budgets', href: '/budgets', description: 'Goals, limits and adjustments' },
]

interface SidebarProps {
  isOpen: boolean
  onNavigate?: () => void
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 border-r bg-white/95 backdrop-blur transition-transform duration-200 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex h-16 items-center px-6 text-lg font-semibold">Spending Tracker</div>
      <nav className="space-y-1 px-4 pb-10">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="font-medium">{item.label}</div>
              <p className="text-xs text-slate-500">{item.description}</p>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
