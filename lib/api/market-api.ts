import type { TokenMarketData, MarketChartData } from "../types/market"

export async function fetchMarketData(): Promise<TokenMarketData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/market-data`)
    if (!response.ok) {
      throw new Error("Failed to fetch market data")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching market data:", error)
    // Return mock data in case of error
    return [
      {
        rank: 1,
        symbol: "ETH",
        name: "Ethereum",
        price: 2587.88,
        priceChange1h: -0.2,
        priceChange24h: -3.74,
        fdv: 7.7e9,
        volume: 1.0e9,
        chartData: generateMockChartData(24),
      },
      {
        rank: 2,
        symbol: "USDC",
        name: "USD Coin",
        price: 1.0,
        priceChange1h: 0.0,
        priceChange24h: 0.0,
        fdv: 56.0e9,
        volume: 567.0e6,
        chartData: generateMockChartData(24),
      },
      // Add more mock data as needed
    ]
  }
}

export async function fetchHistoricalData(symbol: string, days = 365): Promise<MarketChartData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/historical/${symbol}?days=${days}`)
    if (!response.ok) {
      throw new Error("Failed to fetch historical data")
    }
    return response.json()
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return generateMockHistoricalData(days)
  }
}

function generateMockChartData(points: number): number[] {
  return Array.from({ length: points }, () => Math.random())
}

function generateMockHistoricalData(days: number): MarketChartData[] {
  const now = Date.now()
  const data: MarketChartData[] = []

  for (let i = 0; i < days; i++) {
    data.push({
      timestamp: now - i * 24 * 60 * 60 * 1000,
      value: 2000 + Math.random() * 1000,
    })
  }

  return data.reverse()
}

