"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface Token {
  symbol: string
  name: string
  logo: string
}

interface TokenSelectorProps {
  onSelect: (token: Token) => void
}

const mockTokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", logo: "/eth-logo.png" },
  { symbol: "BTC", name: "Bitcoin", logo: "/btc-logo.png" },
  { symbol: "USDT", name: "Tether", logo: "/usdt-logo.png" },
  { symbol: "USDC", name: "USD Coin", logo: "/usdc-logo.png" },
  { symbol: "DAI", name: "Dai", logo: "/dai-logo.png" },
]

export function TokenSelector({ onSelect }: TokenSelectorProps) {
  const [search, setSearch] = useState("")
  const [filteredTokens, setFilteredTokens] = useState(mockTokens)

  useEffect(() => {
    const filtered = mockTokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) ||
        token.name.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredTokens(filtered)
  }, [search])

  return (
    <div className="w-full">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search tokens"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-700 text-white p-2 pl-8 rounded-md"
        />
        <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
      </div>
      <div className="max-h-60 overflow-y-auto">
        {filteredTokens.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center p-2 hover:bg-slate-700 cursor-pointer rounded-md"
            onClick={() => onSelect(token)}
          >
            <img src={token.logo || "/placeholder.svg"} alt={token.name} className="w-6 h-6 mr-2" />
            <span className="font-medium">{token.symbol}</span>
            <span className="text-gray-400 ml-2">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

