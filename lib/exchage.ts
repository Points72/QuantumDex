import { createHmac } from "@/utils/crypto"

export interface ExchangeCredentials {
  apiKey: string
  apiSecret: string
  passphrase?: string
}

export interface OrderParams {
  symbol: string
  side: "buy" | "sell"
  type: "limit" | "market"
  quantity: number
  price?: number
}

export interface OrderBookEntry {
  price: number
  amount: number
}

export interface OrderBookResponse {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

export abstract class Exchange {
  protected credentials: ExchangeCredentials
  name: string
  exchange: string

  constructor(credentials: ExchangeCredentials, name: string, exchange: string) {
    this.credentials = credentials
    this.name = name
    this.exchange = exchange
  }

  abstract createOrder(params: OrderParams): Promise<unknown>
  abstract getBalance(asset: string): Promise<number>
  abstract getOrderBook(symbol: string): Promise<OrderBookResponse>
  protected abstract makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown>
  protected abstract generateSignature(params: Record<string, string | number>): Promise<string>
}

class BingxAPI extends Exchange {
  private readonly BASE_URL = "https://api.bingx.com"

  protected async makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    const timestamp = Date.now().toString()
    const queryParams = { ...params, timestamp }
    const signature = await this.generateSignature(queryParams)

    const url = new URL(`${this.BASE_URL}${endpoint}`)
    url.search = new URLSearchParams({
      ...queryParams,
      signature,
    }).toString()

    const response = await fetch(url.toString(), {
      headers: new Headers({
        "X-MBX-APIKEY": this.credentials.apiKey,
      }),
    })

    if (!response.ok) {
      throw new Error(`Bingx API error: ${response.statusText}`)
    }

    return response.json()
  }

  protected async generateSignature(params: Record<string, string | number>): Promise<string> {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString()

    const hmac = await createHmac("sha256", this.credentials.apiSecret)
    return hmac.update(queryString).digest("hex")
  }

  // Rest of BingxAPI implementation remains the same
}

class BybitAPI extends Exchange {
  private readonly BASE_URL = "https://api.bybit.com"

  protected async makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    const timestamp = Date.now().toString()
    const signature = await this.generateSignature({ ...params, timestamp })

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: new Headers({
        "api-key": this.credentials.apiKey,
        "api-signature": signature,
        "api-timestamp": timestamp,
      }),
    })

    if (!response.ok) {
      throw new Error(`Bybit API error: ${response.statusText}`)
    }

    return response.json()
  }

  protected async generateSignature(params: Record<string, string | number>): Promise<string> {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString()

    const hmac = await createHmac("sha256", this.credentials.apiSecret)
    return hmac.update(queryString).digest("hex")
  }

  // Rest of BybitAPI implementation remains the same
}

// Similar updates for MEXCAPI, KuCoinAPI, and OKXAPI classes...
// Just update the generateSignature method to be async and await the createHmac calls

export function createExchangeAPI(exchange: string, credentials: ExchangeCredentials): Exchange {
  switch (exchange.toLowerCase()) {
    case "bingx":
      return new BingxAPI(credentials, "Bingx", "bingx")
    case "bybit":
      return new BybitAPI(credentials, "Bybit", "bybit")
    case "mexc":
      return new MEXCAPI(credentials, "MEXC", "mexc")
    case "kucoin":
      return new KuCoinAPI(credentials, "KuCoin", "kucoin")
    case "okx":
      return new OKXAPI(credentials, "OKX", "okx")
    default:
      throw new Error(`Unsupported exchange: ${exchange}`)
  }
}

