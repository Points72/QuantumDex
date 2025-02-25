"use client"

import { useState, useEffect } from "react"
import { getMultipleTokenPrices } from "../lib/price-fetcher"

interface TokenPrice {
  symbol: string
  price: number | null
}

export const useTokenPrices = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        setError(null)
        const tokenList = [
          { id: "wrapped-bitcoin", symbol: "WBTC" },
          { id: "dai", symbol: "DAI" },
          { id: "ethereum", symbol: "ETH" },
          { id: "binancecoin", symbol: "BNB" },
          { id: "matic-network", symbol: "MATIC" },
          { id: "usd-coin", symbol: "USDC" },
          { id: "tether", symbol: "USDT" },
          { id: "solana", symbol: "SOL" },
        ]
        const fetchedPrices = await getMultipleTokenPrices(tokenList)
        setPrices(fetchedPrices)
      } catch (err) {
        setError("Failed to fetch prices. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [])

  return { prices, loading, error }
}

