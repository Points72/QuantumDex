"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MoonPayIntegration() {
  const [currency, setCurrency] = useState("")
  const [amount, setAmount] = useState("")

  const handleBuy = async () => {
    try {
      const response = await fetch("/api/moonpay-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currency, amount }),
      })
      const result = await response.json()
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error) {
      console.error("Failed to initiate MoonPay transaction:", error)
      // Show error message to user
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Buy Crypto with Fiat</h2>
      <div className="space-y-4">
        <Select onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
            <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
            <SelectItem value="SOL">Solana (SOL)</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button className="w-full" onClick={handleBuy}>
          Buy with MoonPay
        </Button>
      </div>
    </div>
  )
}

