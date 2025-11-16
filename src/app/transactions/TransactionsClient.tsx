'use client'

import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import type { TransactionFilterState, TransactionRow } from '@/components/transactions/types'

interface TransactionsClientProps {
  rows: TransactionRow[]
  initialFilters: TransactionFilterState
}

export function TransactionsClient({ rows, initialFilters }: TransactionsClientProps) {
  const [filters, setFilters] = useState(initialFilters)

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      if (filters.startDate && dayjs(row.date).isBefore(dayjs(filters.startDate), 'day')) {
        return false
      }
      if (filters.endDate && dayjs(row.date).isAfter(dayjs(filters.endDate), 'day')) {
        return false
      }
      if (filters.category && !row.categoryName?.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }
      if (filters.paymentMethod !== 'ALL' && row.paymentMethod !== filters.paymentMethod) {
        return false
      }
      if (filters.search && !row.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.onlyAnomalies && !row.isAnomaly) {
        return false
      }
      return true
    })
  }, [filters, rows])

  return (
    <div className="space-y-4">
      <TransactionFilters value={filters} onChange={setFilters} />
      <TransactionTable transactions={filteredRows} />
    </div>
  )
}
