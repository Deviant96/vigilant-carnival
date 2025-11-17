'use client'

import { FormEvent, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { transactionSchema } from '@/schemas'
import type { z } from 'zod'
import { useCategories } from '@/hooks/useCategories'
import { useTags } from '@/hooks/useTags'
import { TagInput } from '@/components/ui/TagInput'
import { useToast } from '@/components/ui/ToastProvider'
import { useRouter } from 'next/navigation'
import { CategorySelector } from '@/components/ui/CategorySelector'

const paymentMethods = [
  'CASH',
  'DEBIT_CARD',
  'CREDIT_CARD',
  'E_WALLET',
  'BANK_TRANSFER',
  'AUTO_DEBIT',
  'OTHER',
] as const

type TransactionInput = z.infer<typeof transactionSchema>
type PaymentMethod = (typeof paymentMethods)[number]

interface QuickAddTransactionModalProps {
  userId: string
  onSuccess?: (transaction: TransactionInput) => void
}

export function QuickAddTransactionModal({ userId, onSuccess }: QuickAddTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    amount: '',
    description: '',
    date: dayjs().format('YYYY-MM-DD'),
    categoryId: '',
    paymentMethod: paymentMethods[0] as PaymentMethod,
    tags: [] as string[],
  })
  const { data: categories } = useCategories(userId)
  const { data: tagOptions } = useTags(userId)
  const { showToast } = useToast()
  const router = useRouter()

  const parsedAmount = useMemo(() => Number(formState.amount || 0), [formState.amount])

  const closeModal = () => {
    setIsOpen(false)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = transactionSchema.parse({
        userId,
        amount: parsedAmount,
        categoryId: formState.categoryId || undefined,
        description: formState.description,
        tags: formState.tags,
        date: new Date(formState.date),
        paymentMethod: formState.paymentMethod as TransactionInput['paymentMethod'],
        isRecurring: false,
        currency: 'IDR',
      })

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      onSuccess?.(payload)
      setFormState(prev => ({
        ...prev,
        amount: '',
        description: '',
        tags: [],
      }))
      setIsOpen(false)
      router.refresh()
      showToast('Transaction captured')
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong')
      showToast('Failed to save transaction', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        + Quick Add
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Capture</p>
                <h2 className="text-xl font-semibold">Add transaction</h2>
              </div>
              <button className="text-slate-500" onClick={closeModal} type="button">
                ×
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-600">
                  Amount
                  <input
                    type="number"
                    value={formState.amount}
                    onChange={event => setFormState(prev => ({ ...prev, amount: event.target.value }))}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-slate-600">
                  Date
                  <input
                    type="date"
                    value={formState.date}
                    onChange={event => setFormState(prev => ({ ...prev, date: event.target.value }))}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </label>
              </div>
              <label className="text-sm font-medium text-slate-600">
                Description
                <input
                  type="text"
                  value={formState.description}
                  onChange={event => setFormState(prev => ({ ...prev, description: event.target.value }))}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Coffee, groceries, transport..."
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Category (optional)
                <div className="mt-1">
                  <CategorySelector
                    categories={categories}
                    value={formState.categoryId || undefined}
                    onChange={(categoryId: string | undefined) =>
                      setFormState(prev => ({ ...prev, categoryId: categoryId ?? '' }))
                    }
                    placeholder="Uncategorized"
                  />
                </div>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Payment Method
                <select
                  value={formState.paymentMethod}
                  onChange={event =>
                    setFormState(prev => ({ ...prev, paymentMethod: event.target.value as PaymentMethod }))
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>
                      {method.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Tags
                <TagInput
                  value={formState.tags}
                  onChange={next => setFormState(prev => ({ ...prev, tags: next }))}
                  suggestions={tagOptions}
                  placeholder="coffee, commute, routine"
                />
              </label>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Auto-categorization will run on save.</span>
                <span>{parsedAmount.toFixed(2)}</span>
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border px-4 py-2 text-sm font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
