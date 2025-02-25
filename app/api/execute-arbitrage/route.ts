import { NextResponse } from "next/server"
import { executeArbitrageTrade } from "@/lib/arbitrage"

export async function POST(request: Request) {
  try {
    const opportunity = await request.json()
    const result = await executeArbitrageTrade(opportunity)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing arbitrage trade:", error)
    return NextResponse.json({ error: "Failed to execute arbitrage trade" }, { status: 500 })
  }
}

