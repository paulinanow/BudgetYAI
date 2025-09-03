// AI Service for Budget Recommendations and Insights

// Generate AI-powered budget recommendations
export const generateAIRecommendations = async (transactions, budgetMetrics) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const totalIncome = transactions
    .filter(t => parseFloat(t.amount) > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const totalExpenses = transactions
    .filter(t => parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  // Calculate 50/30/20 rule breakdown
  const budgetRule = [
    {
      name: 'Needs (50%)',
      target: totalIncome * 0.5,
      actual: Math.min(totalExpenses, totalIncome * 0.5),
      percentage: 50,
      status: totalExpenses <= totalIncome * 0.5 ? 'good' : 'danger'
    },
    {
      name: 'Wants (30%)',
      target: totalIncome * 0.3,
      actual: Math.max(0, totalExpenses - totalIncome * 0.5),
      percentage: 30,
      status: totalExpenses <= totalIncome * 0.8 ? 'good' : 'warning'
    },
    {
      name: 'Savings (20%)',
      target: totalIncome * 0.2,
      actual: Math.max(0, totalIncome - totalExpenses),
      percentage: 20,
      status: (totalIncome - totalExpenses) >= totalIncome * 0.2 ? 'good' : 'warning'
    }
  ]
  
  // Generate smart suggestions based on spending patterns
  const suggestions = generateSmartSuggestions(transactions, totalIncome, totalExpenses)
  
  // Identify risk areas
  const riskAreas = identifyRiskAreas(transactions, totalIncome)
  
  // Find savings opportunities
  const opportunities = findSavingsOpportunities(transactions, totalExpenses)
  
  return {
    budgetRule,
    suggestions,
    riskAreas,
    opportunities,
    summary: {
      totalIncome,
      totalExpenses,
      netSavings: totalIncome - totalExpenses,
      savingsRate: ((totalIncome - totalExpenses) / totalIncome) * 100
    }
  }
}

// Generate smart suggestions based on spending analysis
const generateSmartSuggestions = (transactions, totalIncome, totalExpenses) => {
  const suggestions = []
  
  // Analyze food spending
  const foodSpending = transactions
    .filter(t => t.category === 'Food & Dining' && parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  if (foodSpending > totalIncome * 0.15) {
    suggestions.push({
      title: 'Optimize Food Spending',
      description: 'Your food spending is above the recommended 15% of income. Consider meal planning and reducing dining out.',
      potentialSavings: foodSpending * 0.2
    })
  }
  
  // Analyze transportation spending
  const transportSpending = transactions
    .filter(t => t.category === 'Transportation' && parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  if (transportSpending > totalIncome * 0.1) {
    suggestions.push({
      title: 'Review Transportation Costs',
      description: 'Transportation costs are high. Consider carpooling, public transit, or reviewing insurance rates.',
      potentialSavings: transportSpending * 0.15
    })
  }
  
  // Analyze entertainment spending
  const entertainmentSpending = transactions
    .filter(t => t.category === 'Entertainment' && parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  if (entertainmentSpending > totalIncome * 0.1) {
    suggestions.push({
      title: 'Balance Entertainment Budget',
      description: 'Entertainment spending could be optimized. Look for free activities and bundle subscriptions.',
      potentialSavings: entertainmentSpending * 0.25
    })
  }
  
  // General savings suggestions
  if (totalExpenses > totalIncome * 0.8) {
    suggestions.push({
      title: 'Emergency Fund Priority',
      description: 'Focus on building an emergency fund. Aim to save 3-6 months of expenses.',
      potentialSavings: totalIncome * 0.1
    })
  }
  
  // If no specific suggestions, provide general ones
  if (suggestions.length === 0) {
    suggestions.push({
      title: 'Maintain Good Habits',
      description: 'Your spending is well-balanced! Keep up the good work and consider increasing your savings rate.',
      potentialSavings: totalIncome * 0.05
    })
  }
  
  return suggestions
}

// Identify areas of financial risk
const identifyRiskAreas = (transactions, totalIncome) => {
  const riskAreas = []
  
  // Check for high-spending categories
  const categorySpending = transactions.reduce((acc, transaction) => {
    if (parseFloat(transaction.amount) < 0) {
      const category = transaction.category || 'Uncategorized'
      const amount = Math.abs(parseFloat(transaction.amount))
      
      if (acc[category]) {
        acc[category] += amount
      } else {
        acc[category] = amount
      }
    }
    return acc
  }, {})
  
  // Identify categories spending more than 20% of income
  for (const [category, amount] of Object.entries(categorySpending)) {
    if (amount > totalIncome * 0.2) {
      riskAreas.push({
        title: `High ${category} Spending`,
        description: `This category represents ${((amount / totalIncome) * 100).toFixed(1)}% of your income, which is above recommended levels.`,
        currentAmount: amount,
        recommendedAmount: totalIncome * 0.15
      })
    }
  }
  
  // Check for irregular income patterns
  const incomeTransactions = transactions.filter(t => parseFloat(t.amount) > 0)
  if (incomeTransactions.length < 2) {
    riskAreas.push({
      title: 'Irregular Income',
      description: 'You have limited income transactions. Consider diversifying income sources for financial stability.',
      currentAmount: 0,
      recommendedAmount: 0
    })
  }
  
  return riskAreas
}

// Find specific savings opportunities
const findSavingsOpportunities = (transactions, totalExpenses) => {
  const opportunities = []
  
  // Analyze subscription spending
  const subscriptionKeywords = ['netflix', 'spotify', 'hulu', 'amazon prime', 'youtube', 'subscription', 'monthly']
  const subscriptionSpending = transactions
    .filter(t => {
      const description = (t.description || '').toLowerCase()
      return parseFloat(t.amount) < 0 && 
             subscriptionKeywords.some(keyword => description.includes(keyword))
    })
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  if (subscriptionSpending > 50) {
    opportunities.push({
      title: 'Review Subscriptions',
      description: 'Multiple subscriptions detected. Consider bundling services or canceling unused ones.',
      estimatedSavings: subscriptionSpending * 0.3
    })
  }
  
  // Analyze dining out vs groceries
  const diningOut = transactions
    .filter(t => {
      const description = (t.description || '').toLowerCase()
      return t.category === 'Food & Dining' && 
             parseFloat(t.amount) < 0 &&
             (description.includes('restaurant') || description.includes('cafe') || description.includes('dining'))
    })
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  const groceries = transactions
    .filter(t => {
      const description = (t.description || '').toLowerCase()
      return t.category === 'Food & Dining' && 
             parseFloat(t.amount) < 0 &&
             (description.includes('grocery') || description.includes('supermarket') || description.includes('market'))
    })
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
  
  if (diningOut > groceries * 0.8) {
    opportunities.push({
      title: 'Optimize Food Budget',
      description: 'Dining out costs are high relative to groceries. Meal planning could save significantly.',
      estimatedSavings: diningOut * 0.4
    })
  }
  
  // General cost-cutting opportunities
  if (totalExpenses > 2000) {
    opportunities.push({
      title: 'Bulk Purchasing',
      description: 'Consider bulk purchases for frequently used items to reduce per-unit costs.',
      estimatedSavings: totalExpenses * 0.05
    })
  }
  
  return opportunities
}

// Generate spending insights
export const generateSpendingInsights = (transactions) => {
  const insights = []
  
  // Most expensive day of the week
  const dayOfWeekSpending = transactions.reduce((acc, transaction) => {
    if (parseFloat(transaction.amount) < 0) {
      const day = new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'long' })
      const amount = Math.abs(parseFloat(transaction.amount))
      
      if (acc[day]) {
        acc[day] += amount
      } else {
        acc[day] = amount
      }
    }
    return acc
  }, {})
  
  const mostExpensiveDay = Object.entries(dayOfWeekSpending)
    .sort(([,a], [,b]) => b - a)[0]
  
  if (mostExpensiveDay) {
    insights.push({
      type: 'pattern',
      title: 'Most Expensive Day',
      description: `You tend to spend the most on ${mostExpensiveDay[0]}s ($${mostExpensiveDay[1].toFixed(2)} average)`,
      recommendation: 'Consider planning activities on other days to balance spending'
    })
  }
  
  // Spending trends
  const monthlySpending = transactions.reduce((acc, transaction) => {
    if (parseFloat(transaction.amount) < 0) {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'long' })
      const amount = Math.abs(parseFloat(transaction.amount))
      
      if (acc[month]) {
        acc[month] += amount
      } else {
        acc[month] = amount
      }
    }
    return acc
  }, {})
  
  const months = Object.keys(monthlySpending)
  if (months.length > 1) {
    const recentMonth = months[months.length - 1]
    const previousMonth = months[months.length - 2]
    const change = monthlySpending[recentMonth] - monthlySpending[previousMonth]
    
    if (change > 0) {
      insights.push({
        type: 'trend',
        title: 'Spending Increase',
        description: `Your spending increased by $${change.toFixed(2)} from ${previousMonth} to ${recentMonth}`,
        recommendation: 'Review recent purchases to identify areas for cost reduction'
      })
    } else {
      insights.push({
        type: 'trend',
        title: 'Spending Decrease',
        description: `Great job! Your spending decreased by $${Math.abs(change).toFixed(2)} from ${previousMonth} to ${recentMonth}`,
        recommendation: 'Keep up the good work and consider increasing your savings'
      })
    }
  }
  
  return insights
}
