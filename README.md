# Mindorigin Portfolio Dashboard

A responsive, real-time investment portfolio dashboard built with React, TypeScript, and Tailwind CSS. This application displays a user's investment portfolio with live stock price updates, performance charts, and comprehensive portfolio analytics.

## Features

### Core Features
- **Live Stock Ticker Strip**: Real-time scrolling ticker showing stock prices and changes in the header
- **Portfolio Summary Cards**: Key metrics including total invested, current value, profit/loss, and today's change
- **Holdings Table**: Comprehensive table with sorting, search, and live price updates
- **Performance Chart**: Interactive area chart showing portfolio value over the last 10 days
- **Responsive Design**: Fully responsive layout that works seamlessly on desktop and mobile devices

### Bonus Features
- **Dark Mode Toggle**: Light/dark theme switcher with smooth transitions
- **Price Update Animations**: Visual feedback when stock prices change (green fade for up, red fade for down)
- **WebSocket Simulation**: Simulated real-time price updates (ready for production WebSocket integration)
- **Error Handling**: Robust error handling for WebSocket disconnections

## Tech Stack

- **Framework**: React 18.2.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.3.6
- **Charts**: Recharts 2.10.3
- **State Management**: React Hooks (useState, useEffect, useMemo, useRef)

## Project Structure

```
mindorigin-portfolio/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # App header with ticker strip and theme toggle
│   │   ├── PortfolioSummary.tsx    # Summary cards component
│   │   ├── HoldingsTable.tsx        # Holdings table with sorting and search
│   │   └── PerformanceChart.tsx    # Portfolio performance chart
│   ├── hooks/
│   │   └── useWebSocket.ts          # WebSocket hook for live price updates
│   ├── types.ts                     # TypeScript type definitions
│   ├── App.tsx                      # Main application component
│   ├── main.tsx                     # Application entry point
│   └── index.css                    # Global styles and animations
├── public/                          # Static assets
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.ts                   # Vite configuration
└── README.md                        # This file
```

## WebSocket Integration

Currently, the application uses a simulated WebSocket connection that updates stock prices every 2 seconds using `setInterval()`. The prices are simulated with realistic variations.

### Production WebSocket Setup

To integrate with a real WebSocket API, update the `useWebSocket` hook in `src/hooks/useWebSocket.ts`. The file includes commented code examples for:

- **Finnhub WebSocket**: `wss://ws.finnhub.io?token=YOUR_API_KEY`

### Example: Finnhub Integration

1. Get your API key from [Finnhub](https://finnhub.io/)
2. Replace the simulated code in `useWebSocket.ts` with the commented production code
3. Update the WebSocket URL with your API key
4. Handle the WebSocket message format according to Finnhub's documentation

## Mock Data

The application comes with pre-configured mock portfolio data:
- Apple Inc. (AAPL) - 10 shares
- Microsoft Corporation (MSFT) - 15 shares
- Amazon.com Inc. (AMZN) - 5 shares
- Google LLC (GOOGL) - 8 shares
- Tesla Inc. (TSLA) - 12 shares
- Meta Platforms Inc. (META) - 7 shares

You can modify the holdings in `src/App.tsx` to customize the portfolio.

## AI Assistance

Parts of this project were accelerated with AI tooling to help iterate on UI polish, responsiveness tweaks, and component refactors while keeping manual review over the final output.

---

