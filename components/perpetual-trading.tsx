"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { TradingViewWidget } from "./trading-view-widget"

export function PerpetualTrading() {
  const [market, setMarket] = useState("")
  const [position, setPosition] = useState<"long" | "short">("long")
  const [leverage, setLeverage] = useState(1)
  const [amount, setAmount] = useState("")

  const handleTrade = async () => {
    try {
      const response = await fetch("/api/execute-perp-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ market, position, leverage, amount }),
      })
      const result = await response.json()
      console.log("Trade executed:", result)
      // Update UI or show notification
    } catch (error) {
      console.error("Failed to execute trade:", error)
      // Show error message to user
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Perpetual Trading</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TradingViewWidget symbol={market} />
        </div>
        <div className="space-y-4">
          <Select onValueChange={setMarket}>
            <SelectTrigger>
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTCUSD">BTC/USD</SelectItem>
              <SelectItem value="ETHUSD">ETH/USD</SelectItem>
              <SelectItem value="SOLUSD">SOL/USD</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Button
              variant={position === "long" ? "default" : "outline"}
              onClick={() => setPosition("long")}
              className="w-1/2"
            >
              Long
            </Button>
            <Button
              variant={position === "short" ? "default" : "outline"}
              onClick={() => setPosition("short")}
              className="w-1/2"
            >
              Short
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leverage: {leverage}x</label>
            <Slider value={[leverage]} onValueChange={(value) => setLeverage(value[0])} max={20} step={1} />
          </div>
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button className="w-full" onClick={handleTrade}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
}

