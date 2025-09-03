import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import CSVUpload from './components/CSVUpload'
import SpendingDashboard from './components/SpendingDashboard'
import AIRecommendations from './components/AIRecommendations'
import SavingsOpportunities from './components/SavingsOpportunities'
import { processCSVData, categorizeTransactions } from './utils/csvProcessor'
import { generateAIRecommendations } from './utils/aiService'
import { calculateBudgetMetrics } from './utils/budgetCalculator'

function App() {
  const [transactions, setTransactions] = useState([])
  const [categorizedTransactions, setCategorizedTransactions] = useState([])
  const [budgetMetrics, setBudgetMetrics] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentView, setCurrentView] = useState('upload')

  const handleCSVUpload = async (csvData) => {
    setIsProcessing(true)
    try {
      const processedData = processCSVData(csvData)
      setTransactions(processedData)
      
      // Categorize transactions using AI
      const categorized = await categorizeTransactions(processedData)
      setCategorizedTransactions(categorized)
      
      // Calculate budget metrics
      const metrics = calculateBudgetMetrics(categorized)
      setBudgetMetrics(metrics)
      
      // Generate AI recommendations
      const recommendations = await generateAIRecommendations(categorized, metrics)
      setAiRecommendations(recommendations)
      
      setCurrentView('dashboard')
    } catch (error) {
      console.error('Error processing CSV:', error)
      alert('Error processing CSV file. Please check the format and try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetData = () => {
    setTransactions([])
    setCategorizedTransactions([])
    setBudgetMetrics(null)
    setAiRecommendations(null)
    setCurrentView('upload')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onReset={resetData} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'upload' && (
          <CSVUpload onUpload={handleCSVUpload} isProcessing={isProcessing} />
        )}
        
        {currentView === 'dashboard' && categorizedTransactions.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Your Financial Dashboard</h1>
              <button
                onClick={() => setCurrentView('upload')}
                className="btn-secondary"
              >
                Upload New Data
              </button>
            </div>
            
            <SpendingDashboard 
              transactions={categorizedTransactions}
              budgetMetrics={budgetMetrics}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AIRecommendations recommendations={aiRecommendations} />
              <SavingsOpportunities 
                transactions={categorizedTransactions}
                budgetMetrics={budgetMetrics}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
