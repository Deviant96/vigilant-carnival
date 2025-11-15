import dayjs from 'dayjs'
import { getTransactions } from '@/lib/capture/transaction-service'
import type { TransactionFilterState, TransactionRow } from '@/components/transactions/types'
import { TransactionsClient } from './TransactionsClient'

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? 'demo-user'

export default async function TransactionsPage() {
  const startDate = dayjs().subtract(30, 'day')
  const rawTransactions = await getTransactions(DEMO_USER_ID, { startDate: startDate.toDate() })

  const rows: TransactionRow[] = rawTransactions.map(transaction => ({
    id: transaction.id,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    description: transaction.description ?? 'Untitled',
    categoryName: transaction.category?.name,
    paymentMethod: transaction.paymentMethod,
    tags: transaction.tags,
    isAnomaly: transaction.isAnomaly ?? false,
  }))

  const initialFilters: TransactionFilterState = {
    search: '',
    category: '',
    paymentMethod: 'ALL',
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    onlyAnomalies: false,
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Capture</p>
        <h1 className="text-3xl font-semibold">Transactions</h1>
        <p className="text-sm text-slate-500">Inline edit, filters, CSV import/export coming soon.</p>
      </div>
      <TransactionsClient rows={rows} initialFilters={initialFilters} />
    </section>
  )
}
