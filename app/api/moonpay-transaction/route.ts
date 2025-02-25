import { NextResponse } from "next/server"
import { createMoonPayTransaction } from "@/lib/moonpay"

export async function POST(request: Request) {
  try {
    const { currency, amount } = await request.json()
    const result = await createMoonPayTransaction(currency, amount)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating MoonPay transaction:", error)
    return NextResponse.json({ error: "Failed to create MoonPay transaction" }, { status: 500 })
  }
}

