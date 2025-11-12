import { ReactNode, useMemo } from 'react'
import { Holding, StockPrice } from '../types'
import { IoWalletOutline } from "react-icons/io5";
import { PiHandCoinsDuotone } from "react-icons/pi";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { MdOutlineChangeCircle } from "react-icons/md";

interface PortfolioSummaryProps {
  holdings: Holding[]
  stockPrices: Record<string, StockPrice>
}

type Trend = 'positive' | 'negative' | 'neutral'

interface ThemeStyles {
  accent: string
  background: string
  border?: string
  iconWrapper: string
}

interface SummaryCard {
  key: string
  title: string
  value: string
  trend: Trend
  description?: string
  subValue?: string
  icon: ReactNode
  styles: {
    light: ThemeStyles
    dark: ThemeStyles
  }
}

export default function PortfolioSummary({ holdings, stockPrices }: PortfolioSummaryProps) {
  const handleCalculateMetrics = () => {
    let totalInvested = 0
    let currentValue = 0
    let previousValue = 0

    holdings.forEach(holding => {
      totalInvested += holding.quantity * holding.avgBuyPrice;
      const stockPrice = stockPrices[holding.ticker];
      if (stockPrice) {
        currentValue += holding.quantity * stockPrice.price
        previousValue += holding.quantity * (stockPrice.price - stockPrice.change)
      }
    })

    const profitLoss = currentValue - totalInvested
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0
    const todayChange = currentValue - previousValue
    const todayChangePercent = previousValue > 0 ? (todayChange / previousValue) * 100 : 0

    return {
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercent,
      todayChange,
      todayChangePercent,
    }
  }
  const metrics = useMemo(() => handleCalculateMetrics(), [holdings, stockPrices])

  const trendClass: Record<Trend, string> = {
    positive: 'text-emerald-600 dark:text-emerald-400',
    negative: 'text-rose-600 dark:text-rose-400',
    neutral: 'text-slate-800 dark:text-gray-200',
  }

  const trendSubClass: Record<Trend, string> = {
    positive: 'text-emerald-500 dark:text-emerald-300',
    negative: 'text-rose-500 dark:text-rose-300',
    neutral: 'text-slate-500 dark:text-gray-400',
  }

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  const cards: SummaryCard[] = useMemo(() => [
    {
      key: 'total-invested',
      title: 'Total Invested',
      value: formatCurrency(metrics.totalInvested),
      description: 'Capital deployed so far',
      trend: 'neutral',
      icon: <IoWalletOutline className='text-2xl' />,
      styles: {
        light: {
          accent: 'from-slate-300 via-slate-200 to-slate-300',
          background: 'bg-gradient-to-br from-white via-slate-50 to-slate-100',
          border: 'border-slate-200',
          iconWrapper: 'bg-white/70 text-slate-600',
        },
        dark: {
          accent: 'dark:from-slate-700 dark:via-slate-600 dark:to-slate-700',
          background: 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          iconWrapper: 'dark:bg-slate-900/50 dark:text-slate-300',
        },
      },
    },
    {
      key: 'current-value',
      title: 'Current Value',
      value: formatCurrency(metrics.currentValue),
      description: 'Live market valuation',
      trend: 'neutral',
      icon: <PiHandCoinsDuotone className='text-3xl' />,
      styles: {
        light: {
          accent: 'from-sky-400 via-blue-400 to-sky-500',
          background: 'bg-gradient-to-br from-white via-sky-50 to-white',
          border: 'border-sky-100',
          iconWrapper: 'bg-white/70 text-sky-500',
        },
        dark: {
          accent: 'dark:from-sky-600 dark:via-blue-500 dark:to-indigo-600',
          background: 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          iconWrapper: 'dark:bg-slate-900/50 dark:text-sky-300',
        },
      },
    },
    {
      key: 'profit-loss',
      title: 'Profit/Loss',
      value: formatCurrency(metrics.profitLoss),
      subValue: formatPercent(metrics.profitLossPercent),
      trend: metrics.profitLoss >= 0 ? 'positive' : 'negative',
      icon: <HiArrowTrendingUp className='text-3xl' />,
      styles: {
        light: {
          accent: metrics.profitLoss >= 0
            ? 'from-emerald-400 via-emerald-300 to-emerald-500'
            : 'from-rose-400 via-rose-300 to-rose-500',
          background: metrics.profitLoss >= 0
            ? 'bg-gradient-to-br from-white via-emerald-50 to-white'
            : 'bg-gradient-to-br from-white via-rose-50 to-white',
          border: metrics.profitLoss >= 0 ? 'border-emerald-100' : 'border-rose-100',
          iconWrapper: metrics.profitLoss >= 0
            ? 'bg-white/70 text-emerald-500'
            : 'bg-white/70 text-rose-500',
        },
        dark: {
          accent: metrics.profitLoss >= 0
            ? 'dark:from-emerald-600 dark:via-emerald-500 dark:to-emerald-700'
            : 'dark:from-rose-600 dark:via-rose-500 dark:to-rose-700',
          background: metrics.profitLoss >= 0
            ? 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900'
            : 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-rose-950 dark:to-slate-900',
          iconWrapper: metrics.profitLoss >= 0
            ? 'dark:bg-slate-900/50 dark:text-emerald-300'
            : 'dark:bg-slate-900/50 dark:text-rose-300',
        },
      },
    },
    {
      key: 'today-change',
      title: "Today's Change",
      value: formatCurrency(metrics.todayChange),
      subValue: formatPercent(metrics.todayChangePercent),
      trend: metrics.todayChange > 0 ? 'positive' : metrics.todayChange < 0 ? 'negative' : 'neutral',
      icon: <MdOutlineChangeCircle className='text-3xl' />,
      styles: {
        light: {
          accent: metrics.todayChange > 0
            ? 'from-lime-400 via-lime-300 to-emerald-500'
            : metrics.todayChange < 0
              ? 'from-rose-400 via-orange-300 to-rose-500'
              : 'from-slate-300 via-slate-200 to-slate-300',
          background: metrics.todayChange > 0
            ? 'bg-gradient-to-br from-white via-lime-50 to-white'
            : metrics.todayChange < 0
              ? 'bg-gradient-to-br from-white via-orange-50 to-white'
              : 'bg-gradient-to-br from-white via-slate-50 to-white',
          border: metrics.todayChange > 0
            ? 'border-lime-100'
            : metrics.todayChange < 0
              ? 'border-orange-100'
              : 'border-slate-200',
          iconWrapper: metrics.todayChange > 0
            ? 'bg-white/70 text-emerald-500'
            : metrics.todayChange < 0
              ? 'bg-white/70 text-rose-500'
              : 'bg-white/70 text-slate-600',
        },
        dark: {
          accent: metrics.todayChange > 0
            ? 'dark:from-lime-500 dark:via-emerald-500 dark:to-emerald-700'
            : metrics.todayChange < 0
              ? 'dark:from-rose-600 dark:via-orange-500 dark:to-rose-700'
              : 'dark:from-slate-700 dark:via-slate-600 dark:to-slate-700',
          background: metrics.todayChange > 0
            ? 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900'
            : metrics.todayChange < 0
              ? 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-rose-950 dark:to-slate-900'
              : 'dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          iconWrapper: metrics.todayChange > 0
            ? 'dark:bg-slate-900/50 dark:text-emerald-300'
            : metrics.todayChange < 0
              ? 'dark:bg-slate-900/50 dark:text-rose-300'
              : 'dark:bg-slate-900/50 dark:text-slate-300',
        },
      },
    },
  ], [metrics])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`relative overflow-hidden rounded-xl border ${card.styles.light.border} dark:border-gray-700 ${card.styles.light.background} ${card.styles.dark.background} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
        >
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.styles.light.accent} ${card.styles.dark.accent}`} />
          <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/50 dark:bg-white/10 blur-2xl" />
          <div className="relative space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="mt-1 text-xs font-medium text-slate-400 dark:text-gray-500">
                    {card.description}
                  </p>
                )}
              </div>
              {card.icon && (
                <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${card.styles.light.iconWrapper} ${card.styles.dark.iconWrapper}`}>
                  {card.icon}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className={`text-3xl font-bold ${trendClass[card.trend]}`}>{card.value}</p>
              {card.subValue && card.subValue.includes('%') && (
                <p className={`text-sm font-semibold ${trendSubClass[card.trend]}`}>
                  {card.subValue}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

