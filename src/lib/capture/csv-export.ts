// Capture Layer - CSV Export
// Server-side CSV generation

import type { Transaction, Category } from '@prisma/client'

type TransactionWithCategory = Transaction & {
  category?: Category | null
}

export function generateCSV(transactions: TransactionWithCategory[]): string {
  const headers = ['date', 'amount', 'description', 'category', 'paymentMethod', 'tags']
  const rows = transactions.map(t => [
    t.date.toISOString().split('T')[0],
    t.amount.toString(),
    (t.description || '').replace(/"/g, '""'), // Escape quotes
    t.category?.name || '',
    t.paymentMethod,
    t.tags.join(', '),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}
