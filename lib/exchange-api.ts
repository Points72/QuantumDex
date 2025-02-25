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

  async createOrder(params: OrderParams): Promise<unknown> {
    return this.makeRequest("/api/v3/order", {
      symbol: params.symbol,
      side: params.side.toUpperCase(),
      type: params.type.toUpperCase(),
      quantity: params.quantity,
      ...(params.price && { price: params.price }),
    })
  }

  async getBalance(asset: string): Promise<number> {
    const response = (await this.makeRequest("/api/v3/account", {})) as {
      balances: Array<{ asset: string; free: string }>
    }
    const balance = response.balances.find((b) => b.asset === asset)
    return balance ? Number.parseFloat(balance.free) : 0
  }

  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    const response = (await this.makeRequest("/api/v3/depth", {
      symbol,
      limit: 20,
    })) as {
      bids: [string, string][]
      asks: [string, string][]
    }

    return {
      bids: response.bids.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
      asks: response.asks.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
    }
  }
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

  async createOrder(params: OrderParams): Promise<unknown> {
    return this.makeRequest("/v2/private/order/create", {
      symbol: params.symbol,
      side: params.side.toUpperCase(),
      order_type: params.type.toUpperCase(),
      qty: params.quantity,
      ...(params.price && { price: params.price }),
    })
  }

  async getBalance(asset: string): Promise<number> {
    const response = (await this.makeRequest("/v2/private/wallet/balance", {
      coin: asset,
    })) as { result: { [key: string]: { available_balance: string } } }
    return Number.parseFloat(response.result[asset]?.available_balance || "0")
  }

  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    const response = (await this.makeRequest("/v2/public/orderBook/L2", {
      symbol,
    })) as { result: Array<{ price: string; size: string; side: string }> }

    const orders = response.result
    return {
      bids: orders
        .filter((order) => order.side === "Buy")
        .map((order) => ({
          price: Number.parseFloat(order.price),
          amount: Number.parseFloat(order.size),
        })),
      asks: orders
        .filter((order) => order.side === "Sell")
        .map((order) => ({
          price: Number.parseFloat(order.price),
          amount: Number.parseFloat(order.size),
        })),
    }
  }
}

class MEXCAPI extends Exchange {
  private readonly BASE_URL = "https://api.mexc.com"

  protected async makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    const timestamp = Date.now().toString()
    const signature = await this.generateSignature({ ...params, timestamp })

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: new Headers({
        "X-MEXC-APIKEY": this.credentials.apiKey,
        "X-MEXC-SIGNATURE": signature,
        "X-MEXC-TIMESTAMP": timestamp,
      }),
    })

    if (!response.ok) {
      throw new Error(`MEXC API error: ${response.statusText}`)
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

  async createOrder(params: OrderParams): Promise<unknown> {
    return this.makeRequest("/api/v3/order", {
      symbol: params.symbol,
      side: params.side.toUpperCase(),
      type: params.type.toUpperCase(),
      quantity: params.quantity,
      ...(params.price && { price: params.price }),
    })
  }

  async getBalance(asset: string): Promise<number> {
    const response = (await this.makeRequest("/api/v3/account", {})) as {
      balances: Array<{ asset: string; free: string }>
    }
    const balance = response.balances.find((b) => b.asset === asset)
    return balance ? Number.parseFloat(balance.free) : 0
  }

  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    const response = (await this.makeRequest("/api/v3/depth", {
      symbol,
      limit: 20,
    })) as {
      bids: [string, string][]
      asks: [string, string][]
    }

    return {
      bids: response.bids.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
      asks: response.asks.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
    }
  }
}

class KuCoinAPI extends Exchange {
  private readonly BASE_URL = "https://api.kucoin.com"

  protected async makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    const timestamp = Date.now().toString()
    const signature = await this.generateSignature({ ...params, timestamp })

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: new Headers({
        "KC-API-KEY": this.credentials.apiKey,
        "KC-API-SIGN": signature,
        "KC-API-TIMESTAMP": timestamp,
        "KC-API-PASSPHRASE": this.credentials.passphrase || "",
      }),
    })

    if (!response.ok) {
      throw new Error(`KuCoin API error: ${response.statusText}`)
    }

    return response.json()
  }

  protected async generateSignature(params: Record<string, string | number>): Promise<string> {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString()

    const hmac = await createHmac("sha256", this.credentials.apiSecret)
    return hmac.update(queryString).digest("base64")
  }

  async createOrder(params: OrderParams): Promise<unknown> {
    return this.makeRequest("/api/v1/orders", {
      symbol: params.symbol,
      side: params.side.toUpperCase(),
      type: params.type.toUpperCase(),
      size: params.quantity,
      ...(params.price && { price: params.price }),
    })
  }

  async getBalance(asset: string): Promise<number> {
    const response = (await this.makeRequest("/api/v1/accounts", {
      currency: asset,
      type: "trade",
    })) as { data: Array<{ currency: string; available: string }> }
    const balance = response.data.find((b) => b.currency === asset)
    return balance ? Number.parseFloat(balance.available) : 0
  }

  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    const response = (await this.makeRequest("/api/v1/market/orderbook/level2_20", {
      symbol,
    })) as {
      data: {
        bids: [string, string][]
        asks: [string, string][]
      }
    }

    return {
      bids: response.data.bids.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
      asks: response.data.asks.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
    }
  }
}

class OKXAPI extends Exchange {
  private readonly BASE_URL = "https://www.okx.com"

  protected async makeRequest(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    const timestamp = new Date().toISOString()
    const signature = await this.generateSignature({ ...params, timestamp })

    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: new Headers({
        "OK-ACCESS-KEY": this.credentials.apiKey,
        "OK-ACCESS-SIGN": signature,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": this.credentials.passphrase || "",
      }),
    })

    if (!response.ok) {
      throw new Error(`OKX API error: ${response.statusText}`)
    }

    return response.json()
  }

  protected async generateSignature(params: Record<string, string | number>): Promise<string> {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString()

    const hmac = await createHmac("sha256", this.credentials.apiSecret)
    return hmac.update(queryString).digest("base64")
  }

  async createOrder(params: OrderParams): Promise<unknown> {
    return this.makeRequest("/api/v5/trade/order", {
      instId: params.symbol.replace("/", "-"),
      tdMode: "cash",
      side: params.side.toLowerCase(),
      ordType: params.type.toLowerCase(),
      sz: params.quantity,
      ...(params.price && { px: params.price }),
    })
  }

  async getBalance(asset: string): Promise<number> {
    const response = (await this.makeRequest("/api/v5/account/balance", {
      ccy: asset,
    })) as {
      data: [
        {
          details: Array<{
            ccy: string
            availBal: string
          }>
        },
      ]
    }

    const balance = response.data[0].details.find((d) => d.ccy === asset)
    return balance ? Number.parseFloat(balance.availBal) : 0
  }

  async getOrderBook(symbol: string): Promise<OrderBookResponse> {
    const response = (await this.makeRequest("/api/v5/market/books", {
      instId: symbol.replace("/", "-"),
      sz: 20,
    })) as {
      data: [
        {
          bids: [string, string, string, string][]
          asks: [string, string, string, string][]
        },
      ]
    }

    return {
      bids: response.data[0].bids.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
      asks: response.data[0].asks.map(([price, amount]) => ({
        price: Number.parseFloat(price),
        amount: Number.parseFloat(amount),
      })),
    }
  }
}

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

