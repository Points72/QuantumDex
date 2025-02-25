export interface ExchangeInterface {
  getPrice(symbol: string): Promise<number>
  executeTrade(params: {
    symbol: string
    side: "BUY" | "SELL"
    type: "LIMIT" | "MARKET"
    quantity: number
    price?: number
  }): Promise<string>
  getAccountBalance(): Promise<{ asset: string; free: number; locked: number }[]>
  getOrderBook(symbol: string): Promise<{ bids: [number, number][]; asks: [number, number][] }>
}

