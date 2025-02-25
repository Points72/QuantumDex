"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType } from "lightweight-charts"

interface TokenPriceChartProps {
  data: { timestamp: number; price: number }[]
  height?: number
}

export function TokenPriceChart({ data, height = 300 }: TokenPriceChartProps) {
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
      height: height,
      grid: {
        vertLines: { color: "rgba(74, 144, 226, 0.1)" },
        horzLines: { color: "rgba(74, 144, 226, 0.1)" },
      },
      rightPriceScale: {
        borderColor: "rgba(74, 144, 226, 0.2)",
      },
      timeScale: {
        borderColor: "rgba(74, 144, 226, 0.2)",
        timeVisible: true,
      },
    })

    const areaSeries = chartRef.current.addAreaSeries({
      lineColor: "#7A88FF",
      topColor: "rgba(122, 136, 255, 0.3)",
      bottomColor: "rgba(122, 136, 255, 0.0)",
      lineWidth: 2,
    })

    const formattedData = data.map(({ timestamp, price }) => ({
      time: timestamp / 1000,
      value: price,
    }))

    areaSeries.setData(formattedData)

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [data, height])

  return <div ref={chartContainerRef} />
}

