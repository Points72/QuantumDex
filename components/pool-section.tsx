"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { ArrowUpRight, ArrowDownRight, ExternalLink, Copy, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { fetchPoolData, fetchPoolStats } from "@/lib/api/pool-api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

interface PoolInfo {
  id: number
  pair: string
  tvl: number
  tvlChange: number
  volume24h: number
  volumeChange: number
  fees24h: number
  balances: {
    token1: { symbol: string; amount: number }
    token2: { symbol: string; amount: number }
  }
  version: string
  feeTier: string
}

interface Transaction {
  time: string
  type: "Sell USDC" | "Buy USDC"
  usd: number
  usdc: number
  eth: number
  timestamp: Date
}

interface PoolPair {
  id: string
  name: string
  token0: string
  token1: string
  tvl: number
  volume24h: number
}

// Helper function to generate volume data
const generateVolumeData = (hours: number) => {
  const data = []
  const baseVolume = 70000000 // $70M base volume
  const now = new Date()

  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    data.push({
      time: time.toISOString(),
      volume: Math.random() * baseVolume + 10000000,
      displayTime: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })
  }
  return data
}

const COMMON_TOKENS = [
  { symbol: "WETH", name: "Wrapped Ether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "USDT", name: "Tether USD" },
  { symbol: "DAI", name: "Dai" },
  { symbol: "WBTC", name: "Wrapped Bitcoin" },
]

export function PoolSection() {
  const [timeRange, setTimeRange] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D")
  const [volumeData, setVolumeData] = useState(generateVolumeData(24))
  const [poolInfo, setPoolInfo] = useState<PoolInfo>({
    id: 1,
    pair: "USDC/ETH",
    tvl: 203300000,
    tvlChange: 1.0,
    volume24h: 172300000,
    volumeChange: -47.74,
    fees24h: 86100,
    balances: {
      token1: { symbol: "USDC", amount: 68000000 },
      token2: { symbol: "ETH", amount: 48700 },
    },
    version: "v3",
    feeTier: "0.05%",
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "positions">("overview")
  const [poolPairs, setPoolPairs] = useState<PoolPair[]>([])
  const [selectedPair, setSelectedPair] = useState<PoolPair | null>(null)
  const [poolId, setPoolId] = useState(1) // Added state for poolId
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Update volume data based on time range
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
        time: new Date().toLocaleTimeString(),
        type: Math.random() > 0.5 ? "Sell USDC" : "Buy USDC",
        usd: Math.random() * 100000 + 10000,
        usdc: Math.random() * 100000 + 10000,
        eth: Math.random() * 50 + 1,
        timestamp: new Date(),
      }
      setTransactions((prev) => [newTransaction, ...prev.slice(0, 9)])

      // Update pool info
      setPoolInfo((prev) => ({
        ...prev,
        tvl: prev.tvl + (Math.random() - 0.5) * 1000000,
        volume24h: prev.volume24h + (Math.random() - 0.5) * 1000000,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchPoolPairs = async () => {
      try {
        // Simulated API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: PoolPair[] = COMMON_TOKENS.slice(0, 5).map((token, index) => ({
          id: (index + 1).toString(),
          name: `${token.symbol}/USDT`,
          token0: token.symbol,
          token1: "USDT",
          tvl: Math.random() * 1000000000,
          volume24h: Math.random() * 100000000,
        }))

        setPoolPairs(mockData)
        setSelectedPair(mockData[0])
        setPoolId(Number(mockData[0].id))
      } catch (error) {
        console.error("Failed to fetch pool pairs:", error)
        // You may want to set some error state here
      }
    }

    fetchPoolPairs()
    // Set up an interval to refresh the data every 5 minutes
    const intervalId = setInterval(fetchPoolPairs, 300000)
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const poolData = await fetchPoolData(poolId)
        const poolStats = await fetchPoolStats(poolId)
        setPoolInfo({
          ...poolData,
          ...poolStats,
        })
      } catch (error) {
        console.error("Failed to fetch pool data:", error)
        setError("Failed to load pool data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [poolId])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1B3E] p-3 rounded-lg border border-[#4A90E2]/20 shadow-lg">
          <p className="text-gray-400 text-sm">
            {new Date(label).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-white font-medium">${(payload[0].value / 1000000).toFixed(2)}M</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-gradient-to-r from-[#0A0B1E] to-[#1A1B3E] p-4 sm:p-6 rounded-xl border border-[#4A90E2]/30 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {selectedPair ? (
              <>
                <div className="relative w-12 h-12">
                  <img
                    src={`https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${selectedPair.token0}/logo.png`}
                    alt={selectedPair.token0}
                    className="w-10 h-10 rounded-full border-2 border-[#4A90E2] absolute top-0 left-0 z-10"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <img
                    src={`https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${selectedPair.token1}/logo.png`}
                    alt={selectedPair.token1}
                    className="w-10 h-10 rounded-full border-2 border-[#4A90E2] absolute bottom-0 right-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#1A1B3E] border-2 border-[#4A90E2] animate-pulse"></div>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
              {selectedPair ? selectedPair.name : "Select a pair"}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs sm:text-sm text-[#4A90E2]">
                {poolInfo.version} • {poolInfo.feeTier}
              </span>
              <button className="text-[#ff1cf7] hover:text-[#ff1cf7]/80 transition-colors">
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button className="text-[#ff1cf7] hover:text-[#ff1cf7]/80 transition-colors">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="border-[#ff1cf7] text-[#ff1cf7] hover:bg-[#ff1cf7]/10 transition-colors"
              >
                {selectedPair ? selectedPair.name : "Select Pool"} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-[#0A0B1E] border-l border-[#4A90E2]/30">
              <SheetHeader>
                <SheetTitle className="text-white">Select a Pool</SheetTitle>
                <SheetDescription className="text-gray-400">Choose from the available liquidity pools</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {poolPairs.map((pair) => (
                  <button
                    key={pair.id}
                    className="w-full text-left p-4 rounded-lg bg-[#1A1B3E] hover:bg-[#2A2B4E] transition-colors"
                    onClick={() => {
                      setSelectedPair(pair)
                      setPoolId(Number.parseInt(pair.id)) // Update poolId when selecting a pair
                      // Close the sheet (you might need to implement this functionality)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                          <img
                            src={`https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${pair.token0}/logo.png`}
                            alt={pair.token0}
                            className="w-8 h-8 rounded-full bg-white"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                          <img
                            src={`https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${pair.token1}/logo.png`}
                            alt={pair.token1}
                            className="w-8 h-8 rounded-full bg-white"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                        <span className="font-medium text-white">{pair.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">TVL</p>
                        <p className="font-medium text-white">${pair.tvl.toLocaleString()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#ff1cf7] text-white hover:bg-[#ff1cf7]/80 transition-colors">Add liquidity</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0B1E] border border-[#4A90E2]/30">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
                  Add Liquidity
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Provide liquidity to earn 0.05% trading fees
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="token0">Amount</Label>
                  <div className="relative">
                    <Input
                      id="token0"
                      type="number"
                      placeholder="0.00"
                      className="bg-[#1A1B3E] border-[#4A90E2]/30 pl-14"
                    />
                    <img
                      src={
                        selectedPair
                          ? `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${selectedPair.token0}/logo.png`
                          : "/placeholder.svg"
                      }
                      alt={selectedPair ? selectedPair.token0 : "Token"}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">Balance: 1,000.00 {selectedPair?.token0}</div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="token1">Amount</Label>
                  <div className="relative">
                    <Input
                      id="token1"
                      type="number"
                      placeholder="0.00"
                      className="bg-[#1A1B3E] border-[#4A90E2]/30 pl-14"
                    />
                    <img
                      src={
                        selectedPair
                          ? `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/${selectedPair.token1}/logo.png`
                          : "/placeholder.svg"
                      }
                      alt={selectedPair ? selectedPair.token1 : "Token"}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-400">Balance: 10.00 {selectedPair?.token1}</div>
                </div>
                <div className="bg-[#1A1B3E]/50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Price</span>
                    <span>
                      1 {selectedPair?.token1} = 2,000 {selectedPair?.token0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fee Tier</span>
                    <span>0.05%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Share of Pool</span>
                    <span>0.00%</span>
                  </div>
                </div>
                <Button className="w-full bg-[#ff1cf7] hover:bg-[#ff1cf7]/80 text-white">Add Liquidity</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-[#4A90E2]/30 mb-6">
        {["overview", "analytics", "positions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 capitalize transition-colors ${
              activeTab === tab ? "text-[#ff1cf7] border-b-2 border-[#ff1cf7]" : "text-gray-400 hover:text-[#4A90E2]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!isLoading && !error && (
        <>
          {/* Chart Section */}
          <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#4A90E2]/30 shadow-lg mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">${(poolInfo.tvl / 1000000).toFixed(2)}M</h2>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-2 space-y-2 sm:space-y-0">
                {(["1H", "1D", "1W", "1M", "1Y"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg transition-all duration-300 ${
                      timeRange === range
                        ? "bg-[#ff1cf7] text-white"
                        : "bg-[#1A1B3E] text-gray-400 hover:bg-[#ff1cf7]/50 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="#999"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }
                    tickMargin={10}
                  />
                  <YAxis stroke="#999" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} tickMargin={10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="volume"
                    fill="#ff1cf7"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-300 hover:filter hover:brightness-125"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {[
              { title: "TVL", value: `$${(poolInfo.tvl / 1000000).toFixed(1)}M`, change: poolInfo.tvlChange },
              {
                title: "24H volume",
                value: `$${(poolInfo.volume24h / 1000000).toFixed(1)}M`,
                change: poolInfo.volumeChange,
              },
              { title: "24H fees", value: `$${poolInfo.fees24h.toLocaleString()}`, change: null },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg"
              >
                <h3 className="text-[#4A90E2] mb-2">{stat.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  {stat.change !== null && (
                    <span className={`flex items-center ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#4A90E2]/30 overflow-x-auto">
            <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
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
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-t border-gray-800">
                      <td className="py-4">{tx.time}</td>
                      <td className={`py-4 ${tx.type === "Sell USDC" ? "text-red-500" : "text-green-500"}`}>
                        {tx.type}
                      </td>
                      <td className="py-4">${tx.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="py-4">{tx.usdc.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="py-4">{tx.eth.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

