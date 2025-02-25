"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"

export const SwapInterface = () => {
  const [inputToken, setInputToken] = useState("")
  const [outputToken, setOutputToken] = useState("")
  const [amount, setAmount] = useState(0)

  const handleSwap = async () => {
    // Get quote from Jupiter
    const quote = await getJupiterQuote(inputToken, outputToken, amount)
    // Execute swap through Jupiter
    await executeJupiterSwap(quote.routes[0])
  }

  return (
    <div className="swap-container">
      {/* Our beautiful UI */}
      <TokenInput value={amount} onChange={setAmount} />
      <TokenSelector onSelect={setInputToken} />
      <TokenSelector onSelect={setOutputToken} />
      <Button onClick={handleSwap}>Swap</Button>
    </div>
  )
}

