"use client"

import { useEffect, useRef } from "react"

interface TradeChartProps {
  pair: string
}

export function TradeChart({ pair }: TradeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Здесь мы бы инициализировали настоящий график
      // Например, используя библиотеку TradingView
      chartRef.current.innerHTML = `<div class="text-center py-20">Trade Chart for ${pair}</div>`
    }
  }, [pair])

  return <div ref={chartRef} className="w-full h-96"></div>
}

