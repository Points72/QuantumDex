import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Here would be the actual logic for fetching transfer history
    // For now, we'll return mock data

    const mockTransactions = [
      {
        id: "1",
        method: "crypto",
        amount: "0.5",
        currency: "BTC",
        recipient: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
        status: "completed",
        timestamp: new Date("2024-01-30T14:22:00"),
      },
      {
        id: "2",
        method: "bank",
        amount: "1000",
        currency: "USD",
        recipient: "JP Morgan Chase - 1234567890",
        status: "pending",
        timestamp: new Date("2024-01-30T14:20:00"),
      },
    ]

    return NextResponse.json(mockTransactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

