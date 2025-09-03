import React from 'react'
import { TrendingUp, RefreshCw } from 'lucide-react'

const Header = ({ onReset }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">BudgetYAI</h1>
              <p className="text-sm text-gray-600">AI-Powered Personal Finance Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            title="Reset and upload new data"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
