// Capture Layer - CSV Export
// Server-side CSV generation

import type { Transaction } from '@prisma/client'

export function generateCSV(transactions: Transaction[]): string {
  const headers = ['Date', 'Amount', 'Description', 'Category', 'Payment Method', 'Tags']
  const rows = transactions.map(t => [
    t.date.toISOString().split('T')[0],
    t.amount.toString(),
    t.description || '',
    t.categoryId || '',
    t.paymentMethod,
    t.tags.join(', '),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}
