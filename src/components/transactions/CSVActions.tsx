'use client'

import { useState, useRef } from 'react'
import { parseCSV, normalizeCSVData } from '@/lib/capture/csv-import'
import { useRouter } from 'next/navigation'

interface CSVActionsProps {
  startDate?: string
  endDate?: string
}

export function CSVActions({ startDate, endDate }: CSVActionsProps) {
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleExport = async () => {
    setExporting(true)
    setMessage(null)

    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/transactions/export?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: 'Transactions exported successfully!' })
    } catch (err) {
      console.error('Export error:', err)
      setMessage({ type: 'error', text: 'Failed to export transactions' })
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setMessage(null)

    try {
      const csvData = await parseCSV(file)
      const normalized = normalizeCSVData(csvData)

      const response = await fetch('/api/transactions/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: normalized }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Import failed')
      }

      setMessage({ 
        type: 'success', 
        text: `Import completed: ${result.success} successful, ${result.failed} failed` 
      })

      if (result.success > 0) {
        setTimeout(() => {
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      console.error('Import error:', err)
      setMessage({ type: 'error', text: 'Failed to import transactions' })
    } finally {
      setImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? 'Exporting...' : '⬇ Export CSV'}
        </button>

        <label className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
          {importing ? 'Importing...' : '⬆ Import CSV'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        <p className="mb-2 font-medium text-slate-700">CSV Format:</p>
        <p className="mb-1">Required: <span className="font-mono">date, amount, description</span></p>
        <p className="mb-1">Optional: <span className="font-mono">category, paymentMethod, tags</span></p>
        <p className="mb-2">Payment methods: CASH, DEBIT_CARD, CREDIT_CARD, E_WALLET, BANK_TRANSFER, AUTO_DEBIT, OTHER</p>
        <a
          href="/sample-transactions.csv"
          download
          className="text-blue-600 underline hover:text-blue-700"
        >
          Download sample CSV template
        </a>
      </div>
    </div>
  )
}
