// Component - Dashboard Stats
'use client'

interface DashboardStatsProps {
  totalSpent: number
  dailyRate: number
  projectedMonthly: number
}

export default function DashboardStats({ 
  totalSpent, 
  dailyRate, 
  projectedMonthly 
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm text-gray-500 mb-2">Total Spent (30 days)</h3>
        <p className="text-3xl font-bold">{totalSpent.toFixed(2)}</p>
      </div>
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm text-gray-500 mb-2">Daily Burn Rate</h3>
        <p className="text-3xl font-bold">{dailyRate.toFixed(2)}</p>
      </div>
      <div className="p-6 border rounded-lg">
        <h3 className="text-sm text-gray-500 mb-2">Projected Monthly</h3>
        <p className="text-3xl font-bold">{projectedMonthly.toFixed(2)}</p>
      </div>
    </div>
  )
}
