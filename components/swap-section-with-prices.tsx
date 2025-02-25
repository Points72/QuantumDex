"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp } from "lucide-react"
import { type TokenInfo, COMMON_TOKENS } from "@/lib/tokens"
import { getTokenPrices } from "@/lib/coingecko-api"

export default function SwapSectionWithPrices() {
  const [fromToken, setFromToken] = useState<TokenInfo>(COMMON_TOKENS[0])
  const [toToken, setToToken] = useState<TokenInfo>(COMMON_TOKENS[1])
  const [amount, setAmount] = useState("")
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true)
      const prices = await getTokenPrices(COMMON_TOKENS.map((token) => token.coingeckoId))
      setTokenPrices(prices)
      setIsLoading(false)
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update prices every minute

    return () => clearInterval(interval)
  }, [])

  const handleSwap = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const calculateToAmount = () => {
    if (!amount || isLoading) return "0"
    const fromPrice = tokenPrices[fromToken.coingeckoId] || 0
    const toPrice = tokenPrices[toToken.coingeckoId] || 0
    if (fromPrice === 0 || toPrice === 0) return "0"
    return ((Number(amount) * fromPrice) / toPrice).toFixed(6)
  }

  const handleExchange = () => {
    if (Number(amount) <= 0) {
      alert("Please enter a valid amount to exchange.")
      return
    }

    const fromAmount = Number(amount)
    const toAmount = Number(calculateToAmount())

    alert(`Exchange confirmed: ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`)
    setAmount("")
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/quantum-grid.svg')] opacity-5 animate-pulse-slow"></div>

      <div className="relative backdrop-blur-xl bg-[#0A0B1E]/90 rounded-xl p-8 border border-[#4A90E2]/20 shadow-lg hover:shadow-[#7A88FF]/20 transition-all duration-500">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] animate-pulse glow-text">
          Quantum Exchange
        </h2>
        <div className="space-y-6">
          <div className="bg-[#1A1B3E]/50 p-6 rounded-xl border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300 group quantum-border">
            <div className="flex justify-between mb-2">
              <span className="text-[#7A88FF]/80">You give</span>
              <span className="text-[#4A90E2]/80">Balance: {fromToken.symbol} 0.00</span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
            {!isLoading && (
              <div className="text-sm text-[#4A90E2]/80 mt-2">
                1 {fromToken.symbol} = ${tokenPrices[fromToken.coingeckoId]?.toFixed(2) || "0.00"}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="relative group p-3 rounded-full bg-gradient-to-r from-[#7A88FF]/10 to-[#4A90E2]/10 hover:from-[#7A88FF]/20 hover:to-[#4A90E2]/20 transition-all duration-300 animate-quantum-pulse"
            >
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
                value={calculateToAmount()}
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
            {!isLoading && (
              <div className="text-sm text-[#4A90E2]/80 mt-2">
                1 {toToken.symbol} = ${tokenPrices[toToken.coingeckoId]?.toFixed(2) || "0.00"}
              </div>
            )}
          </div>

          <div className="bg-[#1A1B3E]/50 p-6 rounded-xl space-y-3 border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300 quantum-border">
            <div className="flex justify-between">
              <span className="text-[#7A88FF]/60">Exchange Rate</span>
              <span className="text-[#4A90E2] animate-quantum-flicker">
                1 {fromToken.symbol} ={" "}
                {isLoading
                  ? "..."
                  : ((tokenPrices[fromToken.coingeckoId] || 0) / (tokenPrices[toToken.coingeckoId] || 1)).toFixed(
                      6,
                    )}{" "}
                {toToken.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A88FF]/60">Network Fee</span>
              <span className="text-[#4A90E2]">~$5.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A88FF]/60">Price Impact</span>
              <span className="text-green-400 animate-quantum-flicker">{"<"}0.01%</span>
            </div>
          </div>

          <button
            onClick={handleExchange}
            className="relative w-full py-4 rounded-xl font-medium group overflow-hidden quantum-button"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-[url('/quantum-particles.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative text-white group-hover:scale-105 transform transition-transform duration-300">
              Quantum Exchange
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

