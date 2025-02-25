"use client"

import { useState, useEffect } from "react"
import { priceAdapter } from "../price-adapter"
import type { PriceHistory } from "../price-adapter"

interface UsePriceAdaptationProps {
  fromToken: string
  toToken: string
  amount: string
  side: "buy" | "sell"
}

interface PriceAdaptationResult {
  executionPrice: number
  priceImpact: number
  slippage: number
  fromTokenHistory: PriceHistory
  toTokenHistory: PriceHistory
  isLoading: boolean
}

export function usePriceAdaptation({
  fromToken,
  toToken,
  amount,
  side,
}: UsePriceAdaptationProps): PriceAdaptationResult {
  const [result, setResult] = useState<PriceAdaptationResult>({
    executionPrice: 0,
    priceImpact: 0,
    slippage: 0,
    fromTokenHistory: {
      prices: [],
      average24h: 0,
      change24h: 0,
      volatility24h: 0,
    },
    toTokenHistory: {
      prices: [],
      average24h: 0,
      change24h: 0,
      volatility24h: 0,
    },
    isLoading: true,
  })

  useEffect(() => {
    let isMounted = true

    const updatePrices = async () => {
      try {
        // Simulate price updates from external source
        const mockFromPrice = Math.random() * 1000 + 1000
        const mockToPrice = Math.random() * 100 + 100

        await priceAdapter.updatePrice(fromToken, mockFromPrice)
        await priceAdapter.updatePrice(toToken, mockToPrice)

        if (!isMounted) return

        const fromTokenHistory = priceAdapter.getPriceHistory(fromToken)
        const toTokenHistory = priceAdapter.getPriceHistory(toToken)
        const slippage = Math.max(priceAdapter.getOptimalSlippage(fromToken), priceAdapter.getOptimalSlippage(toToken))

        const executionPrice = priceAdapter.getOptimalExecutionPrice(fromToken, toToken, Number(amount) || 0, side)

        const priceImpact = Math.abs(
          ((executionPrice - fromTokenHistory.average24h / toTokenHistory.average24h) /
            (fromTokenHistory.average24h / toTokenHistory.average24h)) *
            100,
        )

        setResult({
          executionPrice,
          priceImpact,
          slippage,
          fromTokenHistory,
          toTokenHistory,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error updating prices:", error)
      }
    }

    updatePrices()
    const interval = setInterval(updatePrices, 15000) // Update every 15 seconds

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [fromToken, toToken, amount, side])

  return result
}

