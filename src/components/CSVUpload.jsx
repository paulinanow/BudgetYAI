import React, { useState, useCallback } from 'react'
import { Upload, Download, FileText, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'

const CSVUpload = ({ onUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = useCallback((file) => {
    setError('')
    
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error parsing CSV file. Please check the format.')
          return
        }
        
        if (results.data.length === 0) {
          setError('CSV file is empty')
          return
        }

        onUpload(results.data)
      },
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        setError('Error reading CSV file: ' + error.message)
      }
    })
  }, [onUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const downloadSampleCSV = () => {
    const sampleData = [
      { Date: '2024-01-01', Description: 'Grocery Store', Amount: '-45.67', Category: 'Food & Dining' },
      { Date: '2024-01-02', Description: 'Gas Station', Amount: '-32.50', Category: 'Transportation' },
      { Date: '2024-01-03', Description: 'Salary Deposit', Amount: '2500.00', Category: 'Income' },
      { Date: '2024-01-04', Description: 'Netflix Subscription', Amount: '-15.99', Category: 'Entertainment' },
      { Date: '2024-01-05', Description: 'Restaurant', Amount: '-67.89', Category: 'Food & Dining' }
    ]
    
    const csv = Papa.unparse(sampleData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-transactions.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to BudgetYAI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Upload your bank statement CSV to get AI-powered insights and personalized budget recommendations
        </p>
      </div>

      <div className="card">
        <div className="text-center mb-6">
          <Upload className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload Your Bank Statement
          </h2>
          <p className="text-gray-600">
            Drag and drop your CSV file here, or click to browse
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isProcessing ? 'Processing...' : 'Choose CSV file or drag here'}
            </p>
            <p className="text-sm text-gray-500">
              Supports standard bank statement formats
            </p>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={downloadSampleCSV}
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Expected CSV Format:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Date column (YYYY-MM-DD format)</li>
            <li>• Description column (transaction details)</li>
            <li>• Amount column (positive for income, negative for expenses)</li>
            <li>• Optional: Category column (will be enhanced by AI)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CSVUpload
