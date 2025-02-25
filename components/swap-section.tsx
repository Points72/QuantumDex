"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDownUp } from "lucide-react"
import { type TokenInfo, COMMON_TOKENS } from "@/lib/tokens"
import { useTokenPriceHistory } from "@/lib/hooks/use-token-price-history"
import { TokenPriceChart } from "./token-price-chart"
import { MarketOverview } from "./market-overview"

export function SwapSection() {
  const [fromToken, setFromToken] = useState<TokenInfo>(COMMON_TOKENS[0])
  const [toToken, setToToken] = useState<TokenInfo>(COMMON_TOKENS[1])
  const [amount, setAmount] = useState("")
  const { priceHistory, isLoading } = useTokenPriceHistory(fromToken.symbol)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/quantum-grid.svg')] opacity-5 animate-pulse-slow"></div>
        <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30">
          <div className="mb-6">
            <TokenPriceChart data={priceHistory} height={300} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-[#1A1B3E]/50 p-6 rounded-xl border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300 group quantum-border">
              <div className="flex justify-between mb-2">
                <span className="text-[#7A88FF]/80">You send</span>
                <span className="text-[#4A90E2]/80">Balance: {fromToken.symbol} 0.00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-transparent text-2xl focus:outline-none text-[#7A88FF] placeholder-[#4A90E2]/30"
                  placeholder="0.0"
                />
                <div className="relative group">
                  <select
                    value={fromToken.address}
                    onChange={(e) => {
                      const selected = COMMON_TOKENS.find((t) => t.address === e.target.value)
                      if (selected) setFromToken(selected)
                    }}
                    className="appearance-none bg-[#0A0B1E]/80 pl-10 pr-8 py-2 rounded-lg border border-[#4A90E2]/20 hover:border-[#7A88FF]/50 text-[#7A88FF] transition-all duration-300"
                  >
                    {COMMON_TOKENS.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <img
                    src={fromToken.logoUrl || "/placeholder.svg"}
                    alt={fromToken.symbol}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                  />
                </div>
              </div>
              <div className="mt-4 h-[100px]">
                <TokenPriceChart priceHistory={[]} height={100} color="#4A90E2" />
              </div>
            </div>

            <div className="flex justify-center">
              <button className="relative w-full py-4 rounded-xl flex items-center justify-center group overflow-hidden quantum-button">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <ArrowDownUp className="w-6 h-6 text-[#7A88FF] group-hover:text-[#4A90E2] transition-colors duration-300 transform group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            <div className="bg-[#1A1B3E]/50 p-6 rounded-xl border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300 group quantum-border">
              <div className="flex justify-between mb-2">
                <span className="text-[#7A88FF]/80">You receive</span>
                <span className="text-[#4A90E2]/80">Balance: {toToken.symbol} 0.00</span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={amount}
                  className="w-full bg-transparent text-2xl focus:outline-none text-[#7A88FF] placeholder-[#4A90E2]/30"
                  placeholder="0.0"
                  readOnly
                />
                <div className="relative group">
                  <select
                    value={toToken.address}
                    onChange={(e) => {
                      const selected = COMMON_TOKENS.find((t) => t.address === e.target.value)
                      if (selected) setToToken(selected)
                    }}
                    className="appearance-none bg-[#0A0B1E]/80 pl-10 pr-8 py-2 rounded-lg border border-[#4A90E2]/20 hover:border-[#7A88FF]/50 text-[#7A88FF] transition-all duration-300"
                  >
                    {COMMON_TOKENS.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <img
                    src={toToken.logoUrl || "/placeholder.svg"}
                    alt={toToken.symbol}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                  />
                </div>
              </div>
              <div className="mt-4 h-[100px]">
                <TokenPriceChart priceHistory={[]} height={100} color="#4A90E2" />
              </div>
            </div>

            <div className="bg-[#1A1B3E]/50 p-6 rounded-xl space-y-3 border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300 quantum-border">
              <div className="flex justify-between">
                <span className="text-[#7A88FF]/60">Exchange Rate</span>
                <span className="text-[#4A90E2] animate-quantum-flicker">
                  1 {fromToken.symbol} = {0.0} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A88FF]/60">Price Impact</span>
                <span className="text-green-400">0.00%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A88FF]/60">Slippage Tolerance</span>
                <span className="text-[#4A90E2]">0.00%</span>
              </div>
            </div>

            <button className="relative w-full py-4 rounded-xl font-medium group overflow-hidden quantum-button">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[url('/quantum-particles.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative text-white group-hover:scale-105 transform transition-transform duration-300">
                {isLoading ? "Loading Quantum Routes..." : "Quantum Exchange"}
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30">
        <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
          Market Overview
        </h2>
        <MarketOverview />
      </div>
    </div>
  )
}

