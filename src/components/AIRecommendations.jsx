import React from 'react'
import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const AIRecommendations = ({ recommendations }) => {
  if (!recommendations) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">AI recommendations will appear here after processing your data</p>
        </div>
      </div>
    )
  }

  const { budgetRule, suggestions, riskAreas, opportunities } = recommendations

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Lightbulb className="h-6 w-6 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">AI Budget Recommendations</h3>
      </div>

      {/* 50/30/20 Rule Analysis */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary-600" />
          <span>50/30/20 Budget Rule Analysis</span>
        </h4>
        
        <div className="space-y-3">
          {budgetRule.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  category.status === 'good' ? 'bg-success-500' :
                  category.status === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
                }`} />
                <span className="font-medium text-gray-700">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {category.percentage}% of income
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-success-600" />
          <span>Smart Suggestions</span>
        </h4>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-success-50 border border-success-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-success-900">{suggestion.title}</p>
                  <p className="text-sm text-success-700">{suggestion.description}</p>
                  {suggestion.potentialSavings && (
                    <p className="text-sm font-medium text-success-800 mt-1">
                      Potential savings: ${suggestion.potentialSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}/month
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Areas */}
      {riskAreas.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <span>Areas of Concern</span>
          </h4>
          
          <div className="space-y-3">
            {riskAreas.map((risk, index) => (
              <div key={index} className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-warning-900">{risk.title}</p>
                    <p className="text-sm text-warning-700">{risk.description}</p>
                    <p className="text-sm font-medium text-warning-800 mt-1">
                      Current spending: ${risk.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}/month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings Opportunities */}
      {opportunities.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <span>Savings Opportunities</span>
          </h4>
          
          <div className="space-y-3">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary-900">{opportunity.title}</p>
                    <p className="text-sm text-primary-700">{opportunity.description}</p>
                    <p className="text-sm font-medium text-primary-800 mt-1">
                      Estimated savings: ${opportunity.estimatedSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}/month
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 These recommendations are based on your spending patterns and the 50/30/20 budget rule. 
          Always consult with a financial advisor for personalized advice.
        </p>
      </div>
    </div>
  )
}

export default AIRecommendations
