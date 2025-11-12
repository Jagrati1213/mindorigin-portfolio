import { ReactNode, useMemo } from "react";
import { Holding, StockPrice } from "../types";
import { IoWalletOutline } from "react-icons/io5";
import { PiHandCoinsDuotone } from "react-icons/pi";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { MdOutlineChangeCircle } from "react-icons/md";

interface PortfolioSummaryProps {
  holdings: Holding[];
  stockPrices: Record<string, StockPrice>;
}
interface SummaryCard {
  title: string;
  value: string;
  subValue?: string;
  trend: "positive" | "negative" | "neutral";
  icon: ReactNode;
}

export default function PortfolioSummary({
  holdings,
  stockPrices,
}: PortfolioSummaryProps) {
  const handleCalculateMetrics = () => {
    let totalInvested = 0;
    let currentValue = 0;
    let previousValue = 0;

    holdings.forEach((h) => {
      const stock = stockPrices[h.ticker];
      if (!stock) return;

      totalInvested += h.quantity * h.avgBuyPrice;
      currentValue += h.quantity * stock.price;
      previousValue += h.quantity * (stock.price - stock.change);
    });

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent =
      totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
    const todayChange = currentValue - previousValue;
    const todayChangePercent =
      previousValue > 0 ? (todayChange / previousValue) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercent,
      todayChange,
      todayChangePercent,
    };
  };
  const metrics = useMemo(
    () => handleCalculateMetrics(),
    [holdings, stockPrices]
  );

  const trendClass: {} = {
    positive: {
      text: "text-emerald-600 dark:text-emerald-600",
      border: "border-t-4 border-t-emerald-600",
      bg: "bg-green-50 dark:bg-green-100",
    },
    negative: {
      text: "text-rose-600 dark:text-rose-600",
      border: "border-t-4 border-t-rose-600",
      bg: "bg-rose-50 dark:bg-slate-400",
    },
    neutral: {
      text: "text-slate-800 dark:text-gray-600",
      border: "border-t-4 border-t-slate-800 dark:border-t-blue-900",
      bg: "bg-slate-50 dark:bg-slate-100",
    },
  };

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPercent = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

  const cards: SummaryCard[] = [
    {
      title: "Total Invested",
      value: formatCurrency(metrics.totalInvested),
      icon: <IoWalletOutline className="text-3xl dark:text-gray-300" />,
      trend: "neutral",
    },
    {
      title: "Current Value",
      value: formatCurrency(metrics.currentValue),
      icon: <PiHandCoinsDuotone className="text-3xl dark:text-gray-300" />,
      trend: "neutral",
    },
    {
      title: "Profit / Loss",
      value: formatCurrency(metrics.profitLoss),
      subValue: formatPercent(metrics.profitLossPercent),
      icon: <HiArrowTrendingUp className="text-3xl dark:text-gray-300" />,
      trend: metrics.profitLoss >= 0 ? "positive" : "negative",
    },
    {
      title: "Today's Change",
      value: formatCurrency(metrics.todayChange),
      subValue: formatPercent(metrics.todayChangePercent),
      icon: <MdOutlineChangeCircle className="text-3xl dark:text-gray-300" />,
      trend:
        metrics.todayChange > 0
          ? "positive"
          : metrics.todayChange < 0
          ? "negative"
          : "neutral",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`rounded-xl border-gray-100 shadow p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
            trendClass[c.trend].bg
          } ${trendClass[c.trend].border}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">
              {c.title}
            </h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              {c.icon}
            </div>
          </div>
          <p className={`text-3xl font-bold mt-4 ${trendClass[c.trend].text}`}>
            {c.value}
          </p>

          {c.subValue && (
            <p className={`text-sm font-semibold ${trendClass[c.trend].text}`}>
              {c.subValue}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
