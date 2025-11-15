// Capture Layer - CSV Import
// Client-side CSV parsing with PapaParse

import Papa from 'papaparse'

export interface CSVTransaction {
  date: string
  amount: string
  description: string
  category?: string
  paymentMethod?: string
  tags?: string
}

export function parseCSV(file: File): Promise<CSVTransaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVTransaction>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

export function normalizeCSVData(data: CSVTransaction[]): CSVTransaction[] {
  return data.map(row => ({
    date: row.date || new Date().toISOString(),
    amount: row.amount?.replace(/[^0-9.-]/g, '') || '0',
    description: row.description || 'Imported transaction',
    category: row.category || '',
    paymentMethod: row.paymentMethod || 'OTHER',
    tags: row.tags || '',
  }))
}
