import { useState, useEffect, useRef } from 'react'
import { StockPrice } from '../types'

const FINNHUB_WS_URL = (() => {
  const apiKey = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined
  return apiKey ? `wss://ws.finnhub.io?token=${apiKey}` : null
})()

export function useWebSocket(tickers: string[]): Record<string, StockPrice> {
  const [prices, setPrices] = useState<Record<string, StockPrice>>({})
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>(
    FINNHUB_WS_URL ? 'disconnected' : 'error'
  )
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Base price map
  const basePrices: Record<string, number> = {
    AAPL: 175.5,
    MSFT: 380,
    AMZN: 145,
    GOOGL: 140,
    TSLA: 250,
    META: 320,
  }

  useEffect(() => {
    if (!FINNHUB_WS_URL) {
      setConnectionStatus('error')
      return
    }

    const connect = () => {
      wsRef.current = new WebSocket(FINNHUB_WS_URL)
      
      // connect the socket
      wsRef.current.onopen = () => {
        setConnectionStatus('connected')
        console.log('WebSocket connected')
        // send subscription for tickers
        tickers.forEach((ticker) => {
          wsRef.current?.send(JSON.stringify({ type: 'subscribe', symbol: ticker }))
        })
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (!message || message.type !== 'trade' || !Array.isArray(message.data)) {
            return
          }

          const updates: Record<string, StockPrice> = {}
          message.data.forEach((trade: { s: string; p: number }) => {
            const symbol = trade.s
            const price = trade.p
            const base = basePrices[symbol] || price
            const change = price - base
            const changePercent = base ? (change / base) * 100 : 0

            updates[symbol] = {
              ticker: symbol,
              price: Number(price.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              timestamp: Date.now(),
            }
          })

          if (Object.keys(updates).length) {
            setPrices((prev) => ({ ...prev, ...updates }))
          }
        } catch {
          console.error('Invalid WebSocket data format')
        }
      }

      wsRef.current.onclose = () => {
        console.warn('WebSocket disconnected, retrying...')
        setConnectionStatus('disconnected')
        reconnect()
      }

      wsRef.current.onerror = () => {
        console.error('WebSocket error')
        setConnectionStatus('error')
        wsRef.current?.close()
      }
    }

    const reconnect = () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current)
      reconnectTimeout.current = setTimeout(() => {
        console.log('Attempting to reconnect...')
        connect()
      }, 3000)
    }

    connect()
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        tickers.forEach((ticker) => {
          wsRef.current?.send(JSON.stringify({ type: 'unsubscribe', symbol: ticker }))
        })
      }
      wsRef.current?.close()
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
        reconnectTimeout.current = null
      }
    }
  }, [tickers.join(','), FINNHUB_WS_URL])

  // If no data received, simulate random updates every 2s (fallback)
  useEffect(() => {
    if (connectionStatus !== 'connected') {
      const interval = setInterval(() => {
        setPrices((prev) => {
          const updated = { ...prev }
          tickers.forEach((ticker) => {
            const base = basePrices[ticker] || 100
            const current = prev[ticker]?.price || base
            const randomChange = (Math.random() - 0.5) * 4 // -2% to +2%
            const newPrice = current * (1 + randomChange / 100)
            const change = newPrice - base
            const changePercent = (change / base) * 100

            updated[ticker] = {
              ticker,
              price: +newPrice.toFixed(2),
              change: +change.toFixed(2),
              changePercent: +changePercent.toFixed(2),
              timestamp: Date.now(),
            }
          })
          return updated
        })
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [connectionStatus, tickers.join(',')])

  return prices
}
