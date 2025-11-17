import dayjs from 'dayjs'
import { getTransactions } from '@/lib/capture/transaction-service'
import type { TransactionFilterState, TransactionRow } from '@/components/transactions/types'
import { TransactionsClient } from './TransactionsClient'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { redirect } from 'next/navigation'

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  if (!user?.id) {
    redirect('/auth/login')
  }

  const startDate = dayjs().subtract(30, 'day')
  const rawTransactions = await getTransactions(user.id, { startDate: startDate.toDate() })

  const rows: TransactionRow[] = rawTransactions.map(transaction => ({
    id: transaction.id,
    amount: Number(transaction.amount),
    date: transaction.date.toISOString(),
    description: transaction.description ?? 'Untitled',
    categoryId: transaction.categoryId ?? undefined,
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
        <p className="text-sm text-slate-500">Manage your transactions with filters and CSV import/export.</p>
      </div>
      <TransactionsClient rows={rows} initialFilters={initialFilters} userId={user.id} />
    </section>
  )
}
