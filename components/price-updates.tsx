"use client"

import { useState, useEffect } from "react"

export function PriceUpdates() {
  const [prices, setPrices] = useState({ usdc: 1, sol: 0 })

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/prices")
        const data = await response.json()
        setPrices(data)
      } catch (error) {
        console.error("Failed to fetch prices:", error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  return <div className="fixed bottom-4 right-4 flex items-center gap-2">{/* Price updates content removed */}</div>
}

