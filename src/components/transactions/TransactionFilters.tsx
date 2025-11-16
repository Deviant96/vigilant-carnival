'use client'

import { TransactionFilterState } from './types'

interface TransactionFiltersProps {
  value: TransactionFilterState
  onChange: (value: TransactionFilterState) => void
}

export function TransactionFilters({ value, onChange }: TransactionFiltersProps) {
  const handleChange = (partial: Partial<TransactionFilterState>) => {
    onChange({ ...value, ...partial })
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Search
          <input
            type="text"
            value={value.search}
            onChange={event => handleChange({ search: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="description, tag..."
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Category
          <input
            type="text"
            value={value.category}
            onChange={event => handleChange({ category: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Category name"
          />
        </label>
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Payment Method
          <select
            value={value.paymentMethod}
            onChange={event =>
              handleChange({ paymentMethod: event.target.value as TransactionFilterState['paymentMethod'] })
            }
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option value="ALL">All methods</option>
            <option value="CASH">Cash</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="E_WALLET">E-wallet</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="AUTO_DEBIT">Auto Debit</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-wide text-slate-500">
        <label className="flex-1">
          From
          <input
            type="date"
            value={value.startDate ?? ''}
            onChange={event => handleChange({ startDate: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="flex-1">
          To
          <input
            type="date"
            value={value.endDate ?? ''}
            onChange={event => handleChange({ endDate: event.target.value })}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <input
            type="checkbox"
            checked={value.onlyAnomalies}
            onChange={event => handleChange({ onlyAnomalies: event.target.checked })}
            className="rounded border"
          />
          Only anomalies
        </label>
      </div>
    </div>
  )
}
