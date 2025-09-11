# BudgetYAI - AI-Powered Personal Finance Dashboard

BudgetYAI is a React-based web application designed as a personal finance dashboard that allows users to upload their bank statements (CSV), automatically categorizes transactions using AI, and provides actionable recommendations for budgeting and savings.

[View BudgetYAI](https://paulinanow.github.io/BudgetYAI/)

## 🚀 Features

### 📊 **CSV Upload & Import**
- Drag-and-drop CSV file upload
- Support for standard bank statement formats
- Automatic data cleaning and validation
- Sample CSV template included for testing

### 🤖 **Smart AI Categorization**
- AI-powered transaction categorization with confidence scores
- 15+ predefined spending categories (Food, Transport, Entertainment, etc.)
- Intelligent keyword matching for accurate classification
- Confidence scoring for transparency

### 📈 **Interactive Spending Dashboard**
- Real-time financial metrics and summaries
- Beautiful charts using Recharts library
- Category breakdown with pie charts
- Monthly spending trends
- Recent transaction history

### 💡 **AI Budget Recommendations**
- Personalized budget suggestions based on spending patterns
- 50/30/20 budget rule analysis
- Smart spending optimization tips
- Risk area identification
- Savings opportunity detection

### 💰 **Savings Opportunities**
- High-spending category analysis
- Recurring expense identification
- Potential savings calculations
- Quick win suggestions
- Cost-cutting recommendations

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **CSV Parsing**: Papaparse
- **Icons**: Lucide React
- **AI**: Simulated AI service (easily replaceable with OpenAI API)

## 🔒 Privacy & Security

- **100% Client-Side Processing**: All data is processed locally in the browser
- **No Server Storage**: No information is stored on external servers
- **Local Data**: Your financial data never leaves your device
- **Sample Data**: Demo functionality with included sample CSV files

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Application header
│   ├── CSVUpload.jsx   # CSV upload interface
│   ├── SpendingDashboard.jsx # Main dashboard
│   ├── AIRecommendations.jsx # AI suggestions
│   └── SavingsOpportunities.jsx # Savings analysis
├── utils/              # Utility functions
│   ├── csvProcessor.js # CSV processing & categorization
│   ├── aiService.js    # AI recommendations engine
│   └── budgetCalculator.js # Financial calculations
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BudgetYAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 📊 CSV Format Requirements

Your CSV file should include these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Date | Transaction date | 01/01/2024 (DD/MM/YYYY) |
| Description | Transaction details | Grocery Store |
| Amount | Transaction amount | £45.67, €123.45, $89.99 |
| Category | Optional category | Food & Dining |

### Supported Date Formats
The application supports multiple date formats for international compatibility:

- **European Format**: `DD/MM/YYYY` (e.g., 31/12/2024)
- **European with dashes**: `DD-MM-YYYY` (e.g., 31-12-2024)
- **European with dots**: `DD.MM.YYYY` (e.g., 31.12.2024)
- **ISO Format**: `YYYY-MM-DD` (e.g., 2024-12-31)
- **US Format**: `MM/DD/YYYY` (e.g., 12/31/2024)
- **Short European**: `DD/MM/YY` (e.g., 31/12/24)

### Supported Currencies
The application automatically recognizes and processes multiple currencies:

- **British Pound**: `£` (GBP) - e.g., £45.67, -£25.00
- **Euro**: `€` (EUR) - e.g., €123.45, +€500.00
- **US Dollar**: `$` (USD) - e.g., $89.99, -$15.50
- **Polish Złoty**: `zł` (PLN) - e.g., zł45.50, -zł120.75

**Currency Features:**
- Automatic symbol detection (beginning or end of amount)
- European number format support (1.234,56)
- Mixed currency support in the same file
- Proper negative/positive amount handling

### Sample CSV Structure
```csv
Date,Description,Amount,Category
01/01/2024,Grocery Store,£45.67,Food & Dining
02/01/2024,Salary Deposit,$2500.00,Income
03/01/2024,Gas Station,€32.50,Transportation
04/01/2024,Netflix Subscription,-£15.99,Entertainment
05/01/2024,Restaurant,-€67.89,Food & Dining
06/01/2024,Polish Restaurant,-zł45.50,Food & Dining
07/01/2024,Salary PLN,zł3500.00,Income
```

## 🎯 Usage Guide

### 1. **Upload Your Data**
- Drag and drop your CSV file or click to browse
- The app will automatically process and categorize transactions
- View real-time processing status

### 2. **Explore Your Dashboard**
- Review spending summaries and trends
- Analyze category breakdowns
- Identify spending patterns

### 3. **Get AI Recommendations**
- Receive personalized budget advice
- Understand your 50/30/20 budget allocation
- Discover savings opportunities

### 4. **Optimize Your Finances**
- Review high-spending categories
- Identify recurring expenses
- Implement suggested cost-cutting measures

## 🔧 Customization

### Adding New Categories
Edit `src/utils/csvProcessor.js` to add new spending categories:

```javascript
const SPENDING_CATEGORIES = {
  'New Category': [
    'keyword1', 'keyword2', 'keyword3'
  ],
  // ... existing categories
}
```

### Integrating Real AI
Replace the simulated AI service in `src/utils/aiService.js` with OpenAI API calls:

```javascript
// Example OpenAI integration
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  })
})
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- All modern browsers

## 🎨 UI Components

Built with TailwindCSS for a modern, clean interface:
- Card-based layouts
- Responsive grids
- Interactive charts
- Smooth animations
- Accessible design

## 🧪 Testing

The application includes sample data for testing:
- Download sample CSV from the upload page
- Test all features without real financial data
- Validate AI categorization accuracy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions or issues:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## 🔮 Future Enhancements

- **Real AI Integration**: OpenAI API for advanced categorization
- **Data Export**: Export insights and reports
- **Goal Setting**: Set and track financial goals
- **Notifications**: Spending alerts and reminders
- **Mobile App**: Native mobile application
- **Data Sync**: Cloud storage options (optional)

---

**Built with ❤️ for better financial health**

*Remember: This tool provides educational insights. Always consult with a financial advisor for personalized advice.*
