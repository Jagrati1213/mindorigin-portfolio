import { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Holding, StockPrice } from '../types'

interface PerformanceChartProps {
  holdings: Holding[]
  stockPrices: Record<string, StockPrice>
}

export default function PerformanceChart({ holdings, stockPrices }: PerformanceChartProps) {
  const [historicalData, setHistoricalData] = useState<Array<{ date: string; value: number }>>([])

  useEffect(() => {
    // Generate historical data for the last 10 days
    const generateHistoricalData = () => {
      const data: Array<{ date: string; value: number }> = []
      const today = new Date()

      // Calculate current portfolio value
      const currentValue = holdings.reduce((sum, holding) => {
        const stockPrice = stockPrices[holding.ticker]
        return sum + (stockPrice?.price || holding.avgBuyPrice) * holding.quantity
      }, 0)

      // Generate data points for the last 10 days
      for (let i = 9; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Simulate portfolio value with some variation
        const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
        const value = currentValue * (1 + variation * (i / 9)) // Trend towards current value

        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Number(value.toFixed(2)),
        })
      }

      setHistoricalData(data)
    }

    generateHistoricalData()
    // Update historical data when stock prices change
    const interval = setInterval(generateHistoricalData, 5000)
    return () => clearInterval(interval)
  }, [holdings, stockPrices])

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Portfolio Performance (10 Days)
      </h2>
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
            <XAxis
              dataKey="date"
              className="text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: '#374151' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

