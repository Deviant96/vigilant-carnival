import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'

async function importTSModule(modulePath) {
  const source = fs.readFileSync(modulePath, 'utf-8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  })

  const cacheDir = path.join(process.cwd(), '.ts-test-cache')
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir)
  }

  const tempFile = path.join(cacheDir, `llm-client-${Date.now()}-${Math.random()}.mjs`)
  fs.writeFileSync(tempFile, outputText)
  try {
    return await import(pathToFileURL(tempFile).href)
  } finally {
    fs.unlinkSync(tempFile)
  }
}

const modulePath = path.resolve('src/lib/insights/llm-client.ts')

test('buildAdvicePrompt includes burn rate, categories, and anomalies', async () => {
  const { buildAdvicePrompt } = await importTSModule(modulePath)

  const prompt = buildAdvicePrompt({
    burnRate: { dailyRate: 42.5, projectedMonthly: 1300, totalSpent: 255, days: 6 },
    categoryBreakdown: { Rent: 800, Groceries: 200, Fun: 120 },
    anomalies: [
      {
        amount: 500,
        date: new Date('2024-05-02'),
        description: 'Laptop purchase',
        categoryName: 'Electronics',
      },
    ],
  })

  assert.match(prompt, /Burn rate: \$42.50 per day over the last 6 days/)
  assert.ok(prompt.indexOf('Rent: $800.00') < prompt.indexOf('Groceries: $200.00'))
  assert.match(prompt, /Recent anomalies: 2024-05-02: \$500.00 for Laptop purchase in Electronics/)
  assert.match(prompt, /Return only the advice bullets/)
})

test('generateAdvice returns trimmed provider message', async () => {
  const { generateAdvice } = await importTSModule(modulePath)
  const originalFetch = global.fetch
  const originalApiKey = process.env.OPENAI_API_KEY
  process.env.OPENAI_API_KEY = 'test-key'

  global.fetch = async () =>
    new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: ' Bullet 1\nBullet 2 ',
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  try {
    const advice = await generateAdvice('test prompt')
    assert.equal(advice, 'Bullet 1\nBullet 2')
  } finally {
    global.fetch = originalFetch
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY
    } else {
      process.env.OPENAI_API_KEY = originalApiKey
    }
  }
})
