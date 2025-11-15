export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Spending Tracker</h1>
        <p className="text-lg mb-8">
          Personal finance tracker with three-layer architecture:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Capture</h2>
            <p className="text-sm">
              Manual transactions, auto-categorization, recurring expenses, CSV import/export
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Analyze</h2>
            <p className="text-sm">
              Monthly totals, burn rate, anomaly detection, pattern recognition, forecasting
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Advise</h2>
            <p className="text-sm">
              Budget warnings, pace predictions, spending summaries, savings opportunities
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
