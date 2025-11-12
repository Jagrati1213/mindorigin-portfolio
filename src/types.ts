export interface Holding {
  id: number
  company: string
  ticker: string
  quantity: number
  avgBuyPrice: number
}

export interface StockPrice {
  ticker: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

export interface PortfolioData {
  holdings: Holding[]
  historicalData: Array<{
    date: string
    value: number
  }>
}

export type SortField = 'company' | 'ticker' | 'quantity' | 'avgBuyPrice' | 'currentPrice' | 'pl'
export type SortDirection = 'asc' | 'desc'

