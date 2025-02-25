"use client"

import { useState, useEffect } from "react"

interface PriceDataPoint {
  timestamp: number
  price: number
}

export function useTokenPriceHistory(symbol: string) {
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        // In production, replace with actual API call
        const mockData: PriceDataPoint[] = []
        const endDate = new Date()
        const startDate = new Date("2021-01-01")

        // Generate mock data from 2021 to present
        while (startDate <= endDate) {
          const basePrice = 2000 // Base price
          const volatility = 500 // Price volatility
          const trend = Math.sin((startDate.getTime() - new Date("2021-01-01").getTime()) / (1000 * 60 * 60 * 24 * 30)) // Monthly cycle

          mockData.push({
            timestamp: startDate.getTime(),
            price: basePrice + volatility * trend + Math.random() * volatility,
          })

          startDate.setDate(startDate.getDate() + 1)
        }

        setPriceHistory(mockData)
      } catch (error) {
        console.error("Failed to fetch price history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceHistory()
  }, [])

  return { priceHistory, isLoading }
}

