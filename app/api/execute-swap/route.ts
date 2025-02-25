import { NextResponse } from "next/server"
import { executeSwap } from "@/lib/swap"

export async function POST(request: Request) {
  try {
    const { fromToken, toToken, amount } = await request.json()
    const result = await executeSwap(fromToken, toToken, amount)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing swap:", error)
    return NextResponse.json({ error: "Failed to execute swap" }, { status: 500 })
  }
}

