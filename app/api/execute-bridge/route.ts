import { NextResponse } from "next/server"
import { executeBridge } from "@/lib/bridge"

export async function POST(request: Request) {
  try {
    const { fromChain, toChain, token, amount } = await request.json()
    const result = await executeBridge(fromChain, toChain, token, amount)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing bridge:", error)
    return NextResponse.json({ error: "Failed to execute bridge" }, { status: 500 })
  }
}

