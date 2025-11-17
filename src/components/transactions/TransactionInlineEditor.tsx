'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TagInput } from '@/components/ui/TagInput'
import { useToast } from '@/components/ui/ToastProvider'
import { useCategories } from '@/hooks/useCategories'
import { useTags } from '@/hooks/useTags'
import { TransactionRow } from './types'
import { CategorySelector } from '@/components/ui/CategorySelector'

interface TransactionInlineEditorProps {
  transaction: TransactionRow
  onSave: (transaction: TransactionRow) => void
  onCancel: () => void
  userId: string
}

export function TransactionInlineEditor({ transaction, onSave, onCancel, userId }: TransactionInlineEditorProps) {
  const [formState, setFormState] = useState<TransactionRow>(transaction)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()
  const { data: categories } = useCategories(userId)
  const { data: tagOptions } = useTags(userId)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formState.description,
          amount: formState.amount,
          categoryId: formState.categoryId,
          tags: formState.tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update transaction')
      }

      const updated = await response.json()
      onSave({
        ...formState,
        amount: Number(updated.amount),
        categoryName: updated.category?.name ?? formState.categoryName,
      })
      router.refresh()
      showToast('Transaction updated')
    } catch (error) {
      console.error(error)
      showToast('Unable to update transaction', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete transaction')
      router.refresh()
      showToast('Transaction deleted')
      onCancel()
    } catch (error) {
      console.error(error)
      showToast('Unable to delete transaction', 'error')
    } finally {
      setIsDeleting(false)
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
          <div className="mt-1">
            <CategorySelector
              categories={categories}
              value={formState.categoryId}
              onChange={(categoryId, categoryName) =>
                setFormState(prev => ({ ...prev, categoryId, categoryName }))
              }
              placeholder="Uncategorized"
            />
          </div>
        </label>
        <label className="text-xs uppercase tracking-wide text-slate-500">
          Tags
          <TagInput
            value={formState.tags}
            onChange={next => setFormState(prev => ({ ...prev, tags: next }))}
            suggestions={tagOptions}
            placeholder="Add a tag"
          />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isSaving}
          className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700 disabled:opacity-60"
        >
          {isDeleting ? 'Removing...' : 'Delete'}
        </button>
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
