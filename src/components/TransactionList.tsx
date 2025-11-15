// Component - Transaction List
'use client'

interface Transaction {
  id: string
  amount: number
  description: string
  date: Date
  category?: {
    name: string
  }
}

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions yet</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{transaction.description || 'No description'}</p>
                <p className="text-sm text-gray-500">
                  {transaction.category?.name || 'Uncategorized'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{transaction.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
