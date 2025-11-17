'use client'

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface ToastMessage {
  id: string
  title: string
  variant?: 'success' | 'error'
}

interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (title: string, variant?: ToastMessage['variant']) => void
  dismissToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((title: string, variant: ToastMessage['variant'] = 'success') => {
    setToasts(prev => [...prev, { id: crypto.randomUUID(), title, variant }])
  }, [])

  const value = useMemo(() => ({ toasts, showToast, dismissToast }), [dismissToast, showToast, toasts])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
            toast.variant === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-100 bg-emerald-50 text-emerald-800'
          }`}
        >
          <div className="flex-1 text-sm font-medium">{toast.title}</div>
          <button
            type="button"
            className="text-xs font-semibold text-slate-500"
            onClick={() => dismissToast(toast.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  )
}
