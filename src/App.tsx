import { useState, useEffect } from 'react'
import Header from './components/Header'
import PortfolioSummary from './components/PortfolioSummary'
import HoldingsTable from './components/HoldingsTable'
import PerformanceChart from './components/PerformanceChart'
import { useWebSocket } from './hooks/useWebSocket'
import { PortfolioData } from './types'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [portfolioData] = useState<PortfolioData>({
    holdings: [
      { id: 1, company: 'Apple Inc.', ticker: 'AAPL', quantity: 10, avgBuyPrice: 150.00 },
      { id: 2, company: 'Microsoft Corporation', ticker: 'MSFT', quantity: 15, avgBuyPrice: 300.00 },
      { id: 3, company: 'Amazon.com Inc.', ticker: 'AMZN', quantity: 5, avgBuyPrice: 120.00 },
      { id: 4, company: 'Google LLC', ticker: 'GOOGL', quantity: 8, avgBuyPrice: 140.00 },
      { id: 5, company: 'Tesla Inc.', ticker: 'TSLA', quantity: 12, avgBuyPrice: 200.00 },
      { id: 6, company: 'Meta Platforms Inc.', ticker: 'META', quantity: 7, avgBuyPrice: 250.00 },
    ],
    historicalData: []
  })
  const stockPrices = useWebSocket(portfolioData.holdings.map(h => h.ticker) ?? []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        stockPrices={stockPrices}
      />
      <div className="container mx-auto px-4 py-6 space-y-6 mt-4">
        <PortfolioSummary 
          holdings={portfolioData.holdings}
          stockPrices={stockPrices}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr items-stretch">
          <div className="lg:col-span-2 h-full">
            <HoldingsTable 
              holdings={portfolioData.holdings}
              stockPrices={stockPrices}
            />
          </div>
          <div className="h-full">
            <PerformanceChart 
              holdings={portfolioData.holdings}
              stockPrices={stockPrices}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

