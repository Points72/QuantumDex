export interface TokenMarketData {
  rank: number
  symbol: string
  name: string
  price: number
  priceChange1h: number
  priceChange24h: number
  fdv: number
  volume: number
  chartData: number[]
}

export interface MarketChartData {
  timestamp: number
  value: number
}

