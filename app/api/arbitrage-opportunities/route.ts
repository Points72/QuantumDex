import { NextResponse } from "next/server"
import { getArbitrageOpportunities } from "@/lib/arbitrage"

export async function GET() {
  try {
    const opportunities = await getArbitrageOpportunities()
    return NextResponse.json(opportunities)
  } catch (error) {
    console.error("Error fetching arbitrage opportunities:", error)
    return NextResponse.json({ error: "Failed to fetch arbitrage opportunities" }, { status: 500 })
  }
}

