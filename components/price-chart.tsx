"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType } from "lightweight-charts"
import type { PriceHistory } from "@/lib/price-adapter"

interface PriceChartProps {
  priceHistory: PriceHistory
  height?: number
  color?: string
}

export function PriceChart({ priceHistory, height = 200, color = "#ff1cf7" }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#d1d5db",
      },
      width: chartContainerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { color: "rgba(74, 144, 226, 0.1)" },
        horzLines: { color: "rgba(74, 144, 226, 0.1)" },
      },
      crosshair: {
        mode: 1,
      },
    })

    const areaSeries = chartRef.current.addAreaSeries({
      lineColor: color,
      topColor: `${color}50`,
      bottomColor: `${color}10`,
      lineWidth: 2,
    })

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [height, color])

  useEffect(() => {
    if (!chartRef.current) return

    const series = chartRef.current.series()[0]
    if (!series) return

    const data = priceHistory.prices.map(({ timestamp, price }) => ({
      time: timestamp / 1000,
      value: price,
    }))

    series.setData(data)

    if (data.length > 0) {
      chartRef.current.timeScale().fitContent()
    }
  }, [priceHistory])

  return <div ref={chartContainerRef} />
}

