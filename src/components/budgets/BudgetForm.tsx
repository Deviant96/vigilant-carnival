'use client'

import { FormEvent, useState } from 'react'

interface BudgetFormProps {
  onSubmit?: (data: FormData) => Promise<void> | void
}

interface FormData {
  name: string
  amount: string
  period: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
  categoryId: string
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const [formState, setFormState] = useState<FormData>({
    name: '',
    amount: '',
    period: 'MONTHLY',
    categoryId: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      await onSubmit?.(formState)
      setMessage('Draft budget captured. Hook up /api/budgets for persistence.')
      setFormState({ name: '', amount: '', period: 'MONTHLY', categoryId: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="rounded-2xl border bg-white p-4 shadow-sm" onSubmit={handleSubmit}>
      <h3 className="text-lg font-semibold">Create budget</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-600">
          Name
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.name}
            onChange={event => setFormState(prev => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-600">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.amount}
            onChange={event => setFormState(prev => ({ ...prev, amount: event.target.value }))}
            required
          />
        </label>
        <label className="text-sm text-slate-600">
          Period
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.period}
            onChange={event => setFormState(prev => ({ ...prev, period: event.target.value as FormData['period'] }))}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>
        <label className="text-sm text-slate-600">
          Category Id
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.categoryId}
            onChange={event => setFormState(prev => ({ ...prev, categoryId: event.target.value }))}
            placeholder="Optional category focus"
          />
        </label>
      </div>
      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save draft'}
        </button>
      </div>
    </form>
  )
}
