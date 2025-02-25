import { COMMON_TOKENS } from "@/lib/tokens"

interface PoolData {
  id: number
  pair: string
  tvl: number
  tvlChange: number
  volume24h: number
  volumeChange: number
  fees24h: number
  balances: {
    token1: { symbol: string; amount: number }
    token2: { symbol: string; amount: number }
  }
  version: string
  feeTier: string
}

interface PoolStats {
  tvl: number
  tvlChange: number
  volume24h: number
  volumeChange: number
  fees24h: number
}

export async function fetchPoolData(poolId: number | string): Promise<PoolData> {
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const token1 = COMMON_TOKENS[0]
    const token2 = COMMON_TOKENS[1]

    return {
      id: Number(poolId),
      pair: `${token1.symbol}/${token2.symbol}`,
      tvl: 203300000,
      tvlChange: 1.0,
      volume24h: 172300000,
      volumeChange: -47.74,
      fees24h: 86100,
      balances: {
        token1: { symbol: token1.symbol, amount: 68000000 },
        token2: { symbol: token2.symbol, amount: 48700 },
      },
      version: "v3",
      feeTier: "0.05%",
    }
  } catch (error) {
    console.error("Error fetching pool data:", error)
    throw error
  }
}

export async function fetchPoolStats(poolId: number | string): Promise<PoolStats> {
  try {
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      tvl: 203300000,
      tvlChange: 1.0,
      volume24h: 172300000,
      volumeChange: -47.74,
      fees24h: 86100,
    }
  } catch (error) {
    console.error("Error fetching pool stats:", error)
    throw error
  }
}

