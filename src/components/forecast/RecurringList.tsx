interface RecurringItem {
  id: string
  description: string
  nextCharge: string
  amount: number
  categoryName?: string
}

interface RecurringListProps {
  items: RecurringItem[]
}

export function RecurringList({ items }: RecurringListProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">Capture</p>
      <h2 className="text-lg font-semibold">Upcoming recurring payments</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">{item.description}</p>
              <p className="text-xs text-slate-500">
                {item.categoryName ?? 'Uncategorized'} · Next {item.nextCharge}
              </p>
            </div>
            <p className="text-sm font-semibold">{item.amount.toFixed(2)}</p>
          </li>
        ))}
        {items.length === 0 && <li className="text-slate-500">No recurring payments tracked yet.</li>}
      </ul>
    </div>
  )
}
