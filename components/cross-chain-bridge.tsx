"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CrossChainBridge() {
  const [fromChain, setFromChain] = useState("")
  const [toChain, setToChain] = useState("")
  const [token, setToken] = useState("")
  const [amount, setAmount] = useState("")

  const handleBridge = async () => {
    try {
      const response = await fetch("/api/execute-bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromChain, toChain, token, amount }),
      })
      const result = await response.json()
      console.log("Bridge executed:", result)
      // Update UI or show notification
    } catch (error) {
      console.error("Failed to execute bridge:", error)
      // Show error message to user
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Cross-Chain Bridge</h2>
      <div className="space-y-4">
        <Select onValueChange={setFromChain}>
          <SelectTrigger>
            <SelectValue placeholder="From Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="bsc">Binance Smart Chain</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setToChain}>
          <SelectTrigger>
            <SelectValue placeholder="To Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="bsc">Binance Smart Chain</SelectItem>
            <SelectItem value="solana">Solana</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setToken}>
          <SelectTrigger>
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button className="w-full" onClick={handleBridge}>
          Bridge
        </Button>
      </div>
    </div>
  )
}

