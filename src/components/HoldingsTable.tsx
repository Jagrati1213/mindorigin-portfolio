import { ReactNode, useState, useMemo, useEffect, useRef } from 'react'
import { Holding, StockPrice, SortField, SortDirection } from '../types'
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";

// types
interface HoldingsTableProps {
  holdings: Holding[]
  stockPrices: Record<string, StockPrice>
}
type ColumnKey = 'company' | 'ticker' | 'quantity' | 'avgBuyPrice' | 'currentPrice' | 'pl'
interface ColumnConfig {
  key: ColumnKey
  label: string
  sortable?: boolean
  align?: 'left' | 'right'
  cellClassName?: string
  render: (args: {
    holding: Holding
    stockPrice?: StockPrice
    currentPrice: number
    pl: number
    plPercent: number
    priceAnimation: 'up' | 'down' | null
  }) => ReactNode
}

export default function HoldingsTable({ holdings, stockPrices }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('company')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceAnimations, setPriceAnimations] = useState<Record<string, 'up' | 'down' | null>>({})
  const prevPricesRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const newAnimations: Record<string, 'up' | 'down' | null> = {}
    
    Object.entries(stockPrices).forEach(([ticker, price]) => {
      const prevPrice = prevPricesRef.current[ticker]
      if (prevPrice && prevPrice !== price.price) {
        newAnimations[ticker] = price.price > prevPrice ? 'up' : 'down'
        setTimeout(() => {
          setPriceAnimations(prev => ({ ...prev, [ticker]: null }))
        }, 500)
      }
      prevPricesRef.current[ticker] = price.price
    })
    
    if (Object.keys(newAnimations).length > 0) {
      setPriceAnimations(prev => ({ ...prev, ...newAnimations }))
    }
  }, [stockPrices])

  const handleSort = (field: SortField) => {
    // Alreddy selected toggle order
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedAndFilteredHoldings = useMemo(() => {
    let filtered = holdings.filter(
      holding =>
        holding.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        holding.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      if (sortField === 'company') {
        aValue = a.company
        bValue = b.company
      } else if (sortField === 'ticker') {
        aValue = a.ticker
        bValue = b.ticker
      } else if (sortField === 'quantity') {
        aValue = a.quantity
        bValue = b.quantity
      } else if (sortField === 'avgBuyPrice') {
        aValue = a.avgBuyPrice
        bValue = b.avgBuyPrice
      } else if (sortField === 'currentPrice') {
        aValue = stockPrices[a.ticker]?.price || 0
        bValue = stockPrices[b.ticker]?.price || 0
      } else {
        // P/L
        const aPL = (stockPrices[a.ticker]?.price || 0) - a.avgBuyPrice
        const bPL = (stockPrices[b.ticker]?.price || 0) - b.avgBuyPrice
        aValue = aPL * a.quantity
        bValue = bPL * b.quantity
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number)
      }
    })
  }, [holdings, stockPrices, sortField, sortDirection, searchQuery])

  const columns: ColumnConfig[] = [
      {
        key: 'company',
        label: 'Company',
        sortable: true,
        align: 'left',
        cellClassName: 'text-sm font-medium text-gray-900 dark:text-white',
        render: ({ holding }) => holding.company,
      },
      {
        key: 'ticker',
        label: 'Ticker',
        sortable: true,
        align: 'left',
        cellClassName: 'text-sm text-gray-500 dark:text-gray-300',
        render: ({ holding }) => holding.ticker,
      },
      {
        key: 'quantity',
        label: 'Quantity',
        sortable: true,
        align: 'right',
        cellClassName: 'text-sm text-gray-500 dark:text-gray-300',
        render: ({ holding }) => holding.quantity,
      },
      {
        key: 'avgBuyPrice',
        label: 'Avg Buy Price',
        sortable: true,
        align: 'right',
        cellClassName: 'text-sm text-gray-500 dark:text-gray-300',
        render: ({ holding }) => `$${holding.avgBuyPrice.toFixed(2)}`,
      },
      {
        key: 'currentPrice',
        label: 'Current Price',
        sortable: true,
        align: 'right',
        cellClassName: '',
        render: ({ currentPrice, stockPrice, priceAnimation }) => (
          <div
            className={`flex items-center justify-end space-x-2 rounded px-2 py-1 ${
              priceAnimation === 'up'
                ? 'price-update-up'
                : priceAnimation === 'down'
                  ? 'price-update-down'
                  : ''
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                stockPrice && stockPrice.changePercent >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              ${currentPrice.toFixed(2)}
            </span>
            {stockPrice && (
              <span
                className={`text-xs ${
                  stockPrice.changePercent >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stockPrice.changePercent >= 0 ? '+' : ''}
                {stockPrice.changePercent.toFixed(2)}%
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'pl',
        label: 'P/L',
        sortable: true,
        align: 'right',
        cellClassName: '',
        render: ({ pl, plPercent }) => (
          <div className="flex flex-col items-end">
            <span
              className={`text-sm font-semibold ${
                pl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              ${pl.toFixed(2)}
            </span>
            <span
              className={`text-xs ${
                plPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {plPercent >= 0 ? '+' : ''}
              {plPercent.toFixed(2)}%
            </span>
          </div>
        ),
      },
    ];

  const SortIcon = ({ field }: { field: SortField }) => {
    // Gray all icons if is not selected
    if (sortField !== field) {
      return <IoArrowDownOutline className="text-gray-400 text-xs rotate-90" />
    }

    // Change the arrow based on ordering
    return sortDirection === 'asc'? (
      <IoArrowUpOutline className="text-purple-600 dark:text-gray-200 text-xs" />
    ) : (
      <IoArrowDownOutline className={`text-purple-600 dark:text-gray-200 text-xs`} />
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Search by company or ticker..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        {
          sortedAndFilteredHoldings?.length
        ?<table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {columns.map((column) => {
                const alignmentClass = column.align === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                const sortableClasses = column.sortable
                  ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                  : ''

                return (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider ${alignmentClass} ${sortableClasses}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className={`flex items-center gap-1 ${alignmentClass}`}>
                      <span>{column.label}</span>
                      {column.sortable && <SortIcon field={column.key} />}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAndFilteredHoldings.map((holding) => {
              const stockPrice = stockPrices[holding.ticker]
              const currentPrice = stockPrice?.price || holding.avgBuyPrice
              const pl = (currentPrice - holding.avgBuyPrice) * holding.quantity
              const plPercent = ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100
              const priceAnimation = priceAnimations[holding.ticker] ?? null

              return (
                <tr
                  key={holding.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={`${holding.id}-${column.key}`}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.align === 'right' ? 'text-right' : 'text-left'
                      } ${column.cellClassName ?? ''}`}
                    >
                      {column.render({
                        holding,
                        stockPrice,
                        currentPrice,
                        pl,
                        plPercent,
                        priceAnimation,
                      })}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        :<div className='block flex items-center justify-center text-md text-deepLavender dark:text-gray-400 mt-10 mx-auto'>
            No details found, for this query {searchQuery}
        </div>
        }
     </div>
    </div>
  )
}

