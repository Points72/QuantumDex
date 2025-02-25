"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"

interface MarketInfo {
  symbol: string
  lastPrice: number
  change24h: number
  volume24h: number
  openInterest: number
}

const FUTURES_MARKETS = [
  "BTC-PERP",
  "ETH-PERP",
  "SOL-PERP",
  "ADA-PERP",
  "XRP-PERP",
  "DOGE-PERP",
  "LINK-PERP",
  "MATIC-PERP",
  "AVAX-PERP",
  "DOT-PERP",
]

export function TradeSection() {
  const [market, setMarket] = useState("BTC-PERP")
  const [position, setPosition] = useState<"long" | "short">("long")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [leverage, setLeverage] = useState(10)
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [marketInfo, setMarketInfo] = useState<MarketInfo>({
    symbol: "BTC-PERP",
    lastPrice: 50000,
    change24h: 2.5,
    volume24h: 1000000000,
    openInterest: 500000000,
  })
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)

  useEffect(() => {
    // Simulating market data updates
    const interval = setInterval(() => {
      setMarketInfo((prevInfo) => ({
        ...prevInfo,
        lastPrice: prevInfo.lastPrice * (1 + (Math.random() - 0.5) * 0.002),
        change24h: prevInfo.change24h + (Math.random() - 0.5),
        volume24h: prevInfo.volume24h * (1 + (Math.random() - 0.5) * 0.1),
        openInterest: prevInfo.openInterest * (1 + (Math.random() - 0.5) * 0.05),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleTrade = async () => {
    setIsLoading(true)
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Here you would typically handle the actual trade execution
    console.log("Trade executed:", { market, position, orderType, leverage, amount, price })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
          Quantum Futures Trading
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="market">Market</Label>
            <Select value={market} onValueChange={setMarket}>
              <SelectTrigger className="w-[180px] bg-[#1A1B3E] border-[#4A90E2]/30">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent>
                {FUTURES_MARKETS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Position</Label>
            <div className="flex space-x-2">
              <Button
                variant={position === "long" ? "default" : "outline"}
                onClick={() => setPosition("long")}
                className={`w-24 ${
                  position === "long" ? "bg-green-600 hover:bg-green-700" : "bg-[#1A1B3E] hover:bg-[#2A2B4E]"
                }`}
              >
                Long
              </Button>
              <Button
                variant={position === "short" ? "default" : "outline"}
                onClick={() => setPosition("short")}
                className={`w-24 ${
                  position === "short" ? "bg-red-600 hover:bg-red-700" : "bg-[#1A1B3E] hover:bg-[#2A2B4E]"
                }`}
              >
                Short
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Order Type</Label>
            <div className="flex space-x-2">
              <Button
                variant={orderType === "market" ? "default" : "outline"}
                onClick={() => setOrderType("market")}
                className={`w-24 ${
                  orderType === "market" ? "bg-[#4A90E2] hover:bg-[#3A80D2]" : "bg-[#1A1B3E] hover:bg-[#2A2B4E]"
                }`}
              >
                Market
              </Button>
              <Button
                variant={orderType === "limit" ? "default" : "outline"}
                onClick={() => setOrderType("limit")}
                className={`w-24 ${
                  orderType === "limit" ? "bg-[#4A90E2] hover:bg-[#3A80D2]" : "bg-[#1A1B3E] hover:bg-[#2A2B4E]"
                }`}
              >
                Limit
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="leverage" className="text-lg font-semibold text-[#7A88FF]">
                Leverage
              </Label>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
                {leverage}x
              </span>
            </div>
            <div className="relative">
              <Slider
                id="leverage"
                min={1}
                max={100}
                step={1}
                value={[leverage]}
                onValueChange={(value) => setLeverage(value[0])}
                className="w-full"
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-[#7A88FF]/10 to-[#4A90E2]/10 rounded-full animate-pulse-slow"></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#1A1B3E] border-[#4A90E2]/30"
              placeholder="Enter amount"
            />
          </div>

          {orderType === "limit" && (
            <div className="space-y-2">
              <Label htmlFor="price">Limit Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-[#1A1B3E] border-[#4A90E2]/30"
                placeholder="Enter limit price"
              />
            </div>
          )}

          <Button
            onClick={handleTrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] hover:from-[#4A90E2] hover:to-[#7A88FF] text-white font-bold py-2 px-4 rounded transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <>
                {position === "long" ? "Open Long" : "Open Short"} {market}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
          Market Info
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Last Price</p>
            <p className="text-xl font-bold">${marketInfo.lastPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">24h Change</p>
            <p className={`text-xl font-bold ${marketInfo.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
              {marketInfo.change24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400">24h Volume</p>
            <p className="text-xl font-bold">${(marketInfo.volume24h / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-gray-400">Open Interest</p>
            <p className="text-xl font-bold">${(marketInfo.openInterest / 1000000).toFixed(2)}M</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg">
        <span className="text-sm font-medium">Advanced Mode</span>
        <Switch
          checked={isAdvancedMode}
          onCheckedChange={setIsAdvancedMode}
          className="data-[state=checked]:bg-[#4A90E2]"
        />
      </div>

      {isAdvancedMode && (
        <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg space-y-4">
          <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
            Advanced Options
          </h3>
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input
              id="stopLoss"
              type="number"
              className="bg-[#1A1B3E] border-[#4A90E2]/30"
              placeholder="Enter stop loss price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input
              id="takeProfit"
              type="number"
              className="bg-[#1A1B3E] border-[#4A90E2]/30"
              placeholder="Enter take profit price"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="trailingStop" />
            <Label htmlFor="trailingStop">Trailing Stop</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="reduceOnly" />
            <Label htmlFor="reduceOnly">Reduce Only</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 cursor-help">
                  <Switch id="postOnly" />
                  <Label htmlFor="postOnly">Post Only</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ensures the order is always the maker, not the taker</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}

