"use client"

import { useMarketData } from "@/lib/hooks/use-market-data"
import { ArrowUp, ArrowDown } from "lucide-react"

function SparklineChart({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  const points = data.map((value, i) => [(i / (data.length - 1)) * 100, 100 - ((value - min) / range) * 100]).join(" ")

  return (
    <svg width="100" height="35" className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`
  return `$${num.toFixed(2)}`
}

export function MarketOverview() {
  const { marketData, isLoading } = useMarketData()

  if (isLoading) {
    return <div className="text-center py-4">Loading market data...</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-400">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Token</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">1h</th>
            <th className="px-4 py-2">24h</th>
            <th className="px-4 py-2">FDV</th>
            <th className="px-4 py-2">Volume</th>
            <th className="px-4 py-2">Last 24h</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((token) => (
            <tr key={token.symbol} className="border-t border-gray-800">
              <td className="px-4 py-4">{token.rank}</td>
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
                <span className={`flex items-center ${token.change1h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {token.change1h >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {Math.abs(token.change1h)}%
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`flex items-center ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {token.change24h >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {Math.abs(token.change24h)}%
                </span>
              </td>
              <td className="px-4 py-4">{formatNumber(token.fdv)}</td>
              <td className="px-4 py-4">{formatNumber(token.volume)}</td>
              <td className="px-4 py-4">
                <SparklineChart data={token.sparkline} color={token.change24h >= 0 ? "#10B981" : "#EF4444"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

