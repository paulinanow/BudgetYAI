// CSV Processing and AI Categorization Utilities

// Enhanced date parsing function to support multiple formats
const parseDate = (dateString) => {
  if (!dateString) return null
  
  const dateStr = dateString.toString().trim()
  
  // Try different date formats
  const formats = [
    // DD/MM/YYYY (European format)
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // 31/12/2024
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,    // 31-12-2024
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,  // 31.12.2024
    
    // YYYY-MM-DD (ISO format)
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,    // 2024-12-31
    
    // MM/DD/YYYY (US format)
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // 12/31/2024
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,    // 12-31-2024
    
    // DD/MM/YY (European short format)
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,  // 31/12/24
    /^(\d{1,2})-(\d{1,2})-(\d{2})$/,    // 31-12-24
  ]
  
  for (let i = 0; i < formats.length; i++) {
    const match = dateStr.match(formats[i])
    if (match) {
      let day, month, year
      
      if (i < 3) {
        // DD/MM/YYYY format (European)
        day = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
      } else if (i === 3) {
        // YYYY-MM-DD format (ISO)
        year = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
      } else if (i >= 4 && i <= 5) {
        // MM/DD/YYYY format (US) - but we need to detect if it's actually DD/MM
        const firstPart = parseInt(match[1], 10)
        const secondPart = parseInt(match[2], 10)
        
        // If first part > 12, it's likely DD/MM format
        if (firstPart > 12) {
          day = firstPart
          month = secondPart
        } else if (secondPart > 12) {
          // If second part > 12, it's likely MM/DD format
          month = firstPart
          day = secondPart
        } else {
          // Ambiguous case - assume DD/MM for European users
          day = firstPart
          month = secondPart
        }
        year = parseInt(match[3], 10)
      } else if (i >= 6) {
        // DD/MM/YY format (European short)
        day = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        
        // Convert 2-digit year to 4-digit
        if (year < 50) {
          year += 2000
        } else {
          year += 1900
        }
      }
      
      // Validate the date
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
        const date = new Date(year, month - 1, day)
        if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
          return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
        }
      }
    }
  }
  
  // Fallback: try JavaScript's native Date parsing
  const fallbackDate = new Date(dateStr)
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate.toISOString().split('T')[0]
  }
  
  console.warn(`Could not parse date: ${dateString}`)
  return null
}

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
        // Parse date using enhanced date parsing function
        standardizedRow.date = parseDate(standardizedRow.date)
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
    { Date: '01/01/2024', Description: 'Grocery Store', Amount: '-45.67', Category: 'Food & Dining' },
    { Date: '02/01/2024', Description: 'Gas Station', Amount: '-32.50', Category: 'Transportation' },
    { Date: '03/01/2024', Description: 'Salary Deposit', Amount: '2500.00', Category: 'Income' },
    { Date: '04/01/2024', Description: 'Netflix Subscription', Amount: '-15.99', Category: 'Entertainment' },
    { Date: '05/01/2024', Description: 'Restaurant', Amount: '-67.89', Category: 'Food & Dining' },
    { Date: '06/01/2024', Description: 'Electric Bill', Amount: '-89.45', Category: 'Utilities' },
    { Date: '07/01/2024', Description: 'Amazon Purchase', Amount: '-23.99', Category: 'Shopping' },
    { Date: '08/01/2024', Description: 'Gas Station', Amount: '-28.75', Category: 'Transportation' },
    { Date: '09/01/2024', Description: 'Coffee Shop', Amount: '-4.50', Category: 'Food & Dining' },
    { Date: '10/01/2024', Description: 'Movie Theater', Amount: '-12.99', Category: 'Entertainment' }
  ]
  
  return sampleData
}
