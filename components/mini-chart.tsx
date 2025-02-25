"use client"

import { useEffect, useRef } from "react"

interface MiniChartProps {
  data: number[]
  color: string
  height?: number
  width?: number
}

export function MiniChart({ data, color, height = 40, width = 120 }: MiniChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Calculate step size
    const step = width / (data.length - 1)

    // Find min and max values
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5

    data.forEach((value, i) => {
      const x = i * step
      const y = height - ((value - min) / range) * height
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, `${color}20`)
    gradient.addColorStop(1, `${color}00`)

    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.fillStyle = gradient
    ctx.fill()
  }, [data, color, height, width])

  return <canvas ref={canvasRef} className="w-[120px] h-[40px]" />
}

