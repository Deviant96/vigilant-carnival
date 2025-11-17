'use client'

import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { TransactionInlineEditor } from './TransactionInlineEditor'
import { TransactionRow } from './types'

interface TransactionTableProps {
  transactions: TransactionRow[]
  userId: string
}

export function TransactionTable({ transactions, userId }: TransactionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [rows, setRows] = useState(transactions)

  useEffect(() => {
    setRows(transactions)
  }, [transactions])

  const highlights = useMemo(() => {
    const messages: string[] = []
    const fridaySpend = rows
      .filter(row => dayjs(row.date).day() === 5)
      .reduce((sum, row) => sum + row.amount, 0)
    const totalSpend = rows.reduce((sum, row) => sum + row.amount, 0)
    if (totalSpend > 0 && fridaySpend / totalSpend > 0.25) {
      messages.push('Transport spikes on Fridays — consider shifting trips earlier in the week.')
    }

    const coffeeCount = rows.filter(row => row.description.toLowerCase().includes('coffee')).length
    if (coffeeCount >= 3) {
      messages.push(`Frequent coffees detected (${coffeeCount} entries). Try batching cafe visits.`)
    }

    if (messages.length === 0) {
      messages.push('No obvious patterns detected in this window.')
    }

    return messages
  }, [rows])

  const handleSave = (updated: TransactionRow) => {
    setRows(previous => previous.map(row => (row.id === updated.id ? updated : row)))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-600">
        {highlights.map(message => (
          <p key={message}>• {message}</p>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
      {rows.map(row => (
        <tr key={row.id} className={row.isAnomaly ? 'bg-rose-50/50' : undefined}>
                <td className="px-4 py-3 align-top text-xs text-slate-500">
                  {dayjs(row.date).format('MMM D')}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{row.description}</div>
                  {row.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">{row.categoryName ?? 'Uncategorized'}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-wide text-slate-500">{row.paymentMethod}</td>
                <td className="px-4 py-3 text-right font-semibold">{row.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="text-xs font-semibold text-slate-500 underline"
                    onClick={() => setEditingId(current => (current === row.id ? null : row.id))}
                  >
                    {editingId === row.id ? 'Close' : 'Edit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingId && (
          <TransactionInlineEditor
            transaction={rows.find(row => row.id === editingId)!}
          userId={userId}
            onCancel={() => setEditingId(null)}
            onSave={handleSave}
          />
      )}
    </div>
  )
}
