export interface PricePoint {
  timestamp: number
  price: number
}

export interface PriceHistory {
  prices: PricePoint[]
  average24h: number
  change24h: number
  volatility24h: number
}

export class PriceAdapter {
  private priceHistory: Map<string, PricePoint[]> = new Map()
  private readonly maxHistoryPoints = 1000

  constructor() {
    // Initialize with empty history
  }

  public async updatePrice(token: string, price: number): Promise<void> {
    const timestamp = Date.now()
    const history = this.priceHistory.get(token) || []

    history.push({ timestamp, price })

    // Maintain fixed size history
    if (history.length > this.maxHistoryPoints) {
      history.shift()
    }

    this.priceHistory.set(token, history)
  }

  public getPriceHistory(token: string, timeframeMs: number = 24 * 60 * 60 * 1000): PriceHistory {
    const history = this.priceHistory.get(token) || []
    const now = Date.now()
    const timeframePrices = history.filter((p) => p.timestamp > now - timeframeMs)

    if (timeframePrices.length === 0) {
      return {
        prices: [],
        average24h: 0,
        change24h: 0,
        volatility24h: 0,
      }
    }

    const prices = timeframePrices.map((p) => p.price)
    const average24h = prices.reduce((a, b) => a + b, 0) / prices.length
    const firstPrice = timeframePrices[0].price
    const lastPrice = timeframePrices[timeframePrices.length - 1].price
    const change24h = ((lastPrice - firstPrice) / firstPrice) * 100

    // Calculate volatility (standard deviation)
    const squaredDiffs = prices.map((p) => Math.pow(p - average24h, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length
    const volatility24h = Math.sqrt(variance)

    return {
      prices: timeframePrices,
      average24h,
      change24h,
      volatility24h,
    }
  }

  public getOptimalSlippage(token: string): number {
    const history = this.getPriceHistory(token)
    // Base slippage on volatility
    const baseSlippage = 0.5 // 0.5%
    const volatilityFactor = Math.min((history.volatility24h / history.average24h) * 100, 5)
    return baseSlippage + volatilityFactor
  }

  public getOptimalExecutionPrice(fromToken: string, toToken: string, amount: number, side: "buy" | "sell"): number {
    const fromHistory = this.getPriceHistory(fromToken)
    const toHistory = this.getPriceHistory(toToken)

    if (!fromHistory.average24h || !toHistory.average24h) {
      return 0
    }

    const basePrice = fromHistory.average24h / toHistory.average24h
    const slippage = Math.max(this.getOptimalSlippage(fromToken), this.getOptimalSlippage(toToken))

    // Adjust price based on side and amount
    const impactFactor = Math.min(amount / 10000, 0.1) // 0.1% max price impact per 10k units
    const priceImpact = side === "buy" ? 1 + impactFactor : 1 - impactFactor

    return basePrice * priceImpact * (1 + (side === "buy" ? slippage : -slippage) / 100)
  }
}

export const priceAdapter = new PriceAdapter()

