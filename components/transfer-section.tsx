"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Info, ArrowRight, Clock, Wallet, Building2, CreditCard, Send, Zap, Shield, Globe } from "lucide-react"

export function TransferSection() {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTransfer = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const transferMethods = [
    { id: "bank", name: "Bank", icon: Building2, color: "from-[#7A88FF] to-[#4A90E2]" },
    { id: "card", name: "Card", icon: CreditCard, color: "from-[#7A88FF] to-[#4A90E2]" },
    { id: "crypto", name: "Crypto", icon: Wallet, color: "from-[#7A88FF] to-[#4A90E2]" },
    { id: "paypal", name: "PayPal", icon: Send, color: "from-[#7A88FF] to-[#4A90E2]" },
  ]

  const recentTransactions = [
    {
      type: "Bank",
      amount: "1,000 USD",
      recipient: "0x1234...5678",
      status: "Completed",
      time: "2m ago",
      icon: Building2,
    },
    {
      type: "Crypto",
      amount: "500 EUR",
      recipient: "john@mail.com",
      status: "Pending",
      time: "15m ago",
      icon: Wallet,
    },
    {
      type: "PayPal",
      amount: "250 GBP",
      recipient: "0xabcd...efgh",
      status: "Failed",
      time: "1h ago",
      icon: Send,
    },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Failed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center space-y-6 mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Shield className="w-12 h-12 text-[#7A88FF]" />
          <Zap className="w-8 h-8 text-[#4A90E2] animate-pulse" />
          <Globe className="w-12 h-12 text-[#7A88FF]" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] bg-clip-text text-transparent">
          Quantum Transfer Hub
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Experience seamless cross-chain transfers with quantum-grade security
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Badge className="bg-[#7A88FF]/10 text-[#7A88FF] border-[#7A88FF]/20 px-4 py-1">Quantum Encrypted</Badge>
          <Badge className="bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20 px-4 py-1">Multi-Chain</Badge>
          <Badge className="bg-[#7A88FF]/10 text-[#7A88FF] border-[#7A88FF]/20 px-4 py-1">Lightning Fast</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-[#0A0B1E]/70 backdrop-blur-xl border-[#4A90E2]/30 shadow-lg">
          <Tabs defaultValue="standard" className="space-y-6">
            <TabsList className="w-full grid grid-cols-2 bg-[#1A1B3E] p-1 rounded-xl">
              <TabsTrigger
                value="standard"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7A88FF] data-[state=active]:to-[#4A90E2]"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger
                value="express"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7A88FF] data-[state=active]:to-[#4A90E2]"
              >
                Express
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {transferMethods.map(({ id, name, icon: Icon, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedMethod(id)}
                    className={`
                      p-6 rounded-xl border transition-all duration-300
                      ${
                        selectedMethod === id
                          ? `bg-gradient-to-br ${color} bg-opacity-10 border-transparent`
                          : "border-[#4A90E2]/30 hover:border-[#7A88FF]/50"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Icon size={28} className={selectedMethod === id ? "text-[#4FFBDF]" : "text-[#4FFBDF]/60"} />
                      <span className="font-medium text-[#4FFBDF]">{name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7A88FF]">Amount</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-[#1A1B3E] border-[#4A90E2]/30 focus:border-[#7A88FF] text-[#7A88FF] placeholder-[#4FFBDF]/40"
                    />
                    <Select>
                      <SelectTrigger className="bg-[#1A1B3E] border-[#4A90E2]/30">
                        <SelectValue placeholder="USD" className="text-[#7A88FF]" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0B1E] border-[#4A90E2]/30">
                        <SelectItem value="usd" className="text-[#7A88FF]">
                          USD
                        </SelectItem>
                        <SelectItem value="eur" className="text-[#7A88FF]">
                          EUR
                        </SelectItem>
                        <SelectItem value="gbp" className="text-[#7A88FF]">
                          GBP
                        </SelectItem>
                        <SelectItem value="amd" className="text-[#7A88FF]">
                          AMD
                        </SelectItem>
                        <SelectItem value="gel" className="text-[#7A88FF]">
                          GEL
                        </SelectItem>
                        <SelectItem value="rub" className="text-[#7A88FF]">
                          RUB
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1B3E] border border-[#4A90E2]/30">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4FFBDF]/60">Estimated Fee</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          <span className="font-medium text-[#4FFBDF]">${(Number(amount || 0) * 0.01).toFixed(2)}</span>
                          <Info size={14} className="text-[#4A90E2]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>1% transfer fee</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <Button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] hover:from-[#4A90E2] hover:to-[#7A88FF]"
                >
                  {loading ? (
                    <div className="animate-spin">
                      <Clock size={20} />
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Initiate Transfer <ArrowRight size={18} />
                    </span>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="express" className="space-y-8">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {["100", "500", "1000"].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount)}
                      className="p-4 rounded-xl border border-[#4A90E2]/20 hover:bg-[#7A88FF]/10 transition-all"
                    >
                      <div className="text-[#7A88FF]">${quickAmount}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#7A88FF] to-[#4A90E2] hover:from-[#4A90E2] hover:to-[#7A88FF]"
              >
                {loading ? (
                  <div className="animate-spin">
                    <Clock size={20} />
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    Express Transfer <Zap size={18} />
                  </span>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="p-6 bg-[#0A0B1E]/70 backdrop-blur-xl border-[#4A90E2]/30 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#7A88FF]">Recent Transfers</h2>
            <Badge className="bg-[#4A90E2]/10 text-[#4A90E2] border-[#4A90E2]/20">Last 24h</Badge>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((tx, i) => {
              const statusStyle = getStatusStyle(tx.status)
              const IconComponent = tx.icon

              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#1A1B3E] border border-[#4A90E2]/30 hover:border-[#7A88FF]/50 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${statusStyle.split(" ")[0]}`}>
                        <IconComponent size={20} className={statusStyle.split(" ")[1]} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-lg text-[#7A88FF]">{tx.amount}</span>
                          <span className="text-sm text-[#4FFBDF]/60">via {tx.type}</span>
                        </div>
                        <div className="text-sm text-[#4FFBDF]/60">{tx.recipient}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusStyle}>{tx.status}</Badge>
                      <div className="text-xs text-[#4FFBDF]/60 mt-2">{tx.time}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

