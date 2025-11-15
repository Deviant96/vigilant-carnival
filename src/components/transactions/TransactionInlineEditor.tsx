'use client'

import { FormEvent, useState } from 'react'
import { TransactionRow } from './types'

interface TransactionInlineEditorProps {
  transaction: TransactionRow
  onSave: (transaction: TransactionRow) => void
  onCancel: () => void
}

export function TransactionInlineEditor({ transaction, onSave, onCancel }: TransactionInlineEditorProps) {
  const [formState, setFormState] = useState<TransactionRow>(transaction)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      // API call can be placed here
      onSave(formState)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="grid gap-2 rounded-xl border bg-slate-50 p-3" onSubmit={handleSubmit}>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Description
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.description}
            onChange={event => setFormState(prev => ({ ...prev, description: event.target.value }))}
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.amount}
            onChange={event => setFormState(prev => ({ ...prev, amount: Number(event.target.value) }))}
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Category
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.categoryName ?? ''}
            onChange={event => setFormState(prev => ({ ...prev, categoryName: event.target.value }))}
          />
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Tags
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={formState.tags.join(', ')}
            onChange={event => setFormState(prev => ({ ...prev, tags: event.target.value.split(',').map(tag => tag.trim()) }))}
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
