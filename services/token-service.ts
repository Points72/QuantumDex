import { alchemy } from "@/lib/alchemy"

export interface TokenInfo {
  symbol: string
  name: string
  decimals: number
  address: string
  logoUrl?: string
}

export const tokenService = {
  async getTopTokens(): Promise<TokenInfo[]> {
    try {
      const response = await fetch("https://tokens.coingecko.com/uniswap/all.json")
      const data = await response.json()
      return data.tokens.slice(0, 100).map((token: any) => ({
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        address: token.address,
        logoUrl: token.logoURI,
      }))
    } catch (error) {
      console.error("Error fetching tokens:", error)
      return []
    }
  },

  async getTokenBalance(address: string, tokenAddress: string): Promise<string> {
    try {
      const balance = await alchemy.core.getTokenBalance(address, tokenAddress)
      return balance.toString()
    } catch (error) {
      console.error("Error fetching token balance:", error)
      return "0"
    }
  },

  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      // In a real implementation, you would fetch the actual price from an oracle or API
      // This is just a placeholder that returns a random price
      return Math.random() * 1000
    } catch (error) {
      console.error("Error fetching token price:", error)
      return 0
    }
  },
}

