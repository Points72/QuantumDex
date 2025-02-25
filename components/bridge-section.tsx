"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBridge } from "@/lib/hooks/use-bridge"
import { Loader2 } from "lucide-react"

const SUPPORTED_CHAINS = ["Ethereum", "BSC", "Polygon", "Avalanche", "Arbitrum"]
const SUPPORTED_TOKENS = ["ETH", "USDT", "USDC", "DAI"]

export function BridgeSection() {
  const [fromChain, setFromChain] = useState(SUPPORTED_CHAINS[0])
  const [toChain, setToChain] = useState(SUPPORTED_CHAINS[1])
  const [token, setToken] = useState(SUPPORTED_TOKENS[0])
  const [amount, setAmount] = useState("")
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null)

  const { transactions, isLoading, error, estimateFees, executeBridge } = useBridge()

  useEffect(() => {
    if (fromChain && toChain && amount) {
      estimateFees(fromChain, toChain, amount)
        .then(setEstimatedFee)
        .catch(() => setEstimatedFee(null))
    }
  }, [fromChain, toChain, amount, estimateFees]) // Added estimateFees to dependencies

  const handleBridge = async () => {
    try {
      await executeBridge(fromChain, toChain, token, amount)
      setAmount("")
    } catch (err) {
      console.error("Bridge execution failed:", err)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
          Quantum Bridge
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromChain">From Chain</Label>
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger id="fromChain" className="w-full bg-[#1A1B3E] border-[#4A90E2]/30">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain} value={chain}>
                      {chain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="toChain">To Chain</Label>
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger id="toChain" className="w-full bg-[#1A1B3E] border-[#4A90E2]/30">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain} value={chain}>
                      {chain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="token">Token</Label>
            <Select value={token} onValueChange={setToken}>
              <SelectTrigger id="token" className="w-full bg-[#1A1B3E] border-[#4A90E2]/30">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_TOKENS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-[#1A1B3E] border-[#4A90E2]/30"
              placeholder="Enter amount"
            />
          </div>
          {estimatedFee && (
            <div className="text-sm text-[#4A90E2]">
              Estimated fee: {estimatedFee} {fromChain}
            </div>
          )}
          <Button
            onClick={handleBridge}
            disabled={isLoading || !amount}
            className="w-full bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] hover:from-[#4A90E2] hover:to-[#7A88FF] text-white font-bold py-2 px-4 rounded transition-all duration-300"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Bridge"}
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0A0B1E] to-[#1A1B3E] backdrop-blur-xl rounded-xl p-6 border border-[#4A90E2]/30 shadow-lg">
        <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.txHash}
              className="bg-[#1A1B3E]/50 p-4 rounded-lg border border-[#4A90E2]/20 hover:border-[#7A88FF]/30 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {tx.fromChain} <ArrowRight className="inline-block mx-1 w-4 h-4" /> {tx.toChain}
                </span>
                <span
                  className={`text-sm ${
                    tx.status === "completed"
                      ? "text-green-500"
                      : tx.status === "failed"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>
                  {tx.amount} {tx.token}
                </span>
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4A90E2] hover:text-[#7A88FF] transition-colors duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

