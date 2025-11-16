import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/get-current-user'
import { createTransaction } from '@/lib/capture/transaction-service'
import { autoCategorizeTran } from '@/lib/capture/auto-category'
import { Prisma } from '@prisma/client'
import type { CSVTransaction } from '@/lib/capture/csv-import'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { transactions } = await request.json() as { transactions: CSVTransaction[] }

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json({ error: 'No transactions provided' }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const csvTxn of transactions) {
      try {
        const amount = parseFloat(csvTxn.amount)
        if (isNaN(amount)) {
          results.failed++
          results.errors.push(`Invalid amount for transaction: ${csvTxn.description}`)
          continue
        }

        const date = csvTxn.date ? new Date(csvTxn.date) : new Date()
        if (isNaN(date.getTime())) {
          results.failed++
          results.errors.push(`Invalid date for transaction: ${csvTxn.description}`)
          continue
        }

        const tags = csvTxn.tags
          ? csvTxn.tags.split(',').map(t => t.trim()).filter(Boolean)
          : []

        // Map to valid PaymentMethod enum
        const paymentMethodMap: Record<string, string> = {
          'CASH': 'CASH',
          'DEBIT_CARD': 'DEBIT_CARD',
          'CREDIT_CARD': 'CREDIT_CARD',
          'E_WALLET': 'E_WALLET',
          'BANK_TRANSFER': 'BANK_TRANSFER',
          'AUTO_DEBIT': 'AUTO_DEBIT',
          'OTHER': 'OTHER',
          // Allow common aliases
          'CARD': 'DEBIT_CARD',
          'TRANSFER': 'BANK_TRANSFER',
          'WALLET': 'E_WALLET',
        }
        
        const paymentMethodInput = (csvTxn.paymentMethod || 'OTHER').toUpperCase()
        const paymentMethod = (paymentMethodMap[paymentMethodInput] || 'OTHER') as any

        // Auto-categorize if category not provided
        const categoryId = await autoCategorizeTran(
          user.id,
          csvTxn.description || 'Imported',
          tags,
          paymentMethod
        )

        await createTransaction({
          userId: user.id,
          amount: new Prisma.Decimal(amount),
          description: csvTxn.description || 'Imported transaction',
          date,
          categoryId: categoryId || undefined,
          paymentMethod,
          tags,
        })

        results.success++
      } catch (err) {
        results.failed++
        results.errors.push(`Failed to import: ${csvTxn.description} - ${err}`)
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      ...results,
    })
  } catch (err) {
    console.error('Failed to import transactions', err)
    return NextResponse.json({ error: 'Failed to import transactions' }, { status: 500 })
  }
}
