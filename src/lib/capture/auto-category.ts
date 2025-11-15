// Capture Layer - Auto Category Rules
// Handles automatic categorization of transactions based on keywords

import { prisma } from '@/lib/prisma'

export async function autoCategorizeTran(
  userId: string,
  description: string,
  tags: string[],
  paymentMethod: string
): Promise<string | null> {
  const rules = await prisma.autoCategoryRule.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      priority: 'asc',
    },
  })

  const lowerDesc = description.toLowerCase()
  const lowerTags = tags.map(t => t.toLowerCase())

  for (const rule of rules) {
    const lowerKeyword = rule.keyword.toLowerCase()

    if (rule.matchField === 'description' && lowerDesc.includes(lowerKeyword)) {
      return rule.categoryId
    }

    if (rule.matchField === 'tags' && lowerTags.some(tag => tag.includes(lowerKeyword))) {
      return rule.categoryId
    }

    if (rule.matchField === 'paymentMethod' && paymentMethod.toLowerCase() === lowerKeyword) {
      return rule.categoryId
    }
  }

  return null
}
