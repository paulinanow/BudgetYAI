// CSV Processing and AI Categorization Utilities

// Common spending categories with keywords for AI categorization
const SPENDING_CATEGORIES = {
  'Food & Dining': [
    'restaurant', 'cafe', 'food', 'dining', 'meal', 'lunch', 'dinner', 'breakfast',
    'grocery', 'supermarket', 'market', 'bakery', 'butcher', 'deli', 'takeout',
    'delivery', 'pizza', 'burger', 'sushi', 'coffee', 'starbucks', 'mcdonalds'
  ],
  'Transportation': [
    'gas', 'fuel', 'petrol', 'uber', 'lyft', 'taxi', 'cab', 'parking', 'toll',
    'metro', 'subway', 'bus', 'train', 'airline', 'flight', 'car', 'auto',
    'maintenance', 'repair', 'insurance', 'registration', 'dmv'
  ],
  'Entertainment': [
    'netflix', 'spotify', 'hulu', 'amazon prime', 'youtube', 'movie', 'cinema',
    'theater', 'concert', 'show', 'game', 'gaming', 'steam', 'playstation',
    'xbox', 'nintendo', 'ticket', 'event', 'festival', 'amusement', 'park'
  ],
  'Shopping': [
    'amazon', 'walmart', 'target', 'costco', 'best buy', 'home depot', 'lowes',
    'clothing', 'shoes', 'apparel', 'electronics', 'furniture', 'home', 'decor',
    'jewelry', 'accessories', 'department store', 'mall', 'outlet'
  ],
  'Utilities': [
    'electric', 'electricity', 'gas', 'water', 'sewer', 'trash', 'waste',
    'internet', 'cable', 'phone', 'telephone', 'mobile', 'cell', 'utility',
    'power', 'energy', 'heating', 'cooling', 'ac', 'hvac'
  ],
  'Healthcare': [
    'doctor', 'hospital', 'medical', 'pharmacy', 'drug', 'medicine', 'prescription',
    'dental', 'vision', 'eye', 'optometrist', 'dentist', 'physician', 'clinic',
    'therapy', 'counseling', 'psychologist', 'psychiatrist', 'insurance'
  ],
  'Education': [
    'school', 'college', 'university', 'tuition', 'fee', 'book', 'textbook',
    'course', 'class', 'training', 'workshop', 'seminar', 'conference',
    'student loan', 'scholarship', 'grant', 'library', 'museum'
  ],
  'Housing': [
    'rent', 'mortgage', 'home', 'house', 'apartment', 'condo', 'property',
    'maintenance', 'repair', 'improvement', 'renovation', 'furniture', 'appliance',
    'hoa', 'association', 'property tax', 'insurance'
  ],
  'Personal Care': [
    'haircut', 'salon', 'spa', 'massage', 'beauty', 'cosmetic', 'makeup',
    'skincare', 'gym', 'fitness', 'workout', 'exercise', 'yoga', 'pilates',
    'personal trainer', 'nutritionist', 'dietitian'
  ],
  'Travel': [
    'hotel', 'lodging', 'accommodation', 'vacation', 'trip', 'journey', 'tour',
    'cruise', 'resort', 'airbnb', 'booking', 'expedia', 'hotels.com',
    'souvenir', 'tourist', 'attraction', 'museum', 'gallery'
  ]
}

// AI-powered transaction categorization
export const categorizeTransactions = async (transactions) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return transactions.map(transaction => {
    const description = (transaction.description || '').toLowerCase()
    const amount = parseFloat(transaction.amount) || 0
    
    // Try to find a matching category based on description keywords
    let bestCategory = 'Uncategorized'
    let bestScore = 0
    
    for (const [category, keywords] of Object.entries(SPENDING_CATEGORIES)) {
      let score = 0
      for (const keyword of keywords) {
        if (description.includes(keyword)) {
          score += 1
        }
      }
      
      if (score > bestScore) {
        bestScore = score
        bestCategory = category
      }
    }
    
    // Special handling for income vs expenses
    if (amount > 0) {
      bestCategory = 'Income'
    }
    
    // Add confidence score (simulated AI confidence)
    const confidence = bestScore > 0 ? Math.min(0.9, 0.5 + (bestScore * 0.1)) : 0.3
    
    return {
      ...transaction,
      category: bestCategory,
      confidence: confidence,
      originalCategory: transaction.category || null
    }
  })
}

// Process and clean CSV data
export const processCSVData = (csvData) => {
  return csvData
    .filter(row => row && Object.keys(row).length > 0) // Remove empty rows
    .map(row => {
      // Standardize column names
      const standardizedRow = {}
      
      // Handle common CSV column variations
      if (row.Date || row.date || row.DATE) {
        standardizedRow.date = row.Date || row.date || row.DATE
      }
      if (row.Description || row.description || row.DESC || row.desc) {
        standardizedRow.description = row.Description || row.description || row.DESC || row.desc
      }
      if (row.Amount || row.amount || row.AMOUNT) {
        standardizedRow.amount = row.Amount || row.amount || row.AMOUNT
      }
      if (row.Category || row.category || row.CAT || row.cat) {
        standardizedRow.category = row.Category || row.category || row.CAT || row.cat
      }
      
      // Clean and validate data
      if (standardizedRow.date) {
        // Try to parse and standardize date format
        const date = new Date(standardizedRow.date)
        if (!isNaN(date.getTime())) {
          standardizedRow.date = date.toISOString().split('T')[0] // YYYY-MM-DD format
        }
      }
      
      if (standardizedRow.amount) {
        // Clean amount string and convert to number
        const cleanAmount = standardizedRow.amount.toString().replace(/[$,]/g, '')
        standardizedRow.amount = parseFloat(cleanAmount)
      }
      
      if (standardizedRow.description) {
        // Clean description
        standardizedRow.description = standardizedRow.description.toString().trim()
      }
      
      return standardizedRow
    })
    .filter(row => 
      row.date && 
      row.description && 
      !isNaN(row.amount) && 
      row.amount !== 0
    ) // Remove invalid rows
}

// Export sample CSV template
export const generateSampleCSV = () => {
  const sampleData = [
    { Date: '2024-01-01', Description: 'Grocery Store', Amount: '-45.67', Category: 'Food & Dining' },
    { Date: '2024-01-02', Description: 'Gas Station', Amount: '-32.50', Category: 'Transportation' },
    { Date: '2024-01-03', Description: 'Salary Deposit', Amount: '2500.00', Category: 'Income' },
    { Date: '2024-01-04', Description: 'Netflix Subscription', Amount: '-15.99', Category: 'Entertainment' },
    { Date: '2024-01-05', Description: 'Restaurant', Amount: '-67.89', Category: 'Food & Dining' },
    { Date: '2024-01-06', Description: 'Electric Bill', Amount: '-89.45', Category: 'Utilities' },
    { Date: '2024-01-07', Description: 'Amazon Purchase', Amount: '-23.99', Category: 'Shopping' },
    { Date: '2024-01-08', Description: 'Gas Station', Amount: '-28.75', Category: 'Transportation' },
    { Date: '2024-01-09', Description: 'Coffee Shop', Amount: '-4.50', Category: 'Food & Dining' },
    { Date: '2024-01-10', Description: 'Movie Theater', Amount: '-12.99', Category: 'Entertainment' }
  ]
  
  return sampleData
}
