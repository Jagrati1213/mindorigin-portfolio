import { useState } from 'react'
import { StockPrice } from '../types'
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  stockPrices: Record<string, StockPrice>
}

export default function Header({ darkMode, setDarkMode, stockPrices }: HeaderProps) {
  // Get today date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Short the ticker strip by ticker name
  const tickerStrip = Object.values(stockPrices).sort((a, b) => a?.ticker?.localeCompare(b?.ticker || '') || 0)

  // Tablet ticker dropdown
  const [showTickers, setShowTickers] = useState(false)

  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* App name */}
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-darkSlateBlue'}`}>
            Mindorigin Portfolio
          </h1>
          
          {/* Today date and theme toggle */}
          <div className='flex items-center space-x-2'>
            <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {today}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-yellow-400 hover:bg-gray-600' 
                  : 'text-deepLavender hover:bg-gray-300'
                }`}
              aria-label="Toggle dark mode"
              >
              {darkMode ? <MdOutlineLightMode className='text-xl' /> : <MdOutlineDarkMode className='text-xl' />}
            </button>
          </div>
        </div>

        {/* Live Stock Ticker Strip (responsive) */}
        <div className="mt-4">
          {/* Desktop: inline list */}
          <div className="hidden lg:flex flex-wrap gap-6 flex-row-reverse">
            {tickerStrip.length ? tickerStrip.map((stock) => (
              <div key={stock.ticker} className="flex items-center gap-3 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-darkSlateBlue'}`}>
                  {stock?.ticker}
                </span>
                <span className={`${darkMode ? 'text-white' : 'text-gray-600'}`}>
                  ${stock?.price.toFixed(2)}
                </span>
                <span className={`text-sm ${stock?.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock?.changePercent >= 0 ? '+' : ''}
                  {stock?.changePercent.toFixed(2)}%
                </span>
              </div>
            )) : null}
          </div>

          {/* Mobile & Tablet: button that toggles list */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowTickers(prev => !prev)}
              aria-expanded={showTickers}
              className={`w-full justify-between flex items-center px-4 py-2 rounded-md border ${darkMode ? 'border-gray-700 text-gray-100 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'}`}
            >
              <span className="text-sm font-semibold">Tickers</span>
              <span className="text-xs">{showTickers ? 'Hide' : 'Show'}</span>
            </button>
            {showTickers && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 min-h-[200px] overflow-y-auto pr-1">
                {tickerStrip.length ? tickerStrip.map((stock) => (
                  <div
                    key={stock.ticker}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md px-3 py-2 border border-gray-200 dark:border-gray-700"
                  >
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-darkSlateBlue'}`}
                    >
                      {stock?.ticker}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={`${darkMode ? 'text-white' : 'text-gray-600'}`}>
                        ${stock?.price.toFixed(2)}
                      </span>
                      <span className={`text-sm ${stock?.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock?.changePercent >= 0 ? '+' : ''}
                        {stock?.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

