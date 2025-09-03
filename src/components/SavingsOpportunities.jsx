import React, { useMemo } from 'react'
import { PiggyBank, Scissors, TrendingDown, Calculator, Zap } from 'lucide-react'

const SavingsOpportunities = ({ transactions, budgetMetrics }) => {
  const savingsAnalysis = useMemo(() => {
    if (!transactions.length) return null

    // Analyze spending patterns
    const categorySpending = transactions.reduce((acc, transaction) => {
      if (parseFloat(transaction.amount) < 0) { // Only expenses
        const category = transaction.category || 'Uncategorized'
        const amount = Math.abs(parseFloat(transaction.amount))
        
        if (acc[category]) {
          acc[category].total += amount
          acc[category].count += 1
          acc[category].transactions.push(transaction)
        } else {
          acc[category] = {
            total: amount,
            count: 1,
            transactions: [transaction],
            category
          }
        }
      }
      return acc
    }, {})

    // Find high-spending categories
    const highSpendingCategories = Object.values(categorySpending)
      .filter(cat => cat.total > 100) // Categories with >$100 total spending
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    // Find recurring expenses
    const recurringExpenses = Object.values(categorySpending)
      .filter(cat => cat.count > 2) // Categories with >2 transactions
      .map(cat => ({
        ...cat,
        averagePerTransaction: cat.total / cat.count
      }))
      .sort((a, b) => b.averagePerTransaction - a.averagePerTransaction)
      .slice(0, 3)

    // Calculate potential savings
    const potentialSavings = highSpendingCategories.reduce((total, cat) => {
      // Assume 20% reduction potential for high-spending categories
      return total + (cat.total * 0.2)
    }, 0)

    return {
      highSpendingCategories,
      recurringExpenses,
      potentialSavings,
      totalExpenses: Object.values(categorySpending).reduce((sum, cat) => sum + cat.total, 0)
    }
  }, [transactions])

  if (!savingsAnalysis) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Savings analysis will appear here after processing your data</p>
        </div>
      </div>
    )
  }

  const { highSpendingCategories, recurringExpenses, potentialSavings, totalExpenses } = savingsAnalysis

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-success-100 p-2 rounded-lg">
          <PiggyBank className="h-6 w-6 text-success-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Savings Opportunities</h3>
      </div>

      {/* Potential Savings Summary */}
      <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-success-700">Potential Monthly Savings</p>
            <p className="text-2xl font-bold text-success-900">
              ${potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-success-100 p-3 rounded-lg">
            <Calculator className="h-6 w-6 text-success-600" />
          </div>
        </div>
        <p className="text-sm text-success-600 mt-2">
          Based on 20% reduction potential in high-spending categories
        </p>
      </div>

      {/* High-Spending Categories */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingDown className="h-5 w-5 text-danger-600" />
          <span>High-Spending Categories</span>
        </h4>
        
        <div className="space-y-3">
          {highSpendingCategories.map((category, index) => (
            <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">{category.category}</p>
                  <p className="text-sm text-red-700">
                    {category.count} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-900">
                    ${category.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-red-600">
                    {((category.total / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              </div>
              
              {/* Savings suggestion */}
              <div className="mt-3 p-2 bg-white rounded border border-red-100">
                <p className="text-sm text-red-800">
                  💡 Potential savings: ${(category.total * 0.2).toLocaleString('en-US', { minimumFractionDigits: 2 })}/month
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Expenses */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Scissors className="h-5 w-5 text-warning-600" />
          <span>Recurring Expenses</span>
        </h4>
        
        <div className="space-y-3">
          {recurringExpenses.map((expense, index) => (
            <div key={index} className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-warning-900">{expense.category}</p>
                  <p className="text-sm text-warning-700">
                    {expense.count} transactions this month
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning-900">
                    ${expense.averagePerTransaction.toLocaleString('en-US', { minimumFractionDigits: 2 })} avg
                  </p>
                  <p className="text-sm text-warning-600">
                    ${expense.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} total
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary-600" />
          <span>Quick Wins</span>
        </h4>
        
        <div className="space-y-3">
          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-900">Review Subscriptions</p>
                <p className="text-sm text-primary-700">
                  Cancel unused subscriptions and negotiate better rates
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-900">Meal Planning</p>
                <p className="text-sm text-primary-700">
                  Reduce dining out and plan meals to cut food costs
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Zap className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-primary-900">Energy Efficiency</p>
                <p className="text-sm text-primary-700">
                  Switch to energy-efficient appliances and habits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💰 These savings estimates are based on spending patterns. 
          Actual savings may vary based on your specific situation and implementation.
        </p>
      </div>
    </div>
  )
}

export default SavingsOpportunities
