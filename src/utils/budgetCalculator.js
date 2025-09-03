// Budget Calculator Utilities

// Calculate comprehensive budget metrics
export const calculateBudgetMetrics = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return null
  }

  const totalIncome = transactions
    .filter(t => parseFloat(t.amount) > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  // Calculate category breakdown
  const categoryBreakdown = transactions.reduce((acc, transaction) => {
    const category = transaction.category || 'Uncategorized'
    const amount = parseFloat(transaction.amount) || 0
    
    if (acc[category]) {
      acc[category].total += Math.abs(amount)
      acc[category].count += 1
      if (amount < 0) {
        acc[category].expenses += Math.abs(amount)
      } else {
        acc[category].income += amount
      }
    } else {
      acc[category] = {
        total: Math.abs(amount),
        count: 1,
        expenses: amount < 0 ? Math.abs(amount) : 0,
        income: amount > 0 ? amount : 0
      }
    }
    return acc
  }, {})

  // Calculate monthly averages
  const monthlyAverages = calculateMonthlyAverages(transactions)

  // Calculate spending patterns
  const spendingPatterns = analyzeSpendingPatterns(transactions)

  // Calculate budget health score
  const budgetHealthScore = calculateBudgetHealthScore(totalIncome, totalExpenses, savingsRate)

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      transactionCount: transactions.length
    },
    categoryBreakdown,
    monthlyAverages,
    spendingPatterns,
    budgetHealthScore,
    recommendations: generateBudgetRecommendations(totalIncome, totalExpenses, savingsRate)
  }
}

// Calculate monthly averages
const calculateMonthlyAverages = (transactions) => {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const amount = parseFloat(transaction.amount) || 0
    
    if (acc[monthKey]) {
      acc[monthKey].income += Math.max(amount, 0)
      acc[monthKey].expenses += Math.abs(Math.min(amount, 0))
      acc[monthKey].count += 1
    } else {
      acc[monthKey] = {
        month: monthKey,
        income: Math.max(amount, 0),
        expenses: Math.abs(Math.min(amount, 0)),
        count: 1
      }
    }
    return acc
  }, {})

  const months = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
  
  if (months.length === 0) return null

  const avgIncome = months.reduce((sum, month) => sum + month.income, 0) / months.length
  const avgExpenses = months.reduce((sum, month) => sum + month.expenses, 0) / months.length
  const avgSavings = avgIncome - avgExpenses

  return {
    averageMonthlyIncome: avgIncome,
    averageMonthlyExpenses: avgExpenses,
    averageMonthlySavings: avgSavings,
    months: months
  }
}

// Analyze spending patterns
const analyzeSpendingPatterns = (transactions) => {
  const patterns = {
    dayOfWeek: {},
    timeOfMonth: {},
    categoryTrends: {},
    irregularExpenses: []
  }

  // Day of week analysis
  transactions.forEach(transaction => {
    if (parseFloat(transaction.amount) < 0) {
      const date = new Date(transaction.date)
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
      const amount = Math.abs(parseFloat(transaction.amount))
      
      if (patterns.dayOfWeek[dayOfWeek]) {
        patterns.dayOfWeek[dayOfWeek] += amount
      } else {
        patterns.dayOfWeek[dayOfWeek] = amount
      }
    }
  })

  // Time of month analysis
  transactions.forEach(transaction => {
    if (parseFloat(transaction.amount) < 0) {
      const date = new Date(transaction.date)
      const dayOfMonth = date.getDate()
      const amount = Math.abs(parseFloat(transaction.amount))
      
      let timeOfMonth
      if (dayOfMonth <= 10) timeOfMonth = 'Early Month'
      else if (dayOfMonth <= 20) timeOfMonth = 'Mid Month'
      else timeOfMonth = 'Late Month'
      
      if (patterns.timeOfMonth[timeOfMonth]) {
        patterns.timeOfMonth[timeOfMonth] += amount
      } else {
        patterns.timeOfMonth[timeOfMonth] = amount
      }
    }
  })

  // Category trends
  const categorySpending = transactions.reduce((acc, transaction) => {
    if (parseFloat(transaction.amount) < 0) {
      const category = transaction.category || 'Uncategorized'
      const amount = Math.abs(parseFloat(transaction.amount))
      
      if (acc[category]) {
        acc[category].total += amount
        acc[category].count += 1
        acc[category].average = acc[category].total / acc[category].count
      } else {
        acc[category] = {
          total: amount,
          count: 1,
          average: amount
        }
      }
    }
    return acc
  }, {})

  patterns.categoryTrends = categorySpending

  // Identify irregular expenses (expenses that are 2x the average for that category)
  Object.entries(categorySpending).forEach(([category, data]) => {
    transactions.forEach(transaction => {
      if (transaction.category === category && parseFloat(transaction.amount) < 0) {
        const amount = Math.abs(parseFloat(transaction.amount))
        if (amount > data.average * 2) {
          patterns.irregularExpenses.push({
            category,
            amount,
            date: transaction.date,
            description: transaction.description,
            averageForCategory: data.average
          })
        }
      }
    })
  })

  return patterns
}

// Calculate budget health score (0-100)
const calculateBudgetHealthScore = (totalIncome, totalExpenses, savingsRate) => {
  let score = 100

  // Deduct points for overspending
  if (totalExpenses > totalIncome) {
    score -= 30
  } else if (totalExpenses > totalIncome * 0.9) {
    score -= 15
  } else if (totalExpenses > totalIncome * 0.8) {
    score -= 5
  }

  // Add points for good savings rate
  if (savingsRate >= 20) {
    score += 20
  } else if (savingsRate >= 15) {
    score += 15
  } else if (savingsRate >= 10) {
    score += 10
  } else if (savingsRate >= 5) {
    score += 5
  }

  // Deduct points for very low savings
  if (savingsRate < 0) {
    score -= 20
  } else if (savingsRate < 5) {
    score -= 10
  }

  return Math.max(0, Math.min(100, score))
}

// Generate budget recommendations
const generateBudgetRecommendations = (totalIncome, totalExpenses, savingsRate) => {
  const recommendations = []

  if (totalExpenses > totalIncome) {
    recommendations.push({
      priority: 'high',
      type: 'critical',
      title: 'Emergency: Spending Exceeds Income',
      description: 'Your expenses are higher than your income. Immediate action is required.',
      actions: [
        'Review and cut non-essential expenses',
        'Consider additional income sources',
        'Create a strict budget plan'
      ]
    })
  }

  if (savingsRate < 10) {
    recommendations.push({
      priority: 'medium',
      type: 'warning',
      title: 'Low Savings Rate',
      description: `Your savings rate is ${savingsRate.toFixed(1)}%, below the recommended 10-20%.`,
      actions: [
        'Aim to save at least 10% of income',
        'Set up automatic savings transfers',
        'Review recurring expenses'
      ]
    })
  }

  if (totalExpenses > totalIncome * 0.8) {
    recommendations.push({
      priority: 'medium',
      type: 'info',
      title: 'High Expense Ratio',
      description: 'Your expenses represent a high percentage of income, limiting savings potential.',
      actions: [
        'Review the 50/30/20 budget rule',
        'Identify areas for cost reduction',
        'Consider lifestyle adjustments'
      ]
    })
  }

  if (savingsRate >= 20) {
    recommendations.push({
      priority: 'low',
      type: 'success',
      title: 'Excellent Savings Rate',
      description: `Great job! Your ${savingsRate.toFixed(1)}% savings rate is above the recommended 20%.`,
      actions: [
        'Consider investment opportunities',
        'Build emergency fund',
        'Plan for long-term goals'
      ]
    })
  }

  return recommendations
}

// Calculate debt-to-income ratio
export const calculateDebtToIncomeRatio = (transactions) => {
  const totalIncome = transactions
    .filter(t => parseFloat(t.amount) > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  // This would need to be enhanced with actual debt data
  // For now, we'll estimate based on recurring payments
  const recurringPayments = transactions
    .filter(t => parseFloat(t.amount) < 0)
    .reduce((acc, t) => {
      const description = (t.description || '').toLowerCase()
      if (description.includes('loan') || description.includes('credit') || description.includes('mortgage')) {
        return acc + Math.abs(parseFloat(t.amount))
      }
      return acc
    }, 0)

  return totalIncome > 0 ? (recurringPayments / totalIncome) * 100 : 0
}

// Calculate emergency fund adequacy
export const calculateEmergencyFundAdequacy = (transactions) => {
  const monthlyExpenses = transactions
    .filter(t => parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)

  const totalSavings = transactions
    .filter(t => parseFloat(t.amount) > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) - monthlyExpenses

  const monthsCovered = monthlyExpenses > 0 ? totalSavings / monthlyExpenses : 0

  return {
    monthlyExpenses,
    totalSavings,
    monthsCovered,
    adequacy: monthsCovered >= 6 ? 'excellent' : 
              monthsCovered >= 3 ? 'good' : 
              monthsCovered >= 1 ? 'fair' : 'poor'
  }
}
