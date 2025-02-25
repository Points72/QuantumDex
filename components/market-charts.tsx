"use client"

import { useEffect, useRef } from "react"
import { createChart, type IChartApi, type CandlestickSeriesOptions, type CandlestickData } from "lightweight-charts"

interface ChartProps {
  symbol: string
  interval?: string
}

export function MarketChart({ symbol, interval = "1D" }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (chartContainerRef.current) {
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
        }
      }

      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: "solid", color: "rgba(10, 11, 30, 0.0)" },
          textColor: "#d1d5db",
        },
        grid: {
          vertLines: { color: "rgba(74, 144, 226, 0.1)" },
          horzLines: { color: "rgba(74, 144, 226, 0.1)" },
        },
        crosshair: {
          mode: 1,
        },
      })

      const candlestickSeries = chartRef.current.addCandlestickSeries({
        upColor: "#4A90E2",
        downColor: "#7A88FF",
        borderVisible: false,
        wickUpColor: "#4A90E2",
        wickDownColor: "#7A88FF",
      } as CandlestickSeriesOptions)

      const data = generateTestData(symbol)
      candlestickSeries.setData(data)

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
        }
      }
    }
  }, [symbol])

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('/quantum-grid.svg')] opacity-5" />
      <div ref={chartContainerRef} className="relative z-10" />
    </div>
  )
}

function generateTestData(symbol: string): CandlestickData[] {
  const currentDate = new Date()
  const data: CandlestickData[] = []
  let basePrice = symbol.includes("BTC") ? 45000 : symbol.includes("ETH") ? 2300 : 100

  for (let i = 100; i > 0; i--) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - i)

    const volatility = basePrice * 0.02
    const open = basePrice + (Math.random() - 0.5) * volatility
    const high = open + Math.random() * volatility
    const low = open - Math.random() * volatility
    const close = (high + low) / 2 + (Math.random() - 0.5) * volatility

    basePrice = close

    data.push({
      time: (date.getTime() / 1000) as any,
      open,
      high,
      low,
      close,
    })
  }

  return data
}

