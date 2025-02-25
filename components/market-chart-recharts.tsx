"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartProps {
  symbol: string
  interval?: string
}

export function MarketChartRecharts({ symbol, interval = "1D" }: ChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Генерация тестовых данных
    const generateData = () => {
      const currentDate = new Date()
      const result = []
      let basePrice = symbol.includes("BTC") ? 45000 : symbol.includes("ETH") ? 2300 : 100

      for (let i = 30; i > 0; i--) {
        const date = new Date(currentDate)
        date.setDate(date.getDate() - i)

        const volatility = basePrice * 0.02
        const price = basePrice + (Math.random() - 0.5) * volatility

        basePrice = price

        result.push({
          date: date.toLocaleDateString(),
          price: price.toFixed(2),
        })
      }

      return result
    }

    setData(generateData())
  }, [symbol])

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.1)" />
          <XAxis dataKey="date" stroke="#d1d5db" />
          <YAxis stroke="#d1d5db" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10, 11, 30, 0.8)",
              border: "1px solid #4A90E2",
              borderRadius: "8px",
              color: "#d1d5db",
            }}
          />
          <Area type="monotone" dataKey="price" stroke="#4A90E2" fill="url(#colorPrice)" fillOpacity={0.3} />
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

