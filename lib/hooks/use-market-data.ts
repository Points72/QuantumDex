"use client"

import { useState, useEffect } from "react"

export interface MarketData {
  rank: number
  symbol: string
  name: string
  price: number
  change1h: number
  change24h: number
  fdv: number
  volume: number
  sparkline: number[]
}

export function useMarketData() {
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // In production, replace with actual API call
        const mockData: MarketData[] = [
          {
            rank: 1,
            symbol: "ETH",
            name: "Ethereum",
            price: 2587.88,
            change1h: -0.2,
            change24h: -3.74,
            fdv: 7.7e9,
            volume: 1.0e9,
            sparkline: Array(24)
              .fill(0)
              .map(() => 2500 + (Math.random() * 200 - 100)),
          },
          {
            rank: 2,
            symbol: "USDC",
            name: "USD Coin",
            price: 1.0,
            change1h: 0.0,
            change24h: 0.0,
            fdv: 56.0e9,
            volume: 567.0e6,
            sparkline: Array(24)
              .fill(0)
              .map(() => 1 + (Math.random() * 0.001 - 0.0005)),
          },
          {
            rank: 3,
            symbol: "WBTC",
            name: "Wrapped BTC",
            price: 95423.43,
            change1h: -0.2,
            change24h: -2.38,
            fdv: 12.3e9,
            volume: 227.0e6,
            sparkline: Array(24)
              .fill(0)
              .map(() => 95000 + (Math.random() * 1000 - 500)),
          },
        ]

        setMarketData(mockData)
      } catch (error) {
        console.error("Failed to fetch market data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return { marketData, isLoading }
}

