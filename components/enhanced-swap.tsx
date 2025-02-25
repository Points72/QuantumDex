"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp } from "lucide-react"

export function EnhancedSwap() {
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [amount, setAmount] = useState("")

  const handleSwap = async () => {
    try {
      const response = await fetch("/api/execute-swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromToken, toToken, amount }),
      })
      const result = await response.json()
      console.log("Swap executed:", result)
      // Update UI or show notification
    } catch (error) {
      console.error("Failed to execute swap:", error)
      // Show error message to user
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>
      <div className="space-y-4">
        <div>
          <Select onValueChange={setFromToken}>
            <SelectTrigger>
              <SelectValue placeholder="From Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="RAY">RAY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              const temp = fromToken
              setFromToken(toToken)
              setToToken(temp)
            }}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <Select onValueChange={setToToken}>
            <SelectTrigger>
              <SelectValue placeholder="To Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL">SOL</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="RAY">RAY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={handleSwap}>
          Swap
        </Button>
      </div>
    </div>
  )
}

