"use client"

import { useState } from "react"
import { AmountInput } from "./AmountInput"
import { Button } from "@/components/ui/button"
import { SettingsButton } from "./SettingsButton"
import { SwitchButton } from "./SwitchButton"

export const SwapCard = () => {
  const [inputToken, setInputToken] = useState("")
  const [outputToken, setOutputToken] = useState("")
  const [amount, setAmount] = useState("")

  return (
    <div className="bg-card rounded-xl p-4 w-[480px]">
      <div className="space-y-4">
        <div className="flex justify-between">
          <h3>Swap</h3>
          <SettingsButton />
        </div>

        <div className="space-y-2">
          <AmountInput value={amount} onChange={setAmount} token={inputToken} onSelectToken={setInputToken} />

          <SwitchButton />

          <AmountInput value={"0"} token={outputToken} onSelectToken={setOutputToken} readOnly />
        </div>

        <Button
          className="w-full"
          onClick={() => {
            /* Swap logic */
          }}
        >
          Swap
        </Button>
      </div>
    </div>
  )
}

