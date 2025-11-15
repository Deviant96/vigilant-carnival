// Insights Layer - Text Templates
// Pre-defined insight templates

export const insightTemplates = {
  budgetWarning: (category: string, spent: number, budget: number, percentage: number) =>
    `Warning: You've spent ${spent.toFixed(2)} (${percentage.toFixed(0)}%) of your ${budget.toFixed(2)} budget for ${category}.`,

  savingsOpportunity: (category: string, avgSpending: number, potentialSavings: number) =>
    `You could save up to ${potentialSavings.toFixed(2)} per month by reducing ${category} spending from ${avgSpending.toFixed(2)}.`,

  paceAlert: (daysLeft: number, currentSpending: number, projectedSpending: number, budget: number) =>
    `With ${daysLeft} days left, you're on track to spend ${projectedSpending.toFixed(2)} vs. your budget of ${budget.toFixed(2)}.`,

  trendExplanation: (category: string, trend: 'up' | 'down', percentage: number) =>
    `Your ${category} spending is trending ${trend} by ${percentage.toFixed(0)}% compared to last month.`,

  anomalyAlert: (date: string, amount: number, avgAmount: number) =>
    `Unusual spending detected on ${date}: ${amount.toFixed(2)} (${((amount / avgAmount - 1) * 100).toFixed(0)}% above average).`,
}
