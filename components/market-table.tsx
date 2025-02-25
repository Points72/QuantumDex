"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { fetchMarketData } from "@/lib/api/market-api"
import type { TokenMarketData } from "@/lib/types/market"
import { MiniChart } from "./mini-chart"

export function MarketTable() {
  const [marketData, setMarketData] = useState<TokenMarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const data = await fetchMarketData()
      setMarketData(data)
      setIsLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`
    return `$${num.toFixed(decimals)}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-400">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Token name</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">1 hour</th>
            <th className="px-4 py-3">1 day</th>
            <th className="px-4 py-3">FDV</th>
            <th className="px-4 py-3">Volume</th>
            <th className="px-4 py-3">Last 24h</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-8">
                Loading market data...
              </td>
            </tr>
          ) : (
            marketData.map((token) => (
              <tr key={token.rank} className="border-t border-gray-800 hover:bg-[#1A1B3E]/30 transition-colors">
                <td className="px-4 py-4 text-sm">{token.rank}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/tokens/${token.symbol.toLowerCase()}.png`}
                      alt={token.name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-400">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">${token.price.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`flex items-center ${token.priceChange1h >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.priceChange1h >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(token.priceChange1h)}%
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`flex items-center ${token.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {token.priceChange24h >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(token.priceChange24h)}%
                  </span>
                </td>
                <td className="px-4 py-4">{formatNumber(token.fdv)}</td>
                <td className="px-4 py-4">{formatNumber(token.volume)}</td>
                <td className="px-4 py-4 w-[120px]">
                  <MiniChart data={token.chartData} color={token.priceChange24h >= 0 ? "#10B981" : "#EF4444"} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

