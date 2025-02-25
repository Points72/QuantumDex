import { NextResponse } from "next/server"
import { executePerpTrade } from "@/lib/perpetual"

export async function POST(request: Request) {
  try {
    const { market, position, leverage, amount } = await request.json()
    const result = await executePerpTrade(market, position, leverage, amount)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing perpetual trade:", error)
    return NextResponse.json({ error: "Failed to execute perpetual trade" }, { status: 500 })
  }
}

