interface BudgetListProps {
  budgets: {
    id: string
    name: string
    period: string
    amount: number
    spent: number
    categoryName?: string
  }[]
}

export function BudgetList({ budgets }: BudgetListProps) {
  return (
    <div className="grid gap-4">
      {budgets.map(budget => {
        const progress = budget.amount === 0 ? 0 : Math.min(1.2, budget.spent / budget.amount)
        const isWarning = progress > 0.85
        return (
          <div key={budget.id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{budget.period}</p>
                <h3 className="text-lg font-semibold">{budget.name}</h3>
                <p className="text-xs text-slate-500">{budget.categoryName ?? 'All categories'}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{budget.spent.toFixed(2)}</p>
                <p className="text-xs text-slate-500">of {budget.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${isWarning ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, progress * 100)}%` }}
              />
            </div>
            {isWarning && (
              <p className="mt-2 text-xs text-rose-600">Approaching limit — reduce spend or adjust budget.</p>
            )}
          </div>
        )
      })}
      {budgets.length === 0 && <p className="text-sm text-slate-500">No budgets configured yet.</p>}
    </div>
  )
}
