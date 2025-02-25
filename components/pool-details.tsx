"use client"

import { useState, useEffect } from "react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Copy, ExternalLink, TrendingUp, Activity } from "lucide-react"

// Enhanced mock data generator for the volume chart
const generateVolumeData = (hours: number) => {
  const data = []
  for (let i = 0; i < hours; i++) {
    data.push({
      time: `${i}:00`,
      volume: Math.random() * 70000000 + 10000000,
      price: Math.random() * 500 + 1500,
      liquidity: Math.random() * 1000000 + 500000,
    })
  }
  return data
}

interface Transaction {
  id: string
  type: "Sell USDC" | "Buy USDC"
  usdAmount: number
  usdcAmount: number
  ethAmount: number
  timestamp: string
}

interface PoolStats {
  apr: number
  tvl: number
  volume24h: number
  fees24h: number
  priceRange: {
    min: number
    max: number
    current: number
  }
}

export function PoolDetails() {
  const [timeRange, setTimeRange] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D")
  const [volumeData, setVolumeData] = useState(generateVolumeData(24))
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "positions">("overview")
  const [poolStats, setPoolStats] = useState<PoolStats>({
    apr: 12.5,
    tvl: 203300000,
    volume24h: 172300000,
    fees24h: 86100,
    priceRange: {
      min: 1450,
      max: 1950,
      current: 1680,
    },
  })

  useEffect(() => {
    // Update chart data based on time range
    const hours = {
      "1H": 60,
      "1D": 24,
      "1W": 168,
      "1M": 720,
      "1Y": 8760,
    }[timeRange]
    setVolumeData(generateVolumeData(hours))
  }, [timeRange])

  useEffect(() => {
    // Simulate real-time transactions
    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substring(7),
        type: Math.random() > 0.5 ? "Sell USDC" : "Buy USDC",
        usdAmount: Math.random() * 100000 + 10000,
        usdcAmount: Math.random() * 100000 + 10000,
        ethAmount: Math.random() * 50 + 1,
        timestamp: new Date().toISOString(),
      }
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])

      // Update pool stats
      setPoolStats((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          current: prev.priceRange.current + (Math.random() - 0.5) * 10,
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1B3E] p-4 rounded-lg border border-pink-500/20">
          <p className="text-gray-400">Time: {label}</p>
          <p className="text-white">Volume: ${Number(payload[0].value).toLocaleString()}</p>
          <p className="text-white">Price: ${payload[0].payload.price.toFixed(2)}</p>
          <p className="text-white">Liquidity: ${Number(payload[0].payload.liquidity).toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img src="/usdc-logo.png" alt="USDC" className="w-8 h-8" />
            <img src="/eth-logo.png" alt="ETH" className="w-8 h-8 -ml-2" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">USDC / ETH</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">v3 • 0.05%</span>
              <button className="text-pink-500 hover:text-pink-400">
                <Copy className="w-4 h-4" />
              </button>
              <button className="text-pink-500 hover:text-pink-400">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
            Swap
          </button>
          <button className="px-6 py-2 bg-pink-500/10 text-pink-500 rounded-lg hover:bg-pink-500/20 transition-colors">
            Add liquidity
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 ${activeTab === "overview" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 ${activeTab === "analytics" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`px-4 py-2 ${activeTab === "positions" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-400"}`}
        >
          Positions
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart section */}
        <div className="lg:col-span-2 bg-[#1A1B3E]/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">$675.99M</h2>
            <div className="flex space-x-2">
              {(["1H", "1D", "1W", "1M", "1Y"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-md text-sm ${timeRange === range ? "bg-pink-500" : "bg-[#1A1B3E]"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats section */}
        <div className="space-y-6">
          <div className="bg-[#1A1B3E]/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Pool Stats</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 mb-2">Pool balances</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img src="/usdc-logo.png" alt="USDC" className="w-5 h-5" />
                    <span>68.0M USDC</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img src="/eth-logo.png" alt="ETH" className="w-5 h-5" />
                    <span>48.7K ETH</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 mb-2">Price Range</h3>
                <div className="relative h-2 bg-gray-800 rounded-full mb-2">
                  <div
                    className="absolute h-full bg-pink-500 rounded-full"
                    style={{
                      left: `${((poolStats.priceRange.current - poolStats.priceRange.min) / (poolStats.priceRange.max - poolStats.priceRange.min)) * 100}%`,
                      width: "4px",
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span>${poolStats.priceRange.min}</span>
                  <span className="text-pink-500">${poolStats.priceRange.current.toFixed(2)}</span>
                  <span>${poolStats.priceRange.max}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1B3E] p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-400 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>APR</span>
                  </div>
                  <span className="text-xl font-bold">{poolStats.apr}%</span>
                </div>
                <div className="bg-[#1A1B3E] p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-400 mb-2">
                    <Activity className="w-4 h-4" />
                    <span>Fee Tier</span>
                  </div>
                  <span className="text-xl font-bold">0.05%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1B3E]/50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Your Position</h2>
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You don't have a position in this pool yet</p>
              <button className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                Add liquidity
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions section */}
      <div className="bg-[#1A1B3E]/50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-4">Time</th>
                <th className="pb-4">Type</th>
                <th className="pb-4">USD</th>
                <th className="pb-4">USDC</th>
                <th className="pb-4">ETH</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-gray-800">
                  <td className="py-4">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                  <td className={`py-4 ${tx.type === "Sell USDC" ? "text-red-500" : "text-green-500"}`}>{tx.type}</td>
                  <td className="py-4">${tx.usdAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="py-4">{tx.usdcAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="py-4">{tx.ethAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

