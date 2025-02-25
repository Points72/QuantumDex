import type { ExchangeInterface } from "./exchange-interface"
import { MEXCService } from "./cex/mexc-service"
import { OkxService } from "./cex/okx-service"
import { BybitService } from "./cex/bybit-service"
import { KucoinService } from "./cex/kucoin-service"
import { BingXService } from "./cex/bingx-service"
import { JupiterService } from "./dex/jupiter-service"
import { RaydiumService } from "./dex/raydium-service"
import type { Connection } from "@solana/web3.js"

export class UnifiedExchangeService {
  private cexServices: { [key: string]: ExchangeInterface }
  private dexServices: { [key: string]: JupiterService | RaydiumService }

  constructor(connection: Connection) {
    this.cexServices = {
      mexc: new MEXCService(process.env.NEXT_PUBLIC_MEXC_API_KEY!, process.env.NEXT_PUBLIC_MEXC_API_SECRET!),
      okx: new OkxService({
        apiKey: process.env.NEXT_PUBLIC_OKX_API_KEY!,
        secretKey: process.env.NEXT_PUBLIC_OKX_API_SECRET!,
        passphrase: process.env.NEXT_PUBLIC_OKX_API_PHRASE!,
      }),
      bybit: new BybitService({
        apiKey: process.env.NEXT_PUBLIC_BYBIT_API_KEY!,
        secretKey: process.env.NEXT_PUBLIC_BYBIT_API_SECRET!,
      }),
      kucoin: new KucoinService(),
      bingx: new BingXService({
        apiKey: process.env.NEXT_PUBLIC_BINGX_API_KEY!,
        secretKey: process.env.NEXT_PUBLIC_BINGX_API_SECRET!,
      }),
    }

    this.dexServices = {
      jupiter: new JupiterService(connection),
      raydium: new RaydiumService(connection),
    }
  }

  async initialize() {
    await this.dexServices.jupiter.initialize()
  }

  async getPrice(exchange: string, symbol: string): Promise<number> {
    if (this.cexServices[exchange]) {
      return this.cexServices[exchange].getPrice(symbol)
    } else if (this.dexServices[exchange]) {
      // For DEX, we need to implement a different method to get price
      throw new Error("Not implemented for DEX")
    } else {
      throw new Error(`Unsupported exchange: ${exchange}`)
    }
  }

  async executeTrade(
    exchange: string,
    params: {
      symbol: string
      side: "BUY" | "SELL"
      type: "LIMIT" | "MARKET"
      quantity: number
      price?: number
    },
  ): Promise<string> {
    if (this.cexServices[exchange]) {
      return this.cexServices[exchange].executeTrade(params)
    } else if (this.dexServices[exchange]) {
      // For DEX, we need to implement a different method to execute trade
      throw new Error("Not implemented for DEX")
    } else {
      throw new Error(`Unsupported exchange: ${exchange}`)
    }
  }

  async getAccountBalance(exchange: string): Promise<{ asset: string; free: number; locked: number }[]> {
    if (this.cexServices[exchange]) {
      return this.cexServices[exchange].getAccountBalance()
    } else if (this.dexServices[exchange]) {
      // For DEX, we need to implement a different method to get account balance
      throw new Error("Not implemented for DEX")
    } else {
      throw new Error(`Unsupported exchange: ${exchange}`)
    }
  }

  async getOrderBook(
    exchange: string,
    symbol: string,
  ): Promise<{ bids: [number, number][]; asks: [number, number][] }> {
    if (this.cexServices[exchange]) {
      return this.cexServices[exchange].getOrderBook(symbol)
    } else if (this.dexServices[exchange]) {
      // For DEX, we need to implement a different method to get order book
      throw new Error("Not implemented for DEX")
    } else {
      throw new Error(`Unsupported exchange: ${exchange}`)
    }
  }

  async getDexQuote(dex: "jupiter" | "raydium", inputMint: string, outputMint: string, amount: number) {
    if (dex === "jupiter") {
      return this.dexServices.jupiter.getQuote(inputMint, outputMint, amount)
    } else if (dex === "raydium") {
      return this.dexServices.raydium.getQuote(inputMint, outputMint, amount)
    } else {
      throw new Error(`Unsupported DEX: ${dex}`)
    }
  }

  async executeDexSwap(dex: "jupiter" | "raydium", route: any, wallet: any) {
    if (dex === "jupiter") {
      return this.dexServices.jupiter.executeSwap(route, wallet)
    } else if (dex === "raydium") {
      return this.dexServices.raydium.executeSwap(route, wallet)
    } else {
      throw new Error(`Unsupported DEX: ${dex}`)
    }
  }
}

